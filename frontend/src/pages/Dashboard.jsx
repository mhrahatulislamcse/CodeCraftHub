import React from 'react';
import { useAuth } from '../contexts/AuthContext.jsx';
import StatCard from '../components/common/StatCard.jsx';
import Button from '../components/common/Button.jsx';
import { Sparkles, Flame, Clock, GraduationCap, ArrowRight, BookOpen } from 'lucide-react';
import { Link } from 'react-router-dom';

export function Dashboard() {
  const { user } = useAuth();

  return (
    <div className="space-y-8">
      {/* Welcome Hero Banner */}
      <div className="relative p-8 rounded-3xl bg-gradient-to-r from-[#151C31] via-[#1E2642] to-[#151C31] border border-[#27324A] overflow-hidden">
        <div className="absolute top-0 right-0 w-96 h-96 bg-[#7C5CFC]/15 rounded-full blur-3xl pointer-events-none" />

        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div>
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#7C5CFC]/20 text-[#A78BFA] border border-[#7C5CFC]/40 text-xs font-semibold mb-3">
              <Sparkles className="w-3.5 h-3.5" />
              <span>Student Learning Center</span>
            </div>
            <h1 className="text-3xl font-extrabold text-white tracking-tight">
              Welcome back, {user?.firstName || 'Developer'}!
            </h1>
            <p className="text-sm text-[#94A3B8] mt-1.5 max-w-xl leading-relaxed">
              You are on track to achieve your weekly coding target. Pick up where you left off or explore new AI-recommended topics.
            </p>
          </div>

          <div className="flex items-center gap-3">
            <Link to="/courses">
              <Button variant="secondary" size="sm" leftIcon={<BookOpen className="w-4 h-4" />}>
                Browse Catalog
              </Button>
            </Link>
            <Link to="/ai-recommendations">
              <Button variant="primary" size="sm" rightIcon={<ArrowRight className="w-4 h-4" />}>
                AI Path
              </Button>
            </Link>
          </div>
        </div>
      </div>

      {/* Metrics Row */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatCard
          title="Enrolled Courses"
          value="4 Courses"
          change="+1 this week"
          trend="up"
          subtitle="2 in progress"
          icon={<GraduationCap className="w-6 h-6" />}
        />
        <StatCard
          title="Learning Streak"
          value="5 Days"
          change="New record"
          trend="up"
          subtitle="Goal: 7 days"
          icon={<Flame className="w-6 h-6 text-[#F59E0B]" />}
          iconBg="bg-[#F59E0B]/15 text-[#F59E0B] border-[#F59E0B]/30"
        />
        <StatCard
          title="Hours Learned"
          value="24.5 hrs"
          change="+4.2 hrs"
          trend="up"
          subtitle="This month"
          icon={<Clock className="w-6 h-6 text-[#38BDF8]" />}
          iconBg="bg-[#38BDF8]/15 text-[#38BDF8] border-[#38BDF8]/30"
        />
        <StatCard
          title="AI Skill Match"
          value="92%"
          change="+8% gap closed"
          trend="up"
          subtitle="Target: Full-Stack React"
          icon={<Sparkles className="w-6 h-6 text-[#A78BFA]" />}
        />
      </div>

      {/* Phase 8 preview callout */}
      <div className="p-6 rounded-2xl bg-[#151C31] border border-[#27324A] text-center space-y-3">
        <div className="w-12 h-12 rounded-xl bg-[#7C5CFC]/20 text-[#A78BFA] border border-[#7C5CFC]/40 flex items-center justify-center mx-auto">
          <BookOpen className="w-6 h-6" />
        </div>
        <h3 className="text-base font-semibold text-white">Full Student Dashboard Coming in Phase 8</h3>
        <p className="text-xs text-[#CBD5E1] max-w-lg mx-auto">
          Phase 8 will connect this dashboard with live database endpoints for active enrollments, weekly learning charts via Recharts, and personalized recommendation widgets.
        </p>
        <div className="pt-2">
          <Link to="/design-system">
            <Button variant="outline" size="sm">
              Explore Design System Showcase
            </Button>
          </Link>
        </div>
      </div>
    </div>
  );
}

export default Dashboard;
