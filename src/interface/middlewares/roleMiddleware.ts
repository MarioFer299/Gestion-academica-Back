import { Response, NextFunction } from 'express';
import { AuthRequest } from './authMiddleware';

// Recibe una lista de roles permitidos (ej: 'ADMIN', 'USER')
export const authorize = (...allowedRoles: string[]) => {
  return (req: AuthRequest, res: Response, next: NextFunction) => {
    // 1. Seguridad extra: si por alguna razón no hay usuario, rechazar
    if (!req.user) {
      return res.status(401).json({ error: 'No autenticado' });
    }

    // 2. Verificar si el rol del usuario está en la lista de permitidos
    if (!allowedRoles.includes(req.user.role)) {
      return res.status(403).json({ 
        error: 'Prohibido: No tienes permisos para realizar esta acción' 
      });
    }

    // 3. Si tiene permiso, continuar
    next();
  };
};