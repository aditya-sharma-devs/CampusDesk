/**
 * Time Utilities for Timetable Processing
 * Handles parsing, normalization, slot checking, and day resolution.
 */

/**
 * Converts a time string (e.g., "09:40", "11:20", "2:30 PM") into minutes from midnight (0-1439).
 * Supports 24-hour HH:mm format and 12-hour AM/PM formats.
 * @param {string} timeStr - Time string
 * @returns {number} Minutes from midnight
 */
function timeToMinutes(timeStr) {
  if (!timeStr || typeof timeStr !== 'string') return -1;

  let cleaned = timeStr.trim().toUpperCase();

  // Check for AM/PM format
  const isPM = cleaned.includes('PM');
  const isAM = cleaned.includes('AM');
  cleaned = cleaned.replace(/AM|PM/g, '').trim();

  const parts = cleaned.split(':');
  if (parts.length !== 2) return -1;

  let hours = parseInt(parts[0], 10);
  const minutes = parseInt(parts[1], 10);

  if (isNaN(hours) || isNaN(minutes)) return -1;

  if (isPM && hours < 12) hours += 12;
  if (isAM && hours === 12) hours = 0;

  return hours * 60 + minutes;
}

/**
 * Checks if a target time (in HH:mm or minutes) falls within a slot [startTime, endTime).
 * @param {string|number} targetTime 
 * @param {string} startTime 
 * @param {string} endTime 
 * @returns {boolean}
 */
function isTimeWithinSlot(targetTime, startTime, endTime) {
  const targetMins = typeof targetTime === 'number' ? targetTime : timeToMinutes(targetTime);
  const startMins = timeToMinutes(startTime);
  const endMins = timeToMinutes(endTime);

  if (targetMins < 0 || startMins < 0 || endMins < 0) return false;

  return targetMins >= startMins && targetMins < endMins;
}

/**
 * Returns the current day of the week in full English name (e.g., "Monday").
 */
function getCurrentDayName() {
  const days = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
  const todayIndex = new Date().getDay();
  return days[todayIndex];
}

/**
 * Returns current time in 24-hour "HH:mm" format.
 */
function getCurrentTimeStr() {
  const now = new Date();
  const hours = String(now.getHours()).padStart(2, '0');
  const mins = String(now.getMinutes()).padStart(2, '0');
  return `${hours}:${mins}`;
}

/**
 * Returns the ISO week number and year for a given date.
 * @param {Date} [date]
 * @returns {{ week: number, year: number }}
 */
function getWeekNumber(date = new Date()) {
  const d = new Date(Date.UTC(date.getFullYear(), date.getMonth(), date.getDate()));
  const dayNum = d.getUTCDay() || 7;
  d.setUTCDate(d.getUTCDate() + 4 - dayNum);
  const yearStart = new Date(Date.UTC(d.getUTCFullYear(), 0, 1));
  const weekNo = Math.ceil((((d - yearStart) / 86400000) + 1) / 7);
  return { week: weekNo, year: d.getUTCFullYear() };
}

/**
 * Calculates the exact YYYY-MM-DD date for a given day name in the current week (Monday - Sunday).
 * @param {string} dayName - e.g. "Monday", "Tuesday", "Wednesday"
 * @param {Date} [baseDate] - Reference date (defaults to now)
 * @returns {string} Date string in YYYY-MM-DD format
 */
function getDateForDayOfWeek(dayName, baseDate = new Date()) {
  const daysMap = {
    'monday': 1,
    'tuesday': 2,
    'wednesday': 3,
    'thursday': 4,
    'friday': 5,
    'saturday': 6,
    'sunday': 7
  };

  const targetDayIdx = daysMap[(dayName || '').toLowerCase()] || 1;
  const currentDayIdx = baseDate.getDay() === 0 ? 7 : baseDate.getDay(); // 1 (Mon) - 7 (Sun)
  
  const diffDays = targetDayIdx - currentDayIdx;
  const targetDate = new Date(baseDate);
  targetDate.setDate(baseDate.getDate() + diffDays);

  const year = targetDate.getFullYear();
  const month = String(targetDate.getMonth() + 1).padStart(2, '0');
  const day = String(targetDate.getDate()).padStart(2, '0');

  return `${year}-${month}-${day}`;
}

/**
 * Gets the current week boundary: start (Monday 00:00:00), end (Sunday 23:59:59.999).
 * Used for setting expiration dates on weekly class cancellations.
 * @param {Date} [baseDate]
 * @returns {{ weekStart: Date, weekEnd: Date, weekNumber: number, year: number }}
 */
function getWeekRange(baseDate = new Date()) {
  const currentDayIdx = baseDate.getDay() === 0 ? 7 : baseDate.getDay();
  
  // Monday 00:00:00
  const monday = new Date(baseDate);
  monday.setDate(baseDate.getDate() - (currentDayIdx - 1));
  monday.setHours(0, 0, 0, 0);

  // Sunday 23:59:59.999
  const sunday = new Date(monday);
  sunday.setDate(monday.getDate() + 6);
  sunday.setHours(23, 59, 59, 999);

  const { week, year } = getWeekNumber(baseDate);

  return {
    weekStart: monday,
    weekEnd: sunday,
    weekNumber: week,
    year
  };
}

/**
 * Determines whether a given ISO date or YYYY-MM-DD string falls inside the current calendar week.
 * @param {string|Date} dateToCheck
 * @param {Date} [baseDate]
 * @returns {boolean}
 */
function isDateInCurrentWeek(dateToCheck, baseDate = new Date()) {
  if (!dateToCheck) return false;
  const target = new Date(dateToCheck);
  if (isNaN(target.getTime())) return false;

  const { weekStart, weekEnd } = getWeekRange(baseDate);
  return target >= weekStart && target <= weekEnd;
}

module.exports = {
  timeToMinutes,
  isTimeWithinSlot,
  getCurrentDayName,
  getCurrentTimeStr,
  getWeekNumber,
  getDateForDayOfWeek,
  getWeekRange,
  isDateInCurrentWeek
};
