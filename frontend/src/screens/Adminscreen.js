import React, { useState, useEffect, useRef } from "react";
import axios from "axios";
import { Link, useNavigate } from "react-router-dom";
import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";
import {
  PieChart,
  Pie,
  Cell,
  Legend,
  Tooltip,
  ResponsiveContainer,
} from "recharts";
import html2canvas from "html2canvas"; // Import html2canvas
import { DatePicker } from "antd";
import moment from "moment";
// Import AllFeedback component
import AllFeedback from './AllFeedback';


function Adminscreen() {
  return (
    <div>
      <h1>Admin Panel</h1>
    </div>
  );
}

export default Adminscreen;

// All Bookings Page Component
export function Bookings() {
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(false);

  const [filterRoom, setFilterRoom] = useState("all");
  const [filterStatus, setFilterStatus] = useState("all");
  const [filterStartDate, setFilterStartDate] = useState("");
  const [filterEndDate, setFilterEndDate] = useState("");

  const fetchBookings = async () => {
    setLoading(true);
    try {
      const bookingsResponse = await axios.get("/api/bookings/getallbookings");
      setBookings(bookingsResponse.data);
      setError(false);
    } catch (err) {
      console.error(err);
      setError(true);
    }
    setLoading(false);
  };

  useEffect(() => {
    fetchBookings();
  }, []);

  const handleDelete = async (bookingId) => {
    if (!window.confirm("Are you sure you want to delete this booking?")) return;
    try {
      await axios.delete(`/api/bookings/deletebooking/${bookingId}`);
      await fetchBookings();
    } catch (err) {
      console.error("Error deleting booking:", err);
    }
  };

  const isDateInRange = (dateStr) => {
    if (!filterStartDate && !filterEndDate) return true;
    const date = new Date(dateStr);
    const start = filterStartDate ? new Date(filterStartDate) : null;
    const end = filterEndDate ? new Date(filterEndDate) : null;
    if (start && date < start) return false;
    if (end && date > end) return false;
    return true;
  };

  const roomsList = [...new Set(bookings.map((b) => b.room))];

  const filteredBookings = bookings.filter((booking) => {
    return (
      (filterRoom === "all" || booking.room === filterRoom) &&
      (filterStatus === "all" || booking.status === filterStatus) &&
      isDateInRange(booking.checkindate)
    );
  });

  const resetFilters = () => {
    setFilterRoom("all");
    setFilterStatus("all");
    setFilterStartDate("");
    setFilterEndDate("");
  };

  const statusCounts = filteredBookings.reduce((acc, booking) => {
    acc[booking.status] = (acc[booking.status] || 0) + 1;
    return acc;
  }, {});

  const chartData = Object.entries(statusCounts).map(([status, count]) => ({
    name: status,
    value: count,
  }));

  const COLORS = ["#28a745", "#dc3545", "#ffc107", "#6c757d"];

  const downloadPDF = async () => {
    if (filteredBookings.length === 0) {
      alert("No bookings to include in the PDF report.");
      return;
    }
  
    const chartElement = document.getElementById("hidden-pie-chart");
    if (!chartElement) return;
  
    // Wait for chart to load
    await new Promise((resolve) => setTimeout(resolve, 500));
    const canvas = await html2canvas(chartElement, { useCORS: true, scale: 2 });
    const imgData = canvas.toDataURL("image/png");
  
    const doc = new jsPDF();
    doc.text("Bookings Report", 14, 16);
  
    const imgWidth = 80;
    const imgHeight = 80;
    const pageWidth = doc.internal.pageSize.getWidth();
    const x = (pageWidth - imgWidth) / 2;
    const y = 20;
  
    // Add pie chart to the PDF
    doc.addImage(imgData, "PNG", x, y, imgWidth, imgHeight);
  
    let startY = 120;
  
    // Add booking details as cards
filteredBookings.forEach((booking, index) => {
  doc.setFontSize(12);
  doc.setFont("helvetica");

  const cardX = 14;
  const cardY = startY;
  const cardWidth = pageWidth - 28;
  const lineHeight = 6;
  const padding = 5;

  // Lines of text
  const lines = [
    `Room: ${booking.room}`,
    `Booking ID: ${booking._id}`,
    `Guest: ${booking.user}`,
    `Guest ID: ${booking.userid}`,
    `Check-in: ${booking.checkindate}`,
    `Check-out: ${booking.checkoutdate}`,
    `Amount: $${booking.totalamount}`,
    `Days: ${booking.totaldays}`,
    `Transaction ID: ${booking.transactionId}`,
    `Status: ${booking.status}`,
  ];

  const cardHeight = padding * 2 + lines.length * lineHeight;

  // Draw card border
  doc.setDrawColor(0, 0, 0);
  doc.setLineWidth(0.5);
  doc.rect(cardX, cardY, cardWidth, cardHeight);

  // Draw each line of text
  let textY = cardY + padding + 2;
  lines.forEach(line => {
    doc.text(line, cardX + padding, textY);
    textY += lineHeight;
  });

  startY += cardHeight + 10;

  if (startY > doc.internal.pageSize.height - 30) {
    doc.addPage();
    startY = 20;
  }
});

  
    // Save the generated PDF
    doc.save("bookings_report.pdf");
  };
  
  return (
    <div className="container mt-5">
      <h1 className="text-center"><b>All Bookings</b></h1>
      <br /><br />

      <div className="row mb-3">
        <div className="col-md-3">
          <label>Filter by Room:</label>
          <select
            className="form-select"
            value={filterRoom}
            onChange={(e) => setFilterRoom(e.target.value)}
          >
            <option value="all">All</option>
            {roomsList.map((room, idx) => (
              <option key={idx} value={room}>
                {room}
              </option>
            ))}
          </select>
        </div>

        <div className="col-md-3">
          <label>Filter by Status:</label>
          <select
            className="form-select"
            value={filterStatus}
            onChange={(e) => setFilterStatus(e.target.value)}
          >
            <option value="all">All</option>
            <option value="booked">Booked</option>
            <option value="cancelled">Cancelled</option>
            <option value="pending cancellation">Pending</option>
          </select>
        </div>

        <div className="col-md-3">
          <label>Start Date:</label>
          <input
            type="date"
            className="form-control"
            value={filterStartDate}
            onChange={(e) => setFilterStartDate(e.target.value)}
          />
        </div>

        <div className="col-md-3">
          <label>End Date:</label>
          <input
            type="date"
            className="form-control"
            value={filterEndDate}
            min={filterStartDate}
            onChange={(e) => setFilterEndDate(e.target.value)}
          />
        </div>

        <div className="col-md-12 d-flex justify-content-end mt-3">
          <button className="btn btn-secondary" onClick={resetFilters}>
            Reset Filters
          </button>
        </div>
      </div>

      <h4 className="mt-5">Booking Status Summary</h4>

      <div className="d-flex justify-content-center mb-4">
        <div style={{ width: "400px", height: "300px" }}>
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Pie
                data={chartData}
                dataKey="value"
                nameKey="name"
                cx="50%"
                cy="50%"
                outerRadius={100}
                fill="#8884d8"
                label
              >
                {chartData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                ))}
              </Pie>
              <Tooltip />
              <Legend />
            </PieChart>
          </ResponsiveContainer>
        </div>
      </div>

      <div className="d-flex justify-content-end mb-5">
        <button
          style={{
            backgroundColor: "#6f42c1",
            border: "1px solid #6f42c1",
            color: "white",
            padding: "5px 10px",
            height: "40px",
            borderRadius: "8px",
            cursor: "pointer",
          }}
          onClick={downloadPDF}
        >
          Download PDF
        </button>
      </div>

      {/* Hidden chart for PDF */}
      <div
        id="hidden-pie-chart"
        style={{ position: "absolute", left: "-9999px", width: "300px", height: "300px" }}
      >
        <ResponsiveContainer width={300} height={300}>
          <PieChart>
            <Pie
              data={chartData}
              dataKey="value"
              nameKey="name"
              cx="50%"
              cy="50%"
              outerRadius={100}
              fill="#8884d8"
              label
            >
              {chartData.map((entry, index) => (
                <Cell key={`cell-pdf-${index}`} fill={COLORS[index % COLORS.length]} />
              ))}
            </Pie>
            <Legend />
          </PieChart>
        </ResponsiveContainer>
      </div>

      {loading ? (
        <h2>Loading...</h2>
      ) : error ? (
        <h2>Error fetching bookings</h2>
      ) : (
        <div className="row">
          {filteredBookings.map((booking) => (
          <div className="col-12 col-md-6 mb-4" key={booking._id}>

              <div className="booking-card shadow-sm">
                <h1><center>Booking details</center></h1><br></br>
                <h5 className="booking-room">{booking.room}</h5>
                <p><strong>Bookig ID:</strong> {booking._id}</p>
                <p><strong>Guest:</strong> {booking.user}</p>
                <p><strong>Guest ID:</strong> {booking.userid}</p>
                <p><strong>Check-in:</strong> {booking.checkindate}</p>
                <p><strong>Check-out:</strong> {booking.checkoutdate}</p>
                <p><strong>Amount:</strong> ${booking.totalamount}</p>
                <p><strong>Days:</strong> {booking.totaldays}</p>
                <p><strong>Transaction ID:</strong> {booking.transactionId}</p>
                <p><strong>Status:</strong> <span className={`badge ${booking.status.replace(" ", "-")}`}>{booking.status}</span></p>
                <button
                  className="btn btn-delete btn-md delete-btn"
                  onClick={() => handleDelete(booking._id)}
                >
                  Delete
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

//All rooms
export function Rooms() {
  const [rooms, setRooms] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(false);

  // Filter states
  const [filterName, setFilterName] = useState("");
  const [filterType, setFilterType] = useState("");
  const [filterPriceMin, setFilterPriceMin] = useState("");
  const [filterPriceMax, setFilterPriceMax] = useState("");
  const [filterAmenities, setFilterAmenities] = useState([]);
  const [filterFacilities, setFilterFacilities] = useState([]);
  const [filterPolicies, setFilterPolicies] = useState("");
  const [filterMeals, setFilterMeals] = useState("");

  const fetchRooms = async () => {
    setLoading(true);
    try {
      const response = await axios.get("/api/rooms/getallrooms");
      setRooms(response.data);
      setError(false);
    } catch (err) {
      setError(true);
      console.error(err);
    }
    setLoading(false);
  };

  useEffect(() => {
    fetchRooms();
  }, []);

  const handleDelete = async (roomId) => {
    if (!window.confirm("Do you want to delete it?")) return;
    try {
      await axios.delete(`/api/rooms/deleteroom/${roomId}`);
      await fetchRooms();
    } catch (err) {
      console.error("Error deleting room", err);
    }
  };

  const roomNameList = [...new Set(rooms.map((room) => room.name))];

  // Filtering logic
  const filteredRooms = rooms.filter((room) => {
    const price = parseFloat(room.pricepernight);
  
    const inName = filterName ? room.name === filterName : true;
    const inType = filterType ? room.roomType === filterType : true;
  
    const minPrice = parseFloat(filterPriceMin);
    const maxPrice = parseFloat(filterPriceMax);
  
    const inPriceMin = !isNaN(minPrice) && minPrice >= 0 ? price >= minPrice : true;
    const inPriceMax = !isNaN(maxPrice) && maxPrice >= 0 ? price <= maxPrice : true;
  
    const hasAmenities = filterAmenities.length > 0
      ? filterAmenities.every((a) => room.amenities?.includes(a))
      : true;
  
    const hasFacilities = filterFacilities.length > 0
      ? filterFacilities.every((f) => room.facilities?.includes(f))
      : true;
  
    const hasPolicies = filterPolicies.length > 0
      ? filterPolicies.every((p) => room.policies?.includes(p))
      : true;
  
    const inMeals = filterMeals ? room.mealOptions === filterMeals : true;
  
    return inName && inType && inPriceMin && inPriceMax && hasAmenities && hasFacilities && hasPolicies && inMeals;
  });
  
 const toBase64 = (url) => {
  return new Promise((resolve, reject) => {
    const img = new Image();
    img.crossOrigin = "Anonymous";
    img.onload = () => {
      const canvas = document.createElement("canvas");
      canvas.width = img.width;
      canvas.height = img.height;
      const ctx = canvas.getContext("2d");
      ctx.drawImage(img, 0, 0);
      const dataURL = canvas.toDataURL("image/jpeg");
      resolve(dataURL);
    };
    img.onerror = (e) => reject(new Error("Image load error: " + url));
    img.src = url;
  });
};

const downloadPDF = async () => {
  if (filteredRooms.length === 0) {
    alert("No rooms to include in the PDF report.");
    return;
  }

  const doc = new jsPDF();
  const pageWidth = doc.internal.pageSize.getWidth();

  const title = "All Rooms Report";
  doc.setFontSize(18);
  doc.setFont("helvetica", "bold");
  const titleWidth = doc.getTextWidth(title);
  doc.text(title, (pageWidth - titleWidth) / 2, 16);

  for (let i = 0; i < filteredRooms.length; i++) {
    const room = filteredRooms[i];

    const cardX = 14;
    const cardY = 20;
    const cardWidth = pageWidth - 28;
    const lineHeight = 6;
    const padding = 6;

    const lines = [
      `Name: ${room.name}`,
      `Room ID: ${room._id}`,
      `Room Type: ${room.roomType}`,
      `Description: ${room.description || "N/A"}`,
      `Location: ${room.location || "N/A"}`,
      `Price per Night: $${room.pricepernight || "0"}`,
      `Occupancy: ${room.occupancy || "N/A"}`,
      `Bed Options: ${room.bedOptions || "N/A"}`,
      `Bathrooms: ${room.bathrooms || "N/A"}`,
      `Size: ${room.size || "N/A"}`,
      `View: ${room.view || "N/A"}`,
      `Meal Options: ${room.mealOptions || "N/A"}`,
      `Amenities: ${room.amenities?.join(", ") || "N/A"}`,
      `Facilities: ${room.facilities?.join(", ") || "N/A"}`,
      `Policies: ${room.policies || "N/A"}`,
    ];

    const textHeight = padding * 2 + lines.length * lineHeight;
    const imageHeight = 55;
    const totalCardHeight = textHeight + imageHeight + 20;

    doc.setDrawColor(0, 0, 0);
    doc.setLineWidth(0.5);
    doc.rect(cardX, cardY, cardWidth, totalCardHeight);

    doc.setFontSize(14);
    doc.setFont("helvetica", "bold");
    doc.text("Room Details", cardX + padding, cardY + padding + 2);

    doc.setFontSize(11);
    doc.setFont("helvetica", "normal");
    let textY = cardY + padding + 10;
    lines.forEach(line => {
      doc.text(line, cardX + padding, textY);
      textY += lineHeight;
    });

    // Add up to 3 images as Base64
    if (room.imageurls && room.imageurls.length > 0) {
      const images = room.imageurls.slice(0, 3);
      const imgWidth = 50;
      const imgHeight = 50;
      let xPosition = cardX + padding;
      const imgY = cardY + textHeight + 10;

      for (let j = 0; j < images.length; j++) {
        const imageUrl = images[j];
        try {
          const base64Img = await toBase64(imageUrl);
          doc.addImage(base64Img, "JPEG", xPosition, imgY, imgWidth, imgHeight);
          xPosition += imgWidth + 10;
        } catch (err) {
          console.error("Image skipped:", err.message);
        }
      }
    }

    if (i < filteredRooms.length - 1) {
      doc.addPage();
    }
  }

  doc.save("rooms_report.pdf");
}; 

  return (
    <div className="container mt-5">
      <h1><b>All Rooms</b></h1>

      {/* Top-right Download PDF Button */}
      <div className="d-flex justify-content-end mb-5">
        <button
          style={{
            backgroundColor: "#6f42c1",
            border: "1px solid #6f42c1",
            color: "white",
            padding: "5px 10px",
            height: "40px",
            borderRadius: "8px",
            cursor: "pointer",
          }}
          onClick={downloadPDF}
        >
          Download PDF
        </button>
      </div>

      {/* Filters Section */}
      <div className="container my-4">
        <div className="row g-3 mb-3">
          <div className="col-md-3">
            <label className="form-label">
              <b>Filter by Room Name:</b>
            </label>
            <select
              className="form-select"
              value={filterName}
              onChange={(e) => setFilterName(e.target.value)}
            >
              <option value="">All</option>
              {roomNameList.map((name, idx) => (
                <option key={idx} value={name}>
                  {name}
                </option>
              ))}
            </select>
          </div>
          <div className="col-md-3">
            <label className="form-label">
              <b>Type:</b>
            </label>
            <select className="form-select" value={filterType} onChange={e => setFilterType(e.target.value)}>
              <option value="">All</option>
              <option value="Single">Single</option>
              <option value="Double">Double</option>
              <option value="Suite">Suite</option>
              <option value="Deluxe">Deluxe</option>
              <option value="Family">Family</option>
            </select>
          </div>
          <div className="col-md-3">
            <label className="form-label">
              <b>Price Min:</b>
            </label>
            <input
  type="number"
  className="form-control"
  value={filterPriceMin}
  onChange={(e) => {
    const value = e.target.value;
    if (value === "" || (/^\d+(\.\d{0,2})?$/.test(value) && parseFloat(value) >= 0)) {
      setFilterPriceMin(value);
    }
  }}
  onKeyDown={(e) => {
    if (["e", "E", "+", "-"].includes(e.key)) {
      e.preventDefault();
    }
  }}
  min="0"
/>

          </div>
          <div className="col-md-3">
            <label className="form-label"><b>Price Max:</b></label>
            <input
  type="number"
  className="form-control"
  value={filterPriceMax}
  onChange={(e) => {
    const value = e.target.value;
    if (value === "" || (/^\d+(\.\d{0,2})?$/.test(value) && parseFloat(value) >= 0)) {
      setFilterPriceMax(value);
    }
  }}
  onKeyDown={(e) => {
    if (["e", "E", "+", "-"].includes(e.key)) {
      e.preventDefault();
    }
  }}
  min="0"
/>

          </div>
        </div>

        <div className="row g-3 align-items-end">
          <div className="col-md-3">
            <label className="form-label"><b>Amenities:</b></label>
            <select multiple className="form-select" onChange={e => setFilterAmenities(Array.from(e.target.selectedOptions, o => o.value))}>
              <option>WiFi</option>
              <option>TV</option>
              <option>Minibar</option>
              <option>Air Conditioning</option>
              <option>Safe</option>
            </select>
          </div>
          <div className="col-md-3">
            <label className="form-label"><b>Facilities:</b></label>
            <select multiple className="form-select" onChange={e => setFilterFacilities(Array.from(e.target.selectedOptions, o => o.value))}>
              <option>Pool</option>
              <option>Gym</option>
              <option>Spa</option>
              <option>Parking</option>
              <option>Restaurant</option>
            </select>
          </div>
          <div className="col-md-3">
            <label className="form-label"><b>Policies:</b></label>
            <select multiple className="form-select" onChange={e => setFilterFacilities(Array.from(e.target.selectedOptions, o => o.value))}>
              <option>No Smoking</option>
              <option>Smoking Allowed</option>
              <option>No Pets</option>
              <option>Pets Allowed</option>
              <option>No Alcohol</option>
              <option>Alcohol Allowed</option>
            </select>
          </div>
          <div className="col-md-3">
            <label className="form-label"><b>Meal Options:</b></label>
            <select className="form-select" value={filterMeals} onChange={e => setFilterMeals(e.target.value)}>
              <option value="">All</option>
              <option value="Breakfast Only">Breakfast Only</option>
              <option value="Half Board">Half Board</option>
              <option value="Full Board">Full Board</option>
              <option value="All Inclusive">All Inclusive</option>
            </select>
          </div>
        </div>

        <div className="d-flex justify-content-between mt-3">
          <button
            className="btn btn-secondary"
            onClick={() => {
              setFilterName("");
              setFilterType("");
              setFilterPriceMin("");
              setFilterPriceMax("");
              setFilterAmenities([]);
              setFilterFacilities([]);
              setFilterPolicies("");
              setFilterMeals("");
            }}
          >
            Reset Filters
          </button>
        </div>
      </div>
<br></br><br></br>
      {/* Loading / Error / Room Cards */}
      {loading ? (
        <h2>Loading...</h2>
      ) : error ? (
        <h2>Error fetching rooms</h2>
      ) : (
        <div className="d-flex flex-wrap gap-4">
          {filteredRooms.map((room) => (
            <div className="mb-4" key={room._id} style={{ width: "48%" }}>
              <div className="card h-100 shadow-sm p-3 d-flex flex-column justify-content-between" style={{
                minHeight: '100%',
                borderRadius: '1rem',
                border: '1px solid black',
              }}>
                <h4 className="text-center mb-3">Room Details</h4>

                {room.imageurls?.length ? (
                  <div className="d-flex gap-4">
                    {room.imageurls.map((url, i) => (
                      <img
                        key={i}
                        src={url}
                        alt={`${room.name} ${i + 1}`}
                        className="rounded"
                        style={{ width: "150px", height: "150px", objectFit: "cover" }}
                      />
                    ))}
                  </div>
                ) : (
                  <p>No images</p>
                )}

                <div className="card-body">
                  <h5 className="card-title">{room.name}</h5>
                  <p><strong>Type:</strong> {room.roomType}</p>
                  <p><strong>Price:</strong> ${room.pricepernight}</p>
                  <p><strong>Description:</strong> {room.description}</p>
                  <p><strong>Location:</strong> {room.location}</p>
                  <p><strong>Occupancy:</strong> {room.occupancy}</p>
                  <p><strong>Bed Options:</strong> {room.bedOptions}</p>
                  <p><strong>Bathrooms:</strong> {room.bathrooms}</p>
                  <p><strong>Size:</strong> {room.size}</p>
                  <p><strong>View:</strong> {room.view}</p>
                  <p><strong>Meal Options:</strong> {room.mealOptions}</p>
                  <p><strong>Amenities:</strong> {room.amenities?.join(", ")}</p>
                  <p><strong>Facilities:</strong> {room.facilities?.join(", ")}</p>
                  <p><strong>Policies:</strong> {room.policies?.join(", ")}</p>

                  <div className="d-flex justify-content-end gap-3 mt-auto pt-3">
                    <Link
                      to={`/update/${room._id}`}
                      style={{
                        backgroundColor: '#28a745',
                        color: 'white',
                        padding: '8px 14px',
                        border: 'none',
                        borderRadius: '6px',
                        fontSize: '16px',
                        textDecoration: 'none'
                      }}
                    >
                      Update
                    </Link>
                    <button
                      onClick={() => handleDelete(room._id)}
                      style={{
                        backgroundColor: '#dc3545',
                        color: 'white',
                        padding: '8px 14px',
                        border: 'none',
                        borderRadius: '6px',
                        fontSize: '16px',
                        cursor: 'pointer'
                      }}
                    >
                      Delete
                    </button>
                  </div>

                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}



//Add room
export function AddRoom() {
  const [roomData, setRoomData] = useState({
    name: "",
    roomType: "",
    description: "",
    location: "",
    occupancy: "",
    bedOptions: "",
    bathrooms: "",
    amenities: [],
    facilities: [],
    size: "",
    view: "",
    mealOptions: "",
    policies: [],
    imageurl1: "",
    imageurl2: "",
    imageurl3: "",
    pricepernight: "",
  });

  const roomTypes = ["Single", "Double", "Suite", "Deluxe", "Family"];
  const bedOptions = [
    "Single Bed",
    "Double Bed",
    "Queen Bed",
    "King Bed",
    "2 Single Beds",
    "2 Double Beds",
  ];
  const bathroomsOptions = ["Shared", "Private"];
  const viewOptions = ["Sea View", "City View", "Garden View", "Mountain View"];
  const mealOptionsList = [
    "Breakfast Only",
    "Half Board",
    "Full Board",
    "All Inclusive",
  ];
  const amenitiesList = ["WiFi", "TV", "Air Conditioning", "Mini Bar", "Safe"];
  const facilitiesList = ["Gym", "Pool", "Spa", "Parking", "Restaurant"];
  const policyOptions = [
    "No Smoking",
    "Smoking Allowed",
    "No Pets",
    "Pets Allowed",
    "No Alcohol",
    "Alcohol Allowed",
  ];
  
  const navigate = useNavigate();

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    if (type === "checkbox") {
      setRoomData((prevData) => ({
        ...prevData,
        [name]: checked
          ? [...prevData[name], value]
          : prevData[name].filter((item) => item !== value),
      }));
    } else {
      setRoomData((prevData) => ({ ...prevData, [name]: value }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
  
    if (roomData.amenities.length === 0) {
      alert("Please select at least one Amenity.");
      return;
    }
    if (roomData.facilities.length === 0) {
      alert("Please select at least one Facility.");
      return;
    }
    if (roomData.policies.length === 0) {
      alert("Please select at least one Policy.");
      return;
    }
  
    const formattedData = {
      ...roomData,
      imageurls: [
        roomData.imageurl1,
        roomData.imageurl2,
        roomData.imageurl3,
      ].filter((url) => url.trim() !== ""),
      occupancy: Number(roomData.occupancy),
      size: Number(roomData.size),
      pricepernight: Number(roomData.pricepernight),
    };
  
    try {
      await axios.post("/api/rooms/addroom", formattedData);
      alert("Room added successfully!");
      navigate("/admin/rooms");
    } catch (error) {
      console.error("Error adding room", error);
      alert("Failed to add room");
    }
  };
  

  return (
    <div>
      <form onSubmit={handleSubmit} className="room-form">
        <h2>
          <center>
            <b>Add New Room</b>
          </center>
        </h2>

        <input
          type="text"
          name="name"
          placeholder="Room Name"
          onChange={handleChange}
          required
        />

        <select
          name="roomType"
          value={roomData.roomType}
          onChange={handleChange}
          required
          style={{ color: roomData.roomType ? "black" : "gray" }}
        >
          <option value="" disabled hidden>
            Select Room Type
          </option>
          {roomTypes.map((type) => (
            <option key={type} value={type}>
              {type}
            </option>
          ))}
        </select>

        <textarea
          name="description"
          placeholder="Description"
          onChange={handleChange}
          required
        ></textarea>

        <input
          type="text"
          name="location"
          placeholder="Location"
          onChange={handleChange}
          required
        />

        <input
          type="number"
          name="occupancy"
          placeholder="Occupancy"
          min="1"
          onChange={handleChange}
          required
        />

        <select
          name="bedOptions"
          value={roomData.bedOptions}
          onChange={handleChange}
          required
          style={{ color: roomData.bedOptions ? "black" : "gray" }}
        >
          <option value="" disabled hidden>
            Select Bed Type
          </option>
          {bedOptions.map((bed) => (
            <option key={bed} value={bed}>
              {bed}
            </option>
          ))}
        </select>

        <select
          name="bathrooms"
          value={roomData.bathrooms}
          onChange={handleChange}
          required
          style={{ color: roomData.bathrooms ? "black" : "gray" }}
        >
          <option value="" disabled hidden>
            Select Bathrooms
          </option>
          {bathroomsOptions.map((bath) => (
            <option key={bath} value={bath}>
              {bath}
            </option>
          ))}
        </select>

        <select
          name="view"
          value={roomData.view}
          onChange={handleChange}
          required
          style={{ color: roomData.view ? "black" : "gray" }}
        >
          <option value="" disabled hidden>
            Select View
          </option>
          {viewOptions.map((view) => (
            <option key={view} value={view}>
              {view}
            </option>
          ))}
        </select>

        <select
          name="mealOptions"
          value={roomData.mealOptions}
          onChange={handleChange}
          required
          style={{ color: roomData.mealOptions ? "black" : "gray" }}
        >
          <option value="" disabled hidden>
            Select Meal Option
          </option>
          {mealOptionsList.map((meal) => (
            <option key={meal} value={meal}>
              {meal}
            </option>
          ))}
        </select>

        <input
          type="number"
          name="size"
          min="1"
          placeholder="Room Size (sq ft)"
          onChange={handleChange}
          required
        />

        <label>
          <b>Amenities:</b>
        </label>
        <div
          style={{
            display: "flex",
            gap: "30px",
            flexWrap: "wrap",
            marginBottom: "10px",
          }}
        >
          {["WiFi", "TV", "Air&nbsp;Conditioning", "Mini&nbsp;Bar", "Safe"].map(
            (amenity) => (
              <label
                key={amenity}
                style={{ display: "flex", alignItems: "center", gap: "2px" }}
              >
                <input
                  type="checkbox"
                  name="amenities"
                  value={amenity.replace(/&nbsp;/g, " ")} // Replace back to normal space for value
                  onChange={handleChange}
                />
                <span dangerouslySetInnerHTML={{ __html: amenity }} />
              </label>
            )
          )}
        </div>

        <label>
          <b>Facilities:</b>
        </label>
        <div style={{ display: "flex", gap: "40px", marginBottom: "10px" }}>
          {facilitiesList.map((facility) => (
            <label
              key={facility}
              style={{ display: "flex", alignItems: "center", gap: "2px" }}
            >
              <input
                type="checkbox"
                name="facilities"
                value={facility}
                onChange={handleChange}
              />
              {facility}
            </label>
          ))}
        </div>

<label>
  <b>Hotel Policies:</b>
  </label>
  <div
    style={{
      display: "flex",
      gap: "40px",
      marginBottom: "10px",
      flexWrap: "wrap",
    }}
  >
    {policyOptions.map((policy) => (
      <label
        key={policy}
        style={{
          display: "flex",
          alignItems: "center",
          gap: "20px",
          marginBottom: "5px",
          whiteSpace: "nowrap", // Prevent text from breaking into multiple lines
        }}
      >
        <input
          type="checkbox"
          name="policies"
          value={policy}
          onChange={handleChange}
        />
        {policy}
      </label>
    ))}
  </div>


        {/* Image URL Inputs + Previews */}
        <div className="image-section">
          {["imageurl1", "imageurl2", "imageurl3"].map((field, index) => (
            <div key={field} className="image-input-group">
              <label>
                <b>Image URL {index + 1}:</b>
              </label>
              <input
                type="text"
                name={field}
                placeholder={`Room Image URL ${index + 1}`}
                value={roomData[field]}
                onChange={handleChange}
              />
              {roomData[field] && (
                <img
                  src={roomData[field]}
                  alt={`Preview ${index + 1}`}
                  className="preview-image"
                />
              )}
            </div>
          ))}
        </div>
        <div className="input-wrapper">
          <span className="currency-symbol">$</span>
          <input
            type="number"
            name="pricepernight"
            placeholder="Price per Night"
            min="1"
            step="0.01"
            onChange={handleChange}
            required
          />
        </div>

        <button type="submit" className="btn">
          Add Room
        </button>
      </form>

      {/* Simple CSS for Image Previews */}
      <style>
        {`
          .image-input-group {
            display: flex;
            align-items: center;
            gap: 2px;
            margin-bottom: 10px;
          }
          .preview-image {
            width: 120px;
            height: 120px;
            object-fit: cover;
            border-radius: 5px;
            aspect-ratio: 1 / 1;
          }
        `}
      </style>
    </div>
  );
}

//All cancellations
export function Cancellations() {
  const [cancellations, setCancellations] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(false);
  const [disabledButtons, setDisabledButtons] = useState({});

  const fetchCancellations = async () => {
    setLoading(true);
    try {
      const response = await axios.get(
        "/api/cancellations/getallcancellations"
      );
      setCancellations(response.data);
      setError(false);
    } catch (err) {
      console.error(err);
      setError(true);
    }
    setLoading(false);
  };

  const updateStatus = async (cancel) => {
    setDisabledButtons((prevState) => ({
      ...prevState,
      [cancel._id]: true,
    }));

    // Save to localStorage
    const updatedDisabled = {
      ...JSON.parse(localStorage.getItem("disabledCancellations") || "{}"),
      [cancel._id]: true,
    };
    localStorage.setItem(
      "disabledCancellations",
      JSON.stringify(updatedDisabled)
    );

    try {
      setLoading(true);
      await axios.put(`/api/cancellations/updatestatus/${cancel._id}`, {
        status: "cancelled",
      });

      await axios.put(`/api/bookings/updatestatus/${cancel.bookingid}`, {
        status: "cancelled",
      });

      fetchCancellations();
      alert("Status updated to 'cancelled'");
    } catch (err) {
      console.error(
        "Error updating status:",
        err.response?.data || err.message
      );
      alert("Update failed");
    } finally {
      setLoading(false);
    }
  };

  const deleteCancellation = async (id) => {
    if (window.confirm("Are you sure you want to delete this cancellation?")) {
      try {
        await axios.delete(`/api/cancellations/delete/${id}`);
        setCancellations((prev) => prev.filter((c) => c._id !== id));

        // Remove from localStorage and state
        const updatedDisabled = { ...disabledButtons };
        delete updatedDisabled[id];
        setDisabledButtons(updatedDisabled);
        localStorage.setItem(
          "disabledCancellations",
          JSON.stringify(updatedDisabled)
        );

        alert("Cancellation deleted.");
      } catch (err) {
        alert("Failed to delete cancellation");
      }
    }
  };

  const calculateDays = (checkInDate, cancelDate) => {
    const checkIn = new Date(checkInDate);
    const cancelled = new Date(cancelDate);
    const timeDiff = checkIn - cancelled;
    const dayDiff = timeDiff / (1000 * 3600 * 24);
    return Math.round(dayDiff);
  };

  useEffect(() => {
    fetchCancellations();

    // Load disabled states from localStorage
    const savedDisabled = JSON.parse(
      localStorage.getItem("disabledCancellations") || "{}"
    );
    setDisabledButtons(savedDisabled);
  }, []);

  const [filters, setFilters] = useState({
    room: "",
    guest: "",
    checkinStart: "",
    checkinEnd: "",
    cancelledDate: "",
  });
  
  const handleFilterChange = (e) => {
    const { name, value } = e.target;
    const updatedFilters = { ...filters, [name]: value };

    // Clear checkinEnd if it's earlier than new checkinStart
    if (name === "checkinStart" && filters.checkinEnd && value > filters.checkinEnd) {
      updatedFilters.checkinEnd = "";
    }

    setFilters(updatedFilters);
  };
  
  
  const resetFilters = () => {
    setFilters({
      room: "",
      guest: "",
      checkinStart: "",
      checkinEnd: "",
      cancelledDate: "",
      status: "",
    });
  };
  
  const filteredCancellations = cancellations.filter((c) => {
    const checkin = new Date(c.checkindate);
    const cancelled = new Date(c.cancelleddate);
    const checkinStart = filters.checkinStart ? new Date(filters.checkinStart) : null;
    const checkinEnd = filters.checkinEnd ? new Date(filters.checkinEnd) : null;
    const cancelledFilter = filters.cancelledDate ? new Date(filters.cancelledDate) : null;
  
    const room = c.room || "";
    const guest = c.user || "";
    const status = c.status || "";
    const filterStatus = filters.status || "";
  
    return (
      (filters.room === "" || room.toLowerCase().includes(filters.room.toLowerCase())) &&
      (filters.guest === "" || guest.toLowerCase().includes(filters.guest.toLowerCase())) &&
      (!checkinStart || checkin >= checkinStart) &&
      (!checkinEnd || checkin <= checkinEnd) &&
      (!cancelledFilter || cancelled.toDateString() === cancelledFilter.toDateString()) &&
      (filterStatus === "" || status.toLowerCase() === filterStatus.toLowerCase())
    );
  });
  
  
  const downloadPDF = async () => {
    if (filteredCancellations.length === 0) {
      alert("No cancellations to include in the PDF report.");
      return;
    }
  
    const doc = new jsPDF();
    const pageWidth = doc.internal.pageSize.getWidth();
    const pageHeight = doc.internal.pageSize.getHeight();
  
    const title = "All Cancellations Report";
    doc.setFontSize(18);
    doc.setFont("helvetica", "bold");
    const titleWidth = doc.getTextWidth(title);
    doc.text(title, (pageWidth - titleWidth) / 2, 16);
  
    const cardX = 14;
    const cardWidth = pageWidth - 28;
    const lineHeight = 6;
    const padding = 6;
    const linesPerCard = 17;
    const textHeight = padding * 2 + linesPerCard * lineHeight;
    const totalCardHeight = textHeight + 10;
  
    for (let i = 0; i < filteredCancellations.length; i++) {
      const cancel = filteredCancellations[i];
      const positionInPage = i % 2;
  
      const cardY = positionInPage === 0 ? 30 : 30 + totalCardHeight + 10; // 10px gap between cards
  
      const lines = [
        `Room: ${cancel.room || "N/A"}`,
        `Cancellation ID: ${cancel._id || "N/A"}`,
        `Room ID: ${cancel.roomid || "N/A"}`,
        `Booking ID: ${cancel.bookingid || "N/A"}`,
        `Guest: ${cancel.user || "N/A"}`,
        `User ID: ${cancel.userid || "N/A"}`,
        `Check-in: ${new Date(cancel.checkindate).toLocaleDateString("en-CA")}`,
        `Check-out: ${new Date(cancel.checkoutdate).toLocaleDateString("en-CA")}`,
        `Amount: $${cancel.totalamount || "0.00"}`,
        `Booked Date: ${new Date(cancel.bookeddate).toLocaleDateString("en-CA")}`,
        `Cancelled Date: ${new Date(cancel.cancelleddate).toLocaleString("en-CA")}`,
        `Total Days from check-in to cancelled date: ${calculateDays(cancel.checkindate, cancel.cancelleddate)} days`,
        `Bank: ${cancel.bankName || "N/A"}, ${cancel.branchName || "N/A"}`,
        `Account Holder: ${cancel.accountHolder || "N/A"}`,
        `Account No: ${cancel.bankAccount || "N/A"}`,
        `Status: ${cancel.status === "cancelled" ? "Cancelled" : "Pending Approval"}`,
      ];
  
      // Draw card border
      doc.setDrawColor(0, 0, 0);
      doc.setLineWidth(0.5);
      doc.rect(cardX, cardY, cardWidth, totalCardHeight);
  
      // Section title
      doc.setFontSize(14);
      doc.setFont("helvetica", "bold");
      doc.text("Cancellation Details", cardX + padding, cardY + padding + 2);
  
      // Text content
      doc.setFontSize(11);
      doc.setFont("helvetica", "normal");
      let textY = cardY + padding + 10;
      lines.forEach((line) => {
        doc.text(line, cardX + padding, textY);
        textY += lineHeight;
      });
  
      // Add a new page after every two cards
      if (i % 2 === 1 && i < filteredCancellations.length - 1) {
        doc.addPage();
      }
    }
  
    doc.save("cancellations_report.pdf");
  };
  
  
  
  return (
    <div className="container mt-2">
      <h1 className="mb-4">
        <b>All Cancellations</b>
      </h1>{" "}

      <div className="d-flex justify-content-end mb-5">
          <button
            style={{
              backgroundColor: "#6f42c1",
              border: "1px solid #6f42c1",
              color: "white",
              padding: "5px 10px",
              height: "40px",
              borderRadius: "8px",
              cursor: "pointer",
            }}
            onClick={downloadPDF}
          >
            Download PDF
          </button>
        </div>

      <div className="mb-4">
  <div className="row">
    <div className="col-md-2 mb-2">
    <label><b>Guest</b></label>
      <input
        type="text"
        className="form-control"
        name="guest"
        value={filters.guest}
        onChange={handleFilterChange}
      />
    </div>
    <div className="col-md-2 mb-2">
    <label><b>Check-in Start</b></label>
      <input
        type="date"
        className="form-control"
        name="checkinStart"
        value={filters.checkinStart}
        onChange={handleFilterChange}
      />
    </div>
    <div className="col-md-2 mb-2">
    <label><b>Check-in End</b></label>
      <input
        type="date"
        className="form-control"
        name="checkinEnd"
        value={filters.checkinEnd}
        min={filters.checkinStart || ""}
        onChange={handleFilterChange}
      />
    </div>
    <div className="col-md-2 mb-2">
    <label><b>Cancelled Date</b></label>
      <input
        type="date"
        className="form-control"
        name="cancelledDate"
        value={filters.cancelledDate}
        onChange={handleFilterChange}
      />
    </div>

    <div className="col-md-2 mb-2">
    <label><b>Status</b></label>
  <select
    className="form-control"
    name="status"
    value={filters.status}
    onChange={handleFilterChange}
  >
    <option value="">All</option>
    <option value="pending cancellation">Pending Approval</option>
    <option value="cancelled">Cancelled</option>
  </select>
</div><br></br>
<div className="col-md-2 mb-2 d-flex gap-4" style={{ marginTop: "30px" }}>
  <button
    className="btn btn-dark w-100"
    style={{
      padding: "2px 4px",         // smaller vertical padding
      fontSize: "1rem",         // smaller font size
      lineHeight: "1",            // tight line height
      height: "40px",             // fixed height
      minHeight: "unset"          // override any min-height from Bootstrap
    }}
    onClick={resetFilters}
  >
    Reset Filters
  </button>
</div>


  </div>
</div>
<br/><br/><br/>
      {loading ? (
        <h2>Loading...</h2>
      ) : error ? (
        <h2>Error fetching cancellations</h2>
      ) : (
        <div className="row">
          {filteredCancellations.map((cancel) => (
            <div key={cancel._id} className="col-md-6 mb-4">
              <div className="card cancellation-card border border-dark">
                <div className="card-body">
                  <p className="card-text">
                    <h1>Cancellation details</h1>
                    <br />
                    <strong>Cancellation ID:</strong> {cancel._id}
                    <br />
                    <strong>Room:</strong> {cancel.room}
                    <br />
                    <strong>Booking ID:</strong> {cancel.bookingid}
                    <br />
                    <strong>Room ID:</strong> {cancel.roomid}
                    <br />
                    <strong>Guest:</strong> {cancel.user}
                    <br />
                    <strong>User ID:</strong> {cancel.userid}
                    <br />
                    <strong>Check-in:</strong>{" "}
                    {new Date(cancel.checkindate).toLocaleDateString("en-CA")}
                    <br />
                    <strong>Check-out:</strong>{" "}
                    {new Date(cancel.checkoutdate).toLocaleDateString("en-CA")}
                    <br />
                    <strong>Amount:</strong> ${cancel.totalamount}
                    <br />
                    <hr />
                    <strong>Booked Date:</strong>{" "}
                    {new Date(cancel.bookeddate).toLocaleDateString("en-CA")}
                    <br />
                    <strong>Cancelled Date:</strong>{" "}
                    {new Date(cancel.cancelleddate).toLocaleString("en-CA")}
                    <br />
                    <strong>
                      Total Days from check-in to cancelled date:
                    </strong>{" "}
                    {calculateDays(cancel.checkindate, cancel.cancelleddate)}{" "}
                    days
                    <br />
                    <strong>Bank:</strong> {cancel.bankName},{" "}
                    {cancel.branchName}
                    <br />
                    <strong>Account Holder:</strong> {cancel.accountHolder}
                    <br />
                    <strong>Account No.:</strong> {cancel.bankAccount}
                  </p>

                  <span className={`badge status-badge ${cancel.status}`}>
                    {cancel.status === "cancelled"
                      ? "Cancelled"
                      : "Pending Approval"}
                  </span>

                  <div className="button-container mt-3">
                    <button
                      className="update-button1"
                      disabled={
                        cancel.status === "cancelled" ||
                        disabledButtons[cancel._id]
                      }
                      style={{
                        backgroundColor:
                          cancel.status === "cancelled" ||
                          disabledButtons[cancel._id]
                            ? "#808080"
                            : "#28a745",
                        cursor:
                          cancel.status === "cancelled" ||
                          disabledButtons[cancel._id]
                            ? "not-allowed"
                            : "pointer",
                      }}
                      onClick={() => updateStatus(cancel)}
                    >
                      Update Status and continue refund
                    </button>
                    <button
                      className="delete-button1 ms-2"
                      onClick={() => deleteCancellation(cancel._id)}
                    >
                      Delete
                    </button>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

//All refunds
export function Refunds() {
  const [refunds, setRefunds] = useState([]);
  const [filteredRefunds, setFilteredRefunds] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);
  const [filters, setFilters] = useState({
    guest: "",
    amount: "",
    bank: "",
    holder: "",
    accountNo: "",
    status: "",
  });

  const navigate = useNavigate();

  const fetchRefunds = async () => {
    try {
      setLoading(true);
      const res = await axios.get("/api/refunds/getall");
      setRefunds(res.data);
      setFilteredRefunds(res.data);
      setLoading(false);
    } catch (err) {
      console.error("Failed to fetch refunds:", err);
      setError(true);
      setLoading(false);
    }
  };

  const deleteRefund = async (id) => {
    if (window.confirm("Delete this refund?")) {
      try {
        await axios.delete(`/api/refunds/delete/${id}`);
        fetchRefunds();
      } catch (err) {
        console.error("Failed to delete refund:", err);
      }
    }
  };

  const goToUpdatePage = (id) => {
    navigate(`/admin/updaterefund/${id}`);
  };

  const handleFilterChange = (e) => {
    const { name, value } = e.target;
    setFilters({ ...filters, [name]: value });
  };

  const applyFilters = () => {
    let filtered = refunds.filter((r) => {
      return (
        r.user.toLowerCase().includes(filters.guest.toLowerCase()) &&
        (filters.amount === "" || r.amount.toString() === filters.amount) &&
        r.bankName.toLowerCase().includes(filters.bank.toLowerCase()) &&
        r.bankHolderName.toLowerCase().includes(filters.holder.toLowerCase()) &&
        r.accountNo.toLowerCase().includes(filters.accountNo.toLowerCase()) &&
        r.status.toLowerCase().includes(filters.status.toLowerCase())
      );
    });
    setFilteredRefunds(filtered);
  };

  const resetFilters = () => {
    setFilters({
      guest: "",
      amount: "",
      bank: "",
      holder: "",
      accountNo: "",
      status: "",
    });
    setFilteredRefunds(refunds);
  };

  const downloadPDF = async () => {
    if (filteredRefunds.length === 0) {
      alert("No refunds to include in the PDF report.");
      return;
    }
  
    const doc = new jsPDF();
    const pageWidth = doc.internal.pageSize.getWidth();
    const pageHeight = doc.internal.pageSize.getHeight();
  
    // Add centered title on first page
    const title = "All Refunds Report";
    doc.setFontSize(18);
    doc.setFont("helvetica", "bold");
    const titleWidth = doc.getTextWidth(title);
    doc.text(title, (pageWidth - titleWidth) / 2, 16); // Y position 16 for spacing
  
    let currentYPosition = 30; // Starting Y position for the first refund box
    const cardX = 14;
    const cardWidth = pageWidth - 28;
    const lineHeight = 6;
    const padding = 6;
  
    // Loop through the refunds and add two per page
    for (let i = 0; i < filteredRefunds.length; i++) {
      const refund = filteredRefunds[i];
  
      const lines = [
        `Refund ID: ${refund._id}`,
        `Guest: ${refund.user}`,
        `Guest ID: ${refund.userid}`,
        `Booking ID: ${refund.bookingid}`,
        `Room: ${refund.room}`,
        `Amount: $${refund.amount}`,
        `Refund Date: ${new Date(refund.refundDate).toLocaleDateString("en-CA")}`,
        `Bank: ${refund.bankName}`,
        `Branch: ${refund.branch || "N/A"}`,
        `Holder: ${refund.bankHolderName}`,
        `Account No: ${refund.accountNo}`,
        `Status: ${refund.status}`,
      ];
  
      const textHeight = padding * 2 + lines.length * lineHeight;
      const totalCardHeight = textHeight + 20;
  
      // Draw card border
      doc.setDrawColor(0, 0, 0);
      doc.setLineWidth(0.5);
      doc.rect(cardX, currentYPosition, cardWidth, totalCardHeight);
  
      // Add title
      doc.setFontSize(14);
      doc.setFont("helvetica", "bold");
      doc.text("Refund Details", cardX + padding, currentYPosition + padding + 2);
  
      // Add text content
      doc.setFontSize(11);
      doc.setFont("helvetica", "normal");
      let textY = currentYPosition + padding + 10;
  
      lines.forEach(line => {
        doc.text(line, cardX + padding, textY);
        textY += lineHeight;
      });
  
      // Move the Y position for the second refund box (next to the first one)
      if (i % 2 === 0) {
        currentYPosition += totalCardHeight + 10; // Move to the next row for the second box
      } else {
        currentYPosition -= totalCardHeight + 10; // Reset for the next page
      }
  
      // Add a new page after every two refunds (except the last pair)
      if (i % 2 === 1 || i === filteredRefunds.length - 1) {
        doc.addPage();
        currentYPosition = 20; // Reset Y position for the next page
      }
    }
  
    doc.save("refunds_report.pdf");
  };
  

  useEffect(() => {
    fetchRefunds();
  }, []);

  useEffect(() => {
    applyFilters();
  }, [filters]);

  return (
    <div className="container px-3">
      <div className="d-flex justify-content-between align-items-center">
        <h1><b>All Refunds</b></h1>
        
       {/* Top-right Download PDF Button */}
       <div className="d-flex justify-content-end mb-5">
          <button
            style={{
              backgroundColor: "#6f42c1",
              border: "1px solid #6f42c1",
              color: "white",
              padding: "5px 10px",
              height: "40px",
              borderRadius: "8px",
              cursor: "pointer",
            }}
            onClick={downloadPDF}
          >
            Download PDF
          </button>
        </div>
      </div>


      {/* Filters */}
      <div className="card p-3 mb-4 shadow-sm">
        <div className="row g-2">
          <div className="col-md-2">
            <input type="text" className="form-control" name="guest" value={filters.guest} onChange={handleFilterChange} placeholder="Guest" />
          </div>
          <div className="col-md-2">
            <input type="text" className="form-control" name="amount" value={filters.amount} onChange={handleFilterChange} placeholder="Refund Amount" />
          </div>
          <div className="col-md-2">
            <input type="text" className="form-control" name="bank" value={filters.bank} onChange={handleFilterChange} placeholder="Bank" />
          </div>
          <div className="col-md-2">
            <input type="text" className="form-control" name="holder" value={filters.holder} onChange={handleFilterChange} placeholder="Bank Holder" />
          </div>
          <div className="col-md-2">
            <input type="text" className="form-control" name="accountNo" value={filters.accountNo} onChange={handleFilterChange} placeholder="Account No" />
          </div>
          <div className="col-md-2">
            <select className="form-control" name="status" value={filters.status} onChange={handleFilterChange}>
              <option value="">All</option>
              <option value="pending">Pending</option>
              <option value="done">Done</option>
            </select>
          </div>
        </div>
        <div className="mt-3">
          <button className="btn btn-secondary me-2" onClick={resetFilters}>Reset Filters</button>
        </div>
      </div>

<br></br><br></br>
      {/* Refunds List */}
      {loading ? (
        <h3>Loading...</h3>
      ) : error ? (
        <h3>Error fetching refunds</h3>
      ) : (
        <div id="refunds-section" className="row">
          {filteredRefunds.map((r) => (
            <div key={r._id} className="col-md-6 d-flex" style={{ marginBottom: "60px" }}>
              <div className="card flex-fill shadow-sm border border-dark" style={{ minHeight: "350px", marginRight: "40px" }}>
                <div className="card-body d-flex flex-column justify-content-between">
                  <div>
                    <h5 className="text-center"><b>Refund details</b></h5><br></br>
                    <p className="card-text">
                      <b>Refund ID:</b> {r._id}<br />
                      <b>Guest:</b> {r.user}<br />
                      <b>Guest ID:</b> {r.userid}<br />
                      <b>Booking ID:</b> {r.bookingid}<br />
                      <b>Room:</b> {r.room}<br />
                      <b>Amount:</b> ${r.amount}<br />
                      <b>Refund Date:</b> {new Date(r.refundDate).toLocaleDateString("en-CA")}<br />
                      <b>Bank:</b> {r.bankName}<br />
                      <b>Branch:</b> {r.branch}<br/>
                      <b>Holder:</b> {r.bankHolderName}<br />
                      <b>Account No:</b> {r.accountNo}<br />
                      <b>Status:</b>{" "}
                      <span className={`status-badge ${
                        r.status.trim().toLowerCase() === "done" ? "bg-success" :
                        r.status.trim().toLowerCase() === "pending" ? "bg-pink" :
                        "bg-secondary"
                      }`}>
                        {r.status}
                      </span>
                    </p>
                  </div>
                  <div className="d-flex justify-content-end mt-3">
                    <button onClick={() => goToUpdatePage(r._id)} className="btn btn-update me-2">Update</button>
                    <button onClick={() => deleteRefund(r._id)} className="btn btn-delete me-2">Delete</button>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}


// All Feedbacks Management Component
export function AllFeedbacks() {
  return <AllFeedback />;
}


