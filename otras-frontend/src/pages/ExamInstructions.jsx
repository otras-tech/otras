import { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { FileText, CheckCircle2, PlayCircle, ChevronLeft } from "lucide-react";
import axios from "axios";
import { useTranslation } from "../hooks/useTranslation";

export default function ExamInstructions() {
  const navigate = useNavigate();
  const { state } = useLocation();
  const [agreed, setAgreed] = useState(false);
  const [exam, setExam] = useState(null);
  const [testData, setTestData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [starting, setStarting] = useState(false);
  const { t } = useTranslation();

  useEffect(() => {
    if (state?.examId) {
      fetchSpecificExam(state.examId);
    } else {
      fetchTier1Exam();
    }
  }, [state]);

  const fetchSpecificExam = async (id) => {
    try {
      const detailResp = await axios.get(`http://localhost:4000/exams/${id}`);
      setExam(detailResp.data);

      const testResp = await axios.get(`http://localhost:4000/exams/${id}/random-test`);
      setTestData(testResp.data);
    } catch (err) {
      console.error("Failed to fetch specific exam", err);
    } finally {
      setLoading(false);
    }
  };

  const fetchTier1Exam = async () => {
    try {
      const resp = await axios.get("http://localhost:4000/exams");
      const tier1 = resp.data.find(
        (e) => {
          const name = (e.name || "").toLowerCase().replace(/[^a-z0-9]/g, ""); // Remove hyphen, space, etc.
          return name === "tier1";
        }
      );
      if (tier1) {
        const detailResp = await axios.get(`http://localhost:4000/exams/${tier1.id}`);
        setExam(detailResp.data);

        const testResp = await axios.get(`http://localhost:4000/exams/${tier1.id}/random-test`);
        setTestData(testResp.data);
      }
    } catch (err) {
      console.error("Failed to fetch Tier 1 exam", err);
    } finally {
      setLoading(false);
    }
  };

  const handleStartTest = async () => {
    if (!testData) {
      alert("Test data failed to load. Please refresh the page.");
      return;
    }
    setStarting(true);
    navigate('/artha-test', { state: { testData, tier: state?.tier } });
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-slate-50 flex items-center justify-center">
        <div className="text-center">
          <div className="w-12 h-12 border-4 border-blue-200 border-t-blue-600 rounded-full animate-spin mx-auto mb-4" />
          <p className="font-bold text-slate-500">{t("loadingExamDetails")}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50 p-4 sm:p-8">
      <div className="max-w-3xl mx-auto">

        {/* Back button */}
        <button
          onClick={() => navigate("/company-instructions")}
          className="mb-8 text-sm font-bold text-slate-500 hover:text-blue-600 flex items-center gap-2 group transition-all"
        >
          <ChevronLeft size={16} className="group-hover:-translate-x-1 transition-transform" /> {t("backToCompanyInstructions")}
        </button>

        {/* Header */}
        <div className="bg-gradient-to-r from-indigo-600 to-purple-600 rounded-2xl p-8 text-white mb-8 relative overflow-hidden">
          <div className="absolute top-0 right-0 w-40 h-40 bg-white/10 rounded-full -mr-20 -mt-20 blur-2xl" />
          <div className="flex items-center gap-4 mb-4">
            <div className="w-14 h-14 bg-white/20 rounded-2xl flex items-center justify-center">
              <FileText size={28} />
            </div>
            <div>
              <p className="text-xs tracking-widest uppercase font-bold opacity-80">{t("step2of3")}</p>
              <h1 className="text-2xl font-black">{t("examInstructions")}</h1>
            </div>
          </div>
          <p className="text-indigo-100 text-sm">
            {t("reviewExamPattern")}
          </p>
        </div>

        {/* Exam Pattern */}
        {exam ? (
          <>
            <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-8 mb-6">
              <h2 className="font-bold text-slate-800 text-lg mb-6 pb-4 border-b border-slate-100 flex items-center gap-3">
                <FileText size={20} className="text-indigo-500" />
                {exam.name} — {t("examPattern")}
              </h2>

              {/* Subject Table */}
              <div className="overflow-hidden rounded-xl border border-slate-200 mb-8">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="bg-slate-50 border-b border-slate-200">
                      <th className="text-left p-4 font-bold text-slate-600 uppercase tracking-wider text-xs">{t("subject")}</th>
                      <th className="text-center p-4 font-bold text-slate-600 uppercase tracking-wider text-xs">{t("noOfQuestions")}</th>
                      <th className="text-center p-4 font-bold text-slate-600 uppercase tracking-wider text-xs">{t("totalMarks")}</th>
                    </tr>
                  </thead>
                  <tbody>
                    {exam.subjects?.map((subject, i) => {
                      let questionCount = 0;
                      if (testData?.test?.questions) {
                        // Accurately derive the number of questions for this specific test
                        questionCount = testData.test.questions.filter(q => q.subjectId === subject.id).length;
                      } else {
                        questionCount = exam.noOfQuestions || "—";
                      }

                      return (
                        <tr key={subject.id} className={`border-b border-slate-100 ${i % 2 === 0 ? "bg-white" : "bg-slate-50/50"}`}>
                          <td className="p-4 font-semibold text-slate-700">{subject.name}</td>
                          <td className="p-4 text-center font-bold text-blue-600">{questionCount}</td>
                          <td className="p-4 text-center font-bold text-slate-600">{questionCount}</td>
                        </tr>
                      );
                    })}
                    <tr className="bg-slate-100 border-t-2 border-slate-300">
                      <td className="p-4 font-black text-slate-800 text-right uppercase tracking-wide text-xs">{t("Total")}</td>
                      <td className="p-4 text-center font-black text-blue-700 text-lg">
                        {testData?.test?.questions?.length || exam.noOfQuestions || "—"}
                      </td>
                      <td className="p-4 text-center font-black text-slate-800 text-lg">
                        {testData?.test?.questions?.length || exam.noOfQuestions || "—"}
                      </td>
                    </tr>
                  </tbody>
                </table>
              </div>

              {/* Marking Scheme */}
              <h3 className="font-bold text-slate-800 mb-4">{t("markingScheme")}</h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="flex items-center gap-4 p-4 bg-green-50 rounded-xl border border-green-100">
                  <CheckCircle2 size={24} className="text-green-600 flex-shrink-0" />
                  <div>
                    <p className="font-bold text-green-800 text-sm">{t("correctAnswer")}</p>
                    <p className="text-green-600 text-2xl font-black">+1 Mark</p>
                  </div>
                </div>
                <div className="flex items-center gap-4 p-4 bg-red-50 rounded-xl border border-red-100">
                  <div className="w-6 h-6 rounded-full bg-red-200 flex items-center justify-center flex-shrink-0">
                    <span className="text-red-600 font-black text-sm">✕</span>
                  </div>
                  <div>
                    <p className="font-bold text-red-800 text-sm">{t("negativeMarking")}</p>
                    <p className="text-red-600 text-2xl font-black">−0.25 for wrong answers</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Agree + Start */}
            <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-6">
              <label className="flex items-center gap-4 cursor-pointer group mb-6">
                <input
                  type="checkbox"
                  checked={agreed}
                  onChange={(e) => setAgreed(e.target.checked)}
                  className="w-5 h-5 rounded border-slate-300 text-indigo-600 focus:ring-indigo-500 cursor-pointer"
                />
                <span className="text-sm font-semibold text-slate-700 group-hover:text-indigo-600 transition-colors">
                  {t("iAgreeExam")}
                </span>
              </label>

              <button
                disabled={!agreed || starting}
                onClick={handleStartTest}
                className={`w-full py-4 rounded-2xl font-bold text-sm flex items-center justify-center gap-3 transition-all ${
                  agreed
                    ? "bg-indigo-600 hover:bg-indigo-700 text-white shadow-lg shadow-indigo-100 hover:scale-[1.01]"
                    : "bg-slate-100 text-slate-400 cursor-not-allowed"
                }`}
              >
                {starting ? (
                  <>
                    <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                    {t("loadingTest")}
                  </>
                ) : (
                  <>
                    <PlayCircle size={20} />
                    {t("startTest")}
                  </>
                )}
              </button>
            </div>
          </>
        ) : (
          <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-12 text-center">
            <p className="font-bold text-slate-500">{t("noExamDetails")}</p>
            <p className="text-slate-400 text-sm mt-2">{t("ensureExamConfigured")}</p>
          </div>
        )}
      </div>
    </div>
  );
}
