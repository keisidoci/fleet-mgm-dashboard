import type { MaintenanceRecord } from "../types";

export const mockMaintenanceRecords: MaintenanceRecord[] = [
  {
    id: "MNT-001",
    vehicleId: "VEH-001",
    date: "2024-08-11",
    serviceType: "Oil Change",
    cost: 89.99,
    mileage: 50882,
    technicianNotes: "Standard oil change, filter replaced. All systems checked.",
  },
  {
    id: "MNT-002",
    vehicleId: "VEH-001",
    date: "2024-06-15",
    serviceType: "Tire Replacement",
    cost: 450.00,
    mileage: 48500,
    technicianNotes: "Replaced all 4 tires. Alignment checked and adjusted.",
  },
  {
    id: "MNT-003",
    vehicleId: "VEH-001",
    date: "2024-04-20",
    serviceType: "Brake Service",
    cost: 320.50,
    mileage: 46000,
    technicianNotes: "Front brake pads and rotors replaced. Rear brakes inspected - good condition.",
  },
  {
    id: "MNT-004",
    vehicleId: "VEH-001",
    date: "2024-02-10",
    serviceType: "Inspection",
    cost: 75.00,
    mileage: 43200,
    technicianNotes: "Annual inspection completed. All systems passed.",
  },
  {
    id: "MNT-005",
    vehicleId: "VEH-004",
    date: "2024-12-15",
    serviceType: "Oil Change",
    cost: 89.99,
    mileage: 15892,
    technicianNotes: "Oil change completed. Air filter replaced.",
  },
  {
    id: "MNT-006",
    vehicleId: "VEH-004",
    date: "2024-10-01",
    serviceType: "General Maintenance",
    cost: 150.00,
    mileage: 12000,
    technicianNotes: "Fluid levels checked, belts inspected. All good.",
  },
  {
    id: "MNT-007",
    vehicleId: "VEH-005",
    date: "2024-10-13",
    serviceType: "Oil Change",
    cost: 89.99,
    mileage: 44236,
    technicianNotes: "Standard service completed.",
  },
  {
    id: "MNT-008",
    vehicleId: "VEH-006",
    date: "2024-10-27",
    serviceType: "Battery Replacement",
    cost: 180.00,
    mileage: 117258,
    technicianNotes: "Battery replaced. Charging system tested - working properly.",
  },
  {
    id: "MNT-009",
    vehicleId: "VEH-007",
    date: "2024-10-18",
    serviceType: "Engine Repair",
    cost: 850.00,
    mileage: 36380,
    technicianNotes: "Engine diagnostic performed. Replaced spark plugs and ignition coils.",
  },
  {
    id: "MNT-010",
    vehicleId: "VEH-008",
    date: "2024-01-09",
    serviceType: "Oil Change",
    cost: 89.99,
    mileage: 85917,
    technicianNotes: "Oil change and inspection completed.",
  },
];

export const getMaintenanceByVehicleId = (
  vehicleId: string
): MaintenanceRecord[] => {
  return mockMaintenanceRecords
    .filter((record) => record.vehicleId === vehicleId)
    .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
};

