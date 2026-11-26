const mongoose = require('mongoose');

const announcementSchema = new mongoose.Schema(
  {
    senderId: {
      type: String,
      required: true
    },
    senderName: {
      type: String,
      required: [true, 'Sender name is required'],
      trim: true
    },
    senderEmail: {
      type: String,
      required: true,
      trim: true
    },
    senderRole: {
      type: String,
      default: 'FACULTY_ORGANISATION'
    },
    targetBatch: {
      type: String,
      required: [true, 'Target batch is required'],
      uppercase: true,
      trim: true
    },
    title: {
      type: String,
      required: [true, 'Announcement title is required'],
      trim: true
    },
    message: {
      type: String,
      required: [true, 'Announcement message is required'],
      trim: true
    },
    tag: {
      type: String,
      enum: ['CLASS_CANCELLED', 'RESCHEDULED', 'URGENT', 'ANNOUNCEMENT'],
      default: 'ANNOUNCEMENT'
    },
    classroom: {
      type: String,
      trim: true,
      uppercase: true,
      default: ''
    },
    day: {
      type: String,
      trim: true,
      default: ''
    },
    startTime: {
      type: String,
      trim: true,
      default: ''
    },
    endTime: {
      type: String,
      trim: true,
      default: ''
    },
    slot: {
      type: String,
      trim: true,
      default: ''
    },
    subject: {
      type: String,
      trim: true,
      default: ''
    },
    subjectCode: {
      type: String,
      trim: true,
      uppercase: true,
      default: ''
    },
    isClassCancelled: {
      type: Boolean,
      default: false
    },
    cancellationDate: {
      type: String,
      trim: true,
      default: '' // YYYY-MM-DD
    },
    weekOfYear: {
      type: Number,
      default: null
    },
    year: {
      type: Number,
      default: null
    },
    expiresAt: {
      type: Date,
      default: null
    },
    facultyId: {
      type: String,
      trim: true,
      default: ''
    },
    facultyEmail: {
      type: String,
      trim: true,
      lowercase: true,
      default: ''
    }
  },
  {
    timestamps: true
  }
);

announcementSchema.index({ targetBatch: 1, createdAt: -1 });

module.exports = mongoose.model('Announcement', announcementSchema);
