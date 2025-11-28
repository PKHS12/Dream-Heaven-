import React, { useState } from "react";

function ContactUs() {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    message: "",
  });

  const handleChange = (e) => {
    setFormData((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    alert("Message sent successfully!");
    setFormData({ name: "", email: "", message: "" });
  };

  return (
    <div
      style={{
        backgroundColor: "rgba(158, 190, 211, 0.6)", // ✅ Make sure this path is correct
        backgroundSize: "cover",
        backgroundPosition: "center",
        backgroundRepeat: "no-repeat",
        minHeight: "100vh",
        padding: "60px 20px",
        position: "relative",
        zIndex: 0,
        fontFamily: "'Poppins', sans-serif",
      }}
    >
      {/* Dark Overlay */}
      <div
        style={{
          position: "absolute",
          top: 0,
          left: 0,
          height: "100%",
          width: "100%",
          zIndex: 1,
        }}
      ></div>

      {/* Main Content */}
      <div
        className="container"
        style={{ position: "relative", zIndex: 2, color: "white" }}
      >
        <h2
          className="text-center mb-2"
          style={{ color: "#0d6efd", fontWeight: "bold", marginTop: "30px" }}
        >
          Contact Us
        </h2>

        <br />
        <br />

        <div className="row g-4">
          {/* Contact Info Box */}
          <div className="col-md-6">
  <h3
  style={{
    color: "black",
    marginBottom: "20px",
    fontSize: "16px",
    fontStyle: "italic",
    fontWeight: 400,
  }}
>
  If you have any issues, feel free to contact us. We are available <strong>24/7</strong> to help you!
</h3>


  <div
    style={{
      backgroundImage: "url('/images12.jpg')",
      backgroundSize: "cover",
      backgroundRepeat: "no-repeat",
      marginRight: "30px",
      backgroundPosition: "center",
      padding: "20px 20px",
      borderRadius: "15px",
      color: "black",
      minHeight: "100px",
    }}
  >
    <h4
      style={{
        fontWeight: "bold",
        fontSize: "26px",
        marginBottom: "20px",
      }}
    >
      Dream Heaven Hotel
    </h4>
    <p>
      <strong>Address:</strong> 123 Beachside Road, Galle, Sri Lanka
    </p>
    <p>
      <strong>Phone:</strong> +94 77 123 4567
    </p>
    <p>
      <strong>Email:</strong> info@dreamheaven.com
    </p>
    <p>
      <strong>Facebook:</strong>{" "}
      <a
        href="https://facebook.com/dreamheaven"
        target="_blank"
        style={{ color: "blue", textDecoration: "underline" }}
      >
        facebook.com/dreamheaven
      </a>
    </p>
    <p>
      <strong>Instagram:</strong>{" "}
      <a
        href="https://instagram.com/dreamheaven"
        target="_blank"
        style={{ color: "blue", textDecoration: "underline" }}
      >
        instagram.com/dreamheaven
      </a>
    </p>
    <p>
      <strong>TikTok:</strong>{" "}
      <a
        href="https://tiktok.com/@dreamheaven"
        target="_blank"
        style={{ color: "blue", textDecoration: "underline" }}
      >
        tiktok.com/@dreamheaven
      </a>
    </p>
    <p>
      <strong>Hours:</strong> Mon - Sun: 7:00 AM – 10:00 PM
    </p>
  </div>
</div>

          {/* Contact Form */}
          <div className="col-md-6">
            <div
              style={{
                backgroundColor: "#a1b8ddff",
                borderRadius: "10px",
                padding: "20px",
                color: "#000",
                border: "2px solid #193d79ff",
              }}
            >
              <form onSubmit={handleSubmit}>
                

                <div className="mb-4">
                  <label className="form-label">Your Name</label>
                  <input
                    type="text"
                    name="name"
                    className="form-control"
                    value={formData.name}
                    onChange={handleChange}
                    required
                    style={{ border: "1px solid #ccc" }}
                  />
                </div>

                <div className="mb-4">
                  <label className="form-label">Your Email</label>
                  <input
                    type="email"
                    name="email"
                    className="form-control"
                    value={formData.email}
                    onChange={handleChange}
                    required
                    style={{ border: "1px solid #ccc" }}
                  />
                </div>

                <div className="mb-4">
                  <label className="form-label">Your Message</label>
                  <textarea
                    name="message"
                    className="form-control"
                    rows="4"
                    value={formData.message}
                    onChange={handleChange}
                    required
                    style={{ border: "1px solid #ccc" }}
                  />
                </div>

                <button type="submit" className="btn w-100">
                  Send Message
                </button>
              </form>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default ContactUs;
