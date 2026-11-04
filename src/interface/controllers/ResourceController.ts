import { Request, Response, NextFunction } from 'express';
import { prisma } from '../../infrastructure/database/prismaClient';
import { S3Service } from '../../infrastructure/services/S3Service';

const s3Service = new S3Service();

export class ResourceController {
  async uploadResource(req: Request, res: Response, next: NextFunction) {
    try {
      if (!req.file) {
        return res.status(400).json({ error: 'No se proporcionó ningún archivo' });
      }

      const { title, subjectId, uploadedById } = req.body;

      if (!title || !subjectId || !uploadedById) {
        return res.status(400).json({ error: 'Título, ID de materia y ID de usuario son requeridos' });
      }

      // Generar un nombre único para el archivo
      const fileExtension = req.file.originalname.split('.').pop();
      const fileName = `${Date.now()}-${Math.random().toString(36).substring(7)}.${fileExtension}`;
      const key = `resources/${fileName}`;

      // 1. Subir a S3
      const fileUrl = await s3Service.uploadFile(req.file, key);

      // 2. Guardar referencia en la base de datos
      const resource = await prisma.resource.create({
        data: {
          title,
          fileUrl: key, // Guardamos la clave (key) para poder generar URLs firmadas después
          fileType: req.file.mimetype,
          subjectId,
          uploadedById,
        },
      });

      return res.status(201).json({
        success: true,
        message: 'Recurso subido exitosamente',
        data: { ...resource, publicUrl: fileUrl }
      });
    } catch (error) {
      next(error);
    }
  }
}

export const resourceController = new ResourceController();