import { mockFleetData } from "./mockFleetData";
import { mockMaintenanceRecords } from "./mockMaintenanceData";
import { getAssignmentHistoryByVehicleId } from "./mockAssignmentData";
import type { Vehicle } from "../types";

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

export const getDashboardStats = (): DashboardStats => {
  const totalVehicles = mockFleetData.length;
  const activeVehicles = mockFleetData.filter(
    (v) => v.status === "Active"
  ).length;
  const inMaintenance = mockFleetData.filter(
    (v) => v.status === "Maintenance"
  ).length;
  const retiredVehicles = mockFleetData.filter(
    (v) => v.status === "Retired"
  ).length;

  const today = new Date();
  const thirtyDaysAgo = new Date(today);
  thirtyDaysAgo.setDate(today.getDate() - 30);

  const vehiclesNeedingService = mockFleetData.filter((vehicle) => {
    const lastService = new Date(vehicle.lastServiceDate);
    return lastService < thirtyDaysAgo && vehicle.status === "Active";
  }).length;

  // Total fleet mileage
  const totalFleetMileage = mockFleetData.reduce(
    (sum, v) => sum + v.currentMileage,
    0
  );

  // Average vehicle age
  const currentYear = new Date().getFullYear();
  const totalAge = mockFleetData.reduce(
    (sum, v) => sum + (currentYear - v.year),
    0
  );
  const averageVehicleAge = totalAge / totalVehicles;

  // Monthly maintenance cost (last 30 days)
  const monthlyMaintenanceCost = mockMaintenanceRecords
    .filter((record) => {
      const recordDate = new Date(record.date);
      return recordDate >= thirtyDaysAgo && recordDate <= today;
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

export const getRecentActivity = (): RecentActivity => {
  const recentVehicles = [...mockFleetData]
    .sort((a, b) => b.vehicleId.localeCompare(a.vehicleId))
    .slice(0, 5);

  const recentMaintenance = mockMaintenanceRecords
    .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
    .slice(0, 5)
    .map((record) => {
      const vehicle = mockFleetData.find(
        (v) => v.vehicleId === record.vehicleId
      );
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

  const allAssignments = mockFleetData.flatMap((vehicle) => {
    const assignments = getAssignmentHistoryByVehicleId(vehicle.vehicleId);
    return assignments.map((assignment) => ({
      ...assignment,
      vehicleName: `${vehicle.make} ${vehicle.model}`,
    }));
  });

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
