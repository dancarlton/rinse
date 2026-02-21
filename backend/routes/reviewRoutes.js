import { Router } from 'express';
import ReviewController from '../controllers/reviewController.js';
import { authenticated } from '../middleware/authMiddleware.js';
import checkObjectId from '../middleware/checkObjectId.js';

const router = Router();

router.get('/', ReviewController.getAllReviews);

router.get('/:id', checkObjectId, ReviewController.getReviewById);
router.put('/:id', authenticated, checkObjectId, ReviewController.updateReviewById);
router.delete('/:id', authenticated, checkObjectId, ReviewController.deleteReviewById);

export default router;
