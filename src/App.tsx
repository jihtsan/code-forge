import { useEffect, useState } from "react";
import { Navigate, Route, Routes } from "react-router-dom";
import { EnginePage } from "./pages/EnginePage";
import { PortalPage } from "./pages/PortalPage";

export interface AppProps {
  readonly className?: string;
}

const readInitialTheme = (): boolean => {
  try {
    return window.localStorage.getItem("code-forge-theme") === "dark";
  } catch {
    return false;
  }
};

export const App = ({ className = "" }: AppProps) => {
  const [darkMode, setDarkMode] = useState(readInitialTheme);

  useEffect(() => {
    document.documentElement.classList.toggle("dark", darkMode);
    document.documentElement.style.colorScheme = darkMode ? "dark" : "light";
    try {
      window.localStorage.setItem("code-forge-theme", darkMode ? "dark" : "light");
    } catch {
      // Private browsing can disable local storage; the in-memory preference still works.
    }
  }, [darkMode]);

  return (
    <div className={`app-root${className ? ` ${className}` : ""}`}>
      <Routes>
        <Route path="/" element={<PortalPage darkMode={darkMode} onToggleDarkMode={() => setDarkMode((value) => !value)} />} />
        <Route path="/engine" element={<EnginePage darkMode={darkMode} onToggleDarkMode={() => setDarkMode((value) => !value)} />} />
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </div>
  );
};

export default App;
