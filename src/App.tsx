/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import { DataEntryForm } from './components/DataEntryForm';
import { SchoolDashboard } from './components/SchoolDashboard';
import { GovernmentDashboard } from './components/GovernmentDashboard';
import { MOCK_RECORDS, MOCK_SCHOOLS } from './utils/nutrition';
import { ChildRecord, School } from './types';
import { LayoutDashboard, UserPlus, ShieldCheck, Activity, Menu, X } from 'lucide-react';
import { format } from 'date-fns';
import { motion, AnimatePresence } from 'motion/react';

type View = 'entry' | 'school' | 'government';

export default function App() {
  const [view, setView] = useState<View>('entry');
  const [records, setRecords] = useState<ChildRecord[]>(MOCK_RECORDS);
  const [schools] = useState<School[]>(MOCK_SCHOOLS);
  const [selectedSchool, setSelectedSchool] = useState<School>(MOCK_SCHOOLS[0]);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const handleSaveRecord = (newRecord: Omit<ChildRecord, 'id' | 'timestamp'>) => {
    const record: ChildRecord = {
      ...newRecord,
      id: Math.random().toString(36).substr(2, 9),
      timestamp: format(new Date(), 'yyyy-MM-dd'),
    };
    setRecords(prev => [record, ...prev]);
    // Switch to school dashboard to see the update
    setView('school');
  };

  const navItems = [
    { id: 'entry', label: 'Data Entry', icon: UserPlus, description: 'Teacher / Worker View' },
    { id: 'school', label: 'School Dashboard', icon: LayoutDashboard, description: 'Unit Level Summary' },
    { id: 'government', label: 'District Surveillance', icon: ShieldCheck, description: 'Government / Professional' },
  ];

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col lg:flex-row font-sans">
      {/* Sidebar - Desktop */}
      <aside className="hidden lg:flex flex-col w-80 bg-white border-r border-slate-200 p-6 sticky top-0 h-screen">
        <div className="flex items-center gap-3 mb-10 px-2">
          <div className="p-2.5 bg-indigo-600 rounded-xl text-white shadow-lg shadow-indigo-200">
            <Activity size={24} />
          </div>
          <div>
            <h1 className="text-xl font-bold text-slate-900 leading-tight">NutriGuard</h1>
            <p className="text-xs font-semibold text-slate-400 uppercase tracking-widest">Surveillance System</p>
          </div>
        </div>

        <nav className="flex-1 space-y-2">
          {navItems.map((item) => (
            <button
              key={item.id}
              onClick={() => setView(item.id as View)}
              className={`w-full flex items-center gap-4 p-4 rounded-2xl transition-all group ${
                view === item.id 
                  ? 'bg-indigo-50 text-indigo-700 shadow-sm' 
                  : 'text-slate-500 hover:bg-slate-50 hover:text-slate-900'
              }`}
            >
              <item.icon size={22} className={view === item.id ? 'text-indigo-600' : 'text-slate-400 group-hover:text-slate-600'} />
              <div className="text-left">
                <p className="font-semibold text-sm">{item.label}</p>
                <p className={`text-[10px] uppercase font-bold tracking-wider ${view === item.id ? 'text-indigo-400' : 'text-slate-400'}`}>
                  {item.description}
                </p>
              </div>
            </button>
          ))}
        </nav>

        <div className="mt-auto p-4 bg-slate-50 rounded-2xl border border-slate-100">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-indigo-100 flex items-center justify-center text-indigo-700 font-bold">
              JD
            </div>
            <div>
              <p className="text-sm font-bold text-slate-900">Dr. Jane Doe</p>
              <p className="text-xs text-slate-500">District Health Officer</p>
            </div>
          </div>
        </div>
      </aside>

      {/* Mobile Header */}
      <header className="lg:hidden bg-white border-b border-slate-200 p-4 sticky top-0 z-50 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Activity className="text-indigo-600" size={24} />
          <span className="font-bold text-slate-900">NutriGuard</span>
        </div>
        <button 
          onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
          className="p-2 text-slate-600 hover:bg-slate-50 rounded-lg"
        >
          {isMobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
        </button>
      </header>

      {/* Mobile Menu Overlay */}
      <AnimatePresence>
        {isMobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="lg:hidden fixed inset-x-0 top-[65px] bg-white border-b border-slate-200 z-40 p-4 shadow-xl"
          >
            <nav className="space-y-2">
              {navItems.map((item) => (
                <button
                  key={item.id}
                  onClick={() => {
                    setView(item.id as View);
                    setIsMobileMenuOpen(false);
                  }}
                  className={`w-full flex items-center gap-4 p-4 rounded-xl transition-all ${
                    view === item.id ? 'bg-indigo-50 text-indigo-700' : 'text-slate-500'
                  }`}
                >
                  <item.icon size={20} />
                  <span className="font-semibold">{item.label}</span>
                </button>
              ))}
            </nav>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Main Content */}
      <main className="flex-1 p-4 md:p-8 lg:p-12 max-w-7xl mx-auto w-full">
        <AnimatePresence mode="wait">
          <motion.div
            key={view}
            initial={{ opacity: 0, x: 10 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -10 }}
            transition={{ duration: 0.2 }}
          >
            {view === 'entry' && (
              <div className="max-w-3xl mx-auto">
                <div className="mb-8">
                  <h1 className="text-3xl font-bold text-slate-900">Surveillance Intake</h1>
                  <p className="text-slate-500 mt-2">Record anthropometric measurements for early malnutrition detection.</p>
                </div>
                <DataEntryForm onSave={handleSaveRecord} schools={schools} />
              </div>
            )}

            {view === 'school' && (
              <div>
                <div className="mb-6 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                  <div className="flex items-center gap-3">
                    <label className="text-sm font-bold text-slate-400 uppercase tracking-wider">Viewing Unit:</label>
                    <select 
                      value={selectedSchool.id}
                      onChange={(e) => {
                        const school = schools.find(s => s.id === e.target.value);
                        if (school) setSelectedSchool(school);
                      }}
                      className="bg-white border border-slate-200 rounded-xl px-4 py-2 text-sm font-semibold text-slate-700 outline-none focus:ring-2 focus:ring-indigo-500"
                    >
                      {schools.map(s => (
                        <option key={s.id} value={s.id}>{s.name}</option>
                      ))}
                    </select>
                  </div>
                </div>
                <SchoolDashboard records={records} school={selectedSchool} />
              </div>
            )}

            {view === 'government' && (
              <GovernmentDashboard records={records} schools={schools} />
            )}
          </motion.div>
        </AnimatePresence>
      </main>
    </div>
  );
}
