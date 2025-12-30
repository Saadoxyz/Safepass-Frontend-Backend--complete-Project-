'use client';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Shield, LayoutDashboard, Users, Building2, Settings, FileText, LogOut, UserCheck, Calendar, ClipboardCheck, Flag } from 'lucide-react';

export default function Sidebar({ role = 'admin' }) {
  const pathname = usePathname();

  // Role-based color mapping
  const roleColors = {
    admin: { bg: '#690B22', icon: '#690B22' },
    host: { bg: '#85409D', icon: '#85409D' },
    security: { bg: '#132440', icon: '#132440' },
  };

  const currentColor = roleColors[role] || roleColors.admin;

  const adminLinks = [
    { href: '/admin/dashboard', icon: LayoutDashboard, label: 'Dashboard' },
    { href: '/admin/users', icon: Users, label: 'Users' },
    { href: '/admin/departments', icon: Building2, label: 'Departments' },
    { href: '/admin/reports', icon: FileText, label: 'Reports' },
    { href: '/admin/settings', icon: Settings, label: 'Settings' },
  ];

  const hostLinks = [
    { href: '/host/dashboard', icon: LayoutDashboard, label: 'Dashboard' },
    { href: '/host/approvals', icon: UserCheck, label: 'Visitor Approval' },
    { href: '/host/schedule', icon: Calendar, label: 'My Schedule' },
  ];

  const securityLinks = [
    { href: '/security/dashboard', icon: LayoutDashboard, label: 'Dashboard' },
    { href: '/security/checkin-checkout', icon: ClipboardCheck, label: 'Check-in/Check-out' },
    { href: '/security/approved-visitors', icon: UserCheck, label: 'Approved Visitors' },
    { href: '/security/flagged-visitors', icon: Flag, label: 'Flagged Visitors' },
    { href: '/security/suspicious-report', icon: Flag, label: 'Report Suspicious' },
    { href: '/security/suspicious-reports-dashboard', icon: Flag, label: 'Suspicious Reports' },
  ];

  const links = role === 'admin' ? adminLinks : role === 'host' ? hostLinks : securityLinks;

  return (
    <div className="w-64 min-h-screen flex flex-col" style={{ backgroundColor: currentColor.bg }}>
      <div className="p-6 border-b" style={{ borderColor: 'rgba(255, 255, 255, 0.1)' }}>
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-white rounded-lg flex items-center justify-center">
            <Shield className="w-6 h-6" style={{ color: currentColor.bg }} />
          </div>
          <span className="text-xl font-bold text-white">SafePass</span>
        </div>
      </div>

      <nav className="flex-1 p-4 space-y-1">
        {links.map((link) => {
          const Icon = link.icon;
          const isActive = pathname === link.href;
          return (
            <Link
              key={link.href}
              href={link.href}
              className={`flex items-center gap-3 px-4 py-3 rounded-lg transition-colors ${
                isActive
                  ? 'bg-white text-gray-900'
                  : 'text-white hover:bg-white hover:text-gray-900'
              }`}
            >
              <Icon className="w-5 h-5" />
              <span className="font-medium">{link.label}</span>
            </Link>
          );
        })}
      </nav>

      <div className="p-4" style={{ borderTop: '1px solid rgba(255, 255, 255, 0.1)' }}>
        <button
          onClick={() => {
            localStorage.clear();
            window.location.href = '/login';
          }}
          className="flex items-center gap-3 px-4 py-3 rounded-lg text-white hover:bg-white hover:text-gray-900 transition-colors w-full"
        >
          <LogOut className="w-5 h-5" />
          <span className="font-medium">Logout</span>
        </button>
      </div>
    </div>
  );
}