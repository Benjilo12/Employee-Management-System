import { format } from "date-fns";
import { Download } from "lucide-react";

const PayslipList = ({ payslips, isAdmin }) => {
  return (
    <div className="card overflow-hidden">
      <div className="overflow-x-auto">
        <table className="table-modern">
          <thead>
            <tr>
              {isAdmin && <th>Employee</th>}
              <th>Period</th>
              <th>Basic Salary</th>
              <th>Net Salary</th>

              <th className="text-center">Actions</th>
            </tr>
          </thead>
          <tbody>
            {payslips.length === 0 ? (
              <tr>
                <td
                  colSpan={isAdmin ? 5 : 4}
                  className="text-center py-12 text-slate-400 dark:text-slate-500"
                >
                  No payslips found.
                </td>
              </tr>
            ) : (
              payslips.map((payslip) => (
                <tr key={payslip._id || payslip.id}>
                  {isAdmin && (
                    <td className="text-slate-900 dark:text-slate-100">
                      {payslip.employee?.firstName} {payslip.employee?.lastName}
                    </td>
                  )}

                  <td className="text-slate-500">
                    {format(
                      new Date(payslip.year, payslip.month - 1),
                      "MMMM yyyy",
                    )}
                  </td>

                  <td className="text-xs text-slate-500 dark:text-slate-300">
                    ${payslip.basicSalary?.toLocaleString()}
                  </td>
                  <td className="text-xs font-medium text-slate-800 dark:text-slate-500">
                    ${payslip.netSalary?.toLocaleString()}
                  </td>

                  <td className="text-center text-slate-600 dark:text-slate-300">
                    <button
                      className="inline-flex items-center gap-2 px-3 py-1.5 text-xs font-medium rounded-lg text-blue-600 bg-blue-50 hover:bg-blue-100 transition-colors ring-1 ring-blue-600/10 cursor-pointer"
                      onClick={() =>
                        window.open(
                          `/print/payslip/${payslip._id || payslip.id}`,
                        )
                      }
                    >
                      <Download className="w-3.5 h-3.5" />
                      <span>Download</span>
                    </button>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default PayslipList;
