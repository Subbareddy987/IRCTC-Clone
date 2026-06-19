import axios from "axios";
const API_URL =
  import.meta.env.VITE_API_URL || "https://irctc-backend-r0p7.onrender.com/api";
export const registeruser = async (userdata) => {
  const response = await axios.post(`${API_URL}/auth/register`, userdata);
  return response.data;
};
export const loginuser = async (userdata) => {
  const response = await axios.post(`${API_URL}/auth/login`, userdata);
  return response.data;
};
export const getProfile = async () => {
  const token = localStorage.getItem("token");
  const response = await axios.get(`${API_URL}/auth/profile`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
  return response.data;
};
export const removeprofile = async () => {
  localStorage.removeItem("token");
  localStorage.removeItem("user");
};
export const searchTrains = async (source, destination) => {
  const response = await axios.get(`${API_URL}/trains/search/`, {
    params: { source, destination },
  });
  return response.data;
};
export const getTraindetails = async (train_id, source, destination) => {
  const response = await axios.get(`${API_URL}/trains/traindata/${train_id}`, {
    params: { source, destination },
  });
  return response.data;
};
export const getTrainCoaches = async (train_id) => {
  const response = await axios.get(`${API_URL}/trains/coaches/${train_id}`);
  return response.data;
};
export const checkAvailability = async (train_id, travel_date, coach_name) => {
  const response = await axios.get(`${API_URL}/trains/availability`, {
    params: {
      train_id,
      travel_date,
      coach_name,
    },
  });

  return response.data;
};
export const getSeats = async (train_id, travel_date, coach_name) => {
  const response = await axios.get(`${API_URL}/bookings/seats/${train_id}`, {
    params: { travel_date, coach_name },
  });

  return response.data;
};
export const createBooking = async (bookingData) => {
  const token = localStorage.getItem("token");

  const response = await axios.post(`${API_URL}/bookings`, bookingData, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  return response.data;
};
export const myBookings = async () => {
  const token = localStorage.getItem("token");

  const response = await axios.get(`${API_URL}/bookings/mybookings`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  return response.data;
};
export const getBookingDetails = async (booking_id) => {
  const token = localStorage.getItem("token");

  const response = await axios.get(`${API_URL}/bookings/${booking_id}`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  return response.data;
};
export const cancelBooking = async (booking_id) => {
  const token = localStorage.getItem("token");

  const response = await axios.delete(
    `${API_URL}/bookings/cancel/${booking_id}`,
    {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    },
  );

  return response.data;
};
export const getBookingByPNR = async (pnr) => {
  const token = localStorage.getItem("token");

  const response = await axios.get(`${API_URL}/bookings/pnr/${pnr}`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  return response.data;
};
export const getStations = async () => {
  const response = await axios.get(
    `${API_URL}/stations`
  );

  return response.data;
};
