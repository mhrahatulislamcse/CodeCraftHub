import React, { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext.jsx';
import { useNotification } from '../contexts/NotificationContext.jsx';
import courseService from '../services/courseService.js';
import Card, { CardHeader, CardTitle, CardContent } from '../components/common/Card.jsx';
import Badge from '../components/common/Badge.jsx';
import Button from '../components/common/Button.jsx';
import ProgressBar from '../components/common/ProgressBar.jsx';
import Spinner from '../components/feedback/Spinner.jsx';
import {
  ArrowLeft,
  Clock,
  BookOpen,
  Award,
  CheckCircle2,
  Play,
  PlayCircle,
  Star,
  Users,
  ShieldCheck,
  Lock,
  ExternalLink,
  Globe,
  FileCode2,
  AlertCircle
} from 'lucide-react';

export function CourseDetails() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { isAuthenticated, user } = useAuth();
  const { toast } = useNotification();

  const [course, setCourse] = useState(null);
  const [loading, setLoading] = useState(true);
  const [enrolling, setEnrolling] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    let isMounted = true;

    const fetchCourse = async () => {
      try {
        setLoading(true);
        setError(null);
        const data = await courseService.getCourseById(id);
        if (isMounted) {
          setCourse(data);
        }
      } catch (err) {
        console.error('Failed to load course details:', err);
        if (isMounted) {
          setError(err.message || 'Course not found or unavailable');
        }
      } finally {
        if (isMounted) {
          setLoading(false);
        }
      }
    };

    fetchCourse();

    return () => {
      isMounted = false;
    };
  }, [id]);

  const handleEnroll = async () => {
    if (!isAuthenticated) {
      toast.info('Please sign in or create an account to enroll.');
      navigate('/login', { state: { from: { pathname: `/courses/${id}` } } });
      return;
    }

    try {
      setEnrolling(true);
      await courseService.enrollCourse(course.id);
      toast.success('Successfully enrolled in course! You can now access all lessons.');
      
      // Refresh course data to reflect enrollment status
      const updated = await courseService.getCourseById(id);
      setCourse(updated);
    } catch (err) {
      toast.error(err.message || 'Enrollment request failed');
    } finally {
      setEnrolling(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-[60vh] flex flex-col items-center justify-center gap-3">
        <Spinner size="lg" color="purple" />
        <p className="text-xs text-[#94A3B8] font-mono">Loading course syllabus and resources...</p>
      </div>
    );
  }

  if (error || !course) {
    return (
      <div className="p-8 rounded-3xl bg-[#151C31] border border-[#27324A] text-center space-y-4 max-w-xl mx-auto my-12">
        <div className="w-12 h-12 rounded-2xl bg-[#EF4444]/15 text-[#EF4444] flex items-center justify-center mx-auto">
          <AlertCircle className="w-6 h-6" />
        </div>
        <h3 className="text-xl font-bold text-white">Course Not Found</h3>
        <p className="text-xs text-[#CBD5E1] leading-relaxed">
          {error || 'The requested curriculum does not exist or may have been archived.'}
        </p>
        <Link to="/courses" className="inline-block pt-2">
          <Button variant="secondary" size="sm" leftIcon={<ArrowLeft className="w-4 h-4" />}>
            Back to Course Catalog
          </Button>
        </Link>
      </div>
    );
  }

  const isEnrolled = course.isEnrolled;
  const enrollment = course.enrollment;
  const progressPercentage = enrollment ? Number(enrollment.progress_percentage || 0) : 0;
  const lessons = course.lessons || [];
  const instructor = course.instructor || {};
  const skills = course.skills || [];
  const objectives = course.learning_objectives || [
    'Design and implement production-ready relational schemas',
    'Optimize query planner costs using B-Tree and GIN indexes',
    'Structure resilient database migrations with rollback safety',
    'Configure connection pools and query timeouts for high-concurrency workloads'
  ];

  const difficultyVariantMap = {
    beginner: 'green',
    intermediate: 'purple',
    advanced: 'red',
  };

  return (
    <div className="space-y-8 max-w-6xl mx-auto pb-16">
      {/* Breadcrumb Navigation */}
      <div className="flex items-center gap-2 text-xs text-[#94A3B8]">
        <Link to="/courses" className="hover:text-white transition flex items-center gap-1">
          <ArrowLeft className="w-3.5 h-3.5" /> Course Catalog
        </Link>
        <span>/</span>
        <span className="text-[#CBD5E1] truncate max-w-xs">{course.title}</span>
      </div>

      {/* Hero Card */}
      <div className="relative p-6 sm:p-10 rounded-3xl bg-gradient-to-r from-[#151C31] via-[#1A233D] to-[#151C31] border border-[#27324A] overflow-hidden space-y-6">
        <div className="absolute top-0 right-0 w-96 h-96 bg-[#7C5CFC]/15 rounded-full blur-3xl pointer-events-none" />

        {/* Badges */}
        <div className="relative z-10 flex items-center gap-2 flex-wrap">
          {course.categories?.[0] && (
            <Badge variant="purple" size="sm">
              {course.categories[0].name}
            </Badge>
          )}
          <Badge
            variant={difficultyVariantMap[course.difficulty_level?.toLowerCase()] || 'neutral'}
            size="sm"
          >
            {course.difficulty_level || 'Intermediate'}
          </Badge>
          <Badge variant="green" size="sm" dot>
            Verified Curriculum
          </Badge>
        </div>

        {/* Title & Description */}
        <div className="relative z-10 space-y-3">
          <h1 className="text-3xl sm:text-4xl font-extrabold text-white tracking-tight leading-tight max-w-4xl">
            {course.title}
          </h1>
          <p className="text-sm sm:text-base text-[#CBD5E1] leading-relaxed max-w-3xl">
            {course.description}
          </p>
        </div>

        {/* Metadata Pills */}
        <div className="relative z-10 flex flex-wrap items-center gap-6 text-xs text-[#94A3B8] pt-2">
          <span className="flex items-center gap-1.5 font-semibold text-white">
            <Star className="w-4 h-4 fill-[#F59E0B] text-[#F59E0B]" />
            <span>{Number(course.rating_average || 4.9).toFixed(1)}</span>
            <span className="text-[#94A3B8] font-normal">({course.rating_count || 48} reviews)</span>
          </span>

          <span className="flex items-center gap-1.5">
            <Clock className="w-4 h-4 text-[#A78BFA]" />
            <span>{course.estimated_hours ? `${course.estimated_hours}h estimated duration` : '6h 30m'}</span>
          </span>

          <span className="flex items-center gap-1.5">
            <BookOpen className="w-4 h-4 text-[#A78BFA]" />
            <span>{lessons.length} structured lessons</span>
          </span>

          <span className="flex items-center gap-1.5">
            <Award className="w-4 h-4 text-[#22C55E]" />
            <span>Verifiable Certificate on Completion</span>
          </span>
        </div>

        {/* Enrollment Action Bar */}
        <div className="relative z-10 pt-4 border-t border-[#27324A]/60 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          {isEnrolled ? (
            <div className="w-full flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div className="space-y-1">
                <div className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-[#22C55E]" />
                  <span className="text-xs font-semibold text-white">
                    You are enrolled in this track
                  </span>
                  <span className="text-[10px] text-[#94A3B8]">
                    ({progressPercentage}% completed)
                  </span>
                </div>
                <div className="w-64 pt-1">
                  <ProgressBar value={progressPercentage} size="xs" variant={progressPercentage === 100 ? 'green' : 'purple'} />
                </div>
              </div>

              <div className="flex items-center gap-3">
                <Link to={`/learn/${course.id}`}>
                  <Button variant="primary" size="md" leftIcon={<PlayCircle className="w-5 h-5" />}>
                    {progressPercentage === 100 ? 'Review Lessons' : 'Continue Learning'}
                  </Button>
                </Link>
              </div>
            </div>
          ) : (
            <div className="w-full flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div>
                <p className="text-xs text-[#94A3B8]">Full Lifetime Access</p>
                <p className="text-xl font-bold text-white flex items-center gap-2">
                  Free Platform Access
                  <span className="text-[10px] font-normal uppercase px-2 py-0.5 rounded bg-[#22C55E]/15 text-[#22C55E] border border-[#22C55E]/30">
                    Sponsored by CodeCraftHub
                  </span>
                </p>
              </div>

              <div className="flex items-center gap-3">
                <Button
                  variant="primary"
                  size="lg"
                  loading={enrolling}
                  onClick={handleEnroll}
                  leftIcon={<Play className="w-4 h-4" />}
                >
                  Enroll in Course
                </Button>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Main Grid: Syllabus & Details */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Left 2 Cols: Learning Objectives & Curriculum */}
        <div className="lg:col-span-2 space-y-8">
          {/* Learning Objectives */}
          <Card className="p-6 bg-[#151C31] border-[#27324A] space-y-4">
            <h3 className="text-base font-bold text-white tracking-tight flex items-center gap-2">
              <CheckCircle2 className="w-5 h-5 text-[#22C55E]" />
              What You&apos;ll Learn
            </h3>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-1">
              {objectives.map((obj, i) => (
                <div key={i} className="flex items-start gap-2.5 p-3 rounded-xl bg-[#10182B]/60 border border-[#27324A]/50 text-xs text-[#CBD5E1]">
                  <CheckCircle2 className="w-4 h-4 text-[#7C5CFC] shrink-0 mt-0.5" />
                  <span>{obj}</span>
                </div>
              ))}
            </div>
          </Card>

          {/* Curriculum Syllabus */}
          <Card className="p-6 bg-[#151C31] border-[#27324A] space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-base font-bold text-white tracking-tight flex items-center gap-2">
                  <FileCode2 className="w-5 h-5 text-[#A78BFA]" />
                  Course Curriculum
                </h3>
                <p className="text-xs text-[#94A3B8] mt-0.5">
                  {lessons.length} lessons designed to be completed in sequence
                </p>
              </div>
            </div>

            <div className="space-y-2 pt-2">
              {lessons.map((lesson, idx) => (
                <div
                  key={lesson.id}
                  className="p-4 rounded-xl bg-[#10182B] border border-[#27324A] hover:border-[#7C5CFC]/40 transition flex items-center justify-between gap-4 group"
                >
                  <div className="flex items-start gap-3 min-w-0">
                    <div className="w-7 h-7 rounded-lg bg-[#151C31] border border-[#27324A] flex items-center justify-center text-xs font-mono font-bold text-[#A78BFA] shrink-0">
                      {lesson.orderIndex || idx + 1}
                    </div>
                    <div className="min-w-0">
                      <h4 className="text-xs sm:text-sm font-semibold text-white group-hover:text-[#A78BFA] transition truncate">
                        {lesson.title}
                      </h4>
                      {lesson.description && (
                        <p className="text-xs text-[#94A3B8] mt-0.5 line-clamp-1">
                          {lesson.description}
                        </p>
                      )}
                    </div>
                  </div>

                  <div className="flex items-center gap-3 shrink-0">
                    <span className="text-xs text-[#94A3B8] font-mono">
                      {lesson.durationMinutes || 15} min
                    </span>

                    {lesson.isFreePreview ? (
                      <Badge variant="purple" size="xs">
                        Free Preview
                      </Badge>
                    ) : isEnrolled ? (
                      <PlayCircle className="w-4 h-4 text-[#22C55E]" />
                    ) : (
                      <Lock className="w-3.5 h-3.5 text-[#94A3B8]" />
                    )}
                  </div>
                </div>
              ))}
            </div>
          </Card>
        </div>

        {/* Right 1 Col: Instructor & Skills Meta */}
        <div className="space-y-6">
          {/* Instructor Card */}
          <Card className="p-6 bg-[#151C31] border-[#27324A] space-y-4">
            <h4 className="text-xs font-semibold uppercase tracking-wider text-[#94A3B8]">
              Course Instructor
            </h4>

            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-[#7C5CFC] to-[#A78BFA] text-white flex items-center justify-center font-bold text-base shadow-md shadow-[#7C5CFC]/20 shrink-0">
                {instructor.avatarUrl ? (
                  <img src={instructor.avatarUrl} alt={instructor.firstName} className="w-full h-full rounded-2xl object-cover" />
                ) : (
                  instructor.firstName?.charAt(0) || 'I'
                )}
              </div>
              <div>
                <h4 className="text-sm font-bold text-white">
                  {instructor.firstName} {instructor.lastName}
                </h4>
                <p className="text-xs text-[#A78BFA]">{instructor.headline || 'Senior Software Architect'}</p>
              </div>
            </div>

            <p className="text-xs text-[#CBD5E1] leading-relaxed">
              {instructor.bio || 'Staff engineer and open source contributor passionate about high-throughput database systems and web architecture.'}
            </p>

            <div className="pt-2 border-t border-[#27324A]/40 flex items-center gap-3 text-xs text-[#94A3B8]">
              {instructor.githubUrl && (
                <a href={instructor.githubUrl} target="_blank" rel="noreferrer" className="flex items-center gap-1 hover:text-white transition">
                  <ExternalLink className="w-3.5 h-3.5" /> GitHub
                </a>
              )}
              {instructor.linkedinUrl && (
                <a href={instructor.linkedinUrl} target="_blank" rel="noreferrer" className="flex items-center gap-1 hover:text-white transition">
                  <Globe className="w-3.5 h-3.5" /> Profile
                </a>
              )}
            </div>
          </Card>

          {/* Skills Acquired Card */}
          {skills.length > 0 && (
            <Card className="p-6 bg-[#151C31] border-[#27324A] space-y-3">
              <h4 className="text-xs font-semibold uppercase tracking-wider text-[#94A3B8]">
                Skills You Will Develop
              </h4>
              <div className="flex flex-wrap gap-2 pt-1">
                {skills.map((sk) => (
                  <Badge key={sk.id} variant="purple" size="sm">
                    {sk.name}
                  </Badge>
                ))}
              </div>
            </Card>
          )}

          {/* Prerequisites Card */}
          {course.prerequisites && (
            <Card className="p-6 bg-[#151C31] border-[#27324A] space-y-3">
              <h4 className="text-xs font-semibold uppercase tracking-wider text-[#94A3B8]">
                Prerequisites
              </h4>
              <ul className="space-y-1.5 text-xs text-[#CBD5E1]">
                {(Array.isArray(course.prerequisites) ? course.prerequisites : [course.prerequisites]).map((req, i) => (
                  <li key={i} className="flex items-start gap-2">
                    <span className="text-[#A78BFA]">•</span>
                    <span>{req}</span>
                  </li>
                ))}
              </ul>
            </Card>
          )}
        </div>
      </div>
    </div>
  );
}

export default CourseDetails;
