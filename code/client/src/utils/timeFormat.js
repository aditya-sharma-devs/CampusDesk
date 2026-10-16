/**
 * Formats a 24-hour time string ("14:30") into a friendly 12-hour format ("2:30 PM").
 */
export function formatTo12Hour(time24) {
  if (!time24) return '';
  const parts = time24.split(':');
  if (parts.length !== 2) return time24;

  let hours = parseInt(parts[0], 10);
  const minutes = parts[1];
  const ampm = hours >= 12 ? 'PM' : 'AM';

  hours = hours % 12;
  hours = hours ? hours : 12; // 0 becomes 12

  return `${hours}:${minutes} ${ampm}`;
}

/**
 * EXACT MATHEMATICAL MIDPOINT FORMULA
 * Calculates the exact mid-point timestamp for any time slot [startTime, endTime].
 * 
 * Formula:
 * Midpoint Minutes = StartMinutes + Math.floor((EndMinutes - StartMinutes) / 2)
 * 
 * Example for 09:40 AM - 10:30 AM (50-minute slot):
 * StartMinutes = 9*60 + 40 = 580
 * EndMinutes   = 10*60 + 30 = 630
 * Midpoint     = 580 + Math.floor(50 / 2) = 605 minutes -> "10:05"
 */
export function calculateSlotMidpoint(startTimeStr, endTimeStr) {
  const [sH, sM] = startTimeStr.split(':').map(Number);
  const [eH, eM] = endTimeStr.split(':').map(Number);

  const startMins = sH * 60 + sM;
  const endMins = eH * 60 + eM;

  const duration = endMins - startMins;
  const midMins = startMins + Math.floor(duration / 2);

  const resH = String(Math.floor(midMins / 60)).padStart(2, '0');
  const resM = String(midMins % 60).padStart(2, '0');

  return `${resH}:${resM}`;
}

/**
 * Standard timetable slots with target times calculated via the Exact Midpoint Formula.
 */
export const STANDARD_SLOTS = [
  { label: 'Current Time', value: '' },
  { label: '08:00 AM - 08:50 AM', value: calculateSlotMidpoint('08:00', '08:50') }, // "08:25"
  { label: '08:50 AM - 09:40 AM', value: calculateSlotMidpoint('08:50', '09:40') }, // "09:15"
  { label: '09:40 AM - 10:30 AM', value: calculateSlotMidpoint('09:40', '10:30') }, // "10:05"
  { label: '10:30 AM - 11:20 AM', value: calculateSlotMidpoint('10:30', '11:20') }, // "10:55"
  { label: '11:20 AM - 12:10 PM', value: calculateSlotMidpoint('11:20', '12:10') }, // "11:45"
  { label: '12:10 PM - 01:00 PM (Lunch)', value: calculateSlotMidpoint('12:10', '13:00') }, // "12:35"
  { label: '01:00 PM - 01:50 PM', value: calculateSlotMidpoint('13:00', '13:50') }, // "13:25"
  { label: '01:50 PM - 02:40 PM', value: calculateSlotMidpoint('13:50', '14:40') }, // "14:15"
  { label: '02:40 PM - 03:30 PM', value: calculateSlotMidpoint('14:40', '15:30') }, // "15:05"
  { label: '03:30 PM - 04:20 PM', value: calculateSlotMidpoint('15:30', '16:20') }, // "15:55"
  { label: '04:20 PM - 05:10 PM', value: calculateSlotMidpoint('16:20', '17:10') }  // "16:45"
];

export const DAYS_OF_WEEK = [
  'Monday',
  'Tuesday',
  'Wednesday',
  'Thursday',
  'Friday',
  'Saturday'
];
