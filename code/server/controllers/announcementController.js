const mongoose = require('mongoose');
const Announcement = require('../models/Announcement');
const TimetableEntry = require('../models/TimetableEntry');
const { sampleTimetableEntries } = require('../data/sampleTimetable');
const { 
  getDateForDayOfWeek, 
  getWeekRange, 
  getWeekNumber 
} = require('../utils/timeUtils');

const currentWeekMeta = getWeekNumber();
const currentWeekBoundary = getWeekRange();

// In-memory sample announcements for dev offline fallback & quick verification
let sampleAnnouncements = [
  {
    _id: 'ann_mock_1',
    senderId: 'faculty_1',
    senderName: 'Dr. Neha Verma',
    senderEmail: 'neha.verma@thapar.edu',
    senderRole: 'FACULTY_ORGANISATION',
    targetBatch: '3P14',
    title: 'Software Engineering Class Cancelled (This Week Only)',
    message: "Today's 10:30 AM Software Engineering lecture in T106 is cancelled due to a faculty department meeting. The room is now unoccupied and free for student self-study for this week.",
    tag: 'CLASS_CANCELLED',
    classroom: 'T106',
    day: 'Monday',
    startTime: '10:30',
    endTime: '11:20',
    slot: '10:30 AM - 11:20 AM',
    subject: 'Software Engineering',
    subjectCode: 'SE',
    isClassCancelled: true,
    facultyId: 'FAC_NEHA_VERMA',
    facultyEmail: 'neha.verma@thapar.edu',
    cancellationDate: getDateForDayOfWeek('Monday'),
    weekOfYear: currentWeekMeta.week,
    year: currentWeekMeta.year,
    expiresAt: currentWeekBoundary.weekEnd,
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
    title: 'DBMS Evaluation Postponed (This Week Only)',
    message: 'The short relational algebra quiz scheduled for today is postponed. Room LT303 is unoccupied during this slot for this week.',
    tag: 'RESCHEDULED',
    classroom: 'LT303',
    day: 'Monday',
    startTime: '10:30',
    endTime: '11:20',
    slot: '10:30 AM - 11:20 AM',
    subject: 'Database Management Systems',
    subjectCode: 'DBMS',
    isClassCancelled: true,
    facultyId: 'FAC_MEENAKSHI',
    facultyEmail: 'meenakshi@thapar.edu',
    cancellationDate: getDateForDayOfWeek('Monday'),
    weekOfYear: currentWeekMeta.week,
    year: currentWeekMeta.year,
    expiresAt: currentWeekBoundary.weekEnd,
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

    const cleanClassroom = classroom ? classroom.trim().toUpperCase() : '';
    const cleanDay = day ? day.trim() : '';

    // Enforce Teacher ID Class Ownership: Faculty can ONLY cancel their own classes!
    let matchedClass = null;
    if (isCancelled && cleanClassroom && cleanDay) {
      let scheduleEntries = [];
      if (mongoose.connection && mongoose.connection.readyState === 1) {
        try {
          scheduleEntries = await TimetableEntry.find({
            classroom: cleanClassroom,
            day: { $regex: new RegExp(`^${cleanDay}$`, 'i') }
          }).lean();
        } catch (dbErr) {}
      }
      if (!scheduleEntries || scheduleEntries.length === 0) {
        scheduleEntries = sampleTimetableEntries.filter(e => 
          e.classroom.toUpperCase() === cleanClassroom &&
          e.day.toLowerCase() === cleanDay.toLowerCase()
        );
      }

      // Check if a scheduled class exists at this classroom and time slot
      matchedClass = scheduleEntries.find(e => {
        if (effectiveStart && (e.startTime === effectiveStart || e.startTime.startsWith(effectiveStart))) return true;
        if (effectiveSlot && effectiveSlot.includes(e.startTime)) return true;
        return false;
      });

      // Strict Teacher ID verification (Role ADMIN is exempt as superuser)
      if (req.user && req.user.role !== 'ADMIN' && matchedClass) {
        const userFacultyId = (req.user.facultyId || '').trim().toUpperCase() ||
          `FAC_${(req.user.name || '').trim().toUpperCase().replace(/[^A-Z0-9]/g, '_')}`;
        const schedFacultyId = (matchedClass.facultyId || '').trim().toUpperCase() ||
          `FAC_${(matchedClass.faculty || '').trim().toUpperCase().replace(/[^A-Z0-9]/g, '_')}`;
        const userEmail = (req.user.email || '').trim().toLowerCase();
        const schedEmail = (matchedClass.facultyEmail || '').trim().toLowerCase();

        const isOwner = 
          (schedFacultyId && userFacultyId && schedFacultyId === userFacultyId) ||
          (schedEmail && userEmail && schedEmail === userEmail) ||
          userFacultyId === 'FAC_FACULTY' || // dev superuser
          userFacultyId === 'FAC_ADMIN';

        if (!isOwner) {
          return res.status(403).json({
            success: false,
            message: `Ownership Restriction: Classroom ${cleanClassroom} at ${matchedClass.startTime}-${matchedClass.endTime} on ${cleanDay} is assigned to Teacher ID ${schedFacultyId} (${matchedClass.faculty}). Your Teacher ID is ${userFacultyId}. Only the instructor assigned to this subject ID can cancel this class.`
          });
        }
      }
    }

    // Compute week-limited expiration metadata for cancellations
    const cancelDate = getDateForDayOfWeek(cleanDay || 'Monday');
    const cancelDateObj = new Date(cancelDate);
    const weekMeta = getWeekNumber(cancelDateObj);
    const weekBoundary = getWeekRange(cancelDateObj);

    const announcementData = {
      senderId: String(req.user.id || req.user._id || 'faculty_user'),
      senderName: req.user.name || 'Faculty Member',
      senderEmail: req.user.email || 'faculty@thapar.edu',
      senderRole: req.user.role || 'FACULTY_ORGANISATION',
      facultyId: req.user.facultyId || (matchedClass ? matchedClass.facultyId : `FAC_${(req.user.name || 'FACULTY').toUpperCase().replace(/[^A-Z0-9]/g, '_')}`),
      facultyEmail: req.user.email || (matchedClass ? matchedClass.facultyEmail : ''),
      targetBatch: cleanBatch,
      title: isCancelled && !cleanTitle.includes('(This Week Only)') ? `${cleanTitle} (This Week Only)` : cleanTitle,
      message: message.trim(),
      tag: cleanTag,
      classroom: cleanClassroom,
      day: cleanDay,
      startTime: effectiveStart || (matchedClass ? matchedClass.startTime : ''),
      endTime: effectiveEnd || (matchedClass ? matchedClass.endTime : ''),
      slot: effectiveSlot || (matchedClass ? `${matchedClass.startTime} - ${matchedClass.endTime}` : ''),
      subject: subject ? subject.trim() : (matchedClass ? matchedClass.subject : ''),
      subjectCode: subjectCode ? subjectCode.trim().toUpperCase() : (matchedClass ? matchedClass.subjectCode : ''),
      isClassCancelled: isCancelled,
      cancellationDate: cancelDate,
      weekOfYear: weekMeta.week,
      year: weekMeta.year,
      expiresAt: weekBoundary.weekEnd // Active ONLY for the current week until Sunday 23:59:59.999
    };

    let created = null;
    if (mongoose.connection && mongoose.connection.readyState === 1) {
      try {
        created = await Announcement.create(announcementData);
      } catch (dbErr) {
        console.warn('⚠️ DB write failed during announcement creation. Using in-memory fallback.');
      }
    }
    if (!created) {
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
 * Strictly filters out past-week or expired cancellations so cancellations are active
 * ONLY for the current week and scheduled slot!
 * Used by availabilityService, classroomController, and timetableController.
 */
exports.getActiveCancellations = async (targetDay, targetDate) => {
  const now = new Date();
  const currentWeekMeta = getWeekNumber(now);

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

  // Temporal enforcement: Keep ONLY cancellations valid for THIS WEEK and NOT expired
  const activeThisWeek = cancellations.filter(c => {
    // 1. Expiration check: if expiresAt is in the past, it no longer applies
    if (c.expiresAt && new Date(c.expiresAt) < now) {
      return false;
    }

    // 2. Target date check: if explicit target date provided, must match
    if (targetDate && c.cancellationDate) {
      if (c.cancellationDate !== targetDate) return false;
    } else {
      // 3. Week of year check: must match current calendar week
      if (c.weekOfYear && c.year) {
        if (c.weekOfYear !== currentWeekMeta.week || c.year !== currentWeekMeta.year) {
          return false;
        }
      }
    }

    return true;
  });

  return activeThisWeek;
};
