const mongoose = require('mongoose');
const { getClassroomAvailability } = require('../services/availabilityService');
const TimetableEntry = require('../models/TimetableEntry');
const Classroom = require('../models/Classroom');
const { sampleTimetableEntries } = require('../data/sampleTimetable');
const { extractBlockFromRoom } = require('../utils/blockUtils');
const { getActiveCancellations } = require('./announcementController');

// @desc    Get real-time or future classroom availability
// @route   GET /api/classrooms/availability
// @access  Public / Protected
exports.getAvailability = async (req, res) => {
  try {
    const { day, time, block, search } = req.query;

    const report = await getClassroomAvailability({
      day,
      time,
      block,
      search
    });

    return res.status(200).json({
      success: true,
      data: report
    });
  } catch (error) {
    console.error('Availability fetch error:', error);
    return res.status(500).json({
      success: false,
      message: 'Failed to calculate classroom availability.'
    });
  }
};

// @desc    Get single classroom details and full weekly schedule
// @route   GET /api/classrooms/:roomNumber
// @access  Public / Protected
exports.getClassroomDetails = async (req, res) => {
  try {
    const roomNumber = req.params.roomNumber.toUpperCase();
    const computedBlock = extractBlockFromRoom(roomNumber);

    let schedule = [];
    if (mongoose.connection && mongoose.connection.readyState === 1) {
      try {
        schedule = await TimetableEntry.find({ classroom: roomNumber }).lean();
      } catch (dbErr) {
        console.warn('⚠️ DB offline. Using sample dataset for room details.');
      }
    }

    if (!schedule || schedule.length === 0) {
      schedule = sampleTimetableEntries.filter(
        e => e.classroom.toUpperCase() === roomNumber
      );
    }

    // Check active cancellations for this classroom
    const activeCancellations = await getActiveCancellations();
    const taggedSchedule = schedule.map(entry => {
      const isCancelled = activeCancellations.some(c => {
        if (!c.classroom) return false;
        const sameRoom = c.classroom.toUpperCase() === roomNumber;
        const sameDay = !c.day || c.day.toLowerCase() === (entry.day || '').toLowerCase();
        if (!sameRoom || !sameDay) return false;

        if (c.startTime && c.endTime) {
          return c.startTime === entry.startTime && c.endTime === entry.endTime;
        }
        if (c.slot) {
          const sClean = c.slot.replace(/\s+(AM|PM)/gi, '');
          if (sClean.includes(entry.startTime)) return true;
        }
        return true;
      });

      return {
        ...entry,
        isCancelled,
        status: isCancelled ? 'CANCELLED' : 'SCHEDULED'
      };
    });

    // Organize weekly schedule by day
    const daysOrder = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
    const scheduleByDay = {};

    daysOrder.forEach(d => {
      scheduleByDay[d] = taggedSchedule.filter(e => e.day.toLowerCase() === d.toLowerCase());
    });

    return res.status(200).json({
      success: true,
      data: {
        roomNumber,
        block: computedBlock,
        roomType: 'LECTURE',
        totalWeeklyClasses: taggedSchedule.length,
        scheduleByDay,
        rawSchedule: taggedSchedule
      }
    });
  } catch (error) {
    console.error('Classroom details error:', error);
    return res.status(500).json({
      success: false,
      message: 'Failed to fetch classroom schedule details.'
    });
  }
};
