const EmpolyeeCard = ({ employee, onDelete, onEdit }) => {
  const initials = `${employee.firstName?.charAt(0) ?? ""}${employee.lastName?.charAt(0) ?? ""}`;

  const handleDelete = async () => {
    if (
      !confirm(
        `Are you sure you want to delete ${employee.firstName} ${employee.lastName}?`,
      )
    )
      return;
  };

  return (
    <div className="group relative card card-hover overflow-hidden border border-slate-200 bg-white transition-colors dark:border-slate-700 dark:bg-slate-800">
      <div className="p-5 text-center">
        <div className="mb-4 flex justify-center">
          <div className="flex h-20 w-20 items-center justify-center rounded-full bg-gradient-to-br from-indigo-100 to-slate-100 dark:from-indigo-500/25 dark:to-slate-700">
            <span className="text-2xl font-semibold text-indigo-600 dark:text-indigo-300">
              {initials}
            </span>
          </div>
        </div>
        <h3 className="text-slate-900 dark:text-slate-100">
          {employee.firstName} {employee.lastName}
        </h3>
        <p className="text-xs text-slate-500 dark:text-slate-400">
          {employee.position}
        </p>
        <p className="mt-1 text-xs font-medium text-indigo-600 dark:text-indigo-300">
          {employee.department}
        </p>
      </div>

      <div className="absolute inset-x-0 bottom-0 flex translate-y-0 gap-2 border-t border-slate-200 bg-white/95 p-3 opacity-100 transition-all duration-200 sm:translate-y-2 sm:opacity-0 sm:group-hover:translate-y-0 sm:group-hover:opacity-100 dark:border-slate-700 dark:bg-slate-800/95">
        <button
          type="button"
          onClick={() => onEdit?.(employee)}
          className="flex-1 rounded-lg border border-slate-300 px-3 py-2 text-sm font-medium text-slate-700 transition-colors hover:bg-slate-50 cursor-pointer dark:border-slate-600 dark:text-slate-200 dark:hover:bg-slate-700"
        >
          Edit
        </button>
        <button
          type="button"
          onClick={handleDelete}
          className="flex-1 rounded-lg border border-rose-200 bg-rose-50 px-3 py-2 text-sm font-medium text-rose-700 transition-colors hover:bg-rose-100 cursor-pointer dark:border-rose-500/40 dark:bg-rose-500/15 dark:text-rose-300 dark:hover:bg-rose-500/25"
        >
          Delete
        </button>
      </div>
    </div>
  );
};

export default EmpolyeeCard;
