export default function ScheduleItem({ time, task, status, statusColor }) {
  return (
    <div className="flex items-center justify-between py-2.5 border-b border-slate-100 last:border-0">
      <div className="flex items-center gap-3">
        <span className="text-cyan-600 text-xs font-semibold flex-shrink-0 w-20">{time}</span>
        <span className="text-slate-700 text-sm">{task}</span>
      </div>
      <span className={`text-xs font-medium ${statusColor}`}>{status}</span>
    </div>
  );
}
