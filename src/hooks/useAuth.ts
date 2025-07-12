import { useState, useEffect } from "react";

export function useAuth() {
  const [accessToken, setAccessToken] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const getToken = () => {
      const token = localStorage.getItem("access_token");
      setAccessToken(token || null);
      setIsLoading(false);
    };

    getToken();

    window.addEventListener("storage", getToken);
    window.addEventListener("authChanged", getToken);

    return () => {
      window.removeEventListener("storage", getToken);
      window.removeEventListener("authChanged", getToken);
    };
  }, []);

  return { accessToken, isLoading };
}
