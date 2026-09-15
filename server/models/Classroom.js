const mongoose = require('mongoose');
const { extractBlockFromRoom } = require('../utils/blockUtils');

const classroomSchema = new mongoose.Schema(
  {
    roomNumber: {
      type: String,
      required: [true, 'Room number is required'],
      unique: true,
      trim: true,
      uppercase: true
    },
    block: {
      type: String,
      trim: true
    },
    roomType: {
      type: String,
      enum: ['LECTURE', 'LAB', 'SEMINAR_HALL'],
      default: 'LECTURE'
    },
    capacity: {
      type: Number,
      default: 60
    },
    isActive: {
      type: Boolean,
      default: true
    }
  },
  {
    timestamps: true
  }
);

// Automatically set block before saving if not explicitly set
classroomSchema.pre('save', function (next) {
  if (!this.block && this.roomNumber) {
    this.block = extractBlockFromRoom(this.roomNumber);
  }
  next();
});

module.exports = mongoose.model('Classroom', classroomSchema);
