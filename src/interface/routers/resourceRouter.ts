// src/interface/routers/resourceRouter.ts
import { Router } from 'express';
import { resourceController } from '../controllers/ResourceController';
import { authenticate } from '../middlewares/authMiddleware';
import { authorize } from '../middlewares/roleMiddleware';
import { upload } from '../middlewares/uploadMiddleware'; // 👈 AGREGA ESTA LÍNEA

const router = Router();

router.use(authenticate);
router.use(authorize('ADMIN', 'USER'));

router.get('/', resourceController.getAll);
router.get('/:id', resourceController.getById);

// 👇 AQUÍ ESTÁ LA MAGIA: upload.single('file') procesa el archivo antes de llegar al controlador
router.post('/', upload.single('file'), resourceController.create); 

router.put('/:id', resourceController.update);
router.delete('/:id', resourceController.delete);

export default router;