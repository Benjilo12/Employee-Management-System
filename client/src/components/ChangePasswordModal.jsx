import { Loader2Icon, LockIcon, X } from "lucide-react";
import { useState } from "react";

const ChangePasswordModal = ({ open, onClose }) => {
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState({ type: "", text: "" });

  if (!open) return null;

  const handleSubmit = async (e) => {
    e.preventDefault();
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4"
      onClick={onClose}
    >
      <div className="absolute inset-0 bg-black/40 backdrop-blur-sm" />
      <div
        className="relative bg-white dark:bg-slate-900 rounded-2xl shadow-2xl w-full max-w-md animate-fade-in border border-slate-200 dark:border-slate-700"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-center justify-between p-6 pb-0">
          <h2 className="text-lg font-medium text-slate-900 dark:text-slate-100 flex items-center">
            <LockIcon className="w-5 h-5 mr-3 text-slate-400 dark:text-slate-500" />{" "}
            Change Password
          </h2>
          <button
            className="p-2 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors text-slate-400 dark:text-slate-500 hover:text-slate-600 dark:hover:text-slate-300"
            onClick={onClose}
          >
            <X className="w-5 h-5 cursor-pointer" />
          </button>
        </div>
        <form className="p-6 space-y-5" onSubmit={handleSubmit}>
          {message.text && (
            <div
              className={`p-3 rounded-xl text-sm flex items-start gap-3 ${
                message.type === "success"
                  ? "bg-emerald-50 text-emerald-700 border border-emerald-200 dark:bg-emerald-900/20 dark:text-emerald-300 dark:border-emerald-800"
                  : "bg-rose-50 text-rose-700 border border-rose-200 dark:bg-rose-900/20 dark:text-rose-300 dark:border-rose-800"
              }`}
            >
              <div
                className={`w-1.5 h-1.5 rounded-full mt-1.5 shrink-0 ${message.type === "success" ? "bg-emerald-500" : "bg-red-500"}`}
              />
              {message.text}
            </div>
          )}
          <div>
            <label
              className="
            block text-sm font-medium text-slate-700 dark:text-slate-300"
            >
              Current Password
            </label>
            <input
              type="password"
              name="currentPassword"
              required
              className="mt-2 w-full rounded-lg border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-800 text-slate-900 dark:text-slate-100 px-3 py-2 outline-none focus:ring-2 focus:ring-primary/40 focus:border-primary dark:focus:border-primary"
            />
          </div>
          <div>
            <label
              className="
            block text-sm font-medium text-slate-700 dark:text-slate-300"
            >
              New Password
            </label>
            <input
              type="password"
              name="newPassword"
              required
              className="mt-2 w-full rounded-lg border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-800 text-slate-900 dark:text-slate-100 px-3 py-2 outline-none focus:ring-2 focus:ring-primary/40 focus:border-primary dark:focus:border-primary"
            />
          </div>
          <div className="flex gap-3 pt-2">
            <button
              type="button"
              onClick={onClose}
              className="btn-secondary flex-1 cursor-pointer"
            >
              Cancel
            </button>
            <button
              type="button"
              onClick={onClose}
              disabled={loading}
              className="btn-primary flex-1 justify-center items-center gap-2 cursor-pointer"
            >
              {loading && <Loader2Icon className="w-4 h-4 animate-spin" />}
              Update Password
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default ChangePasswordModal;
