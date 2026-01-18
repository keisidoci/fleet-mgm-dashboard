
import { useEffect, useMemo, useState } from "react";
// import { useNavigate } from "react-router-dom";
import { useUser } from "../hooks/usePermissions";
import {
  getDashboardStats,
  getRecentActivity,
} from "../services/dashboardService";
// import { mockMaintenanceRecords } from "../../services/mockMaintenanceData";
// import { getAllVehicles } from "../../services/vehicleService";
import type { Vehicle } from "../types";
import { mockMaintenanceRecords } from "../services/mockMaintenanceData";
import { getAllVehicles } from "../services/vehicleService";
// import type { Vehicle } from "../../types";

export const useDashboardData = () => {
  const user = useUser();
//   const navigate = useNavigate();
  const [vehicles, setVehicles] = useState<Vehicle[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>()

    // Fetch vehicles from API
    useEffect(() => {
      const loadVehicles = async () => {
        setIsLoading(true);
        setError(null);
        try {
          const data = await getAllVehicles();
          setVehicles(data);
        } catch (err) {
          console.error("Failed to load vehicles:", err);
          setError("Failed to load vehicles. Please try again.");
        } finally {
          setIsLoading(false);
        }
      };
      loadVehicles();
    }, []);

      const stats = useMemo(
        () => getDashboardStats(vehicles, user),
        [vehicles, user]
      );
      const recentActivity = useMemo(
        () => getRecentActivity(vehicles, user),
        [vehicles, user]
      );
    
      const statusChartData = [
        { name: "Active", value: stats.activeVehicles },
        { name: "Maintenance", value: stats.inMaintenance },
        { name: "Retired", value: stats.retiredVehicles },
      ];
    
      // Get vehicle IDs for filtering maintenance records (for drivers)
      const userVehicleIds = useMemo(() => {
        if (user?.role === "driver") {
          return new Set(
            vehicles
              .filter((v) => v.assignedDriver === user.name)
              .map((v) => v.vehicleId)
          );
        }
        return null; // null means show all vehicles
      }, [vehicles, user]);
    
      // (last 6 months)
      const maintenanceCostData = useMemo(() => {
        const months = [];
        const today = new Date();
    
        for (let i = 5; i >= 0; i--) {
          const date = new Date(today);
          date.setMonth(today.getMonth() - i);
          const monthStart = new Date(date.getFullYear(), date.getMonth(), 1);
          const monthEnd = new Date(date.getFullYear(), date.getMonth() + 1, 0);
    
          const cost = mockMaintenanceRecords
            .filter((record) => {
              const recordDate = new Date(record.date);
              const inDateRange =
                recordDate >= monthStart && recordDate <= monthEnd;
              // For drivers, only include their vehicles
              const isUserVehicle =
                userVehicleIds === null || userVehicleIds.has(record.vehicleId);
              return inDateRange && isUserVehicle;
            })
            .reduce((sum, record) => sum + record.cost, 0);
    
          months.push({
            month: date.toLocaleDateString("en-US", { month: "short" }),
            cost: cost || 0,
          });
        }
        return months;
      }, [userVehicleIds]);

      return {
        recentActivity,
        statusChartData,
        maintenanceCostData,
        isLoading,
        error,
        user,
        stats,
      }
}