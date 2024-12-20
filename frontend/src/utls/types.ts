import { JwtPayload } from "jwt-decode";

// Extend the existing JwtPayload interface
export interface CustomJwtPayload extends JwtPayload {
  sub: string;
  userName: string; // Add your custom properties
  role: string;
}

export type User = {
  id?: number;
  userName?: string;
  role?: string;
};

export type LoginResponse = {
  //user: User;
  token: string;
  error?: string;
};
