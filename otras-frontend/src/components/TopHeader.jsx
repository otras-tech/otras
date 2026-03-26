import { Menu } from 'lucide-react';
import { useTranslation } from "../hooks/useTranslation";
import LanguageSelector from "../components/LanguageSelector";

export default function TopHeader({ collapsed, setCollapsed, user }) {
  const { t } = useTranslation();

  return (
    <div
      className="fixed top-0 right-0 h-14 flex items-center px-5 gap-4 bg-white border-b border-slate-200 z-30 transition-all duration-300"
      style={{ left: collapsed ? 64 : 224 }}
    >

      <button
        onClick={() => setCollapsed(!collapsed)}
        className="text-slate-500 hover:text-slate-800 transition-colors"
      >
        <Menu size={18} />
      </button>

      <span className="text-slate-300">|</span>

      <div className="flex-1 flex justify-between items-center">

        <span className="text-blue-600 font-semibold text-sm">
          {t("otrasArthaEngine")}
        </span>

        <div className="flex items-center gap-4">

          {/* Language Selector */}
          <LanguageSelector />

          {user?.firstName && (
            <div className="flex items-center gap-2">
              <span className="text-xs font-bold text-slate-500 uppercase tracking-widest hidden sm:inline">
                {t("activeCandidate")}
              </span>
              <span className="text-sm font-bold text-slate-800 capitalize">
                {user.firstName} {user.lastName}
              </span>
            </div>
          )}

        </div>

      </div>

    </div>
  );
}