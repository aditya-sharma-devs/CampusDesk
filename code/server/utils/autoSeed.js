const User = require('../models/User');
const Classroom = require('../models/Classroom');
const TimetableEntry = require('../models/TimetableEntry');
const { sampleClassrooms, sampleTimetableEntries } = require('../data/sampleTimetable');

const defaultUsers = [
  {
    name: 'System Admin',
    email: 'admin@thapar.edu',
    password: 'adminpassword123',
    role: 'ADMIN',
    department: 'Academic Affairs'
  },
  {
    name: 'Dr. Rajesh Sharma',
    email: 'teacher@thapar.edu',
    password: 'password123',
    role: 'TEACHER',
    department: 'Computer Science & Engineering'
  },
  {
    name: 'Prof. Ananya Gupta',
    email: 'head@thapar.edu',
    password: 'password123',
    role: 'ORGANISATION_HEAD',
    department: 'ACM Student Chapter'
  }
];

async function ensureSeeded() {
  try {
    const userCount = await User.countDocuments();
    if (userCount === 0) {
      console.log('🌱 No users found in database. Auto-seeding initial users...');
      for (const u of defaultUsers) {
        await User.create(u);
      }
      console.log('✅ Auto-seeded default users (admin@thapar.edu, teacher@thapar.edu, head@thapar.edu).');
    }

    const roomCount = await Classroom.countDocuments();
    if (roomCount === 0) {
      console.log('🌱 No classrooms found in database. Auto-seeding initial classrooms...');
      await Classroom.insertMany(sampleClassrooms);
      console.log(`✅ Auto-seeded ${sampleClassrooms.length} classrooms.`);
    }

    const entryCount = await TimetableEntry.countDocuments();
    if (entryCount === 0) {
      console.log('🌱 No timetable entries found in database. Auto-seeding initial timetable entries...');
      await TimetableEntry.insertMany(sampleTimetableEntries);
      console.log(`✅ Auto-seeded ${sampleTimetableEntries.length} timetable entries.`);
    }
  } catch (err) {
    console.warn('⚠️ Auto-seed check failed:', err.message);
  }
}

module.exports = { ensureSeeded };
