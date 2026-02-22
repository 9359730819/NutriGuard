import React from 'react';
import { ChildRecord, School } from '../types';
import { StatusBadge } from './StatusBadge';
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip, Legend } from 'recharts';
import { AlertTriangle, Users, TrendingDown, Download } from 'lucide-react';

interface SchoolDashboardProps {
  records: ChildRecord[];
  school: School;
}

export const SchoolDashboard: React.FC<SchoolDashboardProps> = ({ records, school }) => {
  const schoolRecords = records.filter(r => r.schoolId === school.id);
  const samRecords = schoolRecords.filter(r => r.status === 'SAM');
  const mamRecords = schoolRecords.filter(r => r.status === 'MAM');
  const normalRecords = schoolRecords.filter(r => r.status === 'Normal');

  const chartData = [
    { name: 'Normal', value: normalRecords.length, color: '#10b981' },
    { name: 'MAM', value: mamRecords.length, color: '#f59e0b' },
    { name: 'SAM', value: samRecords.length, color: '#f43f5e' },
  ];

  const handleExport = () => {
    alert('Exporting school report to PDF...');
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">{school.name} Dashboard</h1>
          <p className="text-slate-500">{school.district} District • {school.areaType} Area</p>
        </div>
        <button 
          onClick={handleExport}
          className="flex items-center gap-2 px-4 py-2 bg-white border border-slate-200 rounded-xl text-slate-700 font-medium hover:bg-slate-50 transition-all"
        >
          <Download size={18} />
          Export Report
        </button>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm">
          <div className="flex items-center justify-between mb-4">
            <div className="p-2 bg-indigo-50 text-indigo-600 rounded-lg">
              <Users size={24} />
            </div>
            <span className="text-xs font-medium text-emerald-600 bg-emerald-50 px-2 py-1 rounded-full">+12% this month</span>
          </div>
          <p className="text-slate-500 text-sm font-medium">Total Children</p>
          <h3 className="text-3xl font-bold text-slate-900">{schoolRecords.length}</h3>
        </div>

        <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm">
          <div className="flex items-center justify-between mb-4">
            <div className="p-2 bg-rose-50 text-rose-600 rounded-lg">
              <AlertTriangle size={24} />
            </div>
            <span className="text-xs font-medium text-rose-600 bg-rose-50 px-2 py-1 rounded-full">High Priority</span>
          </div>
          <p className="text-slate-500 text-sm font-medium">SAM Cases</p>
          <h3 className="text-3xl font-bold text-slate-900">{samRecords.length}</h3>
        </div>

        <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm">
          <div className="flex items-center justify-between mb-4">
            <div className="p-2 bg-amber-50 text-amber-600 rounded-lg">
              <TrendingDown size={24} />
            </div>
            <span className="text-xs font-medium text-amber-600 bg-amber-50 px-2 py-1 rounded-full">Needs Monitoring</span>
          </div>
          <p className="text-slate-500 text-sm font-medium">MAM Cases</p>
          <h3 className="text-3xl font-bold text-slate-900">{mamRecords.length}</h3>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Distribution Chart */}
        <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm">
          <h3 className="text-lg font-semibold text-slate-900 mb-6">Nutritional Distribution</h3>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={chartData}
                  cx="50%"
                  cy="50%"
                  innerRadius={60}
                  outerRadius={80}
                  paddingAngle={5}
                  dataKey="value"
                >
                  {chartData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip 
                  contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 4px 12px rgba(0,0,0,0.1)' }}
                />
                <Legend verticalAlign="bottom" height={36}/>
              </PieChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* High Alert List */}
        <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm flex flex-col">
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-lg font-semibold text-slate-900">High Alert List (SAM)</h3>
            <span className="text-xs font-bold text-rose-600 uppercase tracking-wider">Immediate Action</span>
          </div>
          <div className="flex-1 overflow-auto">
            <table className="w-full text-left">
              <thead>
                <tr className="text-slate-400 text-xs uppercase tracking-wider border-b border-slate-100">
                  <th className="pb-3 font-medium">Name</th>
                  <th className="pb-3 font-medium">MUAC</th>
                  <th className="pb-3 font-medium">Z-Score</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-50">
                {samRecords.length > 0 ? samRecords.map(record => (
                  <tr key={record.id} className="group hover:bg-slate-50 transition-colors">
                    <td className="py-3 font-medium text-slate-900">{record.name}</td>
                    <td className="py-3 text-rose-600 font-bold">{record.muacCm} cm</td>
                    <td className="py-3 text-slate-500">{record.zScore}</td>
                  </tr>
                )) : (
                  <tr>
                    <td colSpan={3} className="py-8 text-center text-slate-400 italic">No SAM cases detected in this unit.</td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      {/* Full Student Table */}
      <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
        <div className="p-6 border-b border-slate-100">
          <h3 className="text-lg font-semibold text-slate-900">All Student Records</h3>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead className="bg-slate-50">
              <tr className="text-slate-500 text-xs uppercase tracking-wider">
                <th className="px-6 py-4 font-semibold">Child Name</th>
                <th className="px-6 py-4 font-semibold">Age (M)</th>
                <th className="px-6 py-4 font-semibold">H/W</th>
                <th className="px-6 py-4 font-semibold">MUAC</th>
                <th className="px-6 py-4 font-semibold">Status</th>
                <th className="px-6 py-4 font-semibold">Last Checked</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {schoolRecords.map(record => (
                <tr key={record.id} className="hover:bg-slate-50 transition-colors">
                  <td className="px-6 py-4 font-medium text-slate-900">{record.name}</td>
                  <td className="px-6 py-4 text-slate-600">{record.ageMonths}</td>
                  <td className="px-6 py-4 text-slate-600">{record.heightCm}cm / {record.weightKg}kg</td>
                  <td className="px-6 py-4 text-slate-600">{record.muacCm}cm</td>
                  <td className="px-6 py-4">
                    <StatusBadge status={record.status} />
                  </td>
                  <td className="px-6 py-4 text-slate-500 text-sm">{record.timestamp}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
