import { useState, useEffect, useRef } from 'react';
import {
    Gift, Copy, Share2, Users, CheckCircle, IndianRupee,
    Send, Search, ChevronLeft, ChevronRight, Link2,
    MessageCircle, Twitter, Zap, Star, Trophy, ArrowRight,
    UserPlus, ShieldCheck, Sparkles
} from 'lucide-react';
import axios from 'axios';
import { useTranslation } from '../hooks/useTranslation';

/* ---------- helpers ---------- */
const BASE_URL = `${window.location.origin}/profile?ref=`;

function generateCode(user) {
    if (!user) return 'REF000000';
    return user.referralCode || 'REF000000';
}

const PAGE_SIZE = 4;

/* ---------- Confetti ---------- */
function Confetti({ active }) {
    const ref = useRef(null);
    useEffect(() => {
        if (!active || !ref.current) return;
        const canvas = ref.current;
        const ctx = canvas.getContext('2d');
        canvas.width = window.innerWidth;
        canvas.height = window.innerHeight;
        const pieces = Array.from({ length: 120 }, () => ({
            x: Math.random() * canvas.width,
            y: Math.random() * -canvas.height,
            r: Math.random() * 8 + 3,
            c: `hsl(${Math.random() * 360},80%,60%)`,
            s: Math.random() * 3 + 1,
            dx: (Math.random() - 0.5) * 2,
        }));
        let raf;
        let frame = 0;
        const draw = () => {
            ctx.clearRect(0, 0, canvas.width, canvas.height);
            pieces.forEach(p => {
                ctx.beginPath();
                ctx.arc(p.x, p.y, p.r, 0, 2 * Math.PI);
                ctx.fillStyle = p.c;
                ctx.fill();
                p.y += p.s;
                p.x += p.dx;
                if (p.y > canvas.height) { p.y = -10; p.x = Math.random() * canvas.width; }
            });
            frame++;
            if (frame < 200) raf = requestAnimationFrame(draw);
            else ctx.clearRect(0, 0, canvas.width, canvas.height);
        };
        draw();
        return () => cancelAnimationFrame(raf);
    }, [active]);
    if (!active) return null;
    return (
        <canvas
            ref={ref}
            style={{ position: 'fixed', inset: 0, pointerEvents: 'none', zIndex: 9999 }}
        />
    );
}

export default function ReferEarn({ user }) {
    const { t } = useTranslation();
    const code = generateCode(user);
    const referralLink = `${BASE_URL}${code}`;

    const [confetti, setConfetti]     = useState(false);
    const [search, setSearch]         = useState('');
    const [page, setPage]             = useState(1);
    const [inviteSent, setInviteSent] = useState(false);
    const [copyStates, setCopyStates] = useState({ code: false, link: false });

    const [referralData, setReferralData]   = useState({
        totalCount: 0,
        totalRewards: 0,
        availableCredits: user?.credits || 0,
        history: []
    });

    useEffect(() => {
        if (!user?.id) return;
        
        axios.get(`http://localhost:4000/referrals/stats/${user.id}`).then(res => {
            const data = res.data; 
            setReferralData({
                totalCount: data.totalReferrals ?? 0,
                totalRewards: data.creditsEarned ?? 0,
                availableCredits: data.availableCredits ?? user?.credits ?? 0,
                history: (data.referrals || []).map(r => ({
                    id: r.id,
                    friendName: r.refereeOtrId,
                    friendOtrId: r.refereeOtrId,
                    signupDate: r.createdAt,
                    status: r.status,
                    reward: r.creditsEarned || 0
                }))
            });
        }).catch(err => console.error(err));
    }, [user?.id]);

    const filtered = referralData.history.filter(r =>
        r.friendOtrId.toLowerCase().includes(search.toLowerCase())
    );
    const totalPages = Math.ceil(filtered.length / PAGE_SIZE);
    const paginated  = filtered.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE);

    const copyToClipboard = (text, type) => {
        navigator.clipboard.writeText(text);
        setCopyStates(prev => ({ ...prev, [type]: true }));
        setTimeout(() => setCopyStates(prev => ({ ...prev, [type]: false })), 2000);
    };

    const handleShare = (platform) => {
        const shareLink = `${window.location.origin}/profile?ref=${code}`;
        const msg = encodeURIComponent(t('referralShareMsg', { link: shareLink }));
        const urls = {
            whatsapp: `https://wa.me/?text=${msg}`,
            telegram: `https://t.me/share/url?url=${encodeURIComponent(shareLink)}&text=${msg}`,
            twitter: `https://twitter.com/intent/tweet?text=${msg}`,
        };
        window.open(urls[platform], '_blank');
    };

    const platformShare = (platform) => {
        const shareLink = `${window.location.origin}/profile?ref=${code}`;
        const msg = encodeURIComponent(t('referralShareMsg', { link: shareLink }));
        const urls = {
            whatsapp: `https://wa.me/?text=${msg}`,
            telegram: `https://t.me/share/url?url=${encodeURIComponent(shareLink)}&text=${msg}`,
            twitter: `https://twitter.com/intent/tweet?text=${msg}`,
        };
        window.open(urls[platform], '_blank');
    };

    const steps = [
        {
            icon: <Share2 className="w-5 h-5" color="#fff" />,
            title: t('shareReferralLink'),
            desc: t('shareReferralDesc'),
            color: '#2f6ce5',
            bg: '#eaf1ff'
        },
        {
            icon: <UserPlus className="w-5 h-5" color="#fff" />,
            title: t('friendJoinsPlatform'),
            desc: t('friendJoinsDesc'),
            color: '#10b6c8',
            bg: '#e0f9fb'
        },
        {
            icon: <Gift className="w-5 h-5" color="#fff" />,
            title: t('earnCredits'),
            desc: t('earnCreditsDesc'),
            color: '#f59e0b',
            bg: '#fef9ee'
        }
    ];

    const stats = [
        { label: t('totalReferrals'), value: referralData.totalCount, icon: Users, color: '#2f6ce5', bg: '#eaf1ff' },
        { label: t('totalCreditsEarned'), value: referralData.totalRewards, icon: CheckCircle, color: '#22c55e', bg: '#e7f9ee' },
        { label: t('availableCredits'), value: referralData.availableCredits, icon: Trophy, color: '#f59e0b', bg: '#fef9ee' },
    ];

    return (
        <div style={{ maxWidth: 900, margin: '0 auto', padding: '8px 0 40px' }}>
            <Confetti active={confetti} />

            {/* ---------- Header ---------- */}
            <div style={{ marginBottom: 28 }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 6 }}>
                    <div style={{
                        width: 44, height: 44, borderRadius: 'var(--radius-lg)',
                        background: 'linear-gradient(135deg,var(--color-primary),#10b6c8)',
                        display: 'flex', alignItems: 'center', justifyContent: 'center',
                    }}>
                        <Gift size={22} color="#fff" />
                    </div>
                    <h1 className="page-title" style={{ margin: 0 }}>{t("referEarnTitle")}</h1>
                </div>
                <p className="text-subtle">
                    {t("referEarnDesc")}
                </p>
            </div>

            {/* ---------- Referral Code Card ---------- */}
            <div className="app-card" style={{ padding: 28, marginBottom: 24 }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 18 }}>
                    <Star size={16} color="var(--color-primary)" />
                    <span className="card-title">{t("yourReferralCode")}</span>
                </div>

                {/* Code display */}
                <div style={{
                    display: 'flex', alignItems: 'center', gap: 12,
                    background: 'var(--bg-light)', border: '2px dashed var(--color-primary)',
                    borderRadius: 'var(--radius-lg)', padding: '14px 20px', marginBottom: 20,
                }}>
                    <span style={{
                        fontFamily: 'monospace', fontSize: 26, fontWeight: 800,
                        letterSpacing: 6, color: 'var(--color-primary)', flex: 1,
                    }}>{code}</span>
                    <button
                        className="btn-primary"
                        onClick={() => copyToClipboard(code, 'code')}
                        style={{ display: 'flex', alignItems: 'center', gap: 6, whiteSpace: 'nowrap' }}
                    >
                        <Copy size={14} />
                        {copyStates.code ? t('copied') : t('copyCode')}
                    </button>
                </div>

                {/* Referral link */}
                <div style={{ marginBottom: 20 }}>
                    <label className="label" style={{ display: 'block', marginBottom: 6 }}>{t("referralLink")}</label>
                    <div style={{ display: 'flex', gap: 8 }}>
                        <input
                            readOnly
                            value={referralLink}
                            className="input"
                            style={{ flex: 1, background: 'var(--bg-light)', cursor: 'default' }}
                        />
                        <button className="btn-secondary" onClick={() => copyToClipboard(referralLink, 'link')} style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                            <Link2 size={14} /> {t("copy")}
                        </button>
                    </div>
                </div>

                {/* Share buttons */}
                <div>
                    <label className="label" style={{ display: 'block', marginBottom: 10 }}>{t("shareVia")}</label>
                    <div style={{ display: 'flex', gap: 10, flexWrap: 'wrap' }}>
                        {[
                            { key: 'whatsapp', label: t('whatsapp'), icon: MessageCircle, color: '#25D366', bg: '#e8fdf0' },
                            { key: 'telegram', label: t('telegram'), icon: Send, color: '#0088cc', bg: '#e8f5fd' },
                            { key: 'twitter', label: t('twitterX'), icon: Twitter, color: '#1da1f2', bg: '#e8f4ff' },
                        ].map(({ key, label, icon: Icon, color, bg }) => (
                            <button
                                key={key}
                                onClick={() => handleShare(key)}
                                style={{
                                    display: 'flex', alignItems: 'center', gap: 7,
                                    background: bg, color: color,
                                    border: `1px solid ${color}33`,
                                    borderRadius: 'var(--radius-lg)',
                                    padding: '9px 16px',
                                    fontSize: 'var(--text-sm)', fontWeight: 600,
                                    cursor: 'pointer', transition: 'var(--transition-fast)',
                                }}
                                onMouseEnter={e => e.currentTarget.style.transform = 'translateY(-2px)'}
                                onMouseLeave={e => e.currentTarget.style.transform = ''}
                            >
                                <Icon size={15} /> {label}
                            </button>
                        ))}
                    </div>
                </div>
            </div>

            {/* ---------- Stats ---------- */}
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit,minmax(220px,1fr))', gap: 16, marginBottom: 24 }}>
                {stats.map(({ label, value, icon: Icon, color, bg }) => (
                    <div key={label} className="app-card hover-lift" style={{ padding: '22px 24px', display: 'flex', alignItems: 'center', gap: 16 }}>
                        <div style={{ width: 48, height: 48, borderRadius: 'var(--radius-lg)', background: bg, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                            <Icon size={22} color={color} />
                        </div>
                        <div>
                            <div style={{ fontSize: 'var(--text-2xl)', fontWeight: 800, color: 'var(--text-main)', lineHeight: 1.1 }}>{value}</div>
                            <div className="label" style={{ marginTop: 2 }}>{label.toUpperCase()}</div>
                        </div>
                    </div>
                ))}
            </div>

            {/* ---------- How It Works ---------- */}
            <div className="app-card" style={{ padding: 28, marginBottom: 24 }}>
                <h2 className="section-title" style={{ marginBottom: 20 }}>{t("howItWorks")}</h2>
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit,minmax(200px,1fr))', gap: 16 }}>
                    {steps.map(({ icon, title, desc, color, bg }, idx) => (
                        <div key={idx} style={{
                            background: bg, borderRadius: 'var(--radius-lg)', padding: 22,
                            position: 'relative', border: `1px solid ${color}22`,
                        }}>
                            <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 12 }}>
                                <div style={{
                                    width: 36, height: 36, borderRadius: 'var(--radius-md)',
                                    background: color, display: 'flex', alignItems: 'center', justifyContent: 'center',
                                }}>
                                    {icon}
                                </div>
                                <span style={{
                                    fontSize: 11, fontWeight: 800, color: color,
                                    background: 'white', borderRadius: 999, padding: '2px 10px',
                                    border: `1px solid ${color}33`,
                                }}>{t('step', { num: idx + 1 })}</span>
                            </div>
                            <div style={{ fontSize: 'var(--text-md)', fontWeight: 700, color: 'var(--text-main)', marginBottom: 6 }}>{title}</div>
                            <div style={{ fontSize: 'var(--text-sm)', color: 'var(--text-secondary)', lineHeight: 1.5 }}>{desc}</div>
                        </div>
                    ))}
                </div>
            </div>

            {/* ---------- Referral List ---------- */}
            <div className="app-card" style={{ padding: 28, marginBottom: 24 }}>
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: 12, marginBottom: 18 }}>
                    <h2 className="section-title" style={{ margin: 0 }}>{t("referralHistory")}</h2>
                    <div style={{ position: 'relative' }}>
                        <Search size={14} style={{ position: 'absolute', left: 10, top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)' }} />
                        <input
                            className="input"
                            placeholder={t("searchName")}
                            value={search}
                            onChange={e => { setSearch(e.target.value); setPage(1); }}
                            style={{ paddingLeft: 32, width: 200 }}
                        />
                    </div>
                </div>

                <div style={{ overflowX: 'auto' }}>
                    <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: 'var(--text-sm)' }}>
                        <thead>
                            <tr style={{ borderBottom: '2px solid var(--border-light)' }}>
                                <th style={{ textAlign: 'left', padding: '10px 12px', color: 'var(--text-muted)', fontWeight: 700, fontSize: 11, textTransform: 'uppercase' }}>{t('friendOtrId')}</th>
                                <th style={{ textAlign: 'left', padding: '10px 12px', color: 'var(--text-muted)', fontWeight: 700, fontSize: 11, textTransform: 'uppercase' }}>{t('signupDate')}</th>
                                <th style={{ textAlign: 'left', padding: '10px 12px', color: 'var(--text-muted)', fontWeight: 700, fontSize: 11, textTransform: 'uppercase' }}>{t('status')}</th>
                                <th style={{ textAlign: 'right', padding: '10px 12px', color: 'var(--text-muted)', fontWeight: 700, fontSize: 11, textTransform: 'uppercase' }}>{t('creditsEarned')}</th>
                            </tr>
                        </thead>
                        <tbody>
                            {paginated.length === 0 ? (
                                <tr><td colSpan={4} style={{ textAlign: 'center', padding: 32, color: 'var(--text-muted)' }}>{t("noReferralsFound")}</td></tr>
                            ) : paginated.map((r, i) => (
                                <tr key={i} style={{ borderBottom: '1px solid var(--border-light)', background: i % 2 === 0 ? 'transparent' : 'var(--bg-light)' }}>
                                    <td style={{ padding: '12px 12px' }}>
                                        <div style={{ fontWeight: 600, color: 'var(--text-main)' }}>{r.friendName}</div>
                                        <div style={{ fontSize: 11, color: 'var(--text-muted)', fontFamily: 'monospace' }}>{r.friendOtrId}</div>
                                    </td>
                                    <td style={{ padding: '12px 12px', color: 'var(--text-secondary)' }}>
                                        {new Date(r.signupDate).toLocaleDateString()}
                                    </td>
                                    <td style={{ padding: '12px 12px' }}>
                                        <span style={{
                                            padding: '4px 10px', borderRadius: 999, fontSize: 10, fontWeight: 700,
                                            background: r.status === 'Completed' || r.status === 'Qualified Referral' ? '#e7f9ee' : '#fff8e1',
                                            color: r.status === 'Completed' || r.status === 'Qualified Referral' ? '#22c55e' : '#f59e0b',
                                            border: `1px solid ${r.status === 'Completed' || r.status === 'Qualified Referral' ? '#22c55e33' : '#f59e0b33'}`,
                                            textTransform: 'uppercase'
                                        }}>
                                            {r.status}
                                        </span>
                                    </td>
                                    <td style={{ padding: '12px 12px', textAlign: 'right', fontWeight: 700, color: '#22c55e' }}>
                                        {r.reward > 0 ? t('creditsEarnedAmount', { count: r.reward }) : '—'}
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>

                {/* Pagination */}
                {totalPages > 1 && (
                    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'flex-end', gap: 8, marginTop: 16 }}>
                        <button
                            className="btn-secondary"
                            onClick={() => setPage(p => Math.max(1, p - 1))}
                            disabled={page === 1}
                            style={{ padding: '6px 10px', opacity: page === 1 ? 0.4 : 1 }}
                        >
                            <ChevronLeft size={14} />
                        </button>
                        {Array.from({ length: totalPages }, (_, i) => i + 1).map(n => (
                            <button
                                key={n}
                                onClick={() => setPage(n)}
                                style={{
                                    width: 32, height: 32, borderRadius: 'var(--radius-md)',
                                    background: n === page ? 'var(--color-primary)' : 'transparent',
                                    color: n === page ? '#fff' : 'var(--text-secondary)',
                                    border: `1px solid ${n === page ? 'var(--color-primary)' : 'var(--border-light)'}`,
                                    fontWeight: 600, fontSize: 'var(--text-sm)', cursor: 'pointer',
                                }}
                            >{n}</button>
                        ))}
                        <button
                            className="btn-secondary"
                            onClick={() => setPage(p => Math.min(totalPages, p + 1))}
                            disabled={page === totalPages}
                            style={{ padding: '6px 10px', opacity: page === totalPages ? 0.4 : 1 }}
                        >
                            <ChevronRight size={14} />
                        </button>
                    </div>
                )}
            </div>

            {/* ---------- Bottom Row: Reward Rules + Invite ---------- */}
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit,minmax(300px,1fr))', gap: 20 }}>
                <div className="app-card" style={{ padding: 28 }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 20 }}>
                        <ShieldCheck className="w-5 h-5 text-emerald-500" />
                        <h2 className="section-title" style={{ margin: 0 }}>{t('rewardRules')}</h2>
                    </div>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
                        {[1, 2, 3, 4, 5].map((num) => (
                            <div key={num} style={{ display: 'flex', gap: 12, alignItems: 'flex-start' }}>
                                <div style={{ 
                                    width: 20, height: 20, borderRadius: '50%', background: 'var(--bg-light)', 
                                    display: 'flex', alignItems: 'center', justifyContent: 'center', 
                                    fontSize: 10, fontWeight: 700, color: 'var(--text-muted)', border: '1px solid var(--border-light)', flexShrink: 0
                                }}>
                                    {num}
                                </div>
                                <span style={{ fontSize: 'var(--text-sm)', color: 'var(--text-secondary)', lineHeight: 1.5 }}
                                    dangerouslySetInnerHTML={{ __html: t(`rule${num}`) }}
                                />
                            </div>
                        ))}
                    </div>
                </div>

                <div style={{ 
                    background: 'linear-gradient(135deg, rgba(47, 108, 229, 0.05), rgba(16, 182, 200, 0.05))',
                    borderRadius: 'var(--radius-2xl)', border: '1px solid rgba(47, 108, 229, 0.1)',
                    padding: 32, display: 'flex', flexDirection: 'column', alignItems: 'center', textAlign: 'center', justifyContent: 'center',
                    position: 'relative', overflow: 'hidden'
                }}>
                    <Sparkles className="w-12 h-12 text-blue-500/20 mb-4" />
                    <h3 style={{ fontSize: 'var(--text-xl)', fontWeight: 800, color: 'var(--text-main)', marginBottom: 8 }}>{t('inviteAFriend')}</h3>
                    <p style={{ fontSize: 'var(--text-sm)', color: 'var(--text-secondary)', marginBottom: 24, maxWidth: 240 }}>
                        {t('inviteFriendsDesc')}
                    </p>
                    <button
                        onClick={() => platformShare('whatsapp')}
                        className="btn-primary"
                        style={{ width: '100%', padding: '16px', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 10, fontSize: 'var(--text-md)' }}
                    >
                        <Send size={18} />
                        {t('sendInvite')}
                    </button>
                </div>
            </div>

            <div className="app-card" style={{ marginTop: 24, padding: 32, position: 'relative', overflow: 'hidden' }}>
                <div style={{ position: 'absolute', top: 20, right: 28 }}>
                    <div style={{ 
                        padding: '4px 12px', background: '#e7f9ee', color: '#22c55e', 
                        fontSize: 10, fontWeight: 800, borderRadius: 999, border: '1px solid #22c55e33',
                        textTransform: 'uppercase', letterSpacing: '0.05em'
                    }}>
                        {t('creditsReadyToUse')}
                    </div>
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: 24 }}>
                    <div style={{ 
                        width: 64, height: 64, borderRadius: 'var(--radius-xl)', background: 'rgba(47, 108, 229, 0.1)',
                        display: 'flex', alignItems: 'center', justifyContent: 'center', border: '1px solid rgba(47, 108, 229, 0.2)'
                    }}>
                        <Trophy size={32} color="#2f6ce5" />
                    </div>
                    <div>
                        <h3 style={{ fontSize: 'var(--text-xl)', fontWeight: 800, color: 'var(--text-main)', marginBottom: 4 }}>
                            {t('availableCredits')}: <span style={{ color: '#2f6ce5' }}>{referralData.availableCredits}</span>
                        </h3>
                        <p style={{ fontSize: 'var(--text-sm)', color: 'var(--text-secondary)' }}>
                            {t('gatherPoints')}
                        </p>
                    </div>
                </div>
            </div>
        </div>
    );
}
