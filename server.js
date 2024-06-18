import express from 'express';
import { roomRouter } from './routes/rooms.js';
import { bookingRouter } from './routes/bookings.js';

const server = express();

server.use(express.json())
const port = 5000;


server.use("/rooms", roomRouter)
server.use("/booking",bookingRouter)
server.listen(port, () => {
    console.log("listening on port",port)
})

