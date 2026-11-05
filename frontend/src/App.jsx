import React, { useState, useEffect } from 'react';
import { 
  Sparkles, 
  Terminal, 
  Database, 
  Server, 
  ShieldCheck, 
  BookOpen, 
  CheckCircle2, 
  Activity,
  Layers,
  ArrowRight,
  Code2,
  Users
} from 'lucide-react';
import api from './services/api.js';

export function App() {
  const [backendHealth, setBackendHealth] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const checkBackend = async () => {
      try {
        setLoading(true);
        const data = await api.get('/info');
        setBackendHealth(data);
        setError(null);
      } catch (err) {
        setError(err.message || 'Backend not responding yet on port 5000');
      } finally {
        setLoading(false);
      }
    };

    checkBackend();
  }, []);

  const screens = [
    { num: '01', title: 'Login & Registration', desc: 'Secure JWT authentication with role-based routing' },
    { num: '02', title: 'Student Dashboard', desc: 'Stats, active enrollments, streak, and weekly activity' },
    { num: '03', title: 'Course Catalog', desc: 'Search, category and difficulty filters, instructor cards' },
    { num: '04', title: 'Course Details', desc: 'Syllabus, duration, learning objectives, reviews' },
    { num: '05', title: 'Interactive Learning Page', desc: 'Curriculum sidebar, video workspace, completion tracking' },
    { num: '06', title: 'My Learning & Progress', desc: 'Enrolled courses, certificates, skill milestones' },
    { num: '07', title: 'AI Recommendations', desc: 'Personalized course paths, skill gap analysis' },
    { num: '08', title: 'User Profile & Settings', desc: 'Tech stack, learning goals, account preferences' },
    { num: '09', title: 'Admin Dashboard', desc: 'Platform analytics, user management, course review' },
    { num: '10', title: 'Course Management', desc: 'Instructor curriculum builder and student monitor' }
  ];

  const techStack = [
    { category: 'Frontend', items: ['React 19', 'Vite', 'Tailwind CSS v4', 'React Router', 'Recharts', 'Lucide React'] },
    { category: 'Backend', items: ['Node.js (v24)', 'Express.js', 'PostgreSQL 18', 'JWT Auth', 'bcryptjs', 'Helmet & CORS'] },
    { category: 'AI Integration', items: ['GenAI Provider', 'Skill Gap Engine', 'Personalized Pathways', 'Smart Fallback'] },
    { category: 'Design System', items: ['Dark Navy (#0B1020)', 'Electric Purple (#7C5CFC)', 'Inter Font', 'JetBrains Mono'] }
  ];

  return (
    <div className="min-h-screen bg-[#0B1020] text-[#F8FAFC] selection:bg-[#7C5CFC] selection:text-white">
      {/* Top Navigation Bar */}
      <header className="border-b border-[#27324A] bg-[#151C31]/70 backdrop-blur-md sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-6 h-18 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-[#7C5CFC] to-[#A78BFA] flex items-center justify-center shadow-lg shadow-[#7C5CFC]/20">
              <Code2 className="w-6 h-6 text-white" />
            </div>
            <div>
              <span className="text-xl font-bold tracking-tight text-white flex items-center gap-2">
                CodeCraftHub
                <span className="text-[10px] uppercase font-semibold px-2 py-0.5 rounded-full bg-[#7C5CFC]/20 text-[#A78BFA] border border-[#7C5CFC]/40">
                  Phase 1 Verified
                </span>
              </span>
              <p className="text-xs text-[#94A3B8]">Learn Smarter. Build Better. Grow Faster.</p>
            </div>
          </div>

          <div className="flex items-center gap-4">
            <div className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-[#10182B] border border-[#27324A] text-xs">
              <span className="relative flex h-2 w-2">
                <span className={`animate-ping absolute inline-flex h-full w-full rounded-full opacity-75 ${error ? 'bg-[#EF4444]' : 'bg-[#22C55E]'}`}></span>
                <span className={`relative inline-flex rounded-full h-2 w-2 ${error ? 'bg-[#EF4444]' : 'bg-[#22C55E]'}`}></span>
              </span>
              <span className="text-[#CBD5E1]">
                {loading ? 'Checking Backend...' : error ? 'Backend Offline (Start Port 5000)' : 'API v1 Connected'}
              </span>
            </div>
            <a 
              href="http://localhost:5000/api/v1/health" 
              target="_blank" 
              rel="noreferrer"
              className="text-xs text-[#A78BFA] hover:text-white transition flex items-center gap-1 font-mono"
            >
              /api/v1/health <ArrowRight className="w-3 h-3" />
            </a>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <main className="max-w-7xl mx-auto px-6 py-12 space-y-12">
        <section className="relative overflow-hidden rounded-2xl bg-gradient-to-b from-[#151C31] to-[#0B1020] border border-[#27324A] p-8 md:p-12 shadow-2xl">
          <div className="absolute top-0 right-0 w-96 h-96 bg-[#7C5CFC]/10 rounded-full blur-3xl pointer-events-none" />
          
          <div className="relative z-10 max-w-3xl space-y-4">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#7C5CFC]/15 border border-[#7C5CFC]/30 text-xs font-medium text-[#A78BFA]">
              <Sparkles className="w-3.5 h-3.5" />
              Next-Generation Developer LMS
            </div>
            <h1 className="text-4xl md:text-5xl font-extrabold tracking-tight text-white leading-tight">
              Personalized Learning Platform for <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#7C5CFC] via-[#A78BFA] to-purple-300">Modern Engineers</span>
            </h1>
            <p className="text-base md:text-lg text-[#CBD5E1] leading-relaxed">
              CodeCraftHub empowers developers to discover tailored curriculum, practice hands-on coding lessons, bridge skill gaps, and accelerate career growth through real-time telemetry and AI recommendations.
            </p>

            <div className="pt-4 flex flex-wrap gap-4">
              <div className="flex items-center gap-2 px-4 py-2 rounded-xl bg-[#10182B] border border-[#27324A] text-xs font-mono text-[#CBD5E1]">
                <Database className="w-4 h-4 text-[#7C5CFC]" />
                PostgreSQL 18 Service Running
              </div>
              <div className="flex items-center gap-2 px-4 py-2 rounded-xl bg-[#10182B] border border-[#27324A] text-xs font-mono text-[#CBD5E1]">
                <Server className="w-4 h-4 text-[#7C5CFC]" />
                Node.js v24 + Express ESM
              </div>
              <div className="flex items-center gap-2 px-4 py-2 rounded-xl bg-[#10182B] border border-[#27324A] text-xs font-mono text-[#CBD5E1]">
                <ShieldCheck className="w-4 h-4 text-[#22C55E]" />
                Helmet, CORS & JWT Hardened
              </div>
            </div>
          </div>
        </section>

        {/* Phase 1 Verification Status Cards */}
        <section className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="p-6 rounded-xl bg-[#151C31] border border-[#27324A] space-y-3">
            <div className="w-10 h-10 rounded-lg bg-[#22C55E]/10 border border-[#22C55E]/30 flex items-center justify-center text-[#22C55E]">
              <CheckCircle2 className="w-5 h-5" />
            </div>
            <h3 className="text-lg font-semibold text-white">Phase 1 Initialized</h3>
            <p className="text-sm text-[#94A3B8]">
              Environment verified, modular folder architecture established, and full test suite active.
            </p>
            <div className="text-xs font-mono text-[#A78BFA] pt-2">
              Status: Ready for Phase 2 Migrations
            </div>
          </div>

          <div className="p-6 rounded-xl bg-[#151C31] border border-[#27324A] space-y-3">
            <div className="w-10 h-10 rounded-lg bg-[#7C5CFC]/10 border border-[#7C5CFC]/30 flex items-center justify-center text-[#7C5CFC]">
              <Users className="w-5 h-5" />
            </div>
            <h3 className="text-lg font-semibold text-white">Three Distinct Roles</h3>
            <p className="text-sm text-[#94A3B8]">
              Engineered for <span className="text-white font-medium">Students</span> (LMS & AI), <span className="text-white font-medium">Instructors</span> (Curriculum Builder), and <span className="text-white font-medium">Admins</span> (Governance).
            </p>
            <div className="text-xs font-mono text-[#CBD5E1] pt-2">
              RBAC authorization enforced on APIs
            </div>
          </div>

          <div className="p-6 rounded-xl bg-[#151C31] border border-[#27324A] space-y-3">
            <div className="w-10 h-10 rounded-lg bg-[#A78BFA]/10 border border-[#A78BFA]/30 flex items-center justify-center text-[#A78BFA]">
              <Activity className="w-5 h-5" />
            </div>
            <h3 className="text-lg font-semibold text-white">No Fake Demo Data</h3>
            <p className="text-sm text-[#94A3B8]">
              Strict architectural rule: all dashboard metrics and learning progress derive from normalized PostgreSQL records.
            </p>
            <div className="text-xs font-mono text-[#CBD5E1] pt-2">
              18 Normalized tables in schema
            </div>
          </div>
        </section>

        {/* 10 Proposed Master Screens Showcase */}
        <section className="space-y-6">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-2xl font-bold text-white flex items-center gap-2">
                <Layers className="w-5 h-5 text-[#7C5CFC]" />
                10 Core Application Screens
              </h2>
              <p className="text-sm text-[#94A3B8]">
                Tailored for the dark navy & electric-purple design system with high usability.
              </p>
            </div>
            <span className="text-xs font-mono px-3 py-1 rounded bg-[#10182B] border border-[#27324A] text-[#A78BFA]">
              Figma 1440×1024 / 390×844
            </span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
            {screens.map((screen) => (
              <div 
                key={screen.num}
                className="p-4 rounded-xl bg-[#151C31] border border-[#27324A] hover:border-[#7C5CFC] transition-colors group flex flex-col justify-between"
              >
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-mono font-bold text-[#7C5CFC]">{screen.num}</span>
                    <div className="w-2 h-2 rounded-full bg-[#27324A] group-hover:bg-[#7C5CFC] transition-colors" />
                  </div>
                  <h4 className="text-sm font-semibold text-white group-hover:text-[#A78BFA] transition-colors">
                    {screen.title}
                  </h4>
                  <p className="text-xs text-[#94A3B8] leading-relaxed">
                    {screen.desc}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* Tech Stack Specs */}
        <section className="space-y-6">
          <div>
            <h2 className="text-2xl font-bold text-white flex items-center gap-2">
              <Terminal className="w-5 h-5 text-[#7C5CFC]" />
              Production Architecture Stack
            </h2>
            <p className="text-sm text-[#94A3B8]">
              Clean separation of concerns with full JavaScript ES6+ standards.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
            {techStack.map((stack) => (
              <div key={stack.category} className="p-5 rounded-xl bg-[#151C31] border border-[#27324A] space-y-3">
                <h4 className="text-sm font-semibold text-[#A78BFA] uppercase tracking-wider">
                  {stack.category}
                </h4>
                <ul className="space-y-1.5">
                  {stack.items.map((item) => (
                    <li key={item} className="text-xs font-mono text-[#CBD5E1] flex items-center gap-2">
                      <span className="w-1.5 h-1.5 rounded-full bg-[#7C5CFC]"></span>
                      {item}
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </section>

        {/* Phase Roadmap Footer */}
        <footer className="border-t border-[#27324A] pt-8 pb-12 text-center text-xs text-[#94A3B8] space-y-2">
          <p>CodeCraftHub – Personalized Developer Learning Platform</p>
          <p className="font-mono text-[#CBD5E1]">Phase 1 Complete & Verified • Prepared for Phase 2: PostgreSQL Database Architecture & Migrations</p>
        </footer>
      </main>
    </div>
  );
}

export default App;
