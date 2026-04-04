"use client";

import { createContext, useContext, useState, useEffect } from "react";
import { darkTheme, lightTheme } from "@/lib/theme";
import type { ThemeMode, ThemeTokens } from "@/lib/theme";

interface ThemeContextValue {
  mode: ThemeMode;
  theme: ThemeTokens;
  toggle: () => void;
}

const ThemeContext = createContext<ThemeContextValue>({
  mode: "dark",
  theme: darkTheme,
  toggle: () => {},
});

export function ThemeProvider({ children }: { children: React.ReactNode }) {
  const [mode, setMode] = useState<ThemeMode>("dark");

  useEffect(() => {
    const saved = localStorage.getItem("clinic-theme") as ThemeMode | null;
    if (saved === "light" || saved === "dark") setMode(saved);
  }, []);

  const toggle = () => {
    setMode((prev) => {
      const next = prev === "dark" ? "light" : "dark";
      localStorage.setItem("clinic-theme", next);
      return next;
    });
  };

  return (
    <ThemeContext.Provider value={{ mode, theme: mode === "dark" ? darkTheme : lightTheme, toggle }}>
      {children}
    </ThemeContext.Provider>
  );
}

export function useTheme() {
  return useContext(ThemeContext);
}
