import { useState, useEffect } from 'react';
import { ChevronDown, ChevronUp, CheckCircle2, Briefcase } from 'lucide-react';
import axios from 'axios';
import { useTranslation } from '../hooks/useTranslation';

export default function ApplicationStatus({ user }) {
    const { t } = useTranslation();
    const [applications, setApplications] = useState([]);
    const [loading, setLoading] = useState(true);
    const [expandedId, setExpandedId] = useState(null);

    useEffect(() => {
        if (user) fetchApplications();
    }, [user]);

    const fetchApplications = async () => {
        try {
            const resp = await axios.get(`http://localhost:4000/applications/user/otr/${user.otrId}`);
            setApplications(resp.data);
        } catch (err) {
            console.error(err);
        } finally {
            setLoading(false);
        }
    };

    const statusMapping = [
        { key: 'applicationSuccess', dbValue: 'Application Success' },
        { key: 'admitCardRelease', dbValue: 'Admit Card Release' },
        { key: 'examKey', dbValue: 'Exam key' },
        { key: 'results', dbValue: 'Results' }
    ];

    return (
        <div className="max-w-4xl mx-auto space-y-6 animate-fade-in">
            <div className="flex items-center justify-between mb-8">
                <div>
                    <h1 className="page-title mb-1">{t("applicationHub")}</h1>
                    <p className="section-subtitle !mt-0 !mx-0">{t("trackManageJourney")}</p>
                </div>
                <div className="hidden md:flex items-center gap-3 bg-blue-50 px-4 py-2 rounded-2xl border border-blue-100 text-blue-700 text-sm font-bold" style={{ background: 'var(--color-primary-light)', borderColor: 'var(--color-primary-light)', color: 'var(--color-primary-dark)' }}>
                    <Briefcase size={16} /> {t("totalApplications")}: {applications.length}
                </div>
            </div>

            {loading ? (
                <div className="py-20 text-center text-slate-400 italic">{t("syncingAppData")}</div>
            ) : applications.length === 0 ? (
                <div className="py-20 text-center bg-white rounded-3xl border-2 border-dashed" style={{ borderColor: 'var(--border-light)' }}>
                    <p className="text-subtle font-medium">{t("noActiveApps")}</p>
                </div>
            ) : (
                <div className="space-y-4">
                    {applications.map((app) => (
                        <div
                            key={app.id}
                            className={`app-card overflow-hidden transition-all duration-300 ${expandedId === app.id ? 'ring-4' : ''}`}
                            style={{ 
                                borderColor: expandedId === app.id ? 'var(--color-primary)' : 'var(--border-light)',
                                '--tw-ring-color': 'var(--color-primary-light)'
                            }}
                        >
                            <div
                                onClick={() => setExpandedId(expandedId === app.id ? null : app.id)}
                                className="p-6 cursor-pointer flex items-center justify-between"
                            >
                                <div className="flex items-center gap-4">
                                    <div className="w-12 h-12 rounded-2xl flex items-center justify-center font-black text-xl" style={{ background: 'var(--color-primary-light)', color: 'var(--color-primary)' }}>
                                        {app.exam.name[0]}
                                    </div>
                                    <div>
                                        <h3 className="card-title text-slate-900">{app.exam.name}</h3>
                                        <p className="label !mt-1">{app.status}</p>
                                    </div>
                                </div>
                                <div className="flex items-center gap-4">
                                    <span className="badge-success hidden sm:inline-block">
                                        {t("active")}
                                    </span>
                                    {expandedId === app.id ? <ChevronUp className="text-slate-400" /> : <ChevronDown className="text-slate-400" />}
                                </div>
                            </div>

                            {expandedId === app.id && (
                                <div className="px-6 pb-8 pt-2 animate-in zoom-in-95 duration-300">
                                    <div className="rounded-2xl p-6 border" style={{ background: 'var(--bg-light)', borderColor: 'var(--border-light)' }}>
                                        <div className="space-y-6 relative border-l-2 ml-4 pl-8 py-2" style={{ borderColor: 'var(--border-muted)' }}>
                                            {statusMapping.map((step, idx) => {
                                                const currentStatusIdx = statusMapping.findIndex(s => s.dbValue === (app.exam.applicationStatus || 'Application Success'));
                                                const isCompleted = idx <= currentStatusIdx;

                                                return (
                                                    <div key={idx} className="relative">
                                                        <div className="absolute -left-[41px] top-1 w-6 h-6 rounded-full flex items-center justify-center border-2 bg-white transition-colors duration-500" 
                                                            style={{ 
                                                                borderColor: isCompleted ? 'var(--color-primary)' : 'var(--border-muted)',
                                                                color: isCompleted ? 'var(--color-primary)' : 'var(--text-muted)'
                                                            }}>
                                                            {isCompleted ? <CheckCircle2 size={14} /> : <div className="w-1.5 h-1.5 rounded-full" style={{ background: 'var(--border-muted)' }} />}
                                                        </div>
                                                        <div>
                                                            <p className="font-bold transition-colors" style={{ color: isCompleted ? 'var(--text-main)' : 'var(--text-muted)' }}>
                                                                {t(step.key)}
                                                            </p>
                                                            <p className="text-xs mt-0.5" style={{ color: 'var(--text-secondary)' }}>
                                                                {isCompleted ? t("verifiedCompleted") : t("scheduledPending")}
                                                            </p>
                                                        </div>
                                                    </div>
                                                );
                                            })}
                                        </div>
                                    </div>
                                </div>
                            )}
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
}
