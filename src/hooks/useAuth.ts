import { useState, useEffect } from "react";

export function useAuth() {
  const [auth, setAuth] = useState<any>(null);

  useEffect(() => {
    const getAuth = () => {
      const stored = localStorage.getItem("token");
      setAuth(stored ? JSON.parse(stored) : null);
    };

    getAuth();

    // Listen for storage changes (cross-tab and same-tab)
    window.addEventListener("storage", getAuth);

    // Listen for manual changes in the same tab (e.g., after login)
    window.addEventListener("authChanged", getAuth);

    return () => {
      window.removeEventListener("storage", getAuth);
      window.removeEventListener("authChanged", getAuth);
    };
  }, []);

  return auth;
}
