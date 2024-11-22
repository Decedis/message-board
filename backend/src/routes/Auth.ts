import { compare } from "bcrypt";
import { prisma } from "../Prisma";
import { Context } from "hono";
import { sign, verify } from "hono/jwt";
import { User } from "@prisma/client";

export const AuthRouteRoot = () => {
  const secret_key = process.env.secret_key;

  return async (c: Context) => {
    const { username, password } = await c.req.json();
    const user = await prisma.user.findUnique({
      where: {
        userName: username,
      },
    });

    try {
      if (!user) {
        return c.json({ message: "No user found" });
      }

      console.log("User found");

      const resultingPasswordComparison = await compare(
        password,
        user.password
      );

      if (!resultingPasswordComparison) {
        return c.json({ message: "Passwords did not match" });
      }

      //const secret_key = "so-secret";
      const payload = {
        sub: user.id,
        userName: user.userName,
        role: "default",
      };
      const token = await sign(payload, secret_key!, "HS256");
      //const token = await sign({ user }, secret_key!, "HS256"); //original
      return c.json({ user: user, token });
    } catch (error) {
      return c.json({ message: error });
    }
  };
};

export const AuthRouteVerify = () => {
  const secret_key = process.env.secret_key;

  return async (c: Context) => {
    const { token } = await c.req.json();
    const tokenData = (await verify(token, secret_key!)) as User;
    //console.log("tokenData: ", tokenData);
    try {
      const user = await prisma.user.findUnique({
        where: {
          id: tokenData.id!,
          userName: tokenData.userName!,
        },
      });
      //console.log("user: ", user);
      //TODO send a new token
      return c.json({ token });
    } catch (e) {
      console.error("ERROR HERE: ", e);
      return c.json({ tokenData });
      // throw new Error();
      // if there's a new error, the frontend should prompt for re-login
    }
  };
};
