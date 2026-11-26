const mongoose = require('mongoose');
const TimetableEntry = require('../models/TimetableEntry');
const { sampleTimetableEntries } = require('../data/sampleTimetable');
const { getActiveCancellations } = require('./announcementController');

// @desc    Get all timetable entries with advanced filtering
// @route   GET /api/timetable
// @access  Public / Protected
exports.getAllEntries = async (req, res) => {
  try {
    const { day, batch, type, classroom, subject, search, faculty } = req.query;
    let query = {};

    if (day) query.day = { $regex: new RegExp(`^${day.trim()}$`, 'i') };
    if (batch) query.batch = { $regex: new RegExp(batch.trim(), 'i') };
    if (type) query.type = { $regex: new RegExp(`^${type.trim()}$`, 'i') };
    if (classroom) query.classroom = { $regex: new RegExp(`^${classroom.trim()}$`, 'i') };
    if (faculty) query.faculty = { $regex: new RegExp(faculty.trim(), 'i') };
    if (subject) {
      const subRegex = new RegExp(subject.trim(), 'i');
      query.$or = [
        { subject: subRegex },
        { subjectCode: subRegex }
      ];
    }
    if (search) {
      const sRegex = new RegExp(search.trim(), 'i');
      query.$or = [
        { classroom: sRegex },
        { subject: sRegex },
        { subjectCode: sRegex },
        { faculty: sRegex },
        { batch: sRegex }
      ];
    }

    let entries = [];
    if (mongoose.connection && mongoose.connection.readyState === 1) {
      try {
        entries = await TimetableEntry.find(query).lean();
      } catch (dbErr) {
        console.warn('⚠️ DB offline. Using sample dataset for timetable.');
      }
    }

    if (!entries || entries.length === 0) {
      entries = sampleTimetableEntries;
      if (day) entries = entries.filter(e => e.day.toLowerCase() === day.trim().toLowerCase());
      if (batch) entries = entries.filter(e => e.batch.toLowerCase().includes(batch.trim().toLowerCase()));
      if (type) entries = entries.filter(e => e.type.toLowerCase() === type.trim().toLowerCase());
      if (classroom) entries = entries.filter(e => e.classroom.toLowerCase() === classroom.trim().toLowerCase());
      if (faculty) {
        const f = faculty.trim().toLowerCase().replace(/^(dr\.|prof\.|er\.|mr\.|mrs\.|ms\.)\s*/i, '');
        entries = entries.filter(e => {
          if (!e.faculty) return false;
          const ef = e.faculty.toLowerCase().replace(/^(dr\.|prof\.|er\.|mr\.|mrs\.|ms\.)\s*/i, '');
          return ef.includes(f) || f.includes(ef);
        });
      }
      if (subject) {
        const s = subject.trim().toLowerCase();
        entries = entries.filter(e => 
          e.subject.toLowerCase().includes(s) || 
          e.subjectCode.toLowerCase().includes(s)
        );
      }
      if (search) {
        const s = search.trim().toLowerCase();
        entries = entries.filter(e => 
          e.classroom.toLowerCase().includes(s) ||
          e.subject.toLowerCase().includes(s) ||
          e.subjectCode.toLowerCase().includes(s) ||
          (e.faculty && e.faculty.toLowerCase().includes(s)) ||
          e.batch.toLowerCase().includes(s)
        );
      }
    }

    // Sort order: Day of week order, then Start time
    const dayOrder = { 'monday': 1, 'tuesday': 2, 'wednesday': 3, 'thursday': 4, 'friday': 5, 'saturday': 6, 'sunday': 7 };
    const sorted = entries.sort((a, b) => {
      const orderA = dayOrder[a.day?.toLowerCase()] || 8;
      const orderB = dayOrder[b.day?.toLowerCase()] || 8;
      if (orderA !== orderB) return orderA - orderB;
      return (a.startTime || '').localeCompare(b.startTime || '');
    });

    // Fetch active teacher cancellations
    const activeCancellations = await getActiveCancellations();

    const enriched = sorted.map(e => {
      const cancelMatch = activeCancellations.find(c => {
        if (!c.classroom) return false;
        const sameRoom = c.classroom.toUpperCase() === (e.classroom || '').toUpperCase();
        const sameDay = !c.day || c.day.toLowerCase() === (e.day || '').toLowerCase();
        if (!sameRoom || !sameDay) return false;

        if (c.startTime && c.endTime) {
          return (c.startTime === e.startTime && c.endTime === e.endTime) ||
                 (c.startTime === e.startTime);
        }
        if (c.slot) {
          const sClean = c.slot.replace(/\s+(AM|PM)/gi, '');
          if (sClean.includes(e.startTime)) return true;
        }
        return true;
      });

      return {
        ...e,
        isCancelled: !!cancelMatch,
        cancellationReason: cancelMatch ? (cancelMatch.title || cancelMatch.message) : null,
        block: e.block || (
          e.classroom?.startsWith('LT') ? 'LT Block' :
          e.classroom?.startsWith('LP') ? 'LP Block' :
          e.classroom?.startsWith('T') ? 'T Block' :
          e.classroom?.startsWith('F') ? 'F Block' :
          e.classroom?.startsWith('E') ? 'E Block' :
          e.classroom?.startsWith('L') ? 'L Block' : 'Campus'
        )
      };
    });

    return res.status(200).json({
      success: true,
      count: enriched.length,
      data: enriched
    });
  } catch (error) {
    console.error('Timetable fetch error:', error);
    return res.status(500).json({
      success: false,
      message: 'Failed to fetch timetable data.'
    });
  }
};
