import jwt from "jsonwebtoken";
import { getJwtSecret } from "../config/env.js";

export const verifytoken = (req, res, next) => {
  const authHeader = req.headers.authorization;
  const [scheme, token] = authHeader?.trim().split(/\s+/) ?? [];

  if (scheme?.toLowerCase() !== "bearer" || !token) {
    return res.status(401).json({
      success: false,
      message: "Bearer token required",
    });
  }

  try {
    const secret = getJwtSecret();
    if (!secret) {
      throw new Error("JWT_SECRET is not configured");
    }
    const decoded = jwt.verify(token, secret);
    req.user = decoded;
    return next();
  } catch (error) {
    const message =
      error.name === "TokenExpiredError" ? "Token expired" : "Invalid token";
    return res.status(401).json({
      success: false,
      message,
    });
  }
};
