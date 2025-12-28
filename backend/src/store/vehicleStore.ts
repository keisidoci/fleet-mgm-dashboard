import { Vehicle } from "../types";
import { mockFleetData } from "./mockFleetData";

export class VehicleStore {
  private vehicles: Vehicle[] = [...mockFleetData];

  getAll(): Vehicle[] {
    return [...this.vehicles];
  }

  create(
    input: Omit<Vehicle, "vehicleId"> & Partial<Pick<Vehicle, "vehicleId">>
  ): Vehicle {
    const vehicleId = input.vehicleId ?? `VEH-${Date.now()}`;

    if (this.vehicles.some((v) => v.vehicleId === vehicleId)) {
      throw new Error("Vehicle ID already exists");
    }

    if (this.vehicles.some((v) => v.vin === input.vin)) {
      throw new Error("VIN already exists");
    }

    if (!input.make || !input.model || !input.vin) {
      throw new Error("Missing required fields");
    }

    const newVehicle: Vehicle = {
      ...input,
      vehicleId,
      lastServiceDate:
        input.lastServiceDate ?? new Date().toISOString().split("T")[0],
      assignedDriver: input.assignedDriver ?? "Unassigned",
    };

    this.vehicles.push(newVehicle);
    return newVehicle;
  }
}

export const vehicleStore = new VehicleStore();
