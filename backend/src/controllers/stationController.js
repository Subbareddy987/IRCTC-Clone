import { getAllStations } from "../models/stationModel.js";

export const getStations = async (req, res) => {
  try {
    const stations = await getAllStations();

    return res.status(200).json({
      success: true,
      stations,
    });
  } catch (error) {
    console.error(error);

    return res.status(500).json({
      success: false,
      message: "Server Error",
    });
  }
};