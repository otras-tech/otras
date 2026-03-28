import React from 'react';
import { Brain } from 'lucide-react';
import { useTranslation } from '../../hooks/useTranslation';
import FormattedText from '../FormattedText';

const IntelligenceFeedback = ({ feedback }) => {
  const { t } = useTranslation();

  if (!feedback) return null;

  const tier = feedback.tier || 1;
  console.log("ARTHA: Rendering report for tier", tier);

  const tier1Keys = ['logicalFoundation', 'subjectDepth', 'readinessInsight', 'examSuggestions'];
  const tier2Keys = ['subjectStrength', 'weakAreas', 'preparationAdvice'];
  const tier3Keys = ['accuracyInsight', 'speedInsight', 'consistencyInsight'];

  // Maps backend field names to i18n translation keys (when they differ)
  const keyLabelMap = {
    weakAreas: 'weakAreasInsight',
  };

  let activeTierTitle = "careerReadinessInsight";
  let Icon = Brain;
  let iconColor = "text-purple-500";
  let targetKeys = tier1Keys;

  if (tier === 3) {
    activeTierTitle = "performanceIntelligenceInsight";
    iconColor = "text-blue-500";
    targetKeys = tier3Keys;
  } else if (tier === 2) {
    activeTierTitle = "subjectCompetencyInsight";
    iconColor = "text-indigo-500";
    targetKeys = tier2Keys;
  }

  // Filter for relevant keys that have values
  const feedbackEntries = Object.entries(feedback).filter(([key, value]) => 
    targetKeys.includes(key) && value
  );

  const colors = [
    { text: 'text-purple-600', bg: 'bg-purple-50/50', border: 'border-purple-100' },
    { text: 'text-indigo-600', bg: 'bg-indigo-50/50', border: 'border-indigo-100' },
    { text: 'text-emerald-600', bg: 'bg-emerald-50/50', border: 'border-emerald-100' },
    { text: 'text-rose-600', bg: 'bg-rose-50/50', border: 'border-rose-100' }
  ];

  return (
    <div className="bg-white rounded-2xl p-8 border border-slate-200 shadow-sm overflow-hidden relative mt-8">
      <div className="absolute top-0 right-0 p-4 opacity-5">
        <Icon size={120} />
      </div>
      
      <h2 className="font-bold text-slate-800 text-lg mb-6 flex items-center gap-3 pb-4 border-b border-slate-100">
        <Icon size={20} className={iconColor} />
        {t(activeTierTitle)}
      </h2>

      <div className="space-y-6 relative z-10">
        {feedbackEntries.map(([key, value], index) => {
          const color = colors[index % colors.length];
          const labelKey = keyLabelMap[key] || key;
          return (
            <div key={key}>
              <p className={`text-xs font-bold ${color.text} uppercase tracking-widest mb-2`}>{t(labelKey)}</p>
              <p className={`text-slate-700 leading-relaxed font-medium ${color.bg} p-4 rounded-xl border ${color.border}`}>
                "<FormattedText text={value} />"
              </p>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default IntelligenceFeedback;
