import React, { useState, useEffect } from 'react';
import { useAuth } from '../contexts/AuthContext.jsx';
import { useNotification } from '../contexts/NotificationContext.jsx';
import aiService from '../services/aiService.js';
import courseService from '../services/courseService.js';
import Card, { CardHeader, CardTitle, CardContent } from '../components/common/Card.jsx';
import Badge from '../components/common/Badge.jsx';
import Button from '../components/common/Button.jsx';
import Input from '../components/common/Input.jsx';
import ProgressBar from '../components/common/ProgressBar.jsx';
import CourseCard from '../components/cards/CourseCard.jsx';
import Spinner from '../components/feedback/Spinner.jsx';
import {
  Sparkles,
  Target,
  Brain,
  CheckCircle2,
  AlertTriangle,
  ArrowRight,
  Send,
  Code2,
  Copy,
  Check,
  Zap,
  BookOpen,
  Compass,
  X,
  TrendingUp,
  Cpu,
  Flame,
  Award
} from 'lucide-react';

export function AIRecommendations() {
  const { user } = useAuth();
  const { toast } = useNotification();

  // State
  const [targetRole, setTargetRole] = useState('Full-Stack React & Node Engineer');
  const [customRoleInput, setCustomRoleInput] = useState('');
  const [gapData, setGapData] = useState(null);
  const [savedRecommendations, setSavedRecommendations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [analyzing, setAnalyzing] = useState(false);

  // Concept explainer state
  const [question, setQuestion] = useState('');
  const [explaining, setExplaining] = useState(false);
  const [explanationResult, setExplanationResult] = useState(null);
  const [copiedCode, setCopiedCode] = useState(false);

  const presetRoles = [
    'Full-Stack React & Node Engineer',
    'Backend & Cloud Database Architect',
    'Frontend React Specialist',
    'DevOps & Cloud Engineer',
  ];

  // Initial fetch: Load gap analysis and saved recommendations
  useEffect(() => {
    let isMounted = true;

    const loadData = async () => {
      try {
        setLoading(true);
        const [gapRes, recsRes] = await Promise.all([
          aiService.analyzeSkillGap(targetRole),
          aiService.getMyRecommendations(),
        ]);

        if (!isMounted) return;
        setGapData(gapRes);
        setSavedRecommendations(recsRes || []);
      } catch (err) {
        console.error('Failed to load AI recommendations:', err);
        toast.error('Unable to retrieve AI skill gap data.');
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
  }, [targetRole, toast]);

  // Trigger analysis for a new role
  const handleRoleChange = async (newRole) => {
    setTargetRole(newRole);
    try {
      setAnalyzing(true);
      const res = await aiService.generateRecommendations(newRole);
      setGapData(res.gapAnalysis);
      const updatedRecs = await aiService.getMyRecommendations();
      setSavedRecommendations(updatedRecs);
      toast.success(`Generated personalized learning path for "${newRole}"`);
    } catch (err) {
      toast.error(err.message || 'Analysis failed');
    } finally {
      setAnalyzing(false);
    }
  };

  const handleCustomRoleSubmit = (e) => {
    e.preventDefault();
    if (!customRoleInput.trim()) return;
    handleRoleChange(customRoleInput.trim());
    setCustomRoleInput('');
  };

  // Concept explainer submit
  const handleExplainSubmit = async (e, customTopic) => {
    if (e) e.preventDefault();
    const topicToAsk = customTopic || question;
    if (!topicToAsk.trim()) return;

    try {
      setExplaining(true);
      const res = await aiService.explainConcept(topicToAsk);
      setExplanationResult(res);
      setQuestion('');
    } catch (err) {
      toast.error('Failed to generate technical explanation.');
    } finally {
      setExplaining(false);
    }
  };

  const handleDismissRec = async (id) => {
    try {
      await aiService.dismissRecommendation(id);
      setSavedRecommendations((prev) => prev.filter((r) => r.id !== id));
      toast.info('Recommendation dismissed.');
    } catch {
      toast.error('Could not dismiss recommendation.');
    }
  };

  const handleCopyCode = (code) => {
    navigator.clipboard.writeText(code);
    setCopiedCode(true);
    setTimeout(() => setCopiedCode(false), 2000);
  };

  if (loading) {
    return (
      <div className="min-h-[60vh] flex flex-col items-center justify-center gap-3">
        <Spinner size="lg" color="purple" />
        <p className="text-xs text-[#94A3B8] font-mono">Running neural skill gap analysis...</p>
      </div>
    );
  }

  const matchScore = gapData?.matchScore || 75;
  const verifiedSkills = gapData?.verifiedSkills || [];
  const missingSkills = gapData?.missingSkills || [];
  const recommendedCourses = gapData?.recommendedCourses || [];

  return (
    <div className="space-y-8 pb-16">
      {/* 1. Header Banner */}
      <div className="relative p-6 sm:p-8 rounded-3xl bg-gradient-to-r from-[#151C31] via-[#1D2144] to-[#151C31] border border-[#27324A] overflow-hidden">
        <div className="absolute top-0 right-0 w-96 h-96 bg-[#7C5CFC]/20 rounded-full blur-3xl pointer-events-none" />

        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div>
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#7C5CFC]/20 text-[#A78BFA] border border-[#7C5CFC]/40 text-xs font-semibold mb-3">
              <Sparkles className="w-3.5 h-3.5" />
              <span>Grounded Learning Intelligence</span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
              AI Personalized Recommendations & Skill Gap Engine
            </h1>
            <p className="text-xs sm:text-sm text-[#94A3B8] mt-1.5 max-w-2xl leading-relaxed">
              Our recommendation system evaluates your completed modules, verified skills, and career targets to map the shortest path to technical mastery.
            </p>
          </div>

          <Button
            variant="primary"
            size="md"
            loading={analyzing}
            onClick={() => handleRoleChange(targetRole)}
            leftIcon={<Sparkles className="w-4 h-4" />}
          >
            Regenerate Analysis
          </Button>
        </div>
      </div>

      {/* 2. Target Role Selector */}
      <div className="p-6 rounded-2xl bg-[#151C31] border border-[#27324A] space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
          <h3 className="text-sm font-bold text-white tracking-tight flex items-center gap-2">
            <Target className="w-4 h-4 text-[#A78BFA]" />
            Target Career Goal
          </h3>
          <span className="text-xs text-[#94A3B8]">
            Selected: <span className="font-semibold text-white">{targetRole}</span>
          </span>
        </div>

        {/* Preset Role Badges */}
        <div className="flex items-center gap-2 flex-wrap">
          {presetRoles.map((role) => (
            <button
              key={role}
              onClick={() => handleRoleChange(role)}
              className={`text-xs px-3.5 py-2 rounded-xl font-medium transition cursor-pointer ${
                targetRole === role
                  ? 'bg-[#7C5CFC] text-white shadow-md shadow-[#7C5CFC]/30'
                  : 'bg-[#10182B] text-[#CBD5E1] hover:text-white border border-[#27324A]'
              }`}
            >
              {role}
            </button>
          ))}
        </div>

        {/* Custom Role Input */}
        <form onSubmit={handleCustomRoleSubmit} className="flex items-center gap-3 pt-2">
          <Input
            placeholder="Or type a custom role (e.g. Distributed Systems Engineer)..."
            value={customRoleInput}
            onChange={(e) => setCustomRoleInput(e.target.value)}
          />
          <Button type="submit" variant="secondary" size="md" className="shrink-0">
            Analyze Goal
          </Button>
        </form>
      </div>

      {/* 3. Skill Gap Breakdown & Readiness Meter */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Readiness Meter Card */}
        <Card className="p-6 bg-[#151C31] border-[#27324A] flex flex-col justify-between space-y-4">
          <div>
            <span className="text-xs font-semibold uppercase tracking-wider text-[#94A3B8]">
              Career Readiness Score
            </span>
            <div className="flex items-baseline gap-2 mt-2">
              <span className="text-4xl font-extrabold text-white font-mono">{matchScore}%</span>
              <span className="text-xs text-[#22C55E] font-semibold">
                {gapData?.readinessLevel || 'Proficient'}
              </span>
            </div>

            <div className="mt-4">
              <ProgressBar value={matchScore} variant="green" size="md" />
            </div>

            <p className="text-xs text-[#CBD5E1] mt-3 leading-relaxed">
              You hold <span className="font-semibold text-white">{verifiedSkills.length}</span> of{' '}
              <span className="font-semibold text-white">
                {verifiedSkills.length + missingSkills.length}
              </span>{' '}
              core competency requirements for this role.
            </p>
          </div>

          <div className="pt-4 border-t border-[#27324A]/40 flex items-center justify-between text-xs text-[#94A3B8]">
            <span>Estimated timeframe:</span>
            <span className="font-mono font-bold text-[#A78BFA]">
              ~{gapData?.estimatedWeeks || 6} weeks
            </span>
          </div>
        </Card>

        {/* Verified Skills Mastered */}
        <Card className="p-6 bg-[#151C31] border-[#27324A] space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold uppercase tracking-wider text-[#22C55E] flex items-center gap-1.5">
              <CheckCircle2 className="w-4 h-4 text-[#22C55E]" />
              Verified Competencies ({verifiedSkills.length})
            </span>
          </div>

          <p className="text-xs text-[#94A3B8]">
            Skills verified through your enrolled courses & technical milestone completions.
          </p>

          <div className="flex flex-wrap gap-2 pt-2">
            {verifiedSkills.map((sk, i) => (
              <Badge key={i} variant="green" size="sm" dot>
                {sk.name}
              </Badge>
            ))}
          </div>
        </Card>

        {/* Missing Skills to Master */}
        <Card className="p-6 bg-[#151C31] border-[#27324A] space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold uppercase tracking-wider text-[#F59E0B] flex items-center gap-1.5">
              <AlertTriangle className="w-4 h-4 text-[#F59E0B]" />
              Identified Skill Gaps ({missingSkills.length})
            </span>
          </div>

          <p className="text-xs text-[#94A3B8]">
            Prerequisites recommended to bridge your competency profile to full readiness.
          </p>

          <div className="flex flex-wrap gap-2 pt-2">
            {missingSkills.map((sk, i) => (
              <Badge key={i} variant="yellow" size="sm">
                {sk.name}
              </Badge>
            ))}
          </div>
        </Card>
      </div>

      {/* 4. Structured AI Recommended Learning Pathway */}
      <div className="space-y-4">
        <div className="pb-2 border-b border-[#27324A]/60 flex items-center justify-between">
          <div>
            <h2 className="text-xl font-bold text-white tracking-tight flex items-center gap-2">
              <Compass className="w-5 h-5 text-[#A78BFA]" />
              Recommended Curriculum Pathway
            </h2>
            <p className="text-xs text-[#94A3B8] mt-0.5">
              Ordered curriculum sequence designed to close your skill gap systematically.
            </p>
          </div>
          <Badge variant="purple" size="sm">
            {recommendedCourses.length} Recommended Tracks
          </Badge>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {recommendedCourses.map((course, idx) => (
            <div key={course.id} className="relative flex flex-col">
              {/* Step Sequence Badge */}
              <div className="mb-2 flex items-center gap-2">
                <span className="w-6 h-6 rounded-lg bg-[#7C5CFC]/20 text-[#A78BFA] border border-[#7C5CFC]/40 flex items-center justify-center font-mono text-xs font-bold">
                  {idx + 1}
                </span>
                <span className="text-xs font-semibold text-[#CBD5E1]">
                  Step {idx + 1}: Close Gap in{' '}
                  <span className="text-white">
                    {course.skills?.[0]?.name || 'Core Architecture'}
                  </span>
                </span>
              </div>

              <div className="flex-1">
                <CourseCard course={course} />
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* 5. Active AI Recommendations Feed */}
      {savedRecommendations.length > 0 && (
        <div className="space-y-4">
          <h3 className="text-base font-bold text-white tracking-tight flex items-center gap-2">
            <Cpu className="w-5 h-5 text-[#A78BFA]" />
            Active Personalized Insights
          </h3>

          <div className="space-y-3">
            {savedRecommendations.map((rec) => (
              <div
                key={rec.id}
                className="p-4 rounded-2xl bg-[#151C31] border border-[#27324A] hover:border-[#7C5CFC]/40 transition flex items-start justify-between gap-4"
              >
                <div className="flex items-start gap-3">
                  <div className="w-8 h-8 rounded-xl bg-[#7C5CFC]/20 text-[#A78BFA] flex items-center justify-center shrink-0 mt-0.5">
                    <Sparkles className="w-4 h-4" />
                  </div>
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="text-xs font-bold text-white uppercase tracking-wider">
                        {rec.recommendation_type.replace('_', ' ')}
                      </span>
                      <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-[#22C55E]/15 text-[#22C55E]">
                        {Math.round(Number(rec.confidence_score) * 100)}% Match
                      </span>
                    </div>
                    <p className="text-xs text-[#CBD5E1] mt-1 leading-relaxed">
                      {rec.reason}
                    </p>
                  </div>
                </div>

                <button
                  onClick={() => handleDismissRec(rec.id)}
                  className="text-[#94A3B8] hover:text-white p-1 rounded-lg hover:bg-[#10182B] transition shrink-0"
                  title="Dismiss recommendation"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* 6. Ask CodeCraft AI (Interactive Technical Explainer) */}
      <Card className="p-6 sm:p-8 bg-[#151C31] border-[#27324A] space-y-6">
        <div>
          <h3 className="text-lg font-bold text-white tracking-tight flex items-center gap-2">
            <Brain className="w-5 h-5 text-[#A78BFA]" />
            Ask CodeCraft AI: Technical Concept Explainer
          </h3>
          <p className="text-xs text-[#94A3B8] mt-1">
            Need clarification on database mechanics, concurrency, or frameworks? Get answers grounded in curriculum code.
          </p>
        </div>

        {/* Quick query buttons */}
        <div className="flex items-center gap-2 flex-wrap text-xs">
          <span className="text-[#94A3B8] text-[11px] font-semibold uppercase">Quick Prompts:</span>
          {[
            'Explain PostgreSQL B-Tree vs GIN indexes',
            'How does JWT token rotation work?',
            'What is React 19 Concurrent Rendering?',
          ].map((prompt, i) => (
            <button
              key={i}
              onClick={() => handleExplainSubmit(null, prompt)}
              className="text-xs px-3 py-1.5 rounded-lg bg-[#10182B] text-[#A78BFA] hover:text-white hover:bg-[#1A233D] border border-[#27324A] transition cursor-pointer"
            >
              {prompt}
            </button>
          ))}
        </div>

        {/* Question Form */}
        <form onSubmit={handleExplainSubmit} className="flex items-center gap-3">
          <Input
            placeholder="Ask a technical concept question (e.g. How does WAL prevent data loss?)..."
            value={question}
            onChange={(e) => setQuestion(e.target.value)}
          />
          <Button
            type="submit"
            variant="primary"
            size="md"
            loading={explaining}
            rightIcon={<Send className="w-4 h-4" />}
            className="shrink-0"
          >
            Ask AI
          </Button>
        </form>

        {/* Formatted Explanation Output */}
        {explanationResult && (
          <div className="p-6 rounded-2xl bg-[#10182B] border border-[#7C5CFC]/40 space-y-4 animate-in fade-in duration-200">
            <div className="flex items-center justify-between pb-2 border-b border-[#27324A]/60">
              <span className="text-xs font-bold text-white flex items-center gap-2">
                <Sparkles className="w-4 h-4 text-[#A78BFA]" />
                Technical Explanation: {explanationResult.topic}
              </span>
              <Badge variant="purple" size="xs">
                Grounded Explanation
              </Badge>
            </div>

            <p className="text-xs sm:text-sm text-[#CBD5E1] leading-relaxed">
              {explanationResult.explanation}
            </p>

            {explanationResult.codeExample && (
              <div className="space-y-2 pt-2">
                <div className="flex items-center justify-between text-xs">
                  <span className="font-mono text-[#94A3B8]">Syntax & Production Architecture:</span>
                  <button
                    onClick={() => handleCopyCode(explanationResult.codeExample)}
                    className="inline-flex items-center gap-1 text-[#A78BFA] hover:text-white transition cursor-pointer"
                  >
                    {copiedCode ? <Check className="w-3.5 h-3.5 text-[#22C55E]" /> : <Copy className="w-3.5 h-3.5" />}
                    <span>{copiedCode ? 'Copied!' : 'Copy Code'}</span>
                  </button>
                </div>
                <pre className="p-4 rounded-xl bg-[#0B1020] border border-[#27324A] font-mono text-xs text-[#CBD5E1] overflow-x-auto leading-relaxed">
                  <code>{explanationResult.codeExample}</code>
                </pre>
              </div>
            )}

            {explanationResult.relatedTopics && (
              <div className="pt-2 flex items-center gap-2 flex-wrap text-xs text-[#94A3B8]">
                <span className="font-semibold text-white">Related Concepts:</span>
                {explanationResult.relatedTopics.map((topic, i) => (
                  <button
                    key={i}
                    onClick={() => handleExplainSubmit(null, topic)}
                    className="text-[#A78BFA] hover:underline cursor-pointer"
                  >
                    {topic} {i < explanationResult.relatedTopics.length - 1 && '•'}
                  </button>
                ))}
              </div>
            )}
          </div>
        )}
      </Card>
    </div>
  );
}

export default AIRecommendations;
