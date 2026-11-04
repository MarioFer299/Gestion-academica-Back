import { Router } from 'express';
import { subjectController } from '../controllers/SubjectController';

const router = Router();

// GET /api/subjects?page=1&limit=10&search=matematicas
router.get('/', subjectController.getSubjects);

// POST /api/subjects
router.post('/', subjectController.createSubject);

// DELETE /api/subjects/:id (Borrado lógico)
router.delete('/:id', subjectController.deleteSubject);

export default router;