import React from 'react';
import { ShieldCheck, Users, BookOpen, AlertCircle, Database, Server } from 'lucide-react';
import StatCard from '../components/common/StatCard.jsx';
import Button from '../components/common/Button.jsx';
import Badge from '../components/common/Badge.jsx';

export function AdminDashboard() {
  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-[#27324A]/60">
        <div>
          <h1 className="text-2xl font-bold text-white tracking-tight flex items-center gap-2">
            <ShieldCheck className="w-6 h-6 text-[#EF4444]" />
            Administration & System Hub
          </h1>
          <p className="text-xs text-[#94A3B8] mt-1">
            Global platform metrics, user access management, and database telemetry.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <Badge variant="green" size="sm" dot>System Healthy</Badge>
          <Badge variant="purple" size="sm">PostgreSQL 18</Badge>
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatCard
          title="Total Users"
          value="4,820"
          change="+120 today"
          trend="up"
          icon={<Users className="w-6 h-6 text-[#A78BFA]" />}
        />
        <StatCard
          title="Active Enrollments"
          value="8,914"
          change="+8.4%"
          trend="up"
          icon={<BookOpen className="w-6 h-6 text-[#22C55E]" />}
          iconBg="bg-[#22C55E]/15 text-[#22C55E] border-[#22C55E]/30"
        />
        <StatCard
          title="Database Latency"
          value="1.2 ms"
          change="Pool: 20 active"
          trend="neutral"
          icon={<Database className="w-6 h-6 text-[#38BDF8]" />}
          iconBg="bg-[#38BDF8]/15 text-[#38BDF8] border-[#38BDF8]/30"
        />
        <StatCard
          title="Certificates Issued"
          value="1,402"
          change="Cryptographically verified"
          trend="up"
          icon={<ShieldCheck className="w-6 h-6 text-[#EF4444]" />}
          iconBg="bg-[#EF4444]/15 text-[#EF4444] border-[#EF4444]/30"
        />
      </div>

      <div className="p-8 rounded-2xl bg-[#151C31] border border-[#27324A] text-center space-y-3">
        <h3 className="text-base font-semibold text-white">Administration Control Panel</h3>
        <p className="text-xs text-[#CBD5E1] max-w-lg mx-auto">
          User role governance, instructor application approvals, and audit log exploration will be fully activated in Phase 11.
        </p>
      </div>
    </div>
  );
}

export default AdminDashboard;

