const mongoose = require('mongoose');
const dotenv = require('dotenv');
const path = require('path');

dotenv.config({ path: path.join(__dirname, '.env') });

const User = require('./models/User');
const Classroom = require('./models/Classroom');
const TimetableEntry = require('./models/TimetableEntry');
const { sampleClassrooms, sampleTimetableEntries } = require('./data/sampleTimetable');

const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://127.0.0.1:27017/thapar_classroom_db';

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
    email: 'faculty@thapar.edu',
    password: 'password123',
    role: 'FACULTY_ORGANISATION',
    department: 'Computer Science & Engineering'
  },
  {
    name: 'Aarav Mehta',
    email: 'student@thapar.edu',
    password: 'password123',
    role: 'STUDENT',
    department: 'B.Tech COE Undergrad'
  },
  {
    name: 'Dr. Rajesh Sharma (Legacy)',
    email: 'teacher@thapar.edu',
    password: 'password123',
    role: 'FACULTY_ORGANISATION',
    department: 'Computer Science & Engineering'
  },
  {
    name: 'Prof. Ananya Gupta (Legacy)',
    email: 'head@thapar.edu',
    password: 'password123',
    role: 'FACULTY_ORGANISATION',
    department: 'ACM Student Chapter'
  }
];

async function seedData() {
  try {
    console.log('🔄 Connecting to MongoDB at:', MONGODB_URI);
    await mongoose.connect(MONGODB_URI);
    console.log('✅ Connected to MongoDB successfully.');

    // Clear existing collections
    await User.deleteMany({});
    await Classroom.deleteMany({});
    await TimetableEntry.deleteMany({});
    console.log('🗑️  Cleared old records from Database.');

    // Insert Users
    for (const userData of defaultUsers) {
      await User.create(userData);
    }
    console.log(`👤 Seeded ${defaultUsers.length} test users.`);

    // Insert Classrooms
    await Classroom.insertMany(sampleClassrooms);
    console.log(`🏫 Seeded ${sampleClassrooms.length} Thapar classrooms.`);

    // Insert Timetable Entries
    await TimetableEntry.insertMany(sampleTimetableEntries);
    console.log(`📅 Seeded ${sampleTimetableEntries.length} weekly timetable entries.`);

    console.log('\n🎉 Seed process completed successfully!');
    console.log('--------------------------------------------------');
    console.log('Default Credentials:');
    console.log('Teacher:           teacher@thapar.edu / password123');
    console.log('Organisation Head: head@thapar.edu    / password123');
    console.log('Admin:             admin@thapar.edu   / adminpassword123');
    console.log('--------------------------------------------------\n');

    process.exit(0);
  } catch (error) {
    console.error('❌ Seeding failed:', error.message);
    process.exit(1);
  }
}

seedData();
