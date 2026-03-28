import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, FileText, Download, Calendar, BookOpen } from 'lucide-react';
import axios from 'axios';
import { useTranslation } from '../hooks/useTranslation';

export default function PreviousPapers() {
    const navigate = useNavigate();
    const { t } = useTranslation();
    const [pyps, setPyps] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchPyps();
    }, []);

    const fetchPyps = async () => {
        try {
            const resp = await axios.get('http://localhost:4000/pyps');
            setPyps(resp.data);
        } catch (err) {
            console.error(err);
        } finally {
            setLoading(false);
        }
    };

    const handleDownload = async (fileUrl, fileName) => {
        if (!fileUrl) return;

        let downloadUrl = fileUrl;
        
        // Google Drive links often face CORS issues when fetched directly from the browser.
        // We will try to format them for direct download.
        if (fileUrl.includes('drive.google.com')) {
           if (fileUrl.includes('/view?usp=sharing')) {
                downloadUrl = fileUrl.replace('/view?usp=sharing', '/export?format=pdf');
            } else if (fileUrl.includes('/view')) {
                downloadUrl = fileUrl.replace('/view', '/export?format=pdf');
            } else if (fileUrl.includes('/folders/')) {
                 // It's a folder, we can't directly download a folder easily via export, 
                 // so we just open it.
                 window.open(fileUrl, '_blank');
                 return;
            }
            
            // For Google Drive files, the most reliable way to bypass CORS and force download
            // without a backend proxy is to use a hidden iframe or anchor tag.
            // fetch() will almost always fail due to CORS on drive.google.com.
            const a = document.createElement("a");
            a.href = downloadUrl;
            a.download = fileName || "download";
            a.target = "_blank"; // Fallback to open in new tab if direct download is blocked by browser policy
            document.body.appendChild(a);
            a.click();
            a.remove();
            return;
        }

        // For non-Google Drive URLs, try the programatic fetch approach
        try {
            const response = await fetch(downloadUrl);
            const blob = await response.blob();
            const url = window.URL.createObjectURL(blob);

            const a = document.createElement("a");
            a.href = url;
            a.download = fileName || "download";
            document.body.appendChild(a);
            a.click();
            a.remove();
            window.URL.revokeObjectURL(url);
        } catch (error) {
            console.error("Download failed, falling back to direct link:", error);
            // Fallback for CORS or other fetch errors
            const a = document.createElement("a");
            a.href = downloadUrl;
            a.download = fileName || "download";
            a.target = "_blank";
            document.body.appendChild(a);
            a.click();
            a.remove();
        }
    };

    return (
        <div className="max-w-5xl mx-auto space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
            <button
                onClick={() => navigate('/resources')}
                className="flex items-center gap-2 text-slate-500 hover:text-blue-600 transition-colors mb-2 font-bold text-sm"
            >
                <ArrowLeft size={16} /> {t("returnToArchitect")}
            </button>

            <div className="flex items-center justify-between mb-8">
                <div>
                    <h1 className="text-3xl font-black text-slate-800 mb-1">{t("pypVaultTitle")}</h1>
                    <p className="text-slate-500 font-medium">{t("pypVaultSubtitle")}</p>
                </div>
            </div>

            <div className="bg-white rounded-3xl border border-slate-100 shadow-sm overflow-hidden">
                <div className="p-6 border-b border-slate-100 flex items-center justify-between">
                    <h3 className="font-bold text-slate-800">{t("availableExamArchives")}</h3>
                    <span className="text-xs bg-blue-50 text-blue-700 font-black px-3 py-1 rounded-full">{pyps.length} {t("documentsLive")}</span>
                </div>
                
                {loading ? (
                    <div className="py-20 flex flex-col items-center justify-center text-slate-400">
                        <div className="w-10 h-10 border-4 border-slate-200 border-t-blue-500 rounded-full animate-spin mb-4" />
                        {t("pullingOfficialDocs")}
                    </div>
                ) : pyps.length === 0 ? (
                    <div className="py-20 text-center text-slate-400">{t("noArchivalResources")}</div>
                ) : (
                    <div className="divide-y divide-slate-50">
                        {pyps.map(pyp => (
                            <div key={pyp.id} className="p-6 hover:bg-slate-50 transition-colors flex items-center justify-between group">
                                <div className="flex items-center gap-5">
                                    <div className="w-14 h-14 bg-red-50 rounded-2xl flex items-center justify-center text-red-600 group-hover:scale-105 transition-transform shrink-0">
                                        <FileText size={24} />
                                    </div>
                                    <div>
                                        <div className="flex items-center gap-2 mb-1">
                                            <h4 className="font-black text-slate-800 text-lg group-hover:text-blue-600 transition-colors">
                                                {pyp.exam?.name || t("officialQuestionDoc")}
                                            </h4>
                                            <span className="px-2 py-0.5 bg-blue-100 text-[10px] text-blue-700 font-black rounded uppercase tracking-wider">
                                                {t("official")}
                                            </span>
                                        </div>
                                        <div className="flex items-center gap-4 text-xs font-bold text-slate-400">
                                            <span className="flex items-center gap-1.5"><Calendar size={12} /> {t("year")} {pyp.year} {t("cycle")}</span>
                                            <span className="flex items-center gap-1.5"><BookOpen size={12} /> {t("validatedTemplate")}</span>
                                        </div>
                                    </div>
                                </div>
                                
                                <button 
                                    onClick={() => handleDownload(pyp.fileUrl, pyp.exam?.name ? `${pyp.exam.name.replace(/\s+/g, '_')}_Paper.pdf` : 'Previous_Year_Paper.pdf')}
                                    className="flex items-center gap-2 bg-white border-2 border-slate-100 shadow-sm hover:border-blue-200 hover:text-blue-600 px-5 py-2.5 rounded-xl font-bold text-slate-600 transition-all active:scale-95"
                                >
                                    <Download size={18} /> {t("downloadTarget")}
                                </button>
                            </div>
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
}
