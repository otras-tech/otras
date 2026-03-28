import { Calendar, Clock, Bookmark, ExternalLink } from 'lucide-react';
import { useTranslation } from '../hooks/useTranslation';

export default function ExamCard({ exam, saved, onSave, onApplyDetails }) {
  const { t } = useTranslation();

  return (
    <div className="bg-white rounded-xl p-4 border border-slate-200 shadow-sm hover:shadow-md transition-shadow">
      <div className="flex items-start justify-between mb-2">
        <div>
          <span className="font-semibold text-blue-600 capitalize">{exam.name}</span>
          <div className="flex gap-1 mt-1 flex-wrap">
            {exam.tags.map((tag) => (
              <span
                key={tag}
                className="text-xs font-semibold bg-slate-100 text-slate-500 px-2 py-0.5 rounded uppercase"
              >
                {tag}
              </span>
            ))}
          </div>
        </div>
        <button onClick={() => onSave(exam.id)}>
          <Bookmark
            size={16}
            className={saved ? 'text-blue-600 fill-blue-600' : 'text-slate-400 hover:text-blue-400'}
          />
        </button>
      </div>
      <div className="flex gap-6 mb-2">
        <div className="flex items-center gap-1.5">
          <Calendar size={13} className="text-slate-400" />
          <span className="text-slate-500 text-xs">
            {t("deadlineLabel")}: <span className="text-blue-600 font-semibold">{exam.deadline}</span>
          </span>
        </div>
        <div className="flex items-center gap-1.5">
          <Clock size={13} className="text-slate-400" />
          <span className="text-slate-500 text-xs">
            {t("examDate")}: <span className="text-blue-600 font-semibold">{exam.examDate}</span>
          </span>
        </div>
      </div>
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <span className="text-slate-500 text-xs">{t("status")}:</span>
          <span className="text-xs font-semibold text-green-700 bg-green-100 px-2 py-0.5 rounded-full">
            {t(exam.status)}
          </span>
        </div>
        <div className="flex items-center gap-2">
          <button className="text-slate-500 text-sm hover:text-blue-600 transition-colors">
            {t("save")}
          </button>
          <button
            onClick={(e) => {
              e.stopPropagation();
              onApplyDetails(exam);
            }}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-white text-xs font-semibold transition-opacity hover:opacity-90"
            style={{ background: '#1e3a8a' }}
          >
            {t("applyDetails")} <ExternalLink size={12} />
          </button>
        </div>
      </div>
    </div>
  );
}
