import type { AssignmentHistory } from "../types";

export const mockAssignmentHistory: AssignmentHistory[] = [
  {
    id: "ASG-001",
    vehicleId: "VEH-001",
    driverName: "John Smith",
    assignedDate: "2023-01-15",
    unassignedDate: "2024-08-15",
  },
  {
    id: "ASG-002",
    vehicleId: "VEH-001",
    driverName: "Sarah Lee",
    assignedDate: "2022-06-01",
    unassignedDate: "2023-01-14",
  },
  {
    id: "ASG-003",
    vehicleId: "VEH-004",
    driverName: "Driver User",
    assignedDate: "2024-01-10",
    unassignedDate: null,
  },
  {
    id: "ASG-004",
    vehicleId: "VEH-005",
    driverName: "Driver User",
    assignedDate: "2024-02-01",
    unassignedDate: null,
  },
  {
    id: "ASG-005",
    vehicleId: "VEH-006",
    driverName: "Driver User",
    assignedDate: "2024-03-15",
    unassignedDate: null,
  },
  {
    id: "ASG-006",
    vehicleId: "VEH-007",
    driverName: "Driver User",
    assignedDate: "2024-04-01",
    unassignedDate: null,
  },
  {
    id: "ASG-007",
    vehicleId: "VEH-008",
    driverName: "Driver User",
    assignedDate: "2024-05-10",
    unassignedDate: null,
  },
  {
    id: "ASG-008",
    vehicleId: "VEH-008",
    driverName: "Robert Johnson",
    assignedDate: "2023-11-01",
    unassignedDate: "2024-05-09",
  },
];

export const getAssignmentHistoryByVehicleId = (
  vehicleId: string
): AssignmentHistory[] => {
  return mockAssignmentHistory
    .filter((assignment) => assignment.vehicleId === vehicleId)
    .sort((a, b) => new Date(b.assignedDate).getTime() - new Date(a.assignedDate).getTime());
};

