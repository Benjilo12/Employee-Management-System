import { BuildingIcon, CalendarIcon, FileTextIcon } from "lucide-react";
import { getNotifications } from "../utils/notifications";

const AdminDashboard = ({ data }) => {
  const notifications = getNotifications();
  const stats = [
    {
      icon: CalendarIcon,
      value: data.totalEmployees,
      label: "Toatal Employees",
      description: "Active workforec",
    },
    {
      icon: BuildingIcon,
      value: data.totalDepartments,
      label: " Departments",
      description: "Organizational units",
    },
    {
      icon: CalendarIcon,
      value: data.totalAttendance,
      label: "Days Present",
      description: "Ckecked in today",
    },
    {
      icon: FileTextIcon,
      value: data.pendingLeaves,
      label: "Pending Leaves",
      description: "Awaiting approval",
    },
  ];
  return (
    <div className="aniamte-fade-in">
      <div className="page-header">
        <h1 className="page-title dark:text-white">Dashboard</h1>
        <p className="page-subtitle">
          Welcome to the admin dashboard! Here you can manage employees,
          departments,
        </p>
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-5 mb-8 lg:grid-cols-4">
        {stats.map((stat) => (
          <div
            key={stat.label}
            className="relative group p-6 rounded-2xl border border-slate-200 
               bg-white shadow-sm hover:shadow-xl hover:shadow-indigo-500/10 
               transition-all duration-300 overflow-hidden flex items-center justify-between
               dark:border-slate-600 dark:bg-slate-800 dark:hover:shadow-slate-900/40"
          >
            {/* Decorative Left Accent Bar */}
            <div
              className="absolute left-0 top-0 bottom-0 w-1 bg-slate-100 
                    group-hover:bg-indigo-500 transition-colors duration-300
                    dark:bg-slate-700"
            />

            {/* Text Content */}
            <div className="space-y-1">
              <p className="text-sm font-semibold text-slate-500 dark:text-lime-500 uppercase tracking-wider">
                {stat.label}
              </p>
              <p className="text-3xl font-bold text-slate-900 tracking-tight dark:text-slate-100">
                {stat.value}
              </p>
            </div>

            {/* Icon Wrapper */}
            <div className="relative">
              <div className="absolute inset-0 scale-150 blur-2xl bg-indigo-500/0 group-hover:bg-indigo-500/10 transition-all duration-500 rounded-full" />

              <stat.icon
                className="relative z-10 size-12 p-3 rounded-xl bg-slate-50 
                   text-slate-600 group-hover:bg-indigo-500 group-hover:text-white 
                   transition-all duration-300 transform group-hover:scale-110 group-hover:rotate-3
                   dark:bg-slate-700 dark:text-slate-200"
              />
            </div>
          </div>
        ))}
      </div>

      <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm dark:border-slate-600 dark:bg-slate-800">
        <h2 className="mb-3 text-lg font-semibold text-slate-900 dark:text-slate-100">
          Notifications
        </h2>
        {notifications.length === 0 ? (
          <p className="text-sm text-slate-500 dark:text-slate-300">
            No notifications sent yet.
          </p>
        ) : (
          <div className="space-y-3">
            {notifications.slice(0, 4).map((item) => (
              <div
                key={item.id}
                className="rounded-lg border border-slate-200 p-3 dark:border-slate-700"
              >
                <p className="font-medium text-slate-900 dark:text-slate-100">
                  {item.title}
                </p>
                <p className="text-sm text-slate-600 dark:text-slate-300">
                  {item.message}
                </p>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default AdminDashboard;
