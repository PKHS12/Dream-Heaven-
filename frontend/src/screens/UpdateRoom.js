import React, { useState, useEffect } from "react";
import axios from "axios";
import { useParams, useNavigate } from "react-router-dom";

function UpdateRoom() {
  const { roomid } = useParams();
  const navigate = useNavigate();

  const [roomData, setRoomData] = useState({
    name: "",
    roomType: "",
    description: "",
    location: "",
    occupancy: 1,
    bedOptions: "",
    bathrooms: 1,
    amenities: [],
    facilities: [],
    size: 0,
    view: "",
    mealOptions: "",
    policies: "",
    pricepernight: 0,
    imageurls: ["", "", ""],
  });
  const roomTypes = ["Single", "Double", "Suite", "Deluxe", "Family"];

  useEffect(() => {
    const fetchRoomDetails = async () => {
      try {
        const response = await axios.post(`/api/rooms/getroombyid/${roomid}`);
        if (response.data) {
          setRoomData(response.data);
        }
      } catch (error) {
        console.error("Error fetching room details:", error);
      }
    };

    fetchRoomDetails();
  }, [roomid]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setRoomData((prev) => ({ ...prev, [name]: value }));
  };

  const handleImageChange = (index, value) => {
    setRoomData((prev) => {
      const updatedImages = [...prev.imageurls];
      updatedImages[index] = value;
      return { ...prev, imageurls: updatedImages };
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await axios.put(`/api/rooms/updateroom/${roomid}`, roomData);
      alert("Room updated successfully!");
      navigate("/admin/rooms");
    } catch (error) {
      console.error("Error updating room:", error);
      alert("Failed to update room");
    }
  };

  return (
    <div>
      <form onSubmit={handleSubmit} className="room-form">
        <h2>
          <center>Update Room</center>
        </h2>

        <label>
          <b>Room Name:</b>
        </label>
        <input
          type="text"
          name="name"
          value={roomData.name}
          onChange={handleChange}
          required
        />

        <select
          name="roomType"
          value={roomData.roomType} // Ensure the selected roomType is set from state
          onChange={handleChange}
          required
        >
          <option value="" disabled hidden>Select Room Type</option>
          {roomTypes.map((type) => (
            <option key={type} value={type}>
              {type}
            </option>
          ))}
        </select>

        <label>
          <b>Description:</b>
        </label>
        <textarea
          name="description"
          value={roomData.description}
          onChange={handleChange}
          required
        ></textarea>

        <label>
          <b>Location:</b>
        </label>
        <input
          type="text"
          name="location"
          value={roomData.location}
          onChange={handleChange}
          required
        />

        <label>
          <b>Price per Night:</b>
        </label>
        <input
          type="number"
          name="pricepernight"
          min="1"
          value={roomData.pricepernight}
          onChange={handleChange}
          required
        />

        <div className="image-section">
          {roomData.imageurls.map((url, index) => (
            <div key={index} className="image-input-group">
              <label>
                <b>Image URL {index + 1}:</b>
              </label>
              <input
                type="text"
                value={url}
                onChange={(e) => handleImageChange(index, e.target.value)}
              />
              {url && (
                <img
                  src={url}
                  alt={`New Image ${index + 1}`}
                  className="preview-image"
                />
              )}
            </div>
          ))}
        </div>

        <button type="submit" className="btn">
          Update Room
        </button>
      </form>

      <style>
        {`
    .image-input-group {
  display: flex;
  align-items: center;
  gap: 10px;
  margin-bottom: 10px;
}

.preview-image {
  width: 120px; /* Adjust width */
  height: 120px; /* Adjust height */
  object-fit: cover; /* Ensures all images fit within the box without distortion */
  border-radius: 5px;
  display: block;
  aspect-ratio: 1 / 1; /* Ensures uniform aspect ratio */
}

  `}
      </style>
    </div>
  );
}

export default UpdateRoom;
