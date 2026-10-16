/**
 * Sample Timetable Data for Thapar Institute of Engineering & Technology
 * Contains representative classrooms across T, LT, F, E, L, and LP Blocks.
 */

const sampleClassrooms = [
  { roomNumber: 'T101', roomType: 'LECTURE', capacity: 60 },
  { roomNumber: 'T102', roomType: 'LECTURE', capacity: 60 },
  { roomNumber: 'T106', roomType: 'LECTURE', capacity: 80 },
  { roomNumber: 'T107', roomType: 'LECTURE', capacity: 80 },
  { roomNumber: 'T108', roomType: 'LECTURE', capacity: 80 },
  { roomNumber: 'T109', roomType: 'LECTURE', capacity: 80 },

  { roomNumber: 'LT101', roomType: 'LECTURE', capacity: 150 },
  { roomNumber: 'LT102', roomType: 'LECTURE', capacity: 150 },
  { roomNumber: 'LT301', roomType: 'LECTURE', capacity: 180 },
  { roomNumber: 'LT302', roomType: 'LECTURE', capacity: 180 },
  { roomNumber: 'LT303', roomType: 'LECTURE', capacity: 200 },
  { roomNumber: 'LT304', roomType: 'LECTURE', capacity: 200 },

  { roomNumber: 'F201', roomType: 'LECTURE', capacity: 70 },
  { roomNumber: 'F202', roomType: 'LECTURE', capacity: 70 },
  { roomNumber: 'F203', roomType: 'LECTURE', capacity: 70 },
  { roomNumber: 'F204', roomType: 'LECTURE', capacity: 70 },

  { roomNumber: 'E101', roomType: 'LECTURE', capacity: 65 },
  { roomNumber: 'E102', roomType: 'LECTURE', capacity: 65 },
  { roomNumber: 'E104', roomType: 'LECTURE', capacity: 75 },
  { roomNumber: 'E105', roomType: 'LECTURE', capacity: 75 },

  { roomNumber: 'L301', roomType: 'LECTURE', capacity: 90 },
  { roomNumber: 'L302', roomType: 'LECTURE', capacity: 90 },
  { roomNumber: 'L303', roomType: 'LECTURE', capacity: 90 },
  { roomNumber: 'L304', roomType: 'LECTURE', capacity: 90 },

  { roomNumber: 'LP108', roomType: 'LECTURE', capacity: 100 },
  { roomNumber: 'LP109', roomType: 'LECTURE', capacity: 100 },
  { roomNumber: 'LP110', roomType: 'LECTURE', capacity: 100 }
];

const sampleTimetableEntries = [
  // --- MONDAY ---
  { batch: '3P14', day: 'Monday', subject: 'Computer Architecture and Organization', subjectCode: 'CAO', startTime: '09:40', endTime: '10:30', classroom: 'T106', type: 'LECTURE', faculty: 'Dr. Rajesh Sharma' },
  { batch: '3P14', day: 'Monday', subject: 'Software Engineering', subjectCode: 'SE', startTime: '10:30', endTime: '11:20', classroom: 'T106', type: 'LECTURE', faculty: 'Dr. Neha Verma' },
  { batch: '3P14', day: 'Monday', subject: 'Cloud Computing', subjectCode: 'CC', startTime: '11:20', endTime: '12:10', classroom: 'T106', type: 'LECTURE', faculty: 'Prof. Amit Patel' },
  { batch: '3CO1', day: 'Monday', subject: 'Enterprise Resource Management', subjectCode: 'ERM', startTime: '09:40', endTime: '10:30', classroom: 'LT303', type: 'LECTURE', faculty: 'Dr. S. K. Singh' },
  { batch: '3CO1', day: 'Monday', subject: 'Database Management Systems', subjectCode: 'DBMS', startTime: '10:30', endTime: '11:20', classroom: 'LT303', type: 'LECTURE', faculty: 'Dr. Meenakshi' },
  { batch: '3CO2', day: 'Monday', subject: 'Computer Networks', subjectCode: 'CN', startTime: '13:00', endTime: '13:50', classroom: 'F201', type: 'LECTURE', faculty: 'Dr. Vikas Kumar' },
  { batch: '3CO2', day: 'Monday', subject: 'Artificial Intelligence', subjectCode: 'AI', startTime: '13:50', endTime: '14:40', classroom: 'E104', type: 'LECTURE', faculty: 'Dr. Ananya Roy' },
  
  // LAB ENTRY on Monday (Excluded from lecture hall availability as per Requirement 18)
  { batch: '3P14', day: 'Monday', subject: 'Software Engineering Lab [Lab]', subjectCode: 'SE-LAB', startTime: '14:40', endTime: '16:20', classroom: 'LP109', type: 'LAB', faculty: 'Er. Tarunpreet' },

  // --- TUESDAY ---
  { batch: '3P14', day: 'Tuesday', subject: 'Software Engineering', subjectCode: 'SE', startTime: '08:50', endTime: '09:40', classroom: 'T106', type: 'LECTURE', faculty: 'Dr. Neha Verma' },
  { batch: '3P14', day: 'Tuesday', subject: 'Computer Architecture and Organization', subjectCode: 'CAO', startTime: '09:40', endTime: '10:30', classroom: 'T107', type: 'LECTURE', faculty: 'Dr. Rajesh Sharma' },
  { batch: '3CO1', day: 'Tuesday', subject: 'Cloud Computing', subjectCode: 'CC', startTime: '11:20', endTime: '12:10', classroom: 'LT301', type: 'LECTURE', faculty: 'Prof. Amit Patel' },
  { batch: '3CO2', day: 'Tuesday', subject: 'Enterprise Resource Management', subjectCode: 'ERM', startTime: '13:00', endTime: '13:50', classroom: 'LT303', type: 'LECTURE', faculty: 'Dr. S. K. Singh' },
  { batch: '3CO3', day: 'Tuesday', subject: 'Operating Systems', subjectCode: 'OS', startTime: '14:40', endTime: '15:30', classroom: 'L302', type: 'LECTURE', faculty: 'Dr. Harpreet Kaur' },

  // --- WEDNESDAY ---
  { batch: '3P14', day: 'Wednesday', subject: 'Cloud Computing', subjectCode: 'CC', startTime: '09:40', endTime: '10:30', classroom: 'T106', type: 'LECTURE', faculty: 'Prof. Amit Patel' },
  { batch: '3P14', day: 'Wednesday', subject: 'Database Management Systems', subjectCode: 'DBMS', startTime: '10:30', endTime: '11:20', classroom: 'T106', type: 'LECTURE', faculty: 'Dr. Meenakshi' },
  { batch: '3CO1', day: 'Wednesday', subject: 'Computer Networks', subjectCode: 'CN', startTime: '11:20', endTime: '12:10', classroom: 'LT302', type: 'LECTURE', faculty: 'Dr. Vikas Kumar' },
  { batch: '3CO2', day: 'Wednesday', subject: 'Software Engineering', subjectCode: 'SE', startTime: '13:50', endTime: '14:40', classroom: 'F202', type: 'LECTURE', faculty: 'Dr. Neha Verma' },
  
  // LAB ENTRY on Wednesday
  { batch: '3CO1', day: 'Wednesday', subject: 'Computer Networks Lab [Lab]', subjectCode: 'CN-LAB', startTime: '14:40', endTime: '16:20', classroom: 'LP108', type: 'LAB', faculty: 'Dr. Vikas Kumar' },

  // --- THURSDAY ---
  { batch: '3P14', day: 'Thursday', subject: 'Computer Architecture and Organization', subjectCode: 'CAO', startTime: '10:30', endTime: '11:20', classroom: 'T106', type: 'LECTURE', faculty: 'Dr. Rajesh Sharma' },
  { batch: '3CO1', day: 'Thursday', subject: 'Artificial Intelligence', subjectCode: 'AI', startTime: '11:20', endTime: '12:10', classroom: 'LT303', type: 'LECTURE', faculty: 'Dr. Ananya Roy' },
  { batch: '3CO2', day: 'Thursday', subject: 'Cloud Computing', subjectCode: 'CC', startTime: '13:00', endTime: '13:50', classroom: 'E104', type: 'LECTURE', faculty: 'Prof. Amit Patel' },
  { batch: '3CO3', day: 'Thursday', subject: 'Database Management Systems', subjectCode: 'DBMS', startTime: '15:30', endTime: '16:20', classroom: 'L301', type: 'LECTURE', faculty: 'Dr. Meenakshi' },

  // --- FRIDAY ---
  { batch: '3P14', day: 'Friday', subject: 'Software Engineering', subjectCode: 'SE', startTime: '09:40', endTime: '10:30', classroom: 'T106', type: 'LECTURE', faculty: 'Dr. Neha Verma' },
  { batch: '3CO1', day: 'Friday', subject: 'Enterprise Resource Management', subjectCode: 'ERM', startTime: '10:30', endTime: '11:20', classroom: 'LT303', type: 'LECTURE', faculty: 'Dr. S. K. Singh' },
  { batch: '3CO2', day: 'Friday', subject: 'Computer Architecture and Organization', subjectCode: 'CAO', startTime: '11:20', endTime: '12:10', classroom: 'F201', type: 'LECTURE', faculty: 'Dr. Rajesh Sharma' },
  { batch: '3CO3', day: 'Friday', subject: 'Computer Networks', subjectCode: 'CN', startTime: '13:50', endTime: '14:40', classroom: 'L302', type: 'LECTURE', faculty: 'Dr. Vikas Kumar' }
];

module.exports = {
  sampleClassrooms,
  sampleTimetableEntries
};
