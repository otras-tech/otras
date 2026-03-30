import React from 'react';
import { useNavigate } from 'react-router-dom';
import { AlertCircle, UserCheck } from 'lucide-react';

interface OtrRequiredModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function OtrRequiredModal({ isOpen, onClose }: OtrRequiredModalProps) {
  const navigate = useNavigate();

  if (!isOpen) return null;

  const handleGoToProfile = () => {
    onClose();
    navigate('/profile');
  };

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-in fade-in duration-200">
      <div 
        className="bg-white rounded-3xl w-full max-w-md shadow-2xl overflow-hidden animate-in zoom-in-95 duration-200"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="p-8 text-center bourder-b border-slate-50">
          <div className="w-20 h-20 bg-blue-50 rounded-full flex items-center justify-center mx-auto mb-6 text-blue-600">
            <UserCheck size={40} />
          </div>
          
          <h2 className="text-2xl font-black text-slate-800 mb-3">OTR ID Required</h2>
          <p className="text-slate-500 font-medium mb-8">
            You need a generated OTR ID to proceed with this action. This helps us sync your results with official records.
          </p>

          <div className="flex flex-col gap-3">
            <button
              onClick={handleGoToProfile}
              className="w-full py-4 bg-blue-600 hover:bg-blue-700 text-white rounded-2xl font-bold transition-all shadow-lg shadow-blue-600/20 active:scale-[0.98] flex items-center justify-center gap-2"
            >
              Create OTR ID
            </button>
            <button
              onClick={onClose}
              className="w-full py-4 bg-white hover:bg-slate-50 text-slate-500 rounded-2xl font-bold transition-all border border-slate-200 active:scale-[0.98]"
            >
              Maybe Later
            </button>
          </div>
        </div>
        
        <div className="bg-slate-50 px-8 py-4 flex items-center gap-3 text-[11px] text-slate-400 font-bold uppercase tracking-widest">
          <AlertCircle size={14} /> Official Ecosystem Compliance
        </div>
      </div>
    </div>
  );
}
