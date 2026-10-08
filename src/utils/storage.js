const KEYS = {
  USERS: 'ht_users',
  PATIENTS: 'ht_patients',
  DOCTORS: 'ht_doctors',
  APPOINTMENTS: 'ht_appointments',
  RECORDS: 'ht_records',
  NOTICES: 'ht_notices',
  CURRENT_USER: 'ht_current_user',
};

export const storage = {
  get(key) {
    try {
      const raw = localStorage.getItem(key);
      return raw ? JSON.parse(raw) : null;
    } catch {
      return null;
    }
  },
  set(key, value) {
    localStorage.setItem(key, JSON.stringify(value));
  },
  remove(key) {
    localStorage.removeItem(key);
  },
};

export function initStorage() {
  if (!storage.get(KEYS.USERS)) {
    storage.set(KEYS.USERS, [
      {
        id: 'u1',
        name: 'Admin User',
        email: 'admin@healthtrack.com',
        password: 'admin123',
        role: 'admin',
        avatar: 'https://i.pravatar.cc/150?u=admin',
      },
      {
        id: 'u2',
        name: 'Dr. Sarah Wilson',
        email: 'sarah@healthtrack.com',
        password: 'doctor123',
        role: 'doctor',
        specialty: 'Cardiology',
        avatar: 'https://i.pravatar.cc/150?u=sarah',
      },
      {
        id: 'u3',
        name: 'Ayesha Khan',
        email: 'ayesha@example.com',
        password: 'patient123',
        role: 'patient',
        avatar: 'https://i.pravatar.cc/150?u=ayesha',
      },
    ]);
  }

  if (!storage.get(KEYS.PATIENTS)) {
    storage.set(KEYS.PATIENTS, [
      {
        id: 'p1',
        name: 'Ayesha Khan',
        age: 32,
        gender: 'Female',
        phone: '+92 300 1234567',
        email: 'ayesha@example.com',
        bloodGroup: 'A+',
        address: 'Lahore, Pakistan',
        createdAt: '2024-11-12',
      },
      {
        id: 'p2',
        name: 'Rahul Sharma',
        age: 45,
        gender: 'Male',
        phone: '+91 98765 43210',
        email: 'rahul@example.com',
        bloodGroup: 'B+',
        address: 'Mumbai, India',
        createdAt: '2024-12-01',
      },
      {
        id: 'p3',
        name: 'Sneha Patel',
        age: 28,
        gender: 'Female',
        phone: '+91 91234 56789',
        email: 'sneha@example.com',
        bloodGroup: 'O-',
        address: 'Ahmedabad, India',
        createdAt: '2025-01-15',
      },
      {
        id: 'p4',
        name: 'Ali Hassan',
        age: 51,
        gender: 'Male',
        phone: '+92 321 9876543',
        email: 'ali@example.com',
        bloodGroup: 'AB+',
        address: 'Karachi, Pakistan',
        createdAt: '2025-02-20',
      },
    ]);
  }

  if (!storage.get(KEYS.DOCTORS)) {
    storage.set(KEYS.DOCTORS, [
      {
        id: 'd1',
        name: 'Dr. Sarah Wilson',
        specialty: 'Cardiology',
        experience: 12,
        phone: '+1 555-0101',
        email: 'sarah@healthtrack.com',
        status: 'available',
        patients: 148,
      },
      {
        id: 'd2',
        name: 'Dr. John Smith',
        specialty: 'General Physician',
        experience: 8,
        phone: '+1 555-0102',
        email: 'john@healthtrack.com',
        status: 'available',
        patients: 210,
      },
      {
        id: 'd3',
        name: 'Dr. Emily Lee',
        specialty: 'Dermatology',
        experience: 6,
        phone: '+1 555-0103',
        email: 'emily@healthtrack.com',
        status: 'busy',
        patients: 95,
      },
      {
        id: 'd4',
        name: 'Dr. Michael Wilson',
        specialty: 'Orthopedics',
        experience: 15,
        phone: '+1 555-0104',
        email: 'michael@healthtrack.com',
        status: 'available',
        patients: 176,
      },
      {
        id: 'd5',
        name: 'Dr. Priya Mehta',
        specialty: 'Pediatrics',
        experience: 9,
        phone: '+1 555-0105',
        email: 'priya@healthtrack.com',
        status: 'available',
        patients: 132,
      },
    ]);
  }

  if (!storage.get(KEYS.APPOINTMENTS)) {
    storage.set(KEYS.APPOINTMENTS, [
      {
        id: 'a1',
        patientId: 'p1',
        patientName: 'Ayesha Khan',
        doctorId: 'd2',
        doctorName: 'Dr. John Smith',
        date: '2025-04-20',
        time: '10:00 AM',
        status: 'Confirmed',
        reason: 'Regular checkup',
      },
      {
        id: 'a2',
        patientId: 'p2',
        patientName: 'Rahul Sharma',
        doctorId: 'd3',
        doctorName: 'Dr. Emily Lee',
        date: '2025-04-18',
        time: '02:30 PM',
        status: 'Confirmed',
        reason: 'Skin allergy',
      },
      {
        id: 'a3',
        patientId: 'p3',
        patientName: 'Sneha Patel',
        doctorId: 'd4',
        doctorName: 'Dr. Michael Wilson',
        date: '2025-04-15',
        time: '11:00 AM',
        status: 'Completed',
        reason: 'Knee pain',
      },
      {
        id: 'a4',
        patientId: 'p4',
        patientName: 'Ali Hassan',
        doctorId: 'd1',
        doctorName: 'Dr. Sarah Wilson',
        date: '2025-04-22',
        time: '09:00 AM',
        status: 'Confirmed',
        reason: 'Chest discomfort',
      },
      {
        id: 'a5',
        patientId: 'p1',
        patientName: 'Ayesha Khan',
        doctorId: 'd5',
        doctorName: 'Dr. Priya Mehta',
        date: '2025-04-10',
        time: '03:00 PM',
        status: 'Completed',
        reason: 'Follow-up',
      },
    ]);
  }

  if (!storage.get(KEYS.RECORDS)) {
    storage.set(KEYS.RECORDS, [
      {
        id: 'r1',
        patientId: 'p1',
        patientName: 'Ayesha Khan',
        doctorName: 'Dr. John Smith',
        diagnosis: 'Hypertension',
        notes: 'Prescribed Amlodipine 5mg once daily. Monitor BP weekly.',
        date: '2025-03-10',
      },
      {
        id: 'r2',
        patientId: 'p2',
        patientName: 'Rahul Sharma',
        doctorName: 'Dr. Emily Lee',
        diagnosis: 'Contact Dermatitis',
        notes: 'Topical steroid cream for 7 days. Avoid allergens.',
        date: '2025-02-22',
      },
      {
        id: 'r3',
        patientId: 'p3',
        patientName: 'Sneha Patel',
        doctorName: 'Dr. Michael Wilson',
        diagnosis: 'Mild Osteoarthritis',
        notes: 'Physiotherapy recommended. Pain management with NSAIDs.',
        date: '2025-04-15',
      },
      {
        id: 'r4',
        patientId: 'p4',
        patientName: 'Ali Hassan',
        doctorName: 'Dr. Sarah Wilson',
        diagnosis: 'Angina (suspected)',
        notes: 'ECG and stress test ordered. Started on beta-blockers.',
        date: '2025-03-28',
      },
    ]);
  }

  if (!storage.get(KEYS.NOTICES)) {
    storage.set(KEYS.NOTICES, [
      {
        id: 'n1',
        title: 'Welcome to HealthTrack',
        message: 'Book appointments online and manage your health records easily.',
        target: 'all',
        createdAt: new Date().toISOString().split('T')[0],
        active: true,
      },
      {
        id: 'n2',
        title: 'Clinic Hours Updated',
        message: 'We are open Mon–Sat, 9:00 AM – 6:00 PM. Emergency services 24/7.',
        target: 'home',
        createdAt: new Date().toISOString().split('T')[0],
        active: true,
      },
    ]);
  }
}

export { KEYS };