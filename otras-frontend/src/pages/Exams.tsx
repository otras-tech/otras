import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Search, MapPin, BookOpen, Shield, Briefcase, ExternalLink, Bookmark } from 'lucide-react';
import ExamCard from '../components/ExamCard';
import { useTranslation } from '../hooks/useTranslation';
import { useAuthStore } from "../store/authStore";

import { useQuery } from "@tanstack/react-query";
import { getExams, getJobs } from "../services/examApi";

export default function Exams() {
  const { user } = useAuthStore();
  const navigate = useNavigate();
  const { t } = useTranslation();

  const [saved, setSaved] = useState<string[]>([]);
  const [query, setQuery] = useState('');

  const { data: exams = [], isLoading: loadingExams } = useQuery({
    queryKey: ['exams'],
    queryFn: getExams,
  });

  const { data: jobs = [], isLoading: loadingJobs } = useQuery({
    queryKey: ['jobs'],
    queryFn: getJobs,
  });

  const loading = loadingExams || loadingJobs;

  const handleSave = (id: string) => {
    setSaved((s) => s.includes(id) ? s.filter((x) => x !== id) : [...s, id]);
  };

  const handleSelectExam = (exam: any) => {
    navigate('/mocktests', { state: { selectedExam: exam } });
  };

  const handleApplyDetails = (exam: any) => {
    navigate('/exams/' + exam.id, { state: { selectedExam: exam } });
  };

  const filtered = exams.filter(
    (e: any) => !query || e.name.toLowerCase().includes(query.toLowerCase())
  );

  return (
    <div className="space-y-8 animate-fade-in">
      {/* RADIANT HEADER */}
      <div className="relative overflow-hidden rounded-[32px] bg-gradient-to-r from-blue-700 via-blue-600 to-indigo-600 p-10 text-white shadow-2xl">
        <div className="relative z-10 max-w-2xl">
          <h1 className="text-4xl font-extrabold tracking-tight mb-3">
            {t("examDiscoveryTitle")}
          </h1>
          <p className="text-blue-100 text-lg">
            {t("examDiscoverySubtitle")}
          </p>
        </div>
        <div className="absolute right-0 top-0 h-full w-1/3 bg-white/10 skew-x-12 translate-x-1/2 blur-3xl"></div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* MAIN FEED */}
        <div className="lg:col-span-2 space-y-6">
          {/* SEARCH BAR GLASS */}
          <div className="glass-card flex items-center px-4 py-2 gap-3 mb-4">
            <Search size={20} className="text-slate-400" />
            <input
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder={t("searchExams")}
              className="w-full bg-transparent border-none outline-none text-slate-700 placeholder:text-slate-400 font-medium"
            />
          </div>

          <div className="flex items-center justify-between mb-2 px-2">
            <h2 className="text-xl font-bold text-slate-800">
              {t("liveNotifications")}
            </h2>
            <div className="flex gap-2">
              <span className="bg-blue-50 text-blue-600 px-3 py-1 rounded-full text-xs font-bold ring-1 ring-blue-100">
                {filtered.length} {t("announcementsFound")}
              </span>
            </div>
          </div>

          {loading ? (
            <div className="grid grid-cols-1 gap-4">
               {[1,2,3].map(i => (
                 <div key={i} className="h-48 w-full bg-slate-100 animate-pulse rounded-3xl" />
               ))}
            </div>
          ) : (
            <div className="grid grid-cols-1 gap-6">
              {filtered.map((exam: any) => (
                <div key={exam.id} className="group relative">
                  <ExamCard
                    exam={{
                      ...exam,
                      tags: exam.subjects?.map((s: any) => s.name) || [],
                      deadline: '2026-04-30',
                      status: 'openStatus'
                    }}
                    saved={saved.includes(exam.id)}
                    onSave={handleSave}
                    onApplyDetails={handleApplyDetails}
                  />
                </div>
              ))}
            </div>
          )}
        </div>

        {/* SIDEBAR POLISH */}
        <div className="space-y-8">
          {/* JOB OPENINGS - MODERN LIST */}
          <div className="premium-card !p-0 overflow-hidden">
            <div className="bg-slate-50 p-6 border-b border-slate-100">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-blue-100 rounded-lg">
                  <Briefcase size={18} className="text-blue-600" />
                </div>
                <h3 className="text-lg font-bold text-slate-800">
                  {t("activeJobOpenings")}
                </h3>
              </div>
            </div>
            
            <div className="p-6 space-y-4">
              {jobs.slice(0, 3).map((job: any) => (
                <div key={job.id} className="p-4 rounded-2xl bg-white border border-slate-100 hover:border-blue-200 hover:shadow-sm transition-all group cursor-pointer">
                  <div className="flex justify-between items-start mb-1">
                    <h4 className="font-bold text-slate-800 group-hover:text-blue-600 transition-colors">
                      {job.title}
                    </h4>
                    <ExternalLink size={14} className="text-slate-300 group-hover:text-blue-400" />
                  </div>
                  <p className="text-xs text-slate-500 line-clamp-2">
                    {job.description}
                  </p>
                </div>
              ))}
              <button className="w-full text-center py-2 text-sm font-bold text-blue-600 hover:text-blue-700 transition-colors">
                {t("viewAllPostings")} →
              </button>
            </div>
          </div>

          {/* QUICK LINKS - GLASSMISM */}
          <div className="bg-indigo-900 rounded-[32px] p-8 text-white relative overflow-hidden shadow-xl">
            <div className="relative z-10">
              <h3 className="text-xl font-bold mb-6">
                {t("resourceAggregator")}
              </h3>
              <div className="space-y-4">
                {[
                  { icon: BookOpen, label: t('previousYearPapers'), route: '/resources' },
                  { icon: Shield, label: t('eligibilityChecker'), route: '/eligibility' },
                ].map(({ icon: Icon, label, route }) => (
                  <button
                    key={label}
                    onClick={() => navigate(route)}
                    className="w-full flex items-center justify-between p-4 rounded-2xl bg-white/10 border border-white/20 hover:bg-white/20 transition-all text-sm font-semibold"
                  >
                    <div className="flex items-center gap-3">
                      <Icon size={18} />
                      {label}
                    </div>
                    <Bookmark size={14} className="opacity-40" />
                  </button>
                ))}
              </div>
            </div>
            {/* Decoration */}
            <div className="absolute -bottom-10 -right-10 h-32 w-32 bg-blue-500/20 blur-3xl rounded-full"></div>
          </div>
        </div>
      </div>
    </div>
  );
}