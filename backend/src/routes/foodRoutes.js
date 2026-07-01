import express from "express";
import {
  getFoodStationsController,
  getJourneyFoodStationsController,
  getStationFoodMenuController,
} from "../controllers/foodController.js";

const router = express.Router();

router.get("/stations", getJourneyFoodStationsController);
router.get("/stations/:booking_id", getFoodStationsController);
router.get("/menu/:station_code", getStationFoodMenuController);

export default router;
