import React, { useState } from 'react';
import { useAuth } from '../contexts/AuthContext.jsx';
import { useNotification } from '../contexts/NotificationContext.jsx';
import Button from '../components/common/Button.jsx';
import Card, { CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from '../components/common/Card.jsx';
import Badge from '../components/common/Badge.jsx';
import Input from '../components/common/Input.jsx';
import Textarea from '../components/common/Textarea.jsx';
import Select from '../components/common/Select.jsx';
import Modal from '../components/common/Modal.jsx';
import ProgressBar from '../components/common/ProgressBar.jsx';
import StatCard from '../components/common/StatCard.jsx';
import CourseCard from '../components/cards/CourseCard.jsx';
import Spinner from '../components/feedback/Spinner.jsx';
import {
  Sparkles,
  Flame,
  Clock,
  BookOpen,
  Mail,
  Lock,
  Search,
  CheckCircle2,
  AlertTriangle,
  Play,
  Terminal,
  Layers,
  Palette,
  ShieldCheck,
  Send,
  Trash2,
  Cpu,
  GraduationCap
} from 'lucide-react';

export function DesignSystemShowcase() {
  const { role, switchMockRole, user } = useAuth();
  const { toast } = useNotification();

  // Component state toggles for interactive preview
  const [btnLoading, setBtnLoading] = useState(false);
  const [progressVal, setProgressVal] = useState(68);
  const [modalOpen, setModalOpen] = useState(false);
  const [dangerModalOpen, setDangerModalOpen] = useState(false);
  const [courseEnrolled, setCourseEnrolled] = useState(true);
  const [sampleInputValue, setSampleInputValue] = useState('');

  // Sample course card preview data
  const sampleCourse = {
    id: 'demo-course-1',
    title: 'PostgreSQL Advanced Indexing and Query Optimization',
    description: 'Master B-tree indexes, execution plans (EXPLAIN ANALYZE), partitioning, and connection pooling in high-throughput applications.',
    difficulty: 'Intermediate',
    categoryName: 'Database Architecture',
    instructorName: 'Sarah Drasner',
    rating: 4.9,
    reviewsCount: 142,
    totalDurationMinutes: 380,
    totalLessons: 18,
    thumbnailUrl: null,
  };

  const paletteColors = [
    { name: 'Dark Navy (Background)', hex: '#0B1020', bg: 'bg-[#0B1020]', border: 'border-[#27324A]' },
    { name: 'Surface Navy', hex: '#151C31', bg: 'bg-[#151C31]', border: 'border-[#27324A]' },
    { name: 'Input Navy', hex: '#10182B', bg: 'bg-[#10182B]', border: 'border-[#27324A]' },
    { name: 'Electric Purple (Primary)', hex: '#7C5CFC', bg: 'bg-[#7C5CFC]', text: 'text-white' },
    { name: 'Light Purple (Secondary)', hex: '#A78BFA', bg: 'bg-[#A78BFA]', text: 'text-slate-900' },
    { name: 'Border Slate Navy', hex: '#27324A', bg: 'bg-[#27324A]', text: 'text-white' },
    { name: 'Success Emerald', hex: '#22C55E', bg: 'bg-[#22C55E]', text: 'text-white' },
    { name: 'Warning Amber', hex: '#F59E0B', bg: 'bg-[#F59E0B]', text: 'text-slate-900' },
    { name: 'Error Rose', hex: '#EF4444', bg: 'bg-[#EF4444]', text: 'text-white' },
  ];

  return (
    <div className="space-y-12 pb-16">
      {/* Header banner */}
      <div className="relative p-8 rounded-3xl bg-gradient-to-r from-[#151C31] via-[#1A233D] to-[#151C31] border border-[#27324A] overflow-hidden">
        <div className="absolute top-0 right-0 w-80 h-80 bg-[#7C5CFC]/15 rounded-full blur-3xl pointer-events-none" />
        
        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div>
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#7C5CFC]/20 text-[#A78BFA] border border-[#7C5CFC]/40 text-xs font-semibold mb-3">
              <Sparkles className="w-3.5 h-3.5" />
              <span>Phase 7 Design System & Component Library</span>
            </div>
            <h1 className="text-3xl font-extrabold text-white tracking-tight">
              CodeCraftHub UI Foundation
            </h1>
            <p className="text-sm text-[#94A3B8] mt-1.5 max-w-2xl leading-relaxed">
              Living design system specification featuring Dark Navy (<code className="text-[#A78BFA]">#0B1020</code>) and Electric Purple (<code className="text-[#A78BFA]">#7C5CFC</code>) design tokens, reusable atomic components, and role simulation.
            </p>
          </div>

          {/* Quick role simulator */}
          <div className="p-3 rounded-2xl bg-[#10182B] border border-[#27324A] shrink-0">
            <p className="text-[10px] uppercase font-bold text-[#94A3B8] mb-2">Simulate Active Role:</p>
            <div className="flex items-center gap-2">
              {['student', 'instructor', 'admin'].map((r) => (
                <button
                  key={r}
                  onClick={() => {
                    switchMockRole(r);
                    toast.info(`Switched active view role to ${r.toUpperCase()}`);
                  }}
                  className={`text-xs px-3 py-1.5 rounded-lg capitalize font-medium transition ${
                    role === r
                      ? 'bg-[#7C5CFC] text-white shadow-md shadow-[#7C5CFC]/30'
                      : 'bg-[#151C31] text-[#CBD5E1] hover:text-white border border-[#27324A]'
                  }`}
                >
                  {r}
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* SECTION 1: Color Palette & Design Tokens */}
      <section className="space-y-4">
        <div className="flex items-center gap-2 pb-2 border-b border-[#27324A]/60">
          <Palette className="w-5 h-5 text-[#A78BFA]" />
          <h2 className="text-lg font-bold text-white tracking-tight">1. Color Palette & Design Tokens</h2>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4">
          {paletteColors.map((color, i) => (
            <div
              key={i}
              className="p-3.5 rounded-2xl bg-[#151C31] border border-[#27324A] flex flex-col justify-between h-28"
            >
              <div className={`w-full h-10 rounded-xl ${color.bg} ${color.border || ''} shadow-inner flex items-center justify-center font-mono text-[10px] ${color.text || 'text-white'}`}>
                {color.hex}
              </div>
              <div>
                <p className="text-xs font-semibold text-[#F8FAFC] truncate">{color.name}</p>
                <p className="text-[10px] font-mono text-[#94A3B8]">{color.hex}</p>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* SECTION 2: Buttons & Loading States */}
      <section className="space-y-4">
        <div className="flex items-center justify-between pb-2 border-b border-[#27324A]/60">
          <div className="flex items-center gap-2">
            <Layers className="w-5 h-5 text-[#A78BFA]" />
            <h2 className="text-lg font-bold text-white tracking-tight">2. Buttons & States</h2>
          </div>
          <Button
            variant="outline"
            size="xs"
            onClick={() => setBtnLoading(!btnLoading)}
          >
            Toggle Loading State: {btnLoading ? 'ON' : 'OFF'}
          </Button>
        </div>

        <div className="space-y-6 bg-[#151C31] p-6 rounded-2xl border border-[#27324A]">
          {/* Variants */}
          <div>
            <p className="text-xs font-semibold text-[#94A3B8] uppercase mb-3">Variants</p>
            <div className="flex items-center gap-3 flex-wrap">
              <Button variant="primary" loading={btnLoading}>
                Primary Button
              </Button>
              <Button variant="secondary" loading={btnLoading}>
                Secondary Button
              </Button>
              <Button variant="outline" loading={btnLoading}>
                Outline Button
              </Button>
              <Button variant="ghost" loading={btnLoading}>
                Ghost Button
              </Button>
              <Button variant="danger" loading={btnLoading}>
                Danger Button
              </Button>
              <Button variant="success" loading={btnLoading}>
                Success Button
              </Button>
              <Button variant="primary" disabled>
                Disabled
              </Button>
            </div>
          </div>

          {/* Sizes */}
          <div>
            <p className="text-xs font-semibold text-[#94A3B8] uppercase mb-3">Sizes</p>
            <div className="flex items-center gap-3 flex-wrap items-end">
              <Button size="xs" variant="primary">
                Button XS
              </Button>
              <Button size="sm" variant="primary">
                Button SM
              </Button>
              <Button size="md" variant="primary">
                Button MD
              </Button>
              <Button size="lg" variant="primary">
                Button LG
              </Button>
            </div>
          </div>

          {/* With Icons */}
          <div>
            <p className="text-xs font-semibold text-[#94A3B8] uppercase mb-3">With Icons</p>
            <div className="flex items-center gap-3 flex-wrap">
              <Button variant="primary" leftIcon={<Sparkles className="w-4 h-4" />}>
                Generate AI Path
              </Button>
              <Button variant="secondary" leftIcon={<Terminal className="w-4 h-4" />}>
                Run Code Sandbox
              </Button>
              <Button variant="outline" rightIcon={<Play className="w-4 h-4" />}>
                Resume Lesson
              </Button>
              <Button variant="danger" leftIcon={<Trash2 className="w-4 h-4" />}>
                Delete Item
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* SECTION 3: Badges */}
      <section className="space-y-4">
        <div className="flex items-center gap-2 pb-2 border-b border-[#27324A]/60">
          <ShieldCheck className="w-5 h-5 text-[#A78BFA]" />
          <h2 className="text-lg font-bold text-white tracking-tight">3. Badges & Tags</h2>
        </div>

        <div className="bg-[#151C31] p-6 rounded-2xl border border-[#27324A] space-y-4">
          <div className="flex items-center gap-3 flex-wrap">
            <Badge variant="purple">Purple / Default</Badge>
            <Badge variant="green">Green / Active</Badge>
            <Badge variant="yellow">Yellow / Pending</Badge>
            <Badge variant="red">Red / Expired</Badge>
            <Badge variant="blue">Blue / Info</Badge>
            <Badge variant="neutral">Neutral</Badge>
          </div>

          <div className="flex items-center gap-3 flex-wrap pt-2">
            <Badge variant="purple" dot>
              With Dot (Purple)
            </Badge>
            <Badge variant="green" dot>
              With Dot (Green)
            </Badge>
            <Badge variant="yellow" dot>
              With Dot (Yellow)
            </Badge>
            <Badge variant="red" dot>
              With Dot (Red)
            </Badge>
            <Badge variant="purple" size="xs">
              Extra Small (XS)
            </Badge>
            <Badge variant="purple" size="md">
              Medium (MD)
            </Badge>
          </div>
        </div>
      </section>

      {/* SECTION 4: Inputs and Form Controls */}
      <section className="space-y-4">
        <div className="flex items-center gap-2 pb-2 border-b border-[#27324A]/60">
          <Mail className="w-5 h-5 text-[#A78BFA]" />
          <h2 className="text-lg font-bold text-white tracking-tight">4. Form Inputs & Controls</h2>
        </div>

        <div className="bg-[#151C31] p-6 rounded-2xl border border-[#27324A] grid grid-cols-1 md:grid-cols-2 gap-6">
          <Input
            label="Standard Input"
            placeholder="e.g. Marcus Vance"
            helperText="Enter your full legal or display name"
          />

          <Input
            label="Email with Icon"
            placeholder="developer@codecrafthub.dev"
            leftIcon={<Mail className="w-4 h-4" />}
            value={sampleInputValue}
            onChange={(e) => setSampleInputValue(e.target.value)}
          />

          <Input
            label="Password Field with Error State"
            type="password"
            placeholder="••••••••"
            leftIcon={<Lock className="w-4 h-4" />}
            error="Password must contain at least 8 characters with a number"
          />

          <Select
            label="Category Dropdown"
            options={[
              { value: 'db', label: 'Database & SQL Engineering' },
              { value: 'fe', label: 'Frontend & Reactive UI' },
              { value: 'be', label: 'Backend Architecture & APIs' },
              { value: 'devops', label: 'DevOps & Cloud Deployments' },
            ]}
          />

          <div className="md:col-span-2">
            <Textarea
              label="Course Description or Learning Objectives"
              placeholder="Detail the modules, prerequisites, and key competencies covered in this track..."
              rows={3}
              helperText="Markdown syntax is supported in lesson content."
            />
          </div>
        </div>
      </section>

      {/* SECTION 5: StatCards (Metrics) */}
      <section className="space-y-4">
        <div className="flex items-center gap-2 pb-2 border-b border-[#27324A]/60">
          <Cpu className="w-5 h-5 text-[#A78BFA]" />
          <h2 className="text-lg font-bold text-white tracking-tight">5. Dashboard StatCards</h2>
        </div>

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
            change="New record!"
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
            subtitle="Top 15% of learners"
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
      </section>

      {/* SECTION 6: Course Card & Progress */}
      <section className="space-y-4">
        <div className="flex items-center justify-between pb-2 border-b border-[#27324A]/60">
          <div className="flex items-center gap-2">
            <BookOpen className="w-5 h-5 text-[#A78BFA]" />
            <h2 className="text-lg font-bold text-white tracking-tight">6. Course Card & Progress Bar</h2>
          </div>
          <Button
            variant="outline"
            size="xs"
            onClick={() => setCourseEnrolled(!courseEnrolled)}
          >
            Toggle Enrolled State: {courseEnrolled ? 'Enrolled' : 'Not Enrolled'}
          </Button>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Live CourseCard Preview */}
          <div className="lg:col-span-1">
            <CourseCard
              course={sampleCourse}
              progress={courseEnrolled ? progressVal : null}
              onContinue={() => toast.success('Navigating to lesson workspace...')}
              onEnroll={() => {
                setCourseEnrolled(true);
                toast.success('Successfully enrolled in PostgreSQL course!');
              }}
              onViewDetails={() => toast.info('Navigating to course details...')}
            />
          </div>

          {/* Progress Bar interactive tester */}
          <div className="lg:col-span-2 bg-[#151C31] p-6 rounded-2xl border border-[#27324A] flex flex-col justify-between">
            <div>
              <h3 className="text-base font-semibold text-white">Dynamic Progress Bar Tester</h3>
              <p className="text-xs text-[#94A3B8] mt-1">
                Slide to test real-time visual progress rendering, labels, and state colors.
              </p>

              <div className="mt-6 space-y-6">
                <div>
                  <label className="text-xs font-semibold text-[#CBD5E1] block mb-2">
                    Interactive Progress: {progressVal}%
                  </label>
                  <input
                    type="range"
                    min="0"
                    max="100"
                    value={progressVal}
                    onChange={(e) => setProgressVal(Number(e.target.value))}
                    className="w-full accent-[#7C5CFC] cursor-pointer"
                  />
                </div>

                <div className="space-y-4 pt-2">
                  <ProgressBar value={progressVal} showLabel label="Electric Purple (Default)" variant="purple" />
                  <ProgressBar value={progressVal} showLabel label="Emerald Success (100% Milestone)" variant="green" />
                  <ProgressBar value={progressVal} showLabel label="Amber Warning / In Progress" variant="yellow" />
                </div>
              </div>
            </div>

            <div className="pt-6 border-t border-[#27324A]/40 flex items-center justify-between">
              <span className="text-xs text-[#94A3B8]">
                Formula: <code className="text-[#A78BFA] font-mono">progress_percentage = (completed / total) * 100</code>
              </span>
              <Button size="xs" variant="secondary" onClick={() => setProgressVal(100)}>
                Set 100% (Complete)
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* SECTION 7: Modals & Notification Toasts */}
      <section className="space-y-4">
        <div className="flex items-center gap-2 pb-2 border-b border-[#27324A]/60">
          <AlertTriangle className="w-5 h-5 text-[#A78BFA]" />
          <h2 className="text-lg font-bold text-white tracking-tight">7. Modals & Toast Feedback</h2>
        </div>

        <div className="bg-[#151C31] p-6 rounded-2xl border border-[#27324A] grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Modal triggers */}
          <div className="space-y-3">
            <h4 className="text-sm font-semibold text-white">Interactive Modal Dialogs</h4>
            <p className="text-xs text-[#94A3B8]">
              Accessible dialog with focus management, backdrop blur, and ESC key listener.
            </p>
            <div className="flex items-center gap-3 pt-2">
              <Button variant="secondary" size="sm" onClick={() => setModalOpen(true)}>
                Open Standard Modal
              </Button>
              <Button variant="danger" size="sm" onClick={() => setDangerModalOpen(true)}>
                Open Danger Dialog
              </Button>
            </div>
          </div>

          {/* Toast triggers */}
          <div className="space-y-3">
            <h4 className="text-sm font-semibold text-white">Floating Notification Toasts</h4>
            <p className="text-xs text-[#94A3B8]">
              Trigger transient messages that auto-dismiss after configurable timeouts.
            </p>
            <div className="flex items-center gap-2 flex-wrap pt-2">
              <Button
                variant="success"
                size="xs"
                onClick={() => toast.success('Lesson 3 marked as complete! +50 XP awarded.')}
              >
                Fire Success
              </Button>
              <Button
                variant="danger"
                size="xs"
                onClick={() => toast.error('Failed to save progress: Network timeout.')}
              >
                Fire Error
              </Button>
              <Button
                variant="outline"
                size="xs"
                onClick={() => toast.warning('Your learning streak will reset in 2 hours.')}
              >
                Fire Warning
              </Button>
              <Button
                variant="secondary"
                size="xs"
                onClick={() => toast.info('New course "React 19 Server Components" is now live!')}
              >
                Fire Info
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* Standard Modal Component */}
      <Modal
        isOpen={modalOpen}
        onClose={() => setModalOpen(false)}
        title="PostgreSQL Query Plan Analysis"
        subtitle="Detailed optimization breakdown for sequential scan on table 'lessons'"
        footer={
          <>
            <Button variant="secondary" size="sm" onClick={() => setModalOpen(false)}>
              Cancel
            </Button>
            <Button
              variant="primary"
              size="sm"
              onClick={() => {
                setModalOpen(false);
                toast.success('Optimization index applied successfully!');
              }}
            >
              Apply Recommended Index
            </Button>
          </>
        }
      >
        <p className="text-xs text-[#CBD5E1] leading-relaxed">
          The query planner detected a sequential scan on <code className="text-[#A78BFA] font-mono">lesson_progress</code> exceeding 45ms. We recommend creating a compound index on <code className="text-[#A78BFA] font-mono">(enrollment_id, lesson_id)</code> to achieve constant-time index lookups.
        </p>

        <div className="p-3 rounded-xl bg-[#10182B] border border-[#27324A] font-mono text-[11px] text-[#22C55E]">
          CREATE INDEX idx_lesson_progress_lookup ON lesson_progress (enrollment_id, lesson_id);
        </div>
      </Modal>

      {/* Danger Modal Component */}
      <Modal
        isOpen={dangerModalOpen}
        onClose={() => setDangerModalOpen(false)}
        title="Confirm Enrollment Cancellation"
        subtitle="This action cannot be undone."
        size="sm"
        footer={
          <>
            <Button variant="secondary" size="sm" onClick={() => setDangerModalOpen(false)}>
              Keep Enrolled
            </Button>
            <Button
              variant="danger"
              size="sm"
              onClick={() => {
                setDangerModalOpen(false);
                setCourseEnrolled(false);
                toast.error('Enrollment removed.');
              }}
            >
              Confirm Disenroll
            </Button>
          </>
        }
      >
        <p className="text-xs text-[#EF4444] leading-relaxed">
          Cancelling your enrollment will pause your current completion streak and clear pending certificate verification hashes.
        </p>
      </Modal>
    </div>
  );
}

export default DesignSystemShowcase;

