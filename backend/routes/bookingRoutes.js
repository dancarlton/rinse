import { Router } from 'express';
import BookingController from '../controllers/bookingController.js';

const router = Router();

router.get('/', BookingController.getAllBookings);

router.get('/:id', BookingController.getBookingById);
router.put('/:id', BookingController.updateBookingById);
router.delete('/:id', BookingController.deleteBookingById);

export default router;
