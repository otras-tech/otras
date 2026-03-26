import { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { ArrowLeft, Calendar, Shield, MapPin, Briefcase, CheckCircle2, LayoutDashboard } from 'lucide-react';
import axios from 'axios';
import { useTranslation } from '../hooks/useTranslation';

export default function ExamDetails({ user }) {
    const navigate = useNavigate();
    const { state } = useLocation();
    const exam = state?.selectedExam;
    const [applying, setApplying] = useState(false);
    const { t } = useTranslation();

    if (!exam) return null;

    const handleApply = async () => {
        if (!user) {
            alert('Please log in to apply.');
            navigate('/profile');
            return;
        }

        try {
            setApplying(true);
            await axios.post('http://localhost:4000/applications', {
                userId: user.id,
                examId: exam.id
            });
            alert('Application successful!');
            navigate('/applications');
        } catch (err) {
            console.error(err);
            if (err.response?.status === 500 && err.response?.data?.message?.includes('Foreign key')) {
                alert('Session expired or user data reset. Please Logout and Re-register.');
            } else {
                alert('Failed to apply. You might have already applied or your session is invalid.');
            }
        } finally {
            setApplying(false);
        }
    };

    return (
        <div className="max-w-4xl mx-auto space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
            <button
                onClick={() => navigate('/exams')}
                className="flex items-center gap-2 text-slate-500 hover:text-blue-600 transition-colors mb-2"
            >
                <ArrowLeft size={16} /> {t("backToDiscovery")}
            </button>

            <div className="bg-white rounded-3xl p-8 border border-slate-100 shadow-xl overflow-hidden relative">
                <div className="absolute top-0 right-0 w-32 h-32 bg-blue-50 rounded-bl-full -z-0 opacity-50" />

                <div className="relative z-10">
                    <div className="flex items-center gap-3 mb-4">
                        <span className="px-3 py-1 bg-blue-100 text-blue-700 text-xs font-black rounded-full uppercase tracking-widest">
                            {t("liveNotification")}
                        </span>
                        <span className="text-slate-400 text-xs font-bold flex items-center gap-1.5">
                            <Calendar size={14} /> {t("postedOn")} Mar 10, 2026
                        </span>
                    </div>

                    <h1 className="text-4xl font-black text-slate-900 mb-4">{exam.name}</h1>
                    <p className="text-lg text-slate-600 leading-relaxed mb-8 border-l-4 border-blue-400 pl-4 bg-slate-50 py-3 rounded-r-lg">
                        {exam.shortDescription || 'Competitive recruitment announcement for central government services.'}
                    </p>

                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-10">
                        {[
                            { icon: Shield, label: t('eligibilityNav'), value: exam.eligibility || 'Graduate' },
                            { icon: MapPin, label: t('location'), value: 'All India' },
                            { icon: Briefcase, label: t('jobPost'), value: 'Grade A/B' },
                            { icon: Calendar, label: t('examDate'), value: exam.examDate || 'May 2026' },
                        ].map(({ icon: Icon, label, value }) => (
                            <div key={label} className="p-4 rounded-2xl bg-slate-50 border border-slate-100">
                                <Icon size={20} className="text-blue-600 mb-2" />
                                <p className="text-[10px] font-black text-slate-400 uppercase tracking-tighter">{label}</p>
                                <p className="text-sm font-bold text-slate-800">{value}</p>
                            </div>
                        ))}
                    </div>

                    <div className="prose prose-slate max-w-none mb-10">
                        <h3 className="text-xl font-bold text-slate-800 mb-3 border-b pb-2">{t("fullDetailsInstructions")}</h3>
                        <div className="text-slate-600 leading-relaxed whitespace-pre-wrap">
                            {exam.longDescription || "The recruitment process consists of three stages: Preliminary Examination, Main Examination, and Interview. Candidates are advised to check the official syllabus and eligibility criteria before applying. Ensure all documents are uploaded in the prescribed format."}
                        </div>
                    </div>

                    <div className="flex flex-wrap items-center gap-4 border-t pt-8">
                        <a
                            href="https://betacloud.ncs.gov.in/"
                            target="_blank"
                            rel="noopener noreferrer"
                            className="px-10 py-4 bg-blue-600 text-white rounded-2xl font-black text-lg shadow-2xl shadow-blue-200 hover:scale-[1.02] transition-all active:scale-95 inline-block text-center"
                        >
                            {t("applyNow")}
                        </a>
                        <button
                            onClick={handleApply}
                            disabled={applying}
                            className="px-8 py-4 bg-white border-2 border-slate-200 text-slate-700 rounded-2xl font-bold hover:bg-slate-50 transition-all flex items-center gap-2"
                        >
                            <LayoutDashboard size={20} /> {applying ? t('applying') : t('alreadyApplied')}
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
}
