import { useEffect, useState } from 'react';
import { storage, KEYS } from '../utils/storage';
import { Users, Calendar, Stethoscope, Activity, Megaphone } from 'lucide-react';
import StatCard from '../components/ui/StatCard';
import Badge from '../components/ui/Badge';
import { useAuth } from '../context/AuthContext';

export default function Dashboard() {
  const { user } = useAuth();
  const isPatient = user?.role === 'patient';
  const isDoctor = user?.role === 'doctor';
  const isAdmin = user?.role === 'admin';

  const [stats, setStats] = useState({ patients: 0, appointments: 0, doctors: 0, records: 0 });
  const [recent, setRecent] = useState([]);
  const [notices, setNotices] = useState([]);

  useEffect(() => {
    const allPatients = storage.get(KEYS.PATIENTS) || [];
    let appointments = storage.get(KEYS.APPOINTMENTS) || [];
    const doctors = storage.get(KEYS.DOCTORS) || [];
    let records = storage.get(KEYS.RECORDS) || [];

    // Patient → only their data
    if (isPatient) {
      appointments = appointments.filter(
        (a) =>
          a.patientId === user.id ||
          a.patientName?.toLowerCase() === user.name?.toLowerCase()
      );
      records = records.filter(
        (r) =>
          r.patientName?.toLowerCase() === user.name?.toLowerCase()
      );
    }

    // Doctor → only their appointments
    if (isDoctor) {
      const myName = (user.name || '').toLowerCase().replace(/^dr\.\s*/i, '').trim();
      const myEmail = (user.email || '').toLowerCase();
      appointments = appointments.filter((a) => {
        const aptName = (a.doctorName || '').toLowerCase().replace(/^dr\.\s*/i, '').trim();
        const aptEmail = (a.doctorEmail || '').toLowerCase();
        return (
          (myEmail && aptEmail && myEmail === aptEmail) ||
          (myName && aptName && myName === aptName) ||
          a.doctorName?.toLowerCase() === user.name?.toLowerCase()
        );
      });
    }

    setStats({
      patients: isPatient ? 0 : allPatients.length,
      appointments: appointments.length,
      doctors: doctors.length,
      records: records.length,
    });
    setRecent(appointments.slice(0, 6));

    const all = storage.get(KEYS.NOTICES) || [];
    const role = user?.role;
    setNotices(
      all.filter(
        (n) =>
          n.active &&
          (n.target === 'all' ||
            (role === 'patient' && n.target === 'patient') ||
            (role === 'doctor' && n.target === 'doctor') ||
            role === 'admin')
      )
    );
  }, [user, isPatient, isDoctor]);

  return (
    <div className="p-6 lg:p-8">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-900">
          Welcome back, {user?.name?.split(' ')[0]} 👋
        </h1>
        <p className="text-gray-500 mt-1">
          {isPatient
            ? 'Your appointments and health overview'
            : 'Here’s what’s happening with HealthTrack today'}
        </p>
      </div>

      {notices.length > 0 && (
        <div className="mb-6 bg-amber-50 border border-amber-200 rounded-xl p-4">
          <div className="flex items-center gap-2 mb-2">
            <Megaphone className="w-4 h-4 text-amber-600" />
            <h2 className="font-semibold text-amber-900 text-sm">Notice Board</h2>
          </div>
          <div className="space-y-2">
            {notices.map((n) => (
              <div key={n.id} className="bg-white rounded-lg px-3 py-2 border border-amber-100">
                <p className="font-medium text-sm text-gray-900">{n.title}</p>
                <p className="text-sm text-gray-600">{n.message}</p>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Stats — simpler for patient */}
      {isPatient ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-5 mb-8">
          <StatCard
            title="My Appointments"
            value={stats.appointments}
            icon={Calendar}
            color="bg-primary-600"
          />
          <StatCard
            title="My Records"
            value={stats.records}
            icon={Activity}
            color="bg-teal-600"
          />
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-5 mb-8">
          <StatCard title="Total Patients" value={stats.patients} change="+15%" icon={Users} color="bg-primary-600" />
          <StatCard title="Appointments" value={stats.appointments} change="+8%" icon={Calendar} color="bg-emerald-500" />
          <StatCard title="Doctors" value={stats.doctors} change="+10%" icon={Stethoscope} color="bg-teal-600" />
          <StatCard title="Medical Records" value={stats.records} change="+5%" icon={Activity} color="bg-cyan-600" />
        </div>
      )}

      <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
        <div className="px-6 py-4 border-b border-gray-100">
          <h2 className="font-semibold text-gray-900">
            {isPatient ? 'My Recent Appointments' : 'Recent Appointments'}
          </h2>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead className="bg-gray-50 text-gray-600">
              <tr>
                {!isPatient && <th className="px-6 py-3 text-left font-medium">Patient</th>}
                <th className="px-6 py-3 text-left font-medium">Doctor</th>
                <th className="px-6 py-3 text-left font-medium">Date</th>
                <th className="px-6 py-3 text-left font-medium">Time</th>
                <th className="px-6 py-3 text-left font-medium">Reason</th>
                <th className="px-6 py-3 text-left font-medium">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {recent.length === 0 ? (
                <tr>
                  <td colSpan={isPatient ? 5 : 6} className="px-6 py-10 text-center text-gray-400">
                    {isPatient
                      ? 'No appointments yet. Book one from Book Appointment.'
                      : 'No appointments yet'}
                  </td>
                </tr>
              ) : (
                recent.map((apt) => (
                  <tr key={apt.id} className="hover:bg-gray-50/80 transition">
                    {!isPatient && (
                      <td className="px-6 py-4 font-medium text-gray-900">{apt.patientName}</td>
                    )}
                    <td className="px-6 py-4 text-gray-600">{apt.doctorName}</td>
                    <td className="px-6 py-4 text-gray-600">{apt.date}</td>
                    <td className="px-6 py-4 text-gray-600">{apt.time}</td>
                    <td className="px-6 py-4 text-gray-600 max-w-[180px] truncate">{apt.reason}</td>
                    <td className="px-6 py-4">
                      <Badge status={apt.status} />
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}