import { Router } from 'express';
import BookingController from '../controllers/bookingController.js';
import { authenticated } from '../middleware/authMiddleware.js';
import checkObjectId from '../middleware/checkObjectId.js';

const router = Router();

router.get('/', BookingController.getAllBookings);

router.get('/:id', checkObjectId, BookingController.getBookingById);
router.put('/:id', authenticated, checkObjectId, BookingController.updateBookingById);
router.delete('/:id', authenticated, checkObjectId, BookingController.deleteBookingById);

export default router;
