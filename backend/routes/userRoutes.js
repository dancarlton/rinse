import { Router } from 'express';
import UserController from '../controllers/userController.js';

const router = Router();

router.get('/', UserController.getAllUsers);

router.post('/local', UserController.createUserLocal);

router.get('/current', UserController.getCurrentUser);

router.get('/:id', UserController.getUserById);
router.put('/:id', UserController.updateUserById);
router.delete('/:id', UserController.deleteUserById);

// services of the user
router.get('/:id/services', UserController.getAllUserServices);
router.post('/:id/services', UserController.createUserService);

// bookings of the user
router.get('/:id/bookings', UserController.getAllUserBookings);
router.post('/:id/bookings', UserController.createUserBooking);

// reviews of the user
router.get('/:id/reviews', UserController.getAllUserReviews);
router.post('/:id/reviews', UserController.createUserReview);

export default router;
