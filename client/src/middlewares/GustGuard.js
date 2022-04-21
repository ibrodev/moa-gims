import { Navigate, Outlet, useNavigate } from "react-router-dom";
import useAuth from "../hooks/useAuth";

function GustGuard() {
  const { auth } = useAuth();

  return auth?.token ? <Navigate to="/" replace /> : <Outlet />;
}

export default GustGuard;
