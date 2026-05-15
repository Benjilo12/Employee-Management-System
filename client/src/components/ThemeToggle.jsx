// src/components/ThemeToggle.jsx
import { useTheme } from "../hooks/useTheme";
import { Sun, Moon } from "lucide-react";

export function ThemeToggle() {
  const { isDark, toggleTheme } = useTheme();

  return (
    <button
      onClick={toggleTheme}
      className="relative group p-2 rounded-full cursor-pointer
                 bg-gray-200 dark:bg-gray-800
                 hover:bg-gray-300 dark:hover:bg-gray-700
                 transition-all duration-300 ease-out
                 hover:shadow-lg dark:hover:shadow-purple-500/20
                 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:ring-offset-2
                 dark:focus:ring-offset-gray-900"
      aria-label={isDark ? "Switch to light mode" : "Switch to dark mode"}
    >
      <div className="relative w-5 h-5">
        <Sun
          size={20}
          className={`absolute inset-0 transition-all duration-500 transform
                     text-yellow-500
                     ${
                       isDark
                         ? "rotate-90 scale-0 opacity-0"
                         : "rotate-0 scale-100 opacity-100"
                     }`}
        />
        <Moon
          size={20}
          className={`absolute inset-0 transition-all duration-500 transform
                     text-indigo-400
                     ${
                       isDark
                         ? "rotate-0 scale-100 opacity-100"
                         : "-rotate-90 scale-0 opacity-0"
                     }`}
        />
      </div>

      {/* Glow effect on hover */}
      <span
        className="absolute inset-0 rounded-full opacity-0 group-hover:opacity-100
                       transition-opacity duration-300
                       bg-linear-to-r from-yellow-400 to-orange-500 dark:from-purple-500 dark:to-indigo-500
                       blur-md -z-10"
      />
    </button>
  );
}
