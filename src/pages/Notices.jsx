import { useEffect, useState } from 'react';
import { storage, KEYS } from '../utils/storage';
import { Megaphone, Plus, Trash2, X } from 'lucide-react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { useAuth } from '../context/AuthContext';
import { Navigate } from 'react-router-dom';

const schema = z.object({
  title: z.string().min(3, 'Title required'),
  message: z.string().min(5, 'Message required'),
  target: z.enum(['all', 'home', 'patient', 'doctor']),
});

const targetLabel = {
  all: 'All (Home + Patient + Doctor)',
  home: 'Home page only',
  patient: 'Patient portal only',
  doctor: 'Doctor portal only',
};

export default function Notices() {
  const { user } = useAuth();
  const [notices, setNotices] = useState([]);
  const [showModal, setShowModal] = useState(false);

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = useForm({
    resolver: zodResolver(schema),
    defaultValues: { target: 'all' },
  });

  const load = () => setNotices(storage.get(KEYS.NOTICES) || []);

  useEffect(() => {
    load();
  }, []);

  if (user?.role !== 'admin') {
    return <Navigate to="/dashboard" replace />;
  }

  const onSubmit = (data) => {
    const list = storage.get(KEYS.NOTICES) || [];
    list.unshift({
      id: `n${Date.now()}`,
      ...data,
      createdAt: new Date().toISOString().split('T')[0],
      active: true,
    });
    storage.set(KEYS.NOTICES, list);
    load();
    setShowModal(false);
    reset({ title: '', message: '', target: 'all' });
  };

  const handleDelete = (id) => {
    if (!confirm('Delete this notice?')) return;
    const list = (storage.get(KEYS.NOTICES) || []).filter((n) => n.id !== id);
    storage.set(KEYS.NOTICES, list);
    load();
  };

  const toggleActive = (id) => {
    const list = storage.get(KEYS.NOTICES) || [];
    const idx = list.findIndex((n) => n.id === id);
    if (idx === -1) return;
    list[idx] = { ...list[idx], active: !list[idx].active };
    storage.set(KEYS.NOTICES, list);
    load();
  };

  return (
    <div className="p-6 lg:p-8">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Notice Board</h1>
          <p className="text-gray-500 text-sm mt-0.5">
            Post announcements to Home, Patient portal, Doctor portal, or All
          </p>
        </div>
        <button
          onClick={() => {
            reset({ title: '', message: '', target: 'all' });
            setShowModal(true);
          }}
          className="inline-flex items-center gap-2 bg-primary-600 hover:bg-primary-700 text-white px-4 py-2.5 rounded-lg text-sm font-medium transition"
        >
          <Plus className="w-4 h-4" />
          New Notice
        </button>
      </div>

      <div className="space-y-4">
        {notices.length === 0 ? (
          <div className="bg-white rounded-xl border border-gray-100 py-16 text-center text-gray-400">
            No notices yet
          </div>
        ) : (
          notices.map((n) => (
            <div
              key={n.id}
              className={`bg-white rounded-xl border shadow-sm p-5 ${
                n.active ? 'border-gray-100' : 'border-gray-200 opacity-60'
              }`}
            >
              <div className="flex items-start gap-4">
                <div className="w-10 h-10 rounded-lg bg-amber-100 flex items-center justify-center shrink-0">
                  <Megaphone className="w-5 h-5 text-amber-600" />
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex flex-wrap items-center gap-2 mb-1">
                    <h3 className="font-semibold text-gray-900">{n.title}</h3>
                    <span className="text-xs px-2 py-0.5 rounded-full bg-primary-50 text-primary-700 font-medium">
                      {targetLabel[n.target] || n.target}
                    </span>
                    {!n.active && (
                      <span className="text-xs px-2 py-0.5 rounded-full bg-gray-100 text-gray-500">
                        Hidden
                      </span>
                    )}
                  </div>
                  <p className="text-sm text-gray-600">{n.message}</p>
                  <p className="text-xs text-gray-400 mt-2">{n.createdAt}</p>
                </div>
                <div className="flex items-center gap-2 shrink-0">
                  <button
                    onClick={() => toggleActive(n.id)}
                    className="text-xs font-medium px-3 py-1.5 rounded-lg border border-gray-200 hover:bg-gray-50"
                  >
                    {n.active ? 'Hide' : 'Show'}
                  </button>
                  <button
                    onClick={() => handleDelete(n.id)}
                    className="p-1.5 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-lg"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            </div>
          ))
        )}
      </div>

      {showModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40">
          <div className="bg-white rounded-2xl shadow-xl w-full max-w-lg">
            <div className="flex items-center justify-between px-6 py-4 border-b">
              <h3 className="font-semibold text-lg">Post Notice</h3>
              <button onClick={() => setShowModal(false)} className="p-1 hover:bg-gray-100 rounded-lg">
                <X className="w-5 h-5" />
              </button>
            </div>
            <form onSubmit={handleSubmit(onSubmit)} className="p-6 space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Title</label>
                <input
                  {...register('title')}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 outline-none"
                  placeholder="Announcement title"
                />
                {errors.title && <p className="text-xs text-red-600 mt-1">{errors.title.message}</p>}
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Message</label>
                <textarea
                  {...register('message')}
                  rows={4}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 outline-none resize-none"
                  placeholder="Write the notice message..."
                />
                {errors.message && <p className="text-xs text-red-600 mt-1">{errors.message.message}</p>}
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Show on</label>
                <select
                  {...register('target')}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 outline-none"
                >
                  <option value="all">All (Home + Patient + Doctor)</option>
                  <option value="home">Home page only</option>
                  <option value="patient">Patient portal only</option>
                  <option value="doctor">Doctor portal only</option>
                </select>
              </div>
              <div className="flex gap-3 pt-2">
                <button
                  type="button"
                  onClick={() => setShowModal(false)}
                  className="flex-1 py-2.5 border border-gray-300 rounded-lg text-sm font-medium hover:bg-gray-50"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="flex-1 py-2.5 bg-primary-600 hover:bg-primary-700 text-white rounded-lg text-sm font-medium disabled:opacity-60"
                >
                  Publish
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}