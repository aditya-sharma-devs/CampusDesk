const mongoose = require('mongoose');
const { extractBlockFromRoom } = require('../utils/blockUtils');

const ticketSchema = new mongoose.Schema(
  {
    ticketId: {
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
    category: {
      type: String,
      required: [true, 'Issue category is required'],
      enum: [
        'Projector & AV Display',
        'Microphone & Sound System',
        'Air Conditioning & Lighting',
        'Whiteboard & Markers',
        'Podium & Seating',
        'Other'
      ],
      default: 'Projector & AV Display'
    },
    description: {
      type: String,
      required: [true, 'Issue description is required'],
      trim: true
    },
    reportedBy: {
      id: String,
      name: { type: String, required: true },
      email: { type: String, required: true },
      role: { type: String, default: 'TEACHER' }
    },
    status: {
      type: String,
      enum: ['PENDING', 'UNDER_MAINTENANCE', 'RESOLVED'],
      default: 'PENDING'
    },
    adminNotes: {
      type: String,
      default: ''
    }
  },
  {
    timestamps: true
  }
);

// Auto-derive block before saving
ticketSchema.pre('save', function (next) {
  if (!this.block && this.roomNumber) {
    this.block = extractBlockFromRoom(this.roomNumber);
  }
  next();
});

module.exports = mongoose.model('Ticket', ticketSchema);
