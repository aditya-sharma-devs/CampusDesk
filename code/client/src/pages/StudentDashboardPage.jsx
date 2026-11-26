import React, { useState, useEffect, useMemo } from 'react';
import { 
  Search, 
  Calendar, 
  Clock, 
  Building2, 
  BookOpen, 
  GraduationCap,
  Sparkles,
  X,
  RefreshCw,
  TableProperties,
  ArrowRight,
  User,
  Users,
  Filter
} from 'lucide-react';
import api from '../services/api';
import Navbar from '../components/Navbar';
import { formatTo12Hour, DAYS_OF_WEEK } from '../utils/timeFormat';

export default function StudentDashboardPage() {
  const [loading, setLoading] = useState(false);
  const [initialLoading, setInitialLoading] = useState(true);
  const [allEntries, setAllEntries] = useState([]);
  
  // Search state
  const [classroomQuery, setClassroomQuery] = useState('');
  const [subjectQuery, setSubjectQuery] = useState('');
  const [selectedDayFilter, setSelectedDayFilter] = useState('ALL');

  // Fetch timetable entries on load
  const fetchTimetable = async () => {
    setLoading(true);
    try {
      const res = await api.get('/timetable');
      if (res.data.success) {
        setAllEntries(res.data.data || []);
      }
    } catch (err) {
      console.error('Failed to fetch timetable:', err);
    } finally {
      setLoading(false);
      setInitialLoading(false);
    }
  };

  useEffect(() => {
    fetchTimetable();
  }, []);

  // Distinct lists for quick chips & datalists
  const { uniqueClassrooms, uniqueSubjects } = useMemo(() => {
    const classSet = new Set();
    const subjMap = new Map(); // code/name -> label

    allEntries.forEach(e => {
      if (e.classroom) classSet.add(e.classroom.toUpperCase());
      if (e.subject) {
        subjMap.set(e.subjectCode ? `${e.subject} (${e.subjectCode})` : e.subject, {
          name: e.subject,
          code: e.subjectCode || ''
        });
      }
    });

    const classrooms = Array.from(classSet).sort();
    const subjects = Array.from(subjMap.values());
    return { uniqueClassrooms: classrooms, uniqueSubjects: subjects };
  }, [allEntries]);

  // Is any search active?
  const hasSearch = classroomQuery.trim() !== '' || subjectQuery.trim() !== '';

  // Filter entries based on classroom and/or subject
  const filteredEntries = useMemo(() => {
    if (!hasSearch) return [];

    const cQ = classroomQuery.trim().toLowerCase();
    const sQ = subjectQuery.trim().toLowerCase();

    const dayOrder = { 'monday': 1, 'tuesday': 2, 'wednesday': 3, 'thursday': 4, 'friday': 5, 'saturday': 6, 'sunday': 7 };

    return allEntries
      .filter(entry => {
        // Classroom filter
        if (cQ) {
          const room = (entry.classroom || '').toLowerCase();
          const block = (entry.block || '').toLowerCase();
          if (!room.includes(cQ) && !block.includes(cQ)) return false;
        }

        // Subject filter
        if (sQ) {
          const subj = (entry.subject || '').toLowerCase();
          const code = (entry.subjectCode || '').toLowerCase();
          if (!subj.includes(sQ) && !code.includes(sQ)) return false;
        }

        // Day tab filter
        if (selectedDayFilter !== 'ALL') {
          if ((entry.day || '').toLowerCase() !== selectedDayFilter.toLowerCase()) return false;
        }

        return true;
      })
      .sort((a, b) => {
        const orderA = dayOrder[a.day?.toLowerCase()] || 8;
        const orderB = dayOrder[b.day?.toLowerCase()] || 8;
        if (orderA !== orderB) return orderA - orderB;
        return (a.startTime || '').localeCompare(b.startTime || '');
      });
  }, [allEntries, classroomQuery, subjectQuery, selectedDayFilter, hasSearch]);

  const resetSearch = () => {
    setClassroomQuery('');
    setSubjectQuery('');
    setSelectedDayFilter('ALL');
  };

  // Helper for type badges
  const renderTypeBadge = (type) => {
    const t = (type || 'LECTURE').toUpperCase();
    if (t === 'LAB') {
      return (
        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-[10px] font-extrabold bg-purple-100 text-purple-700 dark:bg-purple-950/80 dark:text-purple-300 border border-purple-200 dark:border-purple-800">
          LAB
        </span>
      );
    }
    if (t === 'TUTORIAL') {
      return (
        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-[10px] font-extrabold bg-amber-100 text-amber-700 dark:bg-amber-950/80 dark:text-amber-300 border border-amber-200 dark:border-amber-800">
          TUTORIAL
        </span>
      );
    }
    return (
      <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-[10px] font-extrabold bg-blue-100 text-blue-700 dark:bg-blue-950/80 dark:text-blue-300 border border-blue-200 dark:border-blue-800">
        LECTURE
      </span>
    );
  };

  const activeDaysPresent = useMemo(() => {
    const days = new Set(filteredEntries.map(e => e.day));
    return Array.from(days);
  }, [filteredEntries]);

  return (
    <div className="min-h-screen flex flex-col bg-slate-50 dark:bg-darkbg text-slate-900 dark:text-slate-100 transition-colors pb-16">
      <Navbar onRefreshData={fetchTimetable} />

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-8 flex-1 w-full space-y-6">
        
        {/* Header Hero Banner */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-emerald-100 dark:bg-emerald-950/80 border border-emerald-200 dark:border-emerald-800 text-emerald-800 dark:text-emerald-300 text-xs font-bold mb-2 shadow-xs">
              <Sparkles className="w-3.5 h-3.5 text-emerald-600 dark:text-emerald-400" />
              <span>Student Schedule & Class Timetable Explorer</span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-black text-slate-900 dark:text-white tracking-tight">
              Classroom & Subject Timetable Search
            </h1>
            <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 mt-1 max-w-2xl">
              Enter a classroom room number to view all its classes daywise and timewise, or enter a subject name to see where and when it takes place across campus.
            </p>
          </div>

          <div className="flex items-center gap-2.5 self-start md:self-auto">
            <button
              onClick={fetchTimetable}
              className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-2xl text-xs font-bold text-slate-700 dark:text-slate-200 bg-white dark:bg-darkcard border border-slate-200 dark:border-darkborder hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors shadow-xs"
              title="Refresh Timetable Data"
            >
              <RefreshCw className={`w-3.5 h-3.5 ${loading ? 'animate-spin text-emerald-500' : ''}`} />
              Refresh Data
            </button>
          </div>
        </div>

        {/* Dual Search & Filter Control Panel */}
        <div className="p-6 rounded-3xl bg-white dark:bg-darkcard border border-slate-200/90 dark:border-darkborder shadow-sm space-y-5">
          <div className="flex items-center justify-between pb-3 border-b border-slate-100 dark:border-slate-800">
            <div className="flex items-center gap-2">
              <TableProperties className="w-4 h-4 text-emerald-500" />
              <h3 className="text-xs font-bold text-slate-800 dark:text-slate-200 uppercase tracking-wider">
                Schedule Search Criteria
              </h3>
            </div>

            {hasSearch && (
              <button
                onClick={resetSearch}
                className="inline-flex items-center gap-1.5 text-xs font-bold text-rose-600 dark:text-rose-400 hover:text-rose-700 dark:hover:text-rose-300 transition-colors px-2.5 py-1 rounded-xl bg-rose-50 dark:bg-rose-950/40 border border-rose-200/80 dark:border-rose-800/80"
              >
                <X className="w-3.5 h-3.5" />
                Clear Search
              </button>
            )}
          </div>

          {/* Two Prominent Search Fields: Classroom and Subject */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            
            {/* Search Option 1: By Classroom */}
            <div className="space-y-2">
              <label className="block text-[11px] font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider flex items-center gap-1.5">
                <Building2 className="w-3.5 h-3.5 text-indigo-500" />
                1. Search by Classroom (Daywise & Timewise)
              </label>
              <div className="relative">
                <input
                  type="text"
                  value={classroomQuery}
                  onChange={(e) => setClassroomQuery(e.target.value)}
                  placeholder="Type classroom e.g. T106, LT303, F201, E104..."
                  className={`w-full pl-10 pr-10 py-3 rounded-2xl bg-slate-50 dark:bg-slate-900 border text-slate-900 dark:text-white text-xs font-bold focus:outline-none focus:ring-2 transition-all ${
                    classroomQuery.trim()
                      ? 'border-indigo-500 ring-2 ring-indigo-500/20 bg-white dark:bg-darkcard'
                      : 'border-slate-200/80 dark:border-slate-800 focus:ring-indigo-500/20 focus:border-indigo-500'
                  }`}
                />
                <Building2 className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                {classroomQuery && (
                  <button
                    onClick={() => setClassroomQuery('')}
                    className="absolute right-3.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200"
                  >
                    <X className="w-4 h-4" />
                  </button>
                )}
              </div>

              {/* Classroom Quick Suggestion Chips */}
              <div className="flex flex-wrap items-center gap-1.5 pt-1">
                <span className="text-[10px] font-bold text-slate-400 mr-1">Quick Select:</span>
                {['T106', 'LT303', 'F201', 'E104', 'L302', 'LP109', 'LT301', 'F202'].map(room => (
                  <button
                    key={room}
                    onClick={() => setClassroomQuery(room)}
                    className={`px-2.5 py-1 rounded-xl text-[11px] font-bold transition-all ${
                      classroomQuery.toUpperCase() === room
                        ? 'bg-indigo-600 text-white shadow-xs'
                        : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-700'
                    }`}
                  >
                    {room}
                  </button>
                ))}
              </div>
            </div>

            {/* Search Option 2: By Subject */}
            <div className="space-y-2">
              <label className="block text-[11px] font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider flex items-center gap-1.5">
                <BookOpen className="w-3.5 h-3.5 text-emerald-500" />
                2. Search by Subject Name or Code (Timewise & Classroomwise)
              </label>
              <div className="relative">
                <input
                  type="text"
                  value={subjectQuery}
                  onChange={(e) => setSubjectQuery(e.target.value)}
                  placeholder="Type subject e.g. Software Engineering, SE, CAO, DBMS, CN..."
                  className={`w-full pl-10 pr-10 py-3 rounded-2xl bg-slate-50 dark:bg-slate-900 border text-slate-900 dark:text-white text-xs font-bold focus:outline-none focus:ring-2 transition-all ${
                    subjectQuery.trim()
                      ? 'border-emerald-500 ring-2 ring-emerald-500/20 bg-white dark:bg-darkcard'
                      : 'border-slate-200/80 dark:border-slate-800 focus:ring-emerald-500/20 focus:border-emerald-500'
                  }`}
                />
                <BookOpen className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                {subjectQuery && (
                  <button
                    onClick={() => setSubjectQuery('')}
                    className="absolute right-3.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200"
                  >
                    <X className="w-4 h-4" />
                  </button>
                )}
              </div>

              {/* Subject Quick Suggestion Chips */}
              <div className="flex flex-wrap items-center gap-1.5 pt-1">
                <span className="text-[10px] font-bold text-slate-400 mr-1">Quick Select:</span>
                {[
                  { label: 'SE', title: 'Software Engineering' },
                  { label: 'CAO', title: 'Computer Architecture and Organization' },
                  { label: 'CC', title: 'Cloud Computing' },
                  { label: 'CN', title: 'Computer Networks' },
                  { label: 'DBMS', title: 'Database Management Systems' },
                  { label: 'AI', title: 'Artificial Intelligence' },
                  { label: 'OS', title: 'Operating Systems' }
                ].map(sub => (
                  <button
                    key={sub.label}
                    onClick={() => setSubjectQuery(sub.label)}
                    className={`px-2.5 py-1 rounded-xl text-[11px] font-bold transition-all ${
                      subjectQuery.toUpperCase() === sub.label || subjectQuery.toLowerCase() === sub.title.toLowerCase()
                        ? 'bg-emerald-600 text-white shadow-xs'
                        : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-700'
                    }`}
                    title={sub.title}
                  >
                    {sub.label}
                  </button>
                ))}
              </div>
            </div>

          </div>

          {/* Active Search Meta Banner */}
          {hasSearch && (
            <div className="pt-3 border-t border-slate-100 dark:border-slate-800 flex flex-wrap items-center justify-between gap-3 text-xs">
              <div className="flex items-center gap-2">
                <span className="text-slate-500 dark:text-slate-400 font-semibold">Active Criteria:</span>
                {classroomQuery && (
                  <span className="inline-flex items-center gap-1 px-3 py-1 rounded-xl bg-indigo-50 dark:bg-indigo-950/60 text-indigo-700 dark:text-indigo-300 border border-indigo-200 dark:border-indigo-800 font-bold">
                    <Building2 className="w-3.5 h-3.5" />
                    Classroom: {classroomQuery.toUpperCase()}
                  </span>
                )}
                {subjectQuery && (
                  <span className="inline-flex items-center gap-1 px-3 py-1 rounded-xl bg-emerald-50 dark:bg-emerald-950/60 text-emerald-700 dark:text-emerald-300 border border-emerald-200 dark:border-emerald-800 font-bold">
                    <BookOpen className="w-3.5 h-3.5" />
                    Subject: {subjectQuery}
                  </span>
                )}
              </div>

              {/* Day filter tabs for active search */}
              <div className="flex items-center gap-1.5 overflow-x-auto pb-1 scrollbar-none">
                <span className="text-[10px] font-bold text-slate-400 mr-1 shrink-0">Day:</span>
                {['ALL', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday'].map(d => {
                  const isSelected = selectedDayFilter === d;
                  return (
                    <button
                      key={d}
                      onClick={() => setSelectedDayFilter(d)}
                      className={`px-3 py-1 rounded-xl text-xs font-bold transition-all shrink-0 ${
                        isSelected
                          ? 'bg-slate-900 text-white dark:bg-white dark:text-slate-900 shadow-xs'
                          : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-700'
                      }`}
                    >
                      {d}
                    </button>
                  );
                })}
              </div>
            </div>
          )}
        </div>

        {/* Schedule Output Table Area */}
        <div className="rounded-3xl bg-white dark:bg-darkcard border border-slate-200/90 dark:border-darkborder shadow-sm overflow-hidden">
          
          {/* Table Header Row */}
          <div className="p-5 sm:p-6 border-b border-slate-100 dark:border-darkborder flex flex-wrap items-center justify-between gap-3">
            <div>
              <h2 className="text-base sm:text-lg font-black text-slate-900 dark:text-white flex items-center gap-2">
                <Calendar className="w-5 h-5 text-emerald-500" />
                Schedule & Class Timetable
              </h2>
              <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
                {!hasSearch 
                  ? 'Table will populate once you input a Classroom or Subject above.'
                  : classroomQuery && !subjectQuery
                  ? `Showing full Daywise & Timewise schedule for Classroom ${classroomQuery.toUpperCase()}`
                  : subjectQuery && !classroomQuery
                  ? `Showing all Timewise & Classroomwise sessions for Subject "${subjectQuery}"`
                  : `Showing sessions for "${subjectQuery}" in Classroom ${classroomQuery.toUpperCase()}`}
              </p>
            </div>

            {hasSearch && (
              <div className="flex items-center gap-2">
                <span className="text-xs font-bold px-3 py-1.5 rounded-2xl bg-emerald-50 dark:bg-emerald-950/50 text-emerald-700 dark:text-emerald-300 border border-emerald-200 dark:border-emerald-800">
                  {filteredEntries.length} {filteredEntries.length === 1 ? 'Class' : 'Classes'} Scheduled
                </span>
              </div>
            )}
          </div>

          {/* Content: Empty State vs Loaded Schedule Table */}
          {!hasSearch ? (
            /* EMPTY INITIAL STATE */
            <div className="py-20 px-6 text-center space-y-4">
              <div className="w-16 h-16 rounded-3xl bg-emerald-50 dark:bg-emerald-950/60 border border-emerald-200/80 dark:border-emerald-800/80 text-emerald-600 dark:text-emerald-400 flex items-center justify-center mx-auto shadow-sm">
                <TableProperties className="w-8 h-8" />
              </div>
              <div className="max-w-md mx-auto">
                <h3 className="text-lg font-black text-slate-900 dark:text-white">
                  Schedule Table is Currently Empty
                </h3>
                <p className="text-xs text-slate-500 dark:text-slate-400 mt-1 leading-relaxed">
                  Enter a <strong>Classroom</strong> in the search bar above to see its complete daywise and timewise weekly classes, or enter a <strong>Subject name / code</strong> to see where and when it takes place across campus.
                </p>
              </div>

              {/* Sample Quick Action Triggers */}
              <div className="pt-2 flex flex-wrap items-center justify-center gap-2 max-w-lg mx-auto">
                <button
                  onClick={() => setClassroomQuery('T106')}
                  className="px-4 py-2 rounded-2xl bg-indigo-50 dark:bg-indigo-950/60 hover:bg-indigo-100 text-indigo-700 dark:text-indigo-300 border border-indigo-200 dark:border-indigo-800 text-xs font-extrabold transition-all flex items-center gap-1.5"
                >
                  <Building2 className="w-3.5 h-3.5" />
                  View Classroom T106 Schedule
                </button>
                <button
                  onClick={() => setSubjectQuery('Software Engineering')}
                  className="px-4 py-2 rounded-2xl bg-emerald-50 dark:bg-emerald-950/60 hover:bg-emerald-100 text-emerald-700 dark:text-emerald-300 border border-emerald-200 dark:border-emerald-800 text-xs font-extrabold transition-all flex items-center gap-1.5"
                >
                  <BookOpen className="w-3.5 h-3.5" />
                  View "Software Engineering" Classes
                </button>
                <button
                  onClick={() => setClassroomQuery('LT303')}
                  className="px-4 py-2 rounded-2xl bg-blue-50 dark:bg-blue-950/60 hover:bg-blue-100 text-blue-700 dark:text-blue-300 border border-blue-200 dark:border-blue-800 text-xs font-extrabold transition-all flex items-center gap-1.5"
                >
                  <Building2 className="w-3.5 h-3.5" />
                  View Classroom LT303 Schedule
                </button>
              </div>
            </div>
          ) : filteredEntries.length === 0 ? (
            /* NO RESULTS MATCHING SEARCH */
            <div className="py-16 px-6 text-center space-y-3">
              <div className="w-12 h-12 rounded-2xl bg-slate-100 dark:bg-slate-800 text-slate-400 flex items-center justify-center mx-auto">
                <Search className="w-6 h-6" />
              </div>
              <h3 className="text-base font-bold text-slate-800 dark:text-slate-200">
                No Classes Found Matching Criteria
              </h3>
              <p className="text-xs text-slate-500 dark:text-slate-400 max-w-sm mx-auto">
                No scheduled lectures or labs matched your current search. Try selecting a different classroom or subject name.
              </p>
              <button
                onClick={resetSearch}
                className="px-4 py-2 rounded-xl text-xs font-bold bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-200 hover:bg-slate-200 transition-colors mt-2"
              >
                Reset Search Filters
              </button>
            </div>
          ) : (
            /* ACTIVE POPULATED SCHEDULE TABLE */
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="border-b border-slate-200 dark:border-slate-800 bg-slate-50/80 dark:bg-slate-900/50 text-[11px] font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider">
                    <th className="py-3.5 px-5 sm:px-6">Day of Week</th>
                    <th className="py-3.5 px-4">Time Period / Slot</th>
                    <th className="py-3.5 px-4">Classroom</th>
                    <th className="py-3.5 px-5">Subject & Code</th>
                    <th className="py-3.5 px-4">Type</th>
                    <th className="py-3.5 px-5">Faculty / Instructor</th>
                    <th className="py-3.5 px-5 sm:px-6">Batch</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 dark:divide-slate-800 text-xs font-medium">
                  {filteredEntries.map((entry, idx) => {
                    const isLab = entry.type === 'LAB';
                    return (
                      <tr 
                        key={idx}
                        className="hover:bg-slate-50/90 dark:hover:bg-slate-800/40 transition-colors"
                      >
                        {/* Day */}
                        <td className="py-3.5 px-5 sm:px-6 whitespace-nowrap">
                          <span className="inline-flex items-center gap-1.5 font-bold text-slate-800 dark:text-slate-200">
                            <span className="w-2 h-2 rounded-full bg-emerald-500"></span>
                            {entry.day}
                          </span>
                        </td>

                        {/* Time Slot */}
                        <td className="py-3.5 px-4 whitespace-nowrap">
                          <div className="flex items-center gap-1.5 text-slate-700 dark:text-slate-300 font-semibold font-mono text-xs">
                            <Clock className="w-3.5 h-3.5 text-emerald-500 shrink-0" />
                            <span>{formatTo12Hour(entry.startTime)} - {formatTo12Hour(entry.endTime)}</span>
                          </div>
                        </td>

                        {/* Classroom (with block) */}
                        <td className="py-3.5 px-4 whitespace-nowrap">
                          <div className="flex items-center gap-2">
                            <span className="px-2.5 py-1 rounded-xl bg-indigo-50 dark:bg-indigo-950/60 text-indigo-700 dark:text-indigo-300 font-extrabold border border-indigo-200 dark:border-indigo-800 shadow-2xs">
                              {entry.classroom}
                            </span>
                            <span className="text-[11px] text-slate-400 font-semibold">
                              {entry.block}
                            </span>
                          </div>
                        </td>

                        {/* Subject & Code */}
                        <td className="py-3.5 px-5">
                          <div>
                            <span className="font-bold text-slate-900 dark:text-white block">
                              {entry.subject}
                            </span>
                            {entry.subjectCode && (
                              <span className="inline-block mt-0.5 text-[10px] font-mono font-extrabold px-1.5 py-0.2 rounded bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300">
                                {entry.subjectCode}
                              </span>
                            )}
                          </div>
                        </td>

                        {/* Class Type */}
                        <td className="py-3.5 px-4 whitespace-nowrap">
                          {renderTypeBadge(entry.type)}
                        </td>

                        {/* Faculty */}
                        <td className="py-3.5 px-5 whitespace-nowrap">
                          <div className="flex items-center gap-1.5 text-slate-700 dark:text-slate-300">
                            <User className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                            <span className="font-medium">{entry.faculty || 'Faculty Member'}</span>
                          </div>
                        </td>

                        {/* Batch */}
                        <td className="py-3.5 px-5 sm:px-6 whitespace-nowrap">
                          <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-slate-100 dark:bg-slate-800/80 text-slate-700 dark:text-slate-300 border border-slate-200 dark:border-slate-700 font-semibold text-[11px]">
                            <Users className="w-3 h-3 text-slate-400" />
                            {entry.batch || 'All'}
                          </span>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          )}

        </div>

      </main>
    </div>
  );
}
