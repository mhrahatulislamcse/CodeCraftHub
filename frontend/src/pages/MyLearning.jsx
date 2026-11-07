import React from 'react';
import { GraduationCap, Award, BookOpen } from 'lucide-react';
import CourseCard from '../components/cards/CourseCard.jsx';
import Badge from '../components/common/Badge.jsx';

export function MyLearning() {
  const sampleEnrolledCourses = [
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
  ];

  return (
    <div className="space-y-6">
      <div className="pb-4 border-b border-[#27324A]/60">
        <h1 className="text-2xl font-bold text-white tracking-tight flex items-center gap-2">
          <GraduationCap className="w-6 h-6 text-[#A78BFA]" />
          My Learning & Certificates
        </h1>
        <p className="text-xs text-[#94A3B8] mt-1">
          Track active courses, resume lessons, and download earned certificates.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {sampleEnrolledCourses.map((c, idx) => (
          <CourseCard
            key={c.id}
            course={c}
            progress={idx === 0 ? 64 : 100}
          />
        ))}
      </div>
    </div>
  );
}

export default MyLearning;

