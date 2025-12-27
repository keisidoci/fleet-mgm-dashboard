import { lazy } from 'react';
import { createBrowserRouter, Navigate } from 'react-router-dom';
import { ProtectedRoute } from '../components/ProtectedRoute';
import { MainLayout } from '../layouts/MainLayout';
import { Login } from '../features/auth/Login';

// Lazy load components
const Dashboard = lazy(() =>
  import('../features/dashboard/Dashboard').then((module) => ({
    default: module.Dashboard,
  }))
);

const Vehicles = lazy(() =>
  import('../features/vehicles/Vehicles').then((module) => ({
    default: module.Vehicles,
  }))
);

const Drivers = lazy(() =>
  import('../features/drivers/Drivers').then((module) => ({
    default: module.Drivers,
  }))
);

const Maintenance = lazy(() =>
  import('../features/maintenance/Maintenance').then((module) => ({
    default: module.Maintenance,
  }))
);

const Admin = lazy(() =>
  import('../features/admin/Admin').then((module) => ({
    default: module.Admin,
  }))
);

export const router = createBrowserRouter([
  {
    path: '/login',
    element: <Login />,
  },
  {
    path: '/',
    element: (
      <ProtectedRoute>
        <MainLayout />
      </ProtectedRoute>
    ),
    children: [
      {
        index: true,
        element: <Navigate to="/dashboard" replace />,
      },
      {
        path: 'dashboard',
        element: <Dashboard />,
      },
      {
        path: 'vehicles',
        element: <ProtectedRoute><Vehicles /></ProtectedRoute>,
      },
      {
        path: 'drivers',
        element: <ProtectedRoute><Drivers /></ProtectedRoute>,
      },
      {
        path: 'maintenance',
        element: <ProtectedRoute><Maintenance /></ProtectedRoute>,
      },
      {
        path: 'admin',
        element: (
          <ProtectedRoute requiredRole="admin">
            <Admin />
          </ProtectedRoute>
        ),
      },
    ],
  },
  {
    path: '*',
    element: <Navigate to="/dashboard" replace />,
  },
]);

