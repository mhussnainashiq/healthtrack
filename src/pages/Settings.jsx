import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { useAuth } from '../context/AuthContext';
import { useState, useRef } from 'react';
import { User, Mail, Lock, Camera, Shield, Image as ImageIcon } from 'lucide-react';
import { storage, KEYS } from '../utils/storage';

const profileSchema = z.object({
  name: z.string().min(2, 'Name is required'),
  email: z.string().email('Valid email required'),
  avatarUrl: z.string().optional(),
});

const passwordSchema = z
  .object({
    currentPassword: z.string().min(1, 'Current password required'),
    newPassword: z.string().min(6, 'Min 6 characters'),
    confirmPassword: z.string().min(6, 'Confirm password'),
  })
  .refine((d) => d.newPassword === d.confirmPassword, {
    message: 'Passwords do not match',
    path: ['confirmPassword'],
  });

export default function Settings() {
  const { user, updateProfile, logout } = useAuth();
  const [msg, setMsg] = useState({ type: '', text: '' });
  const [preview, setPreview] = useState(user?.avatar || '');
  const fileRef = useRef(null);

  const profileForm = useForm({
    resolver: zodResolver(profileSchema),
    defaultValues: {
      name: user?.name || '',
      email: user?.email || '',
      avatarUrl: '',
    },
  });

  const passwordForm = useForm({
    resolver: zodResolver(passwordSchema),
    defaultValues: {
      currentPassword: '',
      newPassword: '',
      confirmPassword: '',
    },
  });

  const showMsg = (type, text) => {
    setMsg({ type, text });
    setTimeout(() => setMsg({ type: '', text: '' }), 3000);
  };

  const onFileChange = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    if (!file.type.startsWith('image/')) {
      showMsg('error', 'Please select an image file');
      return;
    }
    if (file.size > 1.5 * 1024 * 1024) {
      showMsg('error', 'Image must be under 1.5 MB');
      return;
    }
    const reader = new FileReader();
    reader.onload = () => {
      const base64 = reader.result;
      setPreview(base64);
      updateProfile({ avatar: base64 });
      showMsg('success', 'Profile photo updated');
    };
    reader.readAsDataURL(file);
  };

  const onProfileSubmit = (data) => {
    const updates = {
      name: data.name,
      email: data.email,
    };
    if (data.avatarUrl?.trim()) {
      updates.avatar = data.avatarUrl.trim();
      setPreview(data.avatarUrl.trim());
    }
    updateProfile(updates);
    showMsg('success', 'Profile saved successfully');
  };

  const onPasswordSubmit = (data) => {
    const users = storage.get(KEYS.USERS) || [];
    const idx = users.findIndex((u) => u.id === user.id);
    if (idx === -1) {
      showMsg('error', 'User not found');
      return;
    }
    if (users[idx].password !== data.currentPassword) {
      showMsg('error', 'Current password is incorrect');
      return;
    }
    users[idx] = { ...users[idx], password: data.newPassword };
    storage.set(KEYS.USERS, users);
    passwordForm.reset();
    showMsg('success', 'Password changed successfully');
  };

  const handleClearData = () => {
    if (!confirm('Clear ALL HealthTrack data from this browser and log out?')) return;
    localStorage.clear();
    logout();
    window.location.href = '/';
  };

  return (
    <div className="p-6 lg:p-8 max-w-2xl">
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-gray-900">Settings</h1>
        <p className="text-gray-500 mt-1">Manage your profile, photo and password</p>
      </div>

      {msg.text && (
        <div
          className={`mb-5 p-3.5 rounded-lg text-sm border ${
            msg.type === 'success'
              ? 'bg-emerald-50 border-emerald-100 text-emerald-700'
              : 'bg-red-50 border-red-100 text-red-700'
          }`}
        >
          {msg.text}
        </div>
      )}

      {/* Avatar */}
      <div className="bg-white rounded-xl border border-gray-100 shadow-sm p-6 mb-6">
        <h2 className="font-semibold text-gray-900 mb-4 flex items-center gap-2">
          <Camera className="w-4 h-4 text-primary-600" />
          Profile Photo
        </h2>
        <div className="flex flex-col sm:flex-row items-center gap-6">
          <div className="relative">
            <img
              src={preview || user?.avatar}
              alt={user?.name}
              className="w-24 h-24 rounded-full object-cover ring-4 ring-primary-100"
            />
            <button
              type="button"
              onClick={() => fileRef.current?.click()}
              className="absolute bottom-0 right-0 bg-primary-600 text-white p-2 rounded-full shadow hover:bg-primary-700 transition"
              title="Upload photo"
            >
              <Camera className="w-4 h-4" />
            </button>
            <input
              ref={fileRef}
              type="file"
              accept="image/*"
              className="hidden"
              onChange={onFileChange}
            />
          </div>
          <div className="flex-1 w-full space-y-3">
            <p className="text-sm text-gray-500">
              Upload a photo (max 1.5 MB) or paste an image URL below and save profile.
            </p>
            <div className="flex items-center gap-2 text-xs text-gray-400">
              <Shield className="w-3.5 h-3.5" />
              Role: <span className="capitalize font-medium text-gray-600">{user?.role}</span>
            </div>
          </div>
        </div>
      </div>

      {/* Profile */}
      <div className="bg-white rounded-xl border border-gray-100 shadow-sm p-6 mb-6">
        <h2 className="font-semibold text-gray-900 mb-4 flex items-center gap-2">
          <User className="w-4 h-4 text-primary-600" />
          Profile Details
        </h2>
        <form onSubmit={profileForm.handleSubmit(onProfileSubmit)} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1.5">Full Name</label>
            <div className="relative">
              <User className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
              <input
                {...profileForm.register('name')}
                className="w-full pl-10 pr-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 outline-none"
              />
            </div>
            {profileForm.formState.errors.name && (
              <p className="mt-1 text-sm text-red-600">{profileForm.formState.errors.name.message}</p>
            )}
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1.5">Email</label>
            <div className="relative">
              <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
              <input
                {...profileForm.register('email')}
                type="email"
                className="w-full pl-10 pr-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 outline-none"
              />
            </div>
            {profileForm.formState.errors.email && (
              <p className="mt-1 text-sm text-red-600">{profileForm.formState.errors.email.message}</p>
            )}
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1.5">
              Photo URL <span className="text-gray-400 font-normal">(optional)</span>
            </label>
            <div className="relative">
              <ImageIcon className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
              <input
                {...profileForm.register('avatarUrl')}
                placeholder="https://example.com/photo.jpg"
                className="w-full pl-10 pr-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 outline-none"
              />
            </div>
          </div>

          <button
            type="submit"
            disabled={profileForm.formState.isSubmitting}
            className="bg-primary-600 hover:bg-primary-700 text-white font-medium px-5 py-2.5 rounded-lg transition disabled:opacity-60"
          >
            Save Profile
          </button>
        </form>
      </div>

      {/* Password */}
      <div className="bg-white rounded-xl border border-gray-100 shadow-sm p-6 mb-6">
        <h2 className="font-semibold text-gray-900 mb-4 flex items-center gap-2">
          <Lock className="w-4 h-4 text-primary-600" />
          Change Password
        </h2>
        <form onSubmit={passwordForm.handleSubmit(onPasswordSubmit)} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1.5">Current Password</label>
            <input
              type="password"
              {...passwordForm.register('currentPassword')}
              className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 outline-none"
            />
            {passwordForm.formState.errors.currentPassword && (
              <p className="mt-1 text-sm text-red-600">
                {passwordForm.formState.errors.currentPassword.message}
              </p>
            )}
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1.5">New Password</label>
            <input
              type="password"
              {...passwordForm.register('newPassword')}
              className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 outline-none"
            />
            {passwordForm.formState.errors.newPassword && (
              <p className="mt-1 text-sm text-red-600">
                {passwordForm.formState.errors.newPassword.message}
              </p>
            )}
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1.5">Confirm New Password</label>
            <input
              type="password"
              {...passwordForm.register('confirmPassword')}
              className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 outline-none"
            />
            {passwordForm.formState.errors.confirmPassword && (
              <p className="mt-1 text-sm text-red-600">
                {passwordForm.formState.errors.confirmPassword.message}
              </p>
            )}
          </div>
          <button
            type="submit"
            disabled={passwordForm.formState.isSubmitting}
            className="bg-gray-800 hover:bg-gray-900 text-white font-medium px-5 py-2.5 rounded-lg transition disabled:opacity-60"
          >
            Update Password
          </button>
        </form>
      </div>

      {/* Danger zone */}
      <div className="bg-white rounded-xl border border-red-100 shadow-sm p-6">
        <h3 className="font-semibold text-red-700 mb-1">Danger Zone</h3>
        <p className="text-sm text-gray-500 mb-4">
          Clear all local data and log out to the home page.
        </p>
        <button
          onClick={handleClearData}
          className="px-4 py-2 border border-red-300 text-red-600 hover:bg-red-50 rounded-lg text-sm font-medium transition"
        >
          Clear All Data
        </button>
      </div>
    </div>
  );
}