const TimetableEntry = require('../models/TimetableEntry');
const { sampleTimetableEntries } = require('../data/sampleTimetable');

// @desc    Get all timetable entries
// @route   GET /api/timetable
// @access  Public / Protected
exports.getAllEntries = async (req, res) => {
  try {
    const { day, batch, type } = req.query;
    let query = {};

    if (day) query.day = day;
    if (batch) query.batch = batch;
    if (type) query.type = type;

    let entries = [];
    try {
      entries = await TimetableEntry.find(query).lean();
    } catch (dbErr) {
      console.warn('⚠️ DB offline. Using sample dataset for timetable.');
    }

    if (!entries || entries.length === 0) {
      entries = sampleTimetableEntries;
      if (day) entries = entries.filter(e => e.day.toLowerCase() === day.toLowerCase());
      if (batch) entries = entries.filter(e => e.batch.toLowerCase() === batch.toLowerCase());
      if (type) entries = entries.filter(e => e.type.toLowerCase() === type.toLowerCase());
    }

    return res.status(200).json({
      success: true,
      count: entries.length,
      data: entries
    });
  } catch (error) {
    console.error('Timetable fetch error:', error);
    return res.status(500).json({
      success: false,
      message: 'Failed to fetch timetable data.'
    });
  }
};
