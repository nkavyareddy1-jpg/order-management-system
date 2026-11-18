require("dotenv").config();

const express = require("express");
const mongoose = require("mongoose");
const path = require("path");
const orderRoutes = require("./routes/orders");

const app = express();
const PORT = process.env.PORT || 3000;
const MONGODB_URI = process.env.MONGODB_URI;

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Serve the frontend files from the public folder.
app.use(express.static(path.join(__dirname, "public")));

// API routes.
app.use("/api/orders", orderRoutes);

app.get("/api/health", (req, res) => {
  res.json({ success: true, message: "Order Management API is running" });
});

app.get("/", (req, res) => {
  res.sendFile(path.join(__dirname, "public", "index.html"));
});

async function startServer() {
  try {
    if (!MONGODB_URI) {
      throw new Error("MONGODB_URI is missing. Create a .env file using .env.example.");
    }

    await mongoose.connect(MONGODB_URI);
    console.log("MongoDB connected successfully");

    app.listen(PORT, () => {
      console.log(`Server is running at http://localhost:${PORT}`);
    });
  } catch (error) {
    console.error("Server startup failed:", error.message);
    process.exit(1);
  }
}

startServer();
