const express = require("express");
const app = express();
const path = require("path");
const mongoose = require("mongoose");

const cors = require("cors");

require("dotenv").config();

app.use(cors());
app.use(express.json());

// connect to mongodb
mongoose
  .connect(process.env.MONGO_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => console.log("Mongoose connected"))
  .catch((err) => console.log(err));

// define routes
const authRoutes = require("./routes/auth");
const managerRoutes = require("./routes/managerRoute");
const productRoutes = require("./routes/productRoute");

// use routes
app.use("/api/auth", authRoutes);
app.use("/api/manager", managerRoutes);
app.use("/api/products", productRoutes);

// Add this after your routes
app.use((err, req, res, next) => {
  console.error('Unhandled error:', err);
  res.status(500).json({ success: false, message: 'Internal server error' });
});

// serve static files from the "uploads" directory
app.use("/uploads", express.static(path.join(__dirname, "uploads")));

// app export
module.exports = app;
