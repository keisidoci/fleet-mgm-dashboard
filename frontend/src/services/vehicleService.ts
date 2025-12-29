import axios, { AxiosError } from "axios";
import { apiClient } from "./apiClient";
import type { Vehicle } from "../types";
import { mockFleetData } from "../../../backend/src/store/mockFleetData";

// In-memory store for vehicles created when API is unavailable
let inMemoryVehicles: Vehicle[] = [];

// Load in-memory vehicles from localStorage on initialization
const loadInMemoryVehicles = (): Vehicle[] => {
  try {
    const stored = localStorage.getItem("fleet_in_memory_vehicles");
    if (stored) {
      return JSON.parse(stored);
    }
  } catch (error) {
    console.error("Failed to load in-memory vehicles:", error);
  }
  return [];
};

// Save in-memory vehicles to localStorage
const saveInMemoryVehicles = (vehicles: Vehicle[]): void => {
  try {
    localStorage.setItem("fleet_in_memory_vehicles", JSON.stringify(vehicles));
  } catch (error) {
    console.error("Failed to save in-memory vehicles:", error);
  }
};

// Initialize in-memory vehicles from localStorage
inMemoryVehicles = loadInMemoryVehicles();

export const getAllVehicles = async (): Promise<Vehicle[]> => {
  try {
    const response = await apiClient.get<Vehicle[]>("/vehicles");
    const apiVehicles = response.data;
    const inMemoryIds = new Set(inMemoryVehicles.map((v) => v.vehicleId));
    const apiOnlyVehicles = apiVehicles.filter(
      (v) => !inMemoryIds.has(v.vehicleId)
    );
    return [...apiOnlyVehicles, ...inMemoryVehicles];
  } catch (error) {
    console.error("Failed to fetch vehicles from API, using mock data:", error);
    const mockIds = new Set(mockFleetData.map((v) => v.vehicleId));
    const inMemoryOnly = inMemoryVehicles.filter(
      (v) => !mockIds.has(v.vehicleId)
    );
    return [...mockFleetData, ...inMemoryOnly];
  }
};

export const getVehicleById = async (
  vehicleId: string
): Promise<Vehicle | undefined> => {
  try {
    const allVehicles = await getAllVehicles();
    return allVehicles.find((vehicle) => vehicle.vehicleId === vehicleId);
  } catch (error) {
    console.error("Failed to fetch vehicle from API:", error);
    return mockFleetData.find((vehicle) => vehicle.vehicleId === vehicleId);
  }
};

export const createVehicle = async (vehicleData: Vehicle): Promise<Vehicle> => {
  const { vehicleId, ...restData } = vehicleData;
  const payload =
    vehicleId && vehicleId !== ""
      ? vehicleData
      : (restData as Omit<Vehicle, "vehicleId"> &
          Partial<Pick<Vehicle, "vehicleId">>);

  try {
    const response = await apiClient.post<Vehicle>("/vehicles", payload);
    const createdVehicle = response.data;

    inMemoryVehicles = inMemoryVehicles.filter(
      (v) => v.vehicleId !== createdVehicle.vehicleId
    );
    saveInMemoryVehicles(inMemoryVehicles);

    return createdVehicle;
  } catch (error) {
    if (axios.isAxiosError(error)) {
      const axiosError = error as AxiosError<{ message: string }>;
      if (axiosError.response?.status === 400) {
        throw new Error(
          axiosError.response?.data?.message ||
            "Validation error: Please check your input and try again."
        );
      }
      if (axiosError.response?.status) {
        throw new Error(
          axiosError.response?.data?.message ||
            "Failed to create vehicle. Please try again."
        );
      }
    }
    // If it's not an Axios error or has no response, throw generic error
    throw new Error("Failed to create vehicle. Please try again.");
  }
};

export const updateVehicle = async (
  vehicleId: string,
  vehicleData: Partial<Vehicle>
): Promise<Vehicle> => {
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
