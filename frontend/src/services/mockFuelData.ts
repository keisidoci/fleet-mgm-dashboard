import type { FuelRecord } from "../types";

export const mockFuelRecords: FuelRecord[] = [
  {
    id: "FUEL-001",
    vehicleId: "VEH-001",
    date: "2024-08-05",
    gallons: 15.2,
    cost: 58.24,
    mileage: 50750,
    location: "Shell Station - Main St",
  },
  {
    id: "FUEL-002",
    vehicleId: "VEH-001",
    date: "2024-07-28",
    gallons: 14.8,
    cost: 56.64,
    mileage: 50200,
    location: "BP Station - Highway 101",
  },
  {
    id: "FUEL-003",
    vehicleId: "VEH-001",
    date: "2024-07-20",
    gallons: 15.5,
    cost: 59.36,
    mileage: 49650,
    location: "Exxon Station - Downtown",
  },
  {
    id: "FUEL-004",
    vehicleId: "VEH-004",
    date: "2024-12-10",
    gallons: 12.3,
    cost: 47.11,
    mileage: 15700,
    location: "Shell Station - Main St",
  },
  {
    id: "FUEL-005",
    vehicleId: "VEH-004",
    date: "2024-11-25",
    gallons: 13.1,
    cost: 50.18,
    mileage: 15000,
    location: "BP Station - Highway 101",
  },
  {
    id: "FUEL-006",
    vehicleId: "VEH-005",
    date: "2024-10-05",
    gallons: 16.2,
    cost: 62.05,
    mileage: 44000,
    location: "Exxon Station - Downtown",
  },
  {
    id: "FUEL-007",
    vehicleId: "VEH-006",
    date: "2024-10-20",
    gallons: 13.8,
    cost: 52.88,
    mileage: 117000,
    location: "Shell Station - Main St",
  },
  {
    id: "FUEL-008",
    vehicleId: "VEH-007",
    date: "2024-10-10",
    gallons: 11.5,
    cost: 44.05,
    mileage: 36200,
    location: "BP Station - Highway 101",
  },
  {
    id: "FUEL-009",
    vehicleId: "VEH-008",
    date: "2024-12-28",
    gallons: 15.0,
    cost: 57.45,
    mileage: 85700,
    location: "Exxon Station - Downtown",
  },
];

export const getFuelByVehicleId = (vehicleId: string): FuelRecord[] => {
  return mockFuelRecords
    .filter((record) => record.vehicleId === vehicleId)
    .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
};

export const calculateFuelStats = (vehicleId: string) => {
  const records = getFuelByVehicleId(vehicleId);
  if (records.length === 0) {
    return {
      totalCost: 0,
      totalGallons: 0,
      averageCostPerGallon: 0,
      averageMilesPerGallon: 0,
    };
  }

  const totalCost = records.reduce((sum, r) => sum + r.cost, 0);
  const totalGallons = records.reduce((sum, r) => sum + r.gallons, 0);
  const averageCostPerGallon = totalCost / totalGallons;

  // Calculate average MPG from fuel records
  let totalMiles = 0;
  for (let i = 0; i < records.length - 1; i++) {
    totalMiles += records[i].mileage - records[i + 1].mileage;
  }
  const averageMilesPerGallon =
    records.length > 1 ? totalMiles / totalGallons : 0;

  return {
    totalCost,
    totalGallons,
    averageCostPerGallon,
    averageMilesPerGallon,
  };
};
