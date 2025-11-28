import React, { useState, useEffect } from "react";
import axios from "axios";
import Room from "../components/Room";
import { DatePicker, Modal, Button } from "antd";
import dayjs from "dayjs";
import isSameOrAfter from "dayjs/plugin/isSameOrAfter";
import Webfooter from "../components/Webfooter";

dayjs.extend(isSameOrAfter);

function Homescreen() {
  const [rooms, setRooms] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(false);
  const [checkindate, setCheckindate] = useState(null);
  const [checkoutdate, setCheckoutdate] = useState(null);
  const [type, setType] = useState("All");

  const today = dayjs().startOf("day");

  useEffect(() => {
    fetchAllRooms();
  }, []);

  const fetchAllRooms = async () => {
    setLoading(true);
    try {
      const response = await axios.get("/api/rooms/getallrooms");
      setRooms(response.data);
    } catch (err) {
      setError(true);
      console.error(err);
    }
    setLoading(false);
  };

  useEffect(() => {
    if (checkindate && checkoutdate) {
      fetchAvailableRooms();
    }
  }, [checkindate, checkoutdate]);

  const fetchAvailableRooms = async () => {
    setLoading(true);
    try {
      const response = await axios.post("/api/rooms/getavailable", {
        checkindate: checkindate.format("YYYY-MM-DD"),
        checkoutdate: checkoutdate.format("YYYY-MM-DD"),
      });
      setRooms(response.data);
    } catch (err) {
      setError(true);
      console.error("Error fetching available rooms:", err);
    }
    setLoading(false);
  };

  const handleCheckin = (date) => {
    if (checkoutdate && date && !date.isBefore(checkoutdate)) {
      Modal.warning({
        title: "Invalid Date",
        content: "Check-in date must be before check-out date.",
      });
      return;
    }
    setCheckindate(date);
  };

  const handleCheckout = (date) => {
    if (!checkindate) {
      Modal.warning({
        title: "Check-in date required",
        content: "Please select a check-in date first.",
      });
      return;
    }
    if (date && date.isAfter(checkindate)) {
      setCheckoutdate(date);
    } else {
      Modal.warning({
        title: "Invalid Date",
        content: "Check-out date must be after check-in date.",
      });
    }
  };

  const disableCheckinDate = (current) => {
    if (!checkoutdate) {
      return current && current.isBefore(today);
    } else {
      return (
        current &&
        (current.isBefore(today) || current.isSameOrAfter(checkoutdate))
      );
    }
  };

  const disableCheckoutDate = (current) => {
    return (
      !checkindate ||
      !current ||
      current.isSame(checkindate, "day") ||
      current.isBefore(checkindate, "day")
    );
  };

  const handleResetDates = () => {
    setCheckindate(null);
    setCheckoutdate(null);
    fetchAllRooms();
  };

  const handleTypeChange = (e) => {
    setType(e.target.value);
  };

  const [currentPage, setCurrentPage] = useState(1);
const roomsPerPage = 3;

const filteredRooms = rooms.filter((room) => {
  if (type === "All") return true;
  if (!room.roomType) return false;
  return room.roomType.toLowerCase().includes(type.toLowerCase());
});

const indexOfLastRoom = currentPage * roomsPerPage;
const indexOfFirstRoom = indexOfLastRoom - roomsPerPage;
const currentRooms = filteredRooms.slice(indexOfFirstRoom, indexOfLastRoom);

const totalPages = Math.ceil(filteredRooms.length / roomsPerPage);


  return (
    <div
    style={{
      backgroundColor: "#f0f8ff", // Light background color
    }}
  >
    <div className="page-wrapper">
      {/* Hero Section */}
      <div className="hero-section">
        <div className="hero-content">
          <h1>Experience Luxury by the Sea</h1>
          <p>Where dreams meet the horizon and luxury finds its home.</p>
        </div>
      </div>
      <div className="content-wrapper">
        <div className="container mt-5">
          <div className="row align-items-center">
            <div className="col-md-9">
              <div className="date-filters">
                <div className="filter-item">
                  <label><strong>Check-in</strong></label>
                  <DatePicker
                    format="YYYY-MM-DD"
                    allowClear={false}
                    disabledDate={disableCheckinDate}
                    onChange={handleCheckin}
                    value={checkindate}
                    placeholder="Select check-in"
                  />
                </div>
                <div className="filter-item">
                  <label><strong>Check-out</strong></label>
                  <DatePicker
                    format="YYYY-MM-DD"
                    disabledDate={disableCheckoutDate}
                    onChange={handleCheckout}
                    value={checkoutdate}
                    placeholder="Select check-out"
                    disabled={!checkindate}
                  />
                </div>
                <div className="filter-item">
                  <label>&nbsp;</label>
                  <Button
                    onClick={handleResetDates}
                    type="primary"
                    className="reset-button"
                  >
                    Reset Dates
                  </Button>
                </div>
              </div>
            </div>

            <div className="col-md-3">
              <div className="room-type-select">
                <label><b>Room Type</b></label>
                <select
                  className="form-select"
                  value={type}
                  onChange={handleTypeChange}
                >
                  <option value="All">All</option>
                  <option value="Single">Single</option>
                  <option value="Deluxe">Deluxe</option>
                  <option value="Double">Double</option>
                  <option value="Suite">Suite</option>
                  <option value="Family">Family</option>
                </select>
              </div>
            </div>
          </div>
        </div>

        <div className="container mt-4">
          <div className="row justify-content-center">
            {loading ? (
              <h1>Loading...</h1>
            ) : error ? (
              <h1>Error loading rooms</h1>
            ) : rooms.length === 0 ? (
              <h3>No rooms available for selected dates</h3>
            ) : (
                currentRooms.map((room) => (
                  <div key={room._id} className="col-md-9 mt-2">
                    <Room
                      room={room}
                      checkindate={checkindate ? dayjs(checkindate).format("DD-MM-YYYY") : ""}
                      checkoutdate={checkoutdate ? dayjs(checkoutdate).format("DD-MM-YYYY") : ""}
                    />
                  </div>
                ))
            )}
          </div>

          <div className="pagination-controls d-flex justify-content-center mt-4">
  {[...Array(totalPages)].map((_, i) => (
    <button
      key={i}
      className={`page-btn mx-1 ${currentPage === i + 1 ? 'active' : ''}`}
      onClick={() => setCurrentPage(i + 1)}
    >
      {i + 1}
    </button>
  ))}
</div>

        </div>
      </div>

      <Webfooter />
    </div>
    </div>
  );
}

export default Homescreen;
