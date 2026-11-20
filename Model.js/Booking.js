const mongoose = require("mongoose");

const bookingSchema = new mongoose.Schema({
    userid: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "user",
        required: true
    },
    vehicleid: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "vehicle",
        required: true
    },
    pickupdate: {
        type: Date,
        required: true
    },
    returndate: {
        type: Date,
        required: true
    },
    numberofdays: {
        type: Number,
        required: true
    },
    totalAmount: {
        type: Number,
        required: true
    },
    bookingstatus: {
        type: String,
        enum: ["confirmed", "cancelled"],
        default: "confirmed"
    },
    bookingDate: {
        type: Date,
        default: Date.now
    },
    //
    userid:{
        type:unique,


    }
}, { timestamps: true });

module.exports = mongoose.model("booking", bookingSchema);

