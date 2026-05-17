import {
  CalendarIcon,
  FileTextIcon,
  DollarSignIcon,
  ArrowRightIcon,
} from "lucide-react";
import { Link } from "react-router-dom";
import NotificationDropdown from "./NotificationDropdown";

const EmpolyeeDashboard = ({ data }) => {
  const emp = data.employee;
  const cards = [
    {
      icon: CalendarIcon,
      value: data.currentMothAttendenace,
      title: "Days Present",
      subtitle: "This month",
    },
    {
      icon: FileTextIcon,
      value: data.pendingLeaves,
      title: "Pending Leaves",
      subtitle: "Awaiting Approval",
    },
    {
      icon: DollarSignIcon,
      value: data.latestPayslip
        ? `${data.latestPayslip.netSalary?.toLocaleString()}`
        : "N/A",
      title: "Latest Payslip",
      subtitle: "Most recent payout",
    },
  ];
  return (
    <div className="aniamte-fade-in">
      <div className="page-header flex items-start justify-between gap-4">
        <div>
          <h1 className="page-title">
            Welcome, {emp?.firstName} {emp?.lastName}!
          </h1>
          <p className="page-subtitle">
            {emp?.position} - {emp?.department || "No Department"}
          </p>
        </div>
        <NotificationDropdown />
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 sm:gap-5 mb-8">
        {cards.map((card, index) => (
          <div
            key={index}
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
              <p className="text-sm font-semibold text-slate-500 uppercase tracking-wider">
                {card.title}
              </p>
              <p className="text-3xl font-bold text-slate-900 tracking-tight dark:text-slate-100">
                {card.value}
              </p>
            </div>

            {/* Icon Wrapper */}
            <div className="relative">
              <div className="absolute inset-0 scale-150 blur-2xl bg-indigo-500/0 group-hover:bg-indigo-500/10 transition-all duration-500 rounded-full" />

              <card.icon
                className="relative z-10 size-12 p-3 rounded-xl bg-slate-50 
                   text-slate-600 group-hover:bg-indigo-500 group-hover:text-white 
                   transition-all duration-300 transform group-hover:scale-110 group-hover:rotate-3
                   dark:bg-slate-700 dark:text-slate-200"
              />
            </div>
          </div>
        ))}
      </div>
      <div className="flex flex=col sm:flex-row gap-3">
        <Link
          to="/attendance"
          className="btn-primary text-center inline-flex items-center justify-center gap-2"
        >
          Mark Attendance <ArrowRightIcon className="w-4 h-4" />
        </Link>
        <Link
          to="/leave"
          className="btn-primary text-center inline-flex items-center justify-center gap-2"
        >
          Apply for Leave <ArrowRightIcon className="w-4 h-4" />
        </Link>
      </div>
    </div>
  );
};

export default EmpolyeeDashboard;
