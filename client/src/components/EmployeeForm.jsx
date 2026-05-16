import { useNavigate } from "react-router-dom";
import { useState } from "react";
import { DEPARTMENTS } from "../assets/assets";
import { Loader2Icon } from "lucide-react";
import api from "../api/axios";
import toast from "react-hot-toast";

/**
 * EmployeeForm Component
 * A reusable form for creating new employees or editing existing employee details.
 * Supports both creation mode (new employee) and edit mode (update existing employee).
 *
 * Props:
 * - initialData: Optional object containing employee data for edit mode
 * - onSuccess: Optional callback function to execute after successful submission
 * - onCancel: Optional callback function for cancel button; defaults to navigate back
 */
const EmployeeForm = ({ initialData, onSuccess, onCancel }) => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  // Determines if form is in edit mode (true if initialData exists) or create mode (false)
  const isEditMode = !!initialData;

  /**
   * Handles form submission for both create and update operations
   * - In create mode: sends POST request with all form data including password
   */
  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    const formData = new FormData(e.currentTarget);

    // In edit mode, remove empty password field to avoid overwriting existing password
    if (isEditMode) {
      const pwd = formData.get("password");
      if (!pwd) formData.delete("password");
    }

    try {
      // Route and HTTP method depend on whether we're creating or updating
      const url = isEditMode ? `/employees/${initialData.id}` : "/employees";
      const method = isEditMode ? "put" : "post";
      await api[method](url, formData);
      // Execute callback or navigate based on onSuccess prop
      onSuccess ? onSuccess() : navigate("/employees");
    } catch (error) {
      // Display error message from server or fallback to generic error message
      toast.error(error.response?.data?.error || error.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="space-y-6 max-w-3xl animate-fade-in"
    >
      {/* ========== PERSONAL INFORMATION SECTION ========== */}
      {/* Collects basic employee details: name, contact info, join date, and bio */}
      <div className="card p-5 sm:p-6">
        <h3 className="font-medium mb-6 pb-4 border-b">Personal Information</h3>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-5 text-sm text-slate-700 dark:text-slate-300">
          {/* First Name Input */}
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

          {/* Last Name Input */}
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

          {/* Phone Number Input */}
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

          {/* Join Date Input - formats date for edit mode display */}
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

          {/* Optional Bio Input */}
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
      {/* ========== EMPLOYEE DETAILS SECTION ========== */}
      {/* Collects job-related information: department, position, salary, allowances, deductions */}
      <div className=" card p-5 sm:p-6">
        <h3 className="text-base font-medium text-slate-700 dark:text-slate-100 mb-6 pb-4">
          Employee Details
        </h3>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-5 text-sm text-slate-700">
          {/* Department Dropdown - populated from DEPARTMENTS constant */}
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

          {/* Position/Job Title Input */}
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

          {/* Basic Salary Input - numerical value with decimal support */}
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

          {/* Allowances Input - additional compensation/benefits */}
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

          {/* Deductions Input - taxes, insurance, etc. */}
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

          {/* Employment Status Dropdown - Only shown in edit mode */}
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
      {/* ========== ACCOUNT SETUP SECTION ========== */}
      {/* Collects authentication credentials and system role assignment */}
      <div className="card p-5 sm:p-6">
        <h3 className="text-base border-slate-100 border-b mb-6 pb-4">
          Account Setup
        </h3>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-5 text-sm text-slate-700 dark:text-slate-300">
          {/* Work Email Input - Spans full width */}
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

          {/* Password Field - Conditionally rendered based on form mode */}
          {!isEditMode && (
            /* CREATE MODE: Required password field for new employee */
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
            /* EDIT MODE: Optional password field for changing existing password */
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

          {/* System Role Dropdown - Determines user permissions (EMPLOYEE or ADMIN) */}
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
              <option value="EMPLOYEE">Employee</option>
              <option value="ADMIN">Admin</option>
            </select>
          </div>
        </div>
      </div>
      {/* ========== ACTION BUTTONS ========== */}
      {/* Submit and Cancel buttons with conditional loading state */}
      <div className="flex justify-end gap-3 pt-2 flex-col-reverse sm:flex-row">
        {/* Cancel Button - Calls onCancel callback or navigates back */}
        <button
          type="button"
          className="btn-secondary bg-red-400 cursor-pointer"
          onClick={onCancel ? onCancel : () => navigate(-1)}
        >
          Cancel
        </button>

        {/* Submit Button - Disabled during form submission, shows spinner when loading */}
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
