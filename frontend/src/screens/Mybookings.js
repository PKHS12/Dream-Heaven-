import React, { useEffect, useState } from "react";
import axios from "axios";
import moment from "moment";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

function Mybookings() {
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(false);
  const [bankAccount, setBankAccount] = useState("");
  const [bankName, setBankName] = useState("");
  const [branchName, setBranchName] = useState("");
  const [accountHolder, setAccountHolder] = useState("");
  const [selectedBooking, setSelectedBooking] = useState(null);
  const [validationError, setValidationError] = useState("");

  const user = {
    _user: "Sahanya Poojani",
    _id: "68240d66a006838e5df3e679", // ✅ This exists in your MongoDB
  };
  

  const fetchBookings = async () => {
    setLoading(true);
    try {
      const response = await axios.post("http://localhost:5000/api/bookings/getbookingsbyuserid", {
        userid: user._id,
      });
  
      const bookingsWithRoomData = await Promise.all(
        response.data.map(async (booking) => {
          try {
            const roomResponse = await axios.post("http://localhost:5000/api/rooms/getroombyid", {
              roomid: booking.roomid,
            });
            return { ...booking, room: roomResponse.data };
          } catch (roomError) {
            console.error("Error fetching room for booking:", booking._id, roomError.message);
            return { ...booking, room: { name: "Unknown Room" } }; // fallback
          }
        })
      );
  
      const deletedIds = JSON.parse(localStorage.getItem("deletedBookings")) || [];
  
      const filteredBookings = bookingsWithRoomData.filter(
        (b) => !deletedIds.includes(b._id)
      );
  
      setBookings(filteredBookings);
    } catch (err) {
      console.error("Error fetching bookings:", err.message);
      setError(true);
    }
    setLoading(false);
  };
  
  useEffect(() => {
    fetchBookings();
  }, []);

  const handleCancelClick = (booking) => {
    const daysUntilCheckIn = moment(booking.checkindate, "YYYY-MM-DD").diff(
      moment(),
      "days"
    );

    if (daysUntilCheckIn < 7) {
      toast.error("Cancellations must be made at least 7 days before check-in.");
      return;
    }

    if (booking.status !== "booked") return;

    setSelectedBooking(booking);
    setBankAccount("");
    setBankName("");
    setBranchName("");
    setAccountHolder("");
    setValidationError("");
  };

  const submitCancellation = async () => {
  const errors = {};

  if (!bankName.trim()) errors.bankName = "Bank name is required.";
  if (!branchName.trim()) errors.branchName = "Branch name is required.";
  if (!accountHolder.trim()) errors.accountHolder = "Account holder's name is required.";

  if (!bankAccount.trim()) {
    errors.bankAccount = "Bank account number is required.";
  } else if (!/^\d{6,20}$/.test(bankAccount)) {
    errors.bankAccount = "Bank account number must be 6 to 20 digits.";
  }

  const daysUntilCheckIn = moment(selectedBooking.checkindate).diff(moment(), "days");
  if (daysUntilCheckIn < 7) {
    toast.error("Cancellations must be made at least 7 days before check-in.");
    return;
  }

  if (Object.keys(errors).length > 0) {
    setValidationError(errors);
    return;
  }

  setValidationError({}); // Clear all previous errors

  try {
    const cancelDetails = {
      room: selectedBooking.room?.name || "Room",
      bookingid: selectedBooking._id,
      roomid: selectedBooking.roomid,
      user: user._user,
      userid: user._id,
      checkindate: selectedBooking.checkindate,
      checkoutdate: selectedBooking.checkoutdate,
      totalamount: selectedBooking.totalamount,
      bookeddate: new Date(selectedBooking.createdAt),
      cancelleddate: new Date(),
      totaldays: selectedBooking.totaldays,
      bankName,
      branchName,
      accountHolder,
      bankAccount,
    };

    await axios.post("/api/cancellations/createcancellation", cancelDetails);

    await axios.put(`/api/bookings/updatestatus/${selectedBooking._id}`, {
      status: "pending",
    });

    setBookings((prev) =>
      prev.map((b) =>
        b._id === selectedBooking._id ? { ...b, status: "pending" } : b
      )
    );

    toast.success("Cancellation request submitted. Please wait for approval.");
    setSelectedBooking(null);
    fetchBookings();
  } catch (error) {
    console.error("Cancellation error:", error);
    toast.error("An error occurred during cancellation.");
  }
};



  const deleteBooking = (bookingid) => {
    if (!window.confirm("Are you sure you want to remove this booking from your list?")) return;

    const deletedIds = JSON.parse(localStorage.getItem("deletedBookings")) || [];

    if (!deletedIds.includes(bookingid)) {
      deletedIds.push(bookingid);
      localStorage.setItem("deletedBookings", JSON.stringify(deletedIds));
    }

    setBookings((prevBookings) =>
      prevBookings.filter((b) => b._id !== bookingid)
    );

    alert("Booking removed from your view.");
  };

  return (
    <div className="mybookings-container">
      <br />
      <br /><br />
      <h2><center>My Bookings</center></h2>

      {error && (
        <div style={{ color: "red", marginBottom: "15px" }}>
          Failed to fetch bookings. Please try again later.
        </div>
      )}

      {loading ? (
        <h4>Loading...</h4>
      ) : bookings.length === 0 ? (
        <h4>No bookings found.</h4>
      ) : (
        <div className="mybookings1-container">
          {bookings.map((booking) => (
            <div className="booking1-card" key={booking._id}>
              <h1 className="room-title">{booking.room?.name || "Room"}</h1>
              <p><strong>Booking ID:</strong> {booking._id}</p>
              <p><strong>User:</strong> {user._user}</p>
              <p><strong>User ID:</strong> {booking.userid}</p>
              <p><strong>Transaction ID:</strong> {booking.transactionId || "N/A"}</p>
              <p><strong>Booked Date:</strong> {moment(booking.createdAt).format("DD-MM-YYYY")}</p>
              <p><strong>Check In:</strong> {booking.checkindate}</p>
              <p><strong>Check Out:</strong> {booking.checkoutdate}</p>
              <p><strong>Amount:</strong> ${booking.totalamount}</p>
              <p>
                <strong>Status:</strong>{" "}
                <span
                  className={`status-badge ${
                    booking.status === "booked"
                      ? "confirmed"
                      : booking.status === "pending"
                      ? "pending"
                      : "cancelled"
                  }`}
                >
                  {booking.status === "booked"
                    ? "Confirmed"
                    : booking.status === "pending"
                    ? "Pending Cancellation"
                    : "Cancelled"}
                </span>
              </p>

              <div className="button-container">
                <button
                  className="cancel-button"
                  onClick={() => handleCancelClick(booking)}
                  disabled={booking.status !== "booked"}
                >
                  Cancel Booking
                </button>

                <button
                  className="delete-button"
                  onClick={() => deleteBooking(booking._id)}
                >
                  Delete
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {selectedBooking && (
  <div className="popup">
    <div className="popup-inner">
      <br />
      <h3>Enter Bank Details for Refund</h3>

      {/* SHOW ALL VALIDATION ERRORS AT THE TOP */}
      {Object.keys(validationError).length > 0 && (
        <div style={{ color: "red", marginBottom: "10px" }}>
          <ul style={{ margin: 0, paddingLeft: "20px" }}>
            {Object.values(validationError).map((err, index) => (
              <li key={index}>{err}</li>
            ))}
          </ul>
        </div>
      )}

      <input
        type="text"
        placeholder="Bank Name"
        value={bankName}
        onChange={(e) => {
          setBankName(e.target.value);
          if (validationError.bankName) {
            setValidationError((prev) => {
              const updated = { ...prev };
              delete updated.bankName;
              return updated;
            });
          }
        }}
      />

      <input
        type="text"
        placeholder="Branch Name"
        value={branchName}
        onChange={(e) => {
          setBranchName(e.target.value);
          if (validationError.branchName) {
            setValidationError((prev) => {
              const updated = { ...prev };
              delete updated.branchName;
              return updated;
            });
          }
        }}
      />

      <input
        type="text"
        placeholder="Account Holder's Name"
        value={accountHolder}
        onChange={(e) => {
          setAccountHolder(e.target.value);
          if (validationError.accountHolder) {
            setValidationError((prev) => {
              const updated = { ...prev };
              delete updated.accountHolder;
              return updated;
            });
          }
        }}
      />

      <input
        type="text"
        placeholder="Bank Account Number"
        value={bankAccount}
        onChange={(e) => {
          setBankAccount(e.target.value);
          if (validationError.bankAccount) {
            setValidationError((prev) => {
              const updated = { ...prev };
              delete updated.bankAccount;
              return updated;
            });
          }
        }}
      />

      <button onClick={submitCancellation}>Submit Cancellation</button>
      <button
        className="cancel-popup"
        onClick={() => setSelectedBooking(null)}
      >
        Close
      </button>
    </div>
  </div>
)}

    </div>
  );
}

export default Mybookings;
