import { useState, useEffect } from 'react';
import axios from 'axios';
import { Gift, Star, Users, Copy, CheckCircle } from 'lucide-react';
import { useTranslation } from '../hooks/useTranslation';

export default function UserCreditsCard({ user }) {
  const { t } = useTranslation();
  const [stats, setStats] = useState({
    availableCredits: user?.credits || 0,
    creditsEarned: 0,
    totalReferrals: 0,
    referralCode: user?.referralCode || '—',
  });
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    if (!user?.id) return;
    axios.get(`http://localhost:4000/referrals/stats/${user.id}`)
      .then(res => {
        setStats({
          availableCredits: res.data.availableCredits ?? 0,
          creditsEarned: res.data.creditsEarned ?? 0,
          totalReferrals: res.data.totalReferrals ?? 0,
          referralCode: res.data.referralCode || user?.referralCode || '—',
        });
      })
      .catch(err => console.error('Failed to fetch referral stats', err));
  }, [user?.id]);

  const handleCopy = () => {
    navigator.clipboard.writeText(stats.referralCode);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div
      className="rounded-xl p-5 text-white"
      style={{ background: 'linear-gradient(135deg, #0f172a, #1e40af)' }}
    >
      <div className="flex items-center justify-between mb-4">
        <div>
          <h3 className="font-bold text-lg">{t('yourCredits')}</h3>
          <p className="text-blue-200 text-sm">{t('referralRewards')}</p>
        </div>
        <Gift size={26} className="text-blue-300" />
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 gap-3 mb-4">
        <div className="bg-white/10 rounded-xl p-3 backdrop-blur-sm">
          <div className="flex items-center gap-2 mb-1">
            <Star size={14} className="text-yellow-300" />
            <span className="text-blue-200 text-xs font-semibold uppercase tracking-wide">{t('credits')}</span>
          </div>
          <p className="text-2xl font-black">{stats.availableCredits}</p>
        </div>
        <div className="bg-white/10 rounded-xl p-3 backdrop-blur-sm">
          <div className="flex items-center gap-2 mb-1">
            <Users size={14} className="text-green-300" />
            <span className="text-blue-200 text-xs font-semibold uppercase tracking-wide">{t('referrals')}</span>
          </div>
          <p className="text-2xl font-black">{stats.totalReferrals}</p>
        </div>
      </div>

      {/* Referral code */}
      <div className="bg-white/10 rounded-xl p-3 backdrop-blur-sm">
        <p className="text-blue-300 text-xs font-bold uppercase tracking-widest mb-1">{t('yourReferralCode')}</p>
        <div className="flex items-center justify-between">
          <p className="text-xl font-black tracking-widest">{stats.referralCode}</p>
          <button
            onClick={handleCopy}
            className="p-1.5 bg-white/20 rounded-lg hover:bg-white/30 transition"
            title={t('copyCode')}
          >
            {copied ? <CheckCircle size={16} className="text-green-300" /> : <Copy size={16} />}
          </button>
        </div>
      </div>
    </div>
  );
}
