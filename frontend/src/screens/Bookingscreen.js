import axios from "axios";
import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import moment from "moment";
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';


function Bookingscreen() {
  const { roomid, checkindate, checkoutdate } = useParams();
  const [room, setRoom] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(false);

  useEffect(() => {
    const fetchRoom = async () => {
      setLoading(true);
      try {
        const response = await axios.post(`/api/rooms/getroombyid/${roomid}`);
        console.log("Room Data:", response.data);
        setRoom(response.data);
      } catch (err) {
        setError(true);
        toast.error("Error fetching room data");
      }
      setLoading(false);
    };

    fetchRoom();
  }, [roomid]);

  // Convert URL parameters back to moment objects
  const checkInDate = moment(checkindate, "DD-MM-YYYY");
  const checkOutDate = moment(checkoutdate, "DD-MM-YYYY");
  const totalDays = checkOutDate.diff(checkInDate, "days");

  async function bookRoom() {
    // Manually assigned values
    const userid = "manualUser123"; // Manual user ID
    const transactionId = "TXN" + Date.now(); // Generate a dummy transaction ID

    if (!room || !room.pricepernight) {
     if (!error) {
      toast.error("Room details are missing.");
    }
    return;
    }

    const totalAmount = totalDays * room.pricepernight;
    const bookingDetails = {
      room,
      checkindate,
      checkoutdate,
      totalamount: totalAmount,
      totaldays: totalDays,
      userid, // Include manual user ID
      transactionId, // Include manual transaction ID
    };

    try {
      const result = await axios.post("/api/bookings/bookroom", bookingDetails);
      toast.success("Successfully confirmed booking");
    } catch (error) {
      toast.error(
        "Booking confirmation failed. " +
          (error.response?.data.error || "Please try again.")
      );
    }
  }

  return (
    <div
    style={{
      backgroundColor: "#f0f8ff", // Light background color
      minHeight: "100vh", // Full height of the viewport
      display: "flex",
      flexDirection: "column", // Ensure the layout stretches to the full height
      justifyContent: "space-between", // Make the content stretch and align at top and bottom
    }}
  >
    <ToastContainer position="top-center"/> 

      {loading ? (
        <h1>Loading...</h1>
      ) : error ? (
        <h1>Error fetching room data</h1>
      ) : room ? (
        <div className="container" style={{
          width: "80%",
          maxWidth: "800px", // Smaller box size
          padding: "80px",
        }}>
          <div className="row justify-content-center mt-5 bs">
            <div className="col-md-6">
             
              {room.imageurls?.length > 0 ? (
                <img
                  src={room.imageurls[0]}
                  alt="Room"
                  className="w-100 bigimg"
                  onError={(e) => (e.target.src = "/default-room.jpg")}
                />
              ) : (
                <p>No image available</p>
              )}
            </div>

            <div className="col-md-6" style={{ textAlign: "right" }}>
              <h1>Booking Details</h1>
              <hr />
              <p><strong>Room Name:</strong> {room.name}</p>
              <p><strong>Room Type:</strong> {room.roomType}</p>
              <p><strong>Occupancy:</strong> {room.occupancy}</p>
              <p><strong>Check-in Date:</strong> {checkInDate.format("YYYY-MM-DD")}</p>
              <p><strong>Check-out Date:</strong> {checkOutDate.format("YYYY-MM-DD")}</p>
              <br/><br/>
              <h1>Amount</h1>
              <hr /> 
              <p><strong>Total Days:</strong> {totalDays}</p>
              <p><strong>Price per Night: $</strong> {room.pricepernight}</p>
              <p><strong>Total Price:$</strong> {totalDays * room.pricepernight}</p>
            </div>

            <div>
              <button className="btn btn-primary" onClick={bookRoom}>Confirm and Pay</button>
            </div>
          </div>
        </div>
      ) : (
        <h1>No room data available</h1>
      )}
    </div>
  );
}

export default Bookingscreen;
