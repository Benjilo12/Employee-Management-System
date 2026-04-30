import { Outlet } from "react-router-dom";
import { Sidebar } from "../components/Sidebar";

const Layout = () => {
  return (
    <div className="flex h-screen bg-linear-to-br from-slate-50 via-white to-indigo-50/30 text-slate-900 dark:from-slate-950 dark:via-slate-900 dark:to-slate-950 dark:text-slate-100">
      <Sidebar />
      <main className="flex-1 overflow-y-auto ">
        <div className="p-4 pt-16 sm:p-6 sm:pt-6 lg:p-8 max-w-400 mx-auto">
          <Outlet />
        </div>
      </main>
    </div>
  );
};

export default Layout;
