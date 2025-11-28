const express = require("express");
const router = express.Router();
const Room = require("../Models/room");

// ✅ Get all rooms
router.get("/getallrooms", async (req, res) => {
  try {
    const rooms = await Room.find({});
    res.json(rooms);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

// ✅ Get a room by ID
// getroombyid/:roomid
router.post("/getroombyid/:roomid", async (req, res) => {
  const roomid = req.params.roomid;

  try {
    const room = await Room.findById(roomid);
    if (!room) {
      return res.status(404).json({ error: "Room not found" });
    }
    res.json(room);
  } catch (error) {
    console.error("Error fetching room by ID:", error);
    res.status(500).json({ error: "Server error" });
  }
});


// ✅ Update a room by ID
router.put("/updateroom/:roomid", async (req, res) => {
  try {
    const {
      name,
      roomType,
      description,
      location,
      occupancy,
      bedOptions,
      bathrooms,
      amenities,
      facilities,
      size,
      view,
      mealOptions,
      policies,
      pricepernight,
      imageurls,
    } = req.body;

    const room = await Room.findById(req.params.roomid);
    if (!room) {
      return res.status(404).json({ message: "Room not found" });
    }

    room.name = name || room.name;
    room.roomType = roomType || room.roomType;
    room.description = description || room.description;
    room.location = location || room.location;
    room.occupancy = occupancy || room.occupancy;
    room.bedOptions = bedOptions || room.bedOptions;
    room.bathrooms = bathrooms || room.bathrooms;
    room.amenities = amenities || room.amenities;
    room.facilities = facilities || room.facilities;
    room.size = size || room.size;
    room.view = view || room.view;
    room.mealOptions = mealOptions || room.mealOptions;
    room.policies = policies || room.policies;
    room.pricepernight = pricepernight || room.pricepernight;
    room.imageurls = imageurls || room.imageurls;

    const updatedRoom = await room.save();
    res.json(updatedRoom);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

// ✅ Delete room by ID
router.delete("/deleteroom/:roomid", async (req, res) => {
  try {
    const room = await Room.findByIdAndDelete(req.params.roomid);
    if (!room) {
      return res.status(404).json({ message: "Room not found" });
    }
    res.json({ message: "Room deleted successfully" });
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

// ✅ Add a new room
router.post("/addroom", async (req, res) => {
  try {
    const {
      name,
      roomType,
      description,
      location,
      occupancy,
      bedOptions,
      bathrooms,
      amenities,
      facilities,
      size,
      view,
      mealOptions,
      policies,
      imageurls,
      pricepernight,
    } = req.body;

    const newRoom = new Room({
      name,
      roomType,
      description,
      location,
      occupancy,
      bedOptions,
      bathrooms,
      amenities,
      facilities,
      size,
      view,
      mealOptions,
      policies,
      imageurls,
      currentbookings: [],
      pricepernight,
    });

    const savedRoom = await newRoom.save();
    res.json(savedRoom);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

// ✅ Get available rooms based on check-in & check-out dates
router.post("/getavailable", async (req, res) => {
  const { checkindate, checkoutdate } = req.body;

  try {
    const rooms = await Room.find({});
    const availableRooms = rooms.filter((room) => {
      let isAvailable = true;

      // Convert requested check-in and check-out to Date objects
      const requestedCheckIn = new Date(checkindate);
      const requestedCheckOut = new Date(checkoutdate);

      for (const booking of room.currentbookings) {
        const bookedCheckIn = new Date(booking.checkindate);
        const bookedCheckOut = new Date(booking.checkoutdate);

        // Overlapping condition - check if the requested dates overlap with any existing booking
        if (
          requestedCheckIn <= bookedCheckOut &&
          requestedCheckOut >= bookedCheckIn
        )
         {
          isAvailable = false;
          break;
        }
      }

      return isAvailable;
    });

    res.json(availableRooms);
  } catch (error) {
    console.error("Error in getavailable route:", error);
    res.status(500).json({ message: "Internal server error" });
  }
});

module.exports = router;
