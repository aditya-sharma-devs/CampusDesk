const express = require('express');
const router = express.Router();
const { createTicket, getAllTickets, updateTicketStatus } = require('../controllers/ticketController');
const { protect, authorize } = require('../middleware/authMiddleware');

router.post('/', protect, createTicket);
router.get('/', protect, getAllTickets);
router.put('/:id/status', protect, authorize('ADMIN'), updateTicketStatus);

module.exports = router;
