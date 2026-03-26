import React, { useState, useEffect, useCallback, useRef } from "react";
import { Sparkles, Rocket, Calendar, Map, CheckCircle2, Target, Zap, ListChecks, ChevronDown, ChevronUp, Lock, ChevronRight, Crown } from "lucide-react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { useTranslation } from "../hooks/useTranslation";
import FormattedText from "../components/FormattedText";

const CareerAI = ({ user }) => {
  const { t, language } = useTranslation();
  const navigate = useNavigate();
  const isInitialMount = useRef(true);
  const [hasSubscription, setHasSubscription] = useState(false);

  const [formData, setFormData] = useState({
    logicalScore: 0,
    quantScore: 0,
    verbalScore: 0,
    selectedExam: "",
    interests: "",
    learningPattern: "",
    confidenceIndex: 50,
    aspirations: "",
  });

  const [careerData, setCareerData] = useState({
    summary: "",
    recommendations: [],
    sixMonth: [],
    oneYear: []
  });

  const [activeMonth, setActiveMonth] = useState(null);
  const [loading, setLoading] = useState(false);

  const EXAM_OPTIONS = [
  "UPSC Civil Services",
  "SSC CGL",
  "IBPS PO",
  "RRB NTPC",
  "State PSC",
  "NDA",
  "CDS",
  "CAPF (Assistant Commandant)",
  "EPFO",
  "LIC AAO"
];

  const LEARNING_PATTERNS = {
  "UPSC Civil Services": [
    "Conceptual + Current Affairs",
    "Answer Writing Practice",
    "Revision Cycles"
  ],
  "SSC CGL": [
    "Speed + Accuracy",
    "Mock Test Practice",
    "Shortcut Techniques"
  ],
  "IBPS PO": [
    "Quant Drills",
    "Reasoning Puzzles",
    "Daily Mock Tests"
  ],
  "RRB NTPC": [
    "General Awareness Focus",
    "Speed Tests",
    "Previous Papers"
  ],
  "State PSC": [
    "Static GK + State GK",
    "Writing Practice",
    "Revision"
  ],
  "NDA": [
    "Math + General Ability",
    "Physical Routine",
    "Mock Tests"
  ],
  "CDS": [
    "English + GK Focus",
    "Mock Tests",
    "Speed Practice"
  ],
  "CAPF (Assistant Commandant)": [
    "Paper 1 Objective Practice",
    "Essay & Report Writing",
    "Physical Fitness Routine"
  ],
  "EPFO": [
    "Static + Current Affairs",
    "Labour Laws Basics",
    "Mock Tests"
  ],
  "LIC AAO": [
    "Quant + Reasoning Practice",
    "Insurance Awareness",
    "Sectional Mock Tests"
  ]
};

  // Robust data normalization to prevent render crashes
  const sixMonth = Array.isArray(careerData?.sixMonth) ? careerData.sixMonth : [];
  const oneYear = Array.isArray(careerData?.oneYear) ? careerData.oneYear : [];
  const recommendations = Array.isArray(careerData?.recommendations) ? careerData.recommendations : [];

  const generateRoadmap = useCallback(async (isAuto = false) => {
    setLoading(true);
    console.log(`CareerAI: Request sent${isAuto ? ' [Auto-Regenerate]' : ''}`);

    try {
      const payload = {
        logicalScore: formData.logicalScore,
        quantScore: formData.quantScore,
        verbalScore: formData.verbalScore,
        interests: (formData.interests || "").split(",").map(i => i.trim()).filter(Boolean),
        learningPattern: formData.learningPattern,
        confidenceIndex: formData.confidenceIndex,
        aspirations: formData.aspirations,
        selectedExam: formData.selectedExam,
        language,
      };

      const resp = await axios.post("http://localhost:4000/career-ai/generate-roadmap", payload);

      console.log("CareerAI: Response received");
      const result = resp.data?.roadmap;

      if (result && typeof result === 'object') {
        // Ensure exactly 6 months for the UI boxes
        let finalSixMonth = Array.isArray(result.sixMonth) ? [...result.sixMonth] : [];
        while (finalSixMonth.length < 6) {
          finalSixMonth.push({ month: `Month ${finalSixMonth.length + 1}`, tasks: [] });
        }

        setCareerData({
          summary: result.summary || "Ready to begin.",
          recommendations: Array.isArray(result.recommendations) ? result.recommendations : [],
          sixMonth: finalSixMonth,
          oneYear: Array.isArray(result.oneYear) ? result.oneYear : []
        });

        console.log("CareerAI: Parsed successfully");

        sessionStorage.setItem("careerAI_data", JSON.stringify({
          data: result,
          language: language,
          formData: formData
        }));
      }
    } catch (err) {
      console.error("CareerAI Error:", err);
      setCareerData({
        summary: "Our AI system is temporarily unavailable. Please try again in a few moments.",
        recommendations: ["Self-review fundamentals", "Practice consistently"],
        sixMonth: [{ month: "Phase 1", tasks: ["Reconnect and retry"] }],
        oneYear: [{ phase: "Growth Phase", tasks: ["Final preparation"] }]
      });
    } finally {
      setLoading(false);
    }
  }, [formData, language]);

  useEffect(() => {
    const fetchArthaProfile = async () => {
      if (!user?.id) return;
      try {
        console.log("CareerAI: Syncing with Artha Profile...");
        const resp = await axios.get(`http://localhost:4000/artha/status/${user.id}`);
        const status = resp.data;

        if (status) {
          setFormData(prev => ({
            ...prev,
            logicalScore: status.logicalScore || 0,
            quantScore: status.quantScore || 0,
            verbalScore: status.verbalScore || 0,
            selectedExam: status.selectedExam || "",
            confidenceIndex: status.readinessIndex || 50
          }));
          console.log("CareerAI: Values synced successfully");
        }
      } catch (err) {
        console.error("CareerAI: Sync failed", err);
      }
    };

    fetchArthaProfile();

    const saved = sessionStorage.getItem("careerAI_data");
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        if (parsed.language !== language) {
          setCareerData({ summary: "", recommendations: [], sixMonth: [], oneYear: [] });
          if (!isInitialMount.current) generateRoadmap(true);
        } else if (parsed.data) {
          setCareerData(parsed.data);
          if (parsed.formData) setFormData(parsed.formData);
        }
      } catch (e) {
        console.warn("Invalid saved data");
      }
    }
    isInitialMount.current = false;
  }, [language, user?.id]);

  useEffect(() => {
    const checkSub = async () => {
      if (!user?.id) return;
      try {
        const res = await fetch(`http://localhost:4000/users/${user.id}/tier-status`);
        if (res.ok) {
          const data = await res.json();
          setHasSubscription(!!data.hasActiveSubscription);
        }
      } catch (err) {
        console.error("Subscription check failed", err);
      }
    };
    checkSub();
  }, [user?.id]);

  const handleUnlockNow = () => {
    navigate("/subscriptions");
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value, ...(name === "interests" && { learningPattern: "" }) }));
  };

  const handleSliderChange = (e) => {
    const val = parseInt(e.target.value);
    setFormData(prev => ({ ...prev, confidenceIndex: val }));
  };

  const safeRender = (val) => {
    if (val === null || val === undefined) return "";
    if (typeof val === 'object') {
      if (Array.isArray(val)) return val.map(item => safeRender(item)).join(", ");
      return Object.values(val)
        .map(v => (typeof v === 'object' ? safeRender(v) : v))
        .join(" ");
    }
    return String(val);
  };

  const toggleMonth = (index) => {
    if (hasSubscription) {
      setActiveMonth(activeMonth === index ? null : index);
    } else {
      // For non-subscribers, only allow expanding month 1
      if (index === 0) {
        setActiveMonth(activeMonth === index ? null : index);
      }
    }
  };

  return (
    <div className="p-8 space-y-10">
      {/* HEADER */}
      <div className="flex justify-between items-start">
        <div>
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full label bg-blue-50 text-blue-600 border border-blue-100">
            <Sparkles size={12} />
            {t("arthaIntelligenceTier3")}
          </div>
          <h1 className="page-title mt-3 uppercase font-black tracking-tight">
            {t("intelligenceAnalysisRoadmap")}
          </h1>
          <p className="text-subtle mt-1 italic font-medium">
            {t("synthesisDesc")}
          </p>
        </div>

        {careerData?.summary && (
          <span className="badge-success flex items-center gap-1 shadow-sm border border-emerald-100">
            <CheckCircle2 size={14} />
            {t("certifiedRoadmap")}
          </span>
        )}
      </div>

      <div className="space-y-8">

        {/* 🔹 TOP: AI MENTOR SUMMARY (FULL WIDTH) */}
        {!careerData?.summary && !loading ? (
          <div className="app-card h-full p-16 text-center flex flex-col items-center justify-center border-dashed border-2 bg-slate-50/50 opacity-60">
            <Map size={48} className="text-slate-300 mb-6" />
            <h2 className="section-title text-xl mb-3">{t("readyForAnalysis")}</h2>
            <p className="text-subtle max-w-sm mx-auto font-medium">{t("readyForAnalysisDesc")}</p>
          </div>
        ) : (
          <div className={`app-card p-10 bg-white border border-slate-100 shadow-sm transition-all ${loading ? 'opacity-40 blur-[1px]' : 'opacity-100 shadow-xl shadow-slate-100'}`}>
            <h4 className="text-[10px] uppercase tracking-[0.3em] font-black text-blue-600 mb-8 flex items-center gap-3 border-b pb-4 border-slate-50">
              <Sparkles size={16} className="fill-blue-600/20" /> {t("aiMentorSummary")}
            </h4>
            <div className="relative">
              <div className="absolute -top-6 -left-4 text-slate-100 font-serif text-8xl opacity-40 select-none">"</div>
              <p className="text-2xl leading-relaxed text-slate-700 font-semibold italic relative z-10 px-6 drop-shadow-sm">
                <FormattedText text={safeRender(careerData?.summary)} />
              </p>
              <div className="absolute -bottom-10 -right-4 text-slate-100 font-serif text-8xl opacity-40 rotate-180 select-none">"</div>
            </div>
          </div>
        )}

        {/* 🔹 MIDDLE: FORM (LEFT) + ROADMAP (RIGHT) */}
        <div className="grid lg:grid-cols-[420px_1fr] gap-8">

          {/* LEFT: FORM */}
          <div className="app-card p-8 bg-white border border-slate-100 shadow-sm rounded-3xl self-start">
            <div className="mb-6">
              <h3 className="section-title !text-xl flex items-center gap-2">
                <Target size={20} className="text-blue-600" />
                {t("arthaDataInputs")}
              </h3>
              <p className="text-subtle font-medium">{t("synthesizeProfiles")}</p>
            </div>

            <div className="space-y-6">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="label">{t("logicalProfile")}</label>
                  <input type="number" name="logicalScore" value={formData.logicalScore || 0} onChange={handleInputChange} className="input w-full bg-slate-50 border-slate-100 font-bold" />
                </div>
                <div>
                  <label className="label">{t("quantProfile")}</label>
                  <input type="number" name="quantScore" value={formData.quantScore || 0} onChange={handleInputChange} className="input w-full bg-slate-50 border-slate-100 font-bold" />
                </div>
              </div>

              <div>
                <label className="label">{t("verbalAbility")}</label>
                <input type="number" name="verbalScore" value={formData.verbalScore || 0} onChange={handleInputChange} className="input w-full bg-slate-50 border-slate-100 font-bold" />
              </div>

              <div>
                <label className="label">{t("interests")}</label>
                <select
                  name="interests"
                  value={formData.interests || ""}
                  onChange={handleInputChange}
                  className="input w-full bg-slate-50 border-slate-100 font-medium"
                >
                  <option value="">Select Exam</option>
                  {EXAM_OPTIONS.map((exam, i) => (
                    <option key={i} value={exam}>{exam}</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="label">{t("learningPattern")}</label>
                <select
                  name="learningPattern"
                  value={formData.learningPattern || ""}
                  onChange={handleInputChange}
                  className="input w-full bg-slate-50 border-slate-100 font-medium"
                  disabled={!formData.interests}
                >
                  <option value="">Select Learning Pattern</option>
                  {(LEARNING_PATTERNS[formData.interests] || []).map((pattern, i) => (
                    <option key={i} value={pattern}>{pattern}</option>
                  ))}
                </select>
              </div>

              <div>
                <div className="flex justify-between mb-1 label">
                  <span className="font-bold">{t("confidenceIndex")}</span>
                  <span className="text-blue-600 font-black">{formData.confidenceIndex || 0}%</span>
                </div>
                <input type="range" min="0" max="100" value={formData.confidenceIndex || 0} onChange={handleSliderChange} className="w-full h-2 bg-slate-100 rounded-lg appearance-none cursor-pointer accent-blue-600" />
              </div>

              <div>
                <label className="label">{t("longTermAspirations")}</label>
                <textarea
                  name="aspirations"
                  placeholder="e.g., Crack UPSC and build a stable career"
                  value={formData.aspirations || ""}
                  onChange={handleInputChange}
                  rows={3}
                  className="input w-full bg-slate-50 border-slate-100 resize-none font-medium"
                />
              </div>

              <button onClick={() => generateRoadmap()} disabled={loading} className="btn-primary w-full py-4 flex items-center justify-center gap-3 shadow-lg shadow-blue-500/20 active:scale-95">
                {loading ? <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" /> : <><Zap size={18} className="fill-white" />{t("generateMyRoadmap")}</>}
              </button>
            </div>
          </div>

          {/* RIGHT: ROADMAP */}
          {(careerData?.summary || loading) && (
            <div className={`app-card p-10 bg-white border border-slate-100 shadow-sm transition-all relative overflow-hidden ${loading ? 'opacity-50 animate-pulse' : 'opacity-100'}`}>
              <div className="absolute top-0 right-0 p-8 opacity-5">
                <Calendar size={120} />
              </div>

              <div className="flex items-center justify-between mb-8">
                <div className="flex items-center gap-4">
                  <div className="p-3 bg-indigo-50 rounded-2xl text-indigo-600 shadow-sm border border-indigo-100">
                    <Calendar size={28} />
                  </div>
                  <div>
                    <h3 className="section-title !text-xl mb-1">{t("sixMonthMap")}</h3>
                    <p className="text-[10px] uppercase tracking-[0.2em] font-black text-slate-400">Strategic Execution Timeline</p>
                  </div>
                </div>

                {/* Premium Unlock Button - Only show when no subscription */}
                {!hasSubscription && sixMonth.length > 0 && (
                  <button
                    onClick={handleUnlockNow}
                    className="flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-600 hover:to-orange-600 text-white text-xs font-bold uppercase tracking-wider rounded-xl shadow-lg shadow-amber-500/30 transition-all duration-300 hover:shadow-xl hover:scale-105"
                  >
                    <Crown size={14} />
                    Unlock Premium Roadmap
                    <ChevronRight size={14} />
                  </button>
                )}
              </div>

              <div className="flex flex-col gap-5">
                {Array.from({ length: 6 }).map((_, i) => {
                  const monthInfo = sixMonth[i] || {};
                  const isExpanded = activeMonth === i;
                  const isLocked = !hasSubscription;
                  const isMonthOne = i === 0;

                  // Get tasks for display
                  const allTasks = monthInfo.tasks || [];
                  const firstTask = allTasks[0] || "";
                  const remainingTasks = allTasks.slice(1);

                  return (
                    <div
                      key={i}
                      className={`
                        app-card p-5 transition-all border-l-4 group duration-300
                        ${isExpanded ? 'border-l-blue-600 shadow-lg bg-slate-50/50' : 'border-l-slate-200 hover:border-l-blue-400 hover:bg-slate-50'}
                        ${isLocked && !isMonthOne ? 'cursor-not-allowed blurred-month-card' : 'cursor-pointer'}
                      `}
                      onClick={() => toggleMonth(i)}
                    >
                      {/* Content - Blurred for locked months 2-6 */}
                      <div className={isLocked && !isMonthOne ? "blurred-content" : ""}>
                        <div className="flex justify-between items-center">
                          <h4 className="font-bold text-slate-800 flex items-center gap-3 capitalize">
                            <span className={`w-8 h-8 rounded-xl flex items-center justify-center text-xs font-black ${isExpanded ? 'bg-blue-600 text-white' :
                              isLocked && !isMonthOne ? 'bg-slate-200 text-slate-400' : 'bg-slate-100 text-slate-500'
                              }`}>
                              {i + 1}
                            </span>
                            {t("month")} {i + 1}
                          </h4>
                          <ChevronDown size={20} className={`${isExpanded ? 'rotate-180 text-blue-600' : 'text-slate-300'} transition-transform duration-300`} />
                        </div>

                        {/* Content Area - Only show when expanded */}
                        {isExpanded && (
                          <div className="mt-4">
                            {/* Month 1 - Show first task clear, blur remaining if locked */}
                            {isMonthOne && (
                              <div>
                                {firstTask && (
                                  <div className="text-sm text-slate-700 flex gap-3 p-3 bg-white/80 rounded-xl mb-3">
                                    <CheckCircle2 size={16} className="text-emerald-500 shrink-0 mt-0.5" />
                                    <span><FormattedText text={safeRender(firstTask)} /></span>
                                  </div>
                                )}
                                {remainingTasks.length > 0 && (
                                  <div className={isLocked ? "blur-effect" : ""}>
                                    {remainingTasks.map((task, idx) => (
                                      <div key={idx} className="text-sm text-slate-600 flex gap-3 p-3 bg-white/60 rounded-xl mb-2">
                                        <CheckCircle2 size={14} className="text-emerald-500 shrink-0 mt-0.5" />
                                        <span><FormattedText text={safeRender(task)} /></span>
                                      </div>
                                    ))}
                                  </div>
                                )}
                              </div>
                            )}

                            {/* Months 2-6 - Apply blur to ALL tasks when locked */}
                            {!isMonthOne && (
                              <>
                                {allTasks.length === 0 ? (
                                  <div className="text-sm text-slate-400 italic p-3">
                                    No tasks specified for this month
                                  </div>
                                ) : (
                                  <div className={isLocked ? "blur-effect" : "space-y-2"}>
                                    {allTasks.map((task, idx) => (
                                      <div key={idx} className="text-sm text-slate-600 flex gap-3 p-3 bg-white/60 rounded-xl mb-2">
                                        <CheckCircle2 size={14} className="text-emerald-500 shrink-0 mt-0.5" />
                                        <span><FormattedText text={safeRender(task)} /></span>
                                      </div>
                                    ))}
                                  </div>
                                )}
                              </>
                            )}
                          </div>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          )}
        </div>

        {/* 3. BOTTOM: RECOMMENDATIONS + 1 YEAR */}
        {sixMonth.length > 0 && (
          <div className={`grid lg:grid-cols-2 gap-8 transition-all ${loading ? 'opacity-40' : 'opacity-100'}`}>
            {/* Strategic Recommendations */}
            <div className="app-card p-8 bg-white border border-slate-100 shadow-sm">
              <h4 className="text-[10px] uppercase tracking-[0.3em] font-black text-emerald-600 mb-8 border-b pb-4 flex items-center gap-2">
                <ListChecks size={16} />{t("strategicRecommendations")}
              </h4>
              <ul className="space-y-4">
                {recommendations.map((rec, i) => {
                  const isFirst = i === 0;
                  const isLocked = !hasSubscription;

                  return (
                    <li
                      key={i}
                      className={`flex gap-4 text-sm p-5 rounded-2xl transition-all group ${isFirst
                        ? 'bg-emerald-50 border border-emerald-100'
                        : 'bg-slate-50/50 border border-slate-100/50'
                        }`}
                    >
                      <div className={`shrink-0 w-8 h-8 rounded-xl flex items-center justify-center text-xs font-black transition-transform ${isFirst
                        ? 'bg-emerald-600 text-white'
                        : 'bg-emerald-100 text-emerald-600 group-hover:scale-110'
                        } ${isLocked && !isFirst ? "blurred-number" : ""}`}>
                        {i + 1}
                      </div>
                      <div className={`flex-1 ${isLocked && !isFirst ? "blur-effect-text" : ""}`}>
                        <span className="font-bold leading-relaxed">
                          <FormattedText text={safeRender(rec)} />
                        </span>
                      </div>
                    </li>
                  );
                })}
              </ul>
            </div>

            {/* One Year Trajectory */}
            <div className="app-card p-8 bg-white border border-slate-100 shadow-sm">
              <div className="flex items-center gap-4 mb-8 pb-4 border-b border-slate-50">
                <div className="p-3 bg-blue-50 rounded-2xl text-blue-600 shadow-sm"><Rocket size={24} /></div>
                <h3 className="section-title !text-xl">{t("oneYearTrajectory")}</h3>
              </div>

              <div className="space-y-6">
                {oneYear.map((phase, i) => {
                  const isFirstPhase = i === 0;
                  const isLocked = !hasSubscription;
                  const allTasks = Array.isArray(phase.tasks) ? phase.tasks : [];
                  const firstTask = allTasks[0] || "";
                  const remainingTasks = allTasks.slice(1);

                  return (
                    <div
                      key={i}
                      className={`p-6 rounded-3xl transition-all relative ${isFirstPhase
                        ? 'bg-blue-50 border border-blue-100'
                        : 'bg-slate-50 border border-slate-100'
                        } ${isLocked && !isFirstPhase ? 'blurred-phase-card' : ''}`}
                    >
                      <div className={isLocked && !isFirstPhase ? "blurred-content" : ""}>
                        <h4 className="font-black text-[10px] uppercase tracking-widest text-blue-600 mb-4 flex items-center gap-3">
                          <Zap size={14} className="fill-blue-600 shadow-sm" /> {safeRender(phase.phase)}
                        </h4>

                        {/* Tasks */}
                        <div className="space-y-3">
                          {/* First Phase - Show first task clear, blur remaining if locked */}
                          {isFirstPhase && (
                            <>
                              {firstTask && (
                                <div className="text-sm text-slate-700 font-bold flex gap-3 p-3 bg-white/80 rounded-xl">
                                  <CheckCircle2 size={16} className="text-emerald-500 shrink-0 mt-0.5" />
                                  <span><FormattedText text={safeRender(firstTask)} /></span>
                                </div>
                              )}
                              {remainingTasks.length > 0 && (
                                <div className={isLocked ? "blur-effect" : ""}>
                                  {remainingTasks.map((task, idx) => (
                                    <div key={idx} className="text-sm text-slate-600 flex gap-3 p-3 bg-white/60 rounded-xl mt-2">
                                      <CheckCircle2 size={14} className="text-slate-400 shrink-0 mt-0.5" />
                                      <span><FormattedText text={safeRender(task)} /></span>
                                    </div>
                                  ))}
                                </div>
                              )}
                            </>
                          )}

                          {/* Other Phases - Apply blur to entire content when locked */}
                          {!isFirstPhase && (
                            <>
                              {allTasks.length === 0 ? (
                                <div className="text-sm text-slate-400 italic p-3">
                                  No tasks specified for this phase
                                </div>
                              ) : (
                                <div className={isLocked ? "blur-effect" : "space-y-3"}>
                                  {allTasks.map((task, idx) => (
                                    <div key={idx} className="text-sm text-slate-600 flex gap-3 p-3 bg-white/60 rounded-xl mb-2">
                                      <CheckCircle2 size={14} className="text-slate-400 shrink-0 mt-0.5" />
                                      <span><FormattedText text={safeRender(task)} /></span>
                                    </div>
                                  ))}
                                </div>
                              )}
                            </>
                          )}
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        )}

        {/* FOOTER */}
        {sixMonth.length > 0 && (
          <div className="flex justify-between items-center pt-8 border-t border-slate-100">
            <button
              onClick={() => {
                setCareerData({ summary: "", recommendations: [], sixMonth: [], oneYear: [] });
                sessionStorage.removeItem("careerAI_data");
                setActiveMonth(null);
                console.log("CareerAI: Reset analysis");
              }}
              className="text-slate-400 hover:text-rose-500 transition-colors text-[10px] font-black uppercase tracking-widest flex items-center gap-2 px-6 py-3 rounded-full hover:bg-rose-50 border border-transparent hover:border-rose-100"
            >
              <Zap size={14} /> {t("resetAnalysis")}
            </button>
            <div className="flex items-center gap-3 text-[10px] font-black text-slate-300 uppercase tracking-[0.25em]">
              <CheckCircle2 size={14} className="text-emerald-500 opacity-60" /> ARTHA_ENGINE_CERTIFIED_RESULT
            </div>
          </div>
        )}

      </div>
    </div>
  );
};

// Add styles with !important to force the blur effect
const styles = `
  .blur-effect {
    filter: blur(4px) !important;
    pointer-events: none !important;
    user-select: none !important;
    opacity: 0.7 !important;
  }
  
  .blur-effect-text {
    filter: blur(3px) !important;
    pointer-events: none !important;
    user-select: none !important;
    opacity: 0.7 !important;
  }
  
  .blurred-month-card {
    position: relative;
  }
  
  .blurred-phase-card {
    position: relative;
  }
  
  .blurred-content {
    filter: blur(5px);
    pointer-events: none;
    user-select: none;
  }
  
  @keyframes fadeIn {
    from {
      opacity: 0;
      transform: translateY(10px);
    }
    to {
      opacity: 1;
      transform: translateY(0);
    }
  }
  
  .animate-fade-in {
    animation: fadeIn 0.4s cubic-bezier(0.16, 1, 0.3, 1) forwards;
  }
`;

// Inject styles
if (typeof document !== 'undefined') {
  const styleSheet = document.createElement("style");
  styleSheet.innerText = styles;
  document.head.appendChild(styleSheet);
}

export default CareerAI;
