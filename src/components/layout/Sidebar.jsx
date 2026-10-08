import { NavLink, useNavigate } from 'react-router-dom';
import {
  LayoutDashboard,
  Users,
  Calendar,
  Stethoscope,
  FileText,
  Settings,
  LogOut,
  HeartPulse,
  CalendarPlus,
  Megaphone,
  User,
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import clsx from 'clsx';

const allLinks = [
  { to: '/dashboard', label: 'Dashboard', icon: LayoutDashboard, roles: ['admin', 'doctor', 'patient'] },
  { to: '/patients', label: 'Patients', icon: Users, roles: ['admin', 'doctor'] },
  { to: '/appointments', label: 'Appointments', icon: Calendar, roles: ['admin', 'doctor', 'patient'] },
  { to: '/doctors', label: 'Doctors', icon: Stethoscope, roles: ['admin', 'doctor', 'patient'] },
  { to: '/records', label: 'Medical Records', icon: FileText, roles: ['admin', 'doctor', 'patient'] },
  { to: '/book', label: 'Book Appointment', icon: CalendarPlus, roles: ['patient'] },
  { to: '/notices', label: 'Notice Board', icon: Megaphone, roles: ['admin'] },
  { to: '/settings', label: 'Settings', icon: Settings, roles: ['admin', 'doctor', 'patient'] },
];

export default function Sidebar() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const role = user?.role || 'patient';
  const links = allLinks.filter((l) => l.roles.includes(role));

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  return (
    <aside className="w-64 bg-primary-900 text-white min-h-screen flex flex-col shrink-0">
      <div className="p-5 flex items-center gap-3 border-b border-primary-800">
        <div className="bg-white/10 p-2.5 rounded-xl">
          <HeartPulse className="w-6 h-6 text-primary-300" />
        </div>
        <div>
          <h1 className="font-bold text-lg leading-tight">HealthTrack</h1>
          <p className="text-[11px] text-primary-300">Your Health, Our Priority</p>
        </div>
      </div>

      <nav className="flex-1 p-3 space-y-1 overflow-y-auto">
        {links.map(({ to, label, icon: Icon }) => (
          <NavLink
            key={to}
            to={to}
            className={({ isActive }) =>
              clsx(
                'flex items-center gap-3 px-4 py-2.5 rounded-lg text-sm font-medium transition-all',
                isActive
                  ? 'bg-primary-600 text-white shadow-md shadow-primary-900/40'
                  : 'text-primary-100 hover:bg-primary-800/80'
              )
            }
          >
            <Icon className="w-5 h-5 shrink-0" />
            {label}
          </NavLink>
        ))}
      </nav>

      <div className="p-4 border-t border-primary-800">
        <div className="flex items-center gap-3 mb-3">
          {user?.avatar ? (
            <img
              src={user.avatar}
              alt={user?.name}
              className="w-9 h-9 rounded-full object-cover ring-2 ring-primary-700"
            />
          ) : (
            <div className="w-9 h-9 rounded-full bg-primary-700 ring-2 ring-primary-600 flex items-center justify-center">
              <User className="w-5 h-5 text-primary-200" />
            </div>
          )}
          <div className="min-w-0 flex-1">
            <p className="text-sm font-medium truncate">{user?.name}</p>
            <p className="text-xs text-primary-300 capitalize">{user?.role}</p>
          </div>
        </div>
        <button
          onClick={handleLogout}
          className="w-full flex items-center justify-center gap-2 px-4 py-2 text-sm text-primary-200 hover:bg-primary-800 rounded-lg transition"
        >
          <LogOut className="w-4 h-4" />
          Logout
        </button>
      </div>
    </aside>
  );
}