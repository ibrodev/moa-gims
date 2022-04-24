import { Routes, Route } from "react-router-dom";
import { AuthProvider } from "../../contexts/AuthProvider";
import AuthGuard from "../../middlewares/AuthGuard";

// Page Components
import Login from "../pages/login";
import Dashboard from "../pages/dashboard";
import PersistAuth from "../../middlewares/PersistAuth";
import AppLayout from "../layouts/app";
import AllUsers from "../pages/users/AllUsers";

function App() {
  return (
    <AuthProvider>
      <Routes>
        <Route element={<PersistAuth />}>
          <Route element={<AuthGuard />}>
            <Route element={<AppLayout />}>
              <Route index element={<Dashboard />} />
              <Route path="/users" element={<AllUsers />} />
            </Route>
          </Route>
        </Route>
        <Route path="/login" element={<Login />} />
      </Routes>
    </AuthProvider>
  );
}

export default App;
