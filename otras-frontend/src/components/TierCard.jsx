import { Lock, Brain, ArrowRight, CheckCircle2 } from 'lucide-react';
import { useTranslation } from '../hooks/useTranslation';

export default function TierCard({ 
  tier, 
  locked = false,
  // New props for Subscription usage
  name,
  price,
  duration,
  features,
  isPopular,
  themeColor = "#1e4ed8",
  buttonText = "Pay Now",
  onPay,
  onCreditPay,
  showCreditOption = false,
  planPrice = 0,
  isProcessing = false
}) {
  const { t } = useTranslation();
  // Normalize data: if tier object is passed (Legacy/Artha), use its properties
  const title = name || tier?.title || t("plan");
  const subTitle = price || tier?.sub || "";
  const description = duration || tier?.desc || "";
  
  if (locked) {
    return (
      <div
        className="rounded-3xl p-8 border-2 border-blue-100 relative overflow-hidden h-full"
        style={{ background: 'linear-gradient(135deg, #eff6ff, #f8faff)' }}
      >
        <div className="absolute inset-0 bg-white/60 backdrop-blur-sm flex flex-col items-center justify-center z-10">
          <Lock size={24} className="text-slate-400 mb-2" />
          <p className="text-slate-500 text-xs font-bold uppercase tracking-wider text-center">
            {t("completePreviousTier")}
          </p>
        </div>
        <div className="opacity-30">
          <div className="w-12 h-12 rounded-2xl bg-blue-50 flex items-center justify-center mb-6">
            <Brain size={24} className="text-blue-300" />
          </div>
          <h3 className="font-bold text-slate-400 text-xl mb-1">{title}</h3>
          <p className="text-slate-300 text-xs font-bold uppercase tracking-wider mb-4">{subTitle}</p>
          <p className="text-slate-300 text-sm mb-6">{description}</p>

          <button
            disabled
            className="w-full py-4 rounded-2xl text-slate-300 font-bold text-sm flex items-center justify-center gap-2 bg-slate-100"
          >
            {buttonText === "Pay Now" ? t("payNow") : buttonText} <ArrowRight size={18} />
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className={`bg-white rounded-3xl p-8 border hover:shadow-xl transition-all duration-300 flex flex-col h-full relative ${isPopular ? 'border-blue-500 ring-4 ring-blue-50' : 'border-slate-100'}`}>
      {isPopular && (
        <div className="absolute -top-4 left-1/2 -translate-x-1/2 bg-blue-600 text-white px-4 py-1 rounded-full text-xs font-black uppercase tracking-widest shadow-lg">
          {t("mostPopular")}
        </div>
      )}
      
      <div className="w-12 h-12 rounded-2xl bg-blue-50 flex items-center justify-center mb-6">
        <Brain size={24} className="text-blue-600" />
      </div>
      
      <h3 className="font-bold text-slate-800 text-2xl mb-1">{title}</h3>
      <div className="flex items-baseline gap-1 mb-4">
        <p className="text-3xl font-black text-slate-900">{subTitle}</p>
        <span className="text-slate-400 text-xs font-bold uppercase">{description}</span>
      </div>

      {features && (
        <div className="space-y-3 mb-8 flex-1">
          {features.map((f, i) => (
            <div key={i} className="flex items-start gap-3">
              <CheckCircle2 size={16} className="text-blue-500 mt-0.5 flex-shrink-0" />
              <p className="text-slate-600 text-sm leading-tight">{f}</p>
            </div>
          ))}
        </div>
      )}

      {!features && tier?.desc && <p className="text-slate-500 text-sm mb-6 flex-1">{tier.desc}</p>}
      

      
      <div className="space-y-3">
        <button
          onClick={onPay}
          disabled={isProcessing}
          className={`w-full py-4 rounded-2xl text-white font-bold text-sm flex items-center justify-center gap-2 transition-all shadow-lg shadow-blue-100 ${isProcessing ? 'opacity-70 cursor-wait' : 'hover:scale-[1.02]'}`}
          style={{ background: themeColor }}
        >
          {isProcessing ? t("processing") : (buttonText === "Pay Now" ? t("payNow") : buttonText)} {!isProcessing && <ArrowRight size={18} />}
        </button>

        {showCreditOption && onCreditPay && (
          <button
            onClick={onCreditPay}
            disabled={isProcessing}
            className={`w-full py-4 rounded-2xl text-slate-700 bg-amber-100 hover:bg-amber-200 border border-amber-200 font-bold text-sm flex items-center justify-center gap-2 transition-all shadow-md ${isProcessing ? 'opacity-70 cursor-wait' : 'hover:scale-[1.02]'}`}
          >
            {isProcessing ? t("processing") : t("useCredits", { count: planPrice })} {!isProcessing && <ArrowRight size={18} />}
          </button>
        )}
      </div>
    </div>
  );
}
