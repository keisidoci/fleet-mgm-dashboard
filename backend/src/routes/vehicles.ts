import { Router, Request, Response } from "express";
import { Vehicle } from "../types";
import { vehicleStore } from "../store/vehicleStore";

const router = Router();

// Get all vehicles
router.get("/", (req: Request, res: Response) => {
  try {
    const vehicles = vehicleStore.getAll();
    res.json(vehicles);
  } catch (error) {
    console.error("Error fetching vehicles:", error);
    res.status(500).json({ message: "Failed to fetch vehicles" });
  }
});

// Create new vehicle
router.post("/", (req: Request, res: Response) => {
  try {
    const vehicleData: Vehicle = req.body;

    if (!vehicleData.make || !vehicleData.model || !vehicleData.vin) {
      return res.status(400).json({
        message: "Missing required fields: make, model, and vin are required",
      });
    }

    if (
      vehicleData.vin.length !== 17 ||
      !/^[A-HJ-NPR-Z0-9]{17}$/i.test(vehicleData.vin)
    ) {
      return res.status(400).json({
        message: "VIN must be exactly 17 alphanumeric characters",
      });
    }

    const currentYear = new Date().getFullYear();
    if (vehicleData.year < 1990 || vehicleData.year > currentYear) {
      return res.status(400).json({
        message: `Year must be between 1990 and ${currentYear}`,
      });
    }

    if (vehicleData.currentMileage < 0) {
      return res.status(400).json({
        message: "Current mileage must be a positive number",
      });
    }

    const newVehicle = vehicleStore.create(vehicleData);
    res.status(201).json(newVehicle);
  } catch (error: any) {
    console.error("Error creating vehicle:", error);
    res.status(400).json({
      message: error.message || "Failed to create vehicle",
    });
  }
});

export { router as vehiclesRouter };
