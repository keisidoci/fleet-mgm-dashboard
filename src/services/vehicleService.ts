import { mockVehicles } from "./mockVehicleData";
import type { Vehicle } from "../types";

export const getVehicleById = (vehicleId: string): Vehicle | undefined => {
  return mockVehicles.find((vehicle) => vehicle.vehicleId === vehicleId);
};

export const getAllVehicles = (): Vehicle[] => {
  return mockVehicles;
};

