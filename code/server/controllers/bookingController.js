const Booking = require('../models/Booking');
const TimetableEntry = require('../models/TimetableEntry');
const { extractBlockFromRoom } = require('../utils/blockUtils');
const { timeToMinutes } = require('../utils/timeUtils');
const { sampleTimetableEntries } = require('../data/sampleTimetable');

// In-memory fallback store
let memoryBookings = [];

// Helper to generate unique Booking ID (e.g. THP-BK-642190)
const generateBookingId = () => {
  const randomNum = Math.floor(100000 + Math.random() * 900000);
  return `THP-BK-${randomNum}`;
};

/**
 * Checks if two time intervals [startA, endA) and [startB, endB) overlap.
 */
const isOverlap = (startA, endA, startB, endB) => {
  const sA = timeToMinutes(startA);
  const eA = timeToMinutes(endA);
  const sB = timeToMinutes(startB);
  const eB = timeToMinutes(endB);

  if (sA < 0 || eA < 0 || sB < 0 || eB < 0) return false;
  return sA < eB && sB < eA;
};

// @desc    Apply for a classroom booking
// @route   POST /api/bookings
// @access  Private (Any authenticated user with @thapar.edu)
exports.createBooking = async (req, res) => {
  try {
    const { roomNumber, day, startTime, endTime, slot, description, category } = req.body;

    if (!roomNumber || !day || !startTime || !endTime || !description) {
      return res.status(400).json({
        success: false,
        message: 'Please provide room number, day, start time, end time, and booking description.'
      });
    }

    const startMins = timeToMinutes(startTime);
    const endMins = timeToMinutes(endTime);

    if (startMins >= endMins) {
      return res.status(400).json({
        success: false,
        message: 'Start time must be earlier than end time.'
      });
    }

    const cleanedRoom = roomNumber.trim().toUpperCase();
    const cleanedDay = day.trim();
    const computedBlock = extractBlockFromRoom(cleanedRoom);
    const bookingId = generateBookingId();

    // 1. Conflict check against regular timetable entries
    let timetableEntries = [];
    try {
      timetableEntries = await TimetableEntry.find({ 
        day: cleanedDay, 
        classroom: cleanedRoom 
      }).lean();
    } catch (err) {
      timetableEntries = sampleTimetableEntries.filter(
        e => e.day.toLowerCase() === cleanedDay.toLowerCase() && e.classroom.toUpperCase() === cleanedRoom
      );
    }

    if (!timetableEntries || timetableEntries.length === 0) {
      timetableEntries = sampleTimetableEntries.filter(
        e => e.day.toLowerCase() === cleanedDay.toLowerCase() && e.classroom.toUpperCase() === cleanedRoom
      );
    }

    const timetableConflict = timetableEntries.find(entry => {
      // Exclude Lab sessions if applicable, but check lecture collisions
      return isOverlap(startTime, endTime, entry.startTime, entry.endTime);
    });

    if (timetableConflict) {
      return res.status(409).json({
        success: false,
        message: `Classroom ${cleanedRoom} is occupied on ${cleanedDay} (${timetableConflict.startTime} - ${timetableConflict.endTime}) by ${timetableConflict.subject} (${timetableConflict.batch}). Booking request cannot be accepted for an occupied lecture hall.`
      });
    }

    // 2. Conflict check against already APPROVED bookings
    let existingBookings = [];
    try {
      existingBookings = await Booking.find({
        roomNumber: cleanedRoom,
        day: cleanedDay,
        status: 'APPROVED'
      }).lean();
    } catch (err) {
      existingBookings = memoryBookings.filter(
        b => b.roomNumber === cleanedRoom && b.day === cleanedDay && b.status === 'APPROVED'
      );
    }

    if (!existingBookings || existingBookings.length === 0) {
      existingBookings = memoryBookings.filter(
        b => b.roomNumber === cleanedRoom && b.day === cleanedDay && b.status === 'APPROVED'
      );
    }

    const approvedConflict = existingBookings.find(b => isOverlap(startTime, endTime, b.startTime, b.endTime));
    if (approvedConflict) {
      return res.status(409).json({
        success: false,
        message: `Classroom ${cleanedRoom} is already booked and approved on ${cleanedDay} (${approvedConflict.startTime} - ${approvedConflict.endTime}) for "${approvedConflict.description}".`
      });
    }

    // Requester info from auth token
    const requestedBy = {
      id: req.user.id || req.user._id,
      name: req.user.name || 'Faculty / Student Head',
      email: req.user.email,
      role: req.user.role || 'TEACHER',
      department: req.user.department || 'Computer Science & Engineering'
    };

    let newBookingObj = null;

    try {
      const booking = await Booking.create({
        bookingId,
        roomNumber: cleanedRoom,
        block: computedBlock,
        day: cleanedDay,
        startTime,
        endTime,
        slot: slot || `${startTime} - ${endTime}`,
        description: description.trim(),
        category: category || 'Guest Lecture',
        requestedBy,
        status: 'PENDING'
      });

      newBookingObj = booking.toObject ? booking.toObject() : booking;
    } catch (dbErr) {
      console.warn('⚠️ DB offline during booking creation. Saving to in-memory store.');
      newBookingObj = {
        _id: 'mem_bk_' + Date.now(),
        bookingId,
        roomNumber: cleanedRoom,
        block: computedBlock,
        day: cleanedDay,
        startTime,
        endTime,
        slot: slot || `${startTime} - ${endTime}`,
        description: description.trim(),
        category: category || 'Guest Lecture',
        requestedBy,
        status: 'PENDING',
        adminRemarks: '',
        createdAt: new Date().toISOString()
      };
    }

    // Sync memory store
    memoryBookings.unshift(newBookingObj);

    return res.status(201).json({
      success: true,
      message: 'Booking request submitted successfully. It has been sent to the Admin for approval.',
      data: newBookingObj
    });
  } catch (error) {
    console.error('Create booking error:', error);
    return res.status(500).json({
      success: false,
      message: 'Failed to submit classroom booking request.'
    });
  }
};

// @desc    Get all booking requests (For Admin & Global Directory)
// @route   GET /api/bookings
// @access  Private
exports.getAllBookings = async (req, res) => {
  try {
    const { status, roomNumber, day } = req.query;
    let query = {};

    if (status && status !== 'ALL') query.status = status;
    if (roomNumber) query.roomNumber = roomNumber.toUpperCase();
    if (day) query.day = day;

    let bookings = [];
    try {
      bookings = await Booking.find(query).sort({ createdAt: -1 }).lean();
    } catch (dbErr) {
      console.warn('⚠️ DB offline. Fetching from memory bookings store.');
      bookings = memoryBookings;
      if (status && status !== 'ALL') {
        bookings = bookings.filter(b => b.status === status);
      }
      if (roomNumber) {
        bookings = bookings.filter(b => b.roomNumber === roomNumber.toUpperCase());
      }
      if (day) {
        bookings = bookings.filter(b => b.day === day);
      }
    }

    return res.status(200).json({
      success: true,
      count: bookings.length,
      data: bookings
    });
  } catch (error) {
    console.error('Get all bookings error:', error);
    return res.status(500).json({
      success: false,
      message: 'Failed to retrieve booking requests.'
    });
  }
};

// @desc    Get current user's submitted bookings
// @route   GET /api/bookings/my
// @access  Private
exports.getMyBookings = async (req, res) => {
  try {
    const userEmail = req.user.email;
    const userId = req.user.id || req.user._id;

    let myBookings = [];
    try {
      myBookings = await Booking.find({
        $or: [
          { 'requestedBy.email': userEmail },
          { 'requestedBy.id': String(userId) }
        ]
      }).sort({ createdAt: -1 }).lean();
    } catch (dbErr) {
      myBookings = memoryBookings.filter(
        b => b.requestedBy?.email === userEmail || b.requestedBy?.id === String(userId)
      );
    }

    return res.status(200).json({
      success: true,
      count: myBookings.length,
      data: myBookings
    });
  } catch (error) {
    console.error('Get my bookings error:', error);
    return res.status(500).json({
      success: false,
      message: 'Failed to fetch personal bookings.'
    });
  }
};

// @desc    Update booking approval status (ADMIN ONLY)
// @route   PUT /api/bookings/:id/status
// @access  Private (Admin Only)
exports.updateBookingStatus = async (req, res) => {
  try {
    const { id } = req.params;
    const { status, adminRemarks } = req.body;

    if (!['APPROVED', 'REJECTED', 'PENDING'].includes(status)) {
      return res.status(400).json({
        success: false,
        message: 'Invalid status value. Must be APPROVED, REJECTED, or PENDING.'
      });
    }

    let booking = null;
    try {
      booking = await Booking.findById(id);
      if (!booking) {
        booking = await Booking.findOne({ bookingId: id });
      }
    } catch (err) {
      // Memory fallback
    }

    // In-memory fallback if not found in DB
    const memIndex = memoryBookings.findIndex(
      b => b._id === id || b.bookingId === id || String(b._id) === String(id)
    );

    const currentBookingData = booking || (memIndex !== -1 ? memoryBookings[memIndex] : null);

    if (!currentBookingData) {
      return res.status(404).json({
        success: false,
        message: 'Booking request not found.'
      });
    }

    // If approving, check again for potential conflicts with other APPROVED bookings
    if (status === 'APPROVED') {
      let existingApproved = [];
      try {
        existingApproved = await Booking.find({
          _id: { $ne: currentBookingData._id },
          bookingId: { $ne: currentBookingData.bookingId },
          roomNumber: currentBookingData.roomNumber,
          day: currentBookingData.day,
          status: 'APPROVED'
        }).lean();
      } catch (err) {
        existingApproved = memoryBookings.filter(
          b => (b._id !== id && b.bookingId !== id) &&
               b.roomNumber === currentBookingData.roomNumber &&
               b.day === currentBookingData.day &&
               b.status === 'APPROVED'
        );
      }

      const conflict = existingApproved.find(b => 
        isOverlap(currentBookingData.startTime, currentBookingData.endTime, b.startTime, b.endTime)
      );

      if (conflict) {
        return res.status(409).json({
          success: false,
          message: `Cannot approve: Room ${currentBookingData.roomNumber} already has another approved booking (${conflict.startTime} - ${conflict.endTime}) on ${currentBookingData.day}.`
        });
      }
    }

    const processedBy = {
      name: req.user.name || 'Administrator',
      email: req.user.email,
      at: new Date()
    };

    let updatedObj = null;

    if (booking) {
      booking.status = status;
      if (adminRemarks !== undefined) booking.adminRemarks = adminRemarks;
      booking.processedBy = processedBy;
      await booking.save();
      updatedObj = booking.toObject ? booking.toObject() : booking;
    }

    if (memIndex !== -1) {
      memoryBookings[memIndex].status = status;
      if (adminRemarks !== undefined) memoryBookings[memIndex].adminRemarks = adminRemarks;
      memoryBookings[memIndex].processedBy = processedBy;
      if (!updatedObj) updatedObj = memoryBookings[memIndex];
    }

    return res.status(200).json({
      success: true,
      message: `Booking request marked as ${status}.`,
      data: updatedObj
    });
  } catch (error) {
    console.error('Update booking status error:', error);
    return res.status(500).json({
      success: false,
      message: 'Failed to update booking status.'
    });
  }
};

// @desc    Cancel a booking request (By Requester or Admin)
// @route   DELETE /api/bookings/:id
// @access  Private
exports.cancelBooking = async (req, res) => {
  try {
    const { id } = req.params;
    const userRole = req.user.role;
    const userEmail = req.user.email;

    let booking = null;
    try {
      booking = await Booking.findById(id);
      if (!booking) booking = await Booking.findOne({ bookingId: id });
    } catch (err) {}

    const memIndex = memoryBookings.findIndex(
      b => b._id === id || b.bookingId === id || String(b._id) === String(id)
    );

    const bData = booking || (memIndex !== -1 ? memoryBookings[memIndex] : null);

    if (!bData) {
      return res.status(404).json({
        success: false,
        message: 'Booking not found.'
      });
    }

    // Permission check: only admin or original requester can cancel
    if (userRole !== 'ADMIN' && bData.requestedBy?.email !== userEmail) {
      return res.status(403).json({
        success: false,
        message: 'You are not authorized to cancel this booking.'
      });
    }

    if (booking) {
      await Booking.findByIdAndDelete(booking._id);
    }
    if (memIndex !== -1) {
      memoryBookings.splice(memIndex, 1);
    }

    return res.status(200).json({
      success: true,
      message: 'Booking request cancelled successfully.'
    });
  } catch (error) {
    console.error('Cancel booking error:', error);
    return res.status(500).json({
      success: false,
      message: 'Failed to cancel booking.'
    });
  }
};

// Helper: Get map of active approved bookings for a specific day
exports.getApprovedBookingsForDay = async (day) => {
  let approved = [];
  try {
    approved = await Booking.find({ day, status: 'APPROVED' }).lean();
  } catch (err) {
    approved = memoryBookings.filter(b => b.day.toLowerCase() === day.toLowerCase() && b.status === 'APPROVED');
  }

  if ((!approved || approved.length === 0) && memoryBookings.length > 0) {
    approved = memoryBookings.filter(b => b.day.toLowerCase() === day.toLowerCase() && b.status === 'APPROVED');
  }

  return approved || [];
};
