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

module.exports = {
  timeToMinutes,
  isTimeWithinSlot,
  getCurrentDayName,
  getCurrentTimeStr
};
