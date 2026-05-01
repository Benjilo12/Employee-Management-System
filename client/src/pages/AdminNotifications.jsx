import { useMemo, useState } from "react";
import toast from "react-hot-toast";
import { createNotification, getNotifications } from "../utils/notifications";

const AdminNotifications = () => {
  const [title, setTitle] = useState("");
  const [message, setMessage] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const role = localStorage.getItem("ems_role") || "ADMIN";

  const notifications = useMemo(() => getNotifications(), [submitting]);

  if (role !== "ADMIN") {
    return (
      <div className="rounded-xl border border-rose-200 bg-rose-50 p-4 text-rose-700">
        You are not allowed to access this page.
      </div>
    );
  }

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!title.trim() || !message.trim()) return;

    setSubmitting(true);
    createNotification({
      title,
      message,
      senderRole: "ADMIN",
    });
    setTitle("");
    setMessage("");
    setSubmitting(false);
    toast.success("Notification sent");
  };

  return (
    <div className="space-y-6 animate-fade-in">
      <div>
        <h1 className="text-2xl font-semibold text-slate-900 dark:text-slate-100">
          Send Notifications
        </h1>
        <p className="text-slate-500 dark:text-slate-400">
          Create and send push notifications to employees.
        </p>
      </div>

      <form
        onSubmit={handleSubmit}
        className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm dark:border-slate-700 dark:bg-slate-800"
      >
        <div className="space-y-4">
          <div>
            <label className="mb-1 block text-sm font-medium text-slate-700 dark:text-slate-200">
              Title
            </label>
            <input
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="w-full rounded-lg border border-slate-300 bg-white px-3 py-2 text-slate-900 outline-none focus:border-indigo-500 dark:border-slate-600 dark:bg-slate-900 dark:text-slate-100"
              placeholder="Notification title"
              required
            />
          </div>
          <div>
            <label className="mb-1 block text-sm font-medium text-slate-700 dark:text-slate-200">
              Message
            </label>
            <textarea
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              rows={4}
              className="w-full rounded-lg border border-slate-300 bg-white px-3 py-2 text-slate-900 outline-none focus:border-indigo-500 dark:border-slate-600 dark:bg-slate-900 dark:text-slate-100"
              placeholder="Write your announcement..."
              required
            />
          </div>
          <button
            type="submit"
            className="rounded-lg bg-indigo-600 px-4 py-2 text-sm font-medium text-white hover:bg-indigo-700 cursor-pointer"
            disabled={submitting}
          >
            Send Notification
          </button>
        </div>
      </form>

      <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm dark:border-slate-700 dark:bg-slate-800">
        <h2 className="mb-3 text-lg font-semibold text-slate-900 dark:text-slate-100">
          Recent Notifications
        </h2>
        {notifications.length === 0 ? (
          <p className="text-sm text-slate-500 dark:text-slate-400">
            No notifications sent yet.
          </p>
        ) : (
          <div className="space-y-3">
            {notifications.slice(0, 5).map((item) => (
              <div
                key={item.id}
                className="rounded-lg border border-slate-200 p-3 dark:border-slate-700"
              >
                <p className="font-medium text-slate-900 dark:text-slate-100">
                  {item.title}
                </p>
                <p className="text-sm text-slate-600 dark:text-slate-300">
                  {item.message}
                </p>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default AdminNotifications;
