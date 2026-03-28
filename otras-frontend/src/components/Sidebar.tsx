import { NavLink, useNavigate } from 'react-router-dom';
import {
  LayoutDashboard, Search, CheckCircle, Zap, Briefcase,
  BookOpen, ClipboardList, BarChart2, User, LogOut, FileText, CreditCard, Gift
} from 'lucide-react';
import { useTranslation } from '../hooks/useTranslation';
import OtrasLogo from '../LandingPage/assets/Otras1.png';

const navItems = [
  { path: '/dashboard', labelKey: 'dashboard', icon: LayoutDashboard },
  { path: '/exams', labelKey: 'exams', icon: Search },
  { path: '/eligibility', labelKey: 'eligibilityNav', icon: CheckCircle },
  { path: '/artha', labelKey: 'arthaEngine', icon: Zap },
  { path: '/career', labelKey: 'careerAI', icon: Briefcase },
  { path: '/studyplan', labelKey: 'studyPlan', icon: BookOpen },
  { path: '/resources', labelKey: 'resources', icon: FileText },
  { path: '/mocktests', labelKey: 'mockTests', icon: ClipboardList },
  { path: '/subscriptions', labelKey: 'subscriptions', icon: CreditCard },
  { path: '/applications', labelKey: 'applicationStatus', icon: LayoutDashboard },
  { path: '/refer-earn', labelKey: 'referEarn', icon: Gift },
  { path: '/analytics', labelKey: 'analytics', icon: BarChart2 },
  { path: '/profile', labelKey: 'profile', icon: User },
];

export default function Sidebar({ collapsed, setCollapsed, user, logout }) {
  const { t } = useTranslation();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();        // your existing logout logic
    navigate('/');   // redirect to home
  };

  return (
    <div
      className={`fixed left-0 top-0 h-full flex flex-col z-40 transition-all duration-300 ${collapsed ? 'w-16' : 'w-56'}`}
      style={{ background: '#0f172a' }}
    >
      {/* Logo */}
      <div className={`flex items-center ${collapsed ? 'justify-center' : 'gap-2 px-4'} py-5 border-b border-slate-700/50`}>
        <div className="flex items-center justify-center flex-shrink-0">
          <img 
            src={OtrasLogo} 
            alt="OTRAS" 
            className={`${collapsed ? 'h-8' : 'h-10'} w-auto object-contain transition-all duration-300`}
          />
        </div>
      </div>

      {/* Nav */}
      <div className="flex-1 overflow-y-auto py-4 px-2">
        {!collapsed && (
          <p className="text-slate-500 text-xs font-semibold uppercase tracking-widest px-3 mb-3">
            {t("platform")}
          </p>
        )}
        <nav className="space-y-0.5">
          {navItems.map(({ path, labelKey, icon: Icon }) => (
            <NavLink
              key={path}
              to={path}
              className={({ isActive }) =>
                `w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-all duration-150 ${isActive
                  ? 'bg-blue-600 text-white'
                  : 'text-slate-400 hover:text-white hover:bg-slate-700/60'
                } ${collapsed ? 'justify-center' : ''}`
              }
            >
              <Icon size={16} className="flex-shrink-0" />
              {!collapsed && t(labelKey)}
            </NavLink>
          ))}
        </nav>
      </div>

      {/* Bottom: User + Logout */}
      <div className="p-3 border-t border-slate-700/50 space-y-2">
        <div
          className={`flex items-center gap-3 px-2 py-2 rounded-lg bg-blue-900/40 ${collapsed ? 'justify-center' : ''}`}
        >
          <div className="w-8 h-8 rounded-full bg-cyan-500 flex items-center justify-center text-white text-xs font-bold flex-shrink-0">
            {user?.firstName ? user.firstName[0] : (user?.otrId ? user.otrId[0] : '?')}
          </div>
          {!collapsed && (
            <div className="min-w-0">
              <p className="text-white text-sm font-semibold truncate">{user?.firstName ? `${user.firstName} ${user.lastName}` : t("guestUser")}</p>
              <p className="text-slate-400 text-xs truncate">{user?.otrId || t("notRegistered")}</p>
            </div>
          )}
        </div>
        <button
          onClick={handleLogout}
          className={`w-full flex items-center gap-3 px-3 py-2 rounded-lg text-slate-400 hover:text-white hover:bg-slate-700/60 text-sm transition-all ${collapsed ? 'justify-center' : ''}`}
        >
          <LogOut size={15} />
          {!collapsed && t("logout")}
        </button>
      </div>
    </div>
  );
}
