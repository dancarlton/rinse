import { Router } from 'express';
import UserController from '../controllers/userController.js';
import { authenticated, admin, provider } from '../middleware/authMiddleware.js';
import checkObjectId from '../middleware/checkObjectId.js';

const router = Router();

router.get('/', UserController.getAllUsers);

router.post('/local', UserController.createUserLocal);

router.get('/current', authenticated, UserController.getCurrentUser);

router.put('/profile', authenticated, UserController.updateCurrentUserProfile);

router.get('/:id', checkObjectId, UserController.getUserById);
router.put('/:id', authenticated, checkObjectId, UserController.updateUserById);
router.delete('/:id', authenticated, checkObjectId, UserController.deleteUserById);

// services of the user
router.get('/:id/services', checkObjectId, UserController.getAllUserServices);
router.post('/:id/services', authenticated, checkObjectId, UserController.createUserService);

// bookings of the user
router.get('/:id/bookings', checkObjectId, UserController.getAllUserBookings);
router.post('/:id/bookings', authenticated, checkObjectId, UserController.createUserBooking);

// reviews of the user
router.get('/:id/reviews', checkObjectId, UserController.getAllUserReviews);
router.post('/:id/reviews', authenticated, checkObjectId, UserController.createUserReview);

export default router;
