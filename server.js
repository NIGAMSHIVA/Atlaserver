


import express from "express";
import mongoose from "mongoose";
import dotenv from "dotenv";
import cors from "cors";

dotenv.config();

const app = express();
app.use(cors());
app.use(express.json());

// ✅ Connect to MongoDB Atlas
mongoose
  .connect(process.env.MONGODB_URI)
  .then(() => console.log("✅ MongoDB connected successfully"))
  .catch((err) => console.error("❌ MongoDB connection failed:", err));

// ------------------- SCHEMAS -------------------

// 🏪 Restaurant Schema
const restaurantSchema = new mongoose.Schema({
  id: String,
  name: String,
  cuisines: [String],
  costForTwo: String,
  avgRating: Number,
  deliveryTime: String,
  image: String,
  areaName: String,
});

const Restaurant = mongoose.model("Restaurant", restaurantSchema);

// 🍽️ Menu Schema
const menuSchema = new mongoose.Schema({
  restaurantId: String,
  restaurantName: String,
  items: [
    {
      id: Number,
      name: String,
      description: String,
      price: Number,
    },
  ],
});

const Menu = mongoose.model("Menu", menuSchema);

// ------------------- ROUTES -------------------

// Get all restaurants
app.get("/restaurants", async (req, res) => {
  try {
    const restaurants = await Restaurant.find();
    res.json(restaurants);
  } catch (error) {
    res.status(500).json({ message: "Error fetching restaurants", error });
  }
});

// Get menu by restaurantId
app.get("/menu/:restaurantId", async (req, res) => {
  try {
    const menu = await Menu.findOne({ restaurantId: req.params.restaurantId });
    if (!menu) {
      return res.status(404).json({ message: "Menu not found" });
    }
    res.json(menu);
  } catch (error) {
    res.status(500).json({ message: "Error fetching menu", error });
  }
});

// Root route (optional health check)
app.get("/", (req, res) => {
  res.send("🍔 ZwiggyGo Backend is running!");
});

// ------------------- SERVER -------------------
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`🚀 Server running on port ${PORT}`));
