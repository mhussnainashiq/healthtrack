import { createContext, useContext, useState, useEffect } from 'react';
import { storage, KEYS, initStorage } from '../utils/storage';

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    initStorage();
    const current = storage.get(KEYS.CURRENT_USER);
    if (current) setUser(current);
    setLoading(false);
  }, []);

  // Login with email OR phone
  const login = (identifier, password) => {
    const users = storage.get(KEYS.USERS) || [];
    const id = identifier.trim().toLowerCase();
    const found = users.find((u) => {
      const emailMatch = u.email && u.email.toLowerCase() === id;
      const phoneMatch =
        u.phone &&
        u.phone.replace(/\s/g, '') === identifier.trim().replace(/\s/g, '');
      return (emailMatch || phoneMatch) && u.password === password;
    });
    if (!found) throw new Error('Invalid email/phone or password');
    const { password: _, ...safeUser } = found;
    storage.set(KEYS.CURRENT_USER, safeUser);
    setUser(safeUser);
    return safeUser;
  };

  const register = ({ name, email = '', phone, password, role = 'patient' }) => {
    const users = storage.get(KEYS.USERS) || [];

    if (!phone || phone.trim().length < 10) {
      throw new Error('Phone number is required');
    }

    const phoneClean = phone.trim().replace(/\s/g, '');
    if (users.some((u) => u.phone && u.phone.replace(/\s/g, '') === phoneClean)) {
      throw new Error('Phone number already registered');
    }

    if (email && email.trim()) {
      if (users.some((u) => u.email && u.email.toLowerCase() === email.toLowerCase())) {
        throw new Error('Email already registered');
      }
    }

    const newUser = {
      id: `u${Date.now()}`,
      name,
      email: email?.trim() || '',
      phone: phoneClean,
      password,
      role,
      avatar: '',
    };
    users.push(newUser);
    storage.set(KEYS.USERS, users);

    if (role === 'patient') {
      const patients = storage.get(KEYS.PATIENTS) || [];
      patients.push({
        id: `p${Date.now()}`,
        name,
        email: email?.trim() || '',
        phone: phoneClean,
        age: null,
        gender: '',
        bloodGroup: '',
        address: '',
        createdAt: new Date().toISOString().split('T')[0],
      });
      storage.set(KEYS.PATIENTS, patients);
    }

    if (role === 'doctor') {
      const doctors = storage.get(KEYS.DOCTORS) || [];
      doctors.push({
        id: `d${Date.now()}`,
        name: name.startsWith('Dr.') ? name : `Dr. ${name}`,
        specialty: 'General Physician',
        experience: 0,
        phone: phoneClean,
        email: email?.trim() || '',
        status: 'available',
        patients: 0,
      });
      storage.set(KEYS.DOCTORS, doctors);
    }

    const { password: _, ...safeUser } = newUser;
    storage.set(KEYS.CURRENT_USER, safeUser);
    setUser(safeUser);
    return safeUser;
  };

  const logout = () => {
    storage.remove(KEYS.CURRENT_USER);
    setUser(null);
  };

  const updateProfile = (updates) => {
    const users = storage.get(KEYS.USERS) || [];
    const idx = users.findIndex((u) => u.id === user?.id);
    if (idx === -1) return;

    users[idx] = { ...users[idx], ...updates };
    storage.set(KEYS.USERS, users);

    if (users[idx].role === 'doctor') {
      const doctors = storage.get(KEYS.DOCTORS) || [];
      const dIdx = doctors.findIndex(
        (d) =>
          d.email?.toLowerCase() === users[idx].email?.toLowerCase() ||
          d.email?.toLowerCase() === user?.email?.toLowerCase()
      );
      if (dIdx !== -1) {
        if (updates.name) doctors[dIdx].name = updates.name;
        if (updates.email) doctors[dIdx].email = updates.email;
        if (updates.phone) doctors[dIdx].phone = updates.phone;
        storage.set(KEYS.DOCTORS, doctors);
      }
    }

    if (users[idx].role === 'patient') {
      const patients = storage.get(KEYS.PATIENTS) || [];
      const pIdx = patients.findIndex(
        (p) =>
          (p.phone && p.phone === users[idx].phone) ||
          (p.email && p.email.toLowerCase() === users[idx].email?.toLowerCase()) ||
          p.name?.toLowerCase() === user?.name?.toLowerCase()
      );
      if (pIdx !== -1) {
        if (updates.name) patients[pIdx].name = updates.name;
        if (updates.email !== undefined) patients[pIdx].email = updates.email;
        if (updates.phone) patients[pIdx].phone = updates.phone;
        storage.set(KEYS.PATIENTS, patients);
      }
    }

    const { password: _, ...safeUser } = users[idx];
    storage.set(KEYS.CURRENT_USER, safeUser);
    setUser(safeUser);
  };

  return (
    <AuthContext.Provider
      value={{ user, login, register, logout, updateProfile, loading }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be used within AuthProvider');
  return ctx;
};