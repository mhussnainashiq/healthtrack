import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import {
  HeartPulse,
  LogIn,
  Shield,
  Calendar,
  FileText,
  Users,
  CheckCircle2,
  ArrowRight,
  Megaphone,
} from 'lucide-react';
import { storage, KEYS, initStorage } from '../utils/storage';

const features = [
  {
    icon: Shield,
    title: 'Secure Authentication',
    desc: 'Protected access with role-based permissions for admin, doctors and patients.',
  },
  {
    icon: Calendar,
    title: 'Appointment Booking',
    desc: 'Book appointments online. Confirmed instantly. Status managed by staff.',
  },
  {
    icon: FileText,
    title: 'Health Records',
    desc: 'Store and review medical records, diagnoses and treatment notes.',
  },
  {
    icon: Users,
    title: 'Patient Management',
    desc: 'Complete patient profiles with history and contact information.',
  },
];

const checklist = [
  'User Authentication',
  'Health Records',
  'Appointment Booking',
  'Notice Board',
  'Secure & Scalable UI',
];

export default function Home() {
  const [notices, setNotices] = useState([]);

  useEffect(() => {
    initStorage();
    const all = storage.get(KEYS.NOTICES) || [];
    setNotices(
      all.filter((n) => n.active && (n.target === 'home' || n.target === 'all'))
    );
  }, []);

  return (
    <div className="min-h-screen bg-gradient-to-br from-primary-950 via-primary-900 to-primary-800 text-white">
      <header className="flex items-center justify-between px-6 lg:px-12 py-5">
        <div className="flex items-center gap-3">
          <div className="bg-white/10 p-2.5 rounded-xl backdrop-blur">
            <HeartPulse className="w-7 h-7 text-primary-300" />
          </div>
          <div>
            <h1 className="font-bold text-xl leading-tight">HealthTrack</h1>
            <p className="text-xs text-primary-300">Your Health, Our Priority</p>
          </div>
        </div>
        <Link
          to="/login"
          className="flex items-center gap-2 bg-white/10 hover:bg-white/20 border border-white/20 backdrop-blur px-4 py-2.5 rounded-xl text-sm font-medium transition"
        >
          <LogIn className="w-5 h-5" />
          <span className="hidden sm:inline">Sign In</span>
        </Link>
      </header>

      <main className="px-6 lg:px-12 pb-16 pt-8 lg:pt-12">
        {notices.length > 0 && (
          <div className="max-w-6xl mx-auto mb-10">
            <div className="bg-amber-500/15 border border-amber-400/30 rounded-2xl p-5 backdrop-blur">
              <div className="flex items-center gap-2 mb-3">
                <Megaphone className="w-5 h-5 text-amber-300" />
                <h2 className="font-semibold text-amber-100">Notice Board</h2>
              </div>
              <div className="space-y-3">
                {notices.map((n) => (
                  <div key={n.id} className="bg-white/10 rounded-xl px-4 py-3">
                    <p className="font-medium text-sm text-white">{n.title}</p>
                    <p className="text-sm text-primary-100/80 mt-0.5">{n.message}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        <div className="max-w-6xl mx-auto grid lg:grid-cols-2 gap-12 items-center">
          <div>
            <div className="inline-flex items-center gap-2 bg-primary-500/20 border border-primary-400/30 text-primary-200 text-xs font-medium px-3 py-1.5 rounded-full mb-6">
              <span className="w-1.5 h-1.5 rounded-full bg-primary-400 animate-pulse" />
              Healthcare Management System
            </div>
            <h2 className="text-4xl sm:text-5xl font-bold leading-tight mb-4">
              Better Health
              <br />
              <span className="text-primary-300">Better Life</span>
            </h2>
            <p className="text-primary-100/80 text-lg mb-8 max-w-md">
              Manage patients, appointments, doctors and medical records from one modern dashboard.
            </p>
            <ul className="space-y-3 mb-10">
              {checklist.map((item) => (
                <li key={item} className="flex items-center gap-3 text-primary-100">
                  <CheckCircle2 className="w-5 h-5 text-primary-400 shrink-0" />
                  <span>{item}</span>
                </li>
              ))}
            </ul>
            <div className="flex flex-wrap gap-4">
              <Link
                to="/login"
                className="inline-flex items-center gap-2 bg-primary-500 hover:bg-primary-400 text-white font-semibold px-6 py-3 rounded-xl transition shadow-lg shadow-primary-900/40"
              >
                Get Started
                <ArrowRight className="w-4 h-4" />
              </Link>
              <Link
                to="/register"
                className="inline-flex items-center gap-2 bg-white/10 hover:bg-white/20 border border-white/20 font-medium px-6 py-3 rounded-xl transition"
              >
                Create Account
              </Link>
            </div>
          </div>

          <div className="relative hidden lg:block">
            <div className="bg-white rounded-3xl p-8 text-gray-900 shadow-2xl shadow-black/30">
              <div className="flex items-center gap-4 mb-6">
                <div className="w-16 h-16 rounded-2xl bg-primary-100 flex items-center justify-center">
                  <HeartPulse className="w-8 h-8 text-primary-600" />
                </div>
                <div>
                  <p className="font-bold text-lg">HealthTrack</p>
                  <p className="text-sm text-gray-500">Your Health, Our Priority</p>
                </div>
              </div>
              <div className="space-y-3 mb-8">
                {['User Authentication', 'Health Records', 'Appointment Booking', 'Notice Board', 'Secure & Scalable'].map(
                  (f) => (
                    <div key={f} className="flex items-center gap-2 text-sm text-gray-700">
                      <CheckCircle2 className="w-4 h-4 text-primary-500" />
                      {f}
                    </div>
                  )
                )}
              </div>
              <div className="bg-gradient-to-r from-primary-600 to-primary-500 rounded-2xl p-5 text-white flex items-center justify-between">
                <div>
                  <p className="font-semibold">Book Appointment</p>
                  <p className="text-sm text-primary-100">Confirmed instantly</p>
                </div>
                <Link
                  to="/login"
                  className="bg-white text-primary-700 font-semibold text-sm px-4 py-2 rounded-lg hover:bg-primary-50 transition"
                >
                  Book Now
                </Link>
              </div>
            </div>
          </div>
        </div>

        <div className="max-w-6xl mx-auto mt-20 grid sm:grid-cols-2 lg:grid-cols-4 gap-5">
          {features.map(({ icon: Icon, title, desc }) => (
            <div
              key={title}
              className="bg-white/5 border border-white/10 backdrop-blur rounded-2xl p-5 hover:bg-white/10 transition"
            >
              <div className="w-10 h-10 rounded-xl bg-primary-500/20 flex items-center justify-center mb-4">
                <Icon className="w-5 h-5 text-primary-300" />
              </div>
              <h3 className="font-semibold mb-1.5">{title}</h3>
              <p className="text-sm text-primary-200/70 leading-relaxed">{desc}</p>
            </div>
          ))}
        </div>
      </main>
    </div>
  );
}