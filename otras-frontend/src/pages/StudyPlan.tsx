import { useState, useEffect } from "react";
import { BookOpen, Zap, Star, Settings, Loader2, CheckCircle2, Clock, ChevronRight, Save, X, ChevronDown, ChevronUp, Lock, Sparkles } from "lucide-react";
import { useNavigate } from "react-router-dom";
import FormattedText from "../components/FormattedText";
import FormField, { TextInput, SelectInput } from "../components/FormField";
import { useTranslation } from "../hooks/useTranslation";
import { generateStudyPlan, saveStudyPlan, getSavedPlans, updateActivityStatus, moveToNextDay, simulateDateChange } from "../services/studyPlanApi";

export default function StudyPlan({ user: propUser }) {
  const { t, language } = useTranslation();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);

  const examOptions = [
    { value: "UPSC Civil Services", label: t("upscCivilServices") },
    { value: "SSC CGL", label: t("sscCgl") },
    { value: "IBPS PO", label: t("ibpsPo") },
    { value: "RRB NTPC", label: t("rrbNtpc") },
    { value: "State PSC", label: t("statePsc") },
    { value: "NDA", label: t("nda") },
    { value: "CDS", label: t("cds") },
    { value: "CAPF (Assistant Commandant)", label: t("capfAc") },
    { value: "EPFO", label: t("epfo") },
    { value: "LIC AAO", label: t("licAao") }
  ];

  // Tab states
  const [activeTab, setActiveTab] = useState("architect"); // architect | saved
  const [activeDayIndex, setActiveDayIndex] = useState(0);

  // Generated Plan (Preview)
  const [previewPlan, setPreviewPlan] = useState(null);
  const [previewInputs, setPreviewInputs] = useState(null);

  // Saved Plans
  const [savedPlans, setSavedPlans] = useState([]);
  const [selectedPlan, setSelectedPlan] = useState(null);
  const [expandedDay, setExpandedDay] = useState(null); // For accordion
  const [simulatedDate, setSimulatedDate] = useState(null);
  const [hasSubscription, setHasSubscription] = useState(false);

  // Form States
  const [targetExam, setTargetExam] = useState("");
  const [examDate, setExamDate] = useState("2026-06-16");
  const [level, setLevel] = useState("Intermediate");
  const [weakAreas, setWeakAreas] = useState(t("reasoningQuantDefault"));
  const [hours, setHours] = useState("6");
  const [mockFreq, setMockFreq] = useState("Once a week");
  const [revision, setRevision] = useState(t("spacedRepetitionDefault"));
  const [prefTime, setPrefTime] = useState(t("morningPrefTimeDefault"));
  const [duration, setDuration] = useState("7");

  const effectiveUser = propUser || JSON.parse(localStorage.getItem("user") || "{}");
  const userId = (effectiveUser.id && effectiveUser.id !== 7) ? effectiveUser.id : 1;
  const getSafeDayName = (date) => {
    if (!date) return t("days");
    const locale = language === 'hi' ? 'hi-IN' : language === 'te' ? 'te-IN' : 'en-US';
    return new Date(date).toLocaleDateString(locale, { weekday: "short" });
  };

  const [lastCheckedDate, setLastCheckedDate] = useState(new Date().toDateString());

  useEffect(() => {
    fetchSavedPlans();

    const checkSub = async () => {
      try {
        const res = await fetch(`http://localhost:4000/users/${userId}/tier-status`);
        if (res.ok) {
          const data = await res.json();
          setHasSubscription(!!data.hasActiveSubscription);
        }
      } catch (err) {
        console.error("Subscription check failed", err);
      }
    };
    if (userId) checkSub();

    // AUTO-RESCHEDULER: Watch for date changes (e.g., at midnight)
    const dateCheckInterval = setInterval(() => {
      const currentDate = new Date().toDateString();
      if (currentDate !== lastCheckedDate) {
        console.log("Date changed! Auto-syncing study plans to relocate missed tasks...");
        setLastCheckedDate(currentDate);
        fetchSavedPlans();
      }
    }, 60000); // Check every minute

    return () => clearInterval(dateCheckInterval);
  }, [userId, lastCheckedDate]);

  const fetchSavedPlans = async () => {
    try {
      if (!userId) return;
      const plans = await getSavedPlans(userId);
      setSavedPlans(plans);

      // Also update currently selected plan if open
      if (selectedPlan) {
        const updated = plans.find(p => p.id === selectedPlan.id);
        if (updated) setSelectedPlan(updated);
      }
    } catch (error) {
      console.error("Failed to fetch saved plans:", error);
    }
  };

  const handleArchitectPlan = async () => {
    setLoading(true);
    const payload = {
      userId, targetExam, examDate, currentLevel: level,
      weakAreas: weakAreas.split(",").map(s => s.trim()),
      dailyStudyHours: parseInt(hours), mockFrequency: mockFreq,
      revisionStrategy: revision, preferredStudyTimes: prefTime,
      planDurationDays: parseInt(duration),
      language
    };

    console.log("Study Plan: Generating plan");

    try {
      const response = await generateStudyPlan(payload);
      if (response && response.days && response.days.length > 0) {
        setPreviewPlan(response);
        setPreviewInputs(payload);
        setActiveDayIndex(0);
        console.log("Study Plan: Plan generated");
      } else {
        alert(t("emptyPlanError"));
      }
    } catch (error) {
      console.error("Study Plan Generation Error:", error);
      alert(t("generationFailed", { error: error.message }));
    } finally {
      setLoading(false);
    }
  };

  const handleSavePlan = async () => {
    if (!previewPlan || !previewInputs) return;
    setSaving(true);
    try {
      await saveStudyPlan(previewInputs, previewPlan);
      console.log("Study Plan: Plan saved");
      alert(t("planSavedSuccess"));
      setPreviewPlan(null);
      setPreviewInputs(null);
      fetchSavedPlans();
    } catch (error) {
      console.error("Save Error:", error);
      alert(t("savePlanError"));
    } finally {
      setSaving(false);
    }
  };

  const handleCancelPlan = () => {
    setPreviewPlan(null);
    setPreviewInputs(null);
  };

  const handleToggleActivity = async (planId, activityId, completed) => {
    try {
      await updateActivityStatus(activityId, userId, { completed });
      console.log("Study Plan: Task completed");

      // Update local state
      if (selectedPlan && selectedPlan.id === planId) {
        const updatedPlan = { ...selectedPlan };
        updatedPlan.days = updatedPlan.days.map(d => ({
          ...d,
          activities: d.activities.map(a => a.id === activityId ? { ...a, completed } : a)
        }));
        setSelectedPlan(updatedPlan);
      }

      // Also update savedPlans list
      setSavedPlans(prev => prev.map(p => {
        if (p.id === planId) {
          return {
            ...p,
            days: p.days.map(d => ({
              ...d,
              activities: d.activities.map(a => a.id === activityId ? { ...a, completed } : a)
            }))
          };
        }
        return p;
      }));
    } catch (error) {
      console.error("Toggle Activity Error:", error);
    }
  };

  const handleNextDay = async (planId) => {
    try {
      await moveToNextDay(planId);
      console.log("Study Plan: Missed tasks moved");

      // Refresh all plans data
      const plans = await getSavedPlans(userId);
      setSavedPlans(plans);

      // Update selectedPlan if active
      if (selectedPlan && selectedPlan.id === planId) {
        const updated = plans.find(p => p.id === planId);
        if (updated) setSelectedPlan(updated);

        if (activeDayIndex < (selectedPlan.days.length - 1)) {
          setActiveDayIndex(activeDayIndex + 1);
        }
      }
    } catch (error) {
      console.error("Next Day Error:", error);
    }
  };

  const handleSimulateDateChange = async () => {
    if (!selectedPlan) return;

    // Calculate Next Day
    const current = simulatedDate ? new Date(simulatedDate) : new Date();
    const nextDay = new Date(current);
    nextDay.setDate(current.getDate() + 1);

    setSimulatedDate(nextDay);
    console.log("Simulated Date:", nextDay);

    // Move to next day UI
    if (activeDayIndex < (selectedPlan.days.length - 1)) {
      const nextIndex = activeDayIndex + 1;
      setActiveDayIndex(nextIndex);
      console.log("Active Day Index:", nextIndex + 1);
    }

    try {
      console.log("Study Plan: Simulating Date Change (Backend move tasks)");
      await simulateDateChange(selectedPlan.id);

      // Refresh current plan
      const plans = await getSavedPlans(userId);
      setSavedPlans(plans);

      const updated = plans.find(p => p.id === selectedPlan.id);
      if (updated) setSelectedPlan(updated);

      alert(t("simulationSuccess", { date: nextDay.toLocaleDateString() }));
    } catch (error) {
      console.error("Simulation Error:", error);
      alert(t("simulationError"));
    }
  };

  const openPlan = (plan) => {
    setSelectedPlan(plan);
    setActiveDayIndex(0);
    setExpandedDay(null);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleUnlockNow = () => {
    // Navigate to subscriptions page
    navigate("/subscriptions");
  };

  const renderDailySchedule = (plan) => {
    const day = plan.days[activeDayIndex];
    if (!day) return null;

    const isLockedFirstDay = !hasSubscription && activeDayIndex === 0;

    return (
      <div className="space-y-6 animate-fade-in relative">
        <div className="app-card p-5 relative overflow-hidden" style={{ background: "var(--bg-card)" }}>
          <div className="flex flex-wrap gap-2 mb-6 max-h-[120px] overflow-y-auto p-1">
            {plan.days.map((d, idx) => {
              const isDayLocked = !hasSubscription && idx > 0;
              return (
                <div key={idx} className="relative group">
                  <button
                    onClick={() => !isDayLocked && setActiveDayIndex(idx)}
                    className={`px-4 py-2 rounded-xl text-xs font-bold transition-all duration-300 flex items-center gap-1.5 ${activeDayIndex === idx
                      ? "day-tab-active"
                      : isDayLocked
                        ? "bg-white/40 text-slate-400 cursor-not-allowed border border-slate-200/50 opacity-70"
                        : "bg-slate-100 text-slate-600 hover:bg-slate-200"
                      }`}
                  >
                    {t("days")} {idx + 1} {isDayLocked && <Lock size={10} className="ml-0.5 opacity-60" />}
                  </button>
                  {isDayLocked && (
                    <div className="absolute bottom-full mb-3 left-1/2 -translate-x-1/2 opacity-0 translate-y-2 group-hover:opacity-100 group-hover:translate-y-0 transition-all duration-300 pointer-events-none whitespace-nowrap z-50">
                      <div className="bg-slate-900/95 backdrop-blur-md text-white text-[11px] font-bold px-4 py-2.5 rounded-xl flex items-center gap-2 shadow-2xl border border-white/10">
                        👉 {t("unlockWithSubscription")}
                      </div>
                    </div>
                  )}
                </div>
              );
            })}
          </div>

          <div className={`transition-all duration-700 ${isLockedFirstDay ? 'blurred-content' : ''}`}>
            <div className="flex justify-between items-center mb-6">
              <div>
                <h3 className="text-xl font-bold text-slate-800 flex items-center gap-2">
                  <Clock size={18} style={{ color: "var(--color-primary)" }} />
                  {t("days")} {activeDayIndex + 1}: {getSafeDayName(day.date)}
                </h3>
                <p className="text-xs text-muted mt-1">{day.date ? new Date(day.date).toLocaleDateString() : ""}</p>
              </div>
              <span className="px-3 py-1 rounded-full text-xs font-bold" style={{ background: "var(--color-primary-light)", color: "var(--color-primary)" }}>
                {day.activities.length} {t("activitiesLabel")}
              </span>
            </div>

            <div className="space-y-3">
              {day.activities.map((block, i) => (
                <div
                  key={i}
                  className={`group flex items-center gap-4 p-4 rounded-2xl border transition-all ${block.completed
                    ? "bg-green-50/50 border-green-100"
                    : "bg-white border-slate-100 hover:border-blue-200 hover:bg-blue-50/30"
                    }`}
                >
                  {plan.id && (
                    <button
                      onClick={() => handleToggleActivity(plan.id, block.id, !block.completed)}
                      className={`w-6 h-6 rounded-full border-2 flex items-center justify-center transition-all ${block.completed
                        ? "bg-green-500 border-green-500 text-white"
                        : "border-slate-300 hover:border-blue-500"
                        }`}
                    >
                      {block.completed && <CheckCircle2 size={14} />}
                    </button>
                  )}

                  <div className="min-w-[100px]">
                    <span className={`text-[10px] font-bold uppercase ${block.completed ? "text-green-600" : "text-blue-600"}`}>
                      {block.timeSlot}
                    </span>
                  </div>
                  <div className="flex-1">
                    <h4 className={`font-bold text-sm mb-1 ${block.completed ? "text-slate-500 line-through" : "text-slate-800"}`}>
                      <FormattedText text={block.description} />
                    </h4>
                    {block.focusArea && (
                      <span className="inline-block text-[9px] font-bold px-1.5 py-0.5 bg-slate-100 text-slate-500 rounded uppercase">
                        {t("focusAreaLabel")}: {block.focusArea}
                      </span>
                    )}
                  </div>
                  {block.missed && (
                    <span className="text-[9px] font-bold text-red-500 bg-red-50 px-2 py-1 rounded-full uppercase">
                      {t("missedRescheduled")}
                    </span>
                  )}
                </div>
              ))}
            </div>
          </div>

          {isLockedFirstDay && (
            <div className="absolute inset-0 flex flex-col items-center justify-center z-20 rounded-2xl overflow-hidden animate-fade-in">
              {/* Subtle Background Dimming */}
              <div className="absolute inset-0 bg-black/20 backdrop-blur-sm"></div>

              {/* Glass Premium Card */}
              <div className="relative transform hover:scale-[1.02] transition-all duration-300 max-w-md mx-auto">
                <div
                  className="p-10 rounded-2xl text-center cursor-pointer"
                  style={{
                    background: `rgba(255, 255, 255, 0.85)`,
                    backdropFilter: "blur(8px)",
                    border: "1px solid var(--border-light)",
                    boxShadow: "var(--shadow-lg)"
                  }}
                  onClick={handleUnlockNow}
                >
                  {/* Icon Container */}
                  <div
                    className="w-20 h-20 mx-auto mb-6 rounded-2xl flex items-center justify-center relative overflow-hidden"
                    style={{
                      background: "linear-gradient(135deg, #143a94ff 0%, #284f8eff 100%)",
                      boxShadow: "0 20px 35px -10px rgba(59, 16, 179, 0.2)"
                    }}
                  >
                    <div className="absolute inset-0 bg-gradient-to-b from-white/20 to-transparent"></div>
                    <Lock size={32} strokeWidth={1.5} className="text-white drop-shadow-md relative z-10" />
                  </div>

                  {/* Title */}
                  <h4
                    className="text-2xl sm:text-3xl font-black mb-3 tracking-tight"
                    style={{ color: "var(--color-primary)" }}
                  >
                    {t("unlockFullStudyPlan")}
                  </h4>

                  {/* Subtitle */}
                  <p
                    className="text-sm sm:text-base font-semibold mb-8 max-w-[280px] mx-auto"
                    style={{ color: "var(--color-primary)" }}
                  >
                    {t("getAccessForOneRupee")}
                  </p>

                  {/* CTA Button */}
                  <button
                    className="px-8 py-3.5 rounded-2xl text-sm font-bold transition-all duration-300 flex items-center gap-2 mx-auto hover:scale-105 hover:shadow-xl"
                    style={{
                      background: "var(--color-primary)",
                      color: "white",
                      boxShadow: "0 4px 12px rgba(47, 108, 229, 0.3)"
                    }}
                    onMouseEnter={(e) => {
                      e.currentTarget.style.boxShadow = "0 8px 20px rgba(47, 108, 229, 0.4)";
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.boxShadow = "0 4px 12px rgba(47, 108, 229, 0.3)";
                    }}
                  >
                    <Sparkles size={16} />
                    {t("unlockNow")}
                    <ChevronRight size={16} className="group-hover:translate-x-1 transition-transform" />
                  </button>
                </div>
              </div>
            </div>
          )}

          {plan.id && activeDayIndex < (plan.days.length - 1) && (
            <div className="mt-8 flex justify-end">
              <button
                onClick={() => handleNextDay(plan.id)}
                className="btn-secondary flex items-center gap-2 group"
              >
                {t("nextDay")} <ChevronRight size={16} className="group-hover:translate-x-1 transition-transform" />
              </button>
            </div>
          )}
        </div>
      </div>
    );
  };

  const renderAccordionView = (plan) => {
    return (
      <div className="space-y-3 mt-4">
        {plan.days.map((day, idx) => {
          const isDayLocked = !hasSubscription && idx > 0;
          return (
            <div
              key={idx}
              className={`overflow-hidden transition-all duration-300 ${isDayLocked ? 'opacity-70 relative group' : ''
                }`}
              style={{
                background: "var(--bg-card)",
                borderRadius: "var(--radius-xl)",
                border: "1px solid var(--border-light)",
                boxShadow: "var(--shadow-sm)"
              }}
            >
              <button
                onClick={() => !isDayLocked && setExpandedDay(expandedDay === idx ? null : idx)}
                className={`w-full flex items-center justify-between p-4 transition-all duration-300 ${isDayLocked ? 'cursor-not-allowed' : 'hover:bg-slate-50/80'
                  }`}
              >
                <div className="flex items-center gap-3">
                  <span
                    className="w-10 h-10 rounded-xl flex items-center justify-center text-xs font-bold transition-all duration-300"
                    style={{
                      background: isDayLocked ? "var(--border-light)" : "var(--color-primary-light)",
                      color: isDayLocked ? "var(--text-muted)" : "var(--color-primary)"
                    }}
                  >
                    {isDayLocked ? <Lock size={14} /> : (idx + 1)}
                  </span>
                  <div className="text-left">
                    <h4
                      className="font-bold text-sm transition-colors"
                      style={{ color: isDayLocked ? "var(--text-secondary)" : "var(--text-main)" }}
                    >
                      {t("days")} {idx + 1}: {getSafeDayName(day.date)}
                    </h4>
                    {isDayLocked ? (
                      <p className="text-[11px] font-bold mt-0.5" style={{ color: "var(--color-primary)" }}>
                        👉 {t("availableAfterSubscription")}
                      </p>
                    ) : (
                      <p className="text-[10px]" style={{ color: "var(--text-muted)" }}>
                        {day.date ? new Date(day.date).toLocaleDateString() : ""}
                      </p>
                    )}
                  </div>
                </div>
                <div className="flex items-center gap-4">
                  <span
                    className="text-[10px] font-bold px-2 py-1 rounded-md"
                    style={{
                      background: "var(--bg-light)",
                      color: "var(--text-secondary)"
                    }}
                  >
                    {day.activities.filter(a => a.completed).length}/{day.activities.length} {t("activitiesDone")}
                  </span>
                  {expandedDay === idx ? <ChevronUp size={16} style={{ color: "var(--text-muted)" }} /> : <ChevronDown size={16} style={{ color: "var(--text-muted)" }} />}
                </div>
              </button>
              {expandedDay === idx && !isDayLocked && (
                <div
                  className="p-4 border-t space-y-2"
                  style={{
                    background: "var(--bg-light)",
                    borderColor: "var(--border-light)"
                  }}
                >
                  {day.activities.map((act, ai) => (
                    <div key={ai} className="flex items-center gap-3 text-sm p-2 rounded-lg" style={{ background: "var(--bg-card)" }}>
                      <div className={`w-2 h-2 rounded-full ${act.completed ? "bg-green-500" : "bg-slate-300"}`} />
                      <span className="text-[10px] font-bold min-w-[100px] uppercase" style={{ color: "var(--color-primary)" }}>
                        {act.timeSlot}
                      </span>
                      <span className={`flex-1 ${act.completed ? "text-slate-400 line-through" : "text-slate-700 font-medium"}`}>
                        <FormattedText text={act.description} />
                      </span>
                    </div>
                  ))}
                </div>
              )}
            </div>
          );
        })}
      </div>
    );
  };

  return (
    <div className="space-y-6 pb-20">
      {/* HEADER */}
      <div className="flex justify-between items-start">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <BookOpen size={14} style={{ color: "var(--color-cyan)" }} />
            <span className="label" style={{ color: "var(--color-cyan)" }}>{t("studyArchitect")}</span>
          </div>
          <h1 className="page-title">{t("aiStudyPlanArchitect")}</h1>
          <p className="text-subtle">{t("studyPlanDesc")}</p>
        </div>
        {selectedPlan && (
          <div className="flex gap-2">
            <button onClick={handleSimulateDateChange} className="btn-secondary text-[10px] py-1 h-auto flex items-center gap-2">
              <Clock size={12} /> {t("simulateDateChange")}
            </button>
            <button onClick={() => setSelectedPlan(null)} className="btn-secondary text-[10px] py-1 h-auto flex items-center gap-2">
              <X size={12} /> {t("closePlan")}
            </button>
          </div>
        )}
      </div>

      <div className="grid lg:grid-cols-3 gap-6">
        {/* LEFT COLUMN: FORM */}
        <div className="lg:col-span-1">
          <div className="sticky top-6" style={{ background: "var(--bg-card)", borderRadius: "var(--radius-xl)", border: "1px solid var(--border-light)", boxShadow: "var(--shadow-sm)" }}>
            <div className="p-6">
              <h2 className="card-title mb-4">{t("planInputs")}</h2>
              <div className="space-y-4">
                <FormField label={t("targetExam")}>
                  <select
                    value={targetExam}
                    onChange={(e) => setTargetExam(e.target.value)}
                    className="input w-full"
                  >
                    <option value="" disabled>
                      {t("selectTargetExamPlaceholder")}
                    </option>

                    {examOptions.map((exam, i) => (
                      <option key={i} value={exam.value}>
                        {exam.label}
                      </option>
                    ))}
                  </select>
                </FormField>
                <FormField label={t("examDate")}><TextInput type="date" value={examDate} onChange={(e) => setExamDate(e.target.value)} /></FormField>
                <FormField label={t("currentLevel")}><SelectInput value={level} onChange={(e) => setLevel(e.target.value)} options={[{label: t("beginner"), value: "Beginner"}, {label: t("intermediate"), value: "Intermediate"}, {label: t("advanced"), value: "Advanced"}]} /></FormField>
                <FormField label={t("weakAreas")}><TextInput value={weakAreas} onChange={(e) => setWeakAreas(e.target.value)} placeholder={t("weakAreasPlaceholder")} /></FormField>
                <FormField label={t("dailyStudyHours")}><TextInput value={hours} onChange={(e) => setHours(e.target.value)} /></FormField>
                <FormField label={t("mockFrequency")}><SelectInput value={mockFreq} onChange={(e) => setMockFreq(e.target.value)} options={[{label: t("onceAWeek"), value: "Once a week"}, {label: t("twiceAWeek"), value: "Twice a week"}, {label: t("daily"), value: "Daily"}]} /></FormField>
                <FormField label={t("revisionStrategy")}><TextInput value={revision} onChange={(e) => setRevision(e.target.value)} /></FormField>
                <FormField label={t("planDuration")}><SelectInput value={duration} onChange={(e) => setDuration(e.target.value)} options={["7", "15", "30"]} /></FormField>
                <button onClick={handleArchitectPlan} disabled={loading} className="btn-primary w-full flex items-center justify-center gap-2">
                  {loading ? <Loader2 size={16} className="animate-spin" /> : <Settings size={14} />}
                  {loading ? t("generatingStudyPlan") : t("architectPlan")}
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* RIGHT COLUMN: PREVIEW OR SELECTED PLAN */}
        <div className="lg:col-span-2 space-y-5">
          {loading ? (
            <div className="p-12 text-center flex flex-col items-center justify-center min-h-[400px]" style={{ background: "var(--bg-card)", borderRadius: "var(--radius-xl)", border: "1px solid var(--border-light)" }}>
              <Loader2 size={48} className="animate-spin mb-4" style={{ color: "var(--color-primary)" }} />
              <h3 className="section-title !text-xl">{t("generatingStudyPlan")}</h3>
              <p className="text-subtle">{t("architectingPathDesc")}</p>
            </div>
          ) : selectedPlan ? (
            <div className="space-y-6">
              <div className="p-6 border-l-4" style={{ background: "var(--bg-card)", borderLeftColor: "var(--color-primary)", borderRadius: "var(--radius-xl)" }}>
                <h2 className="text-2xl font-black uppercase tracking-tight" style={{ color: "var(--text-main)" }}>{selectedPlan.targetExam}</h2>
                <p className="text-xs font-bold mt-1" style={{ color: "var(--color-primary)" }}>{selectedPlan.days.length} {t("days")} {t("comprehensivePlan")}</p>
              </div>

              <div className="flex gap-4 mb-4">
                <button
                  onClick={() => setExpandedDay(null)}
                  className={`flex-1 py-3 rounded-2xl font-bold text-sm transition-all ${expandedDay === null
                    ? "bg-white shadow-md text-blue-600 border border-blue-100"
                    : "bg-slate-100 text-slate-500 hover:bg-slate-200"
                    }`}
                >
                  {t("dailyView")}
                </button>
                <button
                  onClick={() => setExpandedDay(0)}
                  className={`flex-1 py-3 rounded-2xl font-bold text-sm transition-all ${expandedDay !== null
                    ? "bg-white shadow-md text-blue-600 border border-blue-100"
                    : "bg-slate-100 text-slate-500 hover:bg-slate-200"
                    }`}
                >
                  {t("fullRoadmap")}
                </button>
              </div>

              {expandedDay === null ? renderDailySchedule(selectedPlan) : renderAccordionView(selectedPlan)}
            </div>
          ) : previewPlan ? (
            <div className="animate-fade-in space-y-6">
              <div className="p-4 rounded-2xl shadow-lg" style={{ background: "var(--color-primary)", color: "white" }}>
                <div className="flex justify-between items-center">
                  <div>
                    <h3 className="font-bold">{t("aiRecommendedPlan")}</h3>
                    <p className="text-xs opacity-90">{t("daysTailoredForYou", { count: previewPlan.days.length })}</p>
                  </div>
                  <div className="flex gap-2">
                    <div className="relative group">
                      <button
                        onClick={hasSubscription ? handleSavePlan : undefined}
                        disabled={saving || !hasSubscription}
                        className={`px-4 py-2 rounded-2xl text-xs font-bold flex items-center gap-2 transition-all duration-300 ${hasSubscription
                          ? "bg-white text-blue-600 hover:bg-blue-50 hover:shadow-lg"
                          : "bg-white/50 text-slate-400 cursor-not-allowed"
                          }`}
                      >
                        {saving ? <Loader2 size={14} className="animate-spin" /> : <Save size={14} />} {t("savePlan")}
                      </button>
                      {!hasSubscription && (
                        <div className="absolute bottom-full mb-3 left-1/2 -translate-x-1/2 opacity-0 translate-y-2 group-hover:opacity-100 group-hover:translate-y-0 transition-all duration-300 pointer-events-none whitespace-nowrap z-50">
                          <div className="bg-slate-900/95 backdrop-blur-md text-white text-[11px] font-bold px-4 py-2.5 rounded-xl flex items-center gap-2 shadow-2xl border border-white/10">
                            👉 {t("unlockWithSubscription")}
                          </div>
                        </div>
                      )}
                    </div>
                    <button onClick={handleCancelPlan} disabled={saving} className="bg-red-500 text-white px-4 py-2 rounded-xl text-xs font-bold flex items-center gap-2 hover:bg-red-600 transition-colors">
                      <X size={14} /> {t("cancel")}
                    </button>
                  </div>
                </div>
              </div>

              <div className="p-5 border-l-4" style={{ background: "var(--bg-card)", borderLeftColor: "var(--color-cyan)", borderRadius: "var(--radius-xl)" }}>
                <div className="flex items-center gap-2 mb-3">
                  <Zap size={14} style={{ color: "var(--color-cyan)" }} />
                  <span className="label font-bold uppercase" style={{ color: "var(--color-cyan)" }}>{t("strategySummary")}</span>
                </div>
                <p className="text-sm leading-relaxed" style={{ color: "var(--text-secondary)" }}><FormattedText text={previewPlan.summary} /></p>
              </div>

              {renderDailySchedule(previewPlan)}
            </div>
          ) : (
            <div className="p-12 text-center flex flex-col items-center justify-center min-h-[400px]" style={{ background: "var(--bg-card)", borderRadius: "var(--radius-xl)", border: "1px solid var(--border-light)" }}>
              <div className="w-16 h-16 rounded-full flex items-center justify-center mb-4" style={{ background: "var(--color-primary-light)" }}>
                <BookOpen size={32} style={{ color: "var(--text-muted)" }} />
              </div>
              <h3 className="section-title !text-xl">{t("readyToArchitect")}</h3>
              <p className="text-subtle max-w-sm mx-auto">{t("readyToArchitectDesc")}</p>
            </div>
          )}

          {/* SAVED PLANS SECTION */}
          <div className="mt-12 pt-8 border-t" style={{ borderColor: "var(--border-light)" }}>
            <h2 className="section-title !text-xl mb-6 flex items-center gap-2">
              <Save size={18} style={{ color: "var(--color-primary)" }} />
              {t("savedStudyPlans")}
            </h2>
            {savedPlans.length > 0 ? (
              <div className="grid sm:grid-cols-2 gap-4">
                {savedPlans.map((plan) => (
                  <div
                    key={plan.id}
                    onClick={() => openPlan(plan)}
                    className="p-5 cursor-pointer group transition-all border-l-4 hover:shadow-xl"
                    style={{
                      background: "var(--bg-card)",
                      borderRadius: "var(--radius-xl)",
                      borderLeftColor: "var(--color-primary)",
                      border: "1px solid var(--border-light)",
                      boxShadow: "var(--shadow-sm)"
                    }}
                  >
                    <div className="flex justify-between items-start mb-2">
                      <h4 className="font-black uppercase tracking-tight transition-colors" style={{ color: "var(--text-main)" }}>
                        {plan.targetExam}
                      </h4>
                      <span className="text-[10px] font-bold" style={{ color: "var(--text-muted)" }}>
                        {new Date(plan.createdAt).toLocaleDateString()}
                      </span>
                    </div>
                    <div className="flex items-center gap-4 text-[10px] font-bold uppercase" style={{ color: "var(--text-secondary)" }}>
                      <span>{plan.days.length} {t("days")}</span>
                      <span className="w-1 h-1 rounded-full" style={{ background: "var(--border-light)" }} />
                      <span>{plan.dailyStudyHours} {t("hrsPerDay")}</span>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="p-8 text-center rounded-2xl border border-dashed" style={{ background: "var(--bg-light)", borderColor: "var(--border-light)" }}>
                <p className="text-sm" style={{ color: "var(--text-muted)" }}>{t("noSavedPlans")}</p>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Add this CSS to your global styles or index.css */}
      <style>{`
        .blurred-content {
          filter: blur(4px);
          transition: filter 0.3s ease;
          pointer-events: none;
          user-select: none;
        }
        
        @keyframes fadeIn {
          from {
            opacity: 0;
            transform: translateY(15px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
        
        .animate-fade-in {
          animation: fadeIn 0.6s cubic-bezier(0.16, 1, 0.3, 1) forwards;
        }
      `}</style>
    </div>
  );
}