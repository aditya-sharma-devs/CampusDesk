const express = require('express');
const router = express.Router();
const { 
  createAnnouncement, 
  getAnnouncements, 
  deleteAnnouncement 
} = require('../controllers/announcementController');
const { protect } = require('../middleware/authMiddleware');

router.post('/', protect, createAnnouncement);
router.get('/', protect, getAnnouncements);
router.delete('/:id', protect, deleteAnnouncement);

module.exports = router;
