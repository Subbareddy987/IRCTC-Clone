import express from "express";
import { verifytoken } from "../middleware/authMiddleware.js";
import { addBooking, bookingDetails, bookingDetailsPNR, cancelBooking,getseats, myBookings } from "../controllers/bookingController.js";
const router = express.Router();
router.post("/", verifytoken, addBooking);
router.get('/seats/:train_id',getseats);
router.get('/mybookings',verifytoken,myBookings);
router.get('/pnr/:pnr_number',verifytoken,bookingDetailsPNR);
router.delete('/cancel/:booking_id',verifytoken,cancelBooking);
router.get('/:booking_id',verifytoken,bookingDetails);

export default router;
