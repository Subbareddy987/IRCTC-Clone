import express from "express";
import {
  addTrain,
  findTrains,
  getTrains,
  ModifyTrain,
  removeTrain,
  traininfo,
  checkAvailability,
  getTrainCoaches,
} from "../controllers/trainController.js";
const router = express.Router();
router.get("/", getTrains);
router.post("/", addTrain);
router.put("/:id", ModifyTrain);
router.delete("/:id", removeTrain);
router.get("/search", findTrains);
router.get("/coaches/:train_id", getTrainCoaches);
router.get("/traindata/:train_id", traininfo);
router.get("/availability", checkAvailability);
export default router;
