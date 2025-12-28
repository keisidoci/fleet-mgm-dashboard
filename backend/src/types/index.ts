export type VehicleStatus = "Active" | "Retired" | "Maintenance";
export type FuelType = "Gasoline" | "Diesel" | "Electric" | "Hybrid";
export type Transmission = "Automatic" | "Manual";

export interface Vehicle {
  vehicleId: string;
  make: string;
  model: string;
  year: number;
  vin: string;
  status: VehicleStatus;
  currentMileage: number;
  lastServiceDate: string;
  assignedDriver: string;
  // Optional fields
  licensePlate?: string;
  color?: string;
  purchaseDate?: string;
  fuelType?: FuelType;
  transmission?: Transmission;
  purchasePrice?: number;
  notes?: string;
}

export type ServiceType =
  | "Oil Change"
  | "Tire Replacement"
  | "Brake Service"
  | "Engine Repair"
  | "Battery Replacement"
  | "Inspection"
  | "General Maintenance";

export interface MaintenanceRecord {
  id: string;
  vehicleId: string;
  date: string;
  serviceType: ServiceType;
  cost: number;
  mileage: number;
  technicianNotes: string;
}
