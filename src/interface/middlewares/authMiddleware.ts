import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';

// 1. Extendemos la interfaz Request de Express para incluir la propiedad 'user'
export interface AuthRequest extends Request {
  user?: {
    id: string;
    email: string;
    role: string;
  };
}

export const authenticate = (req: AuthRequest, res: Response, next: NextFunction) => {
  try {
    // 2. Obtener el header de autorización
    const authHeader = req.headers.authorization;

    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return res.status(401).json({ error: 'No autenticado: Token no proporcionado o formato inválido' });
    }

    // 3. Extraer el token
    const token = authHeader.split(' ')[1];
    const secret = process.env.JWT_SECRET;

    if (!secret) {
      console.error('FATAL: JWT_SECRET no está configurado');
      return res.status(500).json({ error: 'Error de configuración del servidor' });
    }

    // 4. Verificar el token (esto también valida la expiración automáticamente)
    const decoded = jwt.verify(token, secret) as { id: string; email: string; role: string };

    // 5. Adjuntar los datos del usuario a la request para usarlos en los casos de uso
    req.user = decoded;
    
    next(); // Continuar al siguiente middleware o controlador
  } catch (error) {
    // Si jwt.verify falla (token expirado o inválido), cae aquí
    return res.status(401).json({ error: 'No autenticado: Token inválido o expirado' });
  }
};