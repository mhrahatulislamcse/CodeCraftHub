import React, { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext.jsx';
import { useNotification } from '../contexts/NotificationContext.jsx';
import AuthLayout from '../layouts/AuthLayout.jsx';
import Input from '../components/common/Input.jsx';
import Button from '../components/common/Button.jsx';
import { Mail, Lock, ArrowRight, ShieldCheck, Sparkles } from 'lucide-react';

export function Login() {
  const { login } = useAuth();
  const { toast } = useNotification();
  const navigate = useNavigate();
  const location = useLocation();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);

    if (!email || !password) {
      setError('Please provide both email and password.');
      return;
    }

    try {
      setLoading(true);
      const user = await login(email, password);
      toast.success(`Welcome back, ${user.firstName}!`);
      
      const destination = location.state?.from?.pathname || 
        (user.role === 'admin' ? '/admin/dashboard' : user.role === 'instructor' ? '/instructor/dashboard' : '/dashboard');
      
      navigate(destination, { replace: true });
    } catch (err) {
      const msg = err.response?.data?.message || err.message || 'Invalid credentials';
      setError(msg);
      toast.error(msg);
    } finally {
      setLoading(false);
    }
  };

  // Demo auto-fill helper
  const fillCredentials = (demoEmail, demoPass) => {
    setEmail(demoEmail);
    setPassword(demoPass);
    setError(null);
  };

  return (
    <AuthLayout
      title="Welcome back"
      subtitle="Sign in to resume your developer courses and track learning milestones."
    >
      <form onSubmit={handleSubmit} className="space-y-4">
        {error && (
          <div className="p-3.5 rounded-xl bg-[#EF4444]/15 border border-[#EF4444]/30 text-xs text-[#EF4444] leading-relaxed">
            {error}
          </div>
        )}

        <Input
          label="Email Address"
          type="email"
          placeholder="your.email@example.com"
          leftIcon={<Mail className="w-4 h-4" />}
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
        />

        <div>
          <div className="flex items-center justify-between mb-1.5">
            <label className="text-xs font-medium text-[#CBD5E1]">Password</label>
            <Link
              to="/forgot-password"
              className="text-xs text-[#A78BFA] hover:text-white transition"
            >
              Forgot password?
            </Link>
          </div>
          <Input
            type="password"
            placeholder="••••••••"
            leftIcon={<Lock className="w-4 h-4" />}
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
        </div>

        <Button
          type="submit"
          variant="primary"
          className="w-full mt-2"
          loading={loading}
          rightIcon={<ArrowRight className="w-4 h-4" />}
        >
          Sign In to CodeCraftHub
        </Button>
      </form>

      {/* Quick demo login shortcuts */}
      <div className="mt-8 pt-6 border-t border-[#27324A]/60">
        <p className="text-[11px] font-semibold text-[#94A3B8] uppercase tracking-wider mb-2.5 text-center">
          Quick Demo Accounts (Database Seeded)
        </p>
        <div className="grid grid-cols-3 gap-2">
          <button
            type="button"
            onClick={() => fillCredentials('marcus.vance@gmail.com', 'Password123!')}
            className="p-2 rounded-xl bg-[#151C31] hover:bg-[#1D2641] border border-[#27324A] text-left transition"
          >
            <p className="text-xs font-semibold text-white">Student</p>
            <p className="text-[10px] text-[#A78BFA] truncate">Marcus Vance</p>
          </button>

          <button
            type="button"
            onClick={() => fillCredentials('sarah.dr@codecrafthub.dev', 'Password123!')}
            className="p-2 rounded-xl bg-[#151C31] hover:bg-[#1D2641] border border-[#27324A] text-left transition"
          >
            <p className="text-xs font-semibold text-[#F59E0B]">Instructor</p>
            <p className="text-[10px] text-[#94A3B8] truncate">Sarah Drasner</p>
          </button>

          <button
            type="button"
            onClick={() => fillCredentials('admin@codecrafthub.dev', 'Password123!')}
            className="p-2 rounded-xl bg-[#151C31] hover:bg-[#1D2641] border border-[#27324A] text-left transition"
          >
            <p className="text-xs font-semibold text-[#EF4444]">Admin</p>
            <p className="text-[10px] text-[#94A3B8] truncate">Super Administrator</p>
          </button>
        </div>
      </div>

      <p className="text-xs text-[#94A3B8] text-center mt-6">
        Don&apos;t have an account yet?{' '}
        <Link to="/register" className="font-semibold text-[#A78BFA] hover:text-white transition">
          Create student account
        </Link>
      </p>
    </AuthLayout>
  );
}

export default Login;

