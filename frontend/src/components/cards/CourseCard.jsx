import React from 'react';
import Card from '../common/Card.jsx';
import Badge from '../common/Badge.jsx';
import Button from '../common/Button.jsx';
import ProgressBar from '../common/ProgressBar.jsx';
import { Clock, BookOpen, Star, User, PlayCircle, ArrowRight } from 'lucide-react';

export function CourseCard({
  course,
  progress = null, // e.g. 45 (if enrolled)
  onEnroll,
  onContinue,
  onViewDetails,
  className = '',
}) {
  if (!course) return null;

  const {
    id,
    title = 'Untitled Course',
    description = '',
    difficulty = 'beginner',
    categoryName = 'Development',
    instructorName = 'CodeCraft Instructor',
    instructorAvatar = null,
    rating = 4.8,
    reviewsCount = 42,
    totalDurationMinutes = 120,
    totalLessons = 10,
    thumbnailUrl = null,
    isEnrolled = progress !== null,
  } = course;

  const difficultyVariantMap = {
    beginner: 'green',
    intermediate: 'purple',
    advanced: 'red',
  };

  const formatDuration = (mins) => {
    if (!mins) return '1h 30m';
    const h = Math.floor(mins / 60);
    const m = mins % 60;
    if (h === 0) return `${m}m`;
    if (m === 0) return `${h}h`;
    return `${h}h ${m}m`;
  };

  return (
    <Card
      hoverable
      className={`flex flex-col h-full group bg-[#151C31] border-[#27324A] hover:border-[#7C5CFC]/60 transition-all duration-300 ${className}`}
    >
      {/* Thumbnail area */}
      <div className="relative h-44 w-full bg-[#10182B] overflow-hidden">
        {thumbnailUrl ? (
          <img
            src={thumbnailUrl}
            alt={title}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
          />
        ) : (
          <div className="w-full h-full bg-gradient-to-br from-[#10182B] via-[#151C31] to-[#1D2641] flex items-center justify-center relative">
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_120%,rgba(124,92,252,0.25),transparent_70%)]" />
            <BookOpen className="w-12 h-12 text-[#7C5CFC]/40 group-hover:scale-110 group-hover:text-[#7C5CFC]/70 transition-all duration-300" />
          </div>
        )}

        {/* Category & Difficulty Badges overlay */}
        <div className="absolute top-3 left-3 flex items-center gap-2 flex-wrap">
          <Badge variant="purple" size="xs">
            {categoryName}
          </Badge>
          <Badge
            variant={difficultyVariantMap[difficulty?.toLowerCase()] || 'neutral'}
            size="xs"
          >
            {difficulty}
          </Badge>
        </div>

        {/* Rating pill overlay */}
        <div className="absolute top-3 right-3 bg-[#0B1020]/80 backdrop-blur-md px-2.5 py-1 rounded-full border border-[#27324A] flex items-center gap-1.5 text-xs font-semibold text-[#F8FAFC]">
          <Star className="w-3.5 h-3.5 fill-[#F59E0B] text-[#F59E0B]" />
          <span>{Number(rating).toFixed(1)}</span>
          <span className="text-[10px] text-[#94A3B8]">({reviewsCount})</span>
        </div>
      </div>

      {/* Course Info */}
      <div className="p-5 flex-1 flex flex-col justify-between">
        <div>
          <h4
            onClick={onViewDetails}
            className="text-base font-semibold text-[#F8FAFC] group-hover:text-[#A78BFA] transition-colors line-clamp-2 cursor-pointer"
          >
            {title}
          </h4>

          <p className="text-xs text-[#94A3B8] mt-2 line-clamp-2 leading-relaxed">
            {description || 'Master modern development techniques with real-world architectures and hands-on coding modules.'}
          </p>
        </div>

        <div className="mt-4 pt-4 border-t border-[#27324A]/40 space-y-3">
          {/* Instructor and duration metadata */}
          <div className="flex items-center justify-between text-xs text-[#CBD5E1]">
            <div className="flex items-center gap-2">
              <div className="w-6 h-6 rounded-full bg-[#7C5CFC]/20 text-[#A78BFA] border border-[#7C5CFC]/40 flex items-center justify-center text-[10px] font-bold">
                {instructorAvatar ? (
                  <img src={instructorAvatar} alt={instructorName} className="w-full h-full rounded-full object-cover" />
                ) : (
                  instructorName.charAt(0).toUpperCase()
                )}
              </div>
              <span className="truncate max-w-[110px]">{instructorName}</span>
            </div>

            <div className="flex items-center gap-3 text-[#94A3B8]">
              <span className="flex items-center gap-1">
                <Clock className="w-3.5 h-3.5" />
                {formatDuration(totalDurationMinutes)}
              </span>
              <span className="flex items-center gap-1">
                <BookOpen className="w-3.5 h-3.5" />
                {totalLessons} lessons
              </span>
            </div>
          </div>

          {/* Progress bar if enrolled */}
          {isEnrolled && progress !== null && (
            <div className="pt-1">
              <ProgressBar
                value={progress}
                size="sm"
                variant={progress === 100 ? 'green' : 'purple'}
                showLabel
                label="Course Progress"
              />
            </div>
          )}

          {/* Action button */}
          <div className="pt-1">
            {isEnrolled ? (
              <Button
                variant={progress === 100 ? 'secondary' : 'primary'}
                size="sm"
                className="w-full"
                leftIcon={<PlayCircle className="w-4 h-4" />}
                onClick={onContinue || onViewDetails}
              >
                {progress === 100 ? 'Review Course' : 'Continue Learning'}
              </Button>
            ) : (
              <div className="flex items-center gap-2">
                <Button
                  variant="outline"
                  size="sm"
                  className="flex-1"
                  onClick={onViewDetails}
                >
                  Details
                </Button>
                <Button
                  variant="primary"
                  size="sm"
                  className="flex-1"
                  rightIcon={<ArrowRight className="w-3.5 h-3.5" />}
                  onClick={onEnroll || onViewDetails}
                >
                  Enroll
                </Button>
              </div>
            )}
          </div>
        </div>
      </div>
    </Card>
  );
}

export default CourseCard;
