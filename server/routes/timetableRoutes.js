const express = require('express');
const router = express.Router();
const { getAllEntries } = require('../controllers/timetableController');

router.get('/', getAllEntries);

module.exports = router;
