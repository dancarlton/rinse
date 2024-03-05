import { Router } from 'express';
import ReviewController from '../controllers/reviewController.js';

const router = Router();

router.get('/', ReviewController.getAllReviews);

router.get('/:id', ReviewController.getReviewById);
router.put('/:id', ReviewController.updateReviewById);
router.delete('/:id', ReviewController.deleteReviewById);

export default router;
