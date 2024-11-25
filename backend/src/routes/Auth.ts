import { compare } from "bcrypt";
import { prisma } from "../Prisma";
import { Context } from "hono";
import { sign, verify } from "hono/jwt";
import { User } from "@prisma/client";

export const AuthRouteRoot = () => {
  const secret_key = process.env.secret_key;
  const refresh_secret_key = process.env.refresh_secret_key;

  return async (c: Context) => {
    try {
      const { username, password } = await c.req.json();
      const user = await prisma.user.findUnique({
        where: {
          userName: username,
        },
      });

      if (!user || !(await compare(password, user.password))) {
        return c.json({ error: "Invalid credentials" }, 401);
      }

      const accessToken = await sign(
        {
          sub: user.id.toString(),
          userName: user.userName,
          role: "default",
          exp: Math.floor(Date.now() / 1000) + 15 * 60,
        },
        secret_key!,
        "HS256"
      );

      //const secret_key = "so-secret";
      const refreshToken = await sign(
        {
          sub: user.id.toString(),
          userName: user.userName,
          role: "default",
          exp: Math.floor(Date.now() / 1000) + 7 * 24 * 60 * 60,
        },
        refresh_secret_key!,
        "HS256"
      );

      await prisma.refreshToken.create({
        data: {
          token: refreshToken,
          userId: user.id,
          expiresAt: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
          revoked: false,
        },
      });
      return c.json({
        accessToken,
        refreshToken,
        user: {
          id: user.id,
          userName: user.userName,
        },
      });
    } catch (error) {
      return c.json({ message: error });
    }
  };
};

export const AuthRouteVerify = () => {
  const secret_key = process.env.secret_key;
  const refresh_secret_key = process.env.refresh_secret_key;

  return async (c: Context) => {
    let token, tokenData;

    try {
      const authHeader = c.req.header("Authorization");
      if (!authHeader || !authHeader.startsWith("Bearer ")) {
        return c.json({ error: "No token provided" }, 401);
      }

      token = authHeader.split(" ")[1]; //Remove 'bearer' prefix

      if (!token) {
        return c.json({ error: "No token provided" }, 400);
      }
      tokenData = (await verify(token, secret_key!)) as any; //TODO fix this any

      if (!tokenData.sub || !tokenData.userName) {
        return c.json({ error: "Invalid token data" }, 400);
      }
      const user = await prisma.user.findUnique({
        where: {
          id: parseInt(tokenData.sub),
          userName: tokenData.userName!,
        },
      });
      if (!user) {
        return c.json({ error: "User not found" }, 400);
      }
      const accessToken = await sign(
        {
          sub: user.id.toString(),
          userName: user.userName,
          role: "default",
          exp: Math.floor(Date.now() / 1000) + 15 * 60, // 15 minutes
        },
        secret_key!,
        "HS256"
      );

      const refreshToken = await sign(
        {
          sub: user.id.toString(),
          type: "refresh",
          exp: Math.floor(Date.now() / 1000) + 7 * 24 * 60 * 60, // 7 days
        },
        refresh_secret_key!,
        "HS256"
      );

      const newToken = await sign(
        {
          sub: user.id.toString(),
          userName: user.userName,
          role: "default",
        },
        secret_key!,
        "HS256"
      );
      return c.json({ token: newToken });
    } catch (e) {
      console.error("ERROR HERE: ", e);
      return c.json(
        {
          error: "Invalid token",
          details:
            process.env.NODE_ENV === "development" ? e.message : undefined,
        },

        401
      );
    }
  };
};

export const RefreshTokenRoute = () => {
  const secret_key = process.env.secret_key;
  const refresh_secret_key = process.env.refresh_secret_key;

  return async (c: Context) => {
    try {
      const { refreshToken } = await c.req.json();

      // Verify refresh token
      const decoded = await verify(refreshToken, refresh_secret_key!);

      // Check if token is in database and not revoked
      const storedToken = await prisma.refreshToken.findFirst({
        where: {
          token: refreshToken,
          revoked: false,
          expiresAt: {
            gt: new Date(),
          },
        },
      });

      if (!storedToken) {
        return c.json({ error: "Invalid refresh token" }, 401);
      }

      // Generate new access token
      const newAccessToken = await sign(
        {
          sub: decoded.sub,
          userName: decoded.userName,
          role: "default",
        },
        secret_key!
      );

      return c.json({
        accessToken: newAccessToken,
        refreshToken, // Optional: can also generate new refresh token
      });
    } catch (e) {
      return c.json({ error: "Invalid refresh token" }, 401);
    }
  };
};
