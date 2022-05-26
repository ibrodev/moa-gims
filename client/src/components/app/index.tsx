import { Routes, Route } from "react-router-dom";
import { AuthProvider } from "../../contexts/AuthProvider";
import AuthGuard from "../../middlewares/AuthGuard";

// Page Components
import Login from "../pages/login";
import Dashboard from "../pages/dashboard";
import PersistAuth from "../../middlewares/PersistAuth";
import AppLayout from "../layouts/app";
import AllUsers from "../pages/users/AllUsers";
import Positions from "../pages/positions/Positions";
import Employees from "../pages/employees/Employees";
import Departments from "../pages/departments/Departments";
import Vehicles from "../pages/vehicles/Vehicles";
import Drivers from "../pages/drivers/Drivers";
import ServiceRequests from "../pages/service-requests/ServiceRequests";
import WorkOrders from "../pages/work-orders/WorkOrders";
import ViewWorkOrder from "../pages/work-orders/ViewWorkOrder";
import PrintLayout from "../layouts/print";
import PrintWorkOrder from "../pages/work-orders/PrintWorkOrder";
import PrintSparePartListing from "../pages/work-orders/PrintSparePartListing";
import ViewServiceRequest from "../pages/service-requests/ViewServiceRequest";

function App() {
  return (
    <AuthProvider>
      <Routes>
        <Route element={<PersistAuth />}>
          <Route element={<AuthGuard />}>
            <Route path="/" element={<AppLayout />}>
              <Route index element={<Dashboard />} />
              <Route path="users" element={<AllUsers />} />
              <Route path="positions" element={<Positions />} />
              <Route path="employees" element={<Employees />} />
              <Route path="departments" element={<Departments />} />
              <Route path="service-requests" element={<ServiceRequests />} />
              <Route
                path="service-requests/:id"
                element={<ViewServiceRequest />}
              />
              <Route path="work-orders" element={<WorkOrders />} />
              <Route path="work-orders/:id" element={<ViewWorkOrder />} />
              <Route path="vehicles" element={<Vehicles />} />
              <Route path="drivers" element={<Drivers />} />
            </Route>
            <Route path="print" element={<PrintLayout />}>
              <Route path="work-order/:id" element={<PrintWorkOrder />} />
              <Route
                path="spare-part-listing/:id"
                element={<PrintSparePartListing />}
              />
            </Route>
          </Route>
        </Route>
        <Route path="/login" element={<Login />} />
      </Routes>
    </AuthProvider>
  );
}

export default App;
