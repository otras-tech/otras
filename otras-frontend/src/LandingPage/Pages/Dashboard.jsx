import { Link } from "react-router-dom";

export default function Dashboard() {
  const user = JSON.parse(localStorage.getItem("otrasUser"));

  return (
    <div className="min-h-screen bg-slate-50 px-6 py-16">
      <div className="mx-auto max-w-6xl">
        <div className="rounded-[32px] border border-slate-200 bg-white p-8 shadow-lg">
          <h1 className="text-4xl font-extrabold gradient-text">Welcome to OTRAS</h1>
          <p className="mt-4 text-lg text-slate-600">
            Logged in as: {user?.email || "demo user"}
          </p>

          <div className="mt-8 grid gap-6 md:grid-cols-3">
            <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
              <h3 className="text-xl font-semibold text-slate-900">Applications</h3>
              <p className="mt-2 text-slate-600">
                Track your job and internship applications in one place.
              </p>
            </div>

            <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
              <h3 className="text-xl font-semibold text-slate-900">Exam Alerts</h3>
              <p className="mt-2 text-slate-600">
                Stay updated with exam notifications and deadlines.
              </p>
            </div>

            <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
              <h3 className="text-xl font-semibold text-slate-900">AI Insights</h3>
              <p className="mt-2 text-slate-600">
                Get personalized recommendations and career insights.
              </p>
            </div>
          </div>

          <Link to="/" className="btn-primary mt-8 inline-flex">
            Back to Home
          </Link>
        </div>
      </div>
    </div>
  );
}