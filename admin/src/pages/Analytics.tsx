import { BarChart3, TrendingUp, Users, BookOpen, Zap } from "lucide-react";

export default function Analytics() {
  const stats = [
    { icon: Users, label: "Active Today", value: "142", trend: "+12%" },
    { icon: BookOpen, label: "Mocks Started", value: "890", trend: "+24%" },
    { icon: Zap, label: "Readiness Avg", value: "72%", trend: "+3%" },
    { icon: TrendingUp, label: "Conversion", value: "18.4%", trend: "+1.2%" },
  ];

  const exams = [
    { name: "SSC CGL 2026", count: 420 },
    { name: "UPSC Civil Services", count: 310 },
    { name: "JEE Advanced", count: 280 },
    { name: "IBPS PO Mock", count: 150 },
  ];

  return (
    <div className="space-y-6">

      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold">Platform Analytics</h1>
        <p className="text-sm text-[var(--text-secondary)]">
          Real-time performance metrics and user engagement insights.
        </p>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">

        {stats.map((stat, i) => (
          <div key={i} className="app-card p-5">

            <div className="w-10 h-10 rounded-lg bg-[var(--color-primary-light)] flex items-center justify-center mb-4">
              <stat.icon size={20} className="text-[var(--color-primary)]" />
            </div>

            <p className="text-xs font-bold uppercase text-[var(--text-muted)] mb-1">
              {stat.label}
            </p>

            <div className="flex items-end gap-2">
              <span className="text-2xl font-bold">{stat.value}</span>

              <span className="text-xs font-bold text-green-600">
                {stat.trend}
              </span>
            </div>

          </div>
        ))}

      </div>

      {/* Charts Section */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">

        {/* Growth Chart */}
        <div className="app-card p-6 h-80 flex flex-col justify-between">

          <div className="flex justify-between items-center mb-4">

            <h3 className="font-semibold flex items-center gap-2">
              <TrendingUp size={18} className="text-[var(--color-primary)]" />
              User Growth (Last 30 Days)
            </h3>

            <select className="input text-xs py-1 px-2 w-auto">
              <option>Monthly</option>
              <option>Weekly</option>
            </select>

          </div>

          <div className="flex-1 bg-[var(--bg-light)] rounded-xl border border-dashed border-[var(--border-light)] flex items-center justify-center">

            <BarChart3 className="text-[var(--text-muted)]" size={48} />

            <span className="ml-4 text-sm text-[var(--text-muted)]">
              Chart visualization would render here
            </span>

          </div>

        </div>

        {/* Top Exams */}
        <div className="app-card p-6 h-80 flex flex-col">

          <h3 className="font-semibold flex items-center gap-2 mb-6">
            <Zap size={18} className="text-orange-500" />
            Top Performing Exams
          </h3>

          <div className="space-y-4">

            {exams.map((exam, i) => (

              <div key={i}>

                <div className="flex justify-between text-xs font-bold text-[var(--text-secondary)]">
                  <span>{exam.name}</span>
                  <span>{exam.count} attempts</span>
                </div>

                <div className="progress-bar mt-1">

                  <div
                    className="progress-fill"
                    style={{ width: `${(exam.count / 420) * 100}%` }}
                  />

                </div>

              </div>

            ))}

          </div>

        </div>

      </div>
    </div>
  );
}