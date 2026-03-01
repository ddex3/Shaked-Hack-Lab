import { doubleCsrf } from "csrf-csrf";
import { env } from "../config/env";

const { doubleCsrfProtection, generateToken } = doubleCsrf({
  getSecret: () => env.CSRF_SECRET,
  cookieName: "__Host-psifi.x-csrf-token",
  cookieOptions: {
    httpOnly: true,
    sameSite: "strict",
    path: "/",
    secure: env.NODE_ENV === "production",
  },
  getTokenFromRequest: (req) => req.headers["x-csrf-token"] as string,
});

export { doubleCsrfProtection, generateToken };
