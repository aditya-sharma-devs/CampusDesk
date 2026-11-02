const mongoose = require('mongoose');
const { extractBlockFromRoom } = require('../utils/blockUtils');

const bookingSchema = new mongoose.Schema(
  {
    bookingId: {
      type: String,
      required: true,
      unique: true,
      trim: true,
      uppercase: true
    },
    roomNumber: {
      type: String,
      required: [true, 'Classroom room number is required'],
      trim: true,
      uppercase: true
    },
    block: {
      type: String,
      trim: true
    },
    day: {
      type: String,
      required: [true, 'Day of week is required'],
      enum: ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'],
      trim: true
    },
    startTime: {
      type: String,
      required: [true, 'Start time is required (HH:mm)'],
      trim: true
    },
    endTime: {
      type: String,
      required: [true, 'End time is required (HH:mm)'],
      trim: true
    },
    slot: {
      type: String,
      trim: true
    },
    description: {
      type: String,
      required: [true, 'Booking purpose/description is required'],
      trim: true
    },
    category: {
      type: String,
      enum: [
        'Guest Lecture',
        'Makeup Class',
        'Student Society Event',
        'Workshop / Hackathon',
        'Faculty Meeting',
        'Exam / Test',
        'Other'
      ],
      default: 'Guest Lecture'
    },
    requestedBy: {
      id: String,
      name: { type: String, required: true },
      email: { type: String, required: true },
      role: { type: String, default: 'TEACHER' },
      department: { type: String, default: 'Computer Science & Engineering' }
    },
    status: {
      type: String,
      enum: ['PENDING', 'APPROVED', 'REJECTED'],
      default: 'PENDING'
    },
    adminRemarks: {
      type: String,
      default: ''
    },
    processedBy: {
      name: String,
      email: String,
      at: Date
    }
  },
  {
    timestamps: true
  }
);

// Auto-derive block before saving
bookingSchema.pre('save', function (next) {
  if (!this.block && this.roomNumber) {
    this.block = extractBlockFromRoom(this.roomNumber);
  }
  next();
});

// Indexes for fast lookup
bookingSchema.index({ day: 1, roomNumber: 1, status: 1 });
bookingSchema.index({ 'requestedBy.email': 1 });

module.exports = mongoose.model('Booking', bookingSchema);
