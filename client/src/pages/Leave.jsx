import { useState, useEffect, useCallback } from "react";
import { dummyLeaveData } from "../assets/assets";
import Loading from "../components/Loading";
import {
  PalmtreeIcon,
  PlusIcon,
  ThermometerIcon,
  UmbrellaIcon,
} from "lucide-react";
import LeaveHistory from "../components/leave/LeaveHistory";

const Leave = () => {
  const [leaves, setLeaves] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [isDeleted, setIsDeleted] = useState(false);
  const isAdmin = true; // Replace with actual role checking logic

  const fetchLeaves = useCallback(() => {
    setLeaves(dummyLeaveData);
    setTimeout(() => {
      setLoading(false);
    }, 1000);
  }, []);

  useEffect(() => {
    fetchLeaves();
  }, [fetchLeaves]);

  if (loading) return <Loading />;

  const approvedLeaves = leaves.filter((l) => l.status === "APPROVED");
  const sickCount = approvedLeaves.filter((l) => l.type === "SICK").length;
  const casualCount = approvedLeaves.filter((l) => l.type === "CASUAL").length;
  const annualCount = approvedLeaves.filter((l) => l.type === "ANNUAL").length;

  const leaveStats = [
    { label: "Sick Leaves", value: sickCount, icon: ThermometerIcon },
    { label: "Casual Leaves", value: casualCount, icon: UmbrellaIcon },
    { label: "Annual Leaves", value: annualCount, icon: PalmtreeIcon },
  ];
  return (
    <div className="animate-fade-in">
      <div className="page-header flex flex-col sm:flex-row justify-between items-center sm:items-center gap-4">
        <div>
          <h1 className="page-title">Leave Management</h1>
          <p className="page-subtitle">
            {isAdmin
              ? "Manage leave applications"
              : "View your leave history and requests"}
          </p>
        </div>
        {!isAdmin && !isDeleted && (
          <button
            onClick={() => setShowModal(true)}
            className="btn-primary flex items-center gap-2 w-full sm:w-auto justify-center cursor-pointer"
          >
            <PlusIcon className="w-4 h-4" /> Apply for Leave
          </button>
        )}
      </div>
      {!isAdmin && (
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 sm:gap-5 mb-8">
          {leaveStats.map((s) => (
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
                  {s.value}{" "}
                  <span className="text-sm font-normal text-slate-400 dark:text-slate-500">
                    taken
                  </span>
                </p>
              </div>
              <div className="relative">
                <div className="absolute inset-0 scale-150 blur-2xl bg-indigo-500/0 group-hover:bg-indigo-500/10 transition-all duration-500 rounded-full" />
                <s.icon className="relative z-10 size-12 p-3 rounded-xl bg-slate-50 text-slate-600 group-hover:bg-indigo-500 group-hover:text-white transition-all duration-300 transform group-hover:scale-110 group-hover:rotate-3 dark:bg-slate-700 dark:text-slate-200" />
              </div>
            </div>
          ))}
        </div>
      )}
      <LeaveHistory leaves={leaves} isAdmin={isAdmin} onUpdate={fetchLeaves} />
    </div>
  );
};

export default Leave;
