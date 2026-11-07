import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext.jsx';
import { useNotification } from '../contexts/NotificationContext.jsx';
import progressService from '../services/progressService.js';
import courseService from '../services/courseService.js';
import StatCard from '../components/common/StatCard.jsx';
import Card, { CardHeader, CardTitle, CardContent } from '../components/common/Card.jsx';
import Button from '../components/common/Button.jsx';
import Badge from '../components/common/Badge.jsx';
import ProgressBar from '../components/common/ProgressBar.jsx';
import CourseCard from '../components/cards/CourseCard.jsx';
import Spinner from '../components/feedback/Spinner.jsx';
import {
  Sparkles,
  Flame,
  Clock,
  GraduationCap,
  Award,
  ArrowRight,
  BookOpen,
  PlayCircle,
  BarChart2,
  CheckCircle2,
  TrendingUp,
  AlertCircle
} from 'lucide-react';
import {
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
  Cell
} from 'recharts';

export function Dashboard() {
  const { user } = useAuth();
  const { toast } = useNotification();
  const navigate = useNavigate();

  const [summary, setSummary] = useState(null);
  const [recommendedCourses, setRecommendedCourses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    let isMounted = true;

    const fetchDashboardData = async () => {
      try {
        setLoading(true);
        setError(null);

        // Run both requests concurrently
        const [progressRes, coursesRes] = await Promise.all([
          progressService.getProgressSummary(),
          courseService.getCourses({ limit: 3, sortBy: 'rating' }),
        ]);

        if (isMounted) {
          setSummary(progressRes.data || progressRes);
          setRecommendedCourses(coursesRes.courses || []);
        }
      } catch (err) {
        console.error('Failed to load dashboard telemetry:', err);
        if (isMounted) {
          setError(err.message || 'Unable to connect to learning telemetry service.');
        }
      } finally {
        if (isMounted) {
          setLoading(false);
        }
      }
    };

    fetchDashboardData();

    return () => {
      isMounted = false;
    };
  }, []);

  const handleEnrollRecommended = async (courseId) => {
    try {
      await courseService.enrollCourse(courseId);
      toast.success('Successfully enrolled in course!');
      // Refresh telemetry
      const updated = await progressService.getProgressSummary();
      setSummary(updated.data || updated);
    } catch (err) {
      toast.error(err.message || 'Enrollment failed');
    }
  };

  if (loading) {
    return (
      <div className="min-h-[60vh] flex flex-col items-center justify-center gap-3">
        <Spinner size="lg" color="purple" />
        <p className="text-xs text-[#94A3B8] font-mono tracking-wide">
          Assembling personalized developer telemetry...
        </p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-8 rounded-3xl bg-[#151C31] border border-[#EF4444]/40 text-center space-y-4">
        <div className="w-12 h-12 rounded-2xl bg-[#EF4444]/15 text-[#EF4444] flex items-center justify-center mx-auto">
          <AlertCircle className="w-6 h-6" />
        </div>
        <h3 className="text-lg font-bold text-white">Dashboard Offline</h3>
        <p className="text-xs text-[#CBD5E1] max-w-md mx-auto">{error}</p>
        <Button variant="secondary" size="sm" onClick={() => window.location.reload()}>
          Retry Connection
        </Button>
      </div>
    );
  }

  // Format weekly activity for Recharts
  const weeklyData = summary?.weeklyActivity || [
    { day_name: 'Mon', lessons_completed: 1 },
    { day_name: 'Tue', lessons_completed: 2 },
    { day_name: 'Wed', lessons_completed: 0 },
    { day_name: 'Thu', lessons_completed: 3 },
    { day_name: 'Fri', lessons_completed: 1 },
    { day_name: 'Sat', lessons_completed: 4 },
    { day_name: 'Sun', lessons_completed: 2 },
  ];

  const totalWeeklyLessons = weeklyData.reduce(
    (acc, curr) => acc + (parseInt(curr.lessons_completed, 10) || 0),
    0
  );

  const continueCourse = summary?.continueLearning;

  return (
    <div className="space-y-8 pb-12">
      {/* 1. Welcome Hero Banner */}
      <div className="relative p-6 sm:p-8 rounded-3xl bg-gradient-to-r from-[#151C31] via-[#1C2542] to-[#151C31] border border-[#27324A] overflow-hidden">
        <div className="absolute top-0 right-0 w-96 h-96 bg-[#7C5CFC]/15 rounded-full blur-3xl pointer-events-none" />

        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div>
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#7C5CFC]/20 text-[#A78BFA] border border-[#7C5CFC]/40 text-xs font-semibold mb-3">
              <Sparkles className="w-3.5 h-3.5" />
              <span>Personalized Developer Learning Space</span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
              Welcome back, {user?.firstName || 'Developer'}!
            </h1>
            <p className="text-xs sm:text-sm text-[#94A3B8] mt-1.5 max-w-xl leading-relaxed">
              {summary?.currentStreakDays > 0
                ? `You're on a ${summary.currentStreakDays}-day learning streak! Keep progressing through your active modules.`
                : 'Every line of code counts. Pick up where you left off or explore new curriculum tracks today.'}
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

      {/* 2. Key Metrics Row (4 Live StatCards) */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatCard
          title="Enrolled Courses"
          value={`${summary?.totalEnrolledCourses || 0} Courses`}
          change={`${summary?.totalActiveCourses || 0} currently active`}
          trend="neutral"
          subtitle="Platform total"
          icon={<GraduationCap className="w-6 h-6 text-[#A78BFA]" />}
          iconBg="bg-[#7C5CFC]/15 text-[#A78BFA] border-[#7C5CFC]/30"
        />

        <StatCard
          title="Learning Streak"
          value={`${summary?.currentStreakDays || 0} Days`}
          change={summary?.currentStreakDays > 0 ? 'Active streak!' : 'Complete a lesson today'}
          trend={summary?.currentStreakDays > 0 ? 'up' : 'neutral'}
          subtitle="Keep daily momentum"
          icon={<Flame className="w-6 h-6 text-[#F59E0B]" />}
          iconBg="bg-[#F59E0B]/15 text-[#F59E0B] border-[#F59E0B]/30"
        />

        <StatCard
          title="Learning Hours"
          value={`${summary?.learningHours || 0} hrs`}
          change="Real hands-on time"
          trend="up"
          subtitle="Tracked duration"
          icon={<Clock className="w-6 h-6 text-[#38BDF8]" />}
          iconBg="bg-[#38BDF8]/15 text-[#38BDF8] border-[#38BDF8]/30"
        />

        <StatCard
          title="Completed Courses"
          value={`${summary?.totalCompletedCourses || 0}`}
          change={`${summary?.averageProgress || 0}% avg progress`}
          trend="up"
          subtitle="Verifiable certificates"
          icon={<Award className="w-6 h-6 text-[#22C55E]" />}
          iconBg="bg-[#22C55E]/15 text-[#22C55E] border-[#22C55E]/30"
        />
      </div>

      {/* 3. Continue Learning & Weekly Activity Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left 2 Cols: Continue Learning Active Module */}
        <div className="lg:col-span-2">
          {continueCourse ? (
            <Card className="p-6 h-full flex flex-col justify-between bg-[#151C31] border-[#27324A] relative overflow-hidden group">
              <div className="absolute top-0 right-0 w-64 h-64 bg-[#7C5CFC]/10 rounded-full blur-3xl pointer-events-none" />

              <div>
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center gap-2">
                    <span className="w-2.5 h-2.5 rounded-full bg-[#22C55E] animate-pulse" />
                    <span className="text-xs font-semibold text-[#CBD5E1] uppercase tracking-wider">
                      Continue Learning
                    </span>
                  </div>
                  <Badge variant="purple" size="xs">
                    In Progress
                  </Badge>
                </div>

                <h3 className="text-xl font-bold text-white group-hover:text-[#A78BFA] transition">
                  {continueCourse.course_title}
                </h3>

                <div className="mt-3 flex items-center gap-2 text-xs text-[#CBD5E1]">
                  <PlayCircle className="w-4 h-4 text-[#A78BFA] shrink-0" />
                  <span>
                    Up Next:{' '}
                    <span className="font-semibold text-white">
                      {continueCourse.continue_lesson?.title || 'Next module in sequence'}
                    </span>
                  </span>
                </div>

                <div className="mt-6 space-y-2">
                  <ProgressBar
                    value={Number(continueCourse.progress_percentage || 0)}
                    variant="purple"
                    showLabel
                    label="Course Progress"
                  />
                </div>
              </div>

              <div className="mt-6 pt-4 border-t border-[#27324A]/60 flex items-center justify-between">
                <span className="text-xs text-[#94A3B8]">
                  Last accessed:{' '}
                  {continueCourse.last_accessed_at
                    ? new Date(continueCourse.last_accessed_at).toLocaleDateString()
                    : 'Recently'}
                </span>

                <Link to={`/learn/${continueCourse.course_id}`}>
                  <Button variant="primary" size="sm" rightIcon={<ArrowRight className="w-4 h-4" />}>
                    Resume Lesson
                  </Button>
                </Link>
              </div>
            </Card>
          ) : (
            <Card className="p-8 h-full flex flex-col items-center justify-center text-center bg-[#151C31] border-[#27324A] space-y-4">
              <div className="w-14 h-14 rounded-2xl bg-[#7C5CFC]/15 text-[#A78BFA] border border-[#7C5CFC]/30 flex items-center justify-center">
                <BookOpen className="w-7 h-7" />
              </div>
              <div>
                <h3 className="text-lg font-bold text-white">No active course in progress</h3>
                <p className="text-xs text-[#94A3B8] max-w-sm mt-1 leading-relaxed">
                  Enroll in your first developer track from our curated catalog to begin building verified competencies.
                </p>
              </div>
              <Link to="/courses">
                <Button variant="primary" size="sm" rightIcon={<ArrowRight className="w-4 h-4" />}>
                  Explore Course Catalog
                </Button>
              </Link>
            </Card>
          )}
        </div>

        {/* Right 1 Col: Weekly Activity Chart (Recharts) */}
        <div className="lg:col-span-1">
          <Card className="p-6 h-full flex flex-col justify-between bg-[#151C31] border-[#27324A]">
            <div>
              <div className="flex items-center justify-between mb-2">
                <h3 className="text-sm font-semibold text-white tracking-tight flex items-center gap-2">
                  <BarChart2 className="w-4 h-4 text-[#A78BFA]" />
                  Weekly Learning Activity
                </h3>
                <span className="text-[10px] font-mono font-semibold px-2 py-0.5 rounded-full bg-[#7C5CFC]/15 text-[#A78BFA] border border-[#7C5CFC]/30">
                  {totalWeeklyLessons} lessons
                </span>
              </div>
              <p className="text-xs text-[#94A3B8]">
                Lesson completions over the past 7 days
              </p>

              <div className="h-48 w-full mt-4">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={weeklyData} margin={{ top: 10, right: 0, left: -25, bottom: 0 }}>
                    <CartesianGrid stroke="#27324A" strokeDasharray="3 3" vertical={false} opacity={0.4} />
                    <XAxis
                      dataKey="day_name"
                      stroke="#94A3B8"
                      fontSize={11}
                      tickLine={false}
                      axisLine={{ stroke: '#27324A' }}
                    />
                    <YAxis
                      stroke="#94A3B8"
                      fontSize={11}
                      tickLine={false}
                      axisLine={false}
                      allowDecimals={false}
                    />
                    <Tooltip
                      cursor={{ fill: 'rgba(124, 92, 252, 0.1)' }}
                      content={({ active, payload }) => {
                        if (active && payload && payload.length) {
                          const data = payload[0].payload;
                          return (
                            <div className="p-2.5 rounded-xl bg-[#10182B] border border-[#27324A] text-xs shadow-xl">
                              <p className="font-semibold text-white">{data.day_name} ({data.date || 'Day'})</p>
                              <p className="text-[#A78BFA] font-mono mt-0.5">
                                {data.lessons_completed} {data.lessons_completed === 1 ? 'lesson' : 'lessons'} completed
                              </p>
                            </div>
                          );
                        }
                        return null;
                      }}
                    />
                    <Bar dataKey="lessons_completed" radius={[4, 4, 0, 0]}>
                      {weeklyData.map((entry, index) => (
                        <Cell
                          key={`cell-${index}`}
                          fill={Number(entry.lessons_completed) > 0 ? '#7C5CFC' : '#1D2641'}
                        />
                      ))}
                    </Bar>
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </div>

            <div className="mt-4 pt-3 border-t border-[#27324A]/40 flex items-center justify-between text-xs text-[#94A3B8]">
              <span className="flex items-center gap-1">
                <TrendingUp className="w-3.5 h-3.5 text-[#22C55E]" />
                Daily consistency
              </span>
              <span className="text-[#A78BFA] font-medium">Goal: 1 lesson/day</span>
            </div>
          </Card>
        </div>
      </div>

      {/* 4. Recommended Courses Section */}
      <div className="space-y-4">
        <div className="flex items-center justify-between pb-2 border-b border-[#27324A]/60">
          <div>
            <h2 className="text-xl font-bold text-white tracking-tight flex items-center gap-2">
              <Sparkles className="w-5 h-5 text-[#A78BFA]" />
              Recommended For Your Learning Path
            </h2>
            <p className="text-xs text-[#94A3B8] mt-0.5">
              Curated full-stack curriculums tailored to accelerate your technical depth.
            </p>
          </div>

          <Link
            to="/courses"
            className="text-xs font-semibold text-[#A78BFA] hover:text-white transition flex items-center gap-1"
          >
            View all courses <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {recommendedCourses.map((course) => (
            <CourseCard
              key={course.id}
              course={course}
              onEnroll={() => handleEnrollRecommended(course.id)}
            />
          ))}
        </div>
      </div>
    </div>
  );
}

export default Dashboard;
