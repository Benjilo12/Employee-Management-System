import { useEffect, useRef, useState } from "react";
import { BellIcon, Loader2Icon, Trash2Icon } from "lucide-react";
import toast from "react-hot-toast";
import { useNotifications } from "../context/NotificationContext";

const formatDate = (dateStr) => {
  if (!dateStr) return "";
  return new Date(dateStr).toLocaleString(undefined, {
    dateStyle: "medium",
    timeStyle: "short",
  });
};

const NotificationDropdown = () => {
  const {
    notifications,
    loading,
    unreadCount,
    fetchNotifications,
    markAsRead,
    markAllAsRead,
    isRead,
    deleteNotification,
  } = useNotifications();
  const [open, setOpen] = useState(false);
  const [deletingId, setDeletingId] = useState(null);
  const containerRef = useRef(null);

  useEffect(() => {
    const handleClickOutside = (e) => {
      if (containerRef.current && !containerRef.current.contains(e.target)) {
        setOpen(false);
      }
    };

    if (open) {
      document.addEventListener("mousedown", handleClickOutside);
    }

    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [open]);

  useEffect(() => {
    if (open && notifications.length > 0) {
      markAllAsRead();
    }
  }, [open, notifications.length, markAllAsRead]);

  const handleToggle = async () => {
    if (!open) {
      await fetchNotifications();
    }
    setOpen((prev) => !prev);
  };

  const handleNotificationClick = (id) => {
    markAsRead(id);
  };

  const handleDelete = async (e, id) => {
    e.stopPropagation();
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
    <div ref={containerRef} className="relative">
      <button
        type="button"
        onClick={handleToggle}
        aria-label="Notifications"
        aria-expanded={open}
        className="relative inline-flex h-10 w-10 cursor-pointer items-center justify-center rounded-full border border-slate-200 bg-white text-slate-700 shadow-sm transition-colors hover:bg-slate-50 dark:border-slate-600 dark:bg-slate-800 dark:text-slate-200 dark:hover:bg-slate-700"
      >
        <BellIcon className="h-5 w-5" />
        {unreadCount > 0 && (
          <span className="absolute -right-1 -top-1 inline-flex min-h-5 min-w-5 items-center justify-center rounded-full bg-rose-500 px-1 text-[10px] font-semibold text-white">
            {unreadCount > 9 ? "9+" : unreadCount}
          </span>
        )}
      </button>

      {open && (
        <div
          className="absolute right-0 z-50 mt-2 w-80 overflow-hidden rounded-xl border border-slate-200 bg-white shadow-lg dark:border-slate-600 dark:bg-slate-800 sm:w-96"
          role="dialog"
          aria-label="Notifications"
        >
          <div className="border-b border-slate-200 px-4 py-3 dark:border-slate-700">
            <h3 className="text-sm font-semibold text-slate-900 dark:text-slate-100">
              Notifications
            </h3>
            <p className="text-xs text-slate-500 dark:text-slate-400">
              {notifications.length === 0
                ? "No messages"
                : `${notifications.length} message${notifications.length === 1 ? "" : "s"}`}
            </p>
          </div>

          <div className="max-h-80 overflow-y-auto">
            {loading ? (
              <div className="flex justify-center py-8">
                <Loader2Icon className="h-6 w-6 animate-spin text-indigo-600" />
              </div>
            ) : notifications.length === 0 ? (
              <p className="px-4 py-8 text-center text-sm text-slate-500 dark:text-slate-400">
                You have no notifications yet.
              </p>
            ) : (
              <ul className="divide-y divide-slate-100 dark:divide-slate-700">
                {notifications.map((item) => {
                  const read = isRead(item.id);
                  return (
                    <li
                      key={item.id}
                      className={`relative transition-colors ${
                        !read
                          ? "bg-indigo-50/60 dark:bg-indigo-900/20"
                          : "bg-transparent"
                      }`}
                    >
                      <button
                        type="button"
                        onClick={() => handleNotificationClick(item.id)}
                        className={`w-full cursor-pointer py-3 pl-4 text-left transition-colors hover:bg-slate-50 dark:hover:bg-slate-700/50 ${
                          read ? "pr-12" : "pr-4"
                        }`}
                      >
                        <div className="flex items-start justify-between gap-2">
                          <p
                            className={`text-sm font-medium ${
                              read
                                ? "text-slate-700 dark:text-slate-300"
                                : "text-slate-900 dark:text-slate-100"
                            }`}
                          >
                            {item.title}
                          </p>
                          {item.type && item.type !== "GENERAL" && (
                            <span className="shrink-0 rounded-full bg-indigo-50 px-2 py-0.5 text-[10px] font-medium uppercase tracking-wide text-indigo-600 dark:bg-indigo-900/40 dark:text-indigo-300">
                              {item.type.replace(/_/g, " ")}
                            </span>
                          )}
                        </div>
                        <p className="mt-1 text-sm leading-relaxed text-slate-600 dark:text-slate-300">
                          {item.message}
                        </p>
                        {item.createdAt && (
                          <p className="mt-1.5 text-xs text-slate-400">
                            {formatDate(item.createdAt)}
                          </p>
                        )}
                      </button>

                      {read && (
                        <button
                          type="button"
                          onClick={(e) => handleDelete(e, item.id)}
                          disabled={deletingId === item.id}
                          aria-label="Delete notification"
                          className="absolute right-3 top-3 cursor-pointer rounded-lg p-1.5 text-slate-400 transition-colors hover:bg-rose-50 hover:text-rose-600 disabled:cursor-not-allowed disabled:opacity-50 dark:hover:bg-rose-900/30 dark:hover:text-rose-400"
                        >
                          {deletingId === item.id ? (
                            <Loader2Icon className="h-4 w-4 animate-spin" />
                          ) : (
                            <Trash2Icon className="h-4 w-4" />
                          )}
                        </button>
                      )}
                    </li>
                  );
                })}
              </ul>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default NotificationDropdown;
