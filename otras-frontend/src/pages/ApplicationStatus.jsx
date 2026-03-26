import { useState, useEffect } from 'react';
import { ChevronDown, ChevronUp, CheckCircle2, Clock, Calendar, AlertCircle, Briefcase } from 'lucide-react';
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
        <div className="max-w-4xl mx-auto space-y-6">
            <div className="flex items-center justify-between mb-8">
                <div>
                    <h1 className="text-3xl font-black text-slate-900 mb-1">{t("applicationHub")}</h1>
                    <p className="text-slate-500 font-medium">{t("trackManageJourney")}</p>
                </div>
                <div className="hidden md:flex items-center gap-3 bg-blue-50 px-4 py-2 rounded-2xl border border-blue-100 text-blue-700 text-sm font-bold">
                    <Briefcase size={16} /> {t("totalApplications")}: {applications.length}
                </div>
            </div>

            {loading ? (
                <div className="py-20 text-center text-slate-400 italic">{t("syncingAppData")}</div>
            ) : applications.length === 0 ? (
                <div className="py-20 text-center bg-white rounded-3xl border-2 border-dashed border-slate-200">
                    <p className="text-slate-400 font-medium">{t("noActiveApps")}</p>
                </div>
            ) : (
                <div className="space-y-4">
                    {applications.map((app) => (
                        <div
                            key={app.id}
                            className={`bg-white rounded-3xl border transition-all duration-300 overflow-hidden ${expandedId === app.id ? 'border-blue-300 ring-4 ring-blue-50 shadow-xl' : 'border-slate-100 shadow-sm hover:shadow-md'}`}
                        >
                            <div
                                onClick={() => setExpandedId(expandedId === app.id ? null : app.id)}
                                className="p-6 cursor-pointer flex items-center justify-between"
                            >
                                <div className="flex items-center gap-4">
                                    <div className="w-12 h-12 rounded-2xl bg-blue-50 flex items-center justify-center text-blue-600 font-black text-xl">
                                        {app.exam.name[0]}
                                    </div>
                                    <div>
                                        <h3 className="font-bold text-slate-900 text-lg">{app.exam.name}</h3>
                                        <p className="text-slate-400 text-xs font-bold uppercase tracking-widest">{app.status}</p>
                                    </div>
                                </div>
                                <div className="flex items-center gap-4">
                                    <span className="hidden sm:inline-block px-3 py-1 bg-green-50 text-green-700 text-[10px] font-black rounded-full uppercase">
                                        {t("active")}
                                    </span>
                                    {expandedId === app.id ? <ChevronUp className="text-slate-400" /> : <ChevronDown className="text-slate-400" />}
                                </div>
                            </div>

                            {expandedId === app.id && (
                                <div className="px-6 pb-8 pt-2 animate-in zoom-in-95 duration-300">
                                    <div className="bg-slate-50 rounded-2xl p-6 border border-slate-100">
                                        <div className="space-y-6 relative border-l-2 border-slate-200 ml-4 pl-8 py-2">
                                            {statusMapping.map((step, idx) => {
                                                const currentStatusIdx = statusMapping.findIndex(s => s.dbValue === (app.exam.applicationStatus || 'Application Success'));
                                                const isCompleted = idx <= currentStatusIdx;

                                                return (
                                                    <div key={idx} className="relative">
                                                        <div className={`absolute -left-[41px] top-1 w-6 h-6 rounded-full flex items-center justify-center border-2 bg-white transition-colors duration-500 ${isCompleted ? 'border-blue-500 text-blue-500' : 'border-slate-300 text-slate-300'}`}>
                                                            {isCompleted ? <CheckCircle2 size={14} /> : <div className="w-1.5 h-1.5 rounded-full bg-slate-300" />}
                                                        </div>
                                                        <div>
                                                            <p className={`font-bold transition-colors ${isCompleted ? 'text-slate-900' : 'text-slate-400'}`}>
                                                                {t(step.key)}
                                                            </p>
                                                            <p className="text-xs text-slate-500 mt-0.5">
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
