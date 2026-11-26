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
    }
  },
  {
    timestamps: true
  }
);

announcementSchema.index({ targetBatch: 1, createdAt: -1 });

module.exports = mongoose.model('Announcement', announcementSchema);
