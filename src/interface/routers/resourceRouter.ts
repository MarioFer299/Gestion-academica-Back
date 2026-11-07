import { Router } from 'express';
import { resourceController } from '../controllers/ResourceController';
import { authenticate } from '../middlewares/authMiddleware';
import { authorize } from '../middlewares/roleMiddleware';

const router = Router();

router.use(authenticate);
router.use(authorize('ADMIN', 'USER'));

// ✅ Sin fallbacks - los métodos ya existen en el controller
router.get('/', resourceController.getAll);
router.get('/:id', resourceController.getById);
router.post('/', resourceController.create);
router.put('/:id', resourceController.update);
router.delete('/:id', resourceController.delete);

export default router;