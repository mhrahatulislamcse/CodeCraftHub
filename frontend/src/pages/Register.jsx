import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext.jsx';
import { useNotification } from '../contexts/NotificationContext.jsx';
import AuthLayout from '../layouts/AuthLayout.jsx';
import Input from '../components/common/Input.jsx';
import Select from '../components/common/Select.jsx';
import Button from '../components/common/Button.jsx';
import { Mail, Lock, User, ArrowRight, ShieldCheck } from 'lucide-react';

export function Register() {
  const { register } = useAuth();
  const { toast } = useNotification();
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    password: '',
    role: 'student',
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const handleChange = (e) => {
    setFormData((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);

    if (!formData.firstName || !formData.email || !formData.password) {
      setError('Please fill in all required fields.');
      return;
    }

    try {
      setLoading(true);
      await register(formData);
      toast.success('Account created successfully! Welcome to CodeCraftHub.');
      navigate('/dashboard', { replace: true });
    } catch (err) {
      const msg = err.response?.data?.message || err.message || 'Registration failed';
      setError(msg);
      toast.error(msg);
    } finally {
      setLoading(false);
    }
  };

  return (
    <AuthLayout
      title="Create your account"
      subtitle="Join thousands of developers mastering real full-stack systems."
    >
      <form onSubmit={handleSubmit} className="space-y-4">
        {error && (
          <div className="p-3.5 rounded-xl bg-[#EF4444]/15 border border-[#EF4444]/30 text-xs text-[#EF4444]">
            {error}
          </div>
        )}

        <div className="grid grid-cols-2 gap-3">
          <Input
            label="First Name"
            name="firstName"
            placeholder="Marcus"
            value={formData.firstName}
            onChange={handleChange}
            required
          />
          <Input
            label="Last Name"
            name="lastName"
            placeholder="Vance"
            value={formData.lastName}
            onChange={handleChange}
          />
        </div>

        <Input
          label="Email Address"
          type="email"
          name="email"
          placeholder="your.email@example.com"
          leftIcon={<Mail className="w-4 h-4" />}
          value={formData.email}
          onChange={handleChange}
          required
        />

        <Input
          label="Password"
          type="password"
          name="password"
          placeholder="At least 8 characters"
          leftIcon={<Lock className="w-4 h-4" />}
          helperText="Include at least one uppercase, lowercase, and number"
          value={formData.password}
          onChange={handleChange}
          required
        />

        <Select
          label="Account Purpose"
          name="role"
          value={formData.role}
          onChange={handleChange}
          options={[
            { value: 'student', label: 'Developer / Student (Learn courses)' },
            { value: 'instructor', label: 'Instructor (Publish & teach courses)' },
          ]}
        />

        <Button
          type="submit"
          variant="primary"
          className="w-full mt-2"
          loading={loading}
          rightIcon={<ArrowRight className="w-4 h-4" />}
        >
          Create Account
        </Button>
      </form>

      <p className="text-xs text-[#94A3B8] text-center mt-6">
        Already have an account?{' '}
        <Link to="/login" className="font-semibold text-[#A78BFA] hover:text-white transition">
          Sign In
        </Link>
      </p>
    </AuthLayout>
  );
}

export default Register;

