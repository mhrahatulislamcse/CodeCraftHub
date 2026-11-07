import React, { useState, useEffect } from 'react';
import { Compass, Search, Filter } from 'lucide-react';
import Input from '../components/common/Input.jsx';
import CourseCard from '../components/cards/CourseCard.jsx';
import Spinner from '../components/feedback/Spinner.jsx';
import api from '../services/api.js';

export function CourseCatalog() {
  const [courses, setCourses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');

  useEffect(() => {
    const fetchCourses = async () => {
      try {
        setLoading(true);
        const res = await api.get('/courses');
        setCourses(res.data?.courses || []);
      } catch {
        // Fallback placeholder courses if offline
        setCourses([
          {
            id: 'c1',
            title: 'Mastering PostgreSQL: Architecture and Optimization',
            description: 'Deep dive into indexes, transaction isolation levels, write-ahead logs, and database schema migrations.',
            difficulty: 'Intermediate',
            categoryName: 'Databases',
            instructorName: 'Sarah Drasner',
            rating: 4.9,
            reviewsCount: 128,
            totalDurationMinutes: 360,
            totalLessons: 14,
          },
          {
            id: 'c2',
            title: 'React 19 Core & Full-Stack Application Design',
            description: 'Learn modern React with Concurrent rendering, Server Components, Vite, and custom hooks architecture.',
            difficulty: 'Beginner',
            categoryName: 'Frontend',
            instructorName: 'Alex Chen',
            rating: 4.8,
            reviewsCount: 95,
            totalDurationMinutes: 420,
            totalLessons: 20,
          },
          {
            id: 'c3',
            title: 'Production Node.js Microservices and REST APIs',
            description: 'Build enterprise-grade REST APIs with Express, JWT authentication, rate limiting, and automated Vitest suites.',
            difficulty: 'Advanced',
            categoryName: 'Backend',
            instructorName: 'Sarah Drasner',
            rating: 4.9,
            reviewsCount: 84,
            totalDurationMinutes: 300,
            totalLessons: 12,
          },
        ]);
      } finally {
        setLoading(false);
      }
    };

    fetchCourses();
  }, []);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-4 border-b border-[#27324A]/60">
        <div>
          <h1 className="text-2xl font-bold text-white tracking-tight flex items-center gap-2">
            <Compass className="w-6 h-6 text-[#A78BFA]" />
            Course Catalog
          </h1>
          <p className="text-xs text-[#94A3B8] mt-1">
            Explore industry-standard curriculums crafted for software engineers.
          </p>
        </div>

        <div className="w-full md:w-80">
          <Input
            placeholder="Search by title, technology, or instructor..."
            leftIcon={<Search className="w-4 h-4" />}
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>
      </div>

      {loading ? (
        <div className="min-h-[40vh] flex flex-col items-center justify-center gap-3">
          <Spinner size="lg" color="purple" />
          <p className="text-xs text-[#94A3B8]">Loading catalog courses...</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {courses.map((course) => (
            <CourseCard key={course.id} course={course} />
          ))}
        </div>
      )}
    </div>
  );
}

export default CourseCatalog;
