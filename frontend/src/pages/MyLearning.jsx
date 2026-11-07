import React, { useState, useEffect } from 'react';
import { useSearchParams, Link } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext.jsx';
import { useNotification } from '../contexts/NotificationContext.jsx';
import enrollmentService from '../services/enrollmentService.js';
import certificateService from '../services/certificateService.js';
import CourseCard from '../components/cards/CourseCard.jsx';
import Card, { CardHeader, CardTitle, CardContent } from '../components/common/Card.jsx';
import Badge from '../components/common/Badge.jsx';
import Button from '../components/common/Button.jsx';
import Modal from '../components/common/Modal.jsx';
import Spinner from '../components/feedback/Spinner.jsx';
import {
  GraduationCap,
  Award,
  BookOpen,
  CheckCircle2,
  Clock,
  Printer,
  ExternalLink,
  ShieldCheck,
  Search,
  ArrowRight,
  Sparkles,
  Calendar
} from 'lucide-react';

export function MyLearning() {
  const [searchParams, setSearchParams] = useSearchParams();
  const { user } = useAuth();
  const { toast } = useNotification();

  // Active tab state: 'in-progress' | 'completed' | 'certificates'
  const currentTab = searchParams.get('tab') || 'in-progress';
  const [activeTab, setActiveTab] = useState(currentTab);

  const [enrollments, setEnrollments] = useState([]);
  const [certificates, setCertificates] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedCert, setSelectedCert] = useState(null);

  useEffect(() => {
    let isMounted = true;

    const loadData = async () => {
      try {
        setLoading(true);

        const [enrollmentRes, certRes] = await Promise.all([
          enrollmentService.getMyEnrollments(),
          certificateService.getMyCertificates(),
        ]);

        if (!isMounted) return;

        setEnrollments(enrollmentRes.enrollments || []);
        setCertificates(certRes || []);
      } catch (err) {
        console.error('Failed to load my-learning data:', err);
        toast.error('Failed to load enrolled courses or certificates.');
      } finally {
        if (isMounted) {
          setLoading(false);
        }
      }
    };

    loadData();

    return () => {
      isMounted = false;
    };
  }, [toast]);

  const handleTabChange = (tab) => {
    setActiveTab(tab);
    setSearchParams({ tab });
  };

  const inProgressEnrollments = enrollments.filter(
    (e) => e.status === 'active' && Number(e.progress_percentage || 0) < 100
  );

  const completedEnrollments = enrollments.filter(
    (e) => e.status === 'completed' || Number(e.progress_percentage || 0) >= 100
  );

  const handlePrintCertificate = () => {
    window.print();
  };

  if (loading) {
    return (
      <div className="min-h-[60vh] flex flex-col items-center justify-center gap-3">
        <Spinner size="lg" color="purple" />
        <p className="text-xs text-[#94A3B8] font-mono">Loading enrolled courses and credentials...</p>
      </div>
    );
  }

  return (
    <div className="space-y-8 pb-16">
      {/* Header Banner */}
      <div className="relative p-6 sm:p-8 rounded-3xl bg-gradient-to-r from-[#151C31] via-[#1A233D] to-[#151C31] border border-[#27324A] overflow-hidden">
        <div className="absolute top-0 right-0 w-80 h-80 bg-[#7C5CFC]/15 rounded-full blur-3xl pointer-events-none" />

        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div>
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#7C5CFC]/20 text-[#A78BFA] border border-[#7C5CFC]/40 text-xs font-semibold mb-3">
              <GraduationCap className="w-3.5 h-3.5" />
              <span>Learner Progression & Credentials</span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
              My Learning & Certificates
            </h1>
            <p className="text-xs sm:text-sm text-[#94A3B8] mt-1.5 max-w-xl leading-relaxed">
              Track active courses, resume lesson workspaces, and access cryptographically verified credentials.
            </p>
          </div>

          <Link to="/courses">
            <Button variant="secondary" size="sm" leftIcon={<BookOpen className="w-4 h-4" />}>
              Explore More Courses
            </Button>
          </Link>
        </div>
      </div>

      {/* Tabs Bar */}
      <div className="flex items-center gap-3 border-b border-[#27324A]/60 pb-3">
        <button
          onClick={() => handleTabChange('in-progress')}
          className={`flex items-center gap-2 text-xs font-semibold px-4 py-2 rounded-xl transition cursor-pointer ${
            activeTab === 'in-progress'
              ? 'bg-[#7C5CFC] text-white shadow-md shadow-[#7C5CFC]/25'
              : 'text-[#CBD5E1] hover:text-white hover:bg-[#151C31]'
          }`}
        >
          <span>In Progress</span>
          <span className="text-[10px] px-1.5 py-0.5 rounded-full bg-black/30 font-mono">
            {inProgressEnrollments.length}
          </span>
        </button>

        <button
          onClick={() => handleTabChange('completed')}
          className={`flex items-center gap-2 text-xs font-semibold px-4 py-2 rounded-xl transition cursor-pointer ${
            activeTab === 'completed'
              ? 'bg-[#7C5CFC] text-white shadow-md shadow-[#7C5CFC]/25'
              : 'text-[#CBD5E1] hover:text-white hover:bg-[#151C31]'
          }`}
        >
          <span>Completed</span>
          <span className="text-[10px] px-1.5 py-0.5 rounded-full bg-black/30 font-mono">
            {completedEnrollments.length}
          </span>
        </button>

        <button
          onClick={() => handleTabChange('certificates')}
          className={`flex items-center gap-2 text-xs font-semibold px-4 py-2 rounded-xl transition cursor-pointer ${
            activeTab === 'certificates'
              ? 'bg-[#7C5CFC] text-white shadow-md shadow-[#7C5CFC]/25'
              : 'text-[#CBD5E1] hover:text-white hover:bg-[#151C31]'
          }`}
        >
          <Award className="w-4 h-4" />
          <span>Certificates</span>
          <span className="text-[10px] px-1.5 py-0.5 rounded-full bg-black/30 font-mono">
            {certificates.length}
          </span>
        </button>
      </div>

      {/* Tab 1: In Progress Courses */}
      {activeTab === 'in-progress' && (
        <div>
          {inProgressEnrollments.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {inProgressEnrollments.map((enr) => (
                <CourseCard
                  key={enr.id}
                  course={{
                    id: enr.course_id,
                    title: enr.course_title,
                    description: enr.course_description,
                    thumbnailUrl: enr.thumbnail_url,
                    difficulty: enr.difficulty_level,
                    estimated_hours: enr.estimated_hours,
                    instructor: enr.instructor,
                  }}
                  progress={Number(enr.progress_percentage || 0)}
                />
              ))}
            </div>
          ) : (
            <div className="p-12 rounded-3xl bg-[#151C31] border border-[#27324A] text-center space-y-4 max-w-lg mx-auto">
              <div className="w-14 h-14 rounded-2xl bg-[#7C5CFC]/15 text-[#A78BFA] border border-[#7C5CFC]/30 flex items-center justify-center mx-auto">
                <BookOpen className="w-7 h-7" />
              </div>
              <h3 className="text-lg font-bold text-white">No Courses Currently in Progress</h3>
              <p className="text-xs text-[#CBD5E1] leading-relaxed">
                You have finished all enrolled tracks or haven&apos;t started one yet. Browse our course catalog to advance your skills.
              </p>
              <Link to="/courses" className="inline-block pt-2">
                <Button variant="primary" size="sm" rightIcon={<ArrowRight className="w-4 h-4" />}>
                  Discover New Courses
                </Button>
              </Link>
            </div>
          )}
        </div>
      )}

      {/* Tab 2: Completed Courses */}
      {activeTab === 'completed' && (
        <div>
          {completedEnrollments.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {completedEnrollments.map((enr) => (
                <CourseCard
                  key={enr.id}
                  course={{
                    id: enr.course_id,
                    title: enr.course_title,
                    description: enr.course_description,
                    thumbnailUrl: enr.thumbnail_url,
                    difficulty: enr.difficulty_level,
                    estimated_hours: enr.estimated_hours,
                    instructor: enr.instructor,
                  }}
                  progress={100}
                />
              ))}
            </div>
          ) : (
            <div className="p-12 rounded-3xl bg-[#151C31] border border-[#27324A] text-center space-y-4 max-w-lg mx-auto">
              <div className="w-14 h-14 rounded-2xl bg-[#22C55E]/15 text-[#22C55E] border border-[#22C55E]/30 flex items-center justify-center mx-auto">
                <Award className="w-7 h-7" />
              </div>
              <h3 className="text-lg font-bold text-white">No Completed Courses Yet</h3>
              <p className="text-xs text-[#CBD5E1] leading-relaxed">
                Complete all lessons in any course track to graduate and earn an official verifiable certificate.
              </p>
              <Button variant="secondary" size="sm" onClick={() => handleTabChange('in-progress')}>
                Continue In-Progress Courses
              </Button>
            </div>
          )}
        </div>
      )}

      {/* Tab 3: Verified Certificates */}
      {activeTab === 'certificates' && (
        <div>
          {certificates.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {certificates.map((cert) => {
                const metadata = typeof cert.metadata_json === 'string'
                  ? JSON.parse(cert.metadata_json)
                  : cert.metadata_json || {};

                return (
                  <Card
                    key={cert.id}
                    className="p-6 bg-[#151C31] border-[#27324A] hover:border-[#7C5CFC]/50 transition-all flex flex-col justify-between space-y-6"
                  >
                    <div>
                      <div className="flex items-center justify-between pb-3 border-b border-[#27324A]/40">
                        <div className="flex items-center gap-2">
                          <Award className="w-5 h-5 text-[#22C55E]" />
                          <span className="text-xs font-bold text-white uppercase tracking-wider">
                            Verified Certificate
                          </span>
                        </div>
                        <span className="text-[10px] font-mono font-semibold px-2 py-0.5 rounded bg-[#22C55E]/15 text-[#22C55E] border border-[#22C55E]/30">
                          ISSUED
                        </span>
                      </div>

                      <h3 className="text-lg font-bold text-white mt-4">
                        {cert.course_title || metadata.courseTitle}
                      </h3>

                      <p className="text-xs text-[#94A3B8] mt-1">
                        Awarded to:{' '}
                        <span className="font-semibold text-white">
                          {metadata.studentName || `${user?.firstName} ${user?.lastName}`}
                        </span>
                      </p>

                      <div className="mt-4 p-3 rounded-xl bg-[#10182B] border border-[#27324A] flex items-center justify-between text-xs font-mono">
                        <span className="text-[#94A3B8]">Verification ID:</span>
                        <span className="text-[#A78BFA] font-bold">{cert.certificate_code}</span>
                      </div>
                    </div>

                    <div className="pt-4 border-t border-[#27324A]/40 flex items-center justify-between">
                      <span className="text-xs text-[#94A3B8] flex items-center gap-1">
                        <Calendar className="w-3.5 h-3.5" />
                        {new Date(cert.issued_at).toLocaleDateString()}
                      </span>

                      <Button
                        variant="primary"
                        size="xs"
                        leftIcon={<ExternalLink className="w-3.5 h-3.5" />}
                        onClick={() => setSelectedCert(cert)}
                      >
                        View Certificate
                      </Button>
                    </div>
                  </Card>
                );
              })}
            </div>
          ) : (
            <div className="p-12 rounded-3xl bg-[#151C31] border border-[#27324A] text-center space-y-4 max-w-lg mx-auto">
              <div className="w-14 h-14 rounded-2xl bg-[#7C5CFC]/15 text-[#A78BFA] border border-[#7C5CFC]/30 flex items-center justify-center mx-auto">
                <ShieldCheck className="w-7 h-7" />
              </div>
              <h3 className="text-lg font-bold text-white">No Certificates Earned Yet</h3>
              <p className="text-xs text-[#CBD5E1] leading-relaxed">
                When you complete 100% of the lessons in a curriculum, CodeCraftHub issues a cryptographically verifiable completion certificate.
              </p>
              <Button variant="primary" size="sm" onClick={() => handleTabChange('in-progress')}>
                Resume Current Courses
              </Button>
            </div>
          )}
        </div>
      )}

      {/* Official Certificate Presentation Modal */}
      {selectedCert && (
        <Modal
          isOpen={!!selectedCert}
          onClose={() => setSelectedCert(null)}
          title="Official Certificate of Completion"
          subtitle={`Verification Code: ${selectedCert.certificate_code}`}
          size="lg"
          footer={
            <div className="flex items-center gap-3">
              <Button variant="secondary" size="sm" onClick={() => setSelectedCert(null)}>
                Close
              </Button>
              <Button
                variant="primary"
                size="sm"
                leftIcon={<Printer className="w-4 h-4" />}
                onClick={handlePrintCertificate}
              >
                Print Certificate
              </Button>
            </div>
          }
        >
          {/* Printable Formal Certificate Layout */}
          <div className="p-8 sm:p-12 rounded-2xl bg-gradient-to-br from-[#10182B] via-[#151C31] to-[#10182B] border-2 border-[#7C5CFC]/40 text-center space-y-6 relative overflow-hidden print:bg-white print:text-black">
            {/* Ambient watermarks */}
            <div className="absolute top-0 right-0 w-64 h-64 bg-[#7C5CFC]/10 rounded-full blur-3xl pointer-events-none" />

            <div className="space-y-2">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#7C5CFC]/20 text-[#A78BFA] border border-[#7C5CFC]/40 text-xs font-semibold mb-2">
                <Sparkles className="w-3.5 h-3.5" />
                <span>CodeCraftHub Developer LMS</span>
              </div>
              <h2 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight uppercase">
                Certificate of Mastery
              </h2>
              <p className="text-xs text-[#94A3B8]">
                Issued in recognition of successful curriculum completion
              </p>
            </div>

            <div className="py-4">
              <p className="text-xs text-[#CBD5E1] italic">This certifies that</p>
              <h3 className="text-2xl font-bold text-[#A78BFA] mt-2 underline decoration-[#7C5CFC]/40 underline-offset-8">
                {selectedCert.metadata_json?.studentName || `${user?.firstName} ${user?.lastName}`}
              </h3>
              <p className="text-xs text-[#CBD5E1] italic mt-4">
                has demonstrated software engineering competency by completing
              </p>
              <h4 className="text-xl font-bold text-white mt-2">
                {selectedCert.course_title || selectedCert.metadata_json?.courseTitle}
              </h4>
            </div>

            <div className="pt-6 border-t border-[#27324A]/60 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs">
              <div className="text-left">
                <p className="text-[#94A3B8]">Certified By:</p>
                <p className="font-semibold text-white">
                  {selectedCert.metadata_json?.instructorName || 'CodeCraft Faculty'}
                </p>
                <p className="text-[10px] text-[#A78BFA]">Lead Instructor</p>
              </div>

              <div className="p-3 rounded-xl bg-[#10182B] border border-[#27324A] text-right font-mono text-[11px]">
                <p className="text-[#22C55E] font-bold">VERIFIED AUTHENTIC</p>
                <p className="text-[#94A3B8]">{selectedCert.certificate_code}</p>
                <p className="text-[10px] text-[#94A3B8]">
                  {new Date(selectedCert.issued_at).toLocaleDateString()}
                </p>
              </div>
            </div>
          </div>
        </Modal>
      )}
    </div>
  );
}

export default MyLearning;
