import { useParams, useNavigate, Navigate } from "react-router-dom";
import { useMemo } from "react";
import { PermissionGuard } from "../../components/PermissionGuard";
import { StatusBadge } from "../../components/StatusBadge";
import { getVehicleById } from "../../services/vehicleService";

export const VehicleDetail = () => {
  const { vehicleId } = useParams<{ vehicleId: string }>();
  const navigate = useNavigate();

  const vehicle = useMemo(() => {
    if (!vehicleId) return undefined;
    return getVehicleById(vehicleId);
  }, [vehicleId]);

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

  return (
    <div className="px-4 py-6 sm:px-0">
      <div className="max-w-7xl mx-auto">
        <div className="mb-6">
          <button
            onClick={() => navigate("/vehicles")}
            className="text-indigo-600 hover:text-indigo-700 mb-4 flex items-center text-sm font-medium"
          >
            <svg
              className="w-4 h-4 mr-2"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M15 19l-7-7 7-7"
              />
            </svg>
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
              >
                Edit Vehicle
              </button>
            </PermissionGuard>
          </div>
        </div>

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

            {/* Current Mileage */}
            <div>
              <label className="text-sm font-medium text-gray-500">
                Current Mileage
              </label>
              <p className="mt-1 text-sm text-gray-900">
                {vehicle.currentMileage.toLocaleString()} miles
              </p>
            </div>

            {/* Last Service Date */}
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
      </div>
    </div>
  );
};
