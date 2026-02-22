import React, { useState } from 'react';
import { ChildRecord, School, AreaType } from '../types';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, BarChart, Bar, Legend, Cell } from 'recharts';
import { Map, Filter, Activity, BarChart3, Download } from 'lucide-react';

interface GovernmentDashboardProps {
  records: ChildRecord[];
  schools: School[];
}

export const GovernmentDashboard: React.FC<GovernmentDashboardProps> = ({ records, schools }) => {
  const [areaFilter, setAreaFilter] = useState<AreaType | 'All'>('All');
  const [ageFilter, setAgeFilter] = useState<'All' | '0-24' | '25-60'>('All');

  const filteredRecords = records.filter(r => {
    const matchesArea = areaFilter === 'All' || r.areaType === areaFilter;
    const matchesAge = ageFilter === 'All' || 
      (ageFilter === '0-24' ? r.ageMonths <= 24 : r.ageMonths > 24);
    return matchesArea && matchesAge;
  });

  // Trend Data (Mocked for 6 months)
  const trendData = [
    { month: 'Oct', sam: 12, mam: 25 },
    { month: 'Nov', sam: 10, mam: 22 },
    { month: 'Dec', sam: 15, mam: 28 },
    { month: 'Jan', sam: 8, mam: 18 },
    { month: 'Feb', sam: 6, mam: 15 },
    { month: 'Mar', sam: 5, mam: 12 },
  ];

  // Geographic prevalence (Prevalence by school)
  const geoData = schools.map(school => {
    const sRecords = filteredRecords.filter(r => r.schoolId === school.id);
    const malRecords = sRecords.filter(r => r.status !== 'Normal');
    const prevalence = sRecords.length > 0 ? (malRecords.length / sRecords.length) * 100 : 0;
    return {
      name: school.name,
      prevalence: parseFloat(prevalence.toFixed(1)),
      total: sRecords.length,
      area: school.areaType
    };
  });

  const handleExport = () => {
    alert('Exporting District Surveillance Report to Excel...');
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">District Surveillance Dashboard</h1>
          <p className="text-slate-500">State Level Monitoring • Central District</p>
        </div>
        <div className="flex items-center gap-3">
          <button 
            onClick={handleExport}
            className="flex items-center gap-2 px-4 py-2 bg-white border border-slate-200 rounded-xl text-slate-700 font-medium hover:bg-slate-50 transition-all"
          >
            <Download size={18} />
            Export Data
          </button>
        </div>
      </div>

      {/* Filters */}
      <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-sm flex flex-wrap items-center gap-6">
        <div className="flex items-center gap-2">
          <Filter size={18} className="text-slate-400" />
          <span className="text-sm font-medium text-slate-700">Filters:</span>
        </div>
        
        <div className="flex items-center gap-2">
          <label className="text-xs font-semibold text-slate-500 uppercase">Area Type</label>
          <select 
            value={areaFilter}
            onChange={(e) => setAreaFilter(e.target.value as any)}
            className="text-sm bg-slate-50 border border-slate-200 rounded-lg px-3 py-1.5 outline-none focus:ring-2 focus:ring-indigo-500"
          >
            <option value="All">All Areas</option>
            <option value="Rural">Rural</option>
            <option value="Urban">Urban</option>
          </select>
        </div>

        <div className="flex items-center gap-2">
          <label className="text-xs font-semibold text-slate-500 uppercase">Age Group</label>
          <select 
            value={ageFilter}
            onChange={(e) => setAgeFilter(e.target.value as any)}
            className="text-sm bg-slate-50 border border-slate-200 rounded-lg px-3 py-1.5 outline-none focus:ring-2 focus:ring-indigo-500"
          >
            <option value="All">All Ages</option>
            <option value="0-24">0-24 Months</option>
            <option value="25-60">25-60 Months</option>
          </select>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Predictive Trends */}
        <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm">
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center gap-2">
              <Activity className="text-indigo-600" size={20} />
              <h3 className="text-lg font-semibold text-slate-900">6-Month Malnutrition Trend</h3>
            </div>
            <span className="text-xs font-medium text-emerald-600 bg-emerald-50 px-2 py-1 rounded-full">Decreasing Trend</span>
          </div>
          <div className="h-72">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={trendData}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                <XAxis dataKey="month" axisLine={false} tickLine={false} tick={{ fill: '#94a3b8', fontSize: 12 }} />
                <YAxis axisLine={false} tickLine={false} tick={{ fill: '#94a3b8', fontSize: 12 }} />
                <Tooltip 
                  contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 4px 12px rgba(0,0,0,0.1)' }}
                />
                <Legend />
                <Line type="monotone" dataKey="sam" stroke="#f43f5e" strokeWidth={3} dot={{ r: 4, fill: '#f43f5e' }} activeDot={{ r: 6 }} name="SAM Cases" />
                <Line type="monotone" dataKey="mam" stroke="#f59e0b" strokeWidth={3} dot={{ r: 4, fill: '#f59e0b' }} activeDot={{ r: 6 }} name="MAM Cases" />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Heat Map / Geographic Analysis */}
        <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm">
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center gap-2">
              <Map className="text-indigo-600" size={20} />
              <h3 className="text-lg font-semibold text-slate-900">Prevalence Heat Map (by School)</h3>
            </div>
            <BarChart3 className="text-slate-300" size={20} />
          </div>
          <div className="h-72">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={geoData} layout="vertical">
                <CartesianGrid strokeDasharray="3 3" horizontal={false} stroke="#f1f5f9" />
                <XAxis type="number" hide />
                <YAxis 
                  dataKey="name" 
                  type="category" 
                  width={150} 
                  axisLine={false} 
                  tickLine={false} 
                  tick={{ fill: '#475569', fontSize: 11, fontWeight: 500 }} 
                />
                <Tooltip 
                  formatter={(value) => [`${value}%`, 'Prevalence']}
                  contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 4px 12px rgba(0,0,0,0.1)' }}
                />
                <Bar dataKey="prevalence" radius={[0, 4, 4, 0]}>
                  {geoData.map((entry, index) => (
                    <Cell 
                      key={`cell-${index}`} 
                      fill={entry.prevalence > 30 ? '#f43f5e' : entry.prevalence > 15 ? '#f59e0b' : '#10b981'} 
                    />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      {/* Comparative Analytics Table */}
      <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
        <div className="p-6 border-b border-slate-100 flex items-center justify-between">
          <h3 className="text-lg font-semibold text-slate-900">Comparative Unit Analytics</h3>
          <span className="text-sm text-slate-500">Showing {geoData.length} units</span>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead className="bg-slate-50">
              <tr className="text-slate-500 text-xs uppercase tracking-wider">
                <th className="px-6 py-4 font-semibold">Unit Name</th>
                <th className="px-6 py-4 font-semibold">Area</th>
                <th className="px-6 py-4 font-semibold">Total Children</th>
                <th className="px-6 py-4 font-semibold">Malnutrition Rate</th>
                <th className="px-6 py-4 font-semibold">Risk Level</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {geoData.map((unit, idx) => (
                <tr key={idx} className="hover:bg-slate-50 transition-colors">
                  <td className="px-6 py-4 font-medium text-slate-900">{unit.name}</td>
                  <td className="px-6 py-4 text-slate-600">{unit.area}</td>
                  <td className="px-6 py-4 text-slate-600">{unit.total}</td>
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-2">
                      <div className="flex-1 h-2 bg-slate-100 rounded-full overflow-hidden max-w-[100px]">
                        <div 
                          className={`h-full rounded-full ${unit.prevalence > 30 ? 'bg-rose-500' : unit.prevalence > 15 ? 'bg-amber-500' : 'bg-emerald-500'}`}
                          style={{ width: `${unit.prevalence}%` }}
                        />
                      </div>
                      <span className="text-sm font-bold text-slate-700">{unit.prevalence}%</span>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <span className={`px-2 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider ${
                      unit.prevalence > 30 ? 'bg-rose-100 text-rose-700' : 
                      unit.prevalence > 15 ? 'bg-amber-100 text-amber-700' : 
                      'bg-emerald-100 text-emerald-700'
                    }`}>
                      {unit.prevalence > 30 ? 'High Risk' : unit.prevalence > 15 ? 'Medium Risk' : 'Low Risk'}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
