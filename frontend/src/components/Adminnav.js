import React, { useState, useRef, useEffect } from "react";
import { Link } from "react-router-dom";
import profileImg from "../assets/profile.jpeg";
import logoImg from "../images/logo.png";


function Adminnav() {
  const [profileDropdownOpen, setProfileDropdownOpen] = useState(false);
  const [activeDropdown, setActiveDropdown] = useState(null);
  const profileRef = useRef();
  const navRef = useRef();

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (
        profileRef.current &&
        !profileRef.current.contains(event.target)
      ) {
        setProfileDropdownOpen(false);
      }

      if (
        navRef.current &&
        !navRef.current.contains(event.target)
      ) {
        setActiveDropdown(null);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const toggleDropdown = (menu) => {
    setActiveDropdown((prev) => (prev === menu ? null : menu));
  };

  return (
    <nav className="admin-navbar" ref={navRef}>
      <div className="admin-navbar-container">
        {/* Logo */}
        <Link to="/admin" className="admin-logo">
          <img src={logoImg} alt="Dream Heaven Logo" className="logo-img" />
          <span>Dream Heaven</span>
        </Link>

        {/* Navigation Links */}
        <ul className="admin-nav-links">
        <li className="dropdown">
    <button onClick={() => toggleDropdown("rooms")}>
      Rooms ▾
    </button>
    <ul className={`dropdown-menu ${activeDropdown === "rooms" ? "show" : ""}`}>
      <li><Link to="/admin/addroom">Add Room</Link></li>
      <li><Link to="/admin/rooms">All Room</Link></li>
    </ul>
  </li>

  <li className="dropdown">
    <button onClick={() => toggleDropdown("bookings")}>
      Bookings ▾
    </button>
    <ul className={`dropdown-menu ${activeDropdown === "bookings" ? "show" : ""}`}>
      <li><Link to="/admin/bookings">All Bookings</Link></li>
      <li><Link to="/admin/cancellations">All Cancellations</Link></li>
      <li><Link to="/admin/refunds">All Refunds</Link></li>
    </ul>
  </li>

          <li><Link to="/admin/guests">Guests</Link></li>
          <li><Link to="/admin/inquiries">Inquiries</Link></li>
          <li><Link to="/admin/payments">Payments</Link></li>
          <li><Link to="/admin/feedbacks">All Feedbacks</Link></li>
        </ul>

        {/* Profile Section */}
        <div className="admin-profile" ref={profileRef} onClick={() => setProfileDropdownOpen(!profileDropdownOpen)}>
          <img src={profileImg} alt="Profile" className="admin-profile-img" />
          {profileDropdownOpen && (
            <div className="admin-dropdown-menu">
              <Link to="/admin/profile">My Profile</Link>
              <Link to="/webhome">Logout</Link>
            </div>
          )}
        </div>
      </div>
    </nav>
  );
}

export default Adminnav;
