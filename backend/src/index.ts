import { Hono } from "hono";
import { cors } from "hono/cors";
import { prisma } from "./Prisma";
import { decode, sign, verify } from "hono/jwt";
import { hash, compare } from "bcrypt";

const app = new Hono();

const secret_key = process.env.secret_key;

import "dotenv/config";
import { AuthRouteRoot, AuthRouteVerify } from "./routes/Auth";

app.use(
  "/*",
  cors({
    origin: "http://localhost:5173",
    allowHeaders: [
      "X-Custom-Header",
      "Upgrade-Insecure-Requests",
      "Content-Type",
      "Authorization",
    ],
    allowMethods: ["POST", "GET", "OPTIONS", "DELETE", "PUT"],
    exposeHeaders: ["Content-Length", "X-Kuma-Revision"],
    maxAge: 600,
    credentials: true,
  })
);

app.get("/", (c) => {
  return c.text("Hello Hono!");
});

//Registration
app.post("/register", async (c) => {
  const saltRounds = 10;
  const { username, password } = await c.req.json();
  try {
    const user = await prisma.user.create({
      data: {
        userName: username,
        password: await hash(password, saltRounds),
      },
    });

    return c.json({ user: user });
  } catch (error) {
    console.log("error message: ", error);
  }
});

app.get("/register", (c) => {
  return c.json({ message: "Registration not yet implimented" });
});

//Authentication
//Don't use GET for auth, it gets cached and sensitive info is visible in the URL.
//The Response Object isn't working here. Find it.

app.post("/auth", AuthRouteRoot());
app.post("/auth/refresh"); //Refresh and resend the token
app.post("/auth/verify", AuthRouteVerify()); //Send user data and permissions if valid

//Posts
app.post("/posts", async (c) => {
  const request = c.req.json();
  console.log("Request: ", request);
});

export default app;
