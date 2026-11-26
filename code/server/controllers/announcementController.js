const mongoose = require('mongoose');
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
    message: "Today's 10:30 AM Software Engineering lecture in T106 is cancelled due to a faculty department meeting. The room is now unoccupied and free for student self-study.",
    tag: 'CLASS_CANCELLED',
    classroom: 'T106',
    day: 'Monday',
    startTime: '10:30',
    endTime: '11:20',
    slot: '10:30 AM - 11:20 AM',
    subject: 'Software Engineering',
    subjectCode: 'SE',
    isClassCancelled: true,
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
    classroom: 'LT303',
    day: 'Monday',
    startTime: '10:30',
    endTime: '11:20',
    slot: '10:30 AM - 11:20 AM',
    subject: 'Database Management Systems',
    subjectCode: 'DBMS',
    isClassCancelled: true,
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
    const { 
      targetBatch, 
      title, 
      message, 
      tag,
      classroom,
      day,
      startTime,
      endTime,
      slot,
      subject,
      subjectCode
    } = req.body;

    if (!targetBatch || !message) {
      return res.status(400).json({
        success: false,
        message: 'Please provide both target batch and message content.'
      });
    }

    const cleanBatch = targetBatch.trim().toUpperCase();
    const cleanTitle = (title && title.trim()) || 'Teacher Announcement';
    const cleanTag = tag || 'ANNOUNCEMENT';
    const isCancelled = cleanTag === 'CLASS_CANCELLED' || cleanTag === 'RESCHEDULED';

    // Parse start and end time if slot string provided like '10:30 AM - 11:20 AM'
    let effectiveStart = startTime ? startTime.trim() : '';
    let effectiveEnd = endTime ? endTime.trim() : '';
    let effectiveSlot = slot ? slot.trim() : '';

    if (!effectiveStart && effectiveSlot) {
      const parts = effectiveSlot.split('-');
      if (parts.length === 2) {
        effectiveStart = parts[0].trim().replace(/\s+(AM|PM)/i, '');
        effectiveEnd = parts[1].trim().replace(/\s+(AM|PM)/i, '');
      }
    }

    const announcementData = {
      senderId: String(req.user.id || req.user._id || 'faculty_user'),
      senderName: req.user.name || 'Faculty Member',
      senderEmail: req.user.email || 'faculty@thapar.edu',
      senderRole: req.user.role || 'FACULTY_ORGANISATION',
      targetBatch: cleanBatch,
      title: cleanTitle,
      message: message.trim(),
      tag: cleanTag,
      classroom: classroom ? classroom.trim().toUpperCase() : '',
      day: day ? day.trim() : '',
      startTime: effectiveStart,
      endTime: effectiveEnd,
      slot: effectiveSlot,
      subject: subject ? subject.trim() : '',
      subjectCode: subjectCode ? subjectCode.trim().toUpperCase() : '',
      isClassCancelled: isCancelled
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

    // Also keep local sample in sync for instant responsiveness
    if (created && !sampleAnnouncements.some(a => a._id === created._id)) {
      sampleAnnouncements.unshift(created);
    }

    return res.status(201).json({
      success: true,
      message: isCancelled 
        ? `Broadcast sent! Classroom ${announcementData.classroom || 'hall'} has been un-occupied for ${announcementData.day || 'scheduled slot'}.`
        : `Announcement broadcast successfully to Batch ${cleanBatch}.`,
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
      console.warn('⚠️ DB offline during announcement delete.');
    }

    // Keep sample announcements in sync
    sampleAnnouncements = sampleAnnouncements.filter(a => a._id !== id);

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

/**
 * Helper to retrieve all active class cancellations for a target day (or all days).
 * Used by availabilityService, classroomController, and timetableController.
 */
exports.getActiveCancellations = async (targetDay) => {
  let cancellations = [];
  if (mongoose.connection && mongoose.connection.readyState === 1) {
    try {
      const query = {
        tag: { $in: ['CLASS_CANCELLED', 'RESCHEDULED'] }
      };
      if (targetDay && targetDay.toUpperCase() !== 'ALL') {
        query.$or = [
          { day: { $regex: new RegExp(`^${targetDay.trim()}$`, 'i') } },
          { day: '' },
          { day: { $exists: false } }
        ];
      }
      cancellations = await Announcement.find(query).lean();
    } catch (dbErr) {
      console.warn('⚠️ DB query failed in getActiveCancellations. Using in-memory dataset.');
    }
  }

  // Include in-memory sample cancellations if database is empty or offline
  if (!cancellations || cancellations.length === 0) {
    cancellations = sampleAnnouncements.filter(a => 
      (a.tag === 'CLASS_CANCELLED' || a.tag === 'RESCHEDULED' || a.isClassCancelled) &&
      (!targetDay || targetDay.toUpperCase() === 'ALL' || !a.day || a.day.toLowerCase() === targetDay.trim().toLowerCase())
    );
  } else {
    // Merge any memory items that might not have reached DB yet
    sampleAnnouncements.forEach(sample => {
      if ((sample.tag === 'CLASS_CANCELLED' || sample.tag === 'RESCHEDULED' || sample.isClassCancelled) &&
          (!targetDay || targetDay.toUpperCase() === 'ALL' || !sample.day || sample.day.toLowerCase() === targetDay.trim().toLowerCase())) {
        if (!cancellations.some(c => c._id === sample._id)) {
          cancellations.push(sample);
        }
      }
    });
  }

  return cancellations;
};
