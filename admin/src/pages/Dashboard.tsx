import { useEffect, useState } from 'react';
import axios from 'axios';
import { Briefcase, BookOpen, ClipboardList, TrendingUp, Users } from 'lucide-react';

export default function Dashboard() {
    const [stats, setStats] = useState({ jobs: 0, exams: 0, tests: 0, users: 0 });

    useEffect(() => {
        fetchStats();
    }, []);

    const fetchStats = async () => {
        try {
            const [uResp, eResp, jResp] = await Promise.all([
                axios.get("http://localhost:4000/users"),
                axios.get("http://localhost:4000/exams"),
                axios.get("http://localhost:4000/jobs"),
            ]);

            setStats({
                jobs: jResp.data.length,
                exams: eResp.data.length,
                tests: 0, // Assuming tests are no longer fetched or are 0
                users: uResp.data.length,
            });
        } catch (err) {
            console.error(err);
        }
    };

    const cards = [
        { label: 'Active Jobs', value: stats.jobs, icon: Briefcase, color: 'bg-[var(--color-primary)]' },
        { label: 'Live Exams', value: stats.exams, icon: BookOpen, color: 'bg-[var(--success)]' },
        { label: 'Mock Tests', value: stats.tests, icon: ClipboardList, color: 'bg-[var(--color-cyan)]' },
        { label: 'Registered Users', value: stats.users, icon: Users, color: 'bg-[var(--color-primary-dark)]' },
    ];

    return (
        <div className="space-y-8">

            {/* Header */}

            <div>
                <h1 className="text-2xl font-bold text-[var(--text-main)]">
                    Admin Overview
                </h1>

                <p className="text-sm text-[var(--text-muted)]">
                    System performance and recruitment metrics.
                </p>
            </div>


            {/* Stats Cards */}

            <div className="grid grid-cols-4 gap-6">

                {cards.map((card) => (

                    <div
                        key={card.label}
                        className="app-card p-6 flex items-center justify-between"
                    >

                        <div>
                            <p className="text-xs font-bold uppercase tracking-wider mb-1 text-[var(--text-muted)]">
                                {card.label}
                            </p>

                            <p className="text-3xl font-bold text-[var(--text-main)]">
                                {card.value}
                            </p>
                        </div>

                        <div
                            className={`w-12 h-12 ${card.color} rounded-[var(--radius-xl)] flex items-center justify-center text-white shadow-[var(--shadow-md)]`}
                        >
                            <card.icon size={24} />
                        </div>

                    </div>

                ))}

            </div>


            {/* Charts + Actions */}

            <div className="grid grid-cols-2 gap-6">

                {/* Registration Chart */}

                <div className="app-card p-6">

                    <div className="flex items-center gap-2 mb-6">

                        <TrendingUp
                            size={20}
                            className="text-[var(--color-primary)]"
                        />

                        <h2 className="font-bold text-[var(--text-main)]">
                            Registration Trend
                        </h2>

                    </div>


                    <div className="h-48 bg-[var(--bg-light)] rounded-[var(--radius-xl)] flex items-end justify-between px-6 pb-4">

                        {[40, 70, 45, 90, 65, 80, 100].map((h, i) => (

                            <div
                                key={i}
                                className="w-8 bg-[var(--color-primary)] rounded-t-lg transition-[var(--transition-fast)] hover:bg-[var(--color-primary-dark)]"
                                style={{ height: `${h}%` }}
                            />

                        ))}

                    </div>

                </div>


                {/* Quick Actions */}

                <div className="app-card p-6">

                    <h2 className="font-bold text-[var(--text-main)] mb-4">
                        Quick Actions
                    </h2>

                    <div className="grid grid-cols-2 gap-4">

                        <button
                            className="p-4 bg-[var(--bg-light)] rounded-[var(--radius-xl)] hover:bg-[var(--color-primary-light)] transition-[var(--transition-fast)] text-left group"
                        >
                            <p className="text-sm font-bold text-[var(--text-secondary)] group-hover:text-[var(--color-primary)]">
                                Add Questions
                            </p>

                            <p className="text-xs text-[var(--text-muted)]">
                                Update question bank
                            </p>
                        </button>


                        <button
                            className="p-4 bg-[var(--bg-light)] rounded-[var(--radius-xl)] hover:bg-[var(--success-bg)] transition-[var(--transition-fast)] text-left group"
                        >
                            <p className="text-sm font-bold text-[var(--text-secondary)] group-hover:text-[var(--success)]">
                                Export Results
                            </p>

                            <p className="text-xs text-[var(--text-muted)]">
                                Download CSV/PDF
                            </p>
                        </button>

                    </div>

                </div>

            </div>

        </div>
    );
}