import { mockFleetData } from "./mockFleetData";
import { mockMaintenanceRecords } from "./mockMaintenanceData";
import { getAssignmentHistoryByVehicleId } from "./mockAssignmentData";
import type { Vehicle, StoredUser } from "../types";

export interface DashboardStats {
  totalVehicles: number;
  activeVehicles: number;
  inMaintenance: number;
  retiredVehicles: number;
  vehiclesNeedingService: number;
  totalFleetMileage: number;
  averageVehicleAge: number;
  monthlyMaintenanceCost: number;
}

export interface RecentActivity {
  recentVehicles: Vehicle[];
  recentMaintenance: Array<{
    id: string;
    vehicleId: string;
    date: string;
    serviceType: string;
    vehicleName: string;
  }>;
  recentAssignments: Array<{
    id: string;
    vehicleId: string;
    driverName: string;
    assignedDate: string;
    unassignedDate: string | null;
    vehicleName: string;
  }>;
}

export interface MaintenanceAlert {
  vehicleId: string;
  vehicleName: string;
  lastServiceDate: string;
  daysSinceService: number;
  status: "overdue" | "due_soon";
}

// Helper function to filter vehicles based on user role
const getFilteredVehicles = (user: StoredUser | null): Vehicle[] => {
  if (user?.role === "driver") {
    return mockFleetData.filter(
      (vehicle) => vehicle.assignedDriver === user.name
    );
  }
  return mockFleetData;
};

export const getDashboardStats = (
  user: StoredUser | null = null
): DashboardStats => {
  const vehicles = getFilteredVehicles(user);
  const totalVehicles = vehicles.length;
  const activeVehicles = vehicles.filter((v) => v.status === "Active").length;
  const inMaintenance = vehicles.filter(
    (v) => v.status === "Maintenance"
  ).length;
  const retiredVehicles = vehicles.filter((v) => v.status === "Retired").length;

  const today = new Date();
  const thirtyDaysAgo = new Date(today);
  thirtyDaysAgo.setDate(today.getDate() - 30);

  const vehiclesNeedingService = vehicles.filter((vehicle) => {
    const lastService = new Date(vehicle.lastServiceDate);
    return lastService < thirtyDaysAgo && vehicle.status === "Active";
  }).length;

  const totalFleetMileage = vehicles.reduce(
    (sum, v) => sum + v.currentMileage,
    0
  );

  const currentYear = new Date().getFullYear();
  const totalAge = vehicles.reduce((sum, v) => sum + (currentYear - v.year), 0);
  const averageVehicleAge = totalVehicles > 0 ? totalAge / totalVehicles : 0;

  const vehicleIds = new Set(vehicles.map((v) => v.vehicleId));

  const monthlyMaintenanceCost = mockMaintenanceRecords
    .filter((record) => {
      const recordDate = new Date(record.date);
      return (
        recordDate >= thirtyDaysAgo &&
        recordDate <= today &&
        vehicleIds.has(record.vehicleId)
      );
    })
    .reduce((sum, record) => sum + record.cost, 0);

  return {
    totalVehicles,
    activeVehicles,
    inMaintenance,
    retiredVehicles,
    vehiclesNeedingService,
    totalFleetMileage,
    averageVehicleAge,
    monthlyMaintenanceCost,
  };
};

export const getRecentActivity = (
  user: StoredUser | null = null
): RecentActivity => {
  const vehicles = getFilteredVehicles(user);
  const vehicleIds = new Set(vehicles.map((v) => v.vehicleId));

  const recentVehicles = [...vehicles]
    .sort((a, b) => b.vehicleId.localeCompare(a.vehicleId))
    .slice(0, 5);

  const filteredMaintenance = mockMaintenanceRecords.filter((record) =>
    vehicleIds.has(record.vehicleId)
  );

  const recentMaintenance = filteredMaintenance
    .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
    .slice(0, 5)
    .map((record) => {
      const vehicle = vehicles.find((v) => v.vehicleId === record.vehicleId);
      return {
        id: record.id,
        vehicleId: record.vehicleId,
        date: record.date,
        serviceType: record.serviceType,
        vehicleName: vehicle
          ? `${vehicle.make} ${vehicle.model}`
          : record.vehicleId,
      };
    });

  let allAssignments = vehicles.flatMap((vehicle) => {
    const assignments = getAssignmentHistoryByVehicleId(vehicle.vehicleId);
    return assignments.map((assignment) => ({
      ...assignment,
      vehicleName: `${vehicle.make} ${vehicle.model}`,
    }));
  });

  if (user?.role === "driver") {
    allAssignments = allAssignments.filter(
      (assignment) => assignment.driverName === user.name
    );
  }

  const recentAssignments = allAssignments
    .sort(
      (a, b) =>
        new Date(b.assignedDate).getTime() - new Date(a.assignedDate).getTime()
    )
    .slice(0, 5);

  return {
    recentVehicles,
    recentMaintenance,
    recentAssignments,
  };
};
