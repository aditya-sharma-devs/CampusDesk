const express = require('express');
const router = express.Router();
const {
  createBooking,
  getAllBookings,
  getMyBookings,
  updateBookingStatus,
  cancelBooking
} = require('../controllers/bookingController');
const { protect, authorize } = require('../middleware/authMiddleware');

// All booking routes require authentication with @thapar.edu account
router.use(protect);

router.post('/', createBooking);
router.get('/', getAllBookings);
router.get('/my', getMyBookings);
router.put('/:id/status', authorize('ADMIN'), updateBookingStatus);
router.patch('/:id/status', authorize('ADMIN'), updateBookingStatus);
router.delete('/:id', cancelBooking);

module.exports = router;
