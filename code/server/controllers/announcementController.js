const Announcement = require('../models/Announcement');

// In-memory sample announcements for dev offline fallback & quick verification
let sampleAnnouncements = [
  {
    _id: 'ann_mock_1',
    senderId: 'faculty_1',
    senderName: 'Dr. Neha Verma',
    senderEmail: 'neha.verma@thapar.edu',
    senderRole: 'FACULTY_ORGANISATION',
    targetBatch: '3P14',
    title: 'Software Engineering Class Cancelled',
    message: "Today's 09:40 AM Software Engineering lecture in T106 is cancelled due to a faculty department meeting. Extra makeup class will be scheduled next week.",
    tag: 'CLASS_CANCELLED',
    createdAt: new Date(Date.now() - 1000 * 60 * 35).toISOString() // 35 mins ago
  },
  {
    _id: 'ann_mock_2',
    senderId: 'faculty_2',
    senderName: 'Prof. Amit Patel',
    senderEmail: 'amit.patel@thapar.edu',
    senderRole: 'FACULTY_ORGANISATION',
    targetBatch: '3P14',
    title: 'Cloud Computing Lab Instructions',
    message: 'Please ensure your AWS Academy sandbox credentials are active before coming to Wednesday class in T106.',
    tag: 'ANNOUNCEMENT',
    createdAt: new Date(Date.now() - 1000 * 60 * 180).toISOString() // 3 hours ago
  },
  {
    _id: 'ann_mock_3',
    senderId: 'faculty_3',
    senderName: 'Dr. Meenakshi',
    senderEmail: 'meenakshi@thapar.edu',
    senderRole: 'FACULTY_ORGANISATION',
    targetBatch: '3CO1',
    title: 'DBMS Surprise Evaluation Postponed',
    message: 'The short relational algebra quiz scheduled for today is postponed to Friday.',
    tag: 'RESCHEDULED',
    createdAt: new Date(Date.now() - 1000 * 60 * 120).toISOString()
  },
  {
    _id: 'ann_mock_4',
    senderId: 'admin_1',
    senderName: 'Academic Administration',
    senderEmail: 'admin@thapar.edu',
    senderRole: 'ADMIN',
    targetBatch: 'ALL',
    title: 'Central Library & Reading Hall Extended Hours',
    message: 'All classroom study spots and reading halls will remain open until 10:00 PM throughout this week.',
    tag: 'ANNOUNCEMENT',
    createdAt: new Date(Date.now() - 1000 * 60 * 360).toISOString()
  }
];

// @desc    Broadcast a new announcement to a batch
// @route   POST /api/announcements
// @access  Private (Faculty / Organisation / Admin)
exports.createAnnouncement = async (req, res) => {
  try {
    const { targetBatch, title, message, tag } = req.body;

    if (!targetBatch || !message) {
      return res.status(400).json({
        success: false,
        message: 'Please provide both target batch and message content.'
      });
    }

    const cleanBatch = targetBatch.trim().toUpperCase();
    const cleanTitle = (title && title.trim()) || 'Teacher Announcement';
    const cleanTag = tag || 'ANNOUNCEMENT';

    const announcementData = {
      senderId: String(req.user.id || req.user._id || 'faculty_user'),
      senderName: req.user.name || 'Faculty Member',
      senderEmail: req.user.email || 'faculty@thapar.edu',
      senderRole: req.user.role || 'FACULTY_ORGANISATION',
      targetBatch: cleanBatch,
      title: cleanTitle,
      message: message.trim(),
      tag: cleanTag
    };

    let created = null;
    try {
      created = await Announcement.create(announcementData);
    } catch (dbErr) {
      console.warn('⚠️ DB offline during announcement creation. Using in-memory fallback.');
      created = {
        _id: 'ann_' + Date.now(),
        ...announcementData,
        createdAt: new Date().toISOString()
      };
      sampleAnnouncements.unshift(created);
    }

    return res.status(201).json({
      success: true,
      message: `Announcement broadcast successfully to Batch ${cleanBatch}.`,
      data: created
    });
  } catch (error) {
    console.error('Create announcement error:', error);
    return res.status(500).json({
      success: false,
      message: 'Failed to broadcast announcement.'
    });
  }
};

// @desc    Get announcements for student's batch or all
// @route   GET /api/announcements
// @access  Private
exports.getAnnouncements = async (req, res) => {
  try {
    const { batch } = req.query;
    let query = {};

    if (batch && batch.trim()) {
      const b = batch.trim().toUpperCase();
      query.$or = [
        { targetBatch: b },
        { targetBatch: 'ALL' }
      ];
    }

    let items = [];
    try {
      items = await Announcement.find(query).sort({ createdAt: -1 }).lean();
    } catch (dbErr) {
      console.warn('⚠️ DB offline during announcements fetch. Using sample announcements.');
    }

    if (!items || items.length === 0) {
      items = sampleAnnouncements;
      if (batch && batch.trim()) {
        const b = batch.trim().toUpperCase();
        items = items.filter(a => a.targetBatch === b || a.targetBatch === 'ALL');
      }
    }

    // Sort newest first
    items.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));

    return res.status(200).json({
      success: true,
      count: items.length,
      data: items
    });
  } catch (error) {
    console.error('Get announcements error:', error);
    return res.status(500).json({
      success: false,
      message: 'Failed to retrieve announcements.'
    });
  }
};

// @desc    Delete an announcement
// @route   DELETE /api/announcements/:id
// @access  Private (Sender or Admin)
exports.deleteAnnouncement = async (req, res) => {
  try {
    const { id } = req.params;

    try {
      await Announcement.findByIdAndDelete(id);
    } catch (dbErr) {
      // offline fallback
      sampleAnnouncements = sampleAnnouncements.filter(a => a._id !== id);
    }

    return res.status(200).json({
      success: true,
      message: 'Announcement removed.'
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: 'Failed to delete announcement.'
    });
  }
};
