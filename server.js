require("dotenv").config();

const express = require("express");
const helmet = require("helmet");
const cors = require("cors");
const rateLimit = require("express-rate-limit");

const connectDB = require("./config/db");

const authRoutes = require("./routes/authRoutes");
const vehicleRoutes = require("./routes/vehicleRoutes");
const bookingRoutes = require("./routes/bookingRoutes");

const errorMiddleware = require("./middleware/errorMiddleware");

const app = express();
connectDB();

//middleware
app.use(helmet());
app.use(cors());
app.use(express.json());

// Rate 
const limiter = rateLimit({
    windowMs: 15 * 60 * 1000,
    max: 100,
    message: "Try again"
});

app.use("/api/auth", limiter);
app.use("/api/auth", authRoutes);
app.use("/api/vehicles", vehicleRoutes);
app.use("/api/bookings", bookingRoutes);


app.get("/", (req, res) => {
    res.send("Welcome to rent");
});


app.use(errorMiddleware);

const PORT = process.env.PORT || 5000;

app.listen(3000, () => {
    console.log(`Server running on port`);
});

