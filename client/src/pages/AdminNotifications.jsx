import { useState } from "react";
import { Loader2Icon, Trash2Icon } from "lucide-react";
import toast from "react-hot-toast";
import Loading from "../components/Loading";
import { useAuth } from "../context/authContext";
import { useNotifications } from "../context/NotificationContext";

const AdminNotifications = () => {
  const { user, loading: authLoading } = useAuth();
  const {
    notifications,
    loading,
    sendNotification,
    fetchNotifications,
    deleteNotification,
  } = useNotifications();
  const [title, setTitle] = useState("");
  const [message, setMessage] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [deletingId, setDeletingId] = useState(null);

  if (authLoading) return <Loading />;

  if (user?.role !== "ADMIN") {
    return (
      <div className="rounded-xl border border-rose-200 bg-rose-50 p-4 text-rose-700">
        You are not allowed to access this page.
      </div>
    );
  }

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!title.trim() || !message.trim()) return;

    setSubmitting(true);
    try {
      await sendNotification({ title, message });
      setTitle("");
      setMessage("");
      toast.success("Notification sent to all employees");
    } catch (err) {
      toast.error(err.response?.data?.error || "Failed to send notification");
    } finally {
      setSubmitting(false);
    }
  };

  const handleDelete = async (id) => {
    setDeletingId(id);
    try {
      await deleteNotification(id);
      toast.success("Notification deleted");
    } catch (err) {
      toast.error(err.response?.data?.error || "Failed to delete notification");
    } finally {
      setDeletingId(null);
    }
  };

  return (
    <div className="space-y-6 animate-fade-in">
      <div>
        <h1 className="text-2xl font-semibold text-slate-900 dark:text-slate-100">
          Send Notifications
        </h1>
        <p className="text-slate-500 dark:text-slate-400">
          Create and send push notifications to employees in real time.
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
            className="rounded-lg bg-indigo-600 px-4 py-2 text-sm font-medium text-white hover:bg-indigo-700 cursor-pointer disabled:opacity-60"
            disabled={submitting}
          >
            {submitting ? "Sending..." : "Send Notification"}
          </button>
        </div>
      </form>

      <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm dark:border-slate-700 dark:bg-slate-800">
        <div className="mb-3 flex items-center justify-between">
          <h2 className="text-lg font-semibold text-slate-900 dark:text-slate-100">
            Recent Notifications
          </h2>
          <button
            type="button"
            onClick={fetchNotifications}
            className="text-sm text-indigo-600 hover:text-indigo-700 dark:text-indigo-400"
            disabled={loading}
          >
            Refresh
          </button>
        </div>
        {loading ? (
          <Loading />
        ) : notifications.length === 0 ? (
          <p className="text-sm text-slate-500 dark:text-slate-400">
            No notifications sent yet.
          </p>
        ) : (
          <div className="space-y-3">
            {notifications.slice(0, 10).map((item) => (
              <div
                key={item.id}
                className="relative rounded-lg border border-slate-200 p-3 pr-12 dark:border-slate-700"
              >
                <div className="flex items-start justify-between gap-2">
                  <p className="font-medium text-slate-900 dark:text-slate-100">
                    {item.title}
                  </p>
                  {item.type && item.type !== "GENERAL" && (
                    <span className="shrink-0 rounded-full bg-indigo-50 px-2 py-0.5 text-xs font-medium text-indigo-600 dark:bg-indigo-900/40 dark:text-indigo-300">
                      {item.type.replace("_", " ")}
                    </span>
                  )}
                </div>
                <p className="text-sm text-slate-600 dark:text-slate-300">
                  {item.message}
                </p>
                {item.createdAt && (
                  <p className="mt-1 text-xs text-slate-400">
                    {new Date(item.createdAt).toLocaleString()}
                  </p>
                )}
                <button
                  type="button"
                  onClick={() => handleDelete(item.id)}
                  disabled={deletingId === item.id}
                  aria-label="Delete notification"
                  className="absolute right-2 top-2 cursor-pointer rounded-lg p-1.5 text-slate-400 transition-colors hover:bg-rose-50 hover:text-rose-600 disabled:cursor-not-allowed disabled:opacity-50 dark:hover:bg-rose-900/30 dark:hover:text-rose-400"
                >
                  {deletingId === item.id ? (
                    <Loader2Icon className="h-4 w-4 animate-spin" />
                  ) : (
                    <Trash2Icon className="h-4 w-4" />
                  )}
                </button>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default AdminNotifications;
