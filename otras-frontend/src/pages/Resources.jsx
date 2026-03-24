import React from "react";
import { useNavigate } from "react-router-dom";
import { BookOpen, FileText, Download, PlayCircle } from "lucide-react";
import { useTranslation } from "../hooks/useTranslation";

export default function Resources() {
  const navigate = useNavigate();
  const { t } = useTranslation();
  return (
    <div className="min-h-screen animate-fade-in max-w-6xl mx-auto space-y-6">

      {/* HEADER */}
      <div className="mb-6">
        <h1 className="page-title mb-1">
          {t("preparationArchitect")}
        </h1>
        <p className="section-subtitle !mt-0 !mx-0">
          {t("curatedMaterials")}
        </p>
      </div>

      {/* DISCOVERY ENGINE */}
      <div className="app-card p-6 mb-8">
        <h3 className="card-title text-slate-800 mb-4 tracking-wide">{t("discoveryEngine")}</h3>

        <div className="grid md:grid-cols-4 gap-4">
          <select className="input font-medium bg-slate-50">
            <option>SSC CGL 2024</option>
          </select>

          <select className="input font-medium bg-slate-50">
            <option>Quantitative Aptitude</option>
          </select>

          <select className="input font-medium bg-slate-50">
            <option>Beginner (Foundations)</option>
          </select>

          <button className="btn-primary w-full">
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
      <div className="app-card p-6">
        <h3 className="card-title text-slate-800 mb-4 tracking-wide">
          {t("globalTrendingDownloads")}
        </h3>
        <div className="divide-y" style={{ borderColor: 'var(--border-light)' }}>
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
  <div className={`app-card text-center p-6 ${hover ? 'hover-lift' : ''}`}>
    <div className="icon-box mx-auto mb-4">{icon}</div>
    <h4 className="card-title text-slate-800">{title}</h4>
    <p className="text-subtle font-medium text-sm mt-1">{desc}</p>
  </div>
);

const DownloadItem = ({ title, size, label }) => (
  <div className="flex justify-between items-center py-4 group">
    <div className="flex items-center gap-4">
      <div className="w-10 h-10 rounded-xl flex items-center justify-center" style={{ background: 'var(--color-primary-light)', color: 'var(--color-primary)' }}>
        <FileText size={18} />
      </div>
      <div>
        <p className="font-bold text-slate-800 group-hover:text-blue-600 transition-colors">{title}</p>
        <span className="label !normal-case !text-[11px] !mt-1">PDF Document • {size}</span>
      </div>
    </div>
    <button className="btn-secondary !py-2 !px-4 text-sm flex items-center gap-2">
      <Download size={16} /> {label}
    </button>
  </div>
);
