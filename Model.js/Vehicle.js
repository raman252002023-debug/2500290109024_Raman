const mongoose = require("mongoose");

const vehicleSchema = new mongoose.Schema({
    vehiclename: {
        type: String,
        required: true,
        trim: true
    },
    vehicletype: {
        type: String,
        required: true
    },
    registrationnumber: {
        type: String,
        required: true,
        unique: true
    },
    seatingcapacity: {
        type: Number,
        required: true,
        min: 1
    },
    priceperday: {
        type: Number,
        required: true,
        min: 1
    },
    location: {
        type: String,
        required: true
    },
    availabilitystatus: {
        type: String,
        enum: ["Available", "Unavailable"],
        default: "Available"
    },
    createdBy: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User"
    }
}, { timestamps: true });

module.exports = mongoose.model("Vehicle", vehicleSchema);

