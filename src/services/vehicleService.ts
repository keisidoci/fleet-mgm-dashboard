import { mockFleetData } from "./mockFleetData";
import type { Vehicle } from "../types";

export const getVehicleById = (vehicleId: string): Vehicle | undefined => {
  return mockFleetData.find((vehicle) => vehicle.vehicleId === vehicleId);
};

export const getAllVehicles = (): Vehicle[] => {
  return mockFleetData;
};
