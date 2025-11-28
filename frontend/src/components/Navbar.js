import React, { useState, useRef, useEffect } from "react";
import profileImg from "../assets/profile.jpeg";
import logoImg from "../images/logo.png";
import { Link } from "react-router-dom";

function Navbar() {
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [profilePhoto, setProfilePhoto] = useState(profileImg);
  const profileRef = useRef();

  // Get the current path
  const currentPath = window.location.pathname;

  useEffect(() => {
    // Get user profile photo from localStorage
    const userData = JSON.parse(localStorage.getItem('user'));
    if (userData && userData.profilePhoto) {
      setProfilePhoto(userData.profilePhoto);
    }

    // Listen for profile photo updates
    const handleProfilePhotoUpdate = (event) => {
      setProfilePhoto(event.detail.profilePhoto);
    };

    window.addEventListener('profilePhotoUpdated', handleProfilePhotoUpdate);

    return () => {
      window.removeEventListener('profilePhotoUpdated', handleProfilePhotoUpdate);
    };
  }, []);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (profileRef.current && !profileRef.current.contains(event.target)) {
        setDropdownOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  const toggleDropdown = () => {
    setDropdownOpen(!dropdownOpen);
  };

  const handleLogout = () => {
    localStorage.removeItem('user');
    window.location.href = '/';
  };

  return (
    <div className="navbar-wrapper">
      {/* Upper Section */}
      <nav className="navbar upper-navbar">
        <div className="container-fluid d-flex justify-content-end align-items-center position-relative">
          <Link to="/register" className="btn btn-light m-2">Sign Up</Link>
          <Link to="/login" className="btn btn-light ml-2">Log In</Link>

          {/* Profile Icon with Dropdown */}
          <div
            ref={profileRef}
            className="profile-icon position-relative"
            style={{ cursor: "pointer" }}
          >
            <img
              src={profilePhoto}
              alt="Profile"
              className="profile-img"
              onClick={toggleDropdown}
            />
            {dropdownOpen && (
              <div className="dropdown-menu-custom">
                <Link 
                  className="dropdown-item" 
                  to="/profile"
                  onClick={() => {
                    console.log('Profile link clicked');
                    setDropdownOpen(false);
                  }}
                >
                  My Profile
                </Link>
                <Link 
                  className="dropdown-item" 
                  to="/bookings"
                  onClick={() => setDropdownOpen(false)}
                >
                  My Bookings
                </Link>
                <a className="dropdown-item" href="#" onClick={handleLogout}>
                  Logout
                </a>
              </div>
            )}
          </div>
        </div>
      </nav>

      {/* Lower Section */}
      <nav className="navbar lower-navbar">
        <div className="container-fluid d-flex justify-content-between align-items-center">
          {/* Logo */}
          <Link className="navbar-brand d-flex align-items-center" to="/webhome">
            <img
              src={logoImg}
              alt="Dream Heaven Logo"
              style={{ height: "50px", marginRight: "10px" }}
            />
            <span className="navbar-brand">Dream Heaven</span>
          </Link>

          {/* Navigation Links */}
          <ul className="navbar-nav mx-auto d-flex flex-row">
            <li className="nav-item">
              <Link
                className={`nav-link ${currentPath === "/webhome" ? "active-link" : ""}`}
                to="/webhome"
              >
                Home
              </Link>
            </li>
            <li className="nav-item">
              <Link
                className={`nav-link ${currentPath === "/home" ? "active-link" : ""}`}
                to="/home"
              >
                Rooms & Reservations
              </Link>
            </li>
            <li className="nav-item">
              <Link
                className={`nav-link ${currentPath === "/feedback" ? "active-link" : ""}`}
                to="/feedback"
              >
                Feedback
              </Link>
            </li>
            <li className="nav-item">
              <Link
                className={`nav-link ${currentPath === "/aboutus" ? "active-link" : ""}`}
                to="/aboutus"
              >
                About Us
              </Link>
            </li>
            <li className="nav-item">
              <Link
                className={`nav-link ${currentPath === "/contactus" ? "active-link" : ""}`}
                to="/contactus"
              >
                Contact Us
              </Link>
            </li>
          </ul>
        </div>
      </nav>
    </div>
  );
}

export default Navbar;
