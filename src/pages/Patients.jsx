import { useEffect, useState } from 'react';
import { storage, KEYS } from '../utils/storage';
import { Search, Trash2 } from 'lucide-react';
import Badge from '../components/ui/Badge';
import { useAuth } from '../context/AuthContext';

const STATUS_OPTIONS = ['Pending', 'Confirmed', 'Completed', 'Cancelled'];

export default function Appointments() {
  const { user } = useAuth();
  const [appointments, setAppointments] = useState([]);
  const [search, setSearch] = useState('');
  const [filter, setFilter] = useState('All');

  const isPatient = user?.role === 'patient';
  const isDoctor = user?.role === 'doctor';
  const isAdmin = user?.role === 'admin';
  const canManage = isAdmin || isDoctor;

  const load = () => {
    let list = storage.get(KEYS.APPOINTMENTS) || [];

    if (isPatient) {
      list = list.filter(
        (a) =>
          a.patientId === user.id ||
          a.patientName?.toLowerCase() === user.name?.toLowerCase()
      );
    }

    if (isDoctor) {
      const myName = (user.name || '').toLowerCase().replace(/^dr\.\s*/i, '').trim();
      const myEmail = (user.email || '').toLowerCase();
      list = list.filter((a) => {
        const aptDoctorName = (a.doctorName || '').toLowerCase().replace(/^dr\.\s*/i, '').trim();
        const aptDoctorEmail = (a.doctorEmail || '').toLowerCase();
        if (myEmail && aptDoctorEmail && myEmail === aptDoctorEmail) return true;
        if (myName && aptDoctorName && myName === aptDoctorName) return true;
        if (a.doctorName?.toLowerCase() === user.name?.toLowerCase()) return true;
        return false;
      });
    }

    setAppointments(list);
  };

  useEffect(() => {
    load();
  }, [user]);

  const filtered = appointments.filter((a) => {
    const matchesSearch =
      a.patientName.toLowerCase().includes(search.toLowerCase()) ||
      a.doctorName.toLowerCase().includes(search.toLowerCase()) ||
      a.reason.toLowerCase().includes(search.toLowerCase());
    const matchesFilter = filter === 'All' || a.status === filter;
    return matchesSearch && matchesFilter;
  });

  const updateStatus = (id, status) => {
    if (!canManage) return;
    const list = storage.get(KEYS.APPOINTMENTS) || [];
    const idx = list.findIndex((a) => a.id === id);
    if (idx === -1) return;
    list[idx] = { ...list[idx], status };
    storage.set(KEYS.APPOINTMENTS, list);
    load();
  };

  const handleDelete = (id) => {
    if (!canManage) return;
    if (!confirm('Delete this appointment?')) return;
    const list = (storage.get(KEYS.APPOINTMENTS) || []).filter((a) => a.id !== id);
    storage.set(KEYS.APPOINTMENTS, list);
    load();
  };

  return (
    <div className="p-6 lg:p-8">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-900">
          {isPatient || isDoctor ? 'My Appointments' : 'Appointments'}
        </h1>
        <p className="text-gray-500 text-sm mt-0.5">{appointments.length} total</p>
      </div>

      <div className="flex flex-col sm:flex-row gap-3 mb-5">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
          <input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search..."
            className="w-full pl-10 pr-4 py-2.5 border border-gray-200 rounded-lg bg-white focus:ring-2 focus:ring-primary-500 outline-none"
          />
        </div>

        {/* Status filter — admin & doctor only (hidden for patient) */}
        {!isPatient && (
          <select
            value={filter}
            onChange={(e) => setFilter(e.target.value)}
            className="px-4 py-2.5 border border-gray-200 rounded-lg bg-white focus:ring-2 focus:ring-primary-500 outline-none"
          >
            <option value="All">All Status</option>
            {STATUS_OPTIONS.map((s) => (
              <option key={s} value={s}>{s}</option>
            ))}
          </select>
        )}
      </div>

      <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
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
                {canManage && <th className="px-6 py-3 text-right font-medium">Actions</th>}
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {filtered.length === 0 ? (
                <tr>
                  <td
                    colSpan={canManage ? (isPatient ? 6 : 7) : isPatient ? 5 : 6}
                    className="px-6 py-12 text-center text-gray-400"
                  >
                    {isPatient
                      ? 'No appointments yet. Book one from Book Appointment.'
                      : 'No appointments found'}
                  </td>
                </tr>
              ) : (
                filtered.map((a) => (
                  <tr key={a.id} className="hover:bg-gray-50/80">
                    {!isPatient && (
                      <td className="px-6 py-4 font-medium text-gray-900">{a.patientName}</td>
                    )}
                    <td className="px-6 py-4 text-gray-600">{a.doctorName}</td>
                    <td className="px-6 py-4 text-gray-600">{a.date}</td>
                    <td className="px-6 py-4 text-gray-600">{a.time}</td>
                    <td className="px-6 py-4 text-gray-600 max-w-[160px] truncate">{a.reason}</td>
                    <td className="px-6 py-4">
                      {canManage ? (
                        <select
                          value={a.status}
                          onChange={(e) => updateStatus(a.id, e.target.value)}
                          className="text-xs font-medium border border-gray-200 rounded-md px-2 py-1 bg-white focus:ring-2 focus:ring-primary-500 cursor-pointer"
                        >
                          {STATUS_OPTIONS.map((s) => (
                            <option key={s} value={s}>{s}</option>
                          ))}
                        </select>
                      ) : (
                        <Badge status={a.status} />
                      )}
                    </td>
                    {canManage && (
                      <td className="px-6 py-4 text-right">
                        <button
                          onClick={() => handleDelete(a.id)}
                          className="p-1.5 text-gray-500 hover:text-red-600 hover:bg-red-50 rounded-lg transition"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </td>
                    )}
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