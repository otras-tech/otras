import { useState, useEffect, useRef } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import {
  Activity,
  Timer,
  ChevronRight,
  Layout,
  CheckCircle2,
  PlayCircle,
  BarChart3,
} from "lucide-react";
import apiClient from "../api/apiClient";
import { useTranslation } from "../hooks/useTranslation";
import IntelligenceFeedback from "../components/artha/IntelligenceFeedback";
import FormattedText from "../components/FormattedText";
import { useQueryClient } from "@tanstack/react-query";

import { useAuthStore } from "../store/authStore";

export default function ArthaTest() {
  const { user } = useAuthStore();
  const navigate = useNavigate();
  const { state } = useLocation();
  const testData = state?.testData;
  const { test, exam } = testData || {};
  const { t, language } = useTranslation();
  const queryClient = useQueryClient();

  const [activeTest, setActiveTest] = useState<any>(null);
  const [currentSection, setCurrentSection] = useState("");
  const [answers, setAnswers] = useState<any[]>([]);
  const [submitted, setSubmitted] = useState(false);
  const [result, setResult] = useState<any>(null);
  const [submitting, setSubmitting] = useState(false);
  const [arthaStatus, setArthaStatus] = useState<any>(null);
  const [activeAssessmentId, setActiveAssessmentId] = useState<any>(null);
  const [activeResultId, setActiveResultId] = useState<any>(null);
  const [timeLeft, setTimeLeft] = useState(0);
  const [liveMetrics, setLiveMetrics] = useState<any>(null);
  const timerRef = useRef<any>(null);
  const answersRef = useRef<any[]>([]);
  const lastActionTimeRef = useRef<any>(null);

  useEffect(() => {
    answersRef.current = answers;
  }, [answers]);

  const handleStartTest = async () => {
    if (test) {
      let startId = null;
      try {
        if (testData?.isMockTest) {
          const resp = await apiClient.post("/mock-test/start-attempt", {
            otrId: user?.otrId,
            mockTestId: test.id,
          });
          startId = resp.data.id;
        } else {
          const targetTier = parseInt(state?.tier || "1", 10);
          if (targetTier === 1) {
            const resp = await apiClient.post("/artha/start-tier/1", {
              userId: user?.id,
            });
            startId = resp.data.id;
          } else {
            // Tier 2 or 3
            try {
              const resResult = await apiClient.post("/results/start", {
                userId: user?.id,
                testId: test.id,
                tier: targetTier,
              });
              setActiveResultId(resResult.data.id);
            } catch (err: any) {
            console.error(err);
            if (err.response?.status === 500 && err.response?.data?.message?.includes('Foreign key')) {
            }
            }

            // 2. Start Artha Assessment record (String UUID)
            const resArtha = await apiClient.post(`/artha/start-tier/${targetTier}`, {
              userId: user?.id,
            });
            startId = resArtha.data.id;
          }
        }
      } catch (err) {
        console.error("Failed to start exam in backend", err);
      }

      setActiveAssessmentId(startId);
      setActiveTest(test);

      // Initialize timer (duration is in minutes)
      const durationVal = parseInt(test.duration, 10) || 60;
      const durationInSeconds = durationVal * 60;
      console.log(`Timer: Initializing with ${durationVal} minutes (${durationInSeconds} seconds)`);
      setTimeLeft(durationInSeconds);

      if (test.questions?.length > 0) {
        setCurrentSection(test.questions[0].subject.name);
      }
      lastActionTimeRef.current = Date.now();
    }
  };

  useEffect(() => {
    // Only run if we have an active test and haven't submitted
    if (activeTest && !submitted && timeLeft > 0) {
      if (!timerRef.current) {
        console.log("Timer: Starting interval");
        timerRef.current = setInterval(() => {
          setTimeLeft((prev) => {
            if (prev <= 1) {
              if (timerRef.current) {
                clearInterval(timerRef.current);
                timerRef.current = null;
              }
              console.log("Timer: Time is up, submitting...");
              handleSubmit();
              return 0;
            }
            return prev - 1;
          });
        }, 1000);
      }
    } else if (submitted || timeLeft <= 0) {
      if (timerRef.current) {
        console.log("Timer: Stopping interval", { submitted, timeLeft });
        clearInterval(timerRef.current);
        timerRef.current = null;
      }
    }

    return () => {
      if (timerRef.current) {
        clearInterval(timerRef.current);
        timerRef.current = null;
      }
    };
  }, [activeTest, submitted, timeLeft]);

  const formatTime = (seconds: number) => {
    if (isNaN(seconds) || seconds < 0) return "00:00";
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  const handleAnswerChange = async (questionId: string, selectedOption: string) => {
    const now = Date.now();
    const timeTaken = lastActionTimeRef.current ? Math.floor((now - lastActionTimeRef.current) / 1000) : 0;
    lastActionTimeRef.current = now;

    setAnswers((prev) => {
      const existing = prev.find((a) => a.questionId === questionId);
      if (existing) {
        return prev.map((a) =>
          a.questionId === questionId ? { ...a, selectedOption } : a
        );
      }
      return [...prev, { questionId, selectedOption }];
    });

    // Only record live question attempts for Artha Tier Assessments, not Mock Tests
    if (activeAssessmentId && !testData?.isMockTest) {
      try {
        const question = activeTest.questions.find((q: any) => q.id === questionId);
        const isCorrect = question.answer === selectedOption;
        const totalQuestions = activeTest.questions?.length || exam?.noOfQuestions || 15;

        const response = await apiClient.post("/artha/attempt-question", {
          assessmentId: activeAssessmentId,
          questionId,
          selectedOption,
          isCorrect,
          timeTaken,
          totalQuestions
        });

        const metrics = response.data;
        setLiveMetrics(metrics);
      } catch (err) {
        console.error("ARTHA Progress Engine: Error recording attempt", err);
      }
    }
  };

  const handleSubmit = async () => {
    if (!user?.otrId) return alert("Please login first");
    const currentAnswers = answersRef.current;
    setSubmitting(true);

    try {
      const questions = activeTest?.questions || [];
      const subjects = Array.from(
        new Set(questions.map((q: any) => q.subject?.name).filter(Boolean))
      );
      const subjectWise: Record<string, any> = {};

      let correctCount = 0;
      let wrongCount = 0;

      subjects.forEach((sub: any) => {
        subjectWise[sub] = { correct: 0, wrong: 0, unanswered: 0, total: 0, score: 0 };
      });

      questions.forEach((q: any) => {
        const subName = q.subject?.name;
        if (!subName || !subjectWise[subName]) return;
        subjectWise[subName].total++;

        const userAns = currentAnswers.find((a: any) => a.questionId === q.id);
        if (userAns) {
          if (userAns.selectedOption === q.answer) {
            correctCount++;
            subjectWise[subName].correct++;
            subjectWise[subName].score += 1;
          } else {
            wrongCount++;
            subjectWise[subName].wrong++;
            subjectWise[subName].score -= 0.25;
          }
        } else {
          subjectWise[subName].unanswered++;
        }
      });

      const negativeMarks = wrongCount * 0.25;
      const totalScore = correctCount - negativeMarks;

      const finalResult: any = {
        totalScore,
        totalMarks: questions.length,
        correctAnswers: correctCount,
        wrongAnswers: wrongCount,
        negativeMarks,
        subjectBreakdown: subjectWise,
      };

      setResult(finalResult);
      setSubmitted(true);

      if (testData?.isMockTest) {
        await apiClient.post("/mock-test/exam-attempts", {
          otrId: user.otrId,
          examId: activeTest.examId,
          score: totalScore,
          totalMarks: questions.length,
          correctAnswers: correctCount,
          attemptId: activeAssessmentId,
          subjectBreakdown: subjectWise,
        });
      } else {
        const targetTier = state?.tier;

        if (targetTier === "2" || targetTier === "3") {
          await apiClient.post("/results", {
            userId: user.id,
            testId: activeTest.id,
            answers: currentAnswers,
            tier: parseInt(targetTier, 10),
            resultId: activeResultId,
          });

          if (targetTier === "2") {
            const resp = await apiClient.post("/artha/tier2", {
              userId: user.id,
              assessmentId: activeAssessmentId,
              language,
              attemptedCount: currentAnswers.length,
              totalQuestions: activeTest.questions?.length || 15
            });
            setArthaStatus(resp.data);
          } else if (targetTier === "3") {
            const resp = await apiClient.post("/artha/tier3", {
              userId: user.id,
              assessmentId: activeAssessmentId,
              language,
              attemptedCount: currentAnswers.length,
              totalQuestions: activeTest.questions?.length || 15
            });
            setArthaStatus(resp.data);
          }
        } else {
          const logicalScore = subjectWise["logical"]?.score || 0;
          const quantScore = subjectWise["quant"]?.score || 0;
          const verbalScore = subjectWise["verbal"]?.score || 0;

          const resp = await apiClient.post("/artha/tier1", {
            userId: user.id,
            logicalScore,
            quantScore,
            verbalScore,
            attemptedCount: currentAnswers.length,
            totalQuestions: questions.length || 15,
            assessmentId: activeAssessmentId,
            language
          });
          setArthaStatus(resp.data);
        }
      }

      // Invalidate Artha cache so the engine page updates reliably
      queryClient.invalidateQueries({ queryKey: ['arthaStatus'] });
      queryClient.invalidateQueries({ queryKey: ['mockExams'] });
    } catch (err) {
      console.error("Failed to submit test", err);
      alert("Submission failed.");
    } finally {
      setSubmitting(false);
    }
  };

  if (submitted && result) {
    return (
      <div className="max-w-4xl mx-auto space-y-6 p-4 sm:p-6 lg:p-8">
        <div className="bg-white rounded-2xl p-8 border border-slate-200 shadow-sm text-center">
          <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4 text-green-600">
            <CheckCircle2 size={32} />
          </div>
          <h1 className="text-3xl font-bold text-slate-800 mb-1">
            {t("testCompleted")}
          </h1>

          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-8">
            <div className="bg-blue-50 rounded-2xl p-4 border border-blue-100">
              <p className="text-blue-600 text-xs font-bold uppercase tracking-widest mb-1">
                {t("totalScore")}
              </p>
              <p className="text-3xl font-black text-blue-900">
                {result.totalScore.toFixed(2)}
                <span className="text-lg text-blue-400">
                  /{result.totalMarks}
                </span>
              </p>
            </div>
            <div className="bg-green-50 rounded-2xl p-4 border border-green-100">
              <p className="text-green-600 text-xs font-bold uppercase tracking-widest mb-1">
                {t("correct")}
              </p>
              <p className="text-3xl font-black text-green-700">
                {result.correctAnswers}
              </p>
            </div>
            <div className="bg-red-50 rounded-2xl p-4 border border-red-100">
              <p className="text-red-600 text-xs font-bold uppercase tracking-widest mb-1">
                {t("wrong")}
              </p>
              <p className="text-3xl font-black text-red-700">
                {result.wrongAnswers}
              </p>
            </div>
            <div className="bg-amber-50 rounded-2xl p-4 border border-amber-100">
              <p className="text-amber-600 text-xs font-bold uppercase tracking-widest mb-1">
                {t("negative")}
              </p>
              <p className="text-3xl font-black text-amber-700">
                −{result.negativeMarks.toFixed(2)}
              </p>
            </div>
            <div className="bg-indigo-50 rounded-2xl p-4 border border-indigo-100">
              <p className="text-indigo-600 text-xs font-bold uppercase tracking-widest mb-1">
                {t("percentile")}
              </p>
              <p className="text-3xl font-black text-indigo-700">
                {arthaStatus?.percentile ? Math.round(arthaStatus.percentile) : "0"}%
              </p>
            </div>
            <div className="bg-purple-50 rounded-2xl p-4 border border-purple-100">
              <p className="text-purple-600 text-xs font-bold uppercase tracking-widest mb-1">
                {t("careerReadiness")}
              </p>
              <p className="text-3xl font-black text-purple-700">
                {arthaStatus?.readinessIndex ? Math.round(arthaStatus.readinessIndex) : "0"}%
              </p>
            </div>
          </div>
        </div>

        {/* Subject-wise Breakdown */}
        <div className="bg-white rounded-2xl p-8 border border-slate-200 shadow-sm">
          <h2 className="font-bold text-slate-800 text-lg mb-6 flex items-center gap-3 pb-4 border-b border-slate-100">
            <BarChart3 size={20} className="text-indigo-500" />
            {t("subjectWiseBreakdown")}
          </h2>

          <div className="overflow-hidden rounded-xl border border-slate-200">
            <table className="w-full text-sm">
              <thead>
                <tr className="bg-slate-50 border-b border-slate-200">
                  <th className="text-left p-4 font-bold text-slate-600 uppercase tracking-wider text-xs">
                    {t("subject")}
                  </th>
                  <th className="text-center p-4 font-bold text-slate-600 uppercase tracking-wider text-xs">
                    {t("totalMarks")}
                  </th>
                  <th className="text-center p-4 font-bold text-slate-600 uppercase tracking-wider text-xs">
                    {t("correct")}
                  </th>
                  <th className="text-center p-4 font-bold text-slate-600 uppercase tracking-wider text-xs">
                    {t("wrong")}
                  </th>
                  <th className="text-center p-4 font-bold text-slate-600 uppercase tracking-wider text-xs">
                    {t("totalScore")}
                  </th>
                </tr>
              </thead>
              <tbody>
                {Object.entries(result.subjectBreakdown).map(
                  ([subject, stats]: [string, any], i) => (
                    <tr
                      key={subject}
                      className={`border-b border-slate-100 ${i % 2 === 0 ? "bg-white" : "bg-slate-50/50"
                        }`}
                    >
                      <td className="p-4 font-semibold text-slate-700">
                        {subject}
                      </td>
                      <td className="p-4 text-center font-bold text-slate-600">
                        {stats.total}
                      </td>
                      <td className="p-4 text-center font-bold text-green-600">
                        {stats.correct}
                      </td>
                      <td className="p-4 text-center font-bold text-red-600">
                        {stats.wrong}
                      </td>
                      <td className="p-4 text-center font-black text-blue-600">
                        {stats.score.toFixed(2)}
                      </td>
                    </tr>
                  )
                )}
              </tbody>
            </table>
          </div>
        </div>

        {/* AI CAREER READINESS FEEDBACK (Artha Engine Tests Only) */}
        {!testData?.isMockTest && (
          arthaStatus?.feedback ? (
            <IntelligenceFeedback feedback={arthaStatus.feedback} />
          ) : (
            <div className="bg-slate-50 rounded-2xl p-8 border border-dashed border-slate-300 text-center space-y-4">
              <div className="w-12 h-12 bg-white rounded-full flex items-center justify-center mx-auto shadow-sm">
                <div className="w-6 h-6 border-2 border-indigo-200 border-t-indigo-600 rounded-full animate-spin" />
              </div>
              <h3 className="font-bold text-slate-700">{t("Generating Analysis")}</h3>
              <p className="text-slate-500 text-sm max-w-sm mx-auto">{t("AI Processing")}</p>
              <button
                onClick={async () => {
                  if (!user) return;
                  const resp = await apiClient.get(`/artha/status/${user.id}`);
                  setArthaStatus(resp.data);
                }}
                className="text-indigo-600 font-bold text-sm hover:underline"
              >
                {t("Refresh Insights")}
              </button>
            </div>
          )
        )}


        <button
          onClick={() => navigate("/artha")}
          className="w-full py-4 bg-slate-800 text-white rounded-xl font-bold hover:bg-slate-900 transition-colors shadow-lg"
        >
          {t("returnToArthaEngine")}
        </button>
      </div>
    );
  }

  // 2. Active Test View
  if (activeTest) {
    const questions = activeTest.questions || [];
    const subjects = Array.from(
      new Set(questions.map((q) => q.subject?.name).filter(Boolean))
    );
    const filteredQuestions = questions.filter(
      (q) => q.subject?.name === currentSection
    );

    // Group questions by subject for the full palette
    const groupedQuestions = questions.reduce((acc: any, q: any) => {
      const subjectName = q.subject?.name || "General";
      if (!acc[subjectName]) acc[subjectName] = [];
      acc[subjectName].push(q);
      return acc;
    }, {});

    return (
      <div className="space-y-6 p-4 sm:p-6 lg:p-8">
        {/* Top bar */}
        <div className="flex flex-col sm:flex-row items-center justify-between bg-white p-6 rounded-2xl border border-slate-200 shadow-sm gap-4">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 bg-indigo-50 rounded-xl flex items-center justify-center text-indigo-600 border border-indigo-100">
              <Activity size={24} />
            </div>
            <div>
              <h2 className="font-bold text-xl text-slate-800">
                {activeTest.name}
              </h2>
              <p className="text-sm text-slate-400 font-semibold uppercase tracking-wider">
                {t("careerReadinessTest")}
              </p>
            </div>
          </div>
          <div className="flex items-center gap-4 w-full sm:w-auto">
            <div className={`flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-bold border ${timeLeft < 300 ? 'bg-red-50 text-red-600 border-red-100 animate-pulse' : 'bg-orange-50 text-orange-600 border-orange-100'}`}>
              <Timer size={18} /> {formatTime(timeLeft)}
            </div>
            <button
              onClick={handleSubmit}
              disabled={submitting}
              className="flex-1 sm:flex-none px-8 py-2.5 bg-green-600 text-white rounded-xl font-bold hover:bg-green-700 transition-all shadow-lg shadow-green-100 disabled:opacity-50"
            >
              {submitting ? t("submitting") : t("submitTest")}
            </button>
          </div>
        </div>

        {/* Progress bar */}
        <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm transition-all duration-300">
          <div className="flex justify-between items-center mb-2">
            <span className="text-sm font-bold text-slate-600">Overall Progress</span>
            <span className="text-sm font-black text-indigo-600 animate-pulse">
              {Math.min(100, Math.round((answers.length / (activeTest.questions?.length || 15)) * 100))}%
            </span>
          </div>
          <div className="w-full bg-slate-100 rounded-full h-3 overflow-hidden shadow-inner">
            <div
              className="bg-indigo-600 h-full transition-all duration-700 ease-out shadow-[0_0_15px_rgba(79,70,229,0.4)] relative"
              style={{ width: `${Math.min(100, Math.round((answers.length / (activeTest.questions?.length || 15)) * 100))}%` }}
            >
              <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent animate-shimmer" />
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
          {/* Left panel */}
          <div className="space-y-6">
            {/* Section Navigation */}
            <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm">
              <label className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-4 block">
                {t("sections")}
              </label>
              <div className="space-y-2">
                {subjects.map((sub) => (
                  <button
                    key={sub}
                    onClick={() => setCurrentSection(sub)}
                    className={`w-full flex items-center justify-between px-4 py-3 rounded-xl text-sm font-semibold transition-all ${currentSection === sub
                        ? "bg-indigo-600 text-white shadow-lg shadow-indigo-100"
                        : "text-slate-600 hover:bg-slate-50"
                      }`}
                  >
                    {sub}
                    <ChevronRight
                      size={16}
                      className={
                        currentSection === sub
                          ? "text-indigo-200"
                          : "text-slate-300"
                      }
                    />
                  </button>
                ))}
              </div>
            </div>

            {/* Question Palette */}
            <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm overflow-hidden flex flex-col max-h-[600px]">
              <h3 className="text-sm font-bold text-slate-800 mb-4 flex items-center gap-2 border-b border-slate-50 pb-2 flex-shrink-0">
                <Layout size={18} className="text-indigo-500" /> {t("questionPalette")}
              </h3>
              <div className="overflow-y-auto pr-2 space-y-6 custom-scrollbar">
                {Object.entries(groupedQuestions).map(([sectionName, qs]: [string, any]) => (
                  <div key={sectionName} className="space-y-3">
                    <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest border-l-2 border-indigo-500 pl-2">
                      {sectionName}
                    </p>
                    <div className="grid grid-cols-5 gap-2">
                      {qs.map((q: any, i: number) => {
                        const isAnswered = answers.some((a) => a.questionId === q.id);
                        const isCurrentSection = q.subject?.name === currentSection;
                        return (
                          <button
                            key={q.id}
                            onClick={() => {
                              setCurrentSection(sectionName);
                              // Small timeout to allow the section to switch before scrolling
                              setTimeout(() => {
                                const el = document.getElementById(`question-${q.id}`);
                                if (el) {
                                  el.scrollIntoView({ behavior: 'smooth', block: 'center' });
                                }
                              }, 100);
                            }}
                            className={`aspect-square rounded-lg flex items-center justify-center text-xs font-bold border transition-all hover:scale-110 active:scale-95 ${isAnswered
                                ? "bg-green-500 border-green-600 text-white shadow-sm shadow-green-100"
                                : isCurrentSection
                                  ? "bg-indigo-50 border-indigo-200 text-indigo-600 shadow-sm shadow-indigo-50"
                                  : "bg-slate-50 border-slate-100 text-slate-400"
                              }`}
                          >
                            {i + 1}
                          </button>
                        );
                      })}
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Live Metrics for Tier 3 */}
            {state?.tier === "3" && liveMetrics && (
              <div className="bg-slate-900 p-5 rounded-2xl text-white shadow-xl animate-in fade-in slide-in-from-top-4 duration-300">
                <p className="text-[10px] font-black text-blue-400 uppercase tracking-widest mb-4">Live Performance Stats</p>
                <div className="space-y-4">
                  <div className="flex justify-between items-center border-b border-white/10 pb-2">
                    <span className="text-xs text-slate-400">Accuracy</span>
                    <span className="text-lg font-black text-green-400">{liveMetrics.accuracy}%</span>
                  </div>
                  <div className="flex justify-between items-center border-b border-white/10 pb-2">
                    <span className="text-xs text-slate-400">Avg Speed</span>
                    <span className="text-lg font-black text-blue-400">{liveMetrics.speed}s</span>
                  </div>
                  <div className="flex justify-between items-center border-b border-white/10 pb-2">
                    <span className="text-xs text-slate-400">Consistency</span>
                    <span className="text-lg font-black text-purple-400">{liveMetrics.consistency}</span>
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Questions */}
          <div className="lg:col-span-3 space-y-6">
            {filteredQuestions.map((q: any, i: number) => (
              <div
                key={q.id}
                id={`question-${q.id}`}
                className="bg-white p-8 rounded-2xl border border-slate-200 shadow-sm hover:border-indigo-300 transition-colors scroll-mt-24"
              >
                <p className="text-xs font-bold text-indigo-600 mb-3 uppercase tracking-widest bg-indigo-50 w-fit px-3 py-1 rounded-full border border-indigo-100">
                  {q.subject.name}
                </p>
                <h3 className="text-xl font-bold text-slate-800 mb-8 leading-relaxed">
                  {i + 1}. <FormattedText text={q.text} />
                </h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {q.options.map((opt: string) => (
                    <button
                      key={opt}
                      onClick={() => handleAnswerChange(q.id, opt)}
                      className={`p-5 rounded-2xl border-2 text-left font-semibold transition-all ${answers.find((a) => a.questionId === q.id)
                          ?.selectedOption === opt
                          ? "bg-indigo-600 border-indigo-700 text-white shadow-xl translate-y-[-2px]"
                          : "border-slate-100 text-slate-600 hover:border-indigo-200 hover:bg-slate-50"
                        }`}
                    >
                      {opt}
                    </button>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  // 3. Pre-start confirmation view
  if (test && !activeTest) {
    return (
      <div className="p-4 sm:p-6 lg:p-8 bg-slate-50 min-h-screen">
        <div className="max-w-3xl mx-auto">
          <button
            onClick={() => navigate("/exam-instructions")}
            className="mb-8 text-sm font-bold text-slate-500 hover:text-blue-600 flex items-center gap-2 group transition-all"
          >
            <span className="group-hover:-translate-x-1 transition-transform">
              ←
            </span>{" "}
            {t("backToExamInstructions")}
          </button>

          <div className="bg-gradient-to-r from-indigo-600 to-purple-600 rounded-2xl p-8 text-white mb-8 relative overflow-hidden">
            <div className="absolute top-0 right-0 w-40 h-40 bg-white/10 rounded-full -mr-20 -mt-20 blur-2xl" />
            <p className="text-xs tracking-widest uppercase font-bold opacity-80 mb-2">
              {t("step3of3")}
            </p>
            <h1 className="text-3xl font-black">{test.name}</h1>
            <p className="text-indigo-100 text-sm mt-3">
              {test.questions?.length || 0} questions • +1 for correct • −0.25 for wrong answers
            </p>
          </div>

          <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-8">
            <h3 className="font-bold text-slate-800 mb-6">
              {t("readyToBegin")}
            </h3>
            <p className="text-slate-500 text-sm mb-8">
              {t("testNavDesc")}
            </p>

            <button
              onClick={handleStartTest}
              className="w-full bg-indigo-600 hover:bg-indigo-700 text-white py-5 rounded-2xl font-black text-xl flex items-center justify-center gap-3 transition-all hover:scale-[1.01] shadow-xl shadow-indigo-200"
            >
              <PlayCircle size={28} />
              {t("beginAssessment")}
            </button>
          </div>
        </div>
      </div>
    );
  }

  // Fallback - no test data
  return (
    <div className="min-h-screen bg-slate-50 flex items-center justify-center">
      <div className="text-center">
        <p className="font-bold text-slate-500 mb-4">{t("noTestData")}</p>
        <button
          onClick={() => navigate("/artha")}
          className="text-blue-600 font-bold hover:underline"
        >
          {t("returnToArthaEngine")}
        </button>
      </div>
    </div>
  );
}
