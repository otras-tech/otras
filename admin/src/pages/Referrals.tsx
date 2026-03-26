import { useState, useEffect } from 'react';
import {
    Gift,
    Users,
    CheckCircle,
    Trophy,
    Search,
    ChevronLeft,
    ChevronRight,
    ArrowRight
} from 'lucide-react';

// Example types for the incoming data
type ReferralData = {
    id: number;
    referrerId: number;
    refereeOtrId: string;
    status: 'Joined' | 'Preparing' | 'Qualified Referral';
    createdAt: string;
    referrer: {
        firstName: string;
        lastName: string;
        otrId: string;
    };
};

export default function Referrals() {
    const [referrals, setReferrals] = useState<ReferralData[]>([]);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState('');
    const [currentPage, setCurrentPage] = useState(1);
    const itemsPerPage = 10;

    useEffect(() => {
        fetchReferrals();
    }, []);

    const fetchReferrals = async () => {
        try {
            const token = localStorage.getItem('adminToken');
            const response = await fetch('http://localhost:4000/referrals/admin/all', {
                headers: {
                    'Authorization': `Bearer ${token}`
                }
            });
            if (response.ok) {
                const data = await response.json();
                setReferrals(data);
            }
        } catch (error) {
            console.error('Error fetching referrals:', error);
        } finally {
            setLoading(false);
        }
    };

    // Calculate aggregated stats
    const totalReferrals = referrals.length;
    const successfulReferrals = referrals.filter(r => r.status === 'Qualified Referral').length;
    const activeReferrers = new Set(referrals.map(r => r.referrerId)).size;
    
    // Group by referrer
    const referrersMap = referrals.reduce((acc, curr) => {
        if (!acc[curr.referrerId]) {
            acc[curr.referrerId] = {
                user: `${curr.referrer.firstName} ${curr.referrer.lastName}`,
                otrId: curr.referrer.otrId,
                total: 0,
                successful: 0,
                joinDate: new Date(curr.createdAt).toLocaleDateString()
            };
        }
        acc[curr.referrerId].total += 1;
        if (curr.status === 'Qualified Referral') {
            acc[curr.referrerId].successful += 1;
        }
        return acc;
    }, {} as Record<number, any>);

    const referrersList = Object.values(referrersMap).sort((a: any, b: any) => b.total - a.total);

    // Calculate total mock tests rewarded (1 for every 10 qualified)
    const totalMockTestsRewarded = referrersList.reduce((sum: number, ref: any) => {
        return sum + Math.floor(ref.successful / 10);
    }, 0);

    // Activity filtering
    const filteredActivity = referrals.filter(ref => 
        ref.referrer.firstName.toLowerCase().includes(searchTerm.toLowerCase()) ||
        ref.referrer.lastName.toLowerCase().includes(searchTerm.toLowerCase()) ||
        ref.refereeOtrId.toLowerCase().includes(searchTerm.toLowerCase())
    );

    const totalPages = Math.ceil(filteredActivity.length / itemsPerPage);
    const paginatedActivity = filteredActivity.slice(
        (currentPage - 1) * itemsPerPage,
        currentPage * itemsPerPage
    );

    if (loading) {
        return <div className="p-8 flex justify-center text-[var(--text-secondary)]">Loading referral data...</div>;
    }

    return (
        <div className="p-8 max-w-7xl mx-auto space-y-8 animate-fade-in">
            {/* Header */}
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-2xl font-bold text-[var(--text-main)] flex items-center gap-3">
                        <Gift className="text-[var(--color-primary)]" />
                        Refer & Earn Management
                    </h1>
                    <p className="text-[var(--text-secondary)] mt-1">
                        Monitor the referral program, top referrers, and free mock tests rewarded.
                    </p>
                </div>

                {/* Info Card: Referral Rule */}
                <div className="bg-[var(--color-primary-light)] border border-[rgba(37,99,235,0.2)] rounded-[var(--radius-lg)] p-4 flex items-center gap-4 max-w-sm">
                    <div className="w-10 h-10 bg-[var(--color-primary)] rounded-full flex items-center justify-center text-white shrink-0">
                        <Trophy size={20} />
                    </div>
                    <div>
                        <p className="text-xs text-[var(--color-primary)] font-bold uppercase tracking-wider mb-0.5">Active Rule</p>
                        <p className="text-sm text-[var(--text-main)] font-medium">Refer 10 Friends <ArrowRight className="inline mx-1" size={14} /> Earn 1 Free Mock Test</p>
                    </div>
                </div>
            </div>

            {/* Overview Cards */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
                <div className="bg-[var(--bg-card)] rounded-[var(--radius-lg)] p-6 border border-[var(--border-light)] shadow-sm hover:shadow-md transition-[var(--transition-fast)]">
                    <div className="flex items-center justify-between mb-4">
                        <div className="w-12 h-12 bg-[rgba(37,99,235,0.1)] rounded-full flex items-center justify-center">
                            <Users className="text-[var(--color-primary)]" size={24} />
                        </div>
                    </div>
                    <div>
                        <p className="text-sm font-medium text-[var(--text-secondary)] mb-1">Total Referrals</p>
                        <h3 className="text-3xl font-bold text-[var(--text-main)]">{totalReferrals}</h3>
                    </div>
                </div>

                <div className="bg-[var(--bg-card)] rounded-[var(--radius-lg)] p-6 border border-[var(--border-light)] shadow-sm hover:shadow-md transition-[var(--transition-fast)]">
                    <div className="flex items-center justify-between mb-4">
                        <div className="w-12 h-12 bg-[rgba(16,185,129,0.1)] rounded-full flex items-center justify-center">
                            <CheckCircle className="text-[var(--success)]" size={24} />
                        </div>
                    </div>
                    <div>
                        <p className="text-sm font-medium text-[var(--text-secondary)] mb-1">Successful Referrals</p>
                        <h3 className="text-3xl font-bold text-[var(--text-main)]">{successfulReferrals}</h3>
                    </div>
                </div>

                <div className="bg-[var(--bg-card)] rounded-[var(--radius-lg)] p-6 border border-[var(--border-light)] shadow-sm hover:shadow-md transition-[var(--transition-fast)]">
                    <div className="flex items-center justify-between mb-4">
                        <div className="w-12 h-12 bg-[rgba(245,158,11,0.1)] rounded-full flex items-center justify-center">
                            <Trophy className="text-[var(--warning)]" size={24} />
                        </div>
                    </div>
                    <div>
                        <p className="text-sm font-medium text-[var(--text-secondary)] mb-1">Mock Tests Rewarded</p>
                        <h3 className="text-3xl font-bold text-[var(--text-main)]">{totalMockTestsRewarded}</h3>
                    </div>
                </div>

                <div className="bg-[var(--bg-card)] rounded-[var(--radius-lg)] p-6 border border-[var(--border-light)] shadow-sm hover:shadow-md transition-[var(--transition-fast)]">
                    <div className="flex items-center justify-between mb-4">
                        <div className="w-12 h-12 bg-[rgba(99,102,241,0.1)] rounded-full flex items-center justify-center">
                            <Gift className="text-indigo-500" size={24} />
                        </div>
                    </div>
                    <div>
                        <p className="text-sm font-medium text-[var(--text-secondary)] mb-1">Active Referrers</p>
                        <h3 className="text-3xl font-bold text-[var(--text-main)]">{activeReferrers}</h3>
                    </div>
                </div>
            </div>

            {/* Top Referrers Table */}
            <div className="bg-[var(--bg-card)] rounded-[var(--radius-lg)] border border-[var(--border-light)] shadow-sm overflow-hidden">
                <div className="p-6 border-b border-[var(--border-light)]">
                    <h2 className="text-lg font-bold text-[var(--text-main)]">Top Referrers Overview</h2>
                    <p className="text-sm text-[var(--text-secondary)] mt-1">Users who have referred others, aggregated by total count.</p>
                </div>
                <div className="overflow-x-auto">
                    <table className="w-full text-left border-collapse">
                        <thead>
                            <tr className="bg-[var(--bg-body)]">
                                <th className="p-4 text-xs font-semibold text-[var(--text-secondary)] uppercase tracking-wider border-b border-[var(--border-light)] pl-6">User Name</th>
                                <th className="p-4 text-xs font-semibold text-[var(--text-secondary)] uppercase tracking-wider border-b border-[var(--border-light)]">Referral Code / OTR ID</th>
                                <th className="p-4 text-xs font-semibold text-[var(--text-secondary)] uppercase tracking-wider border-b border-[var(--border-light)]">Total Invited</th>
                                <th className="p-4 text-xs font-semibold text-[var(--text-secondary)] uppercase tracking-wider border-b border-[var(--border-light)]">Successful</th>
                                <th className="p-4 text-xs font-semibold text-[var(--text-secondary)] uppercase tracking-wider border-b border-[var(--border-light)]">Mock Tests Earned</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-[var(--border-light)]">
                            {referrersList.slice(0, 5).map((ref: any, idx) => {
                                const earned = Math.floor(ref.successful / 10);
                                return (
                                <tr key={idx} className="hover:bg-[var(--sidebar-hover)] transition-[var(--transition-fast)]">
                                    <td className="p-4 pl-6 text-sm font-medium text-[var(--text-main)]">{ref.user}</td>
                                    <td className="p-4 text-sm text-[var(--text-secondary)] font-mono">{ref.otrId}</td>
                                    <td className="p-4 text-sm font-medium text-[var(--text-main)]">{ref.total}</td>
                                    <td className="p-4 text-sm font-medium text-[var(--success)]">{ref.successful}</td>
                                    <td className="p-4">
                                        <span className={`px-2.5 py-1 text-xs font-medium rounded-full ${earned > 0 ? 'bg-[rgba(16,185,129,0.1)] text-[var(--success)]' : 'bg-[var(--bg-body)] text-[var(--text-secondary)]'}`}>
                                            {earned}
                                        </span>
                                    </td>
                                </tr>
                                );
                            })}
                            {referrersList.length === 0 && (
                                <tr>
                                    <td colSpan={5} className="p-8 text-center text-[var(--text-secondary)]">No referrers found yet.</td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>
            </div>

            {/* Referral Activity Log */}
            <div className="bg-[var(--bg-card)] rounded-[var(--radius-lg)] border border-[var(--border-light)] shadow-sm overflow-hidden flex flex-col min-h-[400px]">
                <div className="p-6 border-b border-[var(--border-light)] flex flex-col md:flex-row md:items-center justify-between gap-4">
                    <div>
                        <h2 className="text-lg font-bold text-[var(--text-main)]">Raw Referral Activity</h2>
                        <p className="text-sm text-[var(--text-secondary)] mt-1">Detailed log of every referral event.</p>
                    </div>
                    
                    <div className="relative max-w-sm w-full">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-[var(--text-secondary)]" size={18} />
                        <input
                            type="text"
                            placeholder="Search by name or OTR ID..."
                            value={searchTerm}
                            onChange={(e) => {
                                setSearchTerm(e.target.value);
                                setCurrentPage(1);
                            }}
                            className="w-full pl-10 pr-4 py-2 border border-[var(--border-light)] rounded-[var(--radius-md)] bg-[var(--bg-body)] text-[var(--text-main)] text-sm focus:outline-none focus:ring-2 focus:ring-[var(--color-primary)]/20 transition-[var(--transition-fast)]"
                        />
                    </div>
                </div>

                <div className="overflow-x-auto flex-1">
                    <table className="w-full text-left border-collapse">
                        <thead>
                            <tr className="bg-[var(--bg-body)]">
                                <th className="p-4 text-xs font-semibold text-[var(--text-secondary)] uppercase tracking-wider border-b border-[var(--border-light)] pl-6">Referrer User</th>
                                <th className="p-4 text-xs font-semibold text-[var(--text-secondary)] uppercase tracking-wider border-b border-[var(--border-light)]">Referred User (Friend)</th>
                                <th className="p-4 text-xs font-semibold text-[var(--text-secondary)] uppercase tracking-wider border-b border-[var(--border-light)]">Status</th>
                                <th className="p-4 text-xs font-semibold text-[var(--text-secondary)] uppercase tracking-wider border-b border-[var(--border-light)]">Date</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-[var(--border-light)]">
                            {paginatedActivity.map((ref) => (
                                <tr key={ref.id} className="hover:bg-[var(--sidebar-hover)] transition-[var(--transition-fast)]">
                                    <td className="p-4 pl-6">
                                        <p className="text-sm font-medium text-[var(--text-main)]">{ref.referrer.firstName} {ref.referrer.lastName}</p>
                                        <p className="text-xs text-[var(--text-secondary)]">{ref.referrer.otrId}</p>
                                    </td>
                                    <td className="p-4 text-sm font-mono text-[var(--text-secondary)]">{ref.refereeOtrId}</td>
                                    <td className="p-4">
                                        <span className={`px-2.5 py-1 text-xs font-medium rounded-full inline-flex items-center gap-1.5
                                            ${ref.status === 'Qualified Referral' ? 'bg-[rgba(16,185,129,0.1)] text-[var(--success)]' : 
                                              ref.status === 'Preparing' ? 'bg-[rgba(245,158,11,0.1)] text-[var(--warning)]' : 
                                              'bg-[rgba(59,130,246,0.1)] text-[var(--color-primary)]'}`}>
                                            {ref.status === 'Qualified Referral' && <CheckCircle size={12} />}
                                            {ref.status}
                                        </span>
                                    </td>
                                    <td className="p-4 text-sm text-[var(--text-secondary)]">
                                        {new Date(ref.createdAt).toLocaleDateString(undefined, {
                                            year: 'numeric',
                                            month: 'short',
                                            day: 'numeric'
                                        })}
                                    </td>
                                </tr>
                            ))}
                            {paginatedActivity.length === 0 && (
                                <tr>
                                    <td colSpan={4} className="p-8 text-center text-[var(--text-secondary)]">No activity found.</td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>

                {/* Pagination */}
                {totalPages > 1 && (
                    <div className="p-4 border-t border-[var(--border-light)] flex items-center justify-between bg-[var(--bg-body)] mt-auto">
                        <span className="text-sm text-[var(--text-secondary)]">
                            Showing {(currentPage - 1) * itemsPerPage + 1} to Math.min(currentPage * itemsPerPage, filteredActivity.length) of {filteredActivity.length} events
                        </span>
                        <div className="flex gap-2">
                            <button
                                onClick={() => setCurrentPage(prev => Math.max(1, prev - 1))}
                                disabled={currentPage === 1}
                                className="p-2 border border-[var(--border-light)] rounded-[var(--radius-md)] text-[var(--text-secondary)] hover:bg-[var(--bg-card)] hover:text-[var(--text-main)] disabled:opacity-50 disabled:cursor-not-allowed transition-[var(--transition-fast)]"
                            >
                                <ChevronLeft size={16} />
                            </button>
                            <span className="px-4 py-2 text-sm font-medium text-[var(--text-main)] bg-[var(--bg-card)] border border-[var(--border-light)] rounded-[var(--radius-md)]">
                                {currentPage} / {totalPages}
                            </span>
                            <button
                                onClick={() => setCurrentPage(prev => Math.min(totalPages, prev + 1))}
                                disabled={currentPage === totalPages}
                                className="p-2 border border-[var(--border-light)] rounded-[var(--radius-md)] text-[var(--text-secondary)] hover:bg-[var(--bg-card)] hover:text-[var(--text-main)] disabled:opacity-50 disabled:cursor-not-allowed transition-[var(--transition-fast)]"
                            >
                                <ChevronRight size={16} />
                            </button>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
}
