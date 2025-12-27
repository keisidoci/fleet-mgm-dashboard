import type { VehicleStatus } from "../types";

interface StatusBadgeProps {
  status: VehicleStatus;
}

export const StatusBadge = ({ status }: StatusBadgeProps) => {
  const statusConfig: Record<
    VehicleStatus,
    { bgColor: string; textColor: string }
  > = {
    Active: {
      bgColor: "bg-green-100",
      textColor: "text-green-800",
    },
    Maintenance: {
      bgColor: "bg-yellow-100",
      textColor: "text-yellow-800",
    },
    Retired: {
      bgColor: "bg-gray-100",
      textColor: "text-gray-800",
    },
  };

  const config = statusConfig[status] || statusConfig.Retired;

  return (
    <span
      className={`px-2 py-1 rounded-full text-xs font-semibold ${config.bgColor} ${config.textColor}`}
    >
      {status}
    </span>
  );
};

