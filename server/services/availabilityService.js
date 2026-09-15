/**
 * Availability Service
 * Core calculation engine for classroom occupancy, availability, and maintenance ticket tags.
 */

const Classroom = require('../models/Classroom');
const TimetableEntry = require('../models/TimetableEntry');
const { timeToMinutes, getCurrentDayName, getCurrentTimeStr } = require('../utils/timeUtils');
const { extractBlockFromRoom } = require('../utils/blockUtils');
const { sampleClassrooms, sampleTimetableEntries } = require('../data/sampleTimetable');
const { getUnresolvedTicketsMap } = require('../controllers/ticketController');

/**
 * Calculates classroom availability for a given day and time slot.
 * Integrates active complaint ticket tags (UNDER_MAINTENANCE / ISSUE_REPORTED).
 * 
 * @param {Object} options - Search options
 * @returns {Promise<Object>} Availability report with metrics and tagged classroom items
 */
async function getClassroomAvailability({ day, time, block, search }) {
  const targetDay = day || getCurrentDayName();
  const targetTime = time || getCurrentTimeStr();
  const targetMinutes = timeToMinutes(targetTime);

  let classroomsData = [];
  let entriesData = [];

  try {
    classroomsData = await Classroom.find({ isActive: true }).lean();
    entriesData = await TimetableEntry.find({ day: targetDay }).lean();
  } catch (err) {
    console.warn('⚠️ MongoDB fetch failed or offline. Using sample dataset fallback.');
  }

  // Fallback to sample data if database returned empty
  if (!classroomsData || classroomsData.length === 0) {
    classroomsData = sampleClassrooms;
  }
  if (!entriesData || entriesData.length === 0) {
    entriesData = sampleTimetableEntries.filter(e => e.day.toLowerCase() === targetDay.toLowerCase());
  } else {
    entriesData = entriesData.filter(e => e.day.toLowerCase() === targetDay.toLowerCase());
  }

  // Fetch active unresolved tickets mapped by room number (ONLY PENDING & UNDER_MAINTENANCE)
  const activeTicketsMap = await getUnresolvedTicketsMap();

  // Evaluate status and ticket tags for each classroom
  const processedClassrooms = classroomsData.map(room => {
    const roomNumber = room.roomNumber.toUpperCase();
    const computedBlock = room.block || extractBlockFromRoom(roomNumber);

    // Get all timetable entries for this room today
    const roomEntriesToday = entriesData.filter(e => e.classroom.toUpperCase() === roomNumber);

    // Active occupancy check (Requirement 18: EXCLUDE LABs from lecture occupancy)
    const activeEntry = roomEntriesToday.find(entry => {
      if (entry.type === 'LAB' || (entry.subject && entry.subject.includes('[Lab]'))) {
        return false;
      }

      const startMins = timeToMinutes(entry.startTime);
      const endMins = timeToMinutes(entry.endTime);

      return targetMinutes >= startMins && targetMinutes < endMins;
    });

    const isOccupied = Boolean(activeEntry);
    
    // Active Ticket is ONLY present if status is PENDING or UNDER_MAINTENANCE.
    // If ticket is RESOLVED or does not exist, activeTicket is null!
    const activeTicket = activeTicketsMap[roomNumber] || null;

    return {
      id: room._id || roomNumber,
      roomNumber,
      block: computedBlock,
      roomType: room.roomType || 'LECTURE',
      capacity: room.capacity || 60,
      status: isOccupied ? 'OCCUPIED' : 'AVAILABLE',
      // Active Maintenance / Issue Tag (null if RESOLVED or no ticket)
      activeTicket: activeTicket ? {
        id: activeTicket._id || activeTicket.ticketId,
        ticketId: activeTicket.ticketId,
        category: activeTicket.category,
        description: activeTicket.description,
        status: activeTicket.status, // 'PENDING' or 'UNDER_MAINTENANCE'
        reportedBy: activeTicket.reportedBy,
        createdAt: activeTicket.createdAt
      } : null,
      currentOccupancy: activeEntry ? {
        batch: activeEntry.batch,
        subject: activeEntry.subject,
        subjectCode: activeEntry.subjectCode,
        startTime: activeEntry.startTime,
        endTime: activeEntry.endTime,
        faculty: activeEntry.faculty || 'Faculty Member',
        type: activeEntry.type
      } : null,
      todaySchedule: roomEntriesToday.sort((a, b) => timeToMinutes(a.startTime) - timeToMinutes(b.startTime))
    };
  });

  // Apply search and block filters
  let filtered = processedClassrooms;

  if (block && block !== 'ALL') {
    filtered = filtered.filter(item => item.block.toUpperCase() === block.toUpperCase());
  }

  if (search && search.trim() !== '') {
    const q = search.trim().toUpperCase();
    filtered = filtered.filter(item => 
      item.roomNumber.includes(q) || 
      item.block.toUpperCase().includes(q) ||
      (item.currentOccupancy && item.currentOccupancy.subject.toUpperCase().includes(q))
    );
  }

  // Summary metrics calculation
  const totalClassrooms = filtered.length;
  const availableCount = filtered.filter(c => c.status === 'AVAILABLE').length;
  const occupiedCount = filtered.filter(c => c.status === 'OCCUPIED').length;

  // Maintenance Count includes ALL classrooms with an active issue (UNDER_MAINTENANCE or PENDING)
  // When a ticket is marked RESOLVED, activeTicket becomes null, automatically reducing this count!
  const maintenanceCount = filtered.filter(c => c.activeTicket !== null).length;
  const pendingIssueCount = filtered.filter(c => c.activeTicket && c.activeTicket.status === 'PENDING').length;

  return {
    meta: {
      day: targetDay,
      time: targetTime,
      blockFilter: block || 'ALL',
      searchQuery: search || '',
      timestamp: new Date().toISOString()
    },
    summary: {
      totalClassrooms,
      availableCount,
      occupiedCount,
      maintenanceCount,
      pendingIssueCount
    },
    classrooms: filtered
  };
}

module.exports = {
  getClassroomAvailability
};
