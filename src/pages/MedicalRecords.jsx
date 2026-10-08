import { useEffect, useState } from 'react';
import { storage, KEYS } from '../utils/storage';
import { Search, FileText, Plus, X } from 'lucide-react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';

const schema = z.object({
  patientId: z.string().min(1, 'Select a patient'),
  doctorName: z.string().min(2, 'Doctor name required'),
  diagnosis: z.string().min(3, 'Diagnosis required'),
  notes: z.string().min(5, 'Notes required'),
  date: z.string().min(1, 'Date required'),
});

export default function MedicalRecords() {
  const [records, setRecords] = useState([]);
  const [patients, setPatients] = useState([]);
  const [search, setSearch] = useState('');
  const [showModal, setShowModal] = useState(false);

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = useForm({ resolver: zodResolver(schema) });

  const load = () => {
    setRecords(storage.get(KEYS.RECORDS) || []);
    setPatients(storage.get(KEYS.PATIENTS) || []);
  };

  useEffect(() => {
    load();
  }, []);

  const filtered = records.filter(
    (r) =>
      r.patientName.toLowerCase().includes(search.toLowerCase()) ||
      r.diagnosis.toLowerCase().includes(search.toLowerCase()) ||
      r.doctorName.toLowerCase().includes(search.toLowerCase())
  );

  const onSubmit = (data) => {
    const patient = patients.find((p) => p.id === data.patientId);
    const list = storage.get(KEYS.RECORDS) || [];
    list.unshift({
      id: `r${Date.now()}`,
      patientId: data.patientId,
      patientName: patient?.name || 'Unknown',
      doctorName: data.doctorName,
      diagnosis: data.diagnosis,
      notes: data.notes,
      date: data.date,
    });
    storage.set(KEYS.RECORDS, list);
    load();
    setShowModal(false);
    reset();
  };

  return (
    <div className="p-6 lg:p-8">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Medical Records</h1>
          <p className="text-gray-500 text-sm mt-0.5">{records.length} records</p>
        </div>
        <button
          onClick={() => {
            reset({
              patientId: '',
              doctorName: '',
              diagnosis: '',
              notes: '',
              date: new Date().toISOString().split('T')[0],
            });
            setShowModal(true);
          }}
          className="inline-flex items-center gap-2 bg-primary-600 hover:bg-primary-700 text-white px-4 py-2.5 rounded-lg text-sm font-medium transition"
        >
          <Plus className="w-4 h-4" />
          Add Record
        </button>
      </div>

      <div className="relative mb-5">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
        <input
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Search by patient, diagnosis or doctor..."
          className="w-full pl-10 pr-4 py-2.5 border border-gray-200 rounded-lg bg-white focus:ring-2 focus:ring-primary-500 outline-none"
        />
      </div>

      <div className="grid gap-4">
        {filtered.length === 0 ? (
          <div className="bg-white rounded-xl border border-gray-100 py-16 text-center text-gray-400">
            No medical records found
          </div>
        ) : (
          filtered.map((r) => (
            <div
              key={r.id}
              className="bg-white rounded-xl border border-gray-100 shadow-sm p-5 hover:shadow-md transition"
            >
              <div className="flex items-start gap-4">
                <div className="w-10 h-10 rounded-lg bg-primary-100 flex items-center justify-center shrink-0">
                  <FileText className="w-5 h-5 text-primary-600" />
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex flex-wrap items-center gap-x-3 gap-y-1 mb-1">
                    <h3 className="font-semibold text-gray-900">{r.patientName}</h3>
                    <span className="text-xs text-gray-400">•</span>
                    <span className="text-sm text-gray-500">{r.date}</span>
                  </div>
                  <p className="text-sm font-medium text-primary-700 mb-1">{r.diagnosis}</p>
                  <p className="text-sm text-gray-600">{r.notes}</p>
                  <p className="text-xs text-gray-400 mt-2">Dr. {r.doctorName.replace(/^Dr\.\s*/, '')}</p>
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
              <h3 className="font-semibold text-lg">Add Medical Record</h3>
              <button onClick={() => setShowModal(false)} className="p-1 hover:bg-gray-100 rounded-lg">
                <X className="w-5 h-5" />
              </button>
            </div>
            <form onSubmit={handleSubmit(onSubmit)} className="p-6 space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Patient</label>
                <select
                  {...register('patientId')}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 outline-none"
                >
                  <option value="">Select patient</option>
                  {patients.map((p) => (
                    <option key={p.id} value={p.id}>{p.name}</option>
                  ))}
                </select>
                {errors.patientId && <p className="text-xs text-red-600 mt-1">{errors.patientId.message}</p>}
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Doctor Name</label>
                <input
                  {...register('doctorName')}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 outline-none"
                  placeholder="Dr. John Smith"
                />
                {errors.doctorName && <p className="text-xs text-red-600 mt-1">{errors.doctorName.message}</p>}
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Diagnosis</label>
                <input
                  {...register('diagnosis')}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 outline-none"
                />
                {errors.diagnosis && <p className="text-xs text-red-600 mt-1">{errors.diagnosis.message}</p>}
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Notes</label>
                <textarea
                  {...register('notes')}
                  rows={3}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 outline-none resize-none"
                />
                {errors.notes && <p className="text-xs text-red-600 mt-1">{errors.notes.message}</p>}
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Date</label>
                <input
                  type="date"
                  {...register('date')}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 outline-none"
                />
                {errors.date && <p className="text-xs text-red-600 mt-1">{errors.date.message}</p>}
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
                  Save Record
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
