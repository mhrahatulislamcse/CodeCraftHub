import React, { useState, useEffect, useCallback } from 'react';
import { useSearchParams } from 'react-router-dom';
import { useNotification } from '../contexts/NotificationContext.jsx';
import courseService from '../services/courseService.js';
import CourseCard from '../components/cards/CourseCard.jsx';
import Input from '../components/common/Input.jsx';
import Select from '../components/common/Select.jsx';
import Button from '../components/common/Button.jsx';
import Badge from '../components/common/Badge.jsx';
import Spinner from '../components/feedback/Spinner.jsx';
import {
  Compass,
  Search,
  Filter,
  SlidersHorizontal,
  RotateCcw,
  BookOpen,
  Sparkles,
  ChevronLeft,
  ChevronRight,
  AlertCircle
} from 'lucide-react';

export function CourseCatalog() {
  const { toast } = useNotification();
  const [searchParams, setSearchParams] = useSearchParams();

  // State
  const [courses, setCourses] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [pagination, setPagination] = useState({
    currentPage: 1,
    totalPages: 1,
    totalRecords: 0,
  });

  // Filter state
  const [search, setSearch] = useState(searchParams.get('search') || '');
  const [selectedCategory, setSelectedCategory] = useState(searchParams.get('category') || 'all');
  const [selectedDifficulty, setSelectedDifficulty] = useState(searchParams.get('difficulty') || 'all');
  const [sortBy, setSortBy] = useState(searchParams.get('sortBy') || 'created_at');
  const [page, setPage] = useState(parseInt(searchParams.get('page') || '1', 10));

  // Load categories once
  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const catList = await courseService.getCategories();
        setCategories(catList);
      } catch (err) {
        console.warn('Failed to load categories:', err);
      }
    };
    fetchCategories();
  }, []);

  // Fetch courses whenever filters or page changes
  const fetchCourses = useCallback(async () => {
    try {
      setLoading(true);

      const params = {
        page,
        limit: 9,
        sortBy,
        sortOrder: sortBy === 'title' ? 'ASC' : 'DESC',
      };

      if (search.trim()) {
        params.search = search.trim();
      }
      if (selectedCategory && selectedCategory !== 'all') {
        params.category = selectedCategory;
      }
      if (selectedDifficulty && selectedDifficulty !== 'all') {
        params.difficulty = selectedDifficulty;
      }

      const res = await courseService.getCourses(params);
      setCourses(res.courses || []);
      if (res.pagination) {
        setPagination({
          currentPage: res.pagination.currentPage,
          totalPages: res.pagination.totalPages,
          totalRecords: res.pagination.totalRecords,
        });
      }
    } catch (err) {
      console.error('Failed to load course catalog:', err);
      toast.error('Failed to fetch catalog courses. Please try again.');
    } finally {
      setLoading(false);
    }
  }, [search, selectedCategory, selectedDifficulty, sortBy, page, toast]);

  useEffect(() => {
    fetchCourses();
  }, [fetchCourses]);

  // Handle direct enrollment from catalog card
  const handleEnroll = async (courseId) => {
    try {
      await courseService.enrollCourse(courseId);
      toast.success('Successfully enrolled in course!');
      fetchCourses();
    } catch (err) {
      toast.error(err.message || 'Enrollment request failed');
    }
  };

  const handleResetFilters = () => {
    setSearch('');
    setSelectedCategory('all');
    setSelectedDifficulty('all');
    setSortBy('created_at');
    setPage(1);
    setSearchParams({});
  };

  return (
    <div className="space-y-8 pb-16">
      {/* Header Banner */}
      <div className="relative p-6 sm:p-8 rounded-3xl bg-gradient-to-r from-[#151C31] via-[#1A233D] to-[#151C31] border border-[#27324A] overflow-hidden">
        <div className="absolute top-0 right-0 w-80 h-80 bg-[#7C5CFC]/15 rounded-full blur-3xl pointer-events-none" />

        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div>
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#7C5CFC]/20 text-[#A78BFA] border border-[#7C5CFC]/40 text-xs font-semibold mb-3">
              <Compass className="w-3.5 h-3.5" />
              <span>Full-Stack Engineering Curriculums</span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
              Course Catalog & Discovery
            </h1>
            <p className="text-xs sm:text-sm text-[#94A3B8] mt-1.5 max-w-xl leading-relaxed">
              Explore in-depth tracks covering relational database architecture, modern reactive frontends, and resilient distributed microservices.
            </p>
          </div>

          <div className="w-full md:w-80 shrink-0">
            <Input
              placeholder="Search courses, skills, or topics..."
              leftIcon={<Search className="w-4 h-4" />}
              value={search}
              onChange={(e) => {
                setSearch(e.target.value);
                setPage(1);
              }}
            />
          </div>
        </div>
      </div>

      {/* Filter Bar: Category Pills */}
      <div className="flex items-center gap-2 overflow-x-auto pb-2 scrollbar-none">
        <button
          onClick={() => {
            setSelectedCategory('all');
            setPage(1);
          }}
          className={`text-xs px-3.5 py-2 rounded-xl font-medium whitespace-nowrap transition-all duration-200 cursor-pointer ${
            selectedCategory === 'all'
              ? 'bg-[#7C5CFC] text-white shadow-md shadow-[#7C5CFC]/30'
              : 'bg-[#151C31] text-[#CBD5E1] hover:text-white border border-[#27324A]'
          }`}
        >
          All Categories
        </button>

        {categories.map((cat) => (
          <button
            key={cat.id}
            onClick={() => {
              setSelectedCategory(cat.slug || cat.id);
              setPage(1);
            }}
            className={`text-xs px-3.5 py-2 rounded-xl font-medium whitespace-nowrap transition-all duration-200 cursor-pointer ${
              selectedCategory === (cat.slug || cat.id)
                ? 'bg-[#7C5CFC] text-white shadow-md shadow-[#7C5CFC]/30'
                : 'bg-[#151C31] text-[#CBD5E1] hover:text-white border border-[#27324A]'
            }`}
          >
            {cat.name}
          </button>
        ))}
      </div>

      {/* Secondary Filter Controls (Difficulty, Sort, Reset) */}
      <div className="flex flex-wrap items-center justify-between gap-4 p-4 rounded-2xl bg-[#151C31] border border-[#27324A]">
        <div className="flex items-center gap-3 flex-wrap">
          <div className="w-44">
            <Select
              value={selectedDifficulty}
              onChange={(e) => {
                setSelectedDifficulty(e.target.value);
                setPage(1);
              }}
              options={[
                { value: 'all', label: 'All Difficulties' },
                { value: 'beginner', label: 'Beginner' },
                { value: 'intermediate', label: 'Intermediate' },
                { value: 'advanced', label: 'Advanced' },
              ]}
            />
          </div>

          <div className="w-48">
            <Select
              value={sortBy}
              onChange={(e) => {
                setSortBy(e.target.value);
                setPage(1);
              }}
              options={[
                { value: 'created_at', label: 'Newest Added' },
                { value: 'rating', label: 'Highest Rated' },
                { value: 'enrollments', label: 'Most Popular' },
                { value: 'title', label: 'Alphabetical' },
              ]}
            />
          </div>

          {(search || selectedCategory !== 'all' || selectedDifficulty !== 'all' || sortBy !== 'created_at') && (
            <Button
              variant="ghost"
              size="sm"
              leftIcon={<RotateCcw className="w-3.5 h-3.5" />}
              onClick={handleResetFilters}
            >
              Reset
            </Button>
          )}
        </div>

        <div className="text-xs text-[#94A3B8]">
          Found <span className="font-semibold text-white">{pagination.totalRecords}</span> courses
        </div>
      </div>

      {/* Courses Grid or Empty State */}
      {loading ? (
        <div className="min-h-[40vh] flex flex-col items-center justify-center gap-3">
          <Spinner size="lg" color="purple" />
          <p className="text-xs text-[#94A3B8] font-mono">Filtering course catalog...</p>
        </div>
      ) : courses.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {courses.map((course) => (
            <CourseCard
              key={course.id}
              course={course}
              onEnroll={() => handleEnroll(course.id)}
            />
          ))}
        </div>
      ) : (
        <div className="p-12 rounded-3xl bg-[#151C31] border border-[#27324A] text-center space-y-4">
          <div className="w-14 h-14 rounded-2xl bg-[#7C5CFC]/15 text-[#A78BFA] border border-[#7C5CFC]/30 flex items-center justify-center mx-auto">
            <Search className="w-7 h-7" />
          </div>
          <h3 className="text-lg font-bold text-white">No courses match your criteria</h3>
          <p className="text-xs text-[#CBD5E1] max-w-sm mx-auto leading-relaxed">
            Try adjusting your search terms, difficulty levels, or select another category.
          </p>
          <Button variant="primary" size="sm" onClick={handleResetFilters}>
            Clear All Filters
          </Button>
        </div>
      )}

      {/* Pagination Bar */}
      {pagination.totalPages > 1 && (
        <div className="flex items-center justify-between pt-4 border-t border-[#27324A]/60">
          <span className="text-xs text-[#94A3B8]">
            Page <span className="font-semibold text-white">{pagination.currentPage}</span> of{' '}
            <span className="font-semibold text-white">{pagination.totalPages}</span>
          </span>

          <div className="flex items-center gap-2">
            <Button
              variant="secondary"
              size="sm"
              disabled={pagination.currentPage <= 1}
              onClick={() => setPage((prev) => Math.max(1, prev - 1))}
              leftIcon={<ChevronLeft className="w-4 h-4" />}
            >
              Previous
            </Button>
            <Button
              variant="secondary"
              size="sm"
              disabled={pagination.currentPage >= pagination.totalPages}
              onClick={() => setPage((prev) => Math.min(pagination.totalPages, prev + 1))}
              rightIcon={<ChevronRight className="w-4 h-4" />}
            >
              Next
            </Button>
          </div>
        </div>
      )}
    </div>
  );
}

export default CourseCatalog;
