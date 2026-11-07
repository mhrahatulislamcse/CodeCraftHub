import React from 'react';
import { NavLink } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext.jsx';
import {
  LayoutDashboard,
  Compass,
  GraduationCap,
  Sparkles,
  BookOpenCheck,
  User,
  ShieldAlert,
  FolderKanban,
  Flame,
  ChevronLeft,
  ChevronRight,
  Palette,
  BarChart3
} from 'lucide-react';

export function Sidebar({ collapsed = false, onToggleCollapse, className = '' }) {
  const { role, user } = useAuth();

  const studentLinks = [
    { to: '/dashboard', label: 'Dashboard', icon: LayoutDashboard },
    { to: '/courses', label: 'Course Catalog', icon: Compass },
    { to: '/my-learning', label: 'My Learning', icon: GraduationCap },
    { to: '/ai-recommendations', label: 'AI Advisor', icon: Sparkles, badge: 'AI' },
    { to: '/profile', label: 'Profile & Settings', icon: User },
  ];

  const instructorLinks = [
    { to: '/instructor/dashboard', label: 'Instructor Hub', icon: BarChart3 },
    { to: '/instructor/courses', label: 'Course Studio', icon: FolderKanban },
  ];

  const adminLinks = [
    { to: '/admin/dashboard', label: 'Admin Portal', icon: ShieldAlert },
  ];

  return (
    <aside
      className={`bg-[#151C31] border-r border-[#27324A] flex flex-col justify-between transition-all duration-300 h-[calc(100vh-4rem)] sticky top-16 select-none ${collapsed ? 'w-20' : 'w-64'
        } ${className}`}
    >
      {/* Top Nav Items */}
      <div className="p-3 space-y-6 overflow-y-auto">
        {/* Main Navigation Section */}
        <div>
          {!collapsed && (
            <p className="text-[10px] uppercase font-bold text-[#94A3B8] tracking-wider px-3 mb-2">
              Learning
            </p>
          )}
          <nav className="space-y-1">
            {studentLinks.map((item) => {
              const Icon = item.icon;
              return (
                <NavLink
                  key={item.to}
                  to={item.to}
                  title={collapsed ? item.label : undefined}
                  className={({ isActive }) =>
                    `flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-xs font-medium transition-all duration-200 relative group ${isActive
                      ? 'bg-[#7C5CFC]/15 text-white font-semibold shadow-sm shadow-[#7C5CFC]/10'
                      : 'text-[#CBD5E1] hover:text-white hover:bg-[#10182B]'
                    }`
                  }
                >
                  {({ isActive }) => (
                    <>
                      {isActive && (
                        <span className="absolute left-0 top-1.5 bottom-1.5 w-1 rounded-r-full bg-[#7C5CFC]" />
                      )}
                      <Icon
                        className={`w-5 h-5 shrink-0 transition-colors ${isActive ? 'text-[#A78BFA]' : 'text-[#94A3B8] group-hover:text-white'
                          }`}
                      />
                      {!collapsed && (
                        <div className="flex items-center justify-between flex-1">
                          <span>{item.label}</span>
                          {item.badge && (
                            <span className="text-[10px] font-bold px-1.5 py-0.5 rounded-md bg-[#7C5CFC]/30 text-[#A78BFA] border border-[#7C5CFC]/50">
                              {item.badge}
                            </span>
                          )}
                        </div>
                      )}
                    </>
                  )}
                </NavLink>
              );
            })}
          </nav>
        </div>

        {/* Instructor Section (if instructor or admin) */}
        {(role === 'instructor' || role === 'admin') && (
          <div>
            {!collapsed && (
              <p className="text-[10px] uppercase font-bold text-[#F59E0B] tracking-wider px-3 mb-2 flex items-center justify-between">
                <span>Instructor</span>
                <span className="text-[9px] bg-[#F59E0B]/20 text-[#F59E0B] px-1 rounded">PRO</span>
              </p>
            )}
            <nav className="space-y-1">
              {instructorLinks.map((item) => {
                const Icon = item.icon;
                return (
                  <NavLink
                    key={item.to}
                    to={item.to}
                    title={collapsed ? item.label : undefined}
                    className={({ isActive }) =>
                      `flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-xs font-medium transition-all relative group ${isActive
                        ? 'bg-[#F59E0B]/15 text-white font-semibold'
                        : 'text-[#CBD5E1] hover:text-white hover:bg-[#10182B]'
                      }`
                    }
                  >
                    {({ isActive }) => (
                      <>
                        {isActive && (
                          <span className="absolute left-0 top-1.5 bottom-1.5 w-1 rounded-r-full bg-[#F59E0B]" />
                        )}
                        <Icon
                          className={`w-5 h-5 shrink-0 ${isActive ? 'text-[#F59E0B]' : 'text-[#94A3B8] group-hover:text-white'
                            }`}
                        />
                        {!collapsed && <span>{item.label}</span>}
                      </>
                    )}
                  </NavLink>
                );
              })}
            </nav>
          </div>
        )}

        {/* Admin Section (if admin) */}
        {role === 'admin' && (
          <div>
            {!collapsed && (
              <p className="text-[10px] uppercase font-bold text-[#EF4444] tracking-wider px-3 mb-2">
                System Administration
              </p>
            )}
            <nav className="space-y-1">
              {adminLinks.map((item) => {
                const Icon = item.icon;
                return (
                  <NavLink
                    key={item.to}
                    to={item.to}
                    title={collapsed ? item.label : undefined}
                    className={({ isActive }) =>
                      `flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-xs font-medium transition-all relative group ${isActive
                        ? 'bg-[#EF4444]/15 text-white font-semibold'
                        : 'text-[#CBD5E1] hover:text-white hover:bg-[#10182B]'
                      }`
                    }
                  >
                    {({ isActive }) => (
                      <>
                        {isActive && (
                          <span className="absolute left-0 top-1.5 bottom-1.5 w-1 rounded-r-full bg-[#EF4444]" />
                        )}
                        <Icon
                          className={`w-5 h-5 shrink-0 ${isActive ? 'text-[#EF4444]' : 'text-[#94A3B8] group-hover:text-white'
                            }`}
                        />
                        {!collapsed && <span>{item.label}</span>}
                      </>
                    )}
                  </NavLink>
                );
              })}
            </nav>
          </div>
        )}

        {/* Developer Design System Link */}
        <div>
          {!collapsed && (
            <p className="text-[10px] uppercase font-bold text-[#94A3B8] tracking-wider px-3 mb-2">
              Design System
            </p>
          )}
          <NavLink
            to="/design-system"
            title={collapsed ? 'UI Showcase' : undefined}
            className={({ isActive }) =>
              `flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-xs font-medium transition-all relative group ${isActive
                ? 'bg-[#7C5CFC]/20 text-white font-semibold'
                : 'text-[#CBD5E1] hover:text-white hover:bg-[#10182B]'
              }`
            }
          >
            <Palette className="w-5 h-5 text-[#A78BFA] shrink-0" />
            {!collapsed && <span>Component Showcase</span>}
          </NavLink>
        </div>
      </div>

      {/* Bottom section: Streak widget & collapse button */}
      <div className="p-3 border-t border-[#27324A]/60 space-y-3">
        {/* Streak / Daily goal card */}
        {!collapsed ? (
          <div className="p-3 rounded-xl bg-[#10182B] border border-[#27324A] flex items-center justify-between">
            <div className="flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-lg bg-[#F59E0B]/20 text-[#F59E0B] flex items-center justify-center">
                <Flame className="w-5 h-5 fill-[#F59E0B]" />
              </div>
              <div>
                <p className="text-xs font-bold text-white flex items-center gap-1">
                  5 Days <span className="text-[10px] font-normal text-[#94A3B8]">Streak</span>
                </p>
                <p className="text-[10px] text-[#A78BFA]">45 mins learned today</p>
              </div>
            </div>
          </div>
        ) : (
          <div className="flex justify-center" title="5 Day Coding Streak">
            <div className="w-10 h-10 rounded-xl bg-[#F59E0B]/20 text-[#F59E0B] flex items-center justify-center">
              <Flame className="w-5 h-5 fill-[#F59E0B]" />
            </div>
          </div>
        )}

        {/* Collapse / Expand Toggle Button */}
        {onToggleCollapse && (
          <button
            onClick={onToggleCollapse}
            className="w-full flex items-center justify-center gap-2 py-2 text-xs text-[#94A3B8] hover:text-white hover:bg-[#10182B] rounded-xl transition"
            aria-label={collapsed ? 'Expand sidebar' : 'Collapse sidebar'}
          >
            {collapsed ? (
              <ChevronRight className="w-4 h-4" />
            ) : (
              <>
                <ChevronLeft className="w-4 h-4" />
                <span>Collapse Sidebar</span>
              </>
            )}
          </button>
        )}
      </div>
    </aside>
  );
}

export default Sidebar;
