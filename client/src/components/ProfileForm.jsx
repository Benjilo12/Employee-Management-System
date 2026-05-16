import { Loader2, Save, User } from "lucide-react";
import { useState } from "react";
import api from "../api/axios";

// ProfileForm: edit public profile and bio
const ProfileForm = ({ initialData, onSuccess }) => {
  // form state
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [message, setMessage] = useState("");

  // submit handler: post profile updates to server
  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    setMessage("");
    const formData = new FormData(e.currentTarget); // collect form fields
    try {
      // use PUT since server route expects PUT /api/profile
      await api.put("/profile", formData);
      setMessage("Profile updated successfully");
      onSuccess?.();
    } catch (error) {
      // display API or network error
      setError(error.response?.data?.error || error.message);
    } finally {
      setLoading(false);
    }
  };
  return (
    <form onSubmit={handleSubmit} className="card p-5 sm:p-6 mb-6">
      <h2 className="text-base font-medium text-slate-900 dark:text-slate-100 mb-6 pb-4 border-b border-slate-100 dark:border-slate-800 flex items-center gap-2">
        <User className="w-5 h-5 text-slate-400 dark:text-slate-500" /> Public
        Profile
      </h2>
      {error && (
        <div className="bg-rose-50 dark:bg-rose-500/10 text-rose-700 dark:text-rose-300 p-4 rounded-xl text-sm border border-rose-200 dark:border-rose-500/30 mb-6 flex items-start gap-3 ">
          <div className="w-1.5 h-1.5 rounded-full bg-rose-500 mt-1.5 shrink-0" />
          {error}
        </div>
      )}
      {message && (
        <div className="bg-emerald-50 dark:bg-emerald-500/10 text-emerald-700 dark:text-emerald-300 p-4 rounded-xl text-sm border border-emerald-200 dark:border-emerald-500/30 mb-6 flex items-start gap-3 ">
          <div className="w-1.5 h-1.5 rounded-full bg-emerald-500 mt-1.5 shrink-0" />
          {message}
        </div>
      )}

      <div className="space-y-5">
        {/* Profile fields */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label
              htmlFor="Name"
              className="block text-sm font-medium text-slate-700 mb-2 dark:text-slate-200"
            >
              Name
            </label>
            {/* name is read-only */}
            <input
              disabled
              value={`${initialData.firstName} ${initialData.lastName}`}
              className="bg-slate-50 dark:bg-slate-800 text-slate-400 dark:text-slate-500 cursor-not-allowed border border-slate-200 dark:border-slate-700"
            />
          </div>
          <div>
            <label
              htmlFor="Name"
              className="block text-sm font-medium text-slate-700 mb-2 dark:text-slate-200"
            >
              Email
            </label>
            {/* email is read-only */}
            <input
              disabled
              value={initialData.email}
              className="bg-slate-50 dark:bg-slate-800 text-slate-400 dark:text-slate-500 cursor-not-allowed border border-slate-200 dark:border-slate-700"
            />
          </div>
          <div className="sm:col-span-2">
            <label
              htmlFor="position"
              className="block text-sm font-medium text-slate-700 mb-2 dark:text-slate-200"
            >
              Position
            </label>
            {/* position is read-only */}
            <input
              disabled
              value={initialData.position}
              className="bg-slate-50 dark:bg-slate-800 text-slate-400 dark:text-slate-500 cursor-not-allowed border border-slate-200 dark:border-slate-700"
            />
          </div>
        </div>
        <div>
          <label
            htmlFor="Name"
            className="block text-sm font-medium text-slate-700 mb-2 dark:text-slate-200"
          >
            Bio
          </label>
          {/* editable bio (disabled if account deactivated) */}
          <textarea
            disabled={initialData.isDeleted}
            name="bio"
            defaultValue={initialData.bio || ""}
            placeholder="Write a brief bio..."
            className={`resize-none ${initialData.isDeleted ? "bg-slate-50 text-slate-400 cursor-not-allowed" : ""}`}
          />
          <p className="text-xs text-slate-400 mt-1.5">
            This will be displayed on your profile
          </p>
        </div>
        {initialData.isDeleted ? (
          <div className="pt-2">
            {/* deactivated account notice */}
            <div className="p-4 bg-rose-50 border border-rose-200 rounded-xl text-center">
              <p className="text-rose-600 font-medium tracking-tight">
                Account Deactivated
              </p>
              <p className="text-sm text-rose-500 mt-0.5">
                You can no longer update your profile
              </p>
            </div>
          </div>
        ) : (
          <div className="flex justify-end pt-2">
            <button
              type="submit"
              disabled={loading}
              className="btn-primary flex items-center gap-2 justify-center w-full sm:w-auto cursor-pointer"
            >
              {loading ? (
                <Loader2 className="w-4 h-4 animate-spin" />
              ) : (
                <Save className="w-4 h-4" />
              )}
              {/* submit button */}
              Save Changes
            </button>
          </div>
        )}
      </div>
    </form>
  );
};

export default ProfileForm;
