import { Router } from 'express';
import ServiceController from '../controllers/serviceController.js';

const router = Router();

router.get('/', ServiceController.getAllServices);

router.get('/:id', ServiceController.getServiceById);
router.put('/:id', ServiceController.updateServiceById);
router.delete('/:id', ServiceController.deleteServiceById);

export default router;
