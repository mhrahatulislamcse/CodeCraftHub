import React from 'react';
import { Navigate, useLocation, Link } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext.jsx';
import Spinner from '../components/feedback/Spinner.jsx';
import Button from '../components/common/Button.jsx';
import { ShieldAlert, ArrowLeft } from 'lucide-react';

export function ProtectedRoute({ children, allowedRoles = [] }) {
  const { isAuthenticated, loading, role } = useAuth();
  const location = useLocation();

  if (loading) {
    return (
      <div className="min-h-screen bg-[#0B1020] flex flex-col items-center justify-center gap-3">
        <Spinner size="lg" color="purple" />
        <p className="text-xs text-[#94A3B8] font-mono tracking-wide">
          Verifying session credentials...
        </p>
      </div>
    );
  }

  if (!isAuthenticated) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  // Check role authorization
  if (allowedRoles.length > 0 && !allowedRoles.includes(role)) {
    return (
      <div className="min-h-[70vh] flex flex-col items-center justify-center p-6 text-center">
        <div className="w-16 h-16 rounded-2xl bg-[#EF4444]/15 text-[#EF4444] border border-[#EF4444]/30 flex items-center justify-center mb-4 shadow-lg shadow-[#EF4444]/10">
          <ShieldAlert className="w-8 h-8" />
        </div>
        <h2 className="text-2xl font-bold text-white tracking-tight">Access Restricted</h2>
        <p className="text-xs text-[#CBD5E1] max-w-md mt-2 leading-relaxed">
          Your current account role (<span className="font-semibold text-[#A78BFA] capitalize">{role}</span>) does not have authorization to view this area. Allowed role(s):{' '}
          <span className="font-mono text-[#CBD5E1]">{allowedRoles.join(', ')}</span>.
        </p>
        <div className="mt-6 flex items-center gap-3">
          <Link to="/dashboard">
            <Button variant="secondary" size="sm" leftIcon={<ArrowLeft className="w-4 h-4" />}>
              Back to Dashboard
            </Button>
          </Link>
        </div>
      </div>
    );
  }

  return children;
}

export default ProtectedRoute;

