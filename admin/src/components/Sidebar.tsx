import {
    LayoutDashboard,
    Users,
    Briefcase,
    BookOpen,
    FileText,
    LogOut,
    CreditCard,
    FileDown,
    BarChart3,
    Tag,
    HelpCircle,
    FilePieChart,
    Gift
} from 'lucide-react';

import { NavLink, useNavigate } from 'react-router-dom';
import OtrasLogo from '../assets/Otras1.png';

const navItems = [
    { path: '/', label: 'Overview', icon: LayoutDashboard },
    { path: '/users', label: 'Student Directory', icon: Users },
    { path: '/jobs', label: 'Job Board', icon: Briefcase },
    { path: '/exams', label: 'Exam Structure', icon: BookOpen },
    { path: '/subjects', label: 'Subjects', icon: Tag },
    { path: '/questions', label: 'Question Bank', icon: HelpCircle },
    { path: '/tests', label: 'Mock Test Series', icon: FileText },
    { path: '/subscriptions', label: 'Membership Plans', icon: CreditCard },
    { path: '/pyps', label: 'Previous Papers', icon: FileDown },
    { path: '/analytics', label: 'User Analytics', icon: BarChart3 },
    { path: '/reports', label: 'Data Reports', icon: FilePieChart },
    { path: '/referrals', label: 'Refer & Earn Management', icon: Gift },
];

export default function Sidebar() {

    const navigate = useNavigate();

    const handleLogout = () => {
        localStorage.removeItem('adminToken');
        localStorage.removeItem('adminUser');
        navigate('/login');
    };

    return (
        <div className="w-64 bg-[var(--bg-card)] border-r border-[var(--border-light)] flex flex-col h-screen sticky top-0">

            {/* Header */}

            <div className="p-6 border-b border-[var(--border-light)] flex items-center justify-center">

                <img 
                    src={OtrasLogo} 
                    alt="OTRAS Admin" 
                    className="h-12 w-auto object-contain transition-all duration-300"
                />

            </div>


            {/* Navigation */}

            <nav className="flex-1 p-4 space-y-1">

                {navItems.map((item) => (

                    <NavLink
                        key={item.path}
                        to={item.path}
                        className={({ isActive }) =>
                            `flex items-center gap-3 px-4 py-2.5 rounded-[var(--radius-lg)] text-sm font-medium transition-[var(--transition-fast)]
                            ${isActive
                                ? 'bg-[var(--color-primary-light)] text-[var(--color-primary)]'
                                : 'text-[var(--text-secondary)] hover:bg-[var(--sidebar-hover)] hover:text-[var(--text-main)]'
                            }`
                        }
                    >
                        <item.icon size={18} />
                        {item.label}
                    </NavLink>

                ))}

            </nav>


            {/* Footer */}

            <div className="p-4 border-t border-[var(--border-light)]">

                <button
                    onClick={handleLogout}
                    className="w-full flex items-center gap-3 px-4 py-2 text-sm font-medium text-[var(--danger)] hover:bg-[rgba(239,68,68,0.08)] rounded-[var(--radius-lg)] transition-[var(--transition-fast)]"
                >
                    <LogOut size={18} />
                    Sign Out
                </button>

            </div>

        </div>
    );
}