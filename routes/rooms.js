import express from "express";
import { bookings } from "./bookings.js"
const rooms = [];


const roomRouter = express.Router();




//Create room

roomRouter.post("/", (req, res) => {
  const roomInfo = { ...req.body, id: Date.now().toString() ,bookings:[]};
  try {
    rooms.push(roomInfo);

    res.send({ msg: "Room created successfully" });
  } catch (e) {
    res.status(500).send({ msg: "Server error" });
  }
});
//get all the rooms
roomRouter.get("/", (req, res) => {
  try {
    res.send({ msg: "Info about all the rooms", rooms });
  } catch (e) {
    res.status(500).send({ msg: "Server error" });
  }
});

//get All the rooms with booking data

roomRouter.get("/booked-rooms", (req, res) => {
  try {
    let bookedRooms = rooms.filter((room) => room.bookings.length > 0);
    
    if (bookedRooms) {
       res.send({ msg: "Info about all the rooms", bookedRooms });
    } else {
          res.status(401).send({ msg: "No booked Rooms" });
    }
   
  } catch (e) {
    res.status(500).send({ msg: "Server error" });
  }
});

//Info about single room

// roomRouter.get("/:roomId", (req, res) => {
//   let roomId = req.params.roomId;
//   try {
//         let roomData = rooms.find((room) => room.id === roomId);
//     if (roomData) {
//           res.status(201).send({msg:"Room info received successfully", ...roomData });
//     } else {
//       res.status(404).send({ msg: "Record Not Found" });
//     }

//   } catch (e) {
//      res.status(500).send({ msg: "Internal Server error" });
//   }

// })

// roomRouter.put("/:roomId", (req, res) => {
//   let roomId = req.params.roomId;
//   let updateInfo = req.body;

//   try {
//     let index = rooms.findIndex((i = i.id === roomId));
//     let roomData = rooms.find((room) => room.id === roomId);
//     if (roomData) {
//       rooms[index] = { ...roomData, ...updateInfo };
//       res.status(201).send({ msg: "Room Updated successfully", rooms });
//     }
//   } catch (e) {
//         res.status(500).send({ msg: "Internal Server error" });
//   }
// })
export  { roomRouter, rooms };
