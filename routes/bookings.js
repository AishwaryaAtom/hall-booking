import express from "express";
import { rooms } from "./rooms.js";
const bookings = [];
const bookingRouter = express.Router();
const customer = [];

//create a bookings
bookingRouter.post("/", (req, res) => {
  const bookInfo = {
    ...req.body,
    bookingId: Date.now().toString(),
    bookingDate: new Date().toISOString(),
  };
  try {
    const room = rooms.find((r) => r.id === bookInfo.room_id);
    if (!room) {
      return res.status(404).send({ msg: "Room not found" });
    }

    // Check if the room is available for the given date and time
    const isAvailable = room.bookings.every((booking) => {
      return (
        booking.date !== bookInfo.date ||
        bookInfo.endTime <= booking.startTime ||
        bookInfo.startTime >= booking.endTime
      );
    });

    if (!isAvailable) {
      return res
        .status(400)
        .send({ msg: "Room is already booked for the given date and time" });
    }

    room.bookings.push(bookInfo);
    bookings.push(bookInfo);
    res.status(201).send({ msg: "Room Booked" });
  } catch (e) {
    res.status(500).send({ msg: "Internal Server error" });
  }
});

//List Bookings
bookingRouter.get("/", (req, res) => {
  try {
    res.status(201).send({ msg: "Booking Info", bookings });
  } catch (e) {
    res.status(500).send({ msg: "Internal Server error" });
  }
});


//List Customer with booked data

bookingRouter.get("/customer", (req, res) => {

     const customerData = bookings.map((booking) => {
       const room = rooms.find((r) => r.id === booking.roomId);
       return {
         customerName: booking.customerName,
         roomName: room ? room.name : "Unknown",
         date: booking.date,
         startTime: booking.startTime,
         endTime: booking.endTime,
       };
     });
  try {
    res.status(200).send({ msg: "Customer Info", customerData });
  } catch (e) {
    res.status(500).send({ msg: "Internal Server error" });
  }
     
})

//list how many times customer booked
bookingRouter.get("/customer-bookings-details", (req, res) => {
  try {
    const bookingCounts = {};

    bookings.forEach((booking) => {
      if (!bookingCounts[booking.customerName]) {
        bookingCounts[booking.customerName] = {
          count: 0,
          details: [],
        };
      }
      bookingCounts[booking.customerName].count++;
      const room = rooms.find((r) => r.id === booking.room_id);
      bookingCounts[booking.customerName].details.push({
        roomName: room ? room.name : "Unknown",
        date: booking.date,
        startTime: booking.startTime,
        endTime: booking.endTime,
        bookingId: booking.bookingId,
        bookingDate: booking.bookingDate,
        bookingStatus: "Booked",
      });
    });

    const customerBookingDetails = Object.keys(bookingCounts).map(
      (customerName) => ({
        customerName,
        bookingCount: bookingCounts[customerName].count,
        bookings: bookingCounts[customerName].details,
      })
    );

    res
      .status(200)
      .send({ msg: "Customer Booking Details", customerBookingDetails });
  } catch (e) {
    res.status(500).send({ msg: "Internal Server Error", error: e.message });
  }
});
// bookingRouter.get("/customer-bookings-count", (req, res) => {
//   try {
//     const bookingCounts = bookings.reduce((acc, booking) => {
//       if (!acc[booking.customerName]) {
//         acc[booking.customerName] = 0;
//       }
//       acc[booking.customerName]++;
//       return acc;
//     }, {});

//     const customerBookingCounts = Object.keys(bookingCounts).map(
//       (customerName) => ({
//         customerName,
//         bookingCount: bookingCounts[customerName],
//       })
//     );

//     res
//       .status(200)
//       .send({ msg: "Customer Booking Counts", customerBookingCounts });
//   } catch (e) {
//     res.status(500).send({ msg: "Internal Server Error", error: e.message });
//   }
// });



export { bookingRouter, bookings };
