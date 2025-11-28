import "./App.css";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import Navbar from "./components/Navbar";
import Adminnav from "./components/Adminnav";
import { BrowserRouter, Routes, Route, useLocation } from "react-router-dom";
import Homescreen from "./screens/Homescreen";
import Bookingscreen from "./screens/Bookingscreen";
import Adminscreen, {
  Bookings,
  Rooms,
  AddRoom,
  Cancellations,
  Refunds,
  AllFeedbacks,
} from "./screens/Adminscreen";
import UpdateRoom from "./screens/UpdateRoom";
import Mybookings from "./screens/Mybookings";
import UpdateRefund from "./screens/UpdateRefund";
import AboutUs from "./screens/AboutUs";
import ContactUs from "./screens/ContactUs";
import Feedback from "./screens/Feedback";
import Login from "./components/Login";
import Register from "./components/Register";
import Profile from "./components/profile";

function AppContent() {
  const location = useLocation();
  const isAdminRoute =
    location.pathname.startsWith("/admin") ||
    location.pathname.startsWith("/update");

  return (
    <div className="App">
      {isAdminRoute ? <Adminnav /> : <Navbar />}
      <Routes>
        <Route path="/" element={<Homescreen />} />
        <Route path="/home" element={<Homescreen />} />
        <Route
          path="/book/:roomid/:checkindate/:checkoutdate"
          element={<Bookingscreen />}
        />
        <Route path="/bookings" element={<Mybookings />} />
        <Route path="/admin" element={<Adminscreen />} />
        <Route path="/admin/bookings" element={<Bookings />} />
        <Route path="/admin/rooms" element={<Rooms />} />
        <Route path="/admin/addroom" element={<AddRoom />} />
        <Route path="/update/:roomid" element={<UpdateRoom />} />
        <Route path="/admin/cancellations" element={<Cancellations />} />
        <Route path="/admin/refunds" element={<Refunds />} />
        <Route path="/admin/feedbacks" element={<AllFeedbacks />} />
        <Route
          path="/admin/updaterefund/:refundid"
          element={<UpdateRefund />}
        />
        <Route path="/aboutus" element={<AboutUs />} />
        <Route path="/contactus" element={<ContactUs />} />
        <Route path="/feedback" element={<Feedback />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/profile" element={<Profile />} />
      </Routes>
    </div>
  );
}

function App() {
  return (
    <BrowserRouter>
      {/* Only ONE ToastContainer */}
      <ToastContainer position="top-center" theme="colored" />
      <AppContent />
    </BrowserRouter>
  );
}

export default App;
