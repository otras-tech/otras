import { useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { ShieldCheck, ChevronRight, AlertTriangle } from "lucide-react";
import { useTranslation } from "../hooks/useTranslation";

export default function CompanyInstructions() {
  const navigate = useNavigate();
  const { state } = useLocation();
  const [agreed, setAgreed] = useState(false);
  const { t } = useTranslation();

  const instructions = [
    "The company does not promote, guarantee, or endorse any government or private job opportunities listed on this platform.",
    "The company is not responsible for recruitment decisions, selection processes, or final job outcomes related to any job or exam.",
    "The company does not charge any fees for job placements, recruitment services, or guaranteed selections.",
    "The company is not responsible for any third-party links, advertisements, or external website content accessed through the platform.",
    "Any misuse of the platform, including submitting false information or engaging in fraudulent activities, may result in account suspension or termination.",
    "By using this platform, users agree to comply with all terms, policies, and instructions provided by the company.",
  ];

  return (
    <div className="min-h-screen bg-slate-50 p-4 sm:p-8">
      <div className="max-w-3xl mx-auto">

        {/* Back button */}
        <button
          onClick={() => navigate("/artha")}
          className="mb-8 text-sm font-bold text-slate-500 hover:text-blue-600 flex items-center gap-2 group transition-all"
        >
          <span className="group-hover:-translate-x-1 transition-transform">←</span> {t("backToArthaEngine")}
        </button>

        {/* Header */}
        <div className="bg-gradient-to-r from-blue-600 to-indigo-600 rounded-2xl p-8 text-white mb-8 relative overflow-hidden">
          <div className="absolute top-0 right-0 w-40 h-40 bg-white/10 rounded-full -mr-20 -mt-20 blur-2xl" />
          <div className="flex items-center gap-4 mb-4">
            <div className="w-14 h-14 bg-white/20 rounded-2xl flex items-center justify-center">
              <ShieldCheck size={28} />
            </div>
            <div>
              <p className="text-xs tracking-widest uppercase font-bold opacity-80">{t("step1of3")}</p>
              <h1 className="text-2xl font-black">{t("companyInstructions")}</h1>
            </div>
          </div>
          <p className="text-blue-100 text-sm">
            {t("readAcceptInstructions")}
          </p>
        </div>

        {/* Instructions */}
        <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-8 mb-6">
          <div className="flex items-center gap-3 mb-6 pb-4 border-b border-slate-100">
            <AlertTriangle size={20} className="text-amber-500" />
            <h2 className="font-bold text-slate-800 text-lg">{t("importantNotice")}</h2>
          </div>

          <div className="space-y-5">
            {instructions.map((inst, i) => (
              <div key={i} className="flex items-start gap-4 group">
                <div className="w-8 h-8 bg-blue-50 rounded-lg flex items-center justify-center flex-shrink-0 text-blue-600 font-bold text-sm border border-blue-100 group-hover:bg-blue-600 group-hover:text-white transition-all">
                  {i + 1}
                </div>
                <p className="text-slate-600 text-sm leading-relaxed pt-1">{inst}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Agree + Next */}
        <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-6">
          <label className="flex items-center gap-4 cursor-pointer group mb-6">
            <input
              type="checkbox"
              checked={agreed}
              onChange={(e) => setAgreed(e.target.checked)}
              className="w-5 h-5 rounded border-slate-300 text-blue-600 focus:ring-blue-500 cursor-pointer"
            />
            <span className="text-sm font-semibold text-slate-700 group-hover:text-blue-600 transition-colors">
              {t("iAgreeInstructions")}
            </span>
          </label>

          <button
            disabled={!agreed}
            onClick={() => navigate("/exam-instructions", { state })}
            className={`w-full py-4 rounded-2xl font-bold text-sm flex items-center justify-center gap-2 transition-all ${
              agreed
                ? "bg-blue-600 hover:bg-blue-700 text-white shadow-lg shadow-blue-100 hover:scale-[1.01]"
                : "bg-slate-100 text-slate-400 cursor-not-allowed"
            }`}
          >
            {t("next")} <ChevronRight size={18} />
          </button>
        </div>
      </div>
    </div>
  );
}
