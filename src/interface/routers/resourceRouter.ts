import { Router } from 'express';
import multer from 'multer';
import { resourceController } from '../controllers/ResourceController';

// Configurar Multer para guardar en memoria (buffer) antes de subir a S3
const upload = multer({ storage: multer.memoryStorage() });

const router = Router();

// POST /api/resources (requiere archivo 'file' en form-data)
router.post('/', upload.single('file'), resourceController.uploadResource);

export default router;