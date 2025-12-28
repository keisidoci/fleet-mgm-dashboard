import { Outlet, Link, useNavigate } from "react-router-dom";
import { useUser, useIsAuthenticated } from "../hooks/usePermissions";
import { useAppDispatch } from "../app/hooks";
import { logout } from "../app/slices/authSlice";
import { canAccessRoute } from "../utils/permissions";

export const MainLayout = () => {
  const user = useUser();
  const isAuthenticated = useIsAuthenticated();
  const dispatch = useAppDispatch();
  const navigate = useNavigate();

  const handleLogout = () => {
    dispatch(logout());
    navigate("/login");
  };

  if (!isAuthenticated) {
    return null;
  }

  // const roleDisplayName = {
  //   admin: "Administrator",
  //   fleet_manager: "Fleet Manager",
  //   driver: "Driver",
  // };

  return (
    <div className="min-h-screen bg-gray-50">
      <nav className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16">
            <div className="flex">
              <div className="flex-shrink-0 flex items-center">
                <h1 className="text-md font-bold text-indigo-600">Fleet Mgm</h1>
              </div>
              <div className="hidden sm:ml-6 sm:flex sm:space-x-8">
                {canAccessRoute(user?.role || null, "/dashboard") && (
                  <Link
                    to="/dashboard"
                    className="border-transparent text-gray-500 hover:border-gray-300 hover:text-gray-700 inline-flex items-center px-1 pt-1 border-b-2 text-sm font-medium"
                  >
                    Dashboard
                  </Link>
                )}
                {canAccessRoute(user?.role || null, "/vehicles") && (
                  <Link
                    to="/vehicles"
                    className="border-transparent text-gray-500 hover:border-gray-300 hover:text-gray-700 inline-flex items-center px-1 pt-1 border-b-2 text-sm font-medium"
                  >
                    Vehicles
                  </Link>
                )}
                {canAccessRoute(user?.role || null, "/drivers") && (
                  <Link
                    to="/drivers"
                    className="border-transparent text-gray-500 hover:border-gray-300 hover:text-gray-700 inline-flex items-center px-1 pt-1 border-b-2 text-sm font-medium"
                  >
                    Drivers
                  </Link>
                )}
                {canAccessRoute(user?.role || null, "/maintenance") && (
                  <Link
                    to="/maintenance"
                    className="border-transparent text-gray-500 hover:border-gray-300 hover:text-gray-700 inline-flex items-center px-1 pt-1 border-b-2 text-sm font-medium"
                  >
                    Maintenance
                  </Link>
                )}
                {canAccessRoute(user?.role || null, "/admin") && (
                  <Link
                    to="/admin"
                    className="border-transparent text-gray-500 hover:border-gray-300 hover:text-gray-700 inline-flex items-center px-1 pt-1 border-b-2 text-sm font-medium"
                  >
                    Admin
                  </Link>
                )}
              </div>
            </div>
            <div className="flex items-center">
              <h4
                className="text-gray-500 hover:text-gray-700 cursor-pointer"
                onClick={handleLogout}
              >
                Logout
              </h4>
            </div>
          </div>
        </div>
      </nav>

      <main className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
        <Outlet />
      </main>
    </div>
  );
};
