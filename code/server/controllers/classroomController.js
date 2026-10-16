const { getClassroomAvailability } = require('../services/availabilityService');
const TimetableEntry = require('../models/TimetableEntry');
const Classroom = require('../models/Classroom');
const { sampleTimetableEntries } = require('../data/sampleTimetable');
const { extractBlockFromRoom } = require('../utils/blockUtils');

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
    try {
      schedule = await TimetableEntry.find({ classroom: roomNumber }).lean();
    } catch (dbErr) {
      console.warn('⚠️ DB offline. Using sample dataset for room details.');
    }

    if (!schedule || schedule.length === 0) {
      schedule = sampleTimetableEntries.filter(
        e => e.classroom.toUpperCase() === roomNumber
      );
    }

    // Organize weekly schedule by day
    const daysOrder = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
    const scheduleByDay = {};

    daysOrder.forEach(d => {
      scheduleByDay[d] = schedule.filter(e => e.day.toLowerCase() === d.toLowerCase());
    });

    return res.status(200).json({
      success: true,
      data: {
        roomNumber,
        block: computedBlock,
        roomType: 'LECTURE',
        totalWeeklyClasses: schedule.length,
        scheduleByDay,
        rawSchedule: schedule
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
