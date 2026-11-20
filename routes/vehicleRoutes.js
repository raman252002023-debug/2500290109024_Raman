const express = require("express");
const router = express.Router();

const auth = require("../middleware/authMiddleware");
const admin = require("../middleware/adminMiddleware");

const {
    addVehicle,
    getVehicles,
    getVehicleById,
    updateVehicle,
    deleteVehicle
} = require("../controllers/vehicleController");

router.get("/", getVehicles);
router.get("/:id", getVehicleById);

router.post("/", auth, admin, addVehicle);
router.put("/:id", auth, admin, updateVehicle);
router.delete("/:id", auth, admin, deleteVehicle);


module.exports = router;
