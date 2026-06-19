import dotenv from "dotenv";

dotenv.config();

export const getEnv = (...names) => {
  for (const name of names) {
    const value = process.env[name];
    if (value !== undefined && value !== "") {
      return value;
    }
  }

  return undefined;
};

export const getJwtSecret = () => getEnv("JWT_SECRET", "jwt_secret");
