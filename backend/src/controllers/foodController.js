import {
  getFoodStationsByBooking,
  getFoodStationsForJourney,
  getStationFoodMenu,
} from "../models/foodModel.js";

export const getFoodStationsController = async (req, res) => {
  try {
    const { booking_id } = req.params;
    const stations = await getFoodStationsByBooking(booking_id);

    return res.status(200).json(stations);
  } catch (error) {
    console.error(error);
    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

export const getJourneyFoodStationsController = async (req, res) => {
  try {
    const { train_id, source_station_id, destination_station_id } = req.query;

    if (!train_id || !source_station_id || !destination_station_id) {
      return res.status(400).json({
        success: false,
        message: "Train, source station, and destination station are required",
      });
    }

    const stations = await getFoodStationsForJourney(
      train_id,
      source_station_id,
      destination_station_id,
    );

    return res.status(200).json({
      success: true,
      stations,
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

export const getStationFoodMenuController = async (req, res) => {
  try {
    const { station_code } = req.params;

    if (!station_code) {
      return res.status(400).json({
        success: false,
        message: "Station code is required",
      });
    }

    const menu = await getStationFoodMenu(station_code.toUpperCase());

    return res.status(200).json({
      success: true,
      menu,
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};
