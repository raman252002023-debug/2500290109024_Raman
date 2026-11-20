const Booking = require("../models/Booking");
const Vehicle = require("../models/Vehicle");

// CREATE BOOKING
exports.createBooking = async (req, res, next) => {
    try {
        const { vehicleId, pickupDate, returnDate } = req.body;

        if (!vehicleId || !pickupDate || !returnDate) {
            return res.status(400).json({
                message: "All fields are required"
            });
        }

        const pickup = new Date(pickupDate);
        const returning = new Date(returnDate);

        if (isNaN(pickup.getTime()) || isNaN(returning.getTime())) {
            return res.status(400).json({
                message: "Invalid dates"
            });
        }

        const today = new Date();
        today.setHours(0, 0, 0, 0);

        if (pickup < today || returning <= pickup) {
            return res.status(400).json({
                message: "Invalid pickup or return date"
            });
        }

        const vehicle = await Vehicle.findById(vehicleId);

        if (!vehicle) {
            return res.status(404).json({
                message: "Vehicle not found"
            });
        }

        if (vehicle.availabilityStatus !== "Available") {
            return res.status(409).json({
                message: "Vehicle is unavailable"
            });
        }

        // Check overlapping booking dates
        const overlappingBooking = await Booking.findOne({
            vehicleId,
            bookingStatus: "Confirmed",
            pickupDate: { $lt: returning },
            returnDate: { $gt: pickup }
        });

        if (overlappingBooking) {
            return res.status(409).json({
                message: "Vehicle already booked for these dates"
            });
        }

        // Calculate rental days
        const numberOfDays = Math.ceil(
            (returning - pickup) / (1000 * 60 * 60 * 24)
        );

        const totalAmount = numberOfDays * vehicle.pricePerDay;

        const booking = await Booking.create({
            userId: req.user.id,
            vehicleId,
            pickupDate: pickup,
            returnDate: returning,
            numberOfDays,
            totalAmount
        });

        res.status(201).json({
            message: "Booking successful",
            booking
        });

    } catch (error) {
        next(error);
    }
};


// MY BOOKINGS
exports.myBookings = async (req, res, next) => {
    try {
        const bookings = await Booking.find({
            userId: req.user.id
        }).populate("vehicleId");

        res.status(200).json(bookings);

    } catch (error) {
        next(error);
    }
};


// GET BOOKING BY ID
exports.getBookingById = async (req, res, next) => {
    try {
        const booking = await Booking.findOne({
            _id: req.params.id,
            userId: req.user.id
        }).populate("vehicleId");

        if (!booking) {
            return res.status(404).json({
                message: "Booking not found"
            });
        }

        res.status(200).json(booking);

    } catch (error) {
        next(error);
    }
};


// CANCEL BOOKING
exports.cancelBooking = async (req, res, next) => {
    try {
        const booking = await Booking.findOne({
            _id: req.params.id,
            userId: req.user.id
        });

        if (!booking) {
            return res.status(404).json({
                message: "Booking not found"
            });
        }

        if (booking.bookingStatus === "Cancelled") {
            return res.status(400).json({
                message: "Booking already cancelled"
            });
        }

        booking.bookingStatus = "Cancelled";

        await booking.save();

        res.status(200).json({
            message: "Booking cancelled successfully",
            booking
        });

    } catch (error) {
        next(error);
    }
};

