import { useUser } from '../../hooks/usePermissions';

export const Admin = () => {
  const user = useUser();

  return (
    <div className="px-4 py-6 sm:px-0">
      <div className="bg-white shadow rounded-lg p-6">
        <h1 className="text-3xl font-bold text-gray-900 mb-6">Admin Panel</h1>
        <div className="border-t border-gray-200 pt-6">
          <p className="text-gray-600 mb-4">
            Welcome to the admin panel, {user?.name}!
          </p>
          <p className="text-gray-600">
            This section is only accessible to administrators. Here you can
            manage system settings, users, and perform administrative tasks.
          </p>
        </div>
      </div>
    </div>
  );
};

