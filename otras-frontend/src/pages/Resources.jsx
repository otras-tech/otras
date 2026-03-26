import React from "react";
import { useNavigate } from "react-router-dom";
import { BookOpen, FileText, Download, PlayCircle } from "lucide-react";
import { useTranslation } from "../hooks/useTranslation";

export default function Resources() {
  const navigate = useNavigate();
  const { t } = useTranslation();
  return (
    <div className="min-h-screen bg-transparent animate-in fade-in zoom-in-95 duration-500 max-w-6xl mx-auto space-y-6">

      {/* HEADER */}
      <div className="mb-6">
        <h1 className="text-3xl font-black text-slate-800 mb-1">
          {t("preparationArchitect")}
        </h1>
        <p className="text-slate-500 font-medium">
          {t("curatedMaterials")}
        </p>
      </div>

      {/* DISCOVERY ENGINE */}
      <div className="bg-white rounded-3xl border border-slate-100 shadow-sm p-6 mb-8">
        <h2 className="font-bold text-slate-800 mb-4 tracking-wide">{t("discoveryEngine")}</h2>

        <div className="grid md:grid-cols-4 gap-4">
          <select className="border border-slate-200 rounded-xl p-3 bg-slate-50 text-slate-700 outline-none focus:border-blue-500 font-medium">
            <option>SSC CGL 2024</option>
          </select>

          <select className="border border-slate-200 rounded-xl p-3 bg-slate-50 text-slate-700 outline-none focus:border-blue-500 font-medium">
            <option>Quantitative Aptitude</option>
          </select>

          <select className="border border-slate-200 rounded-xl p-3 bg-slate-50 text-slate-700 outline-none focus:border-blue-500 font-medium">
            <option>Beginner (Foundations)</option>
          </select>

          <button className="bg-blue-600 text-white font-bold rounded-xl p-3 hover:bg-blue-700 transition active:scale-95 shadow-md shadow-blue-200">
            {t("findMaterials")}
          </button>
        </div>
      </div>

      {/* RESOURCE CARDS */}
      <div className="grid md:grid-cols-4 gap-6 mb-8">
        <Card icon={<BookOpen size={28} />} title={t("admitCard")} desc={t("downloadHallTickets")} />
        <Card icon={<FileText size={28} />} title={t("mockTests")} desc={t("mockTestsCount")} />
        <div onClick={() => navigate('/previous-papers')} className="cursor-pointer group">
          <Card icon={<Download size={28} />} title={t("previousYearPapers")} desc={t("previousPapersDesc")} hover />
        </div>
        <Card icon={<PlayCircle size={28} />} title={t("cutOff")} desc={t("cutOffDesc")} />
      </div>

      {/* DOWNLOAD LIST */}
      <div className="bg-white rounded-3xl border border-slate-100 shadow-sm p-6">
        <h3 className="font-bold text-slate-800 mb-4 tracking-wide">
          {t("globalTrendingDownloads")}
        </h3>
      <div className="divide-y divide-slate-100">
          <DownloadItem title="SSC CGL 2023 Solved Paper" size="2.4 MB" label={t("getOffline")} />
          <DownloadItem title="Banking Awareness Monthly Digest" size="1.8 MB" label={t("getOffline")} />
          <DownloadItem title="Reasoning Shortcuts & Tricks" size="3.1 MB" label={t("getOffline")} />
          <DownloadItem title="UPSC CSAT Foundation Module" size="5.2 MB" label={t("getOffline")} />
      </div>
      </div>
    </div>
  );
}

const Card = ({ icon, title, desc, hover }) => (
  <div className={`bg-white border text-center border-slate-100 shadow-sm rounded-3xl p-6 transition-all duration-300 ${hover ? 'hover:border-blue-300 hover:shadow-lg group-hover:-translate-y-1' : ''}`}>
    <div className="flex justify-center text-blue-600 mb-4 bg-blue-50 w-16 h-16 rounded-2xl items-center mx-auto">{icon}</div>
    <h4 className="font-bold text-slate-800">{title}</h4>
    <p className="text-slate-500 font-medium text-sm mt-1">{desc}</p>
  </div>
);

const DownloadItem = ({ title, size, label }) => (
  <div className="flex justify-between items-center py-4 group">
    <div className="flex items-center gap-4">
      <div className="w-10 h-10 bg-red-50 text-red-600 rounded-xl flex items-center justify-center">
        <FileText size={18} />
      </div>
      <div>
        <p className="font-bold text-slate-800 group-hover:text-blue-600 transition-colors">{title}</p>
        <span className="text-xs font-bold text-slate-400">PDF Document • {size}</span>
      </div>
    </div>
    <button className="text-blue-600 font-bold px-4 py-2 hover:bg-blue-50 rounded-lg transition-colors text-sm flex items-center gap-2">
      <Download size={16} /> {label}
    </button>
  </div>
);
