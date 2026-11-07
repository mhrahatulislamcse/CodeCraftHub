import React from 'react';
import { BarChart3, Users, BookOpen, PlusCircle, Star } from 'lucide-react';
import StatCard from '../components/common/StatCard.jsx';
import Button from '../components/common/Button.jsx';
import Card from '../components/common/Card.jsx';
import Badge from '../components/common/Badge.jsx';

export function InstructorDashboard() {
  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-[#27324A]/60">
        <div>
          <h1 className="text-2xl font-bold text-white tracking-tight flex items-center gap-2">
            <BarChart3 className="w-6 h-6 text-[#F59E0B]" />
            Instructor Dashboard & Studio
          </h1>
          <p className="text-xs text-[#94A3B8] mt-1">
            Manage course curriculums, review student analytics, and publish new lessons.
          </p>
        </div>

        <Button variant="primary" size="sm" leftIcon={<PlusCircle className="w-4 h-4" />}>
          Create New Course
        </Button>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatCard
          title="Active Students"
          value="1,248"
          change="+18% this month"
          trend="up"
          icon={<Users className="w-6 h-6 text-[#A78BFA]" />}
        />
        <StatCard
          title="Published Courses"
          value="6 Courses"
          change="All live"
          trend="neutral"
          icon={<BookOpen className="w-6 h-6 text-[#22C55E]" />}
          iconBg="bg-[#22C55E]/15 text-[#22C55E] border-[#22C55E]/30"
        />
        <StatCard
          title="Average Rating"
          value="4.92 / 5"
          change="340 reviews"
          trend="up"
          icon={<Star className="w-6 h-6 text-[#F59E0B]" />}
          iconBg="bg-[#F59E0B]/15 text-[#F59E0B] border-[#F59E0B]/30"
        />
        <StatCard
          title="Completion Rate"
          value="76.4%"
          change="+4.1%"
          trend="up"
          icon={<BarChart3 className="w-6 h-6 text-[#38BDF8]" />}
          iconBg="bg-[#38BDF8]/15 text-[#38BDF8] border-[#38BDF8]/30"
        />
      </div>

      <div className="p-8 rounded-2xl bg-[#151C31] border border-[#27324A] text-center space-y-3">
        <h3 className="text-base font-semibold text-white">Curriculum Studio & Student Progress Monitor</h3>
        <p className="text-xs text-[#CBD5E1] max-w-lg mx-auto">
          Full instructor course authoring workflows and lesson markdown editors will be fully activated in Phase 11.
        </p>
      </div>
    </div>
  );
}

export default InstructorDashboard;

