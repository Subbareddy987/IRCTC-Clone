import {
  getalltrains,
  CreateTrain,
  UpdateTrain,
  DeleteTrain,
  searchTrains,
  trainDetails,
  getCoachesByTrain,
  getSeatAvailability,
} from "../models/trainModel.js";
export const getTrains = async (req, res) => {
  try {
    const trains = await getalltrains();
    return res.status(201).json({
      success: true,
      trains,
    });
  } catch (error) {
    console.error(error);
    return res.status(404).json({
      success: false,
      message: "Server Error",
    });
  }
};
export const addTrain = async (req, res) => {
  try {
    const {
      train_number,
      train_name,
      source_station_id,
      destination_station_id,
      departure_time,
      arrival_time,
      total_distance,
    } = req.body;
    const user = await CreateTrain(
      train_number,
      train_name,
      source_station_id,
      destination_station_id,
      departure_time,
      arrival_time,
      total_distance,
    );
    res.status(201).json({
      succcess: true,
      message: "New Train Added",
      user,
    });
  } catch (error) {
    console.error(error);
    res.status(404).json({
      success: false,
      message: "server error",
    });
  }
};
export const ModifyTrain = async (req, res) => {
  if (Object.keys(req.body).length === 0) {
    return res.status(400).json({
      success: false,
      message: "No fields provided",
    });
  }
  try {
    const { id } = req.params;
    const updatedtrain = await UpdateTrain(id, req.body);
    return res.status(200).json({
      success: true,
      message: "Train details updated successfully",
      train: updatedtrain,
    });
  } catch (error) {
    res.status(404).json({
      success: false,
      message: "Server error",
    });
  }
};
export const removeTrain = async (req, res) => {
  try {
    const { id } = req.params;
    const dltTrain = await DeleteTrain(id);
    return res.status(200).json({
      success: true,
      message: "Train Details deleted successfully",
      train: dltTrain,
    });
  } catch (error) {
    console.error(error);
    res.status(404).json({
      success: false,
      message: "Server error",
    });
  }
};
export const findTrains = async (req, res) => {
  try {
    const { source, destination } = req.query;
    if (!source || !destination) {
      return res.status(404).json({
        success: false,
        message: "Stations not found",
      });
    }
    const data = await searchTrains(source, destination);
    return res.status(200).json({
      success: true,
      message: "Train details found",
      train: data,
    });
  } catch (error) {
    console.error(error);
    return res.status(404).json({
      success: false,
      message: "server error",
    });
  }
};
export const traininfo = async (req, res) => {
  try {
    const { train_id } = req.params;
    if (!train_id) {
      return res.status(404).json({
        success: false,
        message: "No information found",
      });
    }
    const { source, destination } = req.query;
    const traindata = await trainDetails(train_id, source, destination);
    return res.status(200).json({
      success: true,
      message: "train details found",
      data: traindata,
    });
  } catch (error) {
    console.error(error);
    return res.status(404).json({
      success: false,
      message: "Server error",
    });
  }
};

export const getTrainCoaches = async (req, res) => {
  try {
    const coaches = await getCoachesByTrain(req.params.train_id);
    return res.status(200).json({ success: true, coaches });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ success: false, message: "Failed to load coaches" });
  }
};

export const checkAvailability = async (req, res) => {
  try {
    const { train_id, travel_date, coach_name } = req.query;

    if (!train_id || !travel_date || !coach_name) {
      return res.status(400).json({
        success: false,
        message: "train_id, travel_date and coach_name are required",
      });
    }

    const availability = await getSeatAvailability(
      train_id,
      travel_date,
      coach_name,
    );

    if (!availability) {
      return res.status(404).json({
        success: false,
        message: "No data found",
      });
    }

    res.status(200).json({
      success: true,
      message: "Seat availability fetched successfully",
      data: availability,
    });
  } catch (error) {
    console.error("Availability Error:", error);

    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};
