import { useState } from "react";
import { format } from "date-fns";
import { Check, Loader2, X } from "lucide-react";
import api from "../../api/axios";
import toast from "react-hot-toast";

const LeaveHistory = ({ leaves, isAdmin, onUpdate }) => {
  const [proccessing, setProcessing] = useState(null);

  const handleStatusUpdate = async (id, status) => {
    setProcessing(id);
    try {
      await api.post(`/leave/${id}`, { status });
      onUpdate();
    } catch (error) {
      toast.error(error?.response?.data?.error || error?.message);
    } finally {
      setProcessing(null);
    }
  };

  return (
    <div className="card overflow-hidden">
      <div className="overflow-x-auto">
        <table className="table-modern">
          <thead>
            <tr>
              {isAdmin && <th>Employee</th>}
              <th>Type</th>
              <th>Dates</th>
              <th>Reason</th>
              <th>Status</th>
              {isAdmin && <th className="text-center">Action</th>}
            </tr>
          </thead>
          <tbody>
            {leaves.length === 0 ? (
              <tr>
                <td
                  colSpan={isAdmin ? 6 : 4}
                  className="text-center py-12 text-slate-400 dark:text-slate-500"
                >
                  No leave records found.
                </td>
              </tr>
            ) : (
              leaves.map((leave) => (
                <tr key={leave._id || leave.id}>
                  {isAdmin && (
                    <td className="text-slate-900 dark:text-slate-100">
                      {leave.employee?.firstName} {leave.employee?.lastName}
                    </td>
                  )}

                  <td>
                    <span className="badge bg-slate-100 text-slate-600">
                      {leave.type}
                    </span>
                  </td>

                  <td className="text-xs text-slate-500 dark:text-slate-300">
                    {format(new Date(leave.startDate), "MMM dd")} —{" "}
                    {format(new Date(leave.endDate), "MMM dd, yyyy")}
                  </td>

                  <td
                    className="max-w-xs truncate text-slate-600 dark:text-slate-300"
                    title={leave.reason}
                  >
                    {leave.reason}
                  </td>

                  <td>
                    <span
                      className={`badge ${
                        leave.status === "APPROVED"
                          ? "badge-success"
                          : leave.status === "REJECTED"
                            ? "badge-danger"
                            : "badge-warning"
                      }`}
                    >
                      {leave.status}
                    </span>
                  </td>

                  {isAdmin && (
                    <td>
                      {/* ✅ Fixed — lowercase status */}
                      {leave.status === "PENDING" && (
                        <div className="flex justify-center gap-2">
                          {/* Approve button */}
                          <button
                            className="p-1.5 rounded-md bg-emerald-50 text-emerald-600 hover:bg-emerald-100 transition-colors"
                            onClick={() =>
                              handleStatusUpdate(
                                leave._id || leave.id,
                                "APPROVED",
                              )
                            }
                            disabled={!!proccessing}
                          >
                            {proccessing === (leave._id || leave.id) ? (
                              <Loader2 className="w-4 h-4 animate-spin" />
                            ) : (
                              <Check className="w-4 h-4" />
                            )}
                          </button>

                          {/* Reject button */}
                          <button
                            className="p-1.5 rounded-md bg-rose-50 text-rose-600 hover:bg-rose-100 transition-colors"
                            onClick={() =>
                              handleStatusUpdate(
                                leave._id || leave.id,
                                "REJECTED",
                              )
                            }
                            disabled={!!proccessing}
                          >
                            {proccessing === (leave._id || leave.id) ? (
                              <Loader2 className="w-4 h-4 animate-spin" />
                            ) : (
                              <X className="w-4 h-4" />
                            )}
                          </button>
                        </div>
                      )}
                    </td>
                  )}
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default LeaveHistory;
