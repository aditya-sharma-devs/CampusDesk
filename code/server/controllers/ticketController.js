const Ticket = require('../models/Ticket');
const { extractBlockFromRoom } = require('../utils/blockUtils');

// Dynamic in-memory store for fallback (starts completely EMPTY - NO dummy tickets)
let memoryTickets = [];

// Helper to generate unique Ticket ID (e.g. THP-TKT-849201)
const generateTicketId = () => {
  const randomNum = Math.floor(100000 + Math.random() * 900000);
  return `THP-TKT-${randomNum}`;
};

// @desc    Raise a new classroom complaint ticket
// @route   POST /api/tickets
// @access  Private (Teacher, Org Head, Admin)
exports.createTicket = async (req, res) => {
  try {
    const { roomNumber, category, description } = req.body;

    if (!roomNumber || !description) {
      return res.status(400).json({
        success: false,
        message: 'Please provide classroom room number and issue description.'
      });
    }

    const cleanedRoom = roomNumber.trim().toUpperCase();
    const computedBlock = extractBlockFromRoom(cleanedRoom);
    const ticketId = generateTicketId();

    const reportedBy = {
      id: req.user.id || req.user._id,
      name: req.user.name || 'Faculty Member',
      email: req.user.email,
      role: req.user.role || 'TEACHER'
    };

    let newTicketObj = null;

    try {
      const ticket = await Ticket.create({
        ticketId,
        roomNumber: cleanedRoom,
        block: computedBlock,
        category: category || 'Projector & AV Display',
        description: description.trim(),
        reportedBy,
        status: 'PENDING'
      });

      newTicketObj = ticket.toObject ? ticket.toObject() : ticket;
    } catch (dbErr) {
      console.warn('⚠️ DB offline during ticket creation. Saving to in-memory store.');
      newTicketObj = {
        _id: 'mem_' + Date.now(),
        ticketId,
        roomNumber: cleanedRoom,
        block: computedBlock,
        category: category || 'Projector & AV Display',
        description: description.trim(),
        reportedBy,
        status: 'PENDING',
        createdAt: new Date().toISOString()
      };
    }

    // Keep memory store synchronized with newly raised ticket
    memoryTickets.unshift(newTicketObj);

    return res.status(201).json({
      success: true,
      message: 'Complaint ticket logged successfully.',
      data: newTicketObj
    });
  } catch (error) {
    console.error('Create ticket error:', error);
    return res.status(500).json({
      success: false,
      message: 'Failed to create complaint ticket.'
    });
  }
};

// @desc    Get all tickets (For Admin Review & Monitoring)
// @route   GET /api/tickets
// @access  Private
exports.getAllTickets = async (req, res) => {
  try {
    const { status, roomNumber } = req.query;
    let query = {};

    if (status && status !== 'ALL') query.status = status;
    if (roomNumber) query.roomNumber = roomNumber.toUpperCase();

    let tickets = [];
    try {
      tickets = await Ticket.find(query).sort({ createdAt: -1 }).lean();
    } catch (dbErr) {
      console.warn('⚠️ DB offline. Fetching from memory tickets store.');
      tickets = memoryTickets;
      if (status && status !== 'ALL') {
        tickets = tickets.filter(t => t.status === status);
      }
      if (roomNumber) {
        tickets = tickets.filter(t => t.roomNumber.toUpperCase() === roomNumber.toUpperCase());
      }
    }

    return res.status(200).json({
      success: true,
      count: tickets.length,
      data: tickets
    });
  } catch (error) {
    console.error('Get all tickets error:', error);
    return res.status(500).json({
      success: false,
      message: 'Failed to fetch complaint tickets.'
    });
  }
};

// @desc    Update ticket status (ADMIN ONLY)
// @route   PUT /api/tickets/:id/status
// @access  Private (Admin Only)
exports.updateTicketStatus = async (req, res) => {
  try {
    const { id } = req.params;
    const { status, adminNotes } = req.body;

    if (!['PENDING', 'UNDER_MAINTENANCE', 'RESOLVED'].includes(status)) {
      return res.status(400).json({
        success: false,
        message: 'Invalid status value. Must be PENDING, UNDER_MAINTENANCE, or RESOLVED.'
      });
    }

    let updatedTicket = null;

    try {
      let ticket = await Ticket.findById(id);
      if (!ticket) {
        ticket = await Ticket.findOne({ ticketId: id });
      }

      if (ticket) {
        ticket.status = status;
        if (adminNotes !== undefined) ticket.adminNotes = adminNotes;
        await ticket.save();
        updatedTicket = ticket.toObject ? ticket.toObject() : ticket;
      }
    } catch (dbErr) {
      console.warn('⚠️ DB offline during status update. Updating memory ticket store.');
    }

    // Sync memory store
    const memIndex = memoryTickets.findIndex(t => t._id === id || t.ticketId === id || String(t._id) === String(id));
    if (memIndex !== -1) {
      memoryTickets[memIndex].status = status;
      if (adminNotes !== undefined) memoryTickets[memIndex].adminNotes = adminNotes;
      if (!updatedTicket) updatedTicket = memoryTickets[memIndex];
    }

    if (!updatedTicket) {
      return res.status(404).json({
        success: false,
        message: 'Ticket not found.'
      });
    }

    return res.status(200).json({
      success: true,
      message: `Ticket status updated to ${status}.`,
      data: updatedTicket
    });
  } catch (error) {
    console.error('Update ticket status error:', error);
    return res.status(500).json({
      success: false,
      message: 'Failed to update ticket status.'
    });
  }
};

// Export helper to get unresolved tickets mapped by room number
exports.getUnresolvedTicketsMap = async () => {
  let unresolved = [];
  try {
    unresolved = await Ticket.find({ status: { $in: ['PENDING', 'UNDER_MAINTENANCE'] } }).lean();
  } catch (err) {
    unresolved = memoryTickets.filter(t => t.status === 'PENDING' || t.status === 'UNDER_MAINTENANCE');
  }

  // Fallback to memory store if DB returned empty but memory store has items
  if ((!unresolved || unresolved.length === 0) && memoryTickets.length > 0) {
    unresolved = memoryTickets.filter(t => t.status === 'PENDING' || t.status === 'UNDER_MAINTENANCE');
  }

  const map = {};
  if (unresolved && unresolved.length > 0) {
    unresolved.forEach(t => {
      const rm = t.roomNumber.toUpperCase();
      // Prioritize UNDER_MAINTENANCE over PENDING if room has multiple tickets
      if (!map[rm] || t.status === 'UNDER_MAINTENANCE') {
        map[rm] = t;
      }
    });
  }

  return map;
};
