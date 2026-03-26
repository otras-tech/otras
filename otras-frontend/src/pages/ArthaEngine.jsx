import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Brain, GraduationCap, TrendingUp, ShieldCheck, ChevronDown } from "lucide-react";
import axios from "axios";
import { useTranslation } from "../hooks/useTranslation";
import IntelligenceFeedback from "../components/artha/IntelligenceFeedback";

export default function ArthaEngine({ user }) {
  const navigate = useNavigate();
  const { t } = useTranslation();
  const [tierStatus, setTierStatus] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (user?.id) {
      fetchTierStatus();
    } else {
      setLoading(false);
    }
  }, [user]);

  const fetchTierStatus = async () => {
    try {
      setLoading(true);
      console.log("ARTHA: Fetching tier status", user.id);
      const resp = await axios.get(`http://localhost:4000/artha/status/${user.id}`);
      console.log("ARTHA: Tier status response", resp.data);
      setTierStatus(resp.data);
    } catch (err) {
      console.error("Failed to fetch tier status", err);
    } finally {
      setLoading(false);
    }
  };


  const handleTier2Action = () => {
    console.log("ARTHA: Tier-2 button clicked");
    console.log("ARTHA: Tier status", tierStatus);
    if (tierStatus?.tier2.subscriptionRequired) {
      navigate("/subscriptions");
    } else if (tierStatus?.tier2.unlocked) {
      console.log("ARTHA: Navigating to Tier assessment", 2);
      navigate("/tier-assessment/2");
    }
  };

  const handleTier3Action = () => {
    console.log("ARTHA: Tier-3 button clicked");
    console.log("ARTHA: Tier status", tierStatus);
    if (tierStatus?.tier3.subscriptionRequired) {
      navigate("/subscriptions");
    } else if (tierStatus?.tier3.unlocked) {
      console.log("ARTHA: Navigating to Tier assessment", 3);
      navigate("/tier-assessment/3");
    }
  };

  if (loading) {
    return (
      <div className="p-8 flex items-center justify-center min-h-[60vh]">
        <div className="text-center">
          <div className="w-12 h-12 border-4 border-blue-200 border-t-blue-600 rounded-full animate-spin mx-auto mb-4" />
          <p className="font-bold text-slate-500">{t("syncingEngineData")}</p>
        </div>
      </div>
    );
  }

  // Helper flags
  const t1 = tierStatus?.tier1;
  const t2 = tierStatus?.tier2;
  const t3 = tierStatus?.tier3;

  return (
    <div className="p-8 space-y-10">

      {/* HEADER */}
      <div className="flex items-start justify-between">
        <div>
          <p className="label" style={{ color: "var(--color-primary)" }}>
            {t("intelligenceEngine")}
          </p>
          <h1 className="page-title mt-2 uppercase">
            {t("arthaMultiTierJourney")}
          </h1>
          <p className="text-subtle mt-2">
            {t("completeTiersDesc")}
          </p>
        </div>

        {/* ENGINE STATUS */}
        <div className="app-card p-5 flex items-center gap-4">
          <ShieldCheck size={22} style={{ color: "var(--success)" }} />
          <div>
            <p className="label">
              {t("engineStatus")}
            </p>
            <p className="card-title" style={{ color: "var(--success)" }}>
              {t("activeSyncing")}
            </p>
          </div>
        </div>
      </div>


      {/* TIER CARDS */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">

        {/* TIER 1 */}
        <div className="app-card p-6 flex flex-col justify-between hover-lift">
          <div>
            <div
              className="w-12 h-12 rounded-lg flex items-center justify-center mb-4"
              style={{ background: "var(--color-primary-light)" }}
            >
              <Brain size={22} style={{ color: "var(--color-primary)" }} />
            </div>

            <h3 className="card-title">
              {t("tier1Foundational")}
            </h3>

            <p className="label mt-1" style={{ color: "var(--color-primary)" }}>
              {t("aptitudeReasoning")}
            </p>

            <p className="text-subtle mt-3">
              {t("tier1Desc")}
            </p>

            {/* PROGRESS */}
            <div className="mt-5">
              <div className="flex justify-between label mb-1">
                <span>{t("tierProgress")}</span>
                <span>{Math.min(100, Math.round(t1?.progress || 0))}%</span>
              </div>
              <div className="progress-bar">
                <div className="progress-fill" style={{ width: `${Math.min(100, Math.round(t1?.progress || 0))}%` }}></div>
              </div>
            </div>
          </div>

          <button
            onClick={() => {
              console.log("ARTHA: Tier-1 assessment started");
              navigate("/company-instructions", { state: { tier: 1 } });
            }}
            className={t1?.completed ? "btn-secondary mt-6" : "btn-primary mt-6"}
          >
            {t1?.completed ? t("retakeAssessment") : t("startAssessment")}
          </button>
        </div>


        {/* TIER 2 */}
        <div className={`app-card p-6 flex flex-col justify-between ${!t2?.unlocked && !t2?.subscriptionRequired ? "opacity-60" : "hover-lift"}`}>
          <div>
            <div
              className="w-12 h-12 rounded-lg flex items-center justify-center mb-4"
              style={{ background: t2?.unlocked ? "var(--color-primary-light)" : "var(--bg-light)" }}
            >
              <GraduationCap size={22} style={{ color: t2?.unlocked ? "var(--color-primary)" : "var(--text-secondary)" }} />
            </div>

            <h3 className="card-title" style={{ color: t2?.unlocked ? "var(--text-primary)" : "var(--text-secondary)" }}>
              {t("tier2Subject")}
            </h3>

            <p className="label mt-1" style={{ color: t2?.unlocked ? "var(--color-primary)" : "var(--text-secondary)" }}>
              {t("coreGovtTopics")}
            </p>

            <p className="text-subtle mt-3">
              {t("tier2Desc")}
            </p>

            {t2?.unlocked && (
              <div className="mt-5">
                <div className="flex justify-between label mb-1">
                  <span>{t("tierProgress")}</span>
                  <span>{Math.min(100, Math.round(t2?.progress || 0))}%</span>
                </div>
                <div className="progress-bar">
                  <div className="progress-fill" style={{ width: `${Math.min(100, Math.round(t2?.progress || 0))}%` }}></div>
                </div>
              </div>
            )}
          </div>

          <div>
            {t2?.subscriptionExpired ? (
              <div className="mt-4 p-3 bg-red-50 text-red-600 text-sm font-semibold rounded-lg border border-red-100 text-center leading-tight">
                {t("subscriptionExpiredMsg")}
              </div>
            ) : (!t2?.unlocked && !t2?.subscriptionRequired && (
              <div className="mt-6 text-center label uppercase">
                {t("completePreviousTier")}
              </div>
            ))}

            <button
              disabled={!t2?.unlocked && !t2?.subscriptionRequired}
              onClick={handleTier2Action}
              className={`mt-4 w-full ${t2?.subscriptionRequired ? "btn-primary bg-orange-600 hover:bg-orange-700 hover:text-white" : (t2?.completed ? "btn-secondary" : "btn-primary")}`}
              style={{ opacity: (!t2?.unlocked && !t2?.subscriptionRequired) ? 0.6 : 1 }}
            >
              {t2?.subscriptionExpired ? t("renewSubscription") : (t2?.subscriptionRequired ? t("takeSubscription") : (t2?.completed ? t("retakeAssessment") : t("startAssessment")))}
            </button>
          </div>
        </div>


        {/* TIER 3 */}
        <div className={`app-card p-6 flex flex-col justify-between ${!t3?.unlocked && !t3?.subscriptionRequired ? "opacity-60" : "hover-lift"}`}>
          <div>
            <div
              className="w-12 h-12 rounded-lg flex items-center justify-center mb-4"
              style={{ background: t3?.unlocked ? "var(--color-primary-light)" : "var(--bg-light)" }}
            >
              <TrendingUp size={22} style={{ color: t3?.unlocked ? "var(--color-primary)" : "var(--text-secondary)" }} />
            </div>

            <h3 className="card-title" style={{ color: t3?.unlocked ? "var(--text-primary)" : "var(--text-secondary)" }}>
              {t("tier3Intelligence")}
            </h3>

            <p className="label mt-1" style={{ color: t3?.unlocked ? "var(--color-primary)" : "var(--text-secondary)" }}>
              {t("aiRoadmapGen")}
            </p>

            <p className="text-subtle mt-3">
              {t("tier3Desc")}
            </p>

            {t3?.unlocked && (
              <div className="mt-5">
                <div className="flex justify-between label mb-1">
                  <span>{t("tierProgress")}</span>
                  <span>{Math.min(100, Math.round(t3?.progress || 0))}%</span>
                </div>
                <div className="progress-bar">
                  <div className="progress-fill" style={{ width: `${Math.min(100, Math.round(t3?.progress || 0))}%` }}></div>
                </div>
              </div>
            )}
          </div>

          <div>
            {t3?.subscriptionExpired ? (
              <div className="mt-4 p-3 bg-red-50 text-red-600 text-sm font-semibold rounded-lg border border-red-100 text-center leading-tight">
                {t("subscriptionExpiredMsg")}
              </div>
            ) : (!t3?.unlocked && !t3?.subscriptionRequired && (
              <div className="mt-6 text-center label uppercase">
                {t("completePreviousTier")}
              </div>
            ))}

            <button
              disabled={!t3?.unlocked && !t3?.subscriptionRequired}
              onClick={handleTier3Action}
              className={`mt-4 w-full ${t3?.subscriptionRequired ? "btn-primary bg-orange-600 hover:bg-orange-700 hover:text-white" : (t3?.completed ? "btn-secondary" : "btn-primary")}`}
              style={{ opacity: (!t3?.unlocked && !t3?.subscriptionRequired) ? 0.6 : 1 }}
            >
              {t3?.subscriptionExpired ? t("renewSubscription") : (t3?.subscriptionRequired ? t("takeSubscription") : (t3?.completed ? t("retakeAssessment") : t("startAssessment")))}
            </button>
          </div>
        </div>

      </div>

      {/* RECENT REPORTS SECTION */}
      {tierStatus?.recentReports && tierStatus.recentReports.length > 0 && (
        <div className="mt-10 animate-fade-in">
          <div className="flex items-center gap-2 mb-6">
            <TrendingUp size={20} className="text-blue-600" />
            <h2 className="section-title !text-xl uppercase m-0">{t("recentReports")}</h2>
          </div>
          <div className="grid grid-cols-1 gap-4">
            {[...tierStatus.recentReports].reverse().map((report) => (
              <details key={report.id} className="app-card overflow-hidden group transition-all duration-300 border-none shadow-md hover:shadow-lg">
                <summary className="p-5 cursor-pointer list-none flex items-center justify-between hover:bg-slate-50 transition-colors">
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 rounded-xl bg-blue-50 flex flex-col items-center justify-center text-blue-600 border border-blue-100">
                      <span className="text-[10px] uppercase font-bold leading-none">{t("tierLabel")}</span>
                      <span className="text-xl font-black leading-none">{report.tier}</span>
                    </div>
                    <div>
                      <h4 className="font-bold text-slate-800 text-lg">
                        {report.tier === 1 ? t("foundationalAptitude") : report.tier === 2 ? t("subjectCompetency") : t("intelligencePerformance")}
                      </h4>
                      <p className="text-xs text-slate-500 font-medium">
                        {t("completedOn")} {new Date(report.createdAt).toLocaleDateString(undefined, { day: 'numeric', month: 'long', year: 'numeric' })}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center gap-8">
                    <div className="hidden sm:block text-center px-4 border-r border-slate-100">
                      <p className="label text-[10px] uppercase opacity-60">{t("readiness")}</p>
                      <p className="text-xl font-bold text-blue-600">{Math.round(report.readinessIndex || 0)}%</p>
                    </div>
                    <div className="hidden sm:block text-center px-4">
                      <p className="label text-[10px] uppercase opacity-60">{t("percentile")}</p>
                      <p className="text-xl font-bold text-slate-700">{Math.round(report.percentile || 0)}</p>
                    </div>
                    <div className="w-8 h-8 rounded-full bg-slate-100 flex items-center justify-center group-open:rotate-180 transition-transform duration-300">
                      <ChevronDown size={18} className="text-slate-500" />
                    </div>
                  </div>
                </summary>
                <div className="p-8 border-t border-slate-100 bg-slate-50/30">
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
                    <div className="p-4 bg-white rounded-xl shadow-sm border border-slate-100">
                      <p className="label text-[10px] uppercase text-slate-400 mb-1">{t("scoreObtained")}</p>
                      <p className="text-2xl font-bold text-slate-800">{report.score}/{report.totalMarks}</p>
                    </div>
                    <div className="p-4 bg-white rounded-xl shadow-sm border border-slate-100">
                      <p className="label text-[10px] uppercase text-slate-400 mb-1">{t("accuracyRate")}</p>
                      <p className="text-2xl font-bold text-slate-800">{Math.round(report.accuracy || 0)}%</p>
                    </div>
                    {report.speed !== null && report.tier === 3 && (
                      <div className="p-4 bg-white rounded-xl shadow-sm border border-slate-100">
                        <p className="label text-[10px] uppercase text-slate-400 mb-1">{t("solvingSpeed")}</p>
                        <p className="text-2xl font-bold text-slate-800">{report.speed} <small className="text-xs font-normal">{t("secondsPerQuestion")}</small></p>
                      </div>
                    )}
                    {report.consistency !== null && report.tier === 3 && (
                      <div className="p-4 bg-white rounded-xl shadow-sm border border-slate-100">
                        <p className="label text-[10px] uppercase text-slate-400 mb-1">{t("consistency")}</p>
                        <p className="text-2xl font-bold text-slate-800">{Math.round(report.consistency)}%</p>
                      </div>
                    )}
                  </div>

                  {report.subjectBreakdown && (
                    <div className="mt-6 p-4 bg-blue-50/50 rounded-xl border border-blue-100">
                      <p className="label text-[10px] uppercase text-blue-600 mb-3 font-bold">{t("performanceBreakdown")}</p>
                      <div className="flex flex-wrap gap-3">
                        {Object.entries(report.subjectBreakdown).map(([subject, score]) => (
                          <div key={subject} className="px-3 py-1 bg-white rounded-full text-sm shadow-sm border border-blue-100 flex items-center gap-2">
                            <span className="capitalize font-medium text-slate-700">{subject}:</span>
                            <span className="font-bold text-blue-600">{Number(score)}%</span>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              </details>
            ))}
          </div>
        </div>
      )}

      {/* AI INTELLIGENCE REPORT */}
      {tierStatus?.feedback && (
        <div className="mt-10">
          <IntelligenceFeedback feedback={tierStatus.feedback} />
        </div>
      )}


      {/* WHY SECTION */}
      <div
        className="rounded-2xl p-10 flex flex-col md:flex-row justify-between items-center"
        style={{
          background:
            "linear-gradient(135deg,var(--color-primary),var(--color-primary-dark))",
          color: "white"
        }}
      >

        <div className="max-w-xl">
          <h2 className="section-title  mb-4 uppercase" style={{ color: "white" }}>
            {t("whyArthaAssessment")}
          </h2>
          <p
            className="text-subtle mb-6"
            style={{ color: "rgba(255,255,255,0.9)" }}
          >
            {t("whyArthaDesc")}
          </p>
          <div className="grid grid-cols-2 gap-4 text-sm">
            <p>✓ {t("predictiveAnalysis")}</p>
            <p>✓ {t("weaknessMapping")}</p>
            <p>✓ {t("milestoneScheduling")}</p>
            <p>✓ {t("certifiedReadiness")}</p>
          </div>
        </div>

        {/* READINESS CARD */}
        <div
          className="rounded-xl p-8 mt-6 md:mt-0 text-center"
          style={{
            background: "rgba(255,255,255,0.15)",
            backdropFilter: "blur(10px)"
          }}
        >
          <p
            className="label"
            style={{ color: "rgba(255,255,255,0.8)" }}
          >
            {t("currentReadiness")}
          </p>
          <h3 className="text-5xl font-bold mt-2">
            {tierStatus?.readinessIndex ? `${Math.round(tierStatus.readinessIndex)}%` : "0%"}
          </h3>


        </div>
      </div>
    </div>
  );
}
