import { Router } from 'express';
import { subjectController } from '../controllers/SubjectController';

const router = Router();

// GET /api/subjects?page=1&limit=10&search=matematicas
router.get('/', subjectController.getSubjects);

export default router;