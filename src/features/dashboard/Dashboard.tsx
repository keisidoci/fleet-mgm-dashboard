import { useUser } from '../../hooks/usePermissions';

export const Dashboard = () => {
  const user = useUser();

  return (
    <div className="px-4 py-6 sm:px-0">
      <div className="border-4 border-dashed border-gray-200 rounded-lg p-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-4">
          Welcome, {user?.name}!
        </h1>
        <p className="text-lg text-gray-600 mb-6">
          Role: <span className="font-semibold">{user?.role}</span>
        </p>
        <div className="bg-white rounded-lg shadow p-6">
          <h2 className="text-xl font-semibold mb-4">Dashboard Overview</h2>
          <p className="text-gray-600">
            This is the main dashboard. Content will be added based on your role
            and permissions.
          </p>
        </div>
      </div>
    </div>
  );
};

