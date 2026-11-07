import React, { useState, useEffect } from 'react';
import { useParams, useSearchParams, Link } from 'react-router-dom';
import { useNotification } from '../contexts/NotificationContext.jsx';
import progressService from '../services/progressService.js';
import courseService from '../services/courseService.js';
import Button from '../components/common/Button.jsx';
import Badge from '../components/common/Badge.jsx';
import Card from '../components/common/Card.jsx';
import ProgressBar from '../components/common/ProgressBar.jsx';
import Modal from '../components/common/Modal.jsx';
import Spinner from '../components/feedback/Spinner.jsx';
import {
  ArrowLeft,
  ChevronLeft,
  ChevronRight,
  CheckCircle2,
  Play,
  Pause,
  Volume2,
  VolumeX,
  Maximize2,
  FileCode2,
  Download,
  ExternalLink,
  Copy,
  Check,
  Award,
  Menu,
  X,
  Terminal,
  Clock
} from 'lucide-react';

export function LearningWorkspace() {
  const { courseId } = useParams();
  const [searchParams, setSearchParams] = useSearchParams();
  const { toast } = useNotification();

  // State
  const [course, setCourse] = useState(null);
  const [enrollment, setEnrollment] = useState(null);
  const [lessons, setLessons] = useState([]);
  const [activeLesson, setActiveLesson] = useState(null);
  const [lessonDetails, setLessonDetails] = useState(null);
  const [loading, setLoading] = useState(true);
  const [completing, setCompleting] = useState(false);
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [activeTab, setActiveTab] = useState('notes'); // 'notes', 'resources', 'ai'
  const [copiedCode, setCopiedCode] = useState(false);
  const [showCelebration, setShowCelebration] = useState(false);

  // Video player controls state
  const [isPlaying, setIsPlaying] = useState(false);
  const [isMuted, setIsMuted] = useState(false);
  const [videoProgress, setVideoProgress] = useState(25);
  const [playbackSpeed, setPlaybackSpeed] = useState(1);

  // Initial load: Fetch course progress & curriculum
  useEffect(() => {
    let isMounted = true;

    const loadWorkspace = async () => {
      try {
        setLoading(true);

        const [progressRes, courseRes] = await Promise.all([
          progressService.getCourseProgress(courseId),
          courseService.getCourseById(courseId),
        ]);

        if (!isMounted) return;

        setCourse(courseRes);
        setEnrollment(progressRes.enrollment);
        
        const fetchedLessons = progressRes.lessons || [];
        setLessons(fetchedLessons);

        // Determine starting lesson: query param or nextLesson or first
        const paramLessonId = searchParams.get('lessonId');
        let initialLesson = null;
        if (paramLessonId) {
          initialLesson = fetchedLessons.find((l) => l.id === paramLessonId);
        }
        if (!initialLesson) {
          initialLesson = progressRes.nextLesson || fetchedLessons[0] || null;
        }

        setActiveLesson(initialLesson);
      } catch (err) {
        console.error('Failed to load learning workspace:', err);
        toast.error(err.message || 'Unable to access course workspace.');
      } finally {
        if (isMounted) {
          setLoading(false);
        }
      }
    };

    loadWorkspace();

    return () => {
      isMounted = false;
    };
  }, [courseId, searchParams, toast]);

  // Load detailed lesson data when activeLesson changes
  useEffect(() => {
    let isMounted = true;
    if (!activeLesson?.id) return;

    const loadLessonDetails = async () => {
      try {
        const res = await courseService.getLessonById(activeLesson.id);
        if (isMounted) {
          setLessonDetails(res.data || res);
          setIsPlaying(false);
          setVideoProgress(activeLesson.completed ? 100 : 0);
        }
      } catch (err) {
        console.warn('Could not fetch granular lesson details, using cached syllabus:', err);
        if (isMounted) {
          setLessonDetails(activeLesson);
        }
      }
    };

    loadLessonDetails();

    return () => {
      isMounted = false;
    };
  }, [activeLesson]);

  // Switch active lesson handler
  const handleSelectLesson = (lesson) => {
    setActiveLesson(lesson);
    setSearchParams({ lessonId: lesson.id });
  };

  // Toggle lesson complete handler
  const handleToggleComplete = async () => {
    if (!activeLesson) return;

    const newCompleted = !activeLesson.completed;
    try {
      setCompleting(true);
      await progressService.toggleLesson(activeLesson.id, newCompleted);

      // Optimistically update local lessons list
      const updatedLessons = lessons.map((l) =>
        l.id === activeLesson.id ? { ...l, completed: newCompleted } : l
      );
      setLessons(updatedLessons);
      setActiveLesson((prev) => ({ ...prev, completed: newCompleted }));

      // Re-fetch updated overall course progress
      const progressRes = await progressService.getCourseProgress(courseId);
      setEnrollment(progressRes.enrollment);

      if (newCompleted) {
        toast.success(`"${activeLesson.title}" marked as complete!`);
        // Check if 100% course milestone achieved!
        if (progressRes.enrollment?.progressPercentage >= 100) {
          setShowCelebration(true);
        }
      } else {
        toast.info(`"${activeLesson.title}" marked as incomplete.`);
      }
    } catch (err) {
      toast.error(err.message || 'Failed to update lesson status');
    } finally {
      setCompleting(false);
    }
  };

  // Next / Previous navigation
  const currentIndex = lessons.findIndex((l) => l.id === activeLesson?.id);
  const hasPrevious = currentIndex > 0;
  const hasNext = currentIndex < lessons.length - 1;

  const handlePreviousLesson = () => {
    if (hasPrevious) {
      handleSelectLesson(lessons[currentIndex - 1]);
    }
  };

  const handleNextLesson = () => {
    if (hasNext) {
      handleSelectLesson(lessons[currentIndex + 1]);
    }
  };

  const handleCopyCode = (codeText) => {
    navigator.clipboard.writeText(codeText);
    setCopiedCode(true);
    setTimeout(() => setCopiedCode(false), 2000);
  };

  if (loading) {
    return (
      <div className="min-h-[70vh] flex flex-col items-center justify-center gap-3">
        <Spinner size="lg" color="purple" />
        <p className="text-xs text-[#94A3B8] font-mono">Initializing interactive workspace...</p>
      </div>
    );
  }

  const progressPercent = Math.round(enrollment?.progressPercentage || 0);

  // Sample code snippet for active lesson demonstration
  const sampleCodeSnippet = `// Production PostgreSQL Connection Pool & Query Execution
import pg from 'pg';
const { Pool } = pg;

export const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  max: 20, // Limit maximum client connections
  idleTimeoutMillis: 30000,
  connectionTimeoutMillis: 2000,
});

export async function executeOptimizedQuery(userId) {
  const query = \`
    SELECT id, title, progress_percentage 
    FROM enrollments 
    WHERE user_id = $1 AND status = 'active'
    ORDER BY last_accessed_at DESC;
  \`;
  const result = await pool.query(query, [userId]);
  return result.rows;
}`;

  return (
    <div className="space-y-6 pb-16">
      {/* Top Header Bar */}
      <div className="p-4 rounded-2xl bg-[#151C31] border border-[#27324A] flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="flex items-center gap-3 min-w-0">
          <Link
            to={`/courses/${courseId}`}
            className="p-2 rounded-xl text-[#CBD5E1] hover:text-white hover:bg-[#10182B] transition shrink-0"
            title="Back to Course Details"
          >
            <ArrowLeft className="w-5 h-5" />
          </Link>

          <div className="min-w-0">
            <div className="flex items-center gap-2">
              <span className="text-[10px] font-mono uppercase tracking-wider text-[#A78BFA] px-2 py-0.5 rounded bg-[#7C5CFC]/15 border border-[#7C5CFC]/30">
                Lesson {currentIndex + 1} of {lessons.length}
              </span>
              <span className="text-xs text-[#94A3B8] hidden md:inline truncate">
                {course?.title}
              </span>
            </div>
            <h1 className="text-base sm:text-lg font-bold text-white truncate mt-0.5">
              {activeLesson?.title || 'Loading lesson...'}
            </h1>
          </div>
        </div>

        {/* Progress & Sidebar Toggle */}
        <div className="flex items-center gap-4 shrink-0">
          <div className="hidden sm:flex flex-col items-end gap-1 w-44">
            <div className="flex items-center justify-between w-full text-xs">
              <span className="text-[#94A3B8]">Overall Progress</span>
              <span className="font-mono font-bold text-[#A78BFA]">{progressPercent}%</span>
            </div>
            <ProgressBar value={progressPercent} size="xs" variant={progressPercent === 100 ? 'green' : 'purple'} />
          </div>

          <Button
            variant="secondary"
            size="sm"
            onClick={() => setSidebarOpen(!sidebarOpen)}
            leftIcon={sidebarOpen ? <X className="w-4 h-4" /> : <Menu className="w-4 h-4" />}
          >
            {sidebarOpen ? 'Hide Syllabus' : 'Curriculum'}
          </Button>
        </div>
      </div>

      {/* Main Workspace Grid (Video + Content Left, Curriculum Sidebar Right) */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 items-start">
        {/* Left Column: Video Player, Action Navigation, and Content Tabs */}
        <div className={sidebarOpen ? 'lg:col-span-2 space-y-6' : 'lg:col-span-3 space-y-6'}>
          {/* 1. Interactive Video Player */}
          <div className="relative aspect-video bg-[#0B1020] rounded-2xl border border-[#27324A] overflow-hidden shadow-2xl flex flex-col justify-between group">
            {/* Ambient background glow */}
            <div className="absolute inset-0 bg-gradient-to-t from-[#0B1020] via-transparent to-black/40 pointer-events-none" />

            {/* Video Player Display */}
            <div className="absolute inset-0 flex flex-col items-center justify-center p-6 text-center">
              <div
                onClick={() => setIsPlaying(!isPlaying)}
                className="w-20 h-20 rounded-full bg-[#7C5CFC]/30 border border-[#7C5CFC]/60 backdrop-blur-md flex items-center justify-center cursor-pointer group-hover:scale-110 transition-transform shadow-2xl shadow-[#7C5CFC]/40"
              >
                {isPlaying ? (
                  <Pause className="w-8 h-8 text-white fill-white" />
                ) : (
                  <Play className="w-8 h-8 text-white fill-white ml-1" />
                )}
              </div>
              <p className="text-sm font-semibold text-white mt-4 tracking-tight drop-shadow-md">
                {activeLesson?.title}
              </p>
              <p className="text-xs text-[#CBD5E1] mt-1 font-mono drop-shadow">
                {activeLesson?.duration_minutes || 15} minutes • High Definition 1080p
              </p>
            </div>

            {/* Top Video Overlay Bar */}
            <div className="relative z-10 p-4 flex items-center justify-between opacity-0 group-hover:opacity-100 transition-opacity duration-200">
              <Badge variant="purple" size="xs">
                CodeCraft Video Studio
              </Badge>
              <span className="text-xs font-mono text-[#CBD5E1] bg-black/60 px-2 py-1 rounded backdrop-blur-md border border-[#27324A]">
                {playbackSpeed}x Speed
              </span>
            </div>

            {/* Bottom Video Controls Overlay */}
            <div className="relative z-10 p-4 bg-gradient-to-t from-[#0B1020] to-transparent space-y-2 opacity-90 group-hover:opacity-100 transition-opacity">
              {/* Timeline scrubber bar */}
              <div
                className="w-full bg-[#27324A]/80 h-1.5 rounded-full overflow-hidden cursor-pointer hover:h-2 transition-all"
                onClick={(e) => {
                  const rect = e.currentTarget.getBoundingClientRect();
                  const clickPos = (e.clientX - rect.left) / rect.width;
                  setVideoProgress(Math.round(clickPos * 100));
                }}
              >
                <div
                  className="bg-gradient-to-r from-[#7C5CFC] to-[#A78BFA] h-full rounded-full transition-all"
                  style={{ width: `${videoProgress}%` }}
                />
              </div>

              {/* Control Buttons */}
              <div className="flex items-center justify-between text-xs text-[#CBD5E1]">
                <div className="flex items-center gap-3">
                  <button
                    onClick={() => setIsPlaying(!isPlaying)}
                    className="p-1 hover:text-white transition"
                    aria-label={isPlaying ? 'Pause' : 'Play'}
                  >
                    {isPlaying ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4" />}
                  </button>

                  <button
                    onClick={() => setIsMuted(!isMuted)}
                    className="p-1 hover:text-white transition"
                    aria-label={isMuted ? 'Unmute' : 'Mute'}
                  >
                    {isMuted ? <VolumeX className="w-4 h-4 text-[#EF4444]" /> : <Volume2 className="w-4 h-4" />}
                  </button>

                  <span className="font-mono text-[11px] text-[#94A3B8]">
                    {Math.floor((videoProgress / 100) * (activeLesson?.duration_minutes || 15))}:00 / {activeLesson?.duration_minutes || 15}:00
                  </span>
                </div>

                <div className="flex items-center gap-3">
                  <button
                    onClick={() => {
                      const speeds = [1, 1.25, 1.5, 2];
                      const next = speeds[(speeds.indexOf(playbackSpeed) + 1) % speeds.length];
                      setPlaybackSpeed(next);
                    }}
                    className="font-mono text-xs px-2 py-0.5 rounded bg-[#10182B] hover:text-white border border-[#27324A] transition"
                  >
                    {playbackSpeed}x
                  </button>

                  <button
                    onClick={() => toast.info('Fullscreen player activated')}
                    className="p-1 hover:text-white transition"
                    aria-label="Fullscreen"
                  >
                    <Maximize2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            </div>
          </div>

          {/* 2. Lesson Navigation & Complete Toggle Action Bar */}
          <div className="p-4 rounded-2xl bg-[#151C31] border border-[#27324A] flex flex-wrap items-center justify-between gap-3">
            <Button
              variant="secondary"
              size="sm"
              disabled={!hasPrevious}
              onClick={handlePreviousLesson}
              leftIcon={<ChevronLeft className="w-4 h-4" />}
            >
              Previous Lesson
            </Button>

            {/* Central "Mark as Complete" Action */}
            <Button
              variant={activeLesson?.completed ? 'success' : 'primary'}
              size="md"
              loading={completing}
              onClick={handleToggleComplete}
              leftIcon={<CheckCircle2 className="w-4 h-4" />}
            >
              {activeLesson?.completed ? 'Lesson Completed ✓' : 'Mark as Complete'}
            </Button>

            <Button
              variant="secondary"
              size="sm"
              disabled={!hasNext}
              onClick={handleNextLesson}
              rightIcon={<ChevronRight className="w-4 h-4" />}
            >
              Next Lesson
            </Button>
          </div>

          {/* 3. Lesson Content Tabs (Notes, Resources, Code) */}
          <Card className="bg-[#151C31] border-[#27324A]">
            {/* Tab Headers */}
            <div className="flex items-center gap-4 px-6 pt-4 border-b border-[#27324A]/60">
              <button
                onClick={() => setActiveTab('notes')}
                className={`pb-3 text-xs font-semibold tracking-wide border-b-2 transition cursor-pointer ${
                  activeTab === 'notes'
                    ? 'border-[#7C5CFC] text-white'
                    : 'border-transparent text-[#94A3B8] hover:text-white'
                }`}
              >
                Lesson Notes & Architecture
              </button>
              <button
                onClick={() => setActiveTab('code')}
                className={`pb-3 text-xs font-semibold tracking-wide border-b-2 transition cursor-pointer ${
                  activeTab === 'code'
                    ? 'border-[#7C5CFC] text-white'
                    : 'border-transparent text-[#94A3B8] hover:text-white'
                }`}
              >
                Code Snippet Sandbox
              </button>
              <button
                onClick={() => setActiveTab('resources')}
                className={`pb-3 text-xs font-semibold tracking-wide border-b-2 transition cursor-pointer ${
                  activeTab === 'resources'
                    ? 'border-[#7C5CFC] text-white'
                    : 'border-transparent text-[#94A3B8] hover:text-white'
                }`}
              >
                Resources & Downloads
              </button>
            </div>

            {/* Tab Content */}
            <div className="p-6">
              {activeTab === 'notes' && (
                <div className="space-y-4 text-xs sm:text-sm text-[#CBD5E1] leading-relaxed">
                  <h3 className="text-base font-bold text-white tracking-tight">
                    {activeLesson?.title}
                  </h3>
                  <p>
                    {lessonDetails?.content_text || activeLesson?.description ||
                      'In this module, you will examine the foundational architecture and optimization mechanics necessary to construct scalable and reliable systems.'}
                  </p>
                  <p>
                    Key principles covered in this session include query plan analysis, index selection, connection management under heavy loads, and proper serialization isolation.
                  </p>

                  <div className="p-4 rounded-xl bg-[#10182B] border border-[#27324A] space-y-2 mt-4">
                    <h4 className="text-xs font-bold text-[#A78BFA] uppercase tracking-wider flex items-center gap-1.5">
                      <Terminal className="w-4 h-4" /> Module Checklist
                    </h4>
                    <ul className="space-y-1 text-xs text-[#CBD5E1]">
                      <li className="flex items-center gap-2">
                        <CheckCircle2 className="w-3.5 h-3.5 text-[#22C55E]" />
                        <span>Understand disk page buffer caching and shared memory</span>
                      </li>
                      <li className="flex items-center gap-2">
                        <CheckCircle2 className="w-3.5 h-3.5 text-[#22C55E]" />
                        <span>Identify performance bottlenecks using execution explain plans</span>
                      </li>
                      <li className="flex items-center gap-2">
                        <CheckCircle2 className="w-3.5 h-3.5 text-[#22C55E]" />
                        <span>Apply zero-downtime database migration principles</span>
                      </li>
                    </ul>
                  </div>
                </div>
              )}

              {activeTab === 'code' && (
                <div className="space-y-3">
                  <div className="flex items-center justify-between pb-2">
                    <span className="text-xs font-mono text-[#94A3B8]">example_pool.js</span>
                    <button
                      onClick={() => handleCopyCode(sampleCodeSnippet)}
                      className="inline-flex items-center gap-1.5 text-xs text-[#A78BFA] hover:text-white transition cursor-pointer"
                    >
                      {copiedCode ? <Check className="w-3.5 h-3.5 text-[#22C55E]" /> : <Copy className="w-3.5 h-3.5" />}
                      <span>{copiedCode ? 'Copied!' : 'Copy Code'}</span>
                    </button>
                  </div>
                  <pre className="p-4 rounded-xl bg-[#10182B] border border-[#27324A] font-mono text-xs text-[#CBD5E1] overflow-x-auto leading-relaxed">
                    <code>{sampleCodeSnippet}</code>
                  </pre>
                </div>
              )}

              {activeTab === 'resources' && (
                <div className="space-y-3">
                  {[
                    { name: 'PostgreSQL Architecture Slides (PDF)', size: '2.4 MB', type: 'PDF' },
                    { name: 'Source Code & Exercise Solutions (ZIP)', size: '14.8 MB', type: 'ZIP' },
                    { name: 'Official PostgreSQL Documentation Index', link: 'https://postgresql.org/docs', type: 'Link' },
                  ].map((res, i) => (
                    <div
                      key={i}
                      className="p-3.5 rounded-xl bg-[#10182B] border border-[#27324A] flex items-center justify-between hover:border-[#7C5CFC]/40 transition"
                    >
                      <div className="flex items-center gap-3">
                        <FileCode2 className="w-5 h-5 text-[#A78BFA]" />
                        <div>
                          <p className="text-xs font-semibold text-white">{res.name}</p>
                          <p className="text-[10px] text-[#94A3B8]">{res.size || 'External Link'}</p>
                        </div>
                      </div>
                      <Button
                        variant="secondary"
                        size="xs"
                        leftIcon={res.link ? <ExternalLink className="w-3.5 h-3.5" /> : <Download className="w-3.5 h-3.5" />}
                        onClick={() => toast.info(`Accessing ${res.name}...`)}
                      >
                        {res.link ? 'Visit Link' : 'Download'}
                      </Button>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </Card>
        </div>

        {/* Right Column: Curriculum Syllabus Sidebar */}
        {sidebarOpen && (
          <div className="lg:col-span-1 space-y-4 sticky top-20">
            <Card className="bg-[#151C31] border-[#27324A] overflow-hidden">
              <div className="p-4 border-b border-[#27324A]/60 flex items-center justify-between">
                <div>
                  <h3 className="text-sm font-bold text-white tracking-tight">Course Curriculum</h3>
                  <p className="text-[11px] text-[#94A3B8]">
                    {lessons.filter((l) => l.completed).length} of {lessons.length} completed
                  </p>
                </div>
                <Badge variant={progressPercent === 100 ? 'green' : 'purple'} size="xs">
                  {progressPercent}%
                </Badge>
              </div>

              {/* Lesson Items List */}
              <div className="divide-y divide-[#27324A]/40 max-h-[calc(100vh-14rem)] overflow-y-auto">
                {lessons.map((lesson, idx) => {
                  const isActive = activeLesson?.id === lesson.id;
                  const isDone = !!lesson.completed;

                  return (
                    <div
                      key={lesson.id}
                      onClick={() => handleSelectLesson(lesson)}
                      className={`p-3.5 flex items-start gap-3 transition cursor-pointer relative group ${
                        isActive
                          ? 'bg-[#7C5CFC]/20 text-white'
                          : 'hover:bg-[#10182B] text-[#CBD5E1]'
                      }`}
                    >
                      {isActive && (
                        <span className="absolute left-0 top-0 bottom-0 w-1 bg-[#7C5CFC]" />
                      )}

                      {/* Status indicator icon */}
                      <div className="mt-0.5 shrink-0">
                        {isDone ? (
                          <div className="w-5 h-5 rounded-full bg-[#22C55E]/20 text-[#22C55E] flex items-center justify-center">
                            <CheckCircle2 className="w-4 h-4" />
                          </div>
                        ) : (
                          <div
                            className={`w-5 h-5 rounded-full border flex items-center justify-center text-[10px] font-mono ${
                              isActive
                                ? 'border-[#7C5CFC] text-[#A78BFA] bg-[#7C5CFC]/30'
                                : 'border-[#27324A] text-[#94A3B8]'
                            }`}
                          >
                            {lesson.orderIndex || idx + 1}
                          </div>
                        )}
                      </div>

                      <div className="min-w-0 flex-1">
                        <p
                          className={`text-xs leading-snug truncate ${
                            isActive ? 'font-bold text-white' : 'font-medium'
                          }`}
                        >
                          {lesson.title}
                        </p>
                        <div className="flex items-center gap-2 mt-1 text-[10px] text-[#94A3B8]">
                          <span className="flex items-center gap-1 font-mono">
                            <Clock className="w-3 h-3" />
                            {lesson.durationMinutes || 15} min
                          </span>
                          {isDone && (
                            <span className="text-[#22C55E] font-medium">• Completed</span>
                          )}
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </Card>
          </div>
        )}
      </div>

      {/* Course Completion Celebration Modal */}
      <Modal
        isOpen={showCelebration}
        onClose={() => setShowCelebration(false)}
        title="Congratulations on Course Completion!"
        subtitle="You have completed 100% of the course curriculum."
        size="md"
        footer={
          <div className="flex items-center gap-3">
            <Button variant="secondary" size="sm" onClick={() => setShowCelebration(false)}>
              Keep Learning
            </Button>
            <Link to="/my-learning">
              <Button variant="primary" size="sm" leftIcon={<Award className="w-4 h-4" />}>
                View Certificate
              </Button>
            </Link>
          </div>
        }
      >
        <div className="text-center py-4 space-y-4">
          <div className="w-20 h-20 rounded-3xl bg-gradient-to-tr from-[#7C5CFC] to-[#22C55E] text-white flex items-center justify-center mx-auto shadow-2xl shadow-[#7C5CFC]/40 animate-purple-glow">
            <Award className="w-10 h-10" />
          </div>

          <h3 className="text-xl font-bold text-white">
            Official Milestone Achieved!
          </h3>

          <p className="text-xs text-[#CBD5E1] max-w-sm mx-auto leading-relaxed">
            You successfully finished all modules in <span className="font-semibold text-white">{course?.title}</span>. An official verifiable certificate has been issued to your profile.
          </p>
        </div>
      </Modal>
    </div>
  );
}

export default LearningWorkspace;
