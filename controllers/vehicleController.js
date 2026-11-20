const Vehicle = require("../models/Vehicle");
const Booking = require("../models/Booking");


exports.addVehicle = async (req, res, next) => {
    try {
        const vehicle = await Vehicle.create({
            ...req.body,
            createdBy: req.user.id
        });

        res.status(201).json({
            message: "Vehicle added",
            vehicle
        });

    } catch (error) {
        next(error);
    }
};


exports.getVehicles = async (req, res, next) => {
    try {
        const page = Math.max(1, parseInt(req.query.page) || 1);
        const limit = Math.min(100, Math.max(1, parseInt(req.query.limit) || 5));
        const skip = (page - 1) * limit;

        const filter = {};

        if (req.query.search) {
            filter.vehicleName = {
                $regex: req.query.search,
                $options: "i"
            };
        }

        if (req.query.vehicleType) {
            filter.vehicleType = req.query.vehicleType;
        }

        if (req.query.location) {
            filter.location = {
                $regex: req.query.location,
                $options: "i"
            };
        }

        const total = await Vehicle.countDocuments(filter);

        const vehicles = await Vehicle.find(filter)
            .skip(skip)
            .limit(limit);

        res.status(200).json({
            page,
            limit,
            total,
            totalPages: Math.ceil(total / limit),
            vehicles
        });

    } catch (error) {
        next(error);
    }
};



exports.getVehicleById = async (req, res, next) => {
    try {
        const vehicle = await Vehicle.findById(req.params.id);

        if (!vehicle) {
            return res.status(404).json({
                message: "Vehicle not found"
            });
        }

        res.status(200).json(vehicle);

    } catch (error) {
        next(error);
    }
};

exports.updateVehicle = async (req, res, next) => {
    try {
        const vehicle = await Vehicle.findByIdAndUpdate(
            req.params.id,
            req.body,
            { new: true, runValidators: true }
        );

        if (!vehicle) {
            return res.status(404).json({
                message: "Vehicle not found"
            });
        }

        res.status(200).json({
            message: "Vehicle updated successfully",
            vehicle
        });

    } catch (error) {
        next(error);
    }
};
exports.deleteVehicle = async (req, res, next) => {
    try {
        const vehicle = await Vehicle.findById(req.params.id);

        if (!vehicle) {
            return res.status(404).json({
                message: "Vehicle not found"
            });
        }

        const activeBooking = await Booking.findOne({
            vehicleId: vehicle._id,
            bookingStatus: "Confirmed"
        });

        if (activeBooking) {
            return res.status(409).json({
                message: "Vehicle has active bookings"
            });
        }

        await Vehicle.findByIdAndDelete(req.params.id);

        res.status(200).json({
            message: "Vehicle deleted successfully"
        });

    } catch (error) {
        next(error);
    }
};

