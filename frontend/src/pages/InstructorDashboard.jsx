import React, { useState, useEffect, useCallback } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext.jsx';
import { useNotification } from '../contexts/NotificationContext.jsx';
import courseService from '../services/courseService.js';
import StatCard from '../components/common/StatCard.jsx';
import Card, { CardHeader, CardTitle, CardContent } from '../components/common/Card.jsx';
import Badge from '../components/common/Badge.jsx';
import Button from '../components/common/Button.jsx';
import Input from '../components/common/Input.jsx';
import Textarea from '../components/common/Textarea.jsx';
import Select from '../components/common/Select.jsx';
import Modal from '../components/common/Modal.jsx';
import Spinner from '../components/feedback/Spinner.jsx';
import {
  BarChart3,
  Users,
  BookOpen,
  Star,
  PlusCircle,
  FolderKanban,
  FileCode2,
  PlayCircle,
  CheckCircle2,
  Globe,
  Lock,
  Eye,
  Trash2,
  Sparkles,
  ExternalLink,
  Layers,
  ArrowRight
} from 'lucide-react';

export function InstructorDashboard() {
  const { user } = useAuth();
  const { toast } = useNotification();
  const navigate = useNavigate();

  // State
  const [courses, setCourses] = useState([]);
  const [categories, setCategories] = useState([]);
  const [analytics, setAnalytics] = useState(null);
  const [loading, setLoading] = useState(true);

  // Course creation modal state
  const [courseModalOpen, setCourseModalOpen] = useState(false);
  const [creatingCourse, setCreatingCourse] = useState(false);
  const [courseForm, setCourseForm] = useState({
    title: '',
    categoryId: '',
    difficultyLevel: 'Intermediate',
    estimatedHours: 8,
    description: '',
    learningObjectives: 'Build modular production architectures, Implement robust database access',
    prerequisites: 'Basic JavaScript familiarity',
    thumbnailUrl: '',
    isPublished: true,
  });

  // Curriculum lesson builder modal state
  const [lessonModalOpen, setLessonModalOpen] = useState(false);
  const [selectedCourseForLesson, setSelectedCourseForLesson] = useState(null);
  const [creatingLesson, setCreatingLesson] = useState(false);
  const [lessonForm, setLessonForm] = useState({
    title: '',
    description: '',
    videoUrl: 'https://www.youtube-nocookie.com/embed/dQw4w9WgXcQ',
    durationMinutes: 20,
    orderIndex: 1,
    isFreePreview: false,
    contentMarkdown: '### Lesson Overview\nDetailed step-by-step instructions and technical architecture diagrams.',
  });

  const loadInstructorData = useCallback(async () => {
    try {
      setLoading(true);
      const [coursesRes, analyticsRes, catList] = await Promise.all([
        courseService.getMyInstructorCourses(),
        courseService.getInstructorAnalytics(),
        courseService.getCategories(),
      ]);

      setCourses(coursesRes.data || []);
      setAnalytics(analyticsRes || null);
      setCategories(catList || []);
      if (catList.length > 0 && !courseForm.categoryId) {
        setCourseForm((prev) => ({ ...prev, categoryId: catList[0].id }));
      }
    } catch (err) {
      console.error('Failed to load instructor studio data:', err);
      toast.error('Unable to retrieve instructor metrics.');
    } finally {
      setLoading(false);
    }
  }, [toast]);

  useEffect(() => {
    loadInstructorData();
  }, [loadInstructorData]);

  // Handle course form changes
  const handleCourseFormChange = (e) => {
    const { name, value, type, checked } = e.target;
    setCourseForm((prev) => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value,
    }));
  };

  // Submit new course
  const handleCreateCourseSubmit = async (e) => {
    e.preventDefault();
    if (!courseForm.title.trim() || !courseForm.description.trim()) {
      toast.error('Course title and description are required.');
      return;
    }

    try {
      setCreatingCourse(true);
      const payload = {
        title: courseForm.title.trim(),
        categoryId: courseForm.categoryId || undefined,
        difficultyLevel: courseForm.difficultyLevel,
        estimatedHours: parseFloat(courseForm.estimatedHours) || 6,
        description: courseForm.description.trim(),
        learningObjectives: courseForm.learningObjectives
          .split(',')
          .map((s) => s.trim())
          .filter(Boolean),
        prerequisites: courseForm.prerequisites
          .split(',')
          .map((s) => s.trim())
          .filter(Boolean),
        thumbnailUrl: courseForm.thumbnailUrl.trim() || undefined,
        isPublished: courseForm.isPublished,
      };

      await courseService.createCourse(payload);
      toast.success(`Course "${courseForm.title}" created successfully!`);
      setCourseModalOpen(false);
      setCourseForm({
        title: '',
        categoryId: categories[0]?.id || '',
        difficultyLevel: 'Intermediate',
        estimatedHours: 8,
        description: '',
        learningObjectives: 'Build modular production architectures',
        prerequisites: 'Basic JavaScript familiarity',
        thumbnailUrl: '',
        isPublished: true,
      });
      loadInstructorData();
    } catch (err) {
      toast.error(err.message || 'Failed to create course');
    } finally {
      setCreatingCourse(false);
    }
  };

  // Open Curriculum modal
  const handleOpenAddLesson = (course) => {
    setSelectedCourseForLesson(course);
    setLessonForm({
      title: '',
      description: '',
      videoUrl: 'https://www.youtube-nocookie.com/embed/dQw4w9WgXcQ',
      durationMinutes: 20,
      orderIndex: (course.lessons?.length || 0) + 1,
      isFreePreview: false,
      contentMarkdown: '### Lesson Technical Specification\nDocumenting database queries, React components, and architecture diagrams.',
    });
    setLessonModalOpen(true);
  };

  // Submit new lesson
  const handleCreateLessonSubmit = async (e) => {
    e.preventDefault();
    if (!selectedCourseForLesson || !lessonForm.title.trim()) {
      toast.error('Lesson title is required.');
      return;
    }

    try {
      setCreatingLesson(true);
      const payload = {
        title: lessonForm.title.trim(),
        description: lessonForm.description.trim(),
        videoUrl: lessonForm.videoUrl.trim(),
        durationMinutes: parseInt(lessonForm.durationMinutes, 10) || 15,
        orderIndex: parseInt(lessonForm.orderIndex, 10) || 1,
        isFreePreview: lessonForm.isFreePreview,
        contentMarkdown: lessonForm.contentMarkdown,
      };

      await courseService.createLesson(selectedCourseForLesson.id, payload);
      toast.success(`Lesson added to "${selectedCourseForLesson.title}"!`);
      setLessonModalOpen(false);
      loadInstructorData();
    } catch (err) {
      toast.error(err.message || 'Failed to add lesson');
    } finally {
      setCreatingLesson(false);
    }
  };

  // Toggle publish status
  const handleTogglePublish = async (course) => {
    const newStatus = !course.is_published;
    try {
      await courseService.updateCourse(course.id, { isPublished: newStatus });
      toast.success(newStatus ? `"${course.title}" published!` : `"${course.title}" moved to draft.`);
      loadInstructorData();
    } catch (err) {
      toast.error(err.message || 'Failed to update publication status');
    }
  };

  if (loading) {
    return (
      <div className="min-h-[60vh] flex flex-col items-center justify-center gap-3">
        <Spinner size="lg" color="purple" />
        <p className="text-xs text-[#94A3B8] font-mono">Loading Instructor Studio telemetry...</p>
      </div>
    );
  }

  return (
    <div className="space-y-8 pb-16">
      {/* 1. Header Banner */}
      <div className="relative p-6 sm:p-8 rounded-3xl bg-gradient-to-r from-[#151C31] via-[#241F3B] to-[#151C31] border border-[#27324A] overflow-hidden">
        <div className="absolute top-0 right-0 w-96 h-96 bg-[#F59E0B]/15 rounded-full blur-3xl pointer-events-none" />

        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div>
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#F59E0B]/15 text-[#F59E0B] border border-[#F59E0B]/30 text-xs font-semibold mb-3">
              <BarChart3 className="w-3.5 h-3.5" />
              <span>Instructor Studio & Curriculum Authoring</span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
              Instructor Dashboard
            </h1>
            <p className="text-xs sm:text-sm text-[#94A3B8] mt-1.5 max-w-xl leading-relaxed">
              Design comprehensive curriculums, publish technical modules, and monitor student engagement across your courses.
            </p>
          </div>

          <Button
            variant="primary"
            size="md"
            onClick={() => setCourseModalOpen(true)}
            leftIcon={<PlusCircle className="w-4 h-4" />}
          >
            Create New Course
          </Button>
        </div>
      </div>

      {/* 2. Key Metrics Row (4 Live StatCards) */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatCard
          title="Total Students"
          value={`${analytics?.total_students_enrolled || 0}`}
          change="Across all tracks"
          trend="up"
          subtitle="Active community"
          icon={<Users className="w-6 h-6 text-[#A78BFA]" />}
          iconBg="bg-[#7C5CFC]/15 text-[#A78BFA] border-[#7C5CFC]/30"
        />

        <StatCard
          title="Published Courses"
          value={`${analytics?.published_courses || 0} Courses`}
          change={`${analytics?.draft_courses || 0} in draft`}
          trend="neutral"
          subtitle="Live on catalog"
          icon={<BookOpen className="w-6 h-6 text-[#22C55E]" />}
          iconBg="bg-[#22C55E]/15 text-[#22C55E] border-[#22C55E]/30"
        />

        <StatCard
          title="Average Rating"
          value={`${Number(analytics?.average_rating || 4.9).toFixed(1)} / 5.0`}
          change="Student reviews"
          trend="up"
          subtitle="Top rated instructor"
          icon={<Star className="w-6 h-6 text-[#F59E0B]" />}
          iconBg="bg-[#F59E0B]/15 text-[#F59E0B] border-[#F59E0B]/30"
        />

        <StatCard
          title="Curriculum Lessons"
          value={`${analytics?.total_lessons || 0} Lessons`}
          change="Structured content"
          trend="up"
          subtitle="Video & code labs"
          icon={<FileCode2 className="w-6 h-6 text-[#38BDF8]" />}
          iconBg="bg-[#38BDF8]/15 text-[#38BDF8] border-[#38BDF8]/30"
        />
      </div>

      {/* 3. Course Studio Management Table */}
      <Card className="bg-[#151C31] border-[#27324A] overflow-hidden">
        <div className="p-6 border-b border-[#27324A]/60 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h3 className="text-base font-bold text-white tracking-tight flex items-center gap-2">
              <FolderKanban className="w-5 h-5 text-[#A78BFA]" />
              Course Studio & Curriculum Manager
            </h3>
            <p className="text-xs text-[#94A3B8] mt-0.5">
              Manage your authored courses, add curriculum lessons, and configure publish states.
            </p>
          </div>

          <Button
            variant="outline"
            size="xs"
            onClick={() => setCourseModalOpen(true)}
            leftIcon={<PlusCircle className="w-3.5 h-3.5" />}
          >
            New Track
          </Button>
        </div>

        {courses.length > 0 ? (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-[#10182B]/80 text-[#94A3B8] uppercase font-mono tracking-wider border-b border-[#27324A]/60">
                <tr>
                  <th className="py-3 px-6">Course Title</th>
                  <th className="py-3 px-4">Difficulty</th>
                  <th className="py-3 px-4">Status</th>
                  <th className="py-3 px-4">Rating</th>
                  <th className="py-3 px-4">Students</th>
                  <th className="py-3 px-6 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#27324A]/40 text-[#CBD5E1]">
                {courses.map((course) => (
                  <tr key={course.id} className="hover:bg-[#10182B]/40 transition">
                    <td className="py-4 px-6">
                      <div className="font-semibold text-white text-sm truncate max-w-sm">
                        {course.title}
                      </div>
                      <div className="text-[11px] text-[#94A3B8] mt-0.5 truncate max-w-xs">
                        {course.description}
                      </div>
                    </td>

                    <td className="py-4 px-4">
                      <Badge variant="purple" size="xs">
                        {course.difficulty_level || 'Intermediate'}
                      </Badge>
                    </td>

                    <td className="py-4 px-4">
                      <button
                        onClick={() => handleTogglePublish(course)}
                        className="cursor-pointer"
                        title="Click to toggle publish status"
                      >
                        <Badge
                          variant={course.is_published ? 'green' : 'yellow'}
                          size="xs"
                          dot
                        >
                          {course.is_published ? 'Published' : 'Draft'}
                        </Badge>
                      </button>
                    </td>

                    <td className="py-4 px-4 font-mono">
                      <span className="flex items-center gap-1 text-white">
                        <Star className="w-3.5 h-3.5 fill-[#F59E0B] text-[#F59E0B]" />
                        {Number(course.rating_average || 5.0).toFixed(1)}
                      </span>
                    </td>

                    <td className="py-4 px-4 font-mono text-white">
                      {course.enrollment_count || 0}
                    </td>

                    <td className="py-4 px-6 text-right space-x-2 whitespace-nowrap">
                      <Button
                        variant="primary"
                        size="xs"
                        leftIcon={<PlusCircle className="w-3.5 h-3.5" />}
                        onClick={() => handleOpenAddLesson(course)}
                      >
                        Add Lesson
                      </Button>

                      <Link to={`/courses/${course.id}`}>
                        <Button variant="secondary" size="xs" leftIcon={<Eye className="w-3.5 h-3.5" />}>
                          Preview
                        </Button>
                      </Link>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <div className="p-12 text-center space-y-4">
            <div className="w-14 h-14 rounded-2xl bg-[#7C5CFC]/15 text-[#A78BFA] flex items-center justify-center mx-auto">
              <FolderKanban className="w-7 h-7" />
            </div>
            <h4 className="text-base font-bold text-white">No courses published yet</h4>
            <p className="text-xs text-[#CBD5E1] max-w-sm mx-auto">
              Click &quot;Create New Course&quot; to author your first curriculum track on CodeCraftHub.
            </p>
            <Button variant="primary" size="sm" onClick={() => setCourseModalOpen(true)}>
              Author Course Now
            </Button>
          </div>
        )}
      </Card>

      {/* Modal 1: Create New Course */}
      <Modal
        isOpen={courseModalOpen}
        onClose={() => setCourseModalOpen(false)}
        title="Create New Curriculum Track"
        subtitle="Author a new technical course for the CodeCraftHub catalog."
        size="lg"
        footer={
          <div className="flex items-center gap-3">
            <Button variant="secondary" size="sm" onClick={() => setCourseModalOpen(false)}>
              Cancel
            </Button>
            <Button
              variant="primary"
              size="sm"
              loading={creatingCourse}
              onClick={handleCreateCourseSubmit}
              leftIcon={<PlusCircle className="w-4 h-4" />}
            >
              Publish Course
            </Button>
          </div>
        }
      >
        <form onSubmit={handleCreateCourseSubmit} className="space-y-4">
          <Input
            label="Course Title"
            name="title"
            placeholder="e.g. Distributed Caching & Redis Architecture"
            value={courseForm.title}
            onChange={handleCourseFormChange}
            required
          />

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <Select
              label="Course Category"
              name="categoryId"
              value={courseForm.categoryId}
              onChange={handleCourseFormChange}
              options={categories.map((c) => ({ value: c.id, label: c.name }))}
            />

            <Select
              label="Difficulty Level"
              name="difficultyLevel"
              value={courseForm.difficultyLevel}
              onChange={handleCourseFormChange}
              options={[
                { value: 'Beginner', label: 'Beginner' },
                { value: 'Intermediate', label: 'Intermediate' },
                { value: 'Advanced', label: 'Advanced' },
              ]}
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <Input
              label="Estimated Duration (Hours)"
              name="estimatedHours"
              type="number"
              step="0.5"
              min="1"
              value={courseForm.estimatedHours}
              onChange={handleCourseFormChange}
              required
            />
            <Input
              label="Thumbnail URL (Optional)"
              name="thumbnailUrl"
              placeholder="https://images.unsplash.com/..."
              value={courseForm.thumbnailUrl}
              onChange={handleCourseFormChange}
            />
          </div>

          <Textarea
            label="Course Overview & Description"
            name="description"
            rows={3}
            placeholder="Comprehensive description of architectural patterns and exercises covered..."
            value={courseForm.description}
            onChange={handleCourseFormChange}
            required
          />

          <Input
            label="Learning Objectives (Comma Separated)"
            name="learningObjectives"
            placeholder="Implement cache-aside, Handle lock contention, Zero-downtime deployment"
            value={courseForm.learningObjectives}
            onChange={handleCourseFormChange}
          />

          <Input
            label="Prerequisites (Comma Separated)"
            name="prerequisites"
            placeholder="Basic JavaScript, Client-Server architecture familiarity"
            value={courseForm.prerequisites}
            onChange={handleCourseFormChange}
          />

          <div className="pt-2 flex items-center gap-2">
            <input
              type="checkbox"
              id="isPublished"
              name="isPublished"
              checked={courseForm.isPublished}
              onChange={handleCourseFormChange}
              className="accent-[#7C5CFC] w-4 h-4 cursor-pointer"
            />
            <label htmlFor="isPublished" className="text-xs text-[#CBD5E1] cursor-pointer">
              Publish immediately to public catalog (uncheck to save as draft)
            </label>
          </div>
        </form>
      </Modal>

      {/* Modal 2: Curriculum Builder (Add Lesson) */}
      <Modal
        isOpen={lessonModalOpen}
        onClose={() => setLessonModalOpen(false)}
        title={`Add Lesson to "${selectedCourseForLesson?.title}"`}
        subtitle="Define video lectures, markdown technical specifications, and duration."
        size="lg"
        footer={
          <div className="flex items-center gap-3">
            <Button variant="secondary" size="sm" onClick={() => setLessonModalOpen(false)}>
              Cancel
            </Button>
            <Button
              variant="primary"
              size="sm"
              loading={creatingLesson}
              onClick={handleCreateLessonSubmit}
              leftIcon={<PlusCircle className="w-4 h-4" />}
            >
              Add Lesson to Syllabus
            </Button>
          </div>
        }
      >
        <form onSubmit={handleCreateLessonSubmit} className="space-y-4">
          <Input
            label="Lesson Title"
            placeholder="e.g. Memory Eviction Policies & Invalidation"
            value={lessonForm.title}
            onChange={(e) => setLessonForm({ ...lessonForm, title: e.target.value })}
            required
          />

          <div className="grid grid-cols-2 gap-4">
            <Input
              label="Order Index in Curriculum"
              type="number"
              min="1"
              value={lessonForm.orderIndex}
              onChange={(e) => setLessonForm({ ...lessonForm, orderIndex: e.target.value })}
              required
            />
            <Input
              label="Duration (Minutes)"
              type="number"
              min="1"
              value={lessonForm.durationMinutes}
              onChange={(e) => setLessonForm({ ...lessonForm, durationMinutes: e.target.value })}
              required
            />
          </div>

          <Input
            label="Video Stream URL (Embed or Direct MP4)"
            placeholder="https://www.youtube-nocookie.com/embed/..."
            value={lessonForm.videoUrl}
            onChange={(e) => setLessonForm({ ...lessonForm, videoUrl: e.target.value })}
          />

          <Textarea
            label="Lesson Summary / Description"
            rows={2}
            placeholder="Core focus of this lesson module..."
            value={lessonForm.description}
            onChange={(e) => setLessonForm({ ...lessonForm, description: e.target.value })}
          />

          <Textarea
            label="Lesson Markdown Content & Code Snippets"
            rows={4}
            value={lessonForm.contentMarkdown}
            onChange={(e) => setLessonForm({ ...lessonForm, contentMarkdown: e.target.value })}
            helperText="Markdown syntax is supported for technical notes and code blocks."
          />

          <div className="pt-2 flex items-center gap-2">
            <input
              type="checkbox"
              id="isFreePreview"
              checked={lessonForm.isFreePreview}
              onChange={(e) => setLessonForm({ ...lessonForm, isFreePreview: e.target.checked })}
              className="accent-[#7C5CFC] w-4 h-4 cursor-pointer"
            />
            <label htmlFor="isFreePreview" className="text-xs text-[#CBD5E1] cursor-pointer">
              Set as Free Preview Lesson (accessible before course enrollment)
            </label>
          </div>
        </form>
      </Modal>
    </div>
  );
}

export default InstructorDashboard;
