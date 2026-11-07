import React from 'react';
import { useParams, Link } from 'react-router-dom';
import { ArrowLeft, CheckCircle2, ChevronRight, PlayCircle, BookOpen, Terminal } from 'lucide-react';
import Button from '../components/common/Button.jsx';
import Card from '../components/common/Card.jsx';
import Badge from '../components/common/Badge.jsx';

export function LearningWorkspace() {
  const { courseId } = useParams();

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between pb-4 border-b border-[#27324A]/60">
        <Link to="/courses" className="inline-flex items-center gap-1.5 text-xs text-[#CBD5E1] hover:text-white transition">
          <ArrowLeft className="w-3.5 h-3.5" /> Back to Course
        </Link>
        <Badge variant="purple" size="sm">Lesson 1 of 8</Badge>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Main Video & Content Area */}
        <div className="lg:col-span-2 space-y-4">
          <div className="aspect-video bg-[#10182B] rounded-2xl border border-[#27324A] flex flex-col items-center justify-center p-6 text-center relative overflow-hidden">
            <div className="absolute inset-0 bg-gradient-to-t from-[#0B1020]/90 to-transparent pointer-events-none" />
            <PlayCircle className="w-16 h-16 text-[#7C5CFC] hover:scale-110 transition cursor-pointer relative z-10" />
            <p className="text-sm font-semibold text-white mt-3 relative z-10">
              Video Player: Introduction to PostgreSQL Architecture
            </p>
            <p className="text-xs text-[#94A3B8] relative z-10">
              Interactive workspace implementation arriving in Phase 9.
            </p>
          </div>

          <div className="p-6 rounded-2xl bg-[#151C31] border border-[#27324A] space-y-3">
            <h3 className="text-lg font-bold text-white">1. Core Storage Engines & Buffer Cache</h3>
            <p className="text-xs text-[#CBD5E1] leading-relaxed">
              In this module, we examine how PostgreSQL reads and writes 8KB disk pages through shared memory buffers, utilizing LRU clock sweeps and the Write-Ahead Log (WAL) to ensure ACID compliance.
            </p>
            <div className="pt-2 flex items-center justify-between">
              <Button variant="secondary" size="sm">
                Previous Lesson
              </Button>
              <Button variant="primary" size="sm" rightIcon={<ChevronRight className="w-4 h-4" />}>
                Mark Complete & Next
              </Button>
            </div>
          </div>
        </div>

        {/* Sidebar Curriculum List */}
        <div className="p-4 rounded-2xl bg-[#151C31] border border-[#27324A] space-y-3">
          <h4 className="text-sm font-semibold text-white px-2">Course Curriculum</h4>
          <div className="space-y-1">
            {[
              { id: 1, title: '1. Architecture & Buffer Cache', active: true, duration: '14 min' },
              { id: 2, title: '2. WAL & Checkpointer Deep Dive', active: false, duration: '22 min' },
              { id: 3, title: '3. Execution Plans & Cost Models', active: false, duration: '18 min' },
              { id: 4, title: '4. B-Tree & Generalized Inverted Index', active: false, duration: '25 min' },
            ].map((lesson) => (
              <div
                key={lesson.id}
                className={`p-3 rounded-xl flex items-center justify-between text-xs cursor-pointer transition ${
                  lesson.active
                    ? 'bg-[#7C5CFC]/20 text-white border border-[#7C5CFC]/40'
                    : 'text-[#CBD5E1] hover:bg-[#10182B]'
                }`}
              >
                <div className="flex items-center gap-2 truncate">
                  <PlayCircle className={`w-4 h-4 ${lesson.active ? 'text-[#A78BFA]' : 'text-[#94A3B8]'}`} />
                  <span className="truncate">{lesson.title}</span>
                </div>
                <span className="text-[10px] text-[#94A3B8] font-mono shrink-0">{lesson.duration}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

export default LearningWorkspace;

