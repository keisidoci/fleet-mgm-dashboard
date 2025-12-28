import { useMemo, useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import {
  BarChart,
  Bar,
  PieChart,
  Pie,
  Cell,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";
import {
  HiCheckCircle,
  HiClock,
  HiX,
  HiExclamationCircle,
} from "react-icons/hi";
import { useUser } from "../../hooks/usePermissions";
import {
  getDashboardStats,
  getRecentActivity,
} from "../../services/dashboardService";
import { mockMaintenanceRecords } from "../../services/mockMaintenanceData";
import { getAllVehicles } from "../../services/vehicleService";
import type { Vehicle } from "../../types";

const COLORS = ["#4F46E5", "#10B981", "#F59E0B", "#EF4444"];

export const Dashboard = () => {
  const user = useUser();
  const navigate = useNavigate();
  const [vehicles, setVehicles] = useState<Vehicle[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

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

  // Loading state
  if (isLoading) {
    return (
      <div className="px-4 py-6 sm:px-0">
        <div className="bg-white shadow rounded-lg p-6">
          <div className="text-center py-12">
            <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-indigo-600 mb-4"></div>
            <p className="text-gray-600">Loading dashboard data...</p>
          </div>
        </div>
      </div>
    );
  }

  // Error state
  if (error) {
    return (
      <div className="px-4 py-6 sm:px-0">
        <div className="bg-white shadow rounded-lg p-6">
          <div className="text-center py-12">
            <h2 className="text-2xl font-bold text-red-600 mb-2">Error</h2>
            <p className="text-gray-600 mb-4">{error}</p>
            <button
              onClick={() => window.location.reload()}
              className="bg-indigo-600 hover:bg-indigo-700 text-white px-4 py-2 rounded-md text-sm font-medium"
            >
              Retry
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="px-4 py-6 sm:px-0">
      <div className="mb-6">
        <h1 className="text-3xl font-bold text-gray-900">
          Welcome, {user?.name}!
        </h1>
        <p className="text-lg text-gray-600 mt-1">
          Role: <span className="font-semibold">{user?.role}</span>
        </p>
      </div>

      {/* Summary Cards */}
      <div
        className={`grid grid-cols-1 md:grid-cols-2 ${
          user?.role === "driver" ? "lg:grid-cols-3" : "lg:grid-cols-5"
        } gap-4 mb-6`}
      >
        {user?.role !== "driver" && (
          <div className="bg-white rounded-lg shadow p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-500">
                  Total Vehicles
                </p>
                <p className="text-3xl font-bold text-gray-900 mt-2">
                  {stats.totalVehicles}
                </p>
              </div>
              <div className="bg-indigo-100 rounded-full p-3">
                <HiCheckCircle className="w-6 h-6 text-indigo-600" />
              </div>
            </div>
          </div>
        )}

        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-500">
                {user?.role === "driver" ? "My Vehicles" : "Active Vehicles"}
              </p>
              <p className="text-3xl font-bold text-green-600 mt-2">
                {user?.role === "driver"
                  ? stats.totalVehicles
                  : stats.activeVehicles}
              </p>
            </div>
            <div className="bg-green-100 rounded-full p-3">
              <HiCheckCircle className="w-6 h-6 text-green-600" />
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-500">
                In Maintenance
              </p>
              <p className="text-3xl font-bold text-yellow-600 mt-2">
                {stats.inMaintenance}
              </p>
            </div>
            <div className="bg-yellow-100 rounded-full p-3">
              <HiClock className="w-6 h-6 text-yellow-600" />
            </div>
          </div>
        </div>

        {user?.role !== "driver" && (
          <>
            <div className="bg-white rounded-lg shadow p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-500">
                    Retired Vehicles
                  </p>
                  <p className="text-3xl font-bold text-gray-600 mt-2">
                    {stats.retiredVehicles}
                  </p>
                </div>
                <div className="bg-gray-100 rounded-full p-3">
                  <HiX className="w-6 h-6 text-gray-600" />
                </div>
              </div>
            </div>

            <div className="bg-white rounded-lg shadow p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-500">
                    Service Due Soon
                  </p>
                  <p className="text-3xl font-bold text-orange-600 mt-2">
                    {stats.vehiclesNeedingService}
                  </p>
                </div>
                <div className="bg-orange-100 rounded-full p-3">
                  <HiExclamationCircle className="w-6 h-6 text-orange-600" />
                </div>
              </div>
            </div>
          </>
        )}

        {user?.role === "driver" && (
          <div className="bg-white rounded-lg shadow p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-500">
                  Service Due Soon
                </p>
                <p className="text-3xl font-bold text-orange-600 mt-2">
                  {stats.vehiclesNeedingService}
                </p>
              </div>
              <div className="bg-orange-100 rounded-full p-3">
                <HiExclamationCircle className="w-6 h-6 text-orange-600" />
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Quick Stats and Charts Row */}
      {user?.role !== "driver" && (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
          {/* Quick Stats */}
          <div className="bg-white rounded-lg shadow p-6">
            <h2 className="text-xl font-semibold text-gray-900 mb-4">
              Quick Stats
            </h2>
            <div className="space-y-4">
              <div className="flex justify-between items-center pb-3 border-b">
                <span className="text-sm font-medium text-gray-500">
                  Total Fleet Mileage
                </span>
                <span className="text-lg font-bold text-gray-900">
                  {stats.totalFleetMileage.toLocaleString()} miles
                </span>
              </div>
              <div className="flex justify-between items-center pb-3 border-b">
                <span className="text-sm font-medium text-gray-500">
                  Average Vehicle Age
                </span>
                <span className="text-lg font-bold text-gray-900">
                  {stats.averageVehicleAge.toFixed(1)} years
                </span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm font-medium text-gray-500">
                  Monthly Maintenance Cost
                </span>
                <span className="text-lg font-bold text-gray-900">
                  ${stats.monthlyMaintenanceCost.toFixed(2)}
                </span>
              </div>
            </div>
          </div>

          {/* Vehicle Status Chart */}
          <div className="bg-white rounded-lg shadow p-6">
            <h2 className="text-xl font-semibold text-gray-900 mb-4">
              Vehicle Status Distribution
            </h2>
            <ResponsiveContainer width="100%" height={300}>
              <PieChart>
                <Pie
                  data={statusChartData}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  label={({ name, percent }) =>
                    `${name}: ${percent ? (percent * 100).toFixed(0) : 0}%`
                  }
                  outerRadius={80}
                  fill="#8884d8"
                  dataKey="value"
                >
                  {statusChartData.map((_, index) => (
                    <Cell
                      key={`cell-${index}`}
                      fill={COLORS[index % COLORS.length]}
                    />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </div>
      )}

      {/* Driver-specific Quick Stats */}
      {user?.role === "driver" && (
        <div className="bg-white rounded-lg shadow p-6 mb-6">
          <h2 className="text-xl font-semibold text-gray-900 mb-4">
            My Vehicle Stats
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="flex justify-between items-center pb-3 border-b md:border-b-0 md:border-r pr-4">
              <span className="text-sm font-medium text-gray-500">
                Total Mileage
              </span>
              <span className="text-lg font-bold text-gray-900">
                {stats.totalFleetMileage.toLocaleString()} miles
              </span>
            </div>
            <div className="flex justify-between items-center pb-3 border-b md:border-b-0 md:border-r pr-4">
              <span className="text-sm font-medium text-gray-500">
                Average Vehicle Age
              </span>
              <span className="text-lg font-bold text-gray-900">
                {stats.averageVehicleAge.toFixed(1)} years
              </span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-sm font-medium text-gray-500">
                Monthly Maintenance Cost
              </span>
              <span className="text-lg font-bold text-gray-900">
                ${stats.monthlyMaintenanceCost.toFixed(2)}
              </span>
            </div>
          </div>
        </div>
      )}

      {/* Maintenance Cost Chart */}
      <div className="bg-white rounded-lg shadow p-6 mb-6">
        <h2 className="text-xl font-semibold text-gray-900 mb-4">
          Monthly Maintenance Costs
        </h2>
        <ResponsiveContainer width="100%" height={300}>
          <BarChart data={maintenanceCostData}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="month" />
            <YAxis />
            <Tooltip formatter={(value) => `$${Number(value).toFixed(2)}`} />
            <Legend />
            <Bar dataKey="cost" fill="#4F46E5" name="Maintenance Cost" />
          </BarChart>
        </ResponsiveContainer>
      </div>

      {/* Recent Activity */}
      <div
        className={`grid grid-cols-1 ${
          user?.role === "driver" ? "lg:grid-cols-2" : "lg:grid-cols-3"
        } gap-6`}
      >
        <div className="bg-white rounded-lg shadow p-6">
          <h2 className="text-xl font-semibold text-gray-900 mb-4">
            {user?.role === "driver"
              ? "My Recent Maintenance"
              : "Recent Maintenance"}
          </h2>
          <div className="space-y-3">
            {recentActivity.recentMaintenance.length > 0 ? (
              recentActivity.recentMaintenance.map((maintenance) => (
                <div
                  key={maintenance.id}
                  className="p-3 bg-gray-50 rounded-lg cursor-pointer hover:bg-gray-100"
                  onClick={() => navigate(`/vehicles/${maintenance.vehicleId}`)}
                >
                  <p className="font-medium text-gray-900">
                    {maintenance.serviceType}
                  </p>
                  <p className="text-sm text-gray-600">
                    {maintenance.vehicleName}
                  </p>
                  <p className="text-xs text-gray-500 mt-1">
                    {new Date(maintenance.date).toLocaleDateString()}
                  </p>
                </div>
              ))
            ) : (
              <p className="text-gray-500 text-sm">No recent maintenance</p>
            )}
          </div>
        </div>

        {user?.role !== "driver" && (
          <div className="bg-white rounded-lg shadow p-6">
            <h2 className="text-xl font-semibold text-gray-900 mb-4">
              Recent Assignments
            </h2>
            <div className="space-y-3">
              {recentActivity.recentAssignments.length > 0 ? (
                recentActivity.recentAssignments.map((assignment) => (
                  <div
                    key={assignment.id}
                    className="p-3 bg-gray-50 rounded-lg cursor-pointer hover:bg-gray-100"
                    onClick={() =>
                      navigate(`/vehicles/${assignment.vehicleId}`)
                    }
                  >
                    <p className="font-medium text-gray-900">
                      {assignment.driverName}
                    </p>
                    <p className="text-sm text-gray-600">
                      {assignment.vehicleName}
                    </p>
                    <p className="text-xs text-gray-500 mt-1">
                      {new Date(assignment.assignedDate).toLocaleDateString()}
                    </p>
                  </div>
                ))
              ) : (
                <p className="text-gray-500 text-sm">No recent assignments</p>
              )}
            </div>
          </div>
        )}

        {user?.role === "driver" && (
          <div className="bg-white rounded-lg shadow p-6">
            <h2 className="text-xl font-semibold text-gray-900 mb-4">
              My Assignments
            </h2>
            <div className="space-y-3">
              {recentActivity.recentAssignments.length > 0 ? (
                recentActivity.recentAssignments.map((assignment) => (
                  <div
                    key={assignment.id}
                    className="p-3 bg-gray-50 rounded-lg cursor-pointer hover:bg-gray-100"
                    onClick={() =>
                      navigate(`/vehicles/${assignment.vehicleId}`)
                    }
                  >
                    <p className="font-medium text-gray-900">
                      {assignment.vehicleName}
                    </p>
                    <p className="text-sm text-gray-600">
                      Assigned:{" "}
                      {new Date(assignment.assignedDate).toLocaleDateString()}
                    </p>
                    {assignment.unassignedDate && (
                      <p className="text-xs text-gray-500 mt-1">
                        Released:{" "}
                        {new Date(
                          assignment.unassignedDate
                        ).toLocaleDateString()}
                      </p>
                    )}
                  </div>
                ))
              ) : (
                <p className="text-gray-500 text-sm">No assignments</p>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
