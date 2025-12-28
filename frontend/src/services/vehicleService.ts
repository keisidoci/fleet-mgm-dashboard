import axios, { AxiosError } from "axios";
import { apiClient } from "./apiClient";
import type { Vehicle } from "../types";
import { mockFleetData } from "../../../backend/src/store/mockFleetData";


export const getAllVehicles = async (): Promise<Vehicle[]> => {
  try {
    const response = await apiClient.get<Vehicle[]>("/vehicles");
    return response.data;
  } catch (error) {
    console.error("Failed to fetch vehicles from API, using mock data:", error);
    return mockFleetData;
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
