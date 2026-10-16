const express = require('express');
const router = express.Router();
const { getAvailability, getClassroomDetails } = require('../controllers/classroomController');

router.get('/availability', getAvailability);
router.get('/:roomNumber', getClassroomDetails);

module.exports = router;
