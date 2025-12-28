import { useState, useEffect, useCallback, useMemo } from "react";
import { useNavigate, useParams, useLocation } from "react-router-dom";
import { HiChevronLeft } from "react-icons/hi";
import {
  getVehicleById,
  createVehicle,
  updateVehicle,
} from "../../services/vehicleService";
import type { Vehicle } from "../../types";

interface FormErrors {
  make?: string;
  model?: string;
  year?: string;
  vin?: string;
  licensePlate?: string;
  color?: string;
  status?: string;
  purchaseDate?: string;
  currentMileage?: string;
  fuelType?: string;
  transmission?: string;
  purchasePrice?: string;
  notes?: string;
}

const COLORS = [
  "Black",
  "White",
  "Silver",
  "Gray",
  "Red",
  "Blue",
  "Green",
  "Yellow",
  "Orange",
  "Brown",
  "Beige",
  "Gold",
  "Other",
];

export const VehicleForm = () => {
  const { vehicleId } = useParams<{ vehicleId: string }>();
  const navigate = useNavigate();
  const location = useLocation();
  const isEditMode =
    location.pathname.includes("/edit") && vehicleId && vehicleId !== "new";
  const [isDirty, setIsDirty] = useState(false);
  const [submitError, setSubmitError] = useState<string | null>(null);
  const [submitSuccess, setSubmitSuccess] = useState(false);

  const [formData, setFormData] = useState<Vehicle>({
    vehicleId: "",
    make: "",
    model: "",
    year: new Date().getFullYear(),
    vin: "",
    status: "Active",
    currentMileage: 0,
    lastServiceDate: new Date().toISOString().split("T")[0],
    assignedDriver: "Unassigned",
    licensePlate: "",
    color: "",
    purchaseDate: "",
    fuelType: "Gasoline",
    transmission: "Automatic",
    purchasePrice: undefined,
    notes: "",
  });
  const [isLoadingVehicle, setIsLoadingVehicle] = useState(false);

  // Load vehicle data for edit mode
  useEffect(() => {
    const loadVehicle = async () => {
      if (isEditMode && vehicleId) {
        setIsLoadingVehicle(true);
        try {
          const vehicle = await getVehicleById(vehicleId);
          if (vehicle) {
            setFormData({
              vehicleId: vehicle.vehicleId,
              make: vehicle.make,
              model: vehicle.model,
              year: vehicle.year,
              vin: vehicle.vin,
              status: vehicle.status,
              currentMileage: vehicle.currentMileage,
              lastServiceDate: vehicle.lastServiceDate,
              assignedDriver: vehicle.assignedDriver,
              licensePlate: vehicle.licensePlate || "",
              color: vehicle.color || "",
              purchaseDate: vehicle.purchaseDate || "",
              fuelType: vehicle.fuelType || "Gasoline",
              transmission: vehicle.transmission || "Automatic",
              purchasePrice: vehicle.purchasePrice,
              notes: vehicle.notes || "",
            });
          }
        } catch (error) {
          console.error("Failed to load vehicle:", error);
          setSubmitError("Failed to load vehicle data");
        } finally {
          setIsLoadingVehicle(false);
        }
      }
    };
    loadVehicle();
  }, [isEditMode, vehicleId]);

  const [errors, setErrors] = useState<FormErrors>({});

  useEffect(() => {
    const handleBeforeUnload = (e: BeforeUnloadEvent) => {
      if (isDirty) {
        e.preventDefault();
        e.returnValue = "";
      }
    };

    window.addEventListener("beforeunload", handleBeforeUnload);
    return () => window.removeEventListener("beforeunload", handleBeforeUnload);
  }, [isDirty]);

  const validateField = useCallback(
    (name: string, value: string | number | undefined): string | undefined => {
      switch (name) {
        case "make": {
          const strValue = String(value || "");
          if (!strValue || strValue.trim() === "") {
            return "Make is required";
          }
          return undefined;
        }

        case "model": {
          const strValue = String(value || "");
          if (!strValue || strValue.trim() === "") {
            return "Model is required";
          }
          return undefined;
        }

        case "year": {
          const strValue = String(value || "");
          const yearNum = parseInt(strValue);
          const currentYear = new Date().getFullYear();
          if (isNaN(yearNum) || yearNum < 1990 || yearNum > currentYear) {
            return `Year must be between 1990 and ${currentYear}`;
          }
          return undefined;
        }

        case "vin": {
          const strValue = String(value || "");
          if (!strValue || strValue.trim() === "") {
            return "VIN is required";
          }
          const vinRegex = /^[A-HJ-NPR-Z0-9]{17}$/i;
          if (!vinRegex.test(strValue)) {
            return "VIN must be exactly 17 alphanumeric characters";
          }
          return undefined;
        }

        case "currentMileage": {
          const strValue = String(value || "");
          const mileage = parseFloat(strValue);
          if (isNaN(mileage) || mileage < 0) {
            return "Mileage must be a positive number";
          }
          return undefined;
        }

        case "purchasePrice": {
          if (value !== undefined && value !== "") {
            const strValue = String(value);
            const price = parseFloat(strValue);
            if (isNaN(price) || price < 0) {
              return "Purchase price must be a positive number";
            }
          }
          return undefined;
        }

        default:
          return undefined;
      }
    },
    []
  );

  const handleChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement
    >
  ) => {
    const { name, value } = e.target;
    setIsDirty(true);
    setSubmitError(null);
    setSubmitSuccess(false);

    setFormData(
      (prev) =>
        ({
          ...prev,
          [name]:
            name === "year" ||
            name === "currentMileage" ||
            name === "purchasePrice"
              ? value === ""
                ? ""
                : Number(value)
              : value,
        } as Vehicle)
    );

    const error = validateField(name, value);
    setErrors((prev) => ({
      ...prev,
      [name]: error,
    }));
  };

  const validateForm = (): boolean => {
    const newErrors: FormErrors = {};
    let isValid = true;

    const requiredFields: Array<keyof FormErrors> = [
      "make",
      "model",
      "year",
      "vin",
      "status",
      "currentMileage",
    ];
    requiredFields.forEach((field) => {
      const error = validateField(
        field,
        formData[field as keyof Vehicle] as string | number | undefined
      );
      if (error) {
        newErrors[field] = error;
        isValid = false;
      }
    });

    // VIN duplicate check (async validation would be better, but keeping sync for now)
    // The backend will also validate this

    setErrors(newErrors);
    return isValid;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitError(null);
    setSubmitSuccess(false);

    const isValid = validateForm();

    if (!isValid) {
      setSubmitError("Please fix the validation errors before submitting.");
      return;
    }

    try {
      setIsLoadingVehicle(true);
      let savedVehicle: Vehicle;

      if (isEditMode && vehicleId) {
        // Update existing vehicle
        savedVehicle = await updateVehicle(vehicleId, formData);
      } else {
        // Create new vehicle
        savedVehicle = await createVehicle(formData);
      }

      setSubmitSuccess(true);
      setIsDirty(false);

      // Navigate after successful save
      setTimeout(() => {
        if (isEditMode && vehicleId) {
          navigate(`/vehicles/${vehicleId}`);
        } else {
          navigate(`/vehicles/${savedVehicle.vehicleId}`);
        }
      }, 1500);
    } catch (error) {
      console.error("Failed to save vehicle:", error);
      const errorMessage =
        error instanceof Error
          ? error.message
          : "Failed to save vehicle. Please try again.";
      setSubmitError(errorMessage);
    } finally {
      setIsLoadingVehicle(false);
    }
  };

  const handleCancel = () => {
    if (isDirty) {
      const confirmed = window.confirm(
        "You have unsaved changes. Are you sure you want to leave?"
      );
      if (!confirmed) {
        return;
      }
    }
    if (isEditMode && vehicleId) {
      navigate(`/vehicles/${vehicleId}`);
    } else {
      navigate("/vehicles");
    }
  };

  const isFormValid = useMemo(() => {
    if (
      !formData.make?.trim() ||
      !formData.model?.trim() ||
      !formData.year ||
      !formData.vin?.trim() ||
      !formData.status ||
      formData.currentMileage === undefined
    ) {
      return false;
    }

    if (Object.keys(errors).length > 0) {
      return false;
    }

    const makeError = validateField("make", formData.make);
    const modelError = validateField("model", formData.model);
    const yearError = validateField("year", formData.year);
    const vinError = validateField("vin", formData.vin);
    const mileageError = validateField(
      "currentMileage",
      formData.currentMileage
    );

    if (makeError || modelError || yearError || vinError || mileageError) {
      return false;
    }

    // VIN duplicate check - backend will handle this

    return true;
  }, [formData, errors, validateField]);

  return (
    <div className="px-4 py-6 sm:px-0">
      <div className="max-w-4xl mx-auto">
        <div className="mb-6">
          <button
            onClick={handleCancel}
            className="text-white bg-indigo-600 hover:bg-indigo-700 mb-4 flex items-center text-sm font-medium"
          >
            <HiChevronLeft className="w-4 h-4 mr-2" />
            {isEditMode ? "Back to Vehicle" : "Back to Vehicles"}
          </button>
          <h1 className="text-3xl font-bold text-gray-900">
            {isEditMode ? "Edit Vehicle" : "Create New Vehicle"}
          </h1>
        </div>

        {submitSuccess && (
          <div className="mb-6 bg-green-50 border border-green-200 text-green-800 px-4 py-3 rounded-lg">
            <p className="font-semibold">Form validation passed!</p>
            <p className="text-sm">All required fields are valid.</p>
          </div>
        )}

        {submitError && (
          <div className="mb-6 bg-red-50 border border-red-200 text-red-800 px-4 py-3 rounded-lg">
            <p className="font-semibold">Error</p>
            <p className="text-sm">{submitError}</p>
          </div>
        )}

        <form onSubmit={handleSubmit}>
          <div className="space-y-6">
            <div>
              <h2 className="text-xl font-semibold text-gray-900 mb-4">
                Required Information
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Make */}
                <div>
                  <label
                    htmlFor="make"
                    className="block text-sm font-medium text-gray-700 mb-1"
                  >
                    Make <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    id="make"
                    name="make"
                    value={formData.make || ""}
                    onChange={handleChange}
                    className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 ${
                      errors.make
                        ? "border-red-300 focus:ring-red-500"
                        : "border-gray-300 focus:ring-indigo-500"
                    }`}
                  />
                  {errors.make && (
                    <p className="mt-1 text-sm text-red-600">{errors.make}</p>
                  )}
                </div>

                {/* Model */}
                <div>
                  <label
                    htmlFor="model"
                    className="block text-sm font-medium text-gray-700 mb-1"
                  >
                    Model <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    id="model"
                    name="model"
                    value={formData.model || ""}
                    onChange={handleChange}
                    className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 ${
                      errors.model
                        ? "border-red-300 focus:ring-red-500"
                        : "border-gray-300 focus:ring-indigo-500"
                    }`}
                  />
                  {errors.model && (
                    <p className="mt-1 text-sm text-red-600">{errors.model}</p>
                  )}
                </div>

                {/* Year */}
                <div>
                  <label
                    htmlFor="year"
                    className="block text-sm font-medium text-gray-700 mb-1"
                  >
                    Year <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="number"
                    id="year"
                    name="year"
                    min="1990"
                    max={new Date().getFullYear()}
                    value={formData.year || ""}
                    onChange={handleChange}
                    className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 ${
                      errors.year
                        ? "border-red-300 focus:ring-red-500"
                        : "border-gray-300 focus:ring-indigo-500"
                    }`}
                  />
                  {errors.year && (
                    <p className="mt-1 text-sm text-red-600">{errors.year}</p>
                  )}
                </div>

                {/* VIN */}
                <div>
                  <label
                    htmlFor="vin"
                    className="block text-sm font-medium text-gray-700 mb-1"
                  >
                    VIN <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    id="vin"
                    name="vin"
                    maxLength={17}
                    value={formData.vin || ""}
                    onChange={handleChange}
                    className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 uppercase ${
                      errors.vin
                        ? "border-red-300 focus:ring-red-500"
                        : "border-gray-300 focus:ring-indigo-500"
                    }`}
                    placeholder="17 characters"
                  />
                  {errors.vin && (
                    <p className="mt-1 text-sm text-red-600">{errors.vin}</p>
                  )}
                  <p className="mt-1 text-xs text-gray-500">
                    {formData.vin?.length || 0}/17 characters
                  </p>
                </div>

                {/* Status */}
                <div>
                  <label
                    htmlFor="status"
                    className="block text-sm font-medium text-gray-700 mb-1"
                  >
                    Status <span className="text-red-500">*</span>
                  </label>
                  <select
                    id="status"
                    name="status"
                    value={formData.status || "Active"}
                    onChange={handleChange}
                    className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 ${
                      errors.status
                        ? "border-red-300 focus:ring-red-500"
                        : "border-gray-300 focus:ring-indigo-500"
                    }`}
                  >
                    <option value="Active">Active</option>
                    <option value="Maintenance">Maintenance</option>
                    <option value="Retired">Retired</option>
                  </select>
                  {errors.status && (
                    <p className="mt-1 text-sm text-red-600">{errors.status}</p>
                  )}
                </div>

                {/* Current Mileage */}
                <div>
                  <label
                    htmlFor="currentMileage"
                    className="block text-sm font-medium text-gray-700 mb-1"
                  >
                    Current Mileage <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="number"
                    id="currentMileage"
                    name="currentMileage"
                    min="0"
                    step="1"
                    value={formData.currentMileage ?? ""}
                    onChange={handleChange}
                    className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 ${
                      errors.currentMileage
                        ? "border-red-300 focus:ring-red-500"
                        : "border-gray-300 focus:ring-indigo-500"
                    }`}
                  />
                  {errors.currentMileage && (
                    <p className="mt-1 text-sm text-red-600">
                      {errors.currentMileage}
                    </p>
                  )}
                </div>
              </div>
            </div>

            {/* Optional Fields Section */}
            <div>
              <h2 className="text-xl font-semibold text-gray-900 mb-4">
                Additional Information
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* License Plate */}
                <div>
                  <label
                    htmlFor="licensePlate"
                    className="block text-sm font-medium text-gray-700 mb-1"
                  >
                    License Plate
                  </label>
                  <input
                    type="text"
                    id="licensePlate"
                    name="licensePlate"
                    value={formData.licensePlate || ""}
                    onChange={handleChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  />
                </div>

                {/* Color */}
                <div>
                  <label
                    htmlFor="color"
                    className="block text-sm font-medium text-gray-700 mb-1"
                  >
                    Color
                  </label>
                  <select
                    id="color"
                    name="color"
                    value={formData.color || ""}
                    onChange={handleChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  >
                    <option value="">Select a color</option>
                    {COLORS.map((color) => (
                      <option key={color} value={color}>
                        {color}
                      </option>
                    ))}
                  </select>
                </div>

                {/* Purchase Date */}
                <div>
                  <label
                    htmlFor="purchaseDate"
                    className="block text-sm font-medium text-gray-700 mb-1"
                  >
                    Purchase Date
                  </label>
                  <input
                    type="date"
                    id="purchaseDate"
                    name="purchaseDate"
                    value={formData.purchaseDate || ""}
                    onChange={handleChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  />
                </div>

                {/* Fuel Type */}
                <div>
                  <label
                    htmlFor="fuelType"
                    className="block text-sm font-medium text-gray-700 mb-1"
                  >
                    Fuel Type
                  </label>
                  <select
                    id="fuelType"
                    name="fuelType"
                    value={formData.fuelType || "Gasoline"}
                    onChange={handleChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  >
                    <option value="Gasoline">Gasoline</option>
                    <option value="Diesel">Diesel</option>
                    <option value="Electric">Electric</option>
                    <option value="Hybrid">Hybrid</option>
                  </select>
                </div>

                {/* Transmission */}
                <div>
                  <label
                    htmlFor="transmission"
                    className="block text-sm font-medium text-gray-700 mb-1"
                  >
                    Transmission
                  </label>
                  <select
                    id="transmission"
                    name="transmission"
                    value={formData.transmission || "Automatic"}
                    onChange={handleChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  >
                    <option value="Automatic">Automatic</option>
                    <option value="Manual">Manual</option>
                  </select>
                </div>

                {/* Purchase Price */}
                <div>
                  <label
                    htmlFor="purchasePrice"
                    className="block text-sm font-medium text-gray-700 mb-1"
                  >
                    Purchase Price
                  </label>
                  <input
                    type="number"
                    id="purchasePrice"
                    name="purchasePrice"
                    min="0"
                    step="0.01"
                    value={formData.purchasePrice ?? ""}
                    onChange={handleChange}
                    className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 ${
                      errors.purchasePrice
                        ? "border-red-300 focus:ring-red-500"
                        : "border-gray-300 focus:ring-indigo-500"
                    }`}
                    placeholder="0.00"
                  />
                  {errors.purchasePrice && (
                    <p className="mt-1 text-sm text-red-600">
                      {errors.purchasePrice}
                    </p>
                  )}
                </div>
              </div>

              {/* Notes */}
              <div className="mt-6">
                <label
                  htmlFor="notes"
                  className="block text-sm font-medium text-gray-700 mb-1"
                >
                  Notes
                </label>
                <textarea
                  id="notes"
                  name="notes"
                  rows={4}
                  value={formData.notes || ""}
                  onChange={handleChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  placeholder="Additional notes about the vehicle..."
                />
              </div>
            </div>
          </div>

          {/* Form Actions */}
          <div className="mt-8 flex justify-end gap-4 pt-6 border-t border-gray-200">
            <button
              type="button"
              onClick={handleCancel}
              className="px-6 py-2 border border-gray-300 bg-gray-200 rounded-md text-sm font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={!isFormValid || isLoadingVehicle}
              className={`px-6 py-2 rounded-md text-sm font-medium text-white focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 ${
                isFormValid && !isLoadingVehicle
                  ? "bg-indigo-600 hover:bg-indigo-700"
                  : "bg-gray-400 cursor-not-allowed"
              }`}
            >
              {isLoadingVehicle
                ? "Saving..."
                : isEditMode
                ? "Update Vehicle"
                : "Create Vehicle"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
