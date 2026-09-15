const mongoose = require('mongoose');

const timetableEntrySchema = new mongoose.Schema(
  {
    batch: {
      type: String,
      required: [true, 'Batch identifier is required'],
      trim: true
    },
    day: {
      type: String,
      required: [true, 'Day is required'],
      enum: ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'],
      trim: true
    },
    subject: {
      type: String,
      required: [true, 'Subject name is required'],
      trim: true
    },
    subjectCode: {
      type: String,
      required: [true, 'Subject code is required'],
      trim: true,
      uppercase: true
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
    classroom: {
      type: String,
      required: [true, 'Classroom room number is required'],
      trim: true,
      uppercase: true
    },
    type: {
      type: String,
      enum: ['LECTURE', 'LAB', 'TUTORIAL'],
      default: 'LECTURE'
    },
    faculty: {
      type: String,
      trim: true,
      default: 'Faculty Member'
    },
    section: {
      type: String,
      trim: true
    }
  },
  {
    timestamps: true
  }
);

// Index for efficient querying by day, classroom, and batch
timetableEntrySchema.index({ day: 1, classroom: 1, startTime: 1 });
timetableEntrySchema.index({ batch: 1 });

module.exports = mongoose.model('TimetableEntry', timetableEntrySchema);
