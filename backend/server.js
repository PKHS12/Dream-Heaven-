const express = require("express");
const cors = require("cors");
const app = express();

// DB Config
require("./db"); // Just require it once; it connects automatically

// Routes
const roomsRoute = require("./Routes/roomsRoute"); // ✅ make sure folder name and case is 'routes'
const bookingsRoute = require("./Routes/bookingsRoute");
const cancellationRoutes = require("./Routes/cancellationRoute"); // ✅ match file name exactly
const refundRoutes = require("./Routes/refundRoute");
const userRoutes = require("./Routes/userRoute");
const feedbackRoutes = require("./Routes/feedbackRoute");
// Middleware
app.use(express.json());
app.use(cors());

// Use Routes
app.use("/api/rooms", roomsRoute);
app.use("/api/bookings", bookingsRoute);
app.use("/api/cancellations", cancellationRoutes); // ✅ make sure this is plural if file is named 'cancellationRoutes.js'
app.use("/api/refunds", refundRoutes);
app.use("/api/users", userRoutes);
app.use("/api/feedback", feedbackRoutes);

// Start Server
const port = process.env.PORT || 5000;
app.listen(port, () => console.log(`Server started on port ${port}`));
