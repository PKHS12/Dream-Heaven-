import React, { useState, useEffect } from "react";

function AboutUs() {
  const fullSentence = "We don't just offer rooms — we offer memories.";
  const words = fullSentence.split(" ");
  const [visibleWords, setVisibleWords] = useState([]);
  const [wordIndex, setWordIndex] = useState(0);

  useEffect(() => {
    const timer = setTimeout(() => {
      if (wordIndex < words.length) {
        setVisibleWords((prev) => [...prev, words[wordIndex]]);
        setWordIndex((prev) => prev + 1);
      } else {
        // Immediately restart with first word (no pause, no empty flash)
        setVisibleWords([words[0]]);
        setWordIndex(1);
      }
    }, 500); // 0.5 second per word

    return () => clearTimeout(timer);
  }, [wordIndex, words]);

  const images = [
    "/background.jpeg",
    "/download.jpeg",
    "/image.jpeg",
    "/images.jpeg",
  ];

  // visibleCount will go 0 (none), 1, 2, 3, 4, then back to 0
  const [visibleCount, setVisibleCount] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setVisibleCount((prev) => {
        if (prev === images.length) {
          return 0; // clear all after showing all 4
        }
        return prev + 1;
      });
    }, 1000); // 1 seconds interval
    return () => clearInterval(interval);
  }, [images.length]);

  return (
    <div>
      <div className="container mt-5 py-4" style={{ maxWidth: "1000px" }}>
        <div className="text-center mb-4">
          <p
            style={{
              fontWeight: "bold",
              color: "#86722fff",
              fontSize: "2rem",
              lineHeight: "1.1",
            }}
          >
            Welcome to Dream Heaven
          </p>
          <p className="lead" style={{ color: "#f1a10cff", lineHeight: "1.8" }}>
            Where comfort meets the sea breeze
          </p>
        </div>
        <br />

        {/* Intro Paragraph */}
        <div className="row justify-content-center mb-4">
          <div className="col-md-12">
            <p style={{ fontSize: "1rem", lineHeight: "1.8" }}>
              At <strong>Dream Heaven</strong>, nestled in the scenic coast of
              Weligama, we blend nature’s beauty with luxury and hospitality.
              Whether you're a solo traveler, a couple on a romantic escape, or
              a family on vacation — we offer the perfect stay.
            </p>
          </div>
        </div>

        {/* Vision & Mission Cards - side by side */}
        <div className="row justify-content-center mb-5">
          <div className="col-md-6 mb-3">
            <div className="card shadow-sm border-0 p-4 h-100">
              <h3 style={{ color: "#7d5797ff", fontWeight: "bold" }}>
                Our Vision
              </h3>
              <p style={{ fontSize: "1rem", lineHeight: "1.8" }}>
                To be the leading coastal getaway in Sri Lanka, known for our
                exceptional service, warm hospitality, and unforgettable
                experiences that connect guests with the beauty of the ocean.
              </p>
            </div>
          </div>
          <div className="col-md-6 mb-3">
            <div className="card shadow-sm border-0 p-4 h-100">
              <h3 style={{ color: "#8b4476ff", fontWeight: "bold" }}>
                Our Mission
              </h3>
              <p style={{ fontSize: "1rem", lineHeight: "1.8" }}>
                Our mission is to provide each guest with a memorable stay by
                offering comfort, quality, and personalized care — ensuring that
                every moment spent at Dream Heaven brings joy, relaxation, and a
                longing to return.
              </p>
            </div>
          </div>
        </div>

        {/* Feature List - Enhanced */}
        <div className="row mt-4">
          <div className="col-md-12">
            <p className="fs-5 fw-semibold mb-3" style={{ color: "#2f38b3ff" }}>
              What Makes Us Special:
            </p>
            <ul className="list-unstyled row gx-4 gy-3">
              <li className="col-md-6 d-flex align-items-start">
                <i className="bi bi-image-fill text-primary me-3 fs-4"></i>
                <span className="fs-6">Beautiful beachfront views</span>
              </li>
              <li className="col-md-6 d-flex align-items-start">
                <i className="bi bi-house-door-fill text-success me-3 fs-4"></i>
                <span className="fs-6">Comfortable, spacious rooms</span>
              </li>
              <li className="col-md-6 d-flex align-items-start">
                <i className="bi bi-cup-straw text-warning me-3 fs-4"></i>
                <span className="fs-6">
                  Delicious local and international cuisine
                </span>
              </li>
              <li className="col-md-6 d-flex align-items-start">
                <i className="bi bi-emoji-smile-fill text-info me-3 fs-4"></i>
                <span className="fs-6">Friendly and caring staff</span>
              </li>
              <li className="col-md-6 d-flex align-items-start">
                <i className="bi bi-wifi text-danger me-3 fs-4"></i>
                <span className="fs-6">Free Wi-Fi & 24/7 support</span>
              </li>
            </ul>
          </div>
        </div>

        {/* Final Statement (Typing Animation) */}
        <div className="text-center mt-5">
          <h4
            style={{
              color: "#e91e63",
              fontSize: "1.5rem",
              fontStyle: "italic",
              transition: "all 0.3s ease-in-out",
            }}
          >
            {visibleWords.join(" ")}
          </h4>
        </div>
        <br />
        <br />
        <br />
      </div>

      {/* Image row outside container — full width from left edge */}
      <style>{`
  .image-row {
    display: flex;
    justify-content: center; /* Changed from flex-start to center */
    gap: 10px;
    max-width: 100vw;
    padding: 10px 20px;
    overflow-x: auto;
    margin: 0 auto 60px auto;
  }
  .image-row img {
    width: 22%;
    height: 200px;
    object-fit: cover;
    border-radius: 8px;
    box-shadow: 0 2px 8px rgba(0,0,0,0.15);
    opacity: 0;
    transition: opacity 0.8s ease-in-out;
    flex-shrink: 0;
  }
  .image-row img.visible {
    opacity: 1;
  }
`}</style>

      <div className="image-row">
        {images.map((src, idx) => (
          <img
            key={idx}
            src={src}
            alt={`Feature ${idx + 1}`}
            className={idx < visibleCount ? "visible" : ""}
          />
        ))}
      </div>
    </div>
  );
}

export default AboutUs;
