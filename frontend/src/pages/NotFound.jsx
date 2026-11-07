import React from 'react';
import { Link } from 'react-router-dom';
import Button from '../components/common/Button.jsx';
import { Home, ArrowLeft, Terminal } from 'lucide-react';

export function NotFound() {
  return (
    <div className="min-h-[75vh] flex flex-col items-center justify-center p-6 text-center select-none">
      <div className="w-20 h-20 rounded-3xl bg-[#7C5CFC]/15 text-[#A78BFA] border border-[#7C5CFC]/30 flex items-center justify-center mb-6 shadow-2xl shadow-[#7C5CFC]/20 animate-bounce">
        <Terminal className="w-10 h-10" />
      </div>

      <span className="font-mono text-xs uppercase tracking-widest text-[#A78BFA] bg-[#7C5CFC]/20 px-3 py-1 rounded-full border border-[#7C5CFC]/30 mb-2">
        HTTP 404 - Resource Not Found
      </span>

      <h1 className="text-4xl sm:text-5xl font-extrabold text-white tracking-tight mt-2">
        Lost in Cyberspace?
      </h1>

      <p className="text-sm text-[#CBD5E1] max-w-md mt-3 leading-relaxed">
        The route or learning module you requested does not exist in our index. It may have been relocated or archived.
      </p>

      <div className="mt-8 flex items-center gap-4">
        <Link to="/dashboard">
          <Button variant="primary" size="md" leftIcon={<Home className="w-4 h-4" />}>
            Back to Dashboard
          </Button>
        </Link>
        <Link to="/courses">
          <Button variant="secondary" size="md">
            Browse Catalog
          </Button>
        </Link>
      </div>
    </div>
  );
}

export default NotFound;

