import { useNavigate } from "react-router-dom";
import { useState } from "react";
import { DEPARTMENTS } from "../assets/assets";
import { Loader2Icon } from "lucide-react";

const EmployeeForm = ({ initialData, onSuccess, onCancel }) => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const isEditMode = !!initialData;

  const handleSubmit = async (e) => {
    e.preventDefault();
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="space-y-6 max-w-3xl animate-fade-in"
    >
      {/* Personal Information */}
      <div className="card p-5 sm:p-6">
        <h3 className="font-medium mb-6 pb-4 border-b">Personal Information</h3>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-5 text-sm text-slate-700 dark:text-slate-300">
          <div>
            <label
              htmlFor="firstName"
              className="block mb-2 font-medium text-slate-700 dark:text-slate-100"
            >
              First Name
            </label>
            <input
              type="text"
              name="firstName"
              placeholder="John"
              required
              defaultValue={initialData?.firstName}
            />
          </div>
          <div>
            <label
              htmlFor="lastName"
              className="block mb-2 font-medium text-slate-700 dark:text-slate-100"
            >
              Last Name
            </label>
            <input
              type="text"
              name="lastName"
              placeholder="Doe"
              required
              defaultValue={initialData?.lastName}
            />
          </div>
          <div>
            <label
              htmlFor="phone"
              className="block mb-2 font-medium text-slate-700 dark:text-slate-100"
            >
              Phone Number
            </label>
            <input
              type="text"
              name="phone"
              placeholder="123-456-7890"
              required
              defaultValue={initialData?.phone}
            />
          </div>
          <div>
            <label
              htmlFor="joinDate"
              className="block mb-2 font-medium text-slate-700 dark:text-slate-100"
            >
              Join Date
            </label>
            <input
              type="date"
              name="joinDate"
              required
              defaultValue={
                initialData?.joinDate
                  ? new Date(initialData.joinDate).toISOString().split("T")[0]
                  : ""
              }
            />
          </div>
          <div>
            <label
              htmlFor="bio"
              className="block mb-2 font-medium text-slate-700 dark:text-slate-100"
            >
              Bio (Optional)
            </label>
            <input
              type="text"
              name="bio"
              placeholder="Tell us about yourself..."
              defaultValue={initialData?.bio}
              row={3}
            />
          </div>
        </div>
      </div>
      {/* Employee Details */}
      <div className=" card p-5 sm:p-6">
        <h3 className="text-base font-medium text-slate-700 dark:text-slate-100 mb-6 pb-4">
          Employee Details
        </h3>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-5 text-sm text-slate-700">
          <div>
            <label className="block mb-2 dark:text-slate-100">Department</label>
            <select
              name="department"
              required
              defaultValue={initialData?.department || ""}
            >
              <option value="">Select a department</option>
              {DEPARTMENTS.map((dept) => (
                <option key={dept} value={dept}>
                  {dept}
                </option>
              ))}
            </select>
          </div>
          <div>
            <label
              htmlFor="phone"
              className="block mb-2 font-medium text-slate-700 dark:text-slate-100"
            >
              Position
            </label>
            <input
              type="text"
              name="position"
              placeholder="Software Engineer"
              required
              defaultValue={initialData?.position}
            />
          </div>
          <div>
            <label
              htmlFor="phone"
              className="block mb-2 font-medium text-slate-700 dark:text-slate-100"
            >
              Basic Salary ($)
            </label>
            <input
              type="number"
              name="basicSalary"
              placeholder="50000"
              min={0}
              required
              step={0.01}
              defaultValue={initialData?.basicSalary || 0}
            />
          </div>
          <div>
            <label
              htmlFor="phone"
              className="block mb-2 font-medium text-slate-700 dark:text-slate-100"
            >
              Allowances ($)
            </label>
            <input
              type="number"
              name="allowances"
              placeholder="200"
              min={0}
              required
              step={0}
              defaultValue={initialData?.allowances || 0}
            />
          </div>
          <div>
            <label
              htmlFor="phone"
              className="block mb-2 font-medium text-slate-700 dark:text-slate-100"
            >
              Deductions ($)
            </label>
            <input
              type="number"
              name="deductions"
              placeholder="2000"
              min={0}
              required
              step={0}
              defaultValue={initialData?.deductions || 0}
            />
          </div>
          {isEditMode && (
            <div>
              <label
                htmlFor="phone"
                className="block mb-2 font-medium text-slate-700 dark:text-slate-100"
              >
                Status
              </label>
              <select
                name="employmentStatus"
                placeholder="Select employment status"
                className="block mb-2"
                required
                defaultValue={initialData?.employmentStatus || 0}
              >
                <option value="ACTIVE">Active</option>
                <option value="INACTIVE">Inactive</option>
              </select>
            </div>
          )}
        </div>
      </div>
      {/* Account setup */}
      <div className="card p-5 sm:p-6">
        <h3 className="text-base border-slate-100 border-b mb-6 pb-4">
          Account Setup
        </h3>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-5 text-sm text-slate-700 dark:text-slate-300">
          <div className="sm:col-span-2">
            <label
              htmlFor="email"
              className="block mb-2 font-medium text-slate-700 dark:text-slate-100"
            >
              Work Email
            </label>
            <input
              type="email"
              name="email"
              placeholder="john.doe@company.com"
              required
              defaultValue={initialData?.email}
            />
          </div>
          {!isEditMode && (
            <div>
              <label
                htmlFor="password"
                className="block mb-2 font-medium text-slate-700 dark:text-slate-100"
              >
                Temporary Password
              </label>
              <input
                type="password"
                name="password"
                placeholder="Create a temporary password"
                required
              />
            </div>
          )}
          {isEditMode && (
            <div>
              <label
                htmlFor="password"
                className="block mb-2 font-medium text-slate-700 dark:text-slate-100"
              >
                Change Password (optional)
              </label>
              <input
                type="password"
                name="password"
                placeholder="Enter new password to change"
                required
              />
            </div>
          )}
          <div>
            <label
              htmlFor="password"
              className="block mb-2 font-medium text-slate-700 dark:text-slate-100"
            >
              System Role
            </label>
            <select
              name="role"
              defaultValue={initialData?.user?.role || "EMPLOYEE"}
            >
              <option value="USER">Employee</option>
              <option value="ADMIN">Admin</option>
            </select>
          </div>
        </div>
      </div>
      {/* Action Buttons */}
      <div className="flex justify-end gap-3 pt-2 flex-col-reverse sm:flex-row">
        <button
          type="button"
          className="btn-secondary bg-red-400 cursor-pointer"
          onClick={onCancel ? onCancel : () => navigate(-1)}
        >
          Cancel
        </button>
        <button
          type="submit"
          className="btn-primary flex items-center justify-center cursor-pointer"
          disabled={loading}
        >
          {loading && <Loader2Icon className="animate-spin mr-2" />}
          {isEditMode ? "Update Employee" : "Create Employee"}
        </button>
      </div>
    </form>
  );
};

export default EmployeeForm;
