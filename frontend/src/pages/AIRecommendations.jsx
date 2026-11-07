import React from 'react';
import { Sparkles, Brain, ArrowRight, Zap, Target, BookOpen } from 'lucide-react';
import Card, { CardHeader, CardTitle, CardDescription, CardContent } from '../components/common/Card.jsx';
import Badge from '../components/common/Badge.jsx';
import Button from '../components/common/Button.jsx';
import ProgressBar from '../components/common/ProgressBar.jsx';

export function AIRecommendations() {
  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="relative p-8 rounded-3xl bg-gradient-to-r from-[#151C31] via-[#1E2042] to-[#151C31] border border-[#27324A] overflow-hidden">
        <div className="absolute top-0 right-0 w-80 h-80 bg-[#7C5CFC]/20 rounded-full blur-3xl pointer-events-none" />

        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div>
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#7C5CFC]/20 text-[#A78BFA] border border-[#7C5CFC]/40 text-xs font-semibold mb-3">
              <Sparkles className="w-3.5 h-3.5" />
              <span>AI Personalized Learning Advisor</span>
            </div>
            <h1 className="text-3xl font-extrabold text-white tracking-tight">
              Skill Gap Analysis & Recommendations
            </h1>
            <p className="text-sm text-[#94A3B8] mt-1.5 max-w-xl leading-relaxed">
              Based on your completed courses, technical goals, and current progress, our AI engine has mapped out a structured learning pathway.
            </p>
          </div>

          <Button variant="primary" size="md" leftIcon={<Sparkles className="w-4 h-4" />}>
            Regenerate Analysis
          </Button>
        </div>
      </div>

      {/* Target Goal Breakdown */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card className="p-6 space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold uppercase tracking-wider text-[#94A3B8]">Target Role</span>
            <Badge variant="purple" size="xs">Goal</Badge>
          </div>
          <h3 className="text-xl font-bold text-white">Full-Stack React & Node Engineer</h3>
          <p className="text-xs text-[#CBD5E1]">
            Targeting production-ready proficiency across modern React 19 and scalable Node.js microservices.
          </p>
        </Card>

        <Card className="p-6 space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold uppercase tracking-wider text-[#94A3B8]">Overall Readiness</span>
            <span className="text-xs font-mono font-bold text-[#22C55E]">78% Match</span>
          </div>
          <ProgressBar value={78} variant="green" />
          <p className="text-xs text-[#94A3B8]">
            3 of 5 prerequisite core competency milestones verified.
          </p>
        </Card>

        <Card className="p-6 space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold uppercase tracking-wider text-[#94A3B8]">Identified Skill Gap</span>
            <Badge variant="yellow" size="xs">Needs Work</Badge>
          </div>
          <h3 className="text-xl font-bold text-white">Database Partitioning & WAL</h3>
          <p className="text-xs text-[#CBD5E1]">
            Recommended next course will close this gap in approximately 6 hours of hands-on learning.
          </p>
        </Card>
      </div>
    </div>
  );
}

export default AIRecommendations;
