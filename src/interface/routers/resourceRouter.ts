import { Router } from 'express';
import { resourceController } from '../controllers/ResourceController';
import { authenticate } from '../middlewares/authMiddleware';
import { authorize } from '../middlewares/roleMiddleware';

const router = Router();

router.use(authenticate);
router.use(authorize('ADMIN', 'USER'));

router.get('/', resourceController.getAll || resourceController.getFiles);
router.get('/:id', resourceController.getById || resourceController.getFile);
router.post('/', resourceController.create || resourceController.upload); 
router.put('/:id', resourceController.update);
router.delete('/:id', resourceController.delete);

export default router;