import { verify } from "hono/jwt";

export const verifyToken = (token: string, secret_key: string) => {
  return verify(token, secret_key);
};
