import React, { useState, useEffect } from 'react';
import { X, Calendar, Clock, BookOpen, User, Users, Lock, Info, AlertCircle, CheckCircle2 } from 'lucide-react';
import api from '../services/api';
import { formatTo12Hour, DAYS_OF_WEEK } from '../utils/timeFormat';

export default function ClassroomScheduleModal({ classroom, onClose }) {
  const [loading, setLoading] = useState(true);
  const [scheduleData, setScheduleData] = useState(null);
  const [activeDay, setActiveDay] = useState('Monday');

  useEffect(() => {
    if (!classroom) return;

    const fetchDetails = async () => {
      setLoading(true);
      try {
        const res = await api.get(`/classrooms/${classroom.roomNumber}`);
        if (res.data.success) {
          setScheduleData(res.data.data);
        }
      } catch (err) {
        console.error('Failed to load room details:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchDetails();
  }, [classroom]);

  if (!classroom) return null;

  const currentDayEntries = scheduleData?.scheduleByDay?.[activeDay] || [];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 bg-slate-900/60 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="relative w-full max-w-3xl max-h-[90vh] flex flex-col rounded-3xl bg-white dark:bg-darkcard border border-slate-200 dark:border-darkborder shadow-2xl overflow-hidden">
        
        {/* Modal Header */}
        <div className="flex items-center justify-between p-6 border-b border-slate-100 dark:border-darkborder">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-2xl bg-thapar-100 dark:bg-thapar-950 text-thapar-600 dark:text-thapar-400 flex items-center justify-center font-bold text-xl">
              {classroom.roomNumber}
            </div>
            <div>
              <h2 className="text-xl font-extrabold text-slate-900 dark:text-white tracking-tight">
                Classroom Schedule Overview
              </h2>
              <p className="text-xs text-slate-500 dark:text-slate-400">
                {classroom.block} • {classroom.roomType} Hall • Capacity: {classroom.capacity || 60} seats
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-2 rounded-xl text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Body */}
        <div className="flex-1 overflow-y-auto p-6 space-y-6">
          
          {/* Day Selector Tabs */}
          <div>
            <label className="text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider block mb-2">
              Select Day of Week
            </label>
            <div className="flex items-center gap-2 overflow-x-auto pb-1">
              {DAYS_OF_WEEK.map((d) => (
                <button
                  key={d}
                  onClick={() => setActiveDay(d)}
                  className={`px-4 py-2 rounded-xl text-xs font-bold transition-all whitespace-nowrap ${
                    activeDay === d
                      ? 'bg-thapar-600 text-white shadow-md shadow-thapar-500/20'
                      : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 hover:bg-slate-200 dark:hover:bg-slate-700'
                  }`}
                >
                  {d}
                </button>
              ))}
            </div>
          </div>

          {/* Schedule Listings */}
          <div>
            <div className="flex items-center justify-between mb-3">
              <h3 className="text-sm font-bold text-slate-800 dark:text-slate-200 flex items-center gap-2">
                <Calendar className="w-4 h-4 text-thapar-500" />
                Timetable Entries for {activeDay}
              </h3>
              <span className="text-xs text-slate-500 dark:text-slate-400">
                {currentDayEntries.length} Scheduled {currentDayEntries.length === 1 ? 'Slot' : 'Slots'}
              </span>
            </div>

            {loading ? (
              <div className="py-12 text-center text-slate-400 animate-pulse text-xs">
                Loading schedule entries...
              </div>
            ) : currentDayEntries.length === 0 ? (
              <div className="p-8 rounded-2xl bg-emerald-50/50 dark:bg-emerald-950/20 border border-emerald-200/60 dark:border-emerald-800/40 text-center">
                <CheckCircle2 className="w-8 h-8 text-emerald-500 mx-auto mb-2" />
                <h4 className="text-sm font-bold text-emerald-800 dark:text-emerald-300">Entirely Free Day</h4>
                <p className="text-xs text-emerald-600 dark:text-emerald-400 mt-1">
                  No lectures are scheduled for {classroom.roomNumber} on {activeDay}.
                </p>
              </div>
            ) : (
              <div className="space-y-3">
                {currentDayEntries.map((entry, idx) => (
                  <div
                    key={idx}
                    className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 p-4 rounded-2xl bg-slate-50 dark:bg-slate-900/60 border border-slate-200/80 dark:border-slate-800 hover:border-thapar-500/40 transition-colors"
                  >
                    <div className="flex items-start gap-3">
                      <div className="w-9 h-9 rounded-xl bg-thapar-100 dark:bg-thapar-900/50 text-thapar-600 dark:text-thapar-400 flex items-center justify-center shrink-0">
                        <BookOpen className="w-4.5 h-4.5" />
                      </div>
                      <div>
                        <div className="flex items-center gap-2">
                          <span className="text-sm font-bold text-slate-900 dark:text-white">
                            {entry.subject}
                          </span>
                          <span className="text-[10px] font-semibold px-2 py-0.5 rounded-md bg-slate-200 dark:bg-slate-800 text-slate-700 dark:text-slate-300">
                            {entry.subjectCode}
                          </span>
                          {entry.type === 'LAB' && (
                            <span className="text-[10px] font-semibold px-2 py-0.5 rounded-md bg-purple-100 dark:bg-purple-900/60 text-purple-700 dark:text-purple-300">
                              LAB
                            </span>
                          )}
                        </div>
                        <div className="flex items-center gap-4 mt-1 text-xs text-slate-500 dark:text-slate-400">
                          <span className="flex items-center gap-1">
                            <Users className="w-3.5 h-3.5" /> Batch: {entry.batch}
                          </span>
                          <span className="flex items-center gap-1">
                            <User className="w-3.5 h-3.5" /> {entry.faculty || 'Faculty'}
                          </span>
                        </div>
                      </div>
                    </div>

                    <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-white dark:bg-darkcard border border-slate-200 dark:border-slate-800 text-xs font-bold text-slate-700 dark:text-slate-300 self-start sm:self-center">
                      <Clock className="w-3.5 h-3.5 text-thapar-500" />
                      {formatTo12Hour(entry.startTime)} - {formatTo12Hour(entry.endTime)}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Future Scope Notice Section (Requirement 25) */}
          <div className="p-5 rounded-2xl bg-amber-50/60 dark:bg-amber-950/30 border border-amber-200/80 dark:border-amber-800/50">
            <div className="flex items-start gap-3">
              <div className="p-2 rounded-xl bg-amber-100 dark:bg-amber-900/60 text-amber-700 dark:text-amber-300">
                <Lock className="w-5 h-5" />
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <h4 className="text-xs font-bold text-amber-900 dark:text-amber-200 uppercase tracking-wide">
                    Classroom Reservation & Permission System
                  </h4>
                  <span className="px-2 py-0.5 rounded-full text-[10px] font-extrabold bg-amber-200 text-amber-800 dark:bg-amber-800 dark:text-amber-100">
                    COMING SOON
                  </span>
                </div>
                <p className="text-xs text-amber-800/80 dark:text-amber-300/80 mt-1 leading-relaxed">
                  Official classroom booking, permission workflow approvals, and guest lecture reservation modules are planned for Future Release. Currently, this platform provides real-time timetable availability lookup.
                </p>
              </div>
            </div>
          </div>

        </div>

        {/* Modal Footer */}
        <div className="p-4 bg-slate-50 dark:bg-slate-900/50 border-t border-slate-100 dark:border-darkborder flex items-center justify-end">
          <button
            onClick={onClose}
            className="px-5 py-2.5 rounded-xl text-xs font-bold text-slate-700 dark:text-slate-200 bg-white dark:bg-darkcard border border-slate-200 dark:border-darkborder hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
          >
            Close Window
          </button>
        </div>

      </div>
    </div>
  );
}
