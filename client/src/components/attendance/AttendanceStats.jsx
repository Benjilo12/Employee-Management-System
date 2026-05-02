import { CalendarIcon, ClockIcon, AlertCircleIcon } from "lucide-react";

const AttendanceStatsjsx = ({ history }) => {
  const totalPresent = history.filter(
    (h) => (h.status === "PRESENT") | (h.status === "LATE"),
  ).length;

  const totalLate = history.filter((h) => h.status === "LATE").length;
  const stats = [
    { label: "Days Present", value: totalPresent, icon: CalendarIcon },
     { label: "Late Arrivals", value: totalLate, icon: AlertCircleIcon },
    { label: "Avg. Wor Hrs", value: "8.5 Hrs", icon: ClockIcon },
  ];
  return (
    <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 sm:gap-5 mb-8">
      {stats.map((s) => (
        <div
          key={s.label}
          className="relative group p-6 rounded-2xl border border-slate-200 bg-white shadow-sm hover:shadow-xl hover:shadow-indigo-500/10 transition-all duration-300 overflow-hidden flex items-center justify-between dark:border-slate-600 dark:bg-slate-800 dark:hover:shadow-slate-900/40"
        >
          <div className="absolute left-0 top-0 bottom-0 w-1 bg-slate-100 group-hover:bg-indigo-500 transition-colors duration-300 dark:bg-slate-700" />
          <div className="space-y-1">
            <p className="text-sm font-semibold text-slate-500 uppercase tracking-wider dark:text-slate-400">
              {s.label}
            </p>
            <p className="text-3xl font-bold text-slate-900 tracking-tight dark:text-slate-100">
              {s.value}
            </p>
          </div>
          <div className="relative">
            <div className="absolute inset-0 scale-150 blur-2xl bg-indigo-500/0 group-hover:bg-indigo-500/10 transition-all duration-500 rounded-full" />
            <s.icon className="relative z-10 size-12 p-3 rounded-xl bg-slate-50 text-slate-600 group-hover:bg-indigo-500 group-hover:text-white transition-all duration-300 transform group-hover:scale-110 group-hover:rotate-3 dark:bg-slate-700 dark:text-slate-200" />
          </div>
        </div>
      ))}
    </div>
  );
};

export default AttendanceStatsjsx;
