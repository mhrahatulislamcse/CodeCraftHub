import React from 'react';
import { useParams, Link } from 'react-router-dom';
import { BookOpen, ArrowLeft, Clock, Award, CheckCircle2, Play } from 'lucide-react';
import Button from '../components/common/Button.jsx';
import Badge from '../components/common/Badge.jsx';

export function CourseDetails() {
  const { id } = useParams();

  return (
    <div className="space-y-6 max-w-5xl mx-auto">
      <Link to="/courses" className="inline-flex items-center gap-1.5 text-xs text-[#CBD5E1] hover:text-white transition">
        <ArrowLeft className="w-3.5 h-3.5" /> Back to Catalog
      </Link>

      <div className="p-8 rounded-3xl bg-[#151C31] border border-[#27324A] relative overflow-hidden space-y-6">
        <div className="flex items-center gap-2 flex-wrap">
          <Badge variant="purple">Database Architecture</Badge>
          <Badge variant="yellow">Intermediate</Badge>
        </div>

        <h1 className="text-3xl font-extrabold text-white tracking-tight">
          PostgreSQL Advanced Query Optimization & Internals
        </h1>

        <p className="text-sm text-[#CBD5E1] leading-relaxed max-w-3xl">
          Master transaction isolation levels, multiversion concurrency control (MVCC), explain plans, indexing strategies, and high-performance vacuuming.
        </p>

        <div className="flex items-center gap-6 text-xs text-[#94A3B8] pt-2">
          <span className="flex items-center gap-1.5">
            <Clock className="w-4 h-4 text-[#A78BFA]" /> 6h 30m total duration
          </span>
          <span className="flex items-center gap-1.5">
            <BookOpen className="w-4 h-4 text-[#A78BFA]" /> 18 structured lessons
          </span>
          <span className="flex items-center gap-1.5">
            <Award className="w-4 h-4 text-[#22C55E]" /> Verifiable Certificate
          </span>
        </div>

        <div className="pt-4 flex items-center gap-3">
          <Link to={`/learn/${id || 'demo'}`}>
            <Button variant="primary" size="md" leftIcon={<Play className="w-4 h-4" />}>
              Start Learning Now
            </Button>
          </Link>
          <Button variant="secondary" size="md">
            Save to Wishlist
          </Button>
        </div>
      </div>
    </div>
  );
}

export default CourseDetails;
