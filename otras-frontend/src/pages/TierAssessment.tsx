import { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { ClipboardList, ChevronRight, GraduationCap } from "lucide-react";
import axios from "axios";
import { useTranslation } from "../hooks/useTranslation";

export default function TierAssessment({ user }) {
  const navigate = useNavigate();
  const { tier } = useParams();
  const { t } = useTranslation();
  
  const [exams, setExams] = useState([]);
  const [selectedExamId, setSelectedExamId] = useState("");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchExamsAndVerify();
  }, [tier]);

  const fetchExamsAndVerify = async () => {
    try {
      setLoading(true);
      const statusResp = await axios.get(`http://localhost:4000/artha/status/${user?.id || 0}`);
      const tierStatus = statusResp.data;

      if (tier === '2' && !tierStatus.tier2?.unlocked) {
        if (tierStatus.tier2?.subscriptionRequired) {
          navigate("/subscriptions");
        } else {
          navigate("/artha");
        }
        return;
      }

      if (tier === '3' && !tierStatus.tier3?.unlocked) {
        if (tierStatus.tier3?.subscriptionRequired) {
          navigate("/subscriptions");
        } else {
          navigate("/artha");
        }
        return;
      }

      const resp = await axios.get(`http://localhost:4000/exams`);
      const filteredExams = resp.data.filter((exam) => {
        const name = (exam.name || "").toLowerCase().trim();
        return !name.includes("tier 1") && !name.includes("tier1");
      });
      setExams(filteredExams);
    } catch (err) {
      console.error(`Failed to fetch data`, err);
    } finally {
      setLoading(false);
    }
  };

  const handleContinue = () => {
    if (!selectedExamId) return;
    navigate("/company-instructions", {
      state: {
        tier,
        examId: selectedExamId
      }
    });
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-slate-50 flex items-center justify-center">
        <div className="text-center">
          <div className="w-12 h-12 border-4 border-blue-200 border-t-blue-600 rounded-full animate-spin mx-auto mb-4" />
          <p className="font-bold text-slate-500">{t("loadingExamsMsg")}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50 p-4 sm:p-8 flex items-center justify-center">
      <div className="w-full max-w-xl">
        {/* Back button */}
        <button
          onClick={() => navigate("/artha")}
          className="mb-8 text-sm font-bold text-slate-500 hover:text-blue-600 flex items-center gap-2 group transition-all"
        >
          <span className="group-hover:-translate-x-1 transition-transform">←</span> {t("backToArthaEngine")}
        </button>

        <div className="bg-white rounded-2xl border border-slate-200 shadow-xl overflow-hidden">
          <div className="bg-gradient-to-r from-blue-600 to-indigo-600 p-8 text-white relative">
            <div className="absolute top-0 right-0 w-32 h-32 bg-white/10 rounded-full -mr-10 -mt-10 blur-xl" />
            <div className="flex items-center gap-4 mb-2">
              <div className="w-12 h-12 bg-white/20 rounded-xl flex items-center justify-center">
                <GraduationCap size={24} />
              </div>
              <div>
                <p className="text-xs uppercase tracking-widest font-bold opacity-80">
                  {t("tierAssessment")} {tier}
                </p>
                <h1 className="text-2xl font-black">{t("selectTargetExam")}</h1>
              </div>
            </div>
            <p className="text-blue-100 text-sm mt-4">
              {t("chooseExam")}
            </p>
          </div>

          <div className="p-8 space-y-6">
            <div>
              <label className="block text-sm font-bold text-slate-700 mb-2 flex items-center gap-2">
                <ClipboardList size={16} className="text-blue-500" /> {t("availableExams")}
              </label>
              <select
                value={selectedExamId}
                onChange={(e) => setSelectedExamId(e.target.value)}
                className="w-full p-4 rounded-xl border-2 border-slate-200 bg-slate-50 text-slate-800 font-semibold focus:border-blue-500 focus:ring-4 focus:ring-blue-50 outline-none transition-all appearance-none"
              >
                <option value="" disabled>{t("selectAnExam")}</option>
                {exams.map((exam) => (
                  <option key={exam.id} value={exam.id}>
                    {exam.name}
                  </option>
                ))}
              </select>
              {exams.length === 0 && (
                <p className="text-sm text-red-500 mt-2 font-semibold">
                  {t("noExamsForTier")}
                </p>
              )}
            </div>

            <button
              disabled={!selectedExamId}
              onClick={handleContinue}
              className={`w-full py-4 rounded-xl font-bold text-sm flex items-center justify-center gap-2 transition-all shadow-lg ${
                selectedExamId
                  ? "bg-blue-600 hover:bg-blue-700 text-white shadow-blue-200 hover:scale-[1.02]"
                  : "bg-slate-100 text-slate-400 cursor-not-allowed shadow-none"
              }`}
            >
              {t("continueToInstructions")} <ChevronRight size={18} />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
