import { Router } from 'express';
import UserController from '../controllers/userController.js';

const router = Router();

router.get('/', UserController.getAllUsers);

router.post('/local', UserController.createUserLocal);

router.get('/current', UserController.getCurrentUser);

router.get('/:id', UserController.getUserById);
router.put('/:id', UserController.updateUserById);
router.delete('/:id', UserController.deleteUserById);

// router.get('/:id/services', UserController.getAllUserServices);
// router.post('/:id/services', UserContrBooking);
// router.get('/:id/services/:serviceId', UserController.getUserService);
// router.put('/:id/services/:serviceId', UserController.updateUserService);
// router.delete('/:id/services/:serviceId', UserController.deleteUserService);

// router.get('/:id/bookings', UserController.getAllUserBookings);
// router.post('/:id/bookings', UserController.createUserBooking);
// router.get('/:id/bookings/:serviceId', UserController.getUserBooking);
// router.put('/:id/bookings/:serviceId', UserController.updateUserBooking);
// router.delete('/:id/bookings/:serviceId', UserController.deleteUserBooking);

// router.get('/:id/reviews', UserController.getAllUserReviews);
// router.post('/:id/reviews', UserController.createUserReview);
// router.get('/:id/reviews/:reviewId', UserController.getUserReview);
// router.put('/:id/reviews/:reviewId', UserController.updateUserReview);
// router.delete('/:id/reviews/:reviewId', UserController.deleteUserReview);

export default router;
