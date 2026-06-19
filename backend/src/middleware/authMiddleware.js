import jwt from "jsonwebtoken";
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
    const decoded = jwt.verify(token, process.env.jwt_secret);
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
