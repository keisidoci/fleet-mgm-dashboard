import { useMemo, useState, useCallback, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { AgGridReact } from "ag-grid-react";
import type {
  ColDef,
  ICellRendererParams,
  RowSelectionOptions,
  RowClickedEvent,
  SelectionChangedEvent,
  RowClassParams,
} from "ag-grid-community";
import "ag-grid-community/styles/ag-grid.css";
import "ag-grid-community/styles/ag-theme-quartz.css";
import { PermissionGuard } from "../../components/PermissionGuard";
import { StatusBadge } from "../../components/StatusBadge";
import { getAllVehicles } from "../../services/vehicleService";
import { useUser } from "../../hooks/usePermissions";
import type { Vehicle } from "../../types";

export const Vehicles = () => {
  const navigate = useNavigate();
  const user = useUser();
  const [searchText, setSearchText] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [selectedRows, setSelectedRows] = useState<Vehicle[]>([]);
  const [vehicles, setVehicles] = useState<Vehicle[]>([]);

  // Load vehicles from API on mount
  useEffect(() => {
    const loadVehicles = async () => {
      setIsLoading(true);
      setError(null);
      try {
        const data = await getAllVehicles();
        setVehicles(data);
        setIsLoading(false);
      } catch {
        setError("Failed to load vehicles. Please try again.");
        setIsLoading(false);
      }
    };
    loadVehicles();

    // Listen for vehicle updates (when new vehicle is created)
    const handleVehiclesUpdated = () => {
      loadVehicles();
    };

    window.addEventListener("vehiclesUpdated", handleVehiclesUpdated);
    return () => {
      window.removeEventListener("vehiclesUpdated", handleVehiclesUpdated);
    };
  }, []);

  const filteredVehicles = useMemo(() => {
    let filtered = vehicles;
    if (user?.role === "driver") {
      filtered = vehicles.filter(
        (vehicle) => vehicle.assignedDriver === user.name
      );
    }

    if (!searchText.trim()) {
      return filtered;
    }

    const searchLower = searchText.toLowerCase();
    return filtered.filter(
      (vehicle) =>
        vehicle.vehicleId.toLowerCase().includes(searchLower) ||
        vehicle.make.toLowerCase().includes(searchLower) ||
        vehicle.model.toLowerCase().includes(searchLower) ||
        vehicle.vin.toLowerCase().includes(searchLower) ||
        (vehicle.assignedDriver?.toLowerCase().includes(searchLower) ??
          false) ||
        vehicle.status.toLowerCase().includes(searchLower)
    );
  }, [searchText, user, vehicles]);

  const columnDefs: ColDef<Vehicle>[] = useMemo(
    () => [
      {
        field: "vehicleId",
        headerName: "Vehicle ID",
        width: 120,
        pinned: "left",
        lockPosition: true,
        checkboxSelection: true,
        headerCheckboxSelection: true,
        filter: "agTextColumnFilter",
        filterParams: {
          filterOptions: ["contains", "equals", "startsWith"],
        },
      },
      {
        field: "make",
        headerName: "Make",
        width: 130,
        filter: "agTextColumnFilter",
        filterParams: {
          filterOptions: ["contains", "equals"],
        },
      },
      {
        field: "model",
        headerName: "Model",
        width: 150,
        filter: "agTextColumnFilter",
        filterParams: {
          filterOptions: ["contains", "equals"],
        },
      },
      {
        field: "year",
        headerName: "Year",
        width: 100,
        filter: "agNumberColumnFilter",
        filterParams: {
          filterOptions: ["equals", "greaterThan", "lessThan", "inRange"],
        },
      },
      {
        field: "vin",
        headerName: "VIN",
        width: 180,
        filter: "agTextColumnFilter",
      },
      {
        headerName: "Status",
        width: 130,
        valueGetter: (params) => params.data?.status ?? "",
        cellRenderer: (params: ICellRendererParams<Vehicle>) =>
          params.value ? <StatusBadge status={params.value} /> : "",
        filter: "agTextColumnFilter",
        filterValueGetter: (params) =>
          String(params.data?.status ?? "").toLowerCase(),
        filterParams: {
          filterOptions: ["contains", "equals"],
          defaultOption: "contains",
          textFormatter: (value: string) => value?.toLowerCase(),
        },
      },
      {
        field: "currentMileage",
        headerName: "Current Mileage",
        width: 140,
        filter: "agNumberColumnFilter",
        filterParams: {
          filterOptions: ["equals", "greaterThan", "lessThan", "inRange"],
        },
        valueFormatter: (params) => {
          return params.value?.toLocaleString() || "";
        },
      },
      {
        field: "lastServiceDate",
        headerName: "Last Service Date",
        width: 160,
        filter: "agDateColumnFilter",
        valueFormatter: (params) => {
          if (!params.value) return "";
          return new Date(params.value).toLocaleDateString();
        },
      },
      {
        field: "assignedDriver",
        headerName: "Assigned Driver",
        width: 160,
        filter: "agTextColumnFilter",
        cellRenderer: (params: ICellRendererParams<Vehicle>) => {
          return params.value || "Unassigned";
        },
      },
    ],
    []
  );

  const defaultColDef = useMemo<ColDef>(
    () => ({
      sortable: true,
      filter: true,
      resizable: true,
      floatingFilter: true,
    }),
    []
  );

  const onRowClicked = useCallback(
    (event: RowClickedEvent<Vehicle>) => {
      if (event.data) {
        navigate(`/vehicles/${event.data.vehicleId}`);
      }
    },
    [navigate]
  );

  const onSelectionChanged = useCallback(
    (event: SelectionChangedEvent<Vehicle>) => {
      const selectedData = event.api.getSelectedRows();
      setSelectedRows(selectedData);
    },
    []
  );

  const rowSelection: RowSelectionOptions = useMemo(
    () => ({
      mode: "multiRow",
      checkboxes: true,
    }),
    []
  );

  if (error) {
    return (
      <div className="px-4 py-6 sm:px-0">
        <div className="bg-white shadow rounded-lg p-6">
          <div className="text-center py-12">
            <div className="text-red-600 text-lg font-semibold mb-2">
              Error Loading Vehicles
            </div>
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

  if (isLoading) {
    return (
      <div className="px-4 py-6 sm:px-0">
        <div className="bg-white shadow rounded-lg p-6">
          <div className="text-center py-12">
            <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-indigo-600 mb-4"></div>
            <p className="text-gray-600">Loading vehicles...</p>
          </div>
        </div>
      </div>
    );
  }

  if (filteredVehicles.length === 0 && searchText) {
    return (
      <div className="px-4 py-6 sm:px-0">
        <div className="bg-white shadow rounded-lg p-6">
          <div className="flex justify-between items-center mb-6">
            <h1 className="text-3xl font-bold text-gray-900">Vehicles</h1>
            <PermissionGuard requireCreate>
              <button className="bg-indigo-600 hover:bg-indigo-700 text-white px-4 py-2 rounded-md text-sm font-medium">
                Add Vehicle
              </button>
            </PermissionGuard>
          </div>
          <div className="border-t border-gray-200 pt-6">
            <div className="mb-4">
              <input
                type="text"
                placeholder="Search vehicles..."
                value={searchText}
                onChange={(e) => setSearchText(e.target.value)}
                className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
              />
            </div>
            <div className="text-center py-12">
              <p className="text-gray-600 text-lg mb-2">No vehicles found</p>
              <p className="text-gray-500 text-sm">
                Try adjusting your search criteria
              </p>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="px-4 py-6 sm:px-0">
      <div className="bg-white shadow rounded-lg p-6">
        <div className="flex justify-between items-center mb-6">
          <div>
            <h2 className="text-3xl font-bold text-gray-900">Vehicles</h2>
            <p className="text-md text-gray-500 mt-1 text-left">
              {filteredVehicles.length} vehicle
              {filteredVehicles.length !== 1 ? "s" : ""}
              {selectedRows.length > 0 && ` • ${selectedRows.length} selected`}
            </p>
          </div>
          <PermissionGuard requireCreate>
            <button
              onClick={() => navigate("/vehicles/new")}
              className="bg-indigo-600 hover:bg-indigo-700 text-white px-4 py-2 rounded-md text-sm font-medium"
            >
              Add Vehicle
            </button>
          </PermissionGuard>
        </div>

        <div className="border-t border-gray-200 pt-6">
          {/* Action Buttons for Selected Rows */}
          {selectedRows.length > 0 && (
            <div className="mb-4 flex gap-2">
              <PermissionGuard requireEdit>
                <button className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-md text-sm font-medium">
                  Some bulk action ({selectedRows.length})
                </button>
              </PermissionGuard>
              <PermissionGuard requireDelete>
                <button className="bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-md text-sm font-medium">
                  Delete Selected ({selectedRows.length})
                </button>
              </PermissionGuard>
            </div>
          )}

          {/* AG Grid Table */}
          <div className="w-full" style={{ height: 600, overflow: "hidden" }}>
            <div
              className="ag-theme-quartz"
              style={{ height: "100%", width: "100%" }}
            >
              <AgGridReact<Vehicle>
                rowData={filteredVehicles}
                columnDefs={columnDefs}
                defaultColDef={defaultColDef}
                pagination={true}
                paginationPageSize={50}
                suppressPaginationPanel={false}
                suppressScrollOnNewData={true}
                domLayout="normal"
                animateRows={true}
                rowSelection={rowSelection}
                onRowClicked={onRowClicked}
                onSelectionChanged={onSelectionChanged}
                suppressRowClickSelection={false}
                rowStyle={{ cursor: "pointer" }}
                getRowStyle={(params: RowClassParams<Vehicle>) => {
                  if (params.node.isSelected()) {
                    return { backgroundColor: "#e0e7ff" };
                  }
                  return undefined;
                }}
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
