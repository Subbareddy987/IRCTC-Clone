import {
  createBooking,
  getSeatsByTrain,
  getMyBookings,
  getBookingDetails,
  getBookingbyPNR,
  bookingCancel,
  lockSeat,
  unlockSeat,
} from "../models/bookingModel.js";
import pool from "../config/db.js";

export const addBooking = async (req, res) => {
  try {
    const user_id = req.user.user_id;

    const {
      train_id,
      travel_date,
      source_station_id,
      destination_station_id,
      passengers,
      food_orders,
    } = req.body;

    if (!train_id || !travel_date || !source_station_id || !destination_station_id) {
      return res.status(400).json({
        success: false,
        message: "Booking details Not sufficient",
      });
    }

    if (!passengers || passengers.length === 0) {
      return res.status(400).json({
        success: false,
        message: "Min 1 Passenger details required",
      });
    }

    const segmentResult = await pool.query(
      `SELECT source_route.stop_order AS source_order,
              destination_route.stop_order AS destination_order
       FROM train_routes source_route
       JOIN train_routes destination_route
         ON destination_route.train_id = source_route.train_id
       WHERE source_route.train_id = $1
         AND source_route.station_id = $2
         AND destination_route.station_id = $3
         AND source_route.stop_order < destination_route.stop_order`,
      [train_id, source_station_id, destination_station_id],
    );

    if (segmentResult.rows.length === 0) {
      return res.status(400).json({
        success: false,
        message: "Selected journey segment is not valid for this train",
      });
    }

    const zonePrefix = "42";
    const random8 = Math.floor(10000000 + Math.random() * 90000000);
    const pnr = `${zonePrefix}${random8}`;

    const booking = await createBooking(
      user_id,
      train_id,
      source_station_id,
      destination_station_id,
      travel_date,
      pnr,
      passengers,
      food_orders,
    );

    const io = req.app.get("io");
    if (io && passengers.length > 0) {
      const coachName = passengers[0].coach_name;
      if (coachName) {
        const roomName = `coach:${train_id}:${travel_date}:${coachName}`;
        io.to(roomName).emit("seats_booked", {
          seat_ids: passengers.map((p) => p.seat_id),
          train_id,
          travel_date,
          coach_name: coachName,
        });
      }
    }

    return res.status(200).json({
      success: true,
      message: "Ticket Booked successfully",
      booking,
    });
  } catch (error) {
    console.error(error);

    return res.status(400).json({
      success: false,
      message: error.message,
    });
  }
};

export const getseats = async (req, res) => {
  try {
    const { train_id } = req.params;
    const { travel_date, coach_name } = req.query;
    const seats = await getSeatsByTrain(train_id, travel_date, coach_name);
    return res.status(200).json({
      success: true,
      seats,
    });
  } catch (error) {
    return res.status(400).json({
      success: false,
      message: "server error",
    });
  }
};

export const lockSeatController = async (req, res) => {
  try {
    const user_id = req.user.user_id;
    const { train_id, travel_date, seat_id } = req.body;

    if (!train_id || !travel_date || !seat_id) {
      return res.status(400).json({
        success: false,
        message: "train_id, travel_date, and seat_id are required",
      });
    }

    const lockData = await lockSeat(user_id, train_id, travel_date, seat_id);

    const io = req.app.get("io");
    if (io) {
      const roomName = `coach:${train_id}:${travel_date}:${lockData.coach_name}`;
      io.to(roomName).emit("seat_locked", {
        seat_id,
        seat_number: lockData.seat_number,
        coach_name: lockData.coach_name,
        user_id,
        train_id,
        travel_date,
      });
    }

    return res.status(200).json({
      success: true,
      message: "Seat locked successfully",
      lock: lockData,
    });
  } catch (error) {
    return res.status(400).json({
      success: false,
      message: error.message,
    });
  }
};

export const unlockSeatController = async (req, res) => {
  try {
    const user_id = req.user.user_id;
    const { train_id, travel_date, seat_id } = req.body;

    if (!train_id || !travel_date || !seat_id) {
      return res.status(400).json({
        success: false,
        message: "train_id, travel_date, and seat_id are required",
      });
    }

    const unlockData = await unlockSeat(user_id, train_id, travel_date, seat_id);

    const io = req.app.get("io");
    if (io && unlockData.coach_name) {
      const roomName = `coach:${train_id}:${travel_date}:${unlockData.coach_name}`;
      io.to(roomName).emit("seat_unlocked", {
        seat_id,
        seat_number: unlockData.seat_number,
        coach_name: unlockData.coach_name,
        user_id,
        train_id,
        travel_date,
      });
    }

    return res.status(200).json({
      success: true,
      message: "Seat unlocked successfully",
      unlock: unlockData,
    });
  } catch (error) {
    return res.status(400).json({
      success: false,
      message: error.message,
    });
  }
};

export const myBookings = async (req, res) => {
  try {
    const user_id = req.user.user_id;
    const bookings = await getMyBookings(user_id);
    return res.status(200).json({
      success: true,
      message: "Booking details",
      bookings,
    });
  } catch (error) {
    console.error(error);
    return res.status(404).json({
      success: false,
      message: "server error",
    });
  }
};

export const bookingDetails = async (req, res) => {
  try {
    const { booking_id } = req.params;
    if (!booking_id) {
      return res.status(400).json({
        success: false,
        message: "Booking ID required",
      });
    }
    const booking = await getBookingDetails(booking_id);
    return res.status(200).json({
      success: true,
      message: "Visit UR Details",
      booking,
    });
  } catch (error) {
    console.error(error);
    return res.status(404).json({
      success: false,
      message: "server Error",
    });
  }
};

export const bookingDetailsPNR = async (req, res) => {
  try {
    const { pnr_number } = req.params;
    if (!pnr_number) {
      return res.status(400).json({
        success: false,
        message: "PNR required",
      });
    }
    const booking = await getBookingbyPNR(pnr_number);
    return res.status(200).json({
      success: true,
      message: "Visit UR Details",
      booking,
    });
  } catch (error) {
    console.error(error);
    return res.status(404).json({
      success: false,
      message: "server Error",
    });
  }
};

export const cancelBooking = async (req, res) => {
  try {
    const user_id = req.user.user_id;
    const { booking_id } = req.params;
    if (!booking_id) {
      return res.status(400).json({
        success: false,
        message: "Booking id Issue",
      });
    }
    const data = await bookingCancel(booking_id, user_id);
    return res.status(200).json({
      success: true,
      message: "Booking Cancelled succesfully",
      data,
    });
  } catch (error) {
    console.error(error);
    return res.status(400).json({
      success: false,
      message: error.message,
    });
  }
};
