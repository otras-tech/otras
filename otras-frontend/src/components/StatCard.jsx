export default function StatCard({ icon: Icon, title, value, badge, badgeColor = 'text-green-700 bg-green-100' }) {
  return (
    <div className="bg-white rounded-xl p-5 shadow-sm border border-slate-100">
      {Icon && (
        <div className="w-10 h-10 rounded-lg bg-blue-50 flex items-center justify-center mb-3">
          <Icon size={18} className="text-blue-500" />
        </div>
      )}
      <p className="text-xs text-slate-500 font-semibold uppercase tracking-wider mb-1">{title}</p>
      <p className="text-3xl font-bold text-blue-700">{value}</p>
      {badge && (
        <span className={`inline-block mt-1 px-3 py-0.5 rounded-full text-xs font-semibold ${badgeColor}`}>
          {badge}
        </span>
      )}
    </div>
  );
}
