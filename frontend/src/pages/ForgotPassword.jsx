import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import AuthLayout from '../layouts/AuthLayout.jsx';
import Input from '../components/common/Input.jsx';
import Button from '../components/common/Button.jsx';
import { Mail, ArrowLeft, Send } from 'lucide-react';
import { useNotification } from '../contexts/NotificationContext.jsx';
import api from '../services/api.js';

export function ForgotPassword() {
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const { toast } = useNotification();

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!email) return;

    try {
      setLoading(true);
      await api.post('/auth/forgot-password', { email });
      setSubmitted(true);
      toast.success('Password reset instructions sent if email exists.');
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to submit reset request.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <AuthLayout
      title="Reset your password"
      subtitle="Enter the email associated with your CodeCraftHub account."
    >
      {submitted ? (
        <div className="p-6 rounded-2xl bg-[#151C31] border border-[#27324A] text-center space-y-4">
          <div className="w-12 h-12 rounded-full bg-[#22C55E]/15 text-[#22C55E] flex items-center justify-center mx-auto">
            <Send className="w-6 h-6" />
          </div>
          <h3 className="text-base font-semibold text-white">Reset Link Dispatched</h3>
          <p className="text-xs text-[#CBD5E1] leading-relaxed">
            If an account is associated with <span className="font-semibold text-white">{email}</span>, you will receive a secure password recovery token link shortly.
          </p>
          <Link to="/login" className="inline-block pt-2">
            <Button variant="secondary" size="sm" leftIcon={<ArrowLeft className="w-4 h-4" />}>
              Back to Sign In
            </Button>
          </Link>
        </div>
      ) : (
        <form onSubmit={handleSubmit} className="space-y-4">
          <Input
            label="Email Address"
            type="email"
            placeholder="developer@example.com"
            leftIcon={<Mail className="w-4 h-4" />}
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />

          <Button
            type="submit"
            variant="primary"
            className="w-full mt-2"
            loading={loading}
            rightIcon={<Send className="w-4 h-4" />}
          >
            Send Recovery Link
          </Button>

          <div className="text-center pt-4">
            <Link
              to="/login"
              className="text-xs text-[#CBD5E1] hover:text-white transition inline-flex items-center gap-1.5"
            >
              <ArrowLeft className="w-3.5 h-3.5" /> Back to Sign In
            </Link>
          </div>
        </form>
      )}
    </AuthLayout>
  );
}

export default ForgotPassword;

