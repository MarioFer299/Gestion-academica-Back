import { Router } from 'express';
import { periodController } from '../controllers/PeriodController';
import { authenticate } from '../middlewares/authMiddleware';
import { authorize } from '../middlewares/roleMiddleware';

const router = Router();

router.use(authenticate);
router.use(authorize('ADMIN', 'USER'));

router.get('/', periodController.getAll);
router.get('/:id', periodController.getById);
router.post('/', periodController.create);
router.put('/:id', periodController.update);
router.delete('/:id', periodController.delete);

export default router;