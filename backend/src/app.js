import express from "express";
import cors from "cors";
import bodyParser from "body-parser";
import authRoutes from "./routes/authRoutes.js";
import trainRoutes from "./routes/trainRoutes.js";
import bookingRoutes from "./routes/bookingRoutes.js";
import stationRoutes from "./routes/stationRoute.js";
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
export default app;
