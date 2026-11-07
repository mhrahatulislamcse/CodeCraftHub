import React, { useState } from 'react';
import { Outlet } from 'react-router-dom';
import Navbar from './Navbar.jsx';
import Sidebar from './Sidebar.jsx';
import ToastContainer from '../components/feedback/ToastContainer.jsx';

export function DashboardLayout({ children }) {
  const [collapsed, setCollapsed] = useState(false);
  const [mobileSidebarOpen, setMobileSidebarOpen] = useState(false);

  return (
    <div className="min-h-screen bg-[#0B1020] text-[#F8FAFC] flex flex-col selection:bg-[#7C5CFC] selection:text-white">
      {/* Toast Notification Container */}
      <ToastContainer />

      {/* Top Navbar */}
      <Navbar
        onToggleSidebar={() => setMobileSidebarOpen(!mobileSidebarOpen)}
        isSidebarCollapsed={collapsed}
      />

      <div className="flex flex-1 relative">
        {/* Desktop Sidebar */}
        <div className="hidden lg:block shrink-0">
          <Sidebar
            collapsed={collapsed}
            onToggleCollapse={() => setCollapsed(!collapsed)}
          />
        </div>

        {/* Mobile Sidebar Backdrop Drawer */}
        {mobileSidebarOpen && (
          <div
            className="fixed inset-0 z-50 bg-[#0B1020]/80 backdrop-blur-md lg:hidden animate-in fade-in"
            onClick={() => setMobileSidebarOpen(false)}
          >
            <div
              className="w-64 h-full bg-[#151C31] shadow-2xl animate-in slide-in-from-left duration-200"
              onClick={(e) => e.stopPropagation()}
            >
              <Sidebar
                collapsed={false}
                onToggleCollapse={() => setMobileSidebarOpen(false)}
                className="h-full border-r-0"
              />
            </div>
          </div>
        )}

        {/* Main Content Area */}
        <main className="flex-1 min-w-0 p-4 sm:p-6 lg:p-8 overflow-y-auto">
          <div className="max-w-7xl mx-auto">
            {children || <Outlet />}
          </div>
        </main>
      </div>
    </div>
  );
}

export default DashboardLayout;

