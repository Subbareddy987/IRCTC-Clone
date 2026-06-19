import { BrowserRouter, Routes, Route } from "react-router-dom";
import { useLocation } from "react-router-dom";
import "./App.css";
import Register from "./pages/Register.jsx";
import Login from "./pages/Login.jsx";
import Home from "./pages/Home.jsx";
import Searchtrain from "./pages/Searchtrain.jsx";
import TrainDetails from "./pages/TrainDetails.jsx";
import Availability from "./pages/Availability.jsx";
import SeatSelection from "./pages/SeatSelection.jsx";
import MyBookings from "./pages/MyBooking.jsx";
import BookingDetails from "./pages/BookingDetails.jsx";
import SearchPNR from "./pages/SearchPNR.jsx";
import Payment from "./pages/Payment.jsx";
import Navbar from "./components/Navbar.jsx";
import "./styles/global.css";
function AppContent() {
  const location = useLocation();

  const hideNavbar =
    location.pathname === "/" || location.pathname === "/register";

  return (
    <>
      {!hideNavbar && <Navbar />}

      <Routes>
        <Route path="/" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/home" element={<Home />} />
        <Route path="/trains/search" element={<Searchtrain />} />
        <Route path="/traindata/:train_id" element={<TrainDetails />} />
        <Route path="/availability/:train_id" element={<Availability />} />
        <Route path="/seats/:train_id" element={<SeatSelection />} />
        <Route path="/mybookings" element={<MyBookings />} />
        <Route path="/booking/:booking_id" element={<BookingDetails />} />
        <Route path="/pnr-search" element={<SearchPNR />} />
        <Route path="/payment" element={<Payment />} />
      </Routes>
    </>
  );
}
function App() {
  return (
    <div>
      <BrowserRouter>
         <AppContent />
      </BrowserRouter>
    </div>
  );
}

export default App;
