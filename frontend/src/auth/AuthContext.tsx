import { createContext, useContext, useState, ReactNode, useEffect } from "react";

/*
====================================
Role Type (MATCH BACKEND EXACTLY)
====================================
*/
type Role = "ADMIN" | "COMMANDER" | "MEDIC" | null;

type AuthContextType = {
  token: string | null;
  role: Role;
  login: (token: string, role: Role) => void;
  logout: () => void;
};

/*
====================================
Context Creation
====================================
*/
const AuthContext = createContext<AuthContextType>({
  token: null,
  role: null,
  login: () => {},
  logout: () => {},
});

/*
====================================
Helper: Safe Role Parsing
====================================
*/
const getStoredRole = (): Role => {
  const role = localStorage.getItem("role");

  if (role === "ADMIN" || role === "COMMANDER" || role === "MEDIC") {
    return role;
  }

  return null;
};

/*
====================================
Auth Provider
====================================
*/
export function AuthProvider({ children }: { children: ReactNode }) {
  const [token, setToken] = useState<string | null>(localStorage.getItem("token"));
  const [role, setRole] = useState<Role>(getStoredRole());

  /*
  ====================================
  Login Function
  ====================================
  */
  const login = (token: string, role: Role) => {
    setToken(token);
    setRole(role);

    localStorage.setItem("token", token);

    if (role) {
      localStorage.setItem("role", role);
    }
  };

  /*
  ====================================
  Logout Function
  ====================================
  */
  const logout = () => {
    setToken(null);
    setRole(null);

    localStorage.removeItem("token");
    localStorage.removeItem("role");
  };

  /*
  ====================================
  Optional: Auto Logout if Token Missing
  ====================================
  */
  useEffect(() => {
    if (!token) {
      setRole(null);
    }
  }, [token]);

  return (
    <AuthContext.Provider value={{ token, role, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

/*
====================================
Custom Hook
====================================
*/
export const useAuth = () => useContext(AuthContext);