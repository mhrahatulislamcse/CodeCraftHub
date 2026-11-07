import React from 'react';
import { Link, Outlet } from 'react-router-dom';
import { Code2, Sparkles, CheckCircle2, ShieldCheck, Terminal } from 'lucide-react';
import ToastContainer from '../components/feedback/ToastContainer.jsx';

export function AuthLayout({ children, title, subtitle }) {
  return (
    <div className="min-h-screen bg-[#0B1020] text-[#F8FAFC] flex selection:bg-[#7C5CFC] selection:text-white">
      <ToastContainer />

      {/* Left Hero Panel (Desktop) */}
      <div className="hidden lg:flex lg:w-1/2 relative bg-[#151C31] border-r border-[#27324A] flex-col justify-between p-12 overflow-hidden">
        {/* Ambient radial glows */}
        <div className="absolute top-0 -left-20 w-96 h-96 bg-[#7C5CFC]/20 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute bottom-10 right-0 w-80 h-80 bg-[#A78BFA]/10 rounded-full blur-3xl pointer-events-none" />

        {/* Brand header */}
        <div className="relative z-10">
          <Link to="/" className="flex items-center gap-3">
            <div className="w-11 h-11 rounded-xl bg-gradient-to-tr from-[#7C5CFC] to-[#A78BFA] flex items-center justify-center shadow-lg shadow-[#7C5CFC]/30">
              <Code2 className="w-6 h-6 text-white" />
            </div>
            <div>
              <span className="text-xl font-bold tracking-tight text-white">
                CodeCraftHub
              </span>
              <p className="text-xs text-[#94A3B8]">Learn Smarter. Build Better. Grow Faster.</p>
            </div>
          </Link>
        </div>

        {/* Value Proposition Highlights */}
        <div className="relative z-10 max-w-lg space-y-8 my-auto py-12">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#7C5CFC]/15 text-[#A78BFA] border border-[#7C5CFC]/30 text-xs font-semibold">
            <Sparkles className="w-3.5 h-3.5" />
            <span>Personalized Developer Learning Platform</span>
          </div>

          <h1 className="text-4xl font-extrabold tracking-tight text-white leading-tight">
            Level up your engineering career with tailored learning.
          </h1>

          <p className="text-sm text-[#CBD5E1] leading-relaxed">
            From hands-on database architectures to reactive frontend frameworks, CodeCraftHub analyzes your current skills and recommends the fastest path to mastery.
          </p>

          <div className="space-y-4 pt-2">
            {[
              {
                title: 'Structured Full-Stack Curriculum',
                desc: 'Real production codebases, PostgreSQL migrations, and architectural design patterns.',
              },
              {
                title: 'AI-Powered Skill Gap Analysis',
                desc: 'Dynamic learning pathways mapped to your exact background and target goals.',
              },
              {
                title: 'Verifiable Developer Certificates',
                desc: 'Earn tamper-proof credentials with unique verification codes upon course completion.',
              },
            ].map((feature, i) => (
              <div key={i} className="flex items-start gap-3.5">
                <div className="w-6 h-6 rounded-lg bg-[#7C5CFC]/20 text-[#A78BFA] border border-[#7C5CFC]/40 flex items-center justify-center shrink-0 mt-0.5">
                  <CheckCircle2 className="w-4 h-4" />
                </div>
                <div>
                  <h4 className="text-xs font-semibold text-[#F8FAFC]">{feature.title}</h4>
                  <p className="text-xs text-[#94A3B8] mt-0.5">{feature.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Testimonial footer */}
        <div className="relative z-10 p-5 rounded-2xl bg-[#10182B]/80 border border-[#27324A] backdrop-blur-md">
          <p className="text-xs text-[#CBD5E1] italic">
            &ldquo;CodeCraftHub transformed how our engineering team upskills. The AI course recommendations are remarkably precise and saved us weeks of guesswork.&rdquo;
          </p>
          <div className="mt-3 flex items-center gap-2.5">
            <div className="w-7 h-7 rounded-full bg-[#7C5CFC]/30 text-[#A78BFA] flex items-center justify-center font-bold text-xs">
              M
            </div>
            <div>
              <p className="text-xs font-semibold text-white">Marcus Vance</p>
              <p className="text-[10px] text-[#94A3B8]">Senior Full-Stack Engineer</p>
            </div>
          </div>
        </div>
      </div>

      {/* Right Form Panel */}
      <div className="w-full lg:w-1/2 flex flex-col justify-center items-center p-6 sm:p-12 relative">
        <div className="w-full max-w-md">
          {/* Mobile brand header */}
          <div className="lg:hidden mb-8 text-center">
            <Link to="/" className="inline-flex items-center gap-2.5">
              <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-[#7C5CFC] to-[#A78BFA] flex items-center justify-center shadow-lg shadow-[#7C5CFC]/30">
                <Code2 className="w-5 h-5 text-white" />
              </div>
              <span className="text-lg font-bold text-white">CodeCraftHub</span>
            </Link>
          </div>

          {(title || subtitle) && (
            <div className="mb-8">
              {title && <h2 className="text-2xl font-bold text-white tracking-tight">{title}</h2>}
              {subtitle && <p className="text-xs text-[#94A3B8] mt-1.5">{subtitle}</p>}
            </div>
          )}

          {children || <Outlet />}
        </div>
      </div>
    </div>
  );
}

export default AuthLayout;

