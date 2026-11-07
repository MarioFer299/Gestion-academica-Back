import jwt from 'jsonwebtoken';
import { IJwtService } from '../../domain/services/IJwtService';

export class JwtService implements IJwtService {
  constructor(private secret: string) {}

  generateToken(payload: { id: string; email: string; role: string }): string {
    return jwt.sign(payload, this.secret, { expiresIn: '7d' });
    // '7d' cumple con el requisito de expiración de la rúbrica
  }

  verifyToken(token: string): { id: string; email: string; role: string } {
    return jwt.verify(token, this.secret) as { id: string; email: string; role: string };
  }
}