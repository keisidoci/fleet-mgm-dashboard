import { useParams, useNavigate, Navigate } from "react-router-dom";
import { useMemo, useState } from "react";
import { HiChevronLeft } from "react-icons/hi";
import { PermissionGuard } from "../../components/PermissionGuard";
import { StatusBadge } from "../../components/StatusBadge";
import { getVehicleById } from "../../services/vehicleService";
import { getMaintenanceByVehicleId } from "../../services/mockMaintenanceData";
import {
  getFuelByVehicleId,
  calculateFuelStats,
} from "../../services/mockFuelData";
import { getAssignmentHistoryByVehicleId } from "../../services/mockAssignmentData";
import type { ServiceType } from "../../types";

export const VehicleDetail = () => {
  const { vehicleId } = useParams<{ vehicleId: string }>();
  const navigate = useNavigate();
  const [maintenanceFilter, setMaintenanceFilter] = useState<{
    serviceType: ServiceType | "All";
    dateFrom: string;
    dateTo: string;
  }>({
    serviceType: "All",
    dateFrom: "",
    dateTo: "",
  });

  const vehicle = useMemo(() => {
    if (!vehicleId) return undefined;
    return getVehicleById(vehicleId);
  }, [vehicleId]);

  const maintenanceRecords = useMemo(() => {
    if (!vehicleId) return [];
    return getMaintenanceByVehicleId(vehicleId);
  }, [vehicleId]);

  const fuelRecords = useMemo(() => {
    if (!vehicleId) return [];
    return getFuelByVehicleId(vehicleId);
  }, [vehicleId]);

  const fuelStats = useMemo(() => {
    if (!vehicleId) return null;
    return calculateFuelStats(vehicleId);
  }, [vehicleId]);

  const assignmentHistory = useMemo(() => {
    if (!vehicleId) return [];
    return getAssignmentHistoryByVehicleId(vehicleId);
  }, [vehicleId]);

  const filteredMaintenance = useMemo(() => {
    let filtered = [...maintenanceRecords];

    if (maintenanceFilter.serviceType !== "All") {
      filtered = filtered.filter(
        (record) => record.serviceType === maintenanceFilter.serviceType
      );
    }

    if (maintenanceFilter.dateFrom) {
      filtered = filtered.filter(
        (record) => record.date >= maintenanceFilter.dateFrom
      );
    }

    if (maintenanceFilter.dateTo) {
      filtered = filtered.filter(
        (record) => record.date <= maintenanceFilter.dateTo
      );
    }

    return filtered;
  }, [maintenanceRecords, maintenanceFilter]);

  if (!vehicleId) {
    return <Navigate to="/vehicles" replace />;
  }

  if (!vehicle) {
    return (
      <div className="px-4 py-6 sm:px-0">
        <div className="bg-white shadow rounded-lg p-6">
          <div className="text-center py-12">
            <h2 className="text-2xl font-bold text-gray-900 mb-2">
              Vehicle Not Found
            </h2>
            <p className="text-gray-600 mb-4">
              The vehicle with ID "{vehicleId}" could not be found.
            </p>
            <button
              onClick={() => navigate("/vehicles")}
              className="bg-indigo-600 hover:bg-indigo-700 text-white px-4 py-2 rounded-md text-sm font-medium"
            >
              Back to Vehicles
            </button>
          </div>
        </div>
      </div>
    );
  }

  const serviceTypes: ServiceType[] = [
    "Oil Change",
    "Tire Replacement",
    "Brake Service",
    "Engine Repair",
    "Battery Replacement",
    "Inspection",
    "General Maintenance",
  ];

  return (
    <div className="px-4 py-6 sm:px-0">
      <div className="max-w-7xl mx-auto">
        <div className="mb-6">
          <button
            onClick={() => navigate("/vehicles")}
            className="text-white bg-indigo-600 hover:bg-indigo-700 mb-4 flex items-center text-sm font-medium"
          >
            <HiChevronLeft className="w-4 h-4 mr-2" />
            Back to Vehicles
          </button>
          <div className="flex justify-between items-start">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">
                {vehicle.make} {vehicle.model}
              </h1>
              <p className="text-lg text-gray-600 mt-1">
                {vehicle.vehicleId} • {vehicle.year}
              </p>
            </div>
            <PermissionGuard requireEdit>
              <button
                onClick={() => {
                  alert("Edit vehicle functionality will be implemented here.");
                }}
                className="bg-indigo-600 hover:bg-indigo-700 text-white px-4 py-2 rounded-md text-sm font-medium"
              >
                Edit Vehicle
              </button>
            </PermissionGuard>
          </div>
        </div>

        {/* Basic Information Card */}
        <div className="bg-white shadow rounded-lg p-6 mb-6">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-xl font-semibold text-gray-900">
              Basic Information
            </h2>
            <StatusBadge status={vehicle.status} />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            <div>
              <label className="text-sm font-medium text-gray-500">
                Vehicle ID
              </label>
              <p className="mt-1 text-sm text-gray-900 font-semibold">
                {vehicle.vehicleId}
              </p>
            </div>

            <div>
              <label className="text-sm font-medium text-gray-500">Make</label>
              <p className="mt-1 text-sm text-gray-900">{vehicle.make}</p>
            </div>

            <div>
              <label className="text-sm font-medium text-gray-500">Model</label>
              <p className="mt-1 text-sm text-gray-900">{vehicle.model}</p>
            </div>

            <div>
              <label className="text-sm font-medium text-gray-500">Year</label>
              <p className="mt-1 text-sm text-gray-900">{vehicle.year}</p>
            </div>

            <div>
              <label className="text-sm font-medium text-gray-500">VIN</label>
              <p className="mt-1 text-sm text-gray-900 font-mono">
                {vehicle.vin}
              </p>
            </div>

            <div>
              <label className="text-sm font-medium text-gray-500">
                Status
              </label>
              <div className="mt-1">
                <StatusBadge status={vehicle.status} />
              </div>
            </div>

            <div>
              <label className="text-sm font-medium text-gray-500">
                Current Mileage
              </label>
              <p className="mt-1 text-sm text-gray-900">
                {vehicle.currentMileage.toLocaleString()} miles
              </p>
            </div>

            <div>
              <label className="text-sm font-medium text-gray-500">
                Last Service Date
              </label>
              <p className="mt-1 text-sm text-gray-900">
                {new Date(vehicle.lastServiceDate).toLocaleDateString("en-US", {
                  year: "numeric",
                  month: "long",
                  day: "numeric",
                })}
              </p>
            </div>

            <div>
              <label className="text-sm font-medium text-gray-500">
                Assigned Driver
              </label>
              <p className="mt-1 text-sm text-gray-900">
                {vehicle.assignedDriver || "Unassigned"}
              </p>
            </div>
          </div>
        </div>

        {/* Fuel & Mileage Analytics */}
        <div className="bg-white shadow rounded-lg p-6 mb-6">
          <h2 className="text-xl font-semibold text-gray-900 mb-6">
            Fuel & Mileage Analytics
          </h2>
          {fuelStats && fuelRecords.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              <div>
                <label className="text-sm font-medium text-gray-500">
                  Current Mileage
                </label>
                <p className="mt-1 text-2xl font-bold text-gray-900">
                  {vehicle.currentMileage.toLocaleString()}
                </p>
                <p className="text-xs text-gray-500">miles</p>
              </div>

              <div>
                <label className="text-sm font-medium text-gray-500">
                  Average MPG
                </label>
                <p className="mt-1 text-2xl font-bold text-gray-900">
                  {fuelStats.averageMilesPerGallon > 0
                    ? fuelStats.averageMilesPerGallon.toFixed(1)
                    : "N/A"}
                </p>
                <p className="text-xs text-gray-500">miles per gallon</p>
              </div>

              <div>
                <label className="text-sm font-medium text-gray-500">
                  Total Fuel Cost
                </label>
                <p className="mt-1 text-2xl font-bold text-gray-900">
                  ${fuelStats.totalCost.toFixed(2)}
                </p>
                <p className="text-xs text-gray-500">
                  {fuelRecords.length} fill-ups
                </p>
              </div>

              <div>
                <label className="text-sm font-medium text-gray-500">
                  Avg Cost/Gallon
                </label>
                <p className="mt-1 text-2xl font-bold text-gray-900">
                  ${fuelStats.averageCostPerGallon.toFixed(2)}
                </p>
                <p className="text-xs text-gray-500">per gallon</p>
              </div>
            </div>
          ) : (
            <div className="text-center py-8">
              <p className="text-gray-500">No fuel records available</p>
            </div>
          )}
        </div>

        {/* Maintenance History */}
        <div className="bg-white shadow rounded-lg p-6 mb-6">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-xl font-semibold text-gray-900">
              Maintenance History
            </h2>
            <span className="text-sm text-gray-500">
              {filteredMaintenance.length} record
              {filteredMaintenance.length !== 1 ? "s" : ""}
            </span>
          </div>

          {/* Filters */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Service Type
              </label>
              <select
                value={maintenanceFilter.serviceType}
                onChange={(e) =>
                  setMaintenanceFilter({
                    ...maintenanceFilter,
                    serviceType: e.target.value as ServiceType | "All",
                  })
                }
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
              >
                <option value="All">All Types</option>
                {serviceTypes.map((type) => (
                  <option key={type} value={type}>
                    {type}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Date From
              </label>
              <input
                type="date"
                value={maintenanceFilter.dateFrom}
                onChange={(e) =>
                  setMaintenanceFilter({
                    ...maintenanceFilter,
                    dateFrom: e.target.value,
                  })
                }
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Date To
              </label>
              <input
                type="date"
                value={maintenanceFilter.dateTo}
                onChange={(e) =>
                  setMaintenanceFilter({
                    ...maintenanceFilter,
                    dateTo: e.target.value,
                  })
                }
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
              />
            </div>
          </div>

          {/* Maintenance Timeline */}
          {filteredMaintenance.length > 0 ? (
            <div className="space-y-4">
              {filteredMaintenance.map((record) => (
                <div
                  key={record.id}
                  className="relative pl-8 pb-8 border-l-2 border-gray-200 last:border-l-0 last:pb-0"
                >
                  <div className="absolute -left-2 top-0 w-4 h-4 bg-indigo-600 rounded-full border-2 border-white"></div>
                  <div className="bg-gray-50 rounded-lg p-4">
                    <div className="flex justify-between items-start mb-2">
                      <div>
                        <h3 className="font-semibold text-gray-900">
                          {record.serviceType}
                        </h3>
                        <p className="text-sm text-gray-500">
                          {new Date(record.date).toLocaleDateString("en-US", {
                            year: "numeric",
                            month: "long",
                            day: "numeric",
                          })}
                        </p>
                      </div>
                      <div className="text-right">
                        <p className="font-semibold text-gray-900">
                          ${record.cost.toFixed(2)}
                        </p>
                        <p className="text-sm text-gray-500">
                          {record.mileage.toLocaleString()} miles
                        </p>
                      </div>
                    </div>
                    <p className="text-sm text-gray-700 mt-2">
                      {record.technicianNotes}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-12">
              <p className="text-gray-500 text-lg mb-2">
                No maintenance records found
              </p>
              <p className="text-gray-400 text-sm">
                {maintenanceRecords.length === 0
                  ? "This vehicle has no maintenance history."
                  : "Try adjusting your filters."}
              </p>
            </div>
          )}
        </div>

        {/* Assignment History */}
        <div className="bg-white shadow rounded-lg p-6">
          <h2 className="text-xl font-semibold text-gray-900 mb-6">
            Assignment History
          </h2>
          {assignmentHistory.length > 0 ? (
            <div className="space-y-4">
              {assignmentHistory.map((assignment) => {
                const isCurrent = assignment.unassignedDate === null;
                return (
                  <div
                    key={assignment.id}
                    className={`border rounded-lg p-4 ${
                      isCurrent
                        ? "bg-indigo-50 border-indigo-200"
                        : "bg-gray-50 border-gray-200"
                    }`}
                  >
                    <div className="flex justify-between items-start">
                      <div>
                        <div className="flex items-center gap-2">
                          <h3 className="font-semibold text-gray-900">
                            {assignment.driverName}
                          </h3>
                          {isCurrent && (
                            <span className="px-2 py-1 bg-indigo-600 text-white text-xs font-semibold rounded">
                              Current
                            </span>
                          )}
                        </div>
                        <p className="text-sm text-gray-600 mt-1">
                          Assigned:{" "}
                          {new Date(assignment.assignedDate).toLocaleDateString(
                            "en-US",
                            {
                              year: "numeric",
                              month: "long",
                              day: "numeric",
                            }
                          )}
                        </p>
                        {assignment.unassignedDate && (
                          <p className="text-sm text-gray-600">
                            Unassigned:{" "}
                            {new Date(
                              assignment.unassignedDate
                            ).toLocaleDateString("en-US", {
                              year: "numeric",
                              month: "long",
                              day: "numeric",
                            })}
                          </p>
                        )}
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          ) : (
            <div className="text-center py-12">
              <p className="text-gray-500 text-lg mb-2">
                No assignment history available
              </p>
              <p className="text-gray-400 text-sm">
                This vehicle has not been assigned to any drivers yet.
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
