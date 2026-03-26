import { FilePieChart, Download, FileText, CheckCircle2 } from "lucide-react";

export default function Reports() {

  const reports = [
    { title: "User Growth Report", date: "Oct 12, 2026", size: "2.4 MB", type: "PDF" },
    { title: "Exam Readiness Analytics", date: "Oct 10, 2026", size: "1.8 MB", type: "XLS" },
    { title: "Payment Reconciliation", date: "Oct 05, 2026", size: "4.2 MB", type: "PDF" },
    { title: "Content Coverage Audit", date: "Sep 28, 2026", size: "0.9 MB", type: "PDF" },
  ];

  return (
    <div className="space-y-6">

      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold">Generated Reports</h1>
        <p className="text-sm text-[var(--text-secondary)]">
          Downloadable platform summaries and compliance audits.
        </p>
      </div>

      {/* Main Report Card */}
      <div className="app-card overflow-hidden">

        {/* Card Header */}
        <div className="p-6 border-b border-[var(--border-light)] flex justify-between items-center">

          <div className="flex items-center gap-4">

            <div className="w-12 h-12 rounded-xl bg-[var(--color-primary)] text-white flex items-center justify-center">
              <FilePieChart size={22} />
            </div>

            <div>
              <h2 className="text-xl font-bold">
                Platform Performance Audit
              </h2>

              <p className="text-xs font-bold uppercase tracking-widest text-[var(--text-muted)]">
                Quarterly Summary • Q1 2026
              </p>
            </div>

          </div>

          <button className="btn-primary flex items-center gap-2">
            <Download size={18} />
            Generate PDF
          </button>

        </div>

        {/* Report List */}
        <div className="p-6">

          <h3 className="text-xs font-bold uppercase tracking-widest text-[var(--text-muted)] mb-4">
            Available Reports
          </h3>

          <div className="space-y-3">

            {reports.map((report, i) => (

              <div
                key={i}
                className="flex items-center justify-between p-4 rounded-xl border border-[var(--border-light)] hover:bg-[var(--bg-light)] transition-default"
              >

                <div className="flex items-center gap-4">

                  <div className="w-10 h-10 rounded-lg bg-[var(--bg-light)] flex items-center justify-center text-[var(--text-muted)]">
                    <FileText size={18} />
                  </div>

                  <div>
                    <p className="font-semibold">{report.title}</p>

                    <p className="text-xs text-[var(--text-muted)]">
                      {report.date} • {report.size}
                    </p>
                  </div>

                </div>

                <div className="flex items-center gap-3">

                  <span className="badge-success flex items-center gap-1 text-[10px]">
                    <CheckCircle2 size={12} />
                    Ready
                  </span>

                  <button className="p-2 rounded-lg hover:bg-[var(--bg-light)] transition-default">
                    <Download size={18} />
                  </button>

                </div>

              </div>

            ))}

          </div>

        </div>

      </div>

    </div>
  );
}