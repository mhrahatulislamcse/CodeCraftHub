import React, { useState, useRef, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext.jsx';
import Badge from '../components/common/Badge.jsx';
import {
  Code2,
  Search,
  Bell,
  User,
  LogOut,
  Settings,
  BookOpen,
  Sparkles,
  Menu,
  X,
  ShieldCheck,
  GraduationCap
} from 'lucide-react';

export function Navbar({ onToggleSidebar, isSidebarCollapsed }) {
  const { user, isAuthenticated, logout, switchMockRole, role } = useAuth();
  const navigate = useNavigate();
  const [userMenuOpen, setUserMenuOpen] = useState(false);
  const [notificationsOpen, setNotificationsOpen] = useState(false);
  const menuRef = useRef(null);
  const notifRef = useRef(null);

  // Close dropdowns when clicking outside
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (menuRef.current && !menuRef.current.contains(e.target)) {
        setUserMenuOpen(false);
      }
      if (notifRef.current && !notifRef.current.contains(e.target)) {
        setNotificationsOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleLogout = async () => {
    setUserMenuOpen(false);
    await logout();
    navigate('/login');
  };

  const sampleNotifications = [
    { id: 1, title: 'AI Recommendation Ready', desc: 'New personalized React track generated for your skill profile.', time: '10m ago', unread: true },
    { id: 2, title: 'Course Enrolled', desc: 'You enrolled in "Production Ready PostgreSQL".', time: '2h ago', unread: false },
    { id: 3, title: 'Streak Milestone!', desc: 'You reached a 7-day coding streak. Keep it up!', time: '1d ago', unread: false },
  ];

  const roleBadgeVariant = {
    admin: 'red',
    instructor: 'yellow',
    student: 'purple',
    guest: 'neutral',
  };

  return (
    <header className="h-16 border-b border-[#27324A] bg-[#151C31]/80 backdrop-blur-md sticky top-0 z-40 px-4 sm:px-6 flex items-center justify-between">
      {/* Left side: Mobile Toggle & Brand */}
      <div className="flex items-center gap-3">
        {onToggleSidebar && (
          <button
            onClick={onToggleSidebar}
            className="p-2 rounded-xl text-[#CBD5E1] hover:text-white hover:bg-[#10182B] transition lg:hidden"
            aria-label="Toggle navigation sidebar"
          >
            <Menu className="w-5 h-5" />
          </button>
        )}

        <Link to="/" className="flex items-center gap-2.5 group">
          <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-[#7C5CFC] to-[#A78BFA] flex items-center justify-center shadow-lg shadow-[#7C5CFC]/25 group-hover:scale-105 transition-transform">
            <Code2 className="w-5 h-5 text-white" />
          </div>
          <div className="hidden sm:block">
            <span className="text-base font-bold tracking-tight text-white flex items-center gap-1.5">
              CodeCraftHub
            </span>
            <p className="text-[10px] text-[#94A3B8] -mt-1 font-mono">LMS PLATFORM</p>
          </div>
        </Link>
      </div>

      {/* Middle: Global Search bar */}
      <div className="hidden md:flex items-center flex-1 max-w-md mx-6">
        <div className="relative w-full">
          <Search className="w-4 h-4 text-[#94A3B8] absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="Search courses, skills, or lessons..."
            className="w-full bg-[#10182B] text-xs text-[#F8FAFC] placeholder-[#94A3B8]/60 rounded-xl pl-9 pr-12 py-2 border border-[#27324A] focus:border-[#7C5CFC] focus:outline-none transition"
          />
          <div className="absolute right-3 top-1/2 -translate-y-1/2 flex items-center gap-1">
            <span className="text-[10px] font-mono bg-[#151C31] text-[#94A3B8] px-1.5 py-0.5 rounded border border-[#27324A]">
              /
            </span>
          </div>
        </div>
      </div>

      {/* Right side: Role Pill, Notifications, User Menu */}
      <div className="flex items-center gap-3">
        {/* Living Design System Showcase Link */}
        <Link
          to="/design-system"
          className="hidden xl:flex items-center gap-1.5 text-xs font-medium px-3 py-1.5 rounded-lg bg-[#7C5CFC]/10 text-[#A78BFA] border border-[#7C5CFC]/30 hover:bg-[#7C5CFC]/20 transition"
        >
          <Sparkles className="w-3.5 h-3.5" />
          <span>UI Showcase</span>
        </Link>

        {/* Current Active Role Badge */}
        {isAuthenticated && (
          <Badge
            variant={roleBadgeVariant[role] || 'neutral'}
            size="xs"
            dot
            className="hidden sm:inline-flex capitalize"
          >
            {role}
          </Badge>
        )}

        {/* Notifications Popover */}
        <div className="relative" ref={notifRef}>
          <button
            onClick={() => setNotificationsOpen(!notificationsOpen)}
            className="relative p-2 rounded-xl text-[#CBD5E1] hover:text-white hover:bg-[#10182B] transition"
            aria-label="View notifications"
          >
            <Bell className="w-5 h-5" />
            <span className="absolute top-1.5 right-1.5 w-2 h-2 rounded-full bg-[#7C5CFC] animate-ping" />
            <span className="absolute top-1.5 right-1.5 w-2 h-2 rounded-full bg-[#7C5CFC]" />
          </button>

          {notificationsOpen && (
            <div className="absolute right-0 mt-2 w-80 sm:w-96 glass-dropdown rounded-2xl shadow-2xl p-4 z-50 animate-in fade-in zoom-in-95 duration-150">
              <div className="flex items-center justify-between pb-3 border-b border-[#27324A]/60">
                <h4 className="text-sm font-semibold text-[#F8FAFC]">Notifications</h4>
                <span className="text-[10px] text-[#A78BFA] cursor-pointer hover:underline">
                  Mark all as read
                </span>
              </div>
              <div className="mt-2 divide-y divide-[#27324A]/40 max-h-72 overflow-y-auto">
                {sampleNotifications.map((notif) => (
                  <div key={notif.id} className="py-2.5 px-1 hover:bg-[#151C31] rounded-lg transition cursor-pointer">
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-semibold text-[#F8FAFC]">{notif.title}</span>
                      <span className="text-[10px] text-[#94A3B8]">{notif.time}</span>
                    </div>
                    <p className="text-xs text-[#CBD5E1] mt-0.5 line-clamp-2">{notif.desc}</p>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* User Avatar & Menu */}
        {isAuthenticated ? (
          <div className="relative" ref={menuRef}>
            <button
              onClick={() => setUserMenuOpen(!userMenuOpen)}
              className="flex items-center gap-2.5 p-1 rounded-xl hover:bg-[#10182B] transition cursor-pointer"
            >
              <div className="w-8 h-8 rounded-xl bg-gradient-to-tr from-[#7C5CFC] to-[#A78BFA] text-white flex items-center justify-center font-bold text-xs shadow-sm">
                {user?.firstName ? user.firstName.charAt(0).toUpperCase() : 'U'}
              </div>
              <div className="hidden lg:block text-left">
                <p className="text-xs font-semibold text-[#F8FAFC] leading-tight">
                  {user?.firstName ? `${user.firstName} ${user.lastName || ''}` : 'Developer'}
                </p>
                <p className="text-[10px] text-[#94A3B8] leading-tight capitalize">{role}</p>
              </div>
            </button>

            {userMenuOpen && (
              <div className="absolute right-0 mt-2 w-56 glass-dropdown rounded-2xl shadow-2xl p-2 z-50 animate-in fade-in zoom-in-95 duration-150">
                <div className="px-3 py-2 border-b border-[#27324A]/60">
                  <p className="text-xs font-semibold text-[#F8FAFC]">
                    {user?.firstName} {user?.lastName}
                  </p>
                  <p className="text-[11px] text-[#94A3B8] truncate">{user?.email}</p>
                </div>

                <div className="py-1">
                  <Link
                    to="/profile"
                    onClick={() => setUserMenuOpen(false)}
                    className="flex items-center gap-2.5 px-3 py-2 text-xs text-[#CBD5E1] hover:text-white hover:bg-[#151C31] rounded-lg transition"
                  >
                    <User className="w-4 h-4 text-[#A78BFA]" />
                    Profile & Settings
                  </Link>

                  <Link
                    to="/my-learning"
                    onClick={() => setUserMenuOpen(false)}
                    className="flex items-center gap-2.5 px-3 py-2 text-xs text-[#CBD5E1] hover:text-white hover:bg-[#151C31] rounded-lg transition"
                  >
                    <BookOpen className="w-4 h-4 text-[#A78BFA]" />
                    My Learning
                  </Link>
                </div>

                {/* Role Switcher for preview & testing */}
                <div className="py-2 border-t border-[#27324A]/40 px-2">
                  <p className="text-[10px] text-[#94A3B8] uppercase font-semibold mb-1 px-1">
                    Preview As Role:
                  </p>
                  <div className="grid grid-cols-3 gap-1">
                    {['student', 'instructor', 'admin'].map((r) => (
                      <button
                        key={r}
                        onClick={() => {
                          switchMockRole(r);
                          setUserMenuOpen(false);
                        }}
                        className={`text-[10px] py-1 rounded capitalize font-medium transition ${
                          role === r
                            ? 'bg-[#7C5CFC] text-white'
                            : 'bg-[#151C31] text-[#94A3B8] hover:text-white'
                        }`}
                      >
                        {r}
                      </button>
                    ))}
                  </div>
                </div>

                <div className="pt-1 border-t border-[#27324A]/40">
                  <button
                    onClick={handleLogout}
                    className="w-full flex items-center gap-2.5 px-3 py-2 text-xs text-[#EF4444] hover:bg-[#EF4444]/10 rounded-lg transition text-left"
                  >
                    <LogOut className="w-4 h-4" />
                    Sign Out
                  </button>
                </div>
              </div>
            )}
          </div>
        ) : (
          <div className="flex items-center gap-2">
            <Link
              to="/login"
              className="text-xs font-medium text-[#CBD5E1] hover:text-white px-3 py-1.5 transition"
            >
              Sign In
            </Link>
            <Link
              to="/register"
              className="text-xs font-medium text-white bg-gradient-to-r from-[#7C5CFC] to-[#6344E7] hover:from-[#6D4CF0] hover:to-[#5132D6] px-3.5 py-1.5 rounded-xl shadow-md shadow-[#7C5CFC]/20 transition"
            >
              Get Started
            </Link>
          </div>
        )}
      </div>
    </header>
  );
}

export default Navbar;
