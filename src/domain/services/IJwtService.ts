export interface IJwtService {
  generateToken(payload: { id: string; email: string; role: string }): string;
  verifyToken(token: string): { id: string; email: string; role: string };
}