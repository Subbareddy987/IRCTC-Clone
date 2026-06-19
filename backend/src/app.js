import express from "express";
import cors from "cors";
import bodyParser from "body-parser";
import authRoutes from "./routes/authRoutes.js";
import trainRoutes from "./routes/trainRoutes.js";
import bookingRoutes from "./routes/bookingRoutes.js";
import stationRoutes from "./routes/stationRoute.js";
import pool from "./config/db.js";
const app = express();
app.use(cors());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.json());
app.use("/api/auth", authRoutes);
app.use("/api/trains", trainRoutes);
app.use("/api/bookings", bookingRoutes);
app.use("/api/stations", stationRoutes);
app.get("/", (req, res) => {
  res.send("IRCTC Booking");
});
const healthCheck = async (req, res) => {
  try {
    await pool.query("SELECT 1");
    return res.status(200).json({
      success: true,
      message: "Backend and database are connected",
    });
  } catch (error) {
    console.error("Database health check failed:", error);
    return res.status(503).json({
      success: false,
      message: "Backend is running, but database connection failed",
      error: error.message,
    });
  }
};
app.get("/health", healthCheck);
app.get("/api/health", healthCheck);
export default app;
