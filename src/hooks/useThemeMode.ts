import React, {
  createContext,
  useContext,
  useEffect,
  useMemo,
  useState,
} from "react";

interface ThemeModeContextProps {
  mode: "light" | "dark";
  toggleMode: () => void;
}

const ThemeModeContext = createContext<ThemeModeContextProps | undefined>(
  undefined
);

export const ThemeModeProvider = ({
  children,
}: {
  children: React.ReactNode;
}) => {
  const [mode, setMode] = useState<"light" | "dark">(() => {
    if (typeof window !== "undefined") {
      return (localStorage.getItem("themeMode") as "light" | "dark") || "dark";
    }
    return "dark";
  });

  useEffect(() => {
    localStorage.setItem("themeMode", mode);
  }, [mode]);

  const toggleMode = () => {
    setMode((prev) => (prev === "light" ? "dark" : "light"));
  };

  const value = useMemo(() => ({ mode, toggleMode }), [mode]);

  return React.createElement(ThemeModeContext.Provider, { value }, children);
};

export const useThemeMode = () => {
  const context = useContext(ThemeModeContext);
  if (!context) {
    throw new Error("useThemeMode must be used within a ThemeModeProvider");
  }
  return context;
};
