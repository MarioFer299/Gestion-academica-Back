import { Response, NextFunction } from 'express';
import { AuthRequest } from '../middlewares/authMiddleware';
import { prisma } from '../../infrastructure/database/prismaClient';
import { S3Service } from '../../infrastructure/services/S3Service';

const s3Service = new S3Service();

export class ResourceController {
  // GET /api/resources - Listar todos los recursos del usuario
  async getAll(req: AuthRequest, res: Response, next: NextFunction) {
    try {
      const userId = req.user!.id;
      const { page = '1', limit = '10', subjectId } = req.query;

      const where: any = {
        deletedAt: null,
        subject: {
          period: { userId } // Solo recursos de los períodos del usuario
        }
      };

      if (subjectId) {
        where.subjectId = subjectId;
      }

      const [resources, total] = await Promise.all([
        prisma.resource.findMany({
          where,
          include: {
            subject: {
              include: {
                period: true
              }
            }
          },
          skip: (parseInt(page as string) - 1) * parseInt(limit as string),
          take: parseInt(limit as string),
          orderBy: { createdAt: 'desc' }
        }),
        prisma.resource.count({ where })
      ]);

      return res.status(200).json({
        data: resources,
        pagination: {
          total,
          currentPage: parseInt(page as string),
          limit: parseInt(limit as string),
          totalPages: Math.ceil(total / parseInt(limit as string))
        }
      });
    } catch (error) {
      next(error);
    }
  }

  // GET /api/resources/:id - Obtener un recurso específico
  async getById(req: AuthRequest, res: Response, next: NextFunction) {
    try {
      const userId = req.user!.id;
      const { id } = req.params;

      const resource = await prisma.resource.findFirst({
        where: {
          id,
          deletedAt: null,
          subject: {
            period: { userId }
          }
        },
        include: {
          subject: {
            include: {
              period: true
            }
          }
        }
      });

      if (!resource) {
        return res.status(404).json({ error: 'Recurso no encontrado' });
      }

      // Generar URL firmada si es necesario (para archivos privados)
      const publicUrl = await s3Service.getFileUrl(resource.fileUrl);

      return res.status(200).json({
        ...resource,
        publicUrl
      });
    } catch (error) {
      next(error);
    }
  }

  // POST /api/resources - Subir un nuevo recurso (tu método original renombrado)
  async create(req: AuthRequest, res: Response, next: NextFunction) {
    try {
      if (!req.file) {
        return res.status(400).json({ error: 'No se proporcionó ningún archivo' });
      }

      const userId = req.user!.id; // Usamos el ID del token, NO del body
      const { title, subjectId } = req.body;

      if (!title || !subjectId) {
        return res.status(400).json({ error: 'Título e ID de materia son requeridos' });
      }

      // Verificar que la materia pertenezca al usuario
      const subject = await prisma.subject.findFirst({
        where: {
          id: subjectId,
          period: { userId }
        }
      });

      if (!subject) {
        return res.status(404).json({ error: 'Materia no encontrada o no tienes permiso' });
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
          fileUrl: key,
          fileType: req.file.mimetype,
          subjectId,
          uploadedById: userId, // Usamos el ID del token
        },
        include: {
          subject: {
            include: {
              period: true
            }
          }
        }
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

  // PUT /api/resources/:id - Actualizar metadatos de un recurso
  async update(req: AuthRequest, res: Response, next: NextFunction) {
    try {
      const userId = req.user!.id;
      const { id } = req.params;
      const { title } = req.body;

      // Verificar que el recurso pertenezca al usuario
      const existingResource = await prisma.resource.findFirst({
        where: {
          id,
          subject: {
            period: { userId }
          }
        }
      });

      if (!existingResource) {
        return res.status(404).json({ error: 'Recurso no encontrado o no tienes permiso' });
      }

      const updatedResource = await prisma.resource.update({
        where: { id },
        data: {
          title: title || existingResource.title
        },
        include: {
          subject: {
            include: {
              period: true
            }
          }
        }
      });

      return res.status(200).json({
        success: true,
        message: 'Recurso actualizado exitosamente',
        data: updatedResource
      });
    } catch (error) {
      next(error);
    }
  }

  // DELETE /api/resources/:id - Eliminación lógica
  async delete(req: AuthRequest, res: Response, next: NextFunction) {
    try {
      const userId = req.user!.id;
      const { id } = req.params;

      // Verificar que el recurso pertenezca al usuario
      const existingResource = await prisma.resource.findFirst({
        where: {
          id,
          subject: {
            period: { userId }
          }
        }
      });

      if (!existingResource) {
        return res.status(404).json({ error: 'Recurso no encontrado o no tienes permiso' });
      }

      // Eliminación lógica
      await prisma.resource.update({
        where: { id },
        data: { deletedAt: new Date() }
      });

      return res.status(200).json({
        success: true,
        message: 'Recurso eliminado exitosamente'
      });
    } catch (error) {
      next(error);
    }
  }
}

export const resourceController = new ResourceController();