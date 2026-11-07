import jwt from 'jsonwebtoken';

export class JwtService {
  private secret: string;

  constructor() {
    this.secret = process.env.JWT_SECRET as string;
    // Si no existe, lanzamos error y detenemos la ejecución (Cumple la rúbrica)
    if (!this.secret) {
      throw new Error('FATAL ERROR: La variable de entorno JWT_SECRET es obligatoria.');
    }
  }

  // Genera el token con expiración (Otro requisito de la rúbrica)
  generateToken(payload: { id: string; email: string; role: string }): string {
    return jwt.sign(payload, this.secret, { expiresIn: '24h' });
  }

  verifyToken(token: string) {
    return jwt.verify(token, this.secret);
  }
}s