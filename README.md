# Fleet Management Dashboard

Web application for managing automotive fleets, including vehicles, drivers, maintenance schedules, and assignments. Built with React, TypeScript, and Express.js.

## 📋 Table of Contents

- [Project Overview](#project-overview)
- [Setup Instructions](#setup-instructions)
- [Project Structure](#project-structure)
- [Architecture & Design Decisions](#architecture--design-decisions)
- [Features Implemented](#features-implemented)
- [Known Limitations](#known-limitations)
- [Future Improvements](#future-improvements)
- [Technologies Used](#technologies-used)

---

## 🎯 Project Overview

### Brief Description

The Fleet Management Dashboard is a centralized system designed for automotive companies to manage large fleets of vehicles, track driver assignments, monitor maintenance schedules, and generate reports. The application provides role-based access control, ensuring that users only see and interact with data appropriate for their role.

### Key Features Implemented

- **Authentication & Role-Based Access Control (RBAC)**: Three user roles (Admin, Fleet Manager, Driver) with different permission levels
- **Vehicle Management**:Create and Read operations for vehicles.
- **Dashboard**: Real-time metrics, charts and graphs for fleet analytics
- **Backend API Integration**: RESTful API for vehicle data persistence
- **Responsive Design**: Mobile-friendly interface using Tailwind CSS

---

## 🚀 Setup Instructions

### Prerequisites

- Node.js (v16 or higher)
- npm
- Git

### Installation

1. **Clone the repository**

   ```bash
   git clone <repository-url>
   cd fleet-mgm-dashboard
   ```

2. **Install Frontend Dependencies**

   ```bash
   cd frontend
   npm install
   ```

3. **Install Backend Dependencies**
   ```bash
   cd ../backend
   npm install
   ```

### Running the Application

1. **Start the Backend Server**

   ```bash
   cd backend
   npm run dev
   ```

   The backend will run on `http://localhost:3001`

2. **Start the Frontend Development Server** (in a new terminal)

   ```bash
   cd frontend
   npm run dev
   ```

   The frontend will run on `http://localhost:5173` (or the next available port)

3. **Access the Application**
   - Open your browser and navigate to `http://localhost:5173`
   - Use the following demo credentials:
     - **Admin**: `admin` / `admin123`
     - **Fleet Manager**: `manager` / `manager123`
     - **Driver**: `driver` / `driver123`

---

## 📁 Project Structure

```
fleet-mgm-dashboard/
├── backend/                # Express.js API server
│   ├── src/
│   │   ├── routes/         # API route handlers
│   │   │   └── vehicles.ts # Vehicle endpoints
│   │   ├── store/          # In-memory data stores
│   │   │   ├── vehicleStore.ts
│   │   │   └── mockFleetData.ts
│   │   ├── types/          # TypeScript type definitions
│   │   └── server.ts       # Express server setup
│   ├── package.json
│   └── tsconfig.json
│
├── frontend/                # React application
│   ├── src/
│   │   ├── app/            # Redux store configuration
│   │   │   ├── slices/     # Redux slices (auth)
│   │   │   └── store.ts
│   │   ├── components/     # Reusable components
│   │   │   ├── PermissionGuard.tsx
│   │   │   ├── ProtectedRoute.tsx
│   │   │   └── StatusBadge.tsx
│   │   ├── features/       # Feature-based modules
│   │   │   ├── auth/       # Authentication
│   │   │   ├── dashboard/  # Dashboard page
│   │   │   ├── vehicles/   # Vehicle management
│   │   │   ├── drivers/    # Driver management (placeholder)
│   │   │   ├── maintenance/# Maintenance management (placeholder)
│   │   │   └── admin/      # Admin panel (placeholder)
│   │   ├── hooks/          # Custom React hooks
│   │   ├── layouts/        # Layout components
│   │   ├── routes/         # Route configuration
│   │   ├── services/       # API services and mock data
│   │   ├── types/          # TypeScript types
│   │   └── utils/          # Utility functions
│   ├── package.json
│   └── vite.config.ts
│
└── README.md
```

### Why This Structure?

- **Feature-Based Organization**: Each major feature (vehicles, drivers, maintenance) has its own folder, making it easy to locate and maintain related code
- **Separation of Concerns**: Clear separation between UI components, business logic (services), and state management
- **Scalability**: The structure supports easy addition of new features without cluttering existing code
- **Type Safety**: Centralized type definitions ensure consistency across the application
- **Backend/Frontend Separation**: Independent deployment and scaling capabilities

---

## 🏗️ Architecture & Design Decisions

### State Management Approach

**Redux Toolkit** was chosen for state management because:

- **Centralized State**: Authentication state is shared across multiple components
- **DevTools**: Excellent debugging capabilities with Redux DevTools
- **Predictable Updates**: Clear data flow makes the application easier to reason about
- **Async Actions**: Built-in support for async operations with `createAsyncThunk`

**Current State Structure:**

```typescript
{
  auth: {
    user: StoredUser | null,
    isAuthenticated: boolean,
    isLoading: boolean
  }
}
```

### Why These Patterns?

1. **Lazy Loading Routes**: All feature components are lazy-loaded to improve initial page load time
2. **Permission-Based Rendering**: `PermissionGuard` component conditionally renders UI elements based on user permissions
3. **Service Layer Pattern**: API calls are abstracted into service functions, making it easy to switch between mock data and real APIs
4. **Custom Hooks**: `usePermissions` and `useUser` hooks provide clean access to authentication state

### Trade-offs Considered

1. **In-Memory Storage vs Database**

   - **Chosen**: In-memory storage for simplicity and speed of development
   - **Trade-off**: Data is lost on server restart. Implementet for testing/demo purposes.

2. **Mock Data vs Full Backend**
   - **Chosen**: Hybrid approach - backend for vehicles, mock data for maintenance/drivers
   - **Trade-off**: Some features use mock data while others use real API calls

### Libraries Added and Why

- **AG Grid React**: Enterprise-grade data grid with built-in sorting, filtering, and pagination
- **Recharts**: Lightweight charting library for data visualization
- **React Icons**: Comprehensive icon library for consistent UI
- **Axios**: HTTP client with interceptors for error handling and request/response transformation
- **Tailwind CSS**: Utility-first CSS framework for rapid UI development

---

## ✅ Features Implemented

### Authentication & RBAC

- ✅ Mock login system with 3 user roles
- ✅ Redux state management for authentication
- ✅ Route protection based on roles
- ✅ Permission-based UI components
- ✅ Session persistence using localStorage
- ✅ Logout functionality
- ✅ Unauthorized access handling

### Vehicle Management

#### Vehicle List Page

- ✅ AG Grid data table with 300+ vehicles
- ✅ All required columns (ID, Make, Model, Year, VIN, Status, Mileage, Last Service, Assigned Driver)
- ✅ Sorting on all columns
- ✅ Filtering (text, number, date filters)
- ✅ Pagination (default 50 rows per page)
- ✅ Row selection (single and multiple)
- ✅ Custom status badges (color-coded)
- ✅ Click to navigate to detail page
- ✅ Loading, error, and empty states
- ✅ Search functionality
- ✅ Role-based filtering (drivers see only their vehicles)

#### Vehicle Detail Page

- ✅ Basic Information Card (all specs)
- ✅ Status indicator with badge
- ✅ Edit button with permission check
- ✅ Maintenance History with timeline view
- ✅ Filter by service type and date range
- ✅ Fuel & Mileage Analytics
- ✅ Assignment History
- ✅ 404 handling for vehicle not found
- ✅ Empty states for no maintenance/assignments

#### Add New Vehicle Form

- ✅ All required fields with validation
- ✅ All optional fields
- ✅ Real-time validation with error messages
- ✅ VIN validation (17 alphanumeric characters)
- ✅ Year validation (1990-current year)
- ✅ Mileage validation (positive number)
- ✅ Duplicate VIN check (backend)
- ✅ Disabled submit until valid
- ✅ Success/error messages
- ✅ Confirm dialog before leaving with unsaved changes
- ✅ Cancel button returns to previous page
- ⚠️ Edit vehicle form has no backend API implemented

#### Vehicle Dashboard

- ✅ Summary Cards (Total, Active, In Maintenance, Retired, Service Due Soon)
- ✅ Quick Stats (Total Fleet Mileage, Average Vehicle Age, Monthly Maintenance Cost)
- ✅ Recent Activity (Last 5 vehicles, Recent maintenance, Recent assignments)
- ✅ Responsive grid layout
- ✅ Clickable cards navigate to detail pages
- ✅ Role-based views (drivers see filtered data)

### Backend Integration (Partial)

- ✅ Express.js server with TypeScript
- ✅ GET `/api/vehicles` - Read all vehicles
- ✅ POST `/api/vehicles` - Create new vehicle
- ✅ Health check endpoint
- ✅ CORS enabled
- ✅ Error handling middleware
- ✅ In-memory data storage
- ⚠️ Data is static and stored in the project
- ⚠️ Data persists only during server session

### Technical Implementation

- ✅ Redux Toolkit with slices
- ✅ Lazy loading for routes
- ✅ Component memoization (useMemo, useCallback)
- ✅ Error handling (API errors, form validation, empty states)
- ✅ Loading states (spinners, skeletons)
- ✅ Responsive design with Tailwind CSS
- ✅ TypeScript throughout

---

## ⚠️ Known Limitations

### Incomplete Features

1. **Driver Management**

   - ❌ Driver list page not implemented (placeholder only)
   - ❌ Driver detail page not implemented
   - ❌ Vehicle assignment interface not implemented
   - ❌ Driver search and filtering not implemented

2. **Maintenance Management**

   - Maintenance log implemented only on vehicle details page, with filtering option.
   - ⚠️ Standalone maintenance management page not implemented (placeholder only)
   - ❌ Maintenance schedule view not implemented (placeholder only)
   - ❌ Create maintenance record form not implemented

3. **Reports & Analytics**
   - ❌ Utilization report not implemented
   - ❌ Cost analysis report not implemented
   - ❌ Fleet composition breakdown not implemented

### Known Issues

1. **Data Persistence**

   - Backend uses in-memory storage - data is lost on server restart
   - New vehicles created via API are not persisted to JSON file

2. **Backend API Limitations**

   - Only GET all vehicles and POST create vehicle endpoints implemented
   - No PUT (update) or DELETE endpoints
   - No GET by ID endpoint (fetches all and filters client-side)

3. **Mock Data Dependencies**
   - Maintenance records use mock data (not from API)
   - Driver data uses mock data
   - Assignment history uses mock data
   - Fuel records use mock data

---

## 🔮 Future Improvements

1. **Backend API Expansion**

   - Add PUT endpoint for updating vehicles
   - Add DELETE endpoint for removing vehicles
   - Add GET by ID endpoint
   - Implement maintenance record endpoints
   - Implement driver management endpoints

2. **Data Persistence**

   - Add database integration (PostgreSQL or MongoDB)
   - Add data migration scripts

3. **Driver Management**

   - Complete driver list page with AG Grid
   - Implement driver detail page
   - Build vehicle assignment interface
   - Add driver search and filtering

4. **Maintenance Management**

   - Implement maintenance schedule calendar view
   - Create maintenance log with filtering
   - Build create/edit maintenance record form
   - Add maintenance reminders and notifications

5. **Reports & Analytics**

   - Dedicated reports section with multiple report types
   - Utilization report (vehicle usage statistics)
   - Cost analysis report (maintenance costs breakdown)
   - Fleet composition analysis
   - Export reports to PDF/Excel

6. **Performance Optimizations**
   - Implement React Query for better caching
   - Add service worker for offline support

7. **User Experience**
   - Add toast notifications for success/error messages
   - Implement optimistic UI updates
   - Add keyboard shortcuts
   - Improve mobile responsiveness
   - Add dark mode support

8. **Testing**
   - Unit tests for utility functions
   - Integration tests for API endpoints
   - Component tests with React Testing Library
   - E2E tests with Playwright or Cypress


9. **Security**
   - Implement JWT authentication
   - Add password hashing
   - Implement API rate limiting
   - Add request validation middleware
   - Implement audit logging

10. **DevOps**
   - CI/CD pipeline setup
   - Automated testing in pipeline
   - Environment-based configuration

---

## 🛠️ Technologies Used

### Frontend

| Technology        | Version | Purpose                     |
| ----------------- | ------- | --------------------------- |
| **React**         | ^19.2.0 | UI library                  |
| **TypeScript**    | ~5.9.3  | Type safety                 |
| **Vite**          | ^7.2.4  | Build tool and dev server   |
| **Redux Toolkit** | ^2.11.2 | State management            |
| **React Router**  | ^7.11.0 | Client-side routing         |
| **Tailwind CSS**  | ^4.1.18 | Utility-first CSS framework |
| **AG Grid React** | ^35.0.0 | Data grid component         |
| **Recharts**      | ^3.6.0  | Charting library            |
| **Axios**         | ^1.13.2 | HTTP client                 |
| **React Icons**   | ^5.5.0  | Icon library                |

### Backend

| Technology     | Version | Purpose                       |
| -------------- | ------- | ----------------------------- |
| **Express.js** | ^4.18.2 | Web framework                 |
| **TypeScript** | ^5.3.3  | Type safety                   |
| **CORS**       | ^2.8.5  | Cross-origin resource sharing |
| **ts-node**    | ^10.9.2 | TypeScript execution          |
| **nodemon**    | ^3.0.2  | Development auto-reload       |

### Development Tools

- **ESLint**: Code linting
- **TypeScript ESLint**: TypeScript-specific linting rules
- **Vite Plugin React**: React Fast Refresh support

---

## 📝 Additional Notes

### Demo Credentials

- **Admin**: `admin` / `admin123` (Full access)
- **Fleet Manager**: `manager` / `manager123` (View and edit, no delete)
- **Driver**: `driver` / `driver123` (Read-only access to assigned vehicles)
---

**Last Updated**: December 2024
