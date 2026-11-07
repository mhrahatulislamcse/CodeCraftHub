import React, { useState, useEffect, useCallback } from 'react';
import { useAuth } from '../contexts/AuthContext.jsx';
import { useNotification } from '../contexts/NotificationContext.jsx';
import adminService from '../services/adminService.js';
import courseService from '../services/courseService.js';
import StatCard from '../components/common/StatCard.jsx';
import Card, { CardHeader, CardTitle, CardContent } from '../components/common/Card.jsx';
import Badge from '../components/common/Badge.jsx';
import Button from '../components/common/Button.jsx';
import Input from '../components/common/Input.jsx';
import Select from '../components/common/Select.jsx';
import Modal from '../components/common/Modal.jsx';
import Spinner from '../components/feedback/Spinner.jsx';
import {
  ShieldAlert,
  ShieldCheck,
  Users,
  BookOpen,
  Database,
  Award,
  Search,
  CheckCircle2,
  AlertTriangle,
  RotateCcw,
  UserCheck,
  UserX,
  Server,
  Activity,
  Layers,
  ChevronLeft,
  ChevronRight,
  Sparkles
} from 'lucide-react';

export function AdminDashboard() {
  const { user } = useAuth();
  const { toast } = useNotification();

  // State
  const [stats, setStats] = useState(null);
  const [users, setUsers] = useState([]);
  const [courses, setCourses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [pagination, setPagination] = useState({ currentPage: 1, totalPages: 1, totalRecords: 0 });

  // Filter state
  const [search, setSearch] = useState('');
  const [roleFilter, setRoleFilter] = useState('all');
  const [page, setPage] = useState(1);

  // Tab: 'users' | 'courses'
  const [activeTab, setActiveTab] = useState('users');

  const loadAdminData = useCallback(async () => {
    try {
      setLoading(true);
      const [statsRes, usersRes, coursesRes] = await Promise.all([
        adminService.getStats(),
        adminService.getUsers({ page, limit: 10, role: roleFilter, search: search.trim() }),
        courseService.getCourses({ limit: 50 }),
      ]);

      setStats(statsRes.data || statsRes);
      setUsers(usersRes.data || []);
      if (usersRes.meta?.pagination) {
        setPagination(usersRes.meta.pagination);
      }
      setCourses(coursesRes.courses || []);
    } catch (err) {
      console.error('Failed to load administrator data:', err);
      toast.error('Unable to retrieve admin telemetry.');
    } finally {
      setLoading(false);
    }
  }, [page, roleFilter, search, toast]);

  useEffect(() => {
    loadAdminData();
  }, [loadAdminData]);

  // Handle Role Change for a user
  const handleChangeRole = async (userId, newRole) => {
    try {
      await adminService.updateRole(userId, newRole);
      toast.success(`User role updated to "${newRole}"!`);
      loadAdminData();
    } catch (err) {
      toast.error(err.message || 'Failed to update user role');
    }
  };

  // Handle User Status toggle (Active / Suspended)
  const handleToggleStatus = async (userItem) => {
    const newStatus = !userItem.is_active;
    try {
      await adminService.updateStatus(userItem.id, newStatus);
      toast.success(newStatus ? 'User account activated' : 'User account suspended');
      loadAdminData();
    } catch (err) {
      toast.error(err.message || 'Failed to toggle user status');
    }
  };

  // Handle Course Publish toggle (Admin override)
  const handleToggleCoursePublish = async (courseItem) => {
    const newStatus = !courseItem.is_published;
    try {
      await adminService.toggleCoursePublish(courseItem.id, newStatus);
      toast.success(newStatus ? `"${courseItem.title}" published!` : `"${courseItem.title}" moved to draft.`);
      loadAdminData();
    } catch (err) {
      toast.error(err.message || 'Failed to update course status');
    }
  };

  if (loading) {
    return (
      <div className="min-h-[60vh] flex flex-col items-center justify-center gap-3">
        <Spinner size="lg" color="purple" />
        <p className="text-xs text-[#94A3B8] font-mono">Loading Administration & Telemetry Portal...</p>
      </div>
    );
  }

  const roleBadgeMap = {
    admin: 'red',
    instructor: 'yellow',
    student: 'purple',
  };

  return (
    <div className="space-y-8 pb-16">
      {/* 1. Header Banner */}
      <div className="relative p-6 sm:p-8 rounded-3xl bg-gradient-to-r from-[#151C31] via-[#2A1D2D] to-[#151C31] border border-[#27324A] overflow-hidden">
        <div className="absolute top-0 right-0 w-96 h-96 bg-[#EF4444]/15 rounded-full blur-3xl pointer-events-none" />

        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div>
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#EF4444]/15 text-[#EF4444] border border-[#EF4444]/30 text-xs font-semibold mb-3">
              <ShieldCheck className="w-3.5 h-3.5" />
              <span>Platform Governance & System Administration</span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
              Administrator Dashboard
            </h1>
            <p className="text-xs sm:text-sm text-[#94A3B8] mt-1.5 max-w-xl leading-relaxed">
              Global system monitoring, database telemetry, role-based user governance, and catalog oversight.
            </p>
          </div>

          <div className="flex items-center gap-3">
            <Badge variant="green" size="sm" dot>
              PostgreSQL Healthy
            </Badge>
            <Badge variant="purple" size="sm">
              Node v24 Engine
            </Badge>
          </div>
        </div>
      </div>

      {/* 2. Key System Telemetry (4 Live StatCards) */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatCard
          title="Platform Users"
          value={`${stats?.total_users || 0}`}
          change={`${stats?.total_students || 0} students • ${stats?.total_instructors || 0} instructors`}
          trend="up"
          subtitle="Registered accounts"
          icon={<Users className="w-6 h-6 text-[#A78BFA]" />}
          iconBg="bg-[#7C5CFC]/15 text-[#A78BFA] border-[#7C5CFC]/30"
        />

        <StatCard
          title="Platform Courses"
          value={`${stats?.total_courses || 0} Courses`}
          change={`${stats?.published_courses || 0} live • ${stats?.draft_courses || 0} drafts`}
          trend="neutral"
          subtitle="Curriculum catalog"
          icon={<BookOpen className="w-6 h-6 text-[#22C55E]" />}
          iconBg="bg-[#22C55E]/15 text-[#22C55E] border-[#22C55E]/30"
        />

        <StatCard
          title="Total Enrollments"
          value={`${stats?.total_enrollments || 0}`}
          change={`${stats?.total_certificates_issued || 0} certificates`}
          trend="up"
          subtitle="Active learning"
          icon={<Award className="w-6 h-6 text-[#F59E0B]" />}
          iconBg="bg-[#F59E0B]/15 text-[#F59E0B] border-[#F59E0B]/30"
        />

        <StatCard
          title="Database Latency"
          value={`${stats?.dbLatencyMs || 1.2} ms`}
          change={`Pool: ${stats?.activePoolClients || 1} active clients`}
          trend="up"
          subtitle="Optimal query speed"
          icon={<Database className="w-6 h-6 text-[#38BDF8]" />}
          iconBg="bg-[#38BDF8]/15 text-[#38BDF8] border-[#38BDF8]/30"
        />
      </div>

      {/* 3. Navigation Tabs (User Governance vs Course Governance) */}
      <div className="flex items-center gap-3 border-b border-[#27324A]/60 pb-3">
        <button
          onClick={() => setActiveTab('users')}
          className={`flex items-center gap-2 text-xs font-semibold px-4 py-2 rounded-xl transition cursor-pointer ${
            activeTab === 'users'
              ? 'bg-[#EF4444] text-white shadow-md shadow-[#EF4444]/25'
              : 'text-[#CBD5E1] hover:text-white hover:bg-[#151C31]'
          }`}
        >
          <Users className="w-4 h-4" />
          <span>User Accounts Governance</span>
          <span className="text-[10px] px-1.5 py-0.5 rounded-full bg-black/30 font-mono">
            {stats?.total_users || 0}
          </span>
        </button>

        <button
          onClick={() => setActiveTab('courses')}
          className={`flex items-center gap-2 text-xs font-semibold px-4 py-2 rounded-xl transition cursor-pointer ${
            activeTab === 'courses'
              ? 'bg-[#EF4444] text-white shadow-md shadow-[#EF4444]/25'
              : 'text-[#CBD5E1] hover:text-white hover:bg-[#151C31]'
          }`}
        >
          <BookOpen className="w-4 h-4" />
          <span>Catalog Governance</span>
          <span className="text-[10px] px-1.5 py-0.5 rounded-full bg-black/30 font-mono">
            {courses.length}
          </span>
        </button>
      </div>

      {/* Tab 1: User Accounts Governance Table */}
      {activeTab === 'users' && (
        <Card className="bg-[#151C31] border-[#27324A] overflow-hidden space-y-4">
          {/* Table Header Filter Controls */}
          <div className="p-6 pb-2 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div className="w-full sm:w-72">
              <Input
                placeholder="Search by name or email..."
                leftIcon={<Search className="w-4 h-4" />}
                value={search}
                onChange={(e) => {
                  setSearch(e.target.value);
                  setPage(1);
                }}
              />
            </div>

            <div className="flex items-center gap-3">
              <div className="w-40">
                <Select
                  value={roleFilter}
                  onChange={(e) => {
                    setRoleFilter(e.target.value);
                    setPage(1);
                  }}
                  options={[
                    { value: 'all', label: 'All Roles' },
                    { value: 'student', label: 'Students' },
                    { value: 'instructor', label: 'Instructors' },
                    { value: 'admin', label: 'Admins' },
                  ]}
                />
              </div>

              {(search || roleFilter !== 'all') && (
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => {
                    setSearch('');
                    setRoleFilter('all');
                    setPage(1);
                  }}
                  leftIcon={<RotateCcw className="w-3.5 h-3.5" />}
                >
                  Reset
                </Button>
              )}
            </div>
          </div>

          {/* Table */}
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-[#10182B]/80 text-[#94A3B8] uppercase font-mono tracking-wider border-y border-[#27324A]/60">
                <tr>
                  <th className="py-3 px-6">User / Account</th>
                  <th className="py-3 px-4">Role</th>
                  <th className="py-3 px-4">Status</th>
                  <th className="py-3 px-4">Created Date</th>
                  <th className="py-3 px-6 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#27324A]/40 text-[#CBD5E1]">
                {users.map((userItem) => (
                  <tr key={userItem.id} className="hover:bg-[#10182B]/40 transition">
                    <td className="py-4 px-6">
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 rounded-xl bg-gradient-to-tr from-[#7C5CFC] to-[#A78BFA] text-white flex items-center justify-center font-bold text-xs shrink-0">
                          {userItem.first_name ? userItem.first_name.charAt(0) : 'U'}
                        </div>
                        <div>
                          <p className="font-semibold text-white">
                            {userItem.first_name} {userItem.last_name}
                          </p>
                          <p className="text-[11px] text-[#94A3B8] font-mono">{userItem.email}</p>
                        </div>
                      </div>
                    </td>

                    <td className="py-4 px-4">
                      <Badge variant={roleBadgeMap[userItem.role] || 'neutral'} size="xs" dot>
                        {userItem.role}
                      </Badge>
                    </td>

                    <td className="py-4 px-4">
                      <Badge variant={userItem.is_active ? 'green' : 'red'} size="xs">
                        {userItem.is_active ? 'Active' : 'Suspended'}
                      </Badge>
                    </td>

                    <td className="py-4 px-4 font-mono text-[11px] text-[#94A3B8]">
                      {new Date(userItem.created_at).toLocaleDateString()}
                    </td>

                    <td className="py-4 px-6 text-right space-x-2 whitespace-nowrap">
                      {/* Change Role Dropdown / Selector */}
                      <select
                        value={userItem.role}
                        onChange={(e) => handleChangeRole(userItem.id, e.target.value)}
                        className="bg-[#10182B] text-xs text-[#CBD5E1] border border-[#27324A] rounded-lg px-2 py-1 outline-none cursor-pointer hover:border-[#7C5CFC]"
                      >
                        <option value="student">Set Student</option>
                        <option value="instructor">Set Instructor</option>
                        <option value="admin">Set Admin</option>
                      </select>

                      <Button
                        variant={userItem.is_active ? 'danger' : 'success'}
                        size="xs"
                        onClick={() => handleToggleStatus(userItem)}
                      >
                        {userItem.is_active ? 'Suspend' : 'Activate'}
                      </Button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Pagination */}
          {pagination.totalPages > 1 && (
            <div className="p-4 border-t border-[#27324A]/60 flex items-center justify-between text-xs">
              <span className="text-[#94A3B8]">
                Page <span className="font-semibold text-white">{pagination.currentPage}</span> of{' '}
                <span className="font-semibold text-white">{pagination.totalPages}</span>
              </span>

              <div className="flex items-center gap-2">
                <Button
                  variant="secondary"
                  size="xs"
                  disabled={pagination.currentPage <= 1}
                  onClick={() => setPage((prev) => Math.max(1, prev - 1))}
                  leftIcon={<ChevronLeft className="w-3.5 h-3.5" />}
                >
                  Previous
                </Button>
                <Button
                  variant="secondary"
                  size="xs"
                  disabled={pagination.currentPage >= pagination.totalPages}
                  onClick={() => setPage((prev) => Math.min(pagination.totalPages, prev + 1))}
                  rightIcon={<ChevronRight className="w-3.5 h-3.5" />}
                >
                  Next
                </Button>
              </div>
            </div>
          )}
        </Card>
      )}

      {/* Tab 2: Catalog Governance Table */}
      {activeTab === 'courses' && (
        <Card className="bg-[#151C31] border-[#27324A] overflow-hidden space-y-4">
          <div className="p-6 border-b border-[#27324A]/60 flex items-center justify-between">
            <div>
              <h3 className="text-base font-bold text-white tracking-tight">
                Platform Courses & Publication Governance
              </h3>
              <p className="text-xs text-[#94A3B8] mt-0.5">
                Inspect, review, and toggle live catalog publication for all instructor curriculums.
              </p>
            </div>
            <Badge variant="purple" size="sm">
              {courses.length} Total Courses
            </Badge>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-[#10182B]/80 text-[#94A3B8] uppercase font-mono tracking-wider border-b border-[#27324A]/60">
                <tr>
                  <th className="py-3 px-6">Course</th>
                  <th className="py-3 px-4">Instructor</th>
                  <th className="py-3 px-4">Difficulty</th>
                  <th className="py-3 px-4">Status</th>
                  <th className="py-3 px-4">Enrollments</th>
                  <th className="py-3 px-6 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#27324A]/40 text-[#CBD5E1]">
                {courses.map((courseItem) => (
                  <tr key={courseItem.id} className="hover:bg-[#10182B]/40 transition">
                    <td className="py-4 px-6">
                      <p className="font-semibold text-white text-sm truncate max-w-sm">
                        {courseItem.title}
                      </p>
                      <p className="text-[11px] text-[#94A3B8] font-mono truncate max-w-xs">
                        ID: {courseItem.id}
                      </p>
                    </td>

                    <td className="py-4 px-4 text-[#CBD5E1]">
                      {courseItem.instructor
                        ? `${courseItem.instructor.firstName} ${courseItem.instructor.lastName}`
                        : 'Instructor'}
                    </td>

                    <td className="py-4 px-4">
                      <Badge variant="purple" size="xs">
                        {courseItem.difficulty_level || 'Intermediate'}
                      </Badge>
                    </td>

                    <td className="py-4 px-4">
                      <Badge
                        variant={courseItem.is_published ? 'green' : 'yellow'}
                        size="xs"
                        dot
                      >
                        {courseItem.is_published ? 'Published' : 'Draft'}
                      </Badge>
                    </td>

                    <td className="py-4 px-4 font-mono text-white">
                      {courseItem.enrollment_count || 0}
                    </td>

                    <td className="py-4 px-6 text-right space-x-2 whitespace-nowrap">
                      <Button
                        variant={courseItem.is_published ? 'danger' : 'success'}
                        size="xs"
                        onClick={() => handleToggleCoursePublish(courseItem)}
                      >
                        {courseItem.is_published ? 'Unpublish' : 'Publish'}
                      </Button>

                      <a href={`/courses/${courseItem.id}`} target="_blank" rel="noreferrer">
                        <Button variant="secondary" size="xs">
                          Inspect
                        </Button>
                      </a>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </Card>
      )}
    </div>
  );
}

export default AdminDashboard;
