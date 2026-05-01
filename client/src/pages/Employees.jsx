import { useState, useEffect } from "react";
import { dummyEmployeeData, DEPARTMENTS } from "../assets/assets";
import { useCallback } from "react";
import { PlusIcon, Search, X } from "lucide-react";
import EmpolyeeCard from "../components/EmpolyeeCard";
import EmployeeForm from "../components/EmployeeForm";

const Employees = () => {
  const [employees, setEmployees] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [selectedDepartment, setSelectedDepartment] = useState("");
  const [editEmployee, setEditEmployee] = useState(null);
  const [showCreateModal, setShowCreateModal] = useState(false);

  // Simulate fetching employees from an API
  const fetchEmployess = useCallback(async () => {
    setLoading(true);
    setEmployees(
      dummyEmployeeData.filter((emp) =>
        selectedDepartment ? emp.department === selectedDepartment : emp,
      ),
    );
    setTimeout(() => {
      setLoading(false);
    }, 1000);
  }, []);

  // Fetch employees on component mount
  useEffect(() => {
    fetchEmployess();
  }, []);

  const filtered = employees.filter((emp) =>
    `${emp.firstName} ${emp.lastName}`
      .toLowerCase()
      .includes(search.toLowerCase()),
  );

  return (
    <div className="animate-fade-in">
      {/* header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-8">
        <div>
          <h1>Employees</h1>
          <p>Manage your team members and their information.</p>
        </div>
        <button
          className="btn-primary flex items-center gap-2 w-full sm:w-auto justify-center cursor-pointer dark:bg-cyan-600-500 dark:hover:bg-cyan-600 dark:text-white"
          onClick={() => setShowCreateModal(true)}
        >
          <PlusIcon size={16} /> Add Employee
        </button>
      </div>

      {/* search bar */}
      <div className="flex flex-col sm:flex-row gap-3 mb-6">
        <div className="relative flex-1">
          <Search className="absolute left-3.5 top-1/2 transform -translate-y-1/2 w-4 h-4 text-slate-400 dark:text-slate-500" />
          <input
            type="text"
            placeholder="Search employees..."
            className="w-full pl-10 bg-white text-slate-900 border-slate-200 placeholder:text-slate-400 dark:bg-slate-900 dark:text-slate-100 dark:border-slate-700 dark:placeholder:text-slate-500"
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>
        <select
          value={selectedDepartment}
          onChange={(e) => setSelectedDepartment(e.target.value)}
          className="max-w-40 bg-white text-slate-900 border-slate-200 dark:bg-slate-900 dark:text-slate-100 dark:border-slate-700"
        >
          <option value="">All Departments</option>
          {DEPARTMENTS.map((dept) => (
            <option key={dept} value={dept}>
              {dept}
            </option>
          ))}
        </select>
      </div>

      {/* employee cards */}
      <div>
        {loading ? (
          <div flex justify-center p-12>
            <div
              className=" className="
              animate-spin
              h-8
              w-8
              border-2
              border-indigo-600
              dark:border-lime-400
              border-t-transparent
              rounded-full
            />
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 sm:gap-5">
            {filtered.length === 0 ? (
              <p className="col-span-full text-center py-16 text-slate-400 bg-white rounded-2xl border border-dashed border-slate-200">
                No employees found.
              </p>
            ) : (
              filtered.map((emp) => (
                <EmpolyeeCard
                  key={emp.id}
                  employee={emp}
                  onDelete={fetchEmployess}
                  onEdit={(e) => setEditEmployee(e)}
                />
              ))
            )}
          </div>
        )}
      </div>

      {/* Create modals would go here */}
      {showCreateModal && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center pt-10 p-4 bg-black/40 backdrop-blur-sm overflow-auto"
          onClick={() => setShowCreateModal(false)}
        >
          <div
            className="relative bg-white dark:bg-slate-900 rounded-2xl shadow-2xl w-full max-w-3xl animate-fade-in mb-auto border border-slate-200 dark:border-slate-700"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Modal header */}
            <div className="flex items-center justify-between p-6 pb-0">
              <div>
                <h2 className="text-lg font-semibold text-slate-900 dark:text-slate-100">
                  Add New Employee
                </h2>
                <p className="text-sm text-slate-500 dark:text-slate-400 mt-0.5">
                  Create a user account for a new employee.
                </p>
              </div>
              <button
                className="p-2 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors text-slate-400 hover:text-slate-600 dark:text-slate-500 dark:hover:text-slate-200 cursor-pointer"
                onClick={() => setShowCreateModal(false)}
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Modal body */}
            <div className="p-6">
              <EmployeeForm
                onSuccess={() => {
                  showCreateModal(false);
                  fetchEmployess();
                }}
                onCancel={() => setShowCreateModal(false)}
              />
            </div>
          </div>
        </div>
      )}

      {/* Edit modals would go here */}
      {editEmployee && (
        <div
          className="fixed inset-0 z-50 flex items-start justify-center p-4 overflow-y-auto bg-black/40 backdrop-blur-sm"
          onClick={() => setEditEmployee(null)}
        >
          <div
            className="relative bg-white dark:bg-slate-900 rounded-2xl shadow-2xl w-full max-w-3xl my-8 animate-fade-in border border-slate-200 dark:border-slate-700"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Header */}
            <div className="flex items-center justify-between p-6 pb-0">
              {/* Left — title */}
              <div>
                <h2 className="text-lg font-semibold text-slate-900 dark:text-slate-100">
                  Edit Employee
                </h2>
                <p className="text-sm text-slate-500 dark:text-slate-400 mt-0.5">
                  Update the details for this employee.
                </p>
              </div>

              {/* Right — X button ✅ */}
              <button
                className="p-2 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors text-slate-400 hover:text-slate-600 dark:text-slate-500 dark:hover:text-slate-200 cursor-pointer"
                onClick={() => setEditEmployee(null)}
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Body */}
            <div className="p-6">
              <EmployeeForm
                initialData={editEmployee}
                onSuccess={() => {
                  setEditEmployee(null);
                  fetchEmployess();
                }}
                onCancel={() => setEditEmployee(null)}
              />
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Employees;
