import { Router } from 'express';
import { subjectController } from '../controllers/SubjectController';
import { authenticate } from '../middlewares/authMiddleware';
import { authorize } from '../middlewares/roleMiddleware';

const router = Router();

router.use(authenticate);
router.use(authorize('ADMIN', 'USER'));

router.get('/', subjectController.getAll);
router.get('/:id', subjectController.getById);
router.post('/', subjectController.create);
router.put('/:id', subjectController.update);
router.delete('/:id', subjectController.delete);

export default router;