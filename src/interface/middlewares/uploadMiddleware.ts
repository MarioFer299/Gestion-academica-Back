// src/interface/middlewares/uploadMiddleware.ts
import multer from 'multer';

// Guardamos el archivo en la memoria del servidor temporalmente antes de subirlo a S3
const storage = multer.memoryStorage();

export const upload = multer({
  storage,
  limits: {
    fileSize: 10 * 1024 * 1024, // Límite de 10MB por archivo
  },
});