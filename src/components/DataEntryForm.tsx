import React, { useState } from 'react';
import { calculateNutritionStatus } from '../utils/nutrition';
import { ChildRecord, Gender, School } from '../types';
import { StatusBadge } from './StatusBadge';
import { UserPlus, Save, Calculator } from 'lucide-react';

interface DataEntryFormProps {
  onSave: (record: Omit<ChildRecord, 'id' | 'timestamp'>) => void;
  schools: School[];
}

export const DataEntryForm: React.FC<DataEntryFormProps> = ({ onSave, schools }) => {
  const [formData, setFormData] = useState({
    name: '',
    ageMonths: '',
    gender: 'male' as Gender,
    heightCm: '',
    weightKg: '',
    muacCm: '',
    schoolId: schools[0]?.id || '',
  });

  const [preview, setPreview] = useState<{ status: string; zScore: number } | null>(null);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleCalculate = () => {
    if (!formData.heightCm || !formData.weightKg || !formData.muacCm) return;
    const result = calculateNutritionStatus(
      Number(formData.heightCm),
      Number(formData.weightKg),
      Number(formData.muacCm)
    );
    setPreview(result);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const result = calculateNutritionStatus(
      Number(formData.heightCm),
      Number(formData.weightKg),
      Number(formData.muacCm)
    );
    
    const selectedSchool = schools.find(s => s.id === formData.schoolId);

    onSave({
      name: formData.name,
      ageMonths: Number(formData.ageMonths),
      gender: formData.gender,
      heightCm: Number(formData.heightCm),
      weightKg: Number(formData.weightKg),
      muacCm: Number(formData.muacCm),
      status: result.status,
      zScore: result.zScore,
      schoolId: formData.schoolId,
      areaType: selectedSchool?.areaType || 'Rural',
    });

    // Reset form
    setFormData({
      name: '',
      ageMonths: '',
      gender: 'male',
      heightCm: '',
      weightKg: '',
      muacCm: '',
      schoolId: schools[0]?.id || '',
    });
    setPreview(null);
  };

  return (
    <div className="bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden">
      <div className="p-6 border-bottom border-slate-100 bg-slate-50/50">
        <div className="flex items-center gap-3">
          <div className="p-2 bg-indigo-600 rounded-lg text-white">
            <UserPlus size={20} />
          </div>
          <div>
            <h2 className="text-lg font-semibold text-slate-900">Child Data Entry</h2>
            <p className="text-sm text-slate-500">Log new measurement for surveillance</p>
          </div>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="p-6 space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-2">
            <label className="text-sm font-medium text-slate-700">Full Name</label>
            <input
              required
              type="text"
              name="name"
              value={formData.name}
              onChange={handleChange}
              className="w-full px-4 py-2 rounded-xl border border-slate-200 focus:ring-2 focus:ring-indigo-500 focus:border-transparent outline-none transition-all"
              placeholder="Enter child's name"
            />
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium text-slate-700">Age (Months)</label>
            <input
              required
              type="number"
              name="ageMonths"
              value={formData.ageMonths}
              onChange={handleChange}
              className="w-full px-4 py-2 rounded-xl border border-slate-200 focus:ring-2 focus:ring-indigo-500 focus:border-transparent outline-none transition-all"
              placeholder="e.g. 24"
            />
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium text-slate-700">Gender</label>
            <select
              name="gender"
              value={formData.gender}
              onChange={handleChange}
              className="w-full px-4 py-2 rounded-xl border border-slate-200 focus:ring-2 focus:ring-indigo-500 focus:border-transparent outline-none transition-all"
            >
              <option value="male">Male</option>
              <option value="female">Female</option>
            </select>
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium text-slate-700">School/Anganwadi</label>
            <select
              name="schoolId"
              value={formData.schoolId}
              onChange={handleChange}
              className="w-full px-4 py-2 rounded-xl border border-slate-200 focus:ring-2 focus:ring-indigo-500 focus:border-transparent outline-none transition-all"
            >
              {schools.map(school => (
                <option key={school.id} value={school.id}>{school.name}</option>
              ))}
            </select>
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium text-slate-700">Height (cm)</label>
            <input
              required
              type="number"
              step="0.1"
              name="heightCm"
              value={formData.heightCm}
              onChange={handleChange}
              onBlur={handleCalculate}
              className="w-full px-4 py-2 rounded-xl border border-slate-200 focus:ring-2 focus:ring-indigo-500 focus:border-transparent outline-none transition-all"
              placeholder="e.g. 85.5"
            />
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium text-slate-700">Weight (kg)</label>
            <input
              required
              type="number"
              step="0.1"
              name="weightKg"
              value={formData.weightKg}
              onChange={handleChange}
              onBlur={handleCalculate}
              className="w-full px-4 py-2 rounded-xl border border-slate-200 focus:ring-2 focus:ring-indigo-500 focus:border-transparent outline-none transition-all"
              placeholder="e.g. 10.2"
            />
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium text-slate-700">MUAC (cm)</label>
            <input
              required
              type="number"
              step="0.1"
              name="muacCm"
              value={formData.muacCm}
              onChange={handleChange}
              onBlur={handleCalculate}
              className="w-full px-4 py-2 rounded-xl border border-slate-200 focus:ring-2 focus:ring-indigo-500 focus:border-transparent outline-none transition-all"
              placeholder="e.g. 12.5"
            />
          </div>
        </div>

        {preview && (
          <div className="p-4 bg-slate-50 rounded-2xl border border-slate-100 flex items-center justify-between animate-in fade-in slide-in-from-top-2">
            <div className="flex items-center gap-4">
              <div className="p-2 bg-white rounded-lg shadow-sm">
                <Calculator className="text-indigo-600" size={20} />
              </div>
              <div>
                <p className="text-xs font-medium text-slate-500 uppercase tracking-wider">Instant Assessment</p>
                <div className="flex items-center gap-2">
                  <span className="text-sm font-bold text-slate-900">Z-Score: {preview.zScore}</span>
                  <StatusBadge status={preview.status as any} />
                </div>
              </div>
            </div>
          </div>
        )}

        <button
          type="submit"
          className="w-full bg-indigo-600 hover:bg-indigo-700 text-white font-semibold py-3 px-6 rounded-xl shadow-lg shadow-indigo-200 transition-all flex items-center justify-center gap-2"
        >
          <Save size={20} />
          Save Record
        </button>
      </form>
    </div>
  );
};
