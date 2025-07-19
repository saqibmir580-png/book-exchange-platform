const express = require("express");
const connectDB = require("./config/db");
const errorHandler = require('./middlewares/errorHandler');
const cors = require("cors");
require("dotenv").config();

const app = express();
connectDB();

app.use(cors());
app.use(express.json());

app.use(errorHandler);


// Routes
app.use("/api/users", require("./routes/userRoutes"));
app.use("/api/books", require("./routes/bookRoutes"));
app.use("/api/dashboard", require("./routes/dashboardRoute"));
app.use("/api/orders", require("./routes/orderRoutes"));
app.use("/api/testimonials", require("./routes/testimonialRoutes"));
app.use("/api/admin",require("./routes/adminRoute"));

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
