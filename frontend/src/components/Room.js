import React, { useState } from "react";
import { Modal, Button, Carousel } from "react-bootstrap";
import { Link } from "react-router-dom";

function Room({ room, checkindate, checkoutdate }) {
  const [show, setShow] = useState(false);

  const handleClose = () => setShow(false);
  const handleShow = () => setShow(true);

  const formatList = (value) => {
    if (!value) return "Not specified";
    if (Array.isArray(value)) return value.join(", ");
    return value; // assume already a comma-separated string
  };

  if (!room) {
    return <p>No room data available</p>;
  }

  return (
    <div className="row bs">
      <div className="col-md-4">
        {room.imageurls && room.imageurls.length > 0 ? (
          <img src={room.imageurls[0]} className="smalling" alt="Room" />
        ) : (
          <p>No image available</p>
        )}
      </div>
      <div className="col-md-7">
        <h1>{room.name}</h1>
        <p><b>Amenities:</b> {formatList(room.amenities)}</p>
        <p><b>Occupancy:</b> {room.occupancy || "Not specified"}</p>
        <p><b>Type:</b> {room.roomType || "Not specified"}</p>
        <p><b>Facilities:</b> {formatList(room.facilities)}</p>
        <p><b>Price per night:</b> ${room.pricepernight || "Not specified"}</p>
        <div style={{ float: "right" }}>
          {checkindate && checkoutdate && (
            <Link
              to={`/book/${room._id}/${encodeURIComponent(checkindate)}/${encodeURIComponent(checkoutdate)}`}
            >
              <button className="btn btn-primary m-2">Book Now</button>
            </Link>
          )}
          <button className="btn btn-primary" onClick={handleShow}>
            View details
          </button>
        </div>
      </div>

      <Modal show={show} onHide={handleClose} size="md">
        <Modal.Header closeButton>
          <Modal.Title>{room.name}</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Carousel>
            {room.imageurls && room.imageurls.map((url, index) => (
              <Carousel.Item key={index}>
                <img className="d-block w-100 bigimg" src={url} alt={`Slide ${index}`} />
              </Carousel.Item>
            ))}
          </Carousel>

          <p>{room.description}</p>
          <br />
          <p><b>Room occupancy:</b> {room.occupancy}</p>
          <p><b>Amenities:</b> {formatList(room.amenities)}</p>
          <p><b>Facilities:</b> {formatList(room.facilities)}</p>
          <p><b>Meal options:</b> {room.mealOptions || "Not specified"}</p>
          <p><b>Bed options:</b> {room.bedOptions || "Not specified"}</p>
          <p><b>Size:</b> {room.size} sqrt</p>
          <p><b>View</b> {room.view || "Not specified"}</p>
          <p><b>Bathrooms:</b> {room.bathrooms || "Not specified"}</p>
          <p><b>Policies:</b>  {formatList(room.facilities)}</p>
          <p><b>Price per night:</b> ${room.pricepernight}</p>
        </Modal.Body>
        <Modal.Footer>
        <Button className="light-red-btn" onClick={handleClose}>
  Close
</Button>
        </Modal.Footer>
      </Modal>
    </div>
  );
}

export default Room;