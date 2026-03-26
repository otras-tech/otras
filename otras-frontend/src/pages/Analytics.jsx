import { useState, useEffect } from 'react';
import { Target, BookOpen, Award, Clock, TrendingUp, AlertCircle, Sparkles } from 'lucide-react';
import { useTranslation } from '../hooks/useTranslation';
import axios from 'axios';

export default function Analytics({ user }) {
  const { t } = useTranslation();
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (user?.id) {
      fetchData(user.id);
    } else {
      setLoading(false);
    }
  }, [user?.id]);

  const fetchData = async (userId) => {
    try {
      setLoading(true);
      const res = await axios.get(`http://localhost:4000/users/${userId}/dashboard`);
      setData(res.data);
    } catch (err) {
      console.error("Failed to fetch analytics data", err);
      setError("Failed to load analytics data");
    } finally {
      setLoading(false);
    }
  };

  const stats = data?.stats || { readinessIndex: 0, testsCompleted: 0, recentTend: [], percentile: 0, logicalScore: 0, quantScore: 0, verbalScore: 0 };
  const recentResults = data?.recentResults || [];

  // 1. Calculate Average Accuracy from recent results
  const averageAccuracy = recentResults.length > 0
    ? Math.round(recentResults.reduce((acc, curr) => acc + (curr.percentage || 0), 0) / recentResults.length)
    : 0;

  // 2. Calculate Consistency (based on variance of scores)
  const calculateConsistency = (results) => {
    if (results.length < 2) return 100;
    const scores = results.map(r => r.percentage || 0);
    const mean = scores.reduce((a, b) => a + b) / scores.length;
    const stdDev = Math.sqrt(scores.map(x => Math.pow(x - mean, 2)).reduce((a, b) => a + b) / scores.length);
    return Math.max(0, Math.round(100 - stdDev));
  };
  const consistency = calculateConsistency(recentResults);

  // 3. Transform Trend Data for Graph from all mockTests
  const mockTests = data?.mockTests || [];
  const sortedTests = [...mockTests].sort((a, b) => new Date(a.createdAt) - new Date(b.createdAt));
  
  const trendDataMap = new Map();
  sortedTests.forEach(test => {
    const date = new Date(test.createdAt).toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
    if (!trendDataMap.has(date)) trendDataMap.set(date, { totalScore: 0, count: 0 });
    const current = trendDataMap.get(date);
    current.totalScore += (test.score || 0);
    current.count += 1;
  });

  let displayTrends = Array.from(trendDataMap.entries()).map(([date, stats]) => ({
    date,
    score: Math.round(stats.totalScore / stats.count)
  }));

  if (displayTrends.length === 1) {
    displayTrends = [{ date: 'Start', score: 0 }, ...displayTrends];
  } else if (displayTrends.length === 0) {
    displayTrends = [
      { date: 'Start', score: 0 },
      ...stats.recentTend.map((s, i) => ({ date: `Test ${i+1}`, score: s }))
    ];
  }

  // Dynamic Y-Axis Scaling
  let minScore = 0;
  let maxScore = 100;
  if (displayTrends.length > 0 && mockTests.length > 0) {
    const scores = displayTrends.map(t => t.score);
    const dataMin = Math.min(...scores);
    const dataMax = Math.max(...scores);
    const padding = Math.max((dataMax - dataMin) * 0.2, 5);
    maxScore = Math.min(100, Math.ceil(dataMax + padding));
    minScore = Math.max(0, Math.floor(dataMin - padding));
  }
  const range = (maxScore - minScore) || 1;

  const yLabels = [
    maxScore,
    Math.round(minScore + range * 0.75),
    Math.round(minScore + range * 0.5),
    Math.round(minScore + range * 0.25),
    minScore
  ];

  // 4. Subject Heatmap strictly maps to the 3 columns in the ArthaProfile table.
  let subjectHeatmap = [];

  // Always fetch 'logicalScore', 'quantScore', and 'verbalScore' directly from ArthaProfile
  if (stats) {
    if (stats.quantScore !== undefined) {
      subjectHeatmap.push({ subject: 'Quant', accuracy: Math.max(0, Math.round(stats.quantScore)) });
    }
    if (stats.verbalScore !== undefined) {
      subjectHeatmap.push({ subject: 'Verbal', accuracy: Math.max(0, Math.round(stats.verbalScore)) });
    }
    if (stats.logicalScore !== undefined) {
      subjectHeatmap.push({ subject: 'Logical', accuracy: Math.max(0, Math.round(stats.logicalScore)) });
    }
  }

  // Final fallback if the Artha Profile hasn't been initialized with proper scores at all
  if (subjectHeatmap.length === 0 && mockTests.length > 0) {
    const avgScore = Math.max(0, Math.round(mockTests.reduce((acc, t) => acc + (t.score || 0), 0) / mockTests.length));
    if (avgScore > 0) {
      subjectHeatmap.push({ subject: 'Overall Readiness', accuracy: avgScore });
    }
  }

  subjectHeatmap = subjectHeatmap.map(item => {
    let colorClass = 'bg-slate-300';
    if (item.accuracy >= 80) colorClass = 'bg-[#1e3a8a]'; // Strong (Dark Blue)
    else if (item.accuracy >= 50) colorClass = 'bg-[#3b5998]'; // Medium (Blue)
    else colorClass = 'bg-[#93c5fd]'; // Light (Light Blue)
    return { ...item, colorClass };
  }).sort((a, b) => b.accuracy - a.accuracy);

  if (loading) return (
    <div className="min-h-screen flex items-center justify-center bg-[#f8fafc]">
      <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
    </div>
  );

  if (error) return (
    <div className="min-h-screen flex items-center justify-center bg-[#f8fafc]">
      <div className="text-center p-8 bg-white rounded-3xl shadow-xl border border-red-100">
        <AlertCircle size={48} className="text-red-500 mx-auto mb-4" />
        <h2 className="text-xl font-bold text-slate-800 mb-2">{error}</h2>
        <button onClick={() => fetchData(user.id)} className="text-blue-600 font-bold hover:underline">Try Again</button>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-[#f8fafc] p-8 animate-in fade-in duration-500">
      <div className="max-w-7xl mx-auto">
        {/* HEADER */}
        <div className="mb-10">
          <h1 className="text-4xl font-black text-[#1e3a8a] mb-2 tracking-tight">{t("readinessAnalytics")}</h1>
          <p className="text-slate-500 text-lg font-medium">{t("trackEvolution")}</p>
        </div>

        {/* STATS CARDS */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-10">
          <StatsCard
            title={t("arthaReadinessIndex")}
            value={stats.readinessIndex !== undefined ? `${stats.readinessIndex}%` : "N/A"}
            change={stats.readinessIndex > 0 ? `${stats.readinessIndex}%` : "—"}
            changeLabel={t("highProbability")}
            icon={<Target size={20} className="text-slate-400" />}
          />
          <StatsCard
            title={t("mocksTaken")}
            value={stats.testsCompleted || "0"}
            change={recentResults.length > 0 ? `+${recentResults.filter(r => new Date(r.createdAt) > new Date(Date.now() - 30 * 24 * 60 * 60 * 1000)).length}` : "0"}
            changeLabel={t("last30Days")}
            icon={<BookOpen size={20} className="text-slate-400" />}
          />
          <StatsCard
            title={t("averageAccuracy")}
            value={`${averageAccuracy}%`}
            change={recentResults.length > 1 ? `${Math.round(averageAccuracy - (recentResults[1].score / (recentResults[1].test?.questions?.length || 1) * 100))}%` : "—"}
            changeLabel={t("stablePerformance")}
            icon={<Award size={20} className="text-slate-400" />}
          />
          <StatsCard
            title={t("studyConsistency")}
            value={`${consistency}%`}
            change={consistency > 80 ? "+5%" : "—"}
            changeLabel={t("last7Days")}
            icon={<Clock size={20} className="text-slate-400" />}
          />
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* MAIN TIMELINE CHART */}
          <div className="lg:col-span-2 bg-white rounded-[32px] p-10 shadow-xl shadow-slate-200/40 border border-slate-100 flex flex-col">
            <div className="flex items-center gap-3 mb-2">
              <TrendingUp size={24} className="text-[#3b5998]" />
              <h2 className="text-2xl font-black text-slate-800 tracking-tight">{t("readinessEvolutionTimeline")}</h2>
            </div>
            <p className="text-slate-400 font-bold text-sm mb-12">{t("improvementCurve")}</p>

            <div className="relative flex-1 min-h-[350px] w-full mt-4">
              {/* Y-AXIS LABELS */}
              <div className="absolute left-0 top-0 h-[calc(100%-40px)] flex flex-col justify-between text-[11px] font-black text-slate-300 pb-2">
                {yLabels.map((lbl, i) => (
                  <span key={i}>{lbl}</span>
                ))}
              </div>

              {/* GRID LINES */}
              <div className="absolute left-10 right-0 top-0 h-[calc(100%-40px)] flex flex-col justify-between">
                {[...Array(5)].map((_, i) => (
                  <div key={i} className="w-full border-t border-slate-50 relative"></div>
                ))}
              </div>

              {/* THE CHART LINE (SVG) */}
              <div className="absolute left-10 right-0 top-0 h-[calc(100%-40px)]">
                <svg className="w-full h-full overflow-visible" preserveAspectRatio="none" viewBox="0 0 1000 400">
                  <defs>
                    <linearGradient id="lineGradient" x1="0%" y1="0%" x2="0%" y2="100%">
                      <stop offset="0%" stopColor="#3b5998" stopOpacity="0.1" />
                      <stop offset="100%" stopColor="#3b5998" stopOpacity="0" />
                    </linearGradient>
                  </defs>
                  
                  {displayTrends.length > 0 ? (
                    <>
                      {/* Fill area */}
                      <path
                        d={`M 0 400 ${displayTrends.map((t, i) => `L ${i * (1000 / (displayTrends.length > 1 ? displayTrends.length - 1 : 1))} ${400 - (((t.score - minScore) / range) * 400)}`).join(' ')} L 1000 400 Z`}
                        fill="url(#lineGradient)"
                      />
                      {/* Stroke path */}
                      <path
                        d={`M 0 ${400 - (((displayTrends[0].score - minScore) / range) * 400)} ${displayTrends.slice(1).map((t, i) => `L ${(i + 1) * (1000 / (displayTrends.length > 1 ? displayTrends.length - 1 : 1))} ${400 - (((t.score - minScore) / range) * 400)}`).join(' ')}`}
                        fill="none"
                        stroke="#3b5998"
                        strokeWidth="4"
                        strokeLinecap="round"
                        className="drop-shadow-lg"
                      />
                      {/* Glow point (last point) */}
                      <circle cx="1000" cy={400 - (((displayTrends[displayTrends.length - 1].score - minScore) / range) * 400)} r="6" fill="#3b5998" />
                      <circle cx="1000" cy={400 - (((displayTrends[displayTrends.length - 1].score - minScore) / range) * 400)} r="12" fill="#3b5998" className="animate-ping opacity-20" />
                    </>
                  ) : (
                    <text x="500" y="200" textAnchor="middle" className="fill-slate-300 font-bold text-lg">{t("insufficientData") || "Insufficient data for trend"}</text>
                  )}
                </svg>
              </div>

              {/* X-AXIS LABELS */}
              <div className="absolute bottom-0 left-10 right-0 flex justify-between text-[11px] font-black text-slate-300 px-2 uppercase tracking-tighter">
                {displayTrends.map((t, i) => (
                  <span key={i}>{t.date}</span>
                ))}
              </div>
            </div>
          </div>

          {/* SIDE PANEL */}
          <div className="space-y-6">
            {/* SUBJECT STRENGTH HEATMAP */}
            <div className="bg-white rounded-[32px] p-10 shadow-xl shadow-slate-200/40 border border-slate-100">
              <h3 className="text-xl font-black text-slate-800 mb-1 tracking-tight">{t("subjectStrengthHeatmap")}</h3>
              <p className="text-slate-400 font-bold text-xs mb-8">{t("accuracyDistribution")}</p>

              <div className="space-y-8">
                {subjectHeatmap.length > 0 ? (
                  subjectHeatmap.map((item, idx) => (
                    <SubjectProgress key={idx} label={item.subject} value={item.accuracy} colorClass={item.colorClass} />
                  ))
                ) : (
                  <p className="text-slate-400 text-sm font-bold text-center py-4">{t("noSubjectData") || "No subject data available."}</p>
                )}
              </div>
            </div>


          </div>
        </div>
      </div>
    </div>
  );
}

function StatsCard({ title, value, change, changeLabel, icon }) {
  return (
    <div className="bg-white p-8 rounded-[32px] shadow-lg shadow-slate-200/40 border border-slate-50 flex flex-col justify-between hover:scale-[1.02] transition-all duration-300 group">
      <div className="flex justify-between items-start mb-6">
        <h4 className="text-[10px] font-black text-slate-300 tracking-[0.2em] uppercase">{title}</h4>
        <div className="w-10 h-10 bg-slate-50 rounded-2xl flex items-center justify-center group-hover:bg-blue-50 group-hover:text-blue-500 transition-colors">
          {icon}
        </div>
      </div>
      <div>
        <div className="text-4xl font-black text-[#1e3a8a] mb-2">{value}</div>
        <div className="flex items-center gap-2">
          <span className="text-blue-500 text-xs font-black">{change}</span>
          <span className="text-slate-400 text-[10px] font-black uppercase tracking-wider">{changeLabel}</span>
        </div>
      </div>
    </div>
  );
}

function SubjectProgress({ label, value, colorClass = "bg-[#3b5998]" }) {
  return (
    <div className="space-y-3">
      <div className="flex justify-between items-center text-sm font-black tracking-tight uppercase">
        <span className="text-slate-500 tracking-wider text-[11px] font-black">{label}</span>
        <span className="text-[#3b5998] text-xs">{value}%</span>
      </div>
      <div className="h-2.5 bg-slate-50 rounded-full overflow-hidden border border-slate-100/50">
        <div
          className={`h-full ${colorClass} rounded-full transition-all duration-1000 ease-out`}
          style={{ width: `${value}%` }}
        />
      </div>
    </div>
  );
}
