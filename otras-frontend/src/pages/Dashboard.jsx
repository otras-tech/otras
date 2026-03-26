import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  ArrowRight,
  FileText,
  Shield,
  Search,
  Star,
  TrendingUp,
  Zap,
  TrendingDown
} from "lucide-react";
import {
  ComposedChart,
  Line,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer
} from "recharts";
import ScheduleItem from "../components/ScheduleItem";
import axios from "axios";
import { useTranslation } from "../hooks/useTranslation";
import { getSavedPlans } from "../services/studyPlanApi";

export default function Dashboard({ user: propUser }) {

  const navigate = useNavigate();
  const { t } = useTranslation();
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const userId = propUser?.id || JSON.parse(localStorage.getItem("user") || "{}")?.id;
    if (userId) {
      fetchDashboardData(userId);
    } else {
      setLoading(false);
    }
  }, [propUser?.id]);

  const fetchDashboardData = async (userId) => {
    try {
      setLoading(true);
      console.log("DASHBOARD: Fetching data for userId", userId);
      const [resp, plans] = await Promise.all([
        axios.get(`http://localhost:4000/users/${userId}/dashboard`),
        getSavedPlans(userId).catch((err) => {
          console.error("DASHBOARD: Failed to fetch plans", err);
          return [];
        })
      ]);
      console.log("DASHBOARD: Plans received:", plans?.length);
      setData({ ...resp.data, studyPlans: plans || [] });
    } catch (err) {
      console.error("Failed to fetch dashboard data", err);
    } finally {
      setLoading(false);
    }
  };

  const user = propUser || JSON.parse(localStorage.getItem("user") || "{}");

  const stats =
    data?.stats ||
    { readinessIndex: 0, testsCompleted: 0, recentTend: [], percentile: 0, logicalScore: 0, quantScore: 0, verbalScore: 0 };

  console.log("ARTHA: Rendering AI feedback in report", stats);

  // 1. Data Source: Fetch actual mock tests (submitted only, from backend)
  const mockTests = data?.mockTests || [];

  // 2. Fixed Weekday Order: Sunday -> Saturday (Last 7 Days)
  const WEEK_DAYS = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];

  // Calculate the start of "Last 7 Days"
  const now = new Date();
  const sevenDaysAgo = new Date(now);
  sevenDaysAgo.setDate(now.getDate() - 7);
  sevenDaysAgo.setHours(0, 0, 0, 0);

  const weeklyData = WEEK_DAYS.map((day, index) => {
    // getDay() returns 0 for Sunday, 1 for Monday, etc.
    const dayTests = mockTests.filter(test => {
      const testDate = new Date(test.createdAt);
      // Must be within the last 7 days and match the day index
      return testDate >= sevenDaysAgo && testDate.getDay() === index;
    });

    const avgScore = dayTests.length
      ? Math.round(dayTests.reduce((sum, t) => sum + Number(t.score || 0), 0) / dayTests.length)
      : 0;

    return { label: day, score: avgScore };
  });

  const last7Days = weeklyData;

  // 2. Fixed Weekday Order: Sunday -> Saturday

  const trendScores = last7Days.map(d => d.score);
  const maxScore = Math.max(...trendScores, 10);
  const hasData = mockTests.length > 0;

  // Daily Study Data: Fetch from the latest saved study plan
  let dailyTasks = [];
  let planInfo = null;

  if (data?.studyPlans && data.studyPlans.length > 0) {
    const latestPlan = data.studyPlans[0]; // Plans are sorted desc by createdAt in backend
    if (latestPlan.days && latestPlan.days.length > 0) {
      const today = new Date();
      today.setHours(0, 0, 0, 0);

      // Try to find tasks for TODAY first
      let activeDay = latestPlan.days.find(d => {
        if (!d.date) return false;
        const dayDate = new Date(d.date);
        dayDate.setHours(0, 0, 0, 0);
        return dayDate.getTime() === today.getTime();
      });

      // Fallback: Find the first day with uncompleted tasks
      if (!activeDay) {
        activeDay = latestPlan.days.find(d => d.activities?.some(a => !a.completed)) || latestPlan.days[0];
      }

      console.log("DASHBOARD: Selected activeDay", activeDay.day, activeDay.date);
      dailyTasks = (activeDay.activities || []).slice(0, 3);
      planInfo = {
        targetExam: latestPlan.targetExam,
        dayLabel: activeDay.day,
        date: activeDay.date ? new Date(activeDay.date).toLocaleDateString() : ''
      };
    }
  }

  return (
    <div className="space-y-5">

      {/* HERO */}

      <div
        className="rounded-2xl p-7 flex items-start justify-between"
        style={{
          background: "linear-gradient(135deg, #e0e8ff 0%, #f0f7ff 100%)"
        }}
      >

        <div>

          <h1 className="text-3xl font-bold text-blue-800 mb-1 capitalize">
            {t("welcome")}, {user.firstName || "Candidate"}.
          </h1>

          <p className="text-slate-500 text-sm">
            {user.otrId
              ? `${t("otrId")} ${user.otrId}. ${t("examRoadmap")}`
              : t("completeOTR")}
          </p>

        </div>


        {/* READINESS CARD */}

        <div className="bg-white rounded-xl p-4 text-center shadow-sm min-w-32">

          <p className="text-xs text-slate-500 font-semibold uppercase tracking-wider mb-1">
            {t("readinessIndex")}
          </p>

          <p className="text-3xl font-bold text-blue-700">
            {stats.readinessIndex}
            <span className="text-lg">%</span>
          </p>

          <span className="inline-block mt-1 px-3 py-0.5 rounded-full text-xs font-semibold text-green-700 bg-green-100">
            {stats.readinessIndex > 70
              ? t("ready")
              : t("foundation")}
          </span>

        </div>

      </div>


      {/* OTR BANNER */}

      {!user.otrId && (

        <div className="rounded-xl p-4 flex items-center justify-between border-2 border-cyan-200 bg-cyan-50">

          <div className="flex items-center gap-3">

            <div className="w-10 h-10 rounded-lg bg-cyan-100 flex items-center justify-center">
              <FileText size={18} className="text-cyan-600" />
            </div>

            <div>

              <p className="text-blue-700 font-semibold">
                {t("otrRequired")}
              </p>

              <p className="text-slate-500 text-sm">
                {t("otrDescription")}
              </p>

            </div>

          </div>

          <button
            onClick={() => navigate("/profile")}
            className="flex items-center gap-2 px-5 py-2.5 rounded-lg text-white font-semibold text-sm"
            style={{ background: "#06b6d4" }}
          >
            {t("fillOtrForm")}
            <ArrowRight size={15} />
          </button>

        </div>

      )}


      {/* FEATURE CARDS */}

      <div className="grid grid-cols-3 gap-4">

        {[
          {
            icon: <Shield size={20} className="text-blue-500" />,
            title: t("eligibility"),
            desc: t("eligibilityDesc"),
            btn: t("checkEligibility"),
            page: "eligibility",
            primary: true
          },
          {
            icon: <Search size={20} className="text-blue-400" />,
            title: t("examDiscovery"),
            desc: t("examDiscoveryDesc"),
            btn: t("browseOpenings"),
            page: "exams"
          },
          {
            icon: <Star size={20} className="text-blue-400" />,
            title: t("careerIntelligence"),
            desc: t("careerDesc"),
            btn: t("generateRoadmap"),
            page: "career"
          }
        ].map((card, i) => (

          <div key={i} className="bg-white rounded-xl p-5 shadow-sm border border-slate-100">

            <div className="w-10 h-10 rounded-lg bg-blue-50 flex items-center justify-center mb-4">
              {card.icon}
            </div>

            <h3 className="text-slate-800 font-semibold text-base mb-1">
              {card.title}
            </h3>

            <p className="text-slate-500 text-sm mb-4">
              {card.desc}
            </p>

            <button
              onClick={() => navigate(`/${card.page}`)}
              className={`w-full py-2 rounded-lg text-sm font-semibold flex items-center justify-center gap-1 transition-all ${card.primary
                ? "bg-blue-700 text-white hover:bg-blue-800"
                : "border border-blue-200 text-blue-600 hover:bg-blue-50"
                }`}
            >
              {card.btn}
              {card.primary && <ArrowRight size={14} />}
            </button>

          </div>

        ))}

      </div>


      {/* BOTTOM SECTION */}

      <div className="grid grid-cols-2 gap-4">

        {/* PERFORMANCE TREND */}

        <div className="bg-white rounded-xl p-5 shadow-sm border border-slate-100">

          <div className="flex items-center gap-2 mb-1">
            <TrendingUp size={16} className="text-blue-500" />
            <h3 className="font-semibold text-slate-800">
              {t("performanceTrend")}
            </h3>
          </div>

          <p className="text-slate-500 text-sm mb-4">
            {stats.testsCompleted > 0
              ? t("testsCompletedMsg").replace("{{count}}", stats.testsCompleted)
              : t("startMockTests")}
          </p>

          <div className="h-56 mt-2">
            {hasData ? (
              <ResponsiveContainer width="100%" height="100%">
                <ComposedChart
                  data={last7Days.map(d => ({ day: d.label, value: d.score }))}
                  margin={{ top: 10, right: 10, left: -20, bottom: 0 }}
                >
                  <defs>
                    <linearGradient id="colorTrend" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#2f6ce5" stopOpacity={0.3} />
                      <stop offset="95%" stopColor="#2f6ce5" stopOpacity={0} />
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                  <XAxis
                    dataKey="day"
                    axisLine={false}
                    tickLine={false}
                    tick={{ fill: '#94a3b8', fontSize: 10, fontWeight: 600 }}
                    dy={10}
                  />
                  <YAxis
                    hide
                    domain={[0, 100]}
                  />
                  <Tooltip
                    contentStyle={{
                      borderRadius: '12px',
                      border: 'none',
                      boxShadow: '0 10px 15px -3px rgba(0,0,0,0.1)',
                      fontSize: '12px',
                      fontWeight: 'bold'
                    }}
                    cursor={{ stroke: '#2f6ce5', strokeWidth: 1 }}
                  />
                  <Area
                    type="monotone"
                    dataKey="value"
                    stroke="none"
                    fillOpacity={1}
                    fill="url(#colorTrend)"
                    animationDuration={1500}
                  />
                  <Line
                    type="monotone"
                    dataKey="value"
                    stroke="#2f6ce5"
                    strokeWidth={3}
                    dot={{ r: 4, fill: '#fff', strokeWidth: 2, stroke: '#2f6ce5' }}
                    activeDot={{ r: 6, fill: '#2f6ce5', strokeWidth: 2, stroke: '#fff' }}
                    animationDuration={1500}
                  />
                </ComposedChart>
              </ResponsiveContainer>
            ) : (
              <div className="text-center py-8">
                <p className="text-slate-400 text-sm font-medium">{t("noDataAvailable") || "No performance data available yet"}</p>
                <p className="text-slate-300 text-xs mt-1">{t("completeMockToSeeTrend") || "Complete a mock test to see your trend"}</p>
              </div>
            )}
          </div>

        </div>


        {/* DAILY STUDY */}

        <div className="bg-white rounded-xl p-5 shadow-sm border border-slate-100">

          <div className="flex items-center justify-between mb-1">
            <div className="flex items-center gap-2">
              <Zap size={16} className="text-cyan-500" />
              <h3 className="font-semibold text-slate-800">
                {t("dailySprint")}
              </h3>
            </div>
            {planInfo && (
              <span className="text-[10px] bg-cyan-50 text-cyan-600 px-2 py-0.5 rounded-full font-bold uppercase tracking-wider">
                {planInfo.targetExam} • {planInfo.dayLabel}
              </span>
            )}
          </div>

          <p className="text-slate-500 text-xs mb-4">
            {planInfo ? `${t("arthaFocus")} (${planInfo.date})` : t("arthaFocus")}
          </p>

          <div className="space-y-3 max-h-[220px] overflow-y-auto pr-1 custom-scrollbar">

            {dailyTasks.length > 0 ? (
              dailyTasks.map((task, idx) => (
                <ScheduleItem
                  key={task.id || idx}
                  time={task.timeSlot}
                  task={task.description}
                  status={task.completed ? "Completed" : task.missed ? "Missed" : "Pending"}
                  statusColor={task.completed ? "text-green-500" : task.missed ? "text-red-500" : "text-blue-500"}
                />
              ))
            ) : (
              <div className="text-center py-8">
                <p className="text-sm text-slate-400 font-medium">{t("noStudyPlanFound") || "No tasks available for today."}</p>
                <p className="text-xs text-slate-300 mt-1">{t("createPlanToSeeTasks") || "Generate a study plan to see your schedule."}</p>
              </div>
            )}

          </div>

          <button
            onClick={() => navigate("/studyplan")}
            className="mt-4 text-blue-600 text-xs font-bold hover:underline w-full text-right flex items-center justify-end gap-1"
          >
            {t("weeklyArchitect")}

          </button>

        </div>

      </div>

    </div>
  );
}
