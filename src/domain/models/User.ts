export enum Role {
  ADMIN = 'ADMIN',
  USER = 'USER'
}

export interface User {
  id: string;
  email: string;
  password: string; // En memoria estará hasheada, pero la interfaz la tiene
  fullName: string;
  role: Role;
  createdAt: Date;
  updatedAt: Date;
}

// Interfaz para las respuestas que NO deben incluir la contraseña
export interface UserResponse {
  id: string;
  email: string;
  fullName: string;
  role: Role;
}