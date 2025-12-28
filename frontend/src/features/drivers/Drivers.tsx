import { usePermissions } from '../../hooks/usePermissions';
import { PermissionGuard } from '../../components/PermissionGuard';

export const Drivers = () => {
  const permissions = usePermissions();

  return (
    <div className="px-4 py-6 sm:px-0">
      <div className="bg-white shadow rounded-lg p-6">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-3xl font-bold text-gray-900">Drivers</h1>
          <PermissionGuard requireCreate>
            <button className="bg-indigo-600 hover:bg-indigo-700 text-white px-4 py-2 rounded-md text-sm font-medium">
              Add Driver
            </button>
          </PermissionGuard>
        </div>
        <div className="border-t border-gray-200 pt-6">
          <p className="text-gray-600 mb-4">
            Driver list will be displayed here.
          </p>
          <div className="flex gap-2">
            <PermissionGuard requireEdit>
              <button className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-md text-sm font-medium">
                Edit Driver
              </button>
            </PermissionGuard>
            <PermissionGuard requireDelete>
              <button className="bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-md text-sm font-medium">
                Delete Driver
              </button>
            </PermissionGuard>
          </div>
          <div className="mt-4 text-sm text-gray-500">
            {permissions.canDelete && (
              <p>You have full access: create, edit, and delete drivers.</p>
            )}
            {!permissions.canDelete && permissions.canEdit && (
              <p>You can view and edit drivers, but cannot delete them.</p>
            )}
            {!permissions.canEdit && (
              <p>You have read-only access to drivers.</p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

