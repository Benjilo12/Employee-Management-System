import { useState, useEffect } from "react";
import { dummyEmployeeData, DEPARTMENTS } from "../assets/assets";
import { useCallback } from "react";
import { PlusIcon, Search } from "lucide-react";

const Employees = () => {
  const [employees, setEmployees] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [selectedDepartment, setSelectedDepartment] = useState("");

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
        <button className="btn-primary flex items-center gap-2 w-full sm:w-auto justify-center cursor-pointer dark:bg-cyan-600-500 dark:hover:bg-cyan-600 dark:text-white">
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
              filtered.map((emp) => <p key={emp.id}>{emp.firstName}</p>)
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default Employees;
