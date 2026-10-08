import { useEffect, useState } from 'react';
import { storage, KEYS } from '../utils/storage';
import { Search, Stethoscope, Plus, Trash2, X } from 'lucide-react';
import Badge from '../components/ui/Badge';
import { useAuth } from '../context/AuthContext';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';

const schema = z.object({
  name: z.string().min(2, 'Name is required'),
  specialty: z.string().min(2, 'Specialty is required'),
  experience: z.coerce.number().min(0).max(60),
  phone: z.string().min(8, 'Phone is required'),
  email: z.string().email(),
  password: z.string().min(6, 'Password min 6 characters'),
  status: z.enum(['available', 'busy', 'offline']),
});

export default function Doctors() {
  const { user } = useAuth();
  const isAdmin = user?.role === 'admin';
  const [doctors, setDoctors] = useState([]);
  const [search, setSearch] = useState('');
  const [showModal, setShowModal] = useState(false);
  const [formError, setFormError] = useState('');

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = useForm({
    resolver: zodResolver(schema),
    defaultValues: {
      status: 'available',
      experience: 0,
      password: 'doctor123',
    },
  });

  const load = () => setDoctors(storage.get(KEYS.DOCTORS) || []);

  useEffect(() => {
    load();
  }, []);

  const filtered = doctors.filter(
    (d) =>
      d.name.toLowerCase().includes(search.toLowerCase()) ||
      d.specialty.toLowerCase().includes(search.toLowerCase())
  );

  const onSubmit = (data) => {
    setFormError('');
    const users = storage.get(KEYS.USERS) || [];

    if (users.some((u) => u.email.toLowerCase() === data.email.toLowerCase())) {
      setFormError('Email already used. Choose another email for login.');
      return;
    }

    const displayName = data.name.startsWith('Dr.') ? data.name : `Dr. ${data.name}`;
    const doctorId = `d${Date.now()}`;

    // 1) Add to doctors list
    const list = storage.get(KEYS.DOCTORS) || [];
    list.unshift({
      id: doctorId,
      name: displayName,
      specialty: data.specialty,
      experience: data.experience,
      phone: data.phone,
      email: data.email,
      status: data.status,
      patients: 0,
    });
    storage.set(KEYS.DOCTORS, list);

    // 2) Create login portal — blank avatar (no random photo)
    users.push({
      id: `u${Date.now()}`,
      name: displayName,
      email: data.email,
      password: data.password,
      role: 'doctor',
      specialty: data.specialty,
      avatar: '',
    });
    storage.set(KEYS.USERS, users);

    load();
    setShowModal(false);
    reset({
      name: '',
      specialty: '',
      experience: 0,
      phone: '',
      email: '',
      password: 'doctor123',
      status: 'available',
    });
    alert(`Doctor portal created!\nLogin: ${data.email}\nPassword: ${data.password}`);
  };

  const handleDelete = (id) => {
    if (!confirm('Remove this doctor and their login?')) return;
    const list = storage.get(KEYS.DOCTORS) || [];
    const doc = list.find((d) => d.id === id);
    storage.set(
      KEYS.DOCTORS,
      list.filter((d) => d.id !== id)
    );

    if (doc?.email) {
      const users = (storage.get(KEYS.USERS) || []).filter(
        (u) => u.email.toLowerCase() !== doc.email.toLowerCase()
      );
      storage.set(KEYS.USERS, users);
    }
    load();
  };

  return (
    <div className="p-6 lg:p-8">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">
            {user?.role === 'patient' ? 'Available Doctors' : 'Doctors'}
          </h1>
          <p className="text-gray-500 text-sm mt-0.5">{doctors.length} specialists</p>
        </div>
        {isAdmin && (
          <button
            onClick={() => {
              setFormError('');
              reset({
                name: '',
                specialty: '',
                experience: 0,
                phone: '',
                email: '',
                password: 'doctor123',
                status: 'available',
              });
              setShowModal(true);
            }}
            className="inline-flex items-center gap-2 bg-primary-600 hover:bg-primary-700 text-white px-4 py-2.5 rounded-lg text-sm font-medium transition"
          >
            <Plus className="w-4 h-4" />
            Create Doctor Portal
          </button>
        )}
      </div>

      <div className="relative mb-6">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
        <input
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Search by name or specialty..."
          className="w-full pl-10 pr-4 py-2.5 border border-gray-200 rounded-lg bg-white focus:ring-2 focus:ring-primary-500 outline-none"
        />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-5">
        {filtered.map((doc) => (
          <div
            key={doc.id}
            className="bg-white rounded-xl border border-gray-100 shadow-sm p-6 hover:shadow-md transition relative"
          >
            {isAdmin && (
              <button
                onClick={() => handleDelete(doc.id)}
                className="absolute top-4 right-4 p-1.5 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition"
              >
                <Trash2 className="w-4 h-4" />
              </button>
            )}
            <div className="flex items-start justify-between mb-4">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 rounded-full bg-primary-100 flex items-center justify-center">
                  <Stethoscope className="w-6 h-6 text-primary-600" />
                </div>
                <div>
                  <h3 className="font-semibold text-gray-900">{doc.name}</h3>
                  <p className="text-sm text-primary-600">{doc.specialty}</p>
                </div>
              </div>
              <Badge status={doc.status} />
            </div>
            <div className="space-y-2 text-sm text-gray-600">
              <div className="flex justify-between">
                <span>Experience</span>
                <span className="font-medium text-gray-900">{doc.experience} years</span>
              </div>
              <div className="flex justify-between">
                <span>Email</span>
                <span className="font-medium text-gray-900 truncate max-w-[160px]">{doc.email}</span>
              </div>
            </div>
          </div>
        ))}
      </div>

      {filtered.length === 0 && (
        <div className="text-center py-16 text-gray-400">No doctors found</div>
      )}

      {showModal && isAdmin && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40">
          <div className="bg-white rounded-2xl shadow-xl w-full max-w-lg max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between px-6 py-4 border-b">
              <h3 className="font-semibold text-lg">Create Doctor Portal</h3>
              <button
                onClick={() => setShowModal(false)}
                className="p-1 hover:bg-gray-100 rounded-lg"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
            <form onSubmit={handleSubmit(onSubmit)} className="p-6 space-y-4">
              {formError && (
                <div className="p-3 bg-red-50 text-red-700 text-sm rounded-lg">{formError}</div>
              )}
              <p className="text-xs text-gray-500">
                Creates doctor profile + login. Photo stays blank until they set it in Settings.
              </p>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Full Name</label>
                <input
                  {...register('name')}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 outline-none"
                  placeholder="Dr. John Smith"
                />
                {errors.name && <p className="text-xs text-red-600 mt-1">{errors.name.message}</p>}
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Specialty</label>
                  <input
                    {...register('specialty')}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 outline-none"
                  />
                  {errors.specialty && (
                    <p className="text-xs text-red-600 mt-1">{errors.specialty.message}</p>
                  )}
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Experience</label>
                  <input
                    type="number"
                    {...register('experience')}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 outline-none"
                  />
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Phone</label>
                  <input
                    {...register('phone')}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 outline-none"
                  />
                  {errors.phone && (
                    <p className="text-xs text-red-600 mt-1">{errors.phone.message}</p>
                  )}
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Status</label>
                  <select
                    {...register('status')}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 outline-none"
                  >
                    <option value="available">Available</option>
                    <option value="busy">Busy</option>
                    <option value="offline">Offline</option>
                  </select>
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Login Email</label>
                <input
                  type="email"
                  {...register('email')}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 outline-none"
                  placeholder="doctor@healthtrack.com"
                />
                {errors.email && (
                  <p className="text-xs text-red-600 mt-1">{errors.email.message}</p>
                )}
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Login Password</label>
                <input
                  type="text"
                  {...register('password')}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 outline-none"
                  placeholder="min 6 characters"
                />
                {errors.password && (
                  <p className="text-xs text-red-600 mt-1">{errors.password.message}</p>
                )}
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
                  Create Portal
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}