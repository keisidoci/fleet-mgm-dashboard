import axios, { AxiosError } from "axios";
import { apiClient } from "./apiClient";
import type { Vehicle } from "../types";
import { mockFleetData } from "../../../backend/src/store/mockFleetData";

// Fallback to mock data if API is not available

// Check if backend is available
const USE_API = import.meta.env.VITE_USE_API !== "false";

// READ API: Get all vehicles
export const getAllVehicles = async (): Promise<Vehicle[]> => {
  try {
    const response = await apiClient.get<Vehicle[]>("/vehicles");
    return response.data;
  } catch (error) {
    console.error("Failed to fetch vehicles from API, using mock data:", error);
    // Fallback to mock data if API fails
    return mockFleetData;
  }
};

// READ API: Get vehicle by ID
// Since backend only has GET all vehicles, we fetch all and filter
export const getVehicleById = async (
  vehicleId: string
): Promise<Vehicle | undefined> => {
  try {
    // Fetch all vehicles and find the one with matching ID
    const allVehicles = await getAllVehicles();
    return allVehicles.find((vehicle) => vehicle.vehicleId === vehicleId);
  } catch (error) {
    console.error("Failed to fetch vehicle from API:", error);
    // Fallback to mock data
    return mockFleetData.find((vehicle) => vehicle.vehicleId === vehicleId);
  }
};

// WRITE API: Create new vehicle
export const createVehicle = async (vehicleData: Vehicle): Promise<Vehicle> => {
  try {
    const response = await apiClient.post<Vehicle>("/vehicles", vehicleData);
    return response.data;
  } catch (error) {
    if (axios.isAxiosError(error)) {
      const axiosError = error as AxiosError<{ message: string }>;
      throw new Error(
        axiosError.response?.data?.message ||
          "Failed to create vehicle. Please try again."
      );
    }
    throw new Error("An unexpected error occurred while creating the vehicle.");
  }
};

// WRITE API: Update vehicle
export const updateVehicle = async (
  vehicleId: string,
  vehicleData: Partial<Vehicle>
): Promise<Vehicle> => {
  if (!USE_API) {
    // Fallback: just return the data (no persistence)
    console.warn("API not available, vehicle not persisted");
    const existing = mockFleetData.find((v) => v.vehicleId === vehicleId);
    return existing
      ? { ...existing, ...vehicleData }
      : (vehicleData as Vehicle);
  }

  try {
    const response = await apiClient.put<Vehicle>(
      `/vehicles/${vehicleId}`,
      vehicleData
    );
    return response.data;
  } catch (error) {
    if (axios.isAxiosError(error)) {
      const axiosError = error as AxiosError<{ message: string }>;
      if (axiosError.response?.status === 404) {
        throw new Error("Vehicle not found");
      }
      throw new Error(
        axiosError.response?.data?.message ||
          "Failed to update vehicle. Please try again."
      );
    }
    if (error instanceof Error) {
      throw error;
    }
    throw new Error("An unexpected error occurred while updating the vehicle.");
  }
};
