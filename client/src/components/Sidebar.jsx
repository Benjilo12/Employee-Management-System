import { useState, useEffect } from "react";
import { Link, useLocation } from "react-router-dom";
import { dummyProfileData } from "../assets/assets";
import {
  CalendarIcon,
  BellIcon,
  FileTextIcon,
  LayoutGridIcon,
  MenuIcon,
  UserIcon,
  XIcon,
  DollarSignIcon,
  SettingsIcon,
  ChevronRightIcon,
  LogOutIcon,
  Loader2,
} from "lucide-react";
import { ThemeToggle } from "./ThemeToggle";
import { useAuth } from "../context/authContext";
import api from "../api/axios";

export const Sidebar = () => {
  const { pathname } = useLocation();
  const [userName, setUserName] = useState("");
  const [mobileOpen, setMobileOpen] = useState(false);

  const { user, loading, logout } = useAuth();

  useEffect(() => {
    // Replace with actual user fetching logic
    api.get("/profile").then(({ data }) => {
      if (data.firstName)
        setUserName(`${data.firstName} ${data.lastName || ""}`.trim());
    });
  }, []);
  useEffect(() => {
    setMobileOpen(false); // Replace with actual user fetching logic
  }, [pathname]);

  const role = user?.role;

  const navItems = [
    { name: "Dashboard", href: "/dashboard", icon: LayoutGridIcon },
    role === "ADMIN"
      ? { name: "Employees", href: "/employees", icon: UserIcon }
      : { name: "Attendance", href: "/attendance", icon: CalendarIcon },
    { name: "Leave", href: "/leave", icon: FileTextIcon },
    { name: "PaySlips", href: "/payslips", icon: DollarSignIcon },
    ...(role === "ADMIN"
      ? [
          {
            name: "Notifications",
            href: "/admin-notifications",
            icon: BellIcon,
          },
        ]
      : []),
    { name: "Settings", href: "/settings", icon: SettingsIcon },
  ];

  // Handle logout functionality
  const handleLogout = () => {
    logout();
    window.location.href = "/";
  };

  const sidebarContent = (
    <>
      <>
        {/* Brand header */}
        <div className="px-5 pt-6 border-b border-white/6">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <UserIcon className="text-white size-7" />
              <div>
                <p className="font-semibold text-[13px] text-white tracking-wide">
                  Employee MS
                </p>
                <p className="text-[11px] text-slate-500 font-medium">
                  Management System
                </p>
              </div>
            </div>
            {/* // Close Menu on mobile */}
            <button
              className="lg:hidden text-slate-400 hover:text-white p-1"
              onClick={() => setMobileOpen(false)}
            >
              <XIcon size={20} />
            </button>
          </div>
        </div>

        {/* User profile card */}
        {userName && (
          <div className="mx-3 mt-4 mb-1 p-3 rounded-lg bg-white/3 border border-white/4">
            <div className="flex items-center gap-3">
              <div className=" w-9 h-9 rounded-lg bg-slate-800 flex items-center justify-center ring-1 ring-white/10 shrink-0">
                <span className="text-slate-500 text-xs">
                  {userName.charAt(0).toUpperCase()}
                </span>
              </div>
              <div className="min-w-0">
                <p className="text-[13px] font-medium text-slate-200 truncate">
                  {userName}
                </p>
                <p className="text-[11px] text-slate-500 truncate">
                  {role === "ADMIN" ? "Administrator" : "Employee"}
                </p>
              </div>
            </div>
          </div>
        )}

        {/* section label */}
        <div className="px-5 pt-5 pb-2">
          <p className="text-[10px] font-semibold uppercase tracking-[0.12em] text-slate-500">
            Navigation
          </p>
        </div>

        {/* Navigation List */}
        <div className="flex-1 px-3 space-y-0.5 overflow-y-auto">
          {loading ? (
            <div>
              <Loader2 className="animate-spin w-4 h-4" />
              <span className="text-sm">Loading...</span>
            </div>
          ) : (
            navItems.map((item) => {
              const isActive = pathname.startsWith(item.href);
              return (
                <Link
                  key={item.href}
                  to={item.href}
                  className={`group relative flex items-center gap-5 px-3 py-5.5 rounded-lg text-sm transition-all duration-200
          ${
            isActive
              ? "bg-indigo-500/10 text-white"
              : "text-slate-400 hover:bg-white/5 hover:text-slate-200"
          }`}
                >
                  {/* Active indicator bar */}
                  {isActive && (
                    <div className="absolute left-0 top-1/2 -translate-y-1/2 w-0.5 h-5 rounded-r-full bg-indigo-500" />
                  )}

                  {/* Icon */}
                  <item.icon
                    className={`w-4 h-4 shrink-0 ${
                      isActive
                        ? "text-indigo-400"
                        : "text-slate-400 group-hover:text-slate-300"
                    }`}
                  />

                  {/* Label */}
                  <span className="flex-1 font-medium">{item.name}</span>

                  {/* Chevron */}
                  {isActive && (
                    <ChevronRightIcon className="w-3.5 h-3.5 text-indigo-500/50" />
                  )}
                </Link>
              );
            })
          )}
        </div>

        {/* Theme and logout actions */}
        <div className="p-3 border-t border-white/6 space-y-2">
          <div className="flex items-center justify-between px-2 py-1">
            <span className="text-[12px] font-medium text-slate-400">
              Theme
            </span>
            <ThemeToggle />
          </div>
          <button
            className="flex items-center gap-3 w-full px-3 py-2.5 rounded-md text-[13px] font-medium text-slate-400 hover:bg-white/5 hover:text-slate-200 duration-150 transition-all cursor-pointer"
            onClick={handleLogout}
          >
            <LogOutIcon className="w-4 h-4" />
            <span>Log out</span>
          </button>
        </div>
      </>
    </>
  );
  return (
    <>
      {/* //Mobile hamburger menu */}
      <button
        onClick={() => setMobileOpen(true)}
        className="lg:hidden fixed top-4 left-4 z-50 p-2 bg-slate-900 text-white rounded-lg shadow-lg border border-white/10"
      >
        <MenuIcon size={20} />
      </button>

      {/* Mobile sidebar overlay */}
      {mobileOpen && (
        <div
          className="lg:hidden fixed inset-0 bg-black/60 backdrop-blur-sm z-40"
          onClick={() => setMobileOpen(false)}
        />
      )}

      {/* Sidebar desktop */}
      <aside className="hidden lg:flex flex-col h-full w-62.5 bg-linear-to-b from-slate-900 via-slate-900 to-slate-950 text-white shrink-0 border-r border-white/4">
        {sidebarContent}
      </aside>

      {/* Sidebar mobile */}
      <aside
        className={`lg:hidden fixed inset-y-0 left-0 w-72 bg-linear-to-b from-slate-900 via-slate-900 to-slate-950 text-white z-50 flex flex-col transform transition-transform duration-300 ${mobileOpen ? "translate-x-0" : "-translate-x-full"}`}
      >
        {sidebarContent}
      </aside>
    </>
  );
};
