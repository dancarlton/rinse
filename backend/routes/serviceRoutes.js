import { Router } from 'express';
import ServiceController from '../controllers/serviceController.js';
import { authenticated } from '../middleware/authMiddleware.js';
import checkObjectId from '../middleware/checkObjectId.js';

const router = Router();

router.get('/', ServiceController.getAllServices);

router.get('/:id', checkObjectId, ServiceController.getServiceById);
router.put('/:id', authenticated, checkObjectId, ServiceController.updateServiceById);
router.delete('/:id', authenticated, checkObjectId, ServiceController.deleteServiceById);

export default router;
