import clsx from 'clsx';

const variants = {
  Confirmed: 'bg-emerald-100 text-emerald-800',
  Pending: 'bg-amber-100 text-amber-800',
  Completed: 'bg-blue-100 text-blue-800',
  Cancelled: 'bg-red-100 text-red-800',
  available: 'bg-emerald-100 text-emerald-800',
  busy: 'bg-amber-100 text-amber-800',
  offline: 'bg-gray-100 text-gray-600',
};

export default function Badge({ status, className }) {
  return (
    <span
      className={clsx(
        'inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium capitalize',
        variants[status] || 'bg-gray-100 text-gray-800',
        className
      )}
    >
      {status}
    </span>
  );
}
