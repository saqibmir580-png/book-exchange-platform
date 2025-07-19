const express = require("express");
const connectDB = require("./config/db");
const userRoutes=require("./routes/userRoutes")
const bookRoutes= require("./routes/bookRoutes")
const dashboardRoutes= require("./routes/dashboardRoute")
const orderRoutes= require("./routes/orderRoutes")
const testimonialRoutes=require("./routes/testimonialRoutes")
const adminRoutes=require("./routes/adminRoute")
const cors = require("cors");
const path=require("path")
const fs = require("fs");
require("dotenv").config("");


const app = express();
connectDB();
const coreOptions = {
  origin: "https://kutub-net.onrender.com/",
  credentials: true, 
  }
app.use(cors(coreOptions));
app.use(express.json());




// Routes
app.use("/api/users", userRoutes);
app.use("/api/books",bookRoutes);
app.use("/api/dashboard",dashboardRoutes);
app.use("/api/orders", orderRoutes);
app.use("/api/testimonials",testimonialRoutes);
app.use("/api/admin",adminRoutes);

// Go one level up from backend/
const distPath = path.join(__dirname, "../frontend/dist");

// Check if the dist folder exists
if (fs.existsSync(distPath)) {
  app.use(express.static(distPath));

  app.get("", (req, res) => {
    res.sendFile(path.join(distPath, "index.html"));
  });
} else {
  console.error("⚠️ Frontend build not found at:", distPath);
}






const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`))
