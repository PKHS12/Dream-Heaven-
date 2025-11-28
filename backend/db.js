const mongoose = require("mongoose");
require("dotenv").config(); // Load .env variables

const mongoURL = process.env.MONGO_URI;

if (!mongoURL) {
  console.error("❌ MONGO_URI is missing in .env file");
  process.exit(1);
}

mongoose
  .connect(mongoURL, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => console.log("✅ MongoDB connection successful"))
  .catch((err) => console.log("❌ MongoDB connection failed:", err));

module.exports = mongoose;
