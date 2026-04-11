import { Navigate, useLocation } from "react-router-dom";
import { useAuth } from "./AuthContext";

type Role = "ADMIN" | "COMMANDER" | "MEDIC";

type Props = {
  children: JSX.Element;
  allowedRoles?: Role[]; // optional (important improvement)
};

export default function ProtectedRoute({ children, allowedRoles }: Props) {
  const { token, role } = useAuth();
  const location = useLocation();

  /*
  ====================================
  1. Not Logged In → Go to Login
  ====================================
  */
  if (!token) {
    return <Navigate to="/login" replace state={{ from: location }} />;
  }

  /*
  ====================================
  2. Role-Based Protection (Optional)
  ====================================
  */
  if (allowedRoles && allowedRoles.length > 0) {
    if (!role || !allowedRoles.includes(role)) {
      return <Navigate to="/unauthorized" replace />;
    }
  }

  /*
  ====================================
  3. Allow Access
  ====================================
  */
  return children;
}