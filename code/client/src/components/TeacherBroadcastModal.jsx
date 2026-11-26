import React, { useState, useEffect } from 'react';
import { 
  X, 
  Megaphone, 
  Send, 
  AlertCircle, 
  CheckCircle2, 
  Users, 
  Tag, 
  Trash2, 
  RefreshCw,
  Clock,
  Radio,
  Sparkles,
  Building2,
  Calendar,
  BookOpen,
  Info
} from 'lucide-react';
import api from '../services/api';
import { useAuth } from '../context/AuthContext';

export default function TeacherBroadcastModal({ onClose, onBroadcastSent }) {
  const { user } = useAuth();
  
  const [targetBatch, setTargetBatch] = useState('3P14');
  const [customBatch, setCustomBatch] = useState('');
  const [tag, setTag] = useState('CLASS_CANCELLED');
  const [title, setTitle] = useState('');
  const [message, setMessage] = useState('');
  
  // Specific cancellation / rescheduling parameters for un-occupying the room
  const [day, setDay] = useState('Monday');
  const [classroom, setClassroom] = useState('T106');
  const [slot, setSlot] = useState('10:30 AM - 11:20 AM');
  const [subject, setSubject] = useState('Software Engineering');
  const [batchClasses, setBatchClasses] = useState([]);
  const [myClasses, setMyClasses] = useState([]);
  const [allClasses, setAllClasses] = useState([]);
  const [selectedMyClassId, setSelectedMyClassId] = useState('');
  const [fetchingSchedule, setFetchingSchedule] = useState(false);

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [successMsg, setSuccessMsg] = useState('');
  
  // History of sent announcements
  const [recentBroadcasts, setRecentBroadcasts] = useState([]);
  const [fetchingRecent, setFetchingRecent] = useState(false);

  const batches = [
    { label: '3P14 (CSE Group 14)', value: '3P14' },
    { label: '3CO1 (COE Group 1)', value: '3CO1' },
    { label: '3CO2 (COE Group 2)', value: '3CO2' },
    { label: '3CO3 (COE Group 3)', value: '3CO3' },
    { label: '3CO4 (COE Group 4)', value: '3CO4' },
    { label: '3CO5 (COE Group 5)', value: '3CO5' },
    { label: '3CO6 (COE Group 6)', value: '3CO6' },
    { label: '3ENC1 (ENC Group 1)', value: '3ENC1' },
    { label: 'ALL (Broadcast to All Batches)', value: 'ALL' },
    { label: 'Other Custom Batch...', value: 'OTHER' }
  ];

  const tags = [
    { label: 'Class Cancelled', value: 'CLASS_CANCELLED', color: 'rose' },
    { label: 'Class / Lab Rescheduled', value: 'RESCHEDULED', color: 'purple' },
    { label: 'Urgent Notice', value: 'URGENT', color: 'amber' },
    { label: 'General Announcement', value: 'ANNOUNCEMENT', color: 'blue' }
  ];

  const STANDARD_SLOTS = [
    { label: '08:50 AM - 09:40 AM', value: '08:50 AM - 09:40 AM', start: '08:50', end: '09:40' },
    { label: '09:40 AM - 10:30 AM', value: '09:40 AM - 10:30 AM', start: '09:40', end: '10:30' },
    { label: '10:30 AM - 11:20 AM', value: '10:30 AM - 11:20 AM', start: '10:30', end: '11:20' },
    { label: '11:20 AM - 12:10 PM', value: '11:20 AM - 12:10 PM', start: '11:20', end: '12:10' },
    { label: '01:00 PM - 01:50 PM', value: '01:00 PM - 01:50 PM', start: '13:00', end: '13:50' },
    { label: '01:50 PM - 02:40 PM', value: '01:50 PM - 02:40 PM', start: '13:50', end: '14:40' },
    { label: '02:40 PM - 03:30 PM', value: '02:40 PM - 03:30 PM', start: '14:40', end: '15:30' },
    { label: '03:30 PM - 04:20 PM', value: '03:30 PM - 04:20 PM', start: '15:30', end: '16:20' }
  ];

  const DAYS = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];

  // Strict Teacher ID resolution
  const userFacultyId = (user?.facultyId || '').trim().toUpperCase() ||
    `FAC_${(user?.name || 'FACULTY').trim().toUpperCase().replace(/[^A-Z0-9]/g, '_')}`;

  // Helper to verify if faculty identity matches the logged-in teacher (Strict ID matching with name fallback)
  const isSameFaculty = (schedFaculty, schedFacultyId, schedEmail) => {
    if (user?.role === 'ADMIN') return true;
    if (schedFacultyId && userFacultyId && schedFacultyId.toUpperCase() === userFacultyId.toUpperCase()) {
      return true;
    }
    if (schedEmail && user?.email && schedEmail.toLowerCase() === user.email.toLowerCase()) {
      return true;
    }
    if (!schedFaculty || !user?.name) return false;
    const clean = (s) => (s || '').toLowerCase().replace(/^(dr\.|prof\.|er\.|mr\.|mrs\.|ms\.)\s*/i, '').trim();
    const sf = clean(schedFaculty);
    const uf = clean(user?.name);
    return sf === uf || sf.includes(uf) || uf.includes(sf) || uf === 'faculty' || uf === 'teacher';
  };

  // Fetch all classes across campus and compute the instructor's personal scheduled classes linked to their Teacher ID
  useEffect(() => {
    const fetchAllAndMyClasses = async () => {
      try {
        const res = await api.get('/timetable');
        if (res.data.success) {
          const list = res.data.data || [];
          setAllClasses(list);
          const mine = list.filter(c => isSameFaculty(c.faculty, c.facultyId, c.facultyEmail));
          setMyClasses(mine);
          if (mine.length > 0 && tag === 'CLASS_CANCELLED') {
            handleSelectQuickClass(mine[0]);
          }
        }
      } catch (err) {
        console.warn('Failed to load classes:', err);
      }
    };
    fetchAllAndMyClasses();
  }, [user?.name, user?.facultyId]);

  // Fetch schedule for batch & day so teacher can 1-click select
  useEffect(() => {
    const fetchBatchClasses = async () => {
      const effBatch = targetBatch === 'OTHER' ? customBatch.trim() : targetBatch;
      if (!effBatch || effBatch === 'ALL') {
        setBatchClasses([]);
        return;
      }
      setFetchingSchedule(true);
      try {
        const res = await api.get('/timetable', {
          params: { batch: effBatch, day }
        });
        if (res.data.success) {
          setBatchClasses(res.data.data || []);
        }
      } catch (err) {
        console.warn('Failed to load batch schedule:', err);
      } finally {
        setFetchingSchedule(false);
      }
    };

    fetchBatchClasses();
  }, [targetBatch, customBatch, day]);

  const handleSelectQuickClass = (cls) => {
    if (!cls) return;
    setSelectedMyClassId(cls._id || `${cls.day}-${cls.startTime}-${cls.classroom}`);
    setClassroom(cls.classroom);
    setSubject(cls.subject);
    setDay(cls.day);
    if (cls.batch && cls.batch !== 'All') {
      setTargetBatch(cls.batch);
    }
    const matchedSlot = STANDARD_SLOTS.find(s => s.start === cls.startTime) || {
      value: `${cls.startTime} - ${cls.endTime}`
    };
    setSlot(matchedSlot.value);
    setTitle(`${cls.subject} Class Cancelled (This Week Only)`);
    setMessage(`Today's ${matchedSlot.value} ${cls.subject} lecture in ${cls.classroom} is cancelled for this week. The classroom is now un-occupied and free for student self-study.`);
  };

  // Determine if the currently specified classroom & slot belongs to another teacher
  const selectedSlotObj = STANDARD_SLOTS.find(s => s.value === slot);
  const activeStart = selectedSlotObj ? selectedSlotObj.start : (slot.split('-')[0] || '').trim();

  const conflictingClass = allClasses.find(c => 
    c.classroom?.toUpperCase() === classroom.trim().toUpperCase() &&
    c.day?.toLowerCase() === day.trim().toLowerCase() &&
    (c.startTime === activeStart || slot.includes(c.startTime))
  );

  const isClassOwner = !conflictingClass || isSameFaculty(conflictingClass.faculty, conflictingClass.facultyId, conflictingClass.facultyEmail);

  const fetchRecent = async () => {
    setFetchingRecent(true);
    try {
      const res = await api.get('/announcements');
      if (res.data.success) {
        setRecentBroadcasts(res.data.data || []);
      }
    } catch (err) {
      console.warn('Failed to load recent broadcasts:', err);
    } finally {
      setFetchingRecent(false);
    }
  };

  useEffect(() => {
    fetchRecent();
  }, []);

  const handleSend = async (e) => {
    e.preventDefault();
    setError('');
    setSuccessMsg('');

    const effectiveBatch = targetBatch === 'OTHER' ? customBatch.trim().toUpperCase() : targetBatch;

    if (!effectiveBatch) {
      return setError('Please specify a target student batch.');
    }
    if (!message.trim()) {
      return setError('Please type your broadcast message.');
    }

    const isCancelledTag = tag === 'CLASS_CANCELLED' || tag === 'RESCHEDULED';

    if (isCancelledTag && !classroom.trim()) {
      return setError('Please specify the Classroom Room Number to un-occupy.');
    }

    if (isCancelledTag && !isClassOwner && conflictingClass) {
      return setError(`Ownership Policy: Classroom ${classroom} during this slot is assigned to ${conflictingClass.faculty} (Teacher ID: ${conflictingClass.facultyId || 'FAC_OTHER'}). You can only un-occupy classes assigned to your Teacher ID (${userFacultyId}).`);
    }

    const selectedSlotObj = STANDARD_SLOTS.find(s => s.value === slot);
    const startTime = selectedSlotObj ? selectedSlotObj.start : (slot.split('-')[0] || '').trim();
    const endTime = selectedSlotObj ? selectedSlotObj.end : (slot.split('-')[1] || '').trim();

    const defaultTitle = 
      tag === 'CLASS_CANCELLED' ? `${subject || 'Lecture'} Cancelled (${classroom})` :
      tag === 'RESCHEDULED' ? `${subject || 'Lecture'} Rescheduled (${classroom})` :
      tag === 'URGENT' ? `Urgent Notice for Batch ${effectiveBatch}` :
      `Announcement for Batch ${effectiveBatch}`;

    setLoading(true);
    try {
      const res = await api.post('/announcements', {
        targetBatch: effectiveBatch,
        title: title.trim() || defaultTitle,
        message: message.trim(),
        tag,
        classroom: isCancelledTag ? classroom.trim().toUpperCase() : '',
        day: isCancelledTag ? day : '',
        slot: isCancelledTag ? slot : '',
        startTime: isCancelledTag ? startTime : '',
        endTime: isCancelledTag ? endTime : '',
        subject: isCancelledTag ? subject.trim() : ''
      });

      if (res.data.success) {
        setSuccessMsg(
          isCancelledTag
            ? `Success! Classroom ${classroom.toUpperCase()} has been un-occupied for ${day} ${slot}. Live directory and timetable updated!`
            : `Ping sent! Students of Batch ${effectiveBatch} will now see your broadcast.`
        );
        setMessage('');
        setTitle('');
        fetchRecent();
        if (onBroadcastSent) onBroadcastSent(res.data.data);
      } else {
        setError(res.data.message || 'Failed to send broadcast.');
      }
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to send broadcast.');
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id) => {
    try {
      await api.delete(`/announcements/${id}`);
      setRecentBroadcasts(prev => prev.filter(b => b._id !== id));
      if (onBroadcastSent) onBroadcastSent(null);
    } catch (err) {
      console.warn('Failed to delete announcement:', err);
    }
  };

  const isCancellation = tag === 'CLASS_CANCELLED' || tag === 'RESCHEDULED';

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="relative w-full max-w-xl rounded-3xl bg-white dark:bg-darkcard border border-slate-200 dark:border-darkborder shadow-2xl flex flex-col max-h-[92vh] overflow-hidden">
        
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-100 dark:border-darkborder shrink-0">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-indigo-100 dark:bg-indigo-950 text-indigo-600 dark:text-indigo-400 flex items-center justify-center shadow-xs">
              <Megaphone className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="text-base sm:text-lg font-black text-slate-900 dark:text-white tracking-tight">
                  Ping Batch / Broadcast Message
                </h3>
                {userFacultyId && (
                  <span className="px-2 py-0.5 rounded-md bg-indigo-100 dark:bg-indigo-950 text-indigo-700 dark:text-indigo-300 font-mono text-[10px] font-black uppercase">
                    ID: {userFacultyId}
                  </span>
                )}
              </div>
              <p className="text-[11px] text-slate-500 dark:text-slate-400">
                Send faculty notice or cancel class to automatically un-occupy classroom (this week only).
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-1.5 rounded-xl text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Scrollable Content */}
        <div className="p-6 overflow-y-auto space-y-4 scrollbar-thin [scrollbar-width:thin] [&::-webkit-scrollbar]:w-1.5 [&::-webkit-scrollbar-track]:bg-transparent [&::-webkit-scrollbar-thumb]:bg-slate-200 dark:[&::-webkit-scrollbar-thumb]:bg-slate-700 [&::-webkit-scrollbar-thumb]:rounded-full">
          
          {error && (
            <div className="p-3 rounded-2xl bg-rose-50 dark:bg-rose-950/40 border border-rose-200 dark:border-rose-800 text-rose-700 dark:text-rose-300 text-xs flex items-center gap-2">
              <AlertCircle className="w-4 h-4 shrink-0 text-rose-500" />
              <span>{error}</span>
            </div>
          )}

          {successMsg && (
            <div className="p-3 rounded-2xl bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-200 dark:border-emerald-800 text-emerald-700 dark:text-emerald-300 text-xs flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 shrink-0 text-emerald-500" />
              <span>{successMsg}</span>
            </div>
          )}

          {/* Broadcast Form */}
          <form onSubmit={handleSend} className="space-y-3.5">
            
            {/* Target Batch Selector */}
            <div>
              <label className="block text-[11px] font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider mb-1.5 flex items-center gap-1.5">
                <Users className="w-3.5 h-3.5 text-indigo-500" />
                Select Target Student Batch
              </label>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                <select
                  value={targetBatch}
                  onChange={(e) => setTargetBatch(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-2xl bg-slate-50 dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 text-slate-900 dark:text-white text-xs font-bold focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500"
                >
                  {batches.map(b => (
                    <option key={b.value} value={b.value}>{b.label}</option>
                  ))}
                </select>

                {targetBatch === 'OTHER' ? (
                  <input
                    type="text"
                    required
                    value={customBatch}
                    onChange={(e) => setCustomBatch(e.target.value)}
                    placeholder="Enter Batch ID e.g. 3P15"
                    className="w-full px-3.5 py-2.5 rounded-2xl bg-slate-50 dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 text-slate-900 dark:text-white text-xs font-bold focus:outline-none focus:ring-2 focus:ring-indigo-500 uppercase"
                  />
                ) : (
                  <div className="px-3.5 py-2.5 rounded-2xl bg-slate-50 dark:bg-slate-900/60 border border-slate-200/80 dark:border-slate-800 text-[11px] text-slate-500 flex items-center">
                    <span>Targeting students of <strong>Batch {targetBatch}</strong></span>
                  </div>
                )}
              </div>
            </div>

            {/* Tag Selection */}
            <div>
              <label className="block text-[11px] font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider mb-1.5 flex items-center gap-1.5">
                <Tag className="w-3.5 h-3.5 text-indigo-500" />
                Notice Category / Tag
              </label>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                {tags.map(t => {
                  const isSelected = tag === t.value;
                  return (
                    <button
                      key={t.value}
                      type="button"
                      onClick={() => setTag(t.value)}
                      className={`px-3 py-2 rounded-xl text-xs font-bold transition-all text-center border ${
                        isSelected
                          ? t.value === 'CLASS_CANCELLED'
                            ? 'bg-rose-50 text-rose-700 border-rose-300 dark:bg-rose-950 dark:text-rose-300 ring-2 ring-rose-500/20'
                            : t.value === 'URGENT'
                            ? 'bg-amber-50 text-amber-700 border-amber-300 dark:bg-amber-950 dark:text-amber-300 ring-2 ring-amber-500/20'
                            : t.value === 'RESCHEDULED'
                            ? 'bg-purple-50 text-purple-700 border-purple-300 dark:bg-purple-950 dark:text-purple-300 ring-2 ring-purple-500/20'
                            : 'bg-blue-50 text-blue-700 border-blue-300 dark:bg-blue-950 dark:text-blue-300 ring-2 ring-blue-500/20'
                          : 'bg-slate-50 dark:bg-slate-900 text-slate-600 dark:text-slate-400 border-slate-200/80 dark:border-slate-800 hover:bg-slate-100'
                      }`}
                    >
                      {t.label}
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Classroom & Timing Parameters (Visible for Class Cancelled / Rescheduled) */}
            {isCancellation && (
              <div className="p-4 rounded-2xl bg-rose-50/70 dark:bg-rose-950/30 border border-rose-200/80 dark:border-rose-900/60 space-y-3 animate-in fade-in slide-in-from-top-1 duration-150">
                <div className="flex items-center justify-between">
                  <span className="text-[11px] font-black uppercase text-rose-800 dark:text-rose-300 flex items-center gap-1.5">
                    <Building2 className="w-3.5 h-3.5 text-rose-600" />
                    Classroom Slot to Un-Occupy
                  </span>
                  <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-rose-200 dark:bg-rose-900 text-rose-800 dark:text-rose-200">
                    Live Un-occupy
                  </span>
                </div>

                {/* Priority 1: Pick from My Scheduled Classes (Teacher Ownership) */}
                {myClasses.length > 0 && (
                  <div>
                    <label className="block text-[10px] font-bold text-rose-800 dark:text-rose-300 mb-1 flex items-center justify-between">
                      <span>Pick From Your Scheduled Classes ({user?.name}):</span>
                      <span className="text-[9px] font-bold uppercase tracking-wider text-emerald-600 dark:text-emerald-400">
                        Verified Ownership
                      </span>
                    </label>
                    <select
                      value={selectedMyClassId}
                      onChange={(e) => {
                        const selectedCls = myClasses.find(c => (c._id || `${c.day}-${c.startTime}-${c.classroom}`) === e.target.value);
                        if (selectedCls) handleSelectQuickClass(selectedCls);
                      }}
                      className="w-full px-3 py-2 rounded-xl bg-white dark:bg-slate-900 border border-rose-200 dark:border-rose-800 text-xs font-bold text-slate-800 dark:text-slate-100 focus:outline-hidden"
                    >
                      <option value="" disabled>-- Select one of your assigned lectures --</option>
                      {myClasses.map((c, i) => (
                        <option key={i} value={c._id || `${c.day}-${c.startTime}-${c.classroom}`}>
                          {c.day} {c.startTime} - {c.endTime} | Room {c.classroom} | {c.subject} ({c.batch})
                        </option>
                      ))}
                    </select>
                  </div>
                )}

                {/* Priority 2: Quick Select from Batch Timetable */}
                {myClasses.length === 0 && batchClasses.length > 0 && (
                  <div>
                    <label className="block text-[10px] font-bold text-slate-500 dark:text-slate-400 mb-1">
                      Scheduled Classes for Batch {targetBatch} on {day}:
                    </label>
                    <select
                      onChange={(e) => {
                        const selectedCls = batchClasses.find(c => c._id === e.target.value || `${c.startTime}-${c.classroom}` === e.target.value);
                        if (selectedCls) handleSelectQuickClass(selectedCls);
                      }}
                      className="w-full px-3 py-2 rounded-xl bg-white dark:bg-slate-900 border border-rose-200 dark:border-rose-800 text-xs font-bold text-slate-800 dark:text-slate-100 focus:outline-hidden"
                      defaultValue=""
                    >
                      <option value="" disabled>-- Select a class to auto-fill --</option>
                      {batchClasses.map((c, i) => (
                        <option key={i} value={c._id || `${c.startTime}-${c.classroom}`}>
                          {c.startTime} - {c.endTime} | {c.classroom} | {c.subject} ({c.faculty || 'Faculty'})
                        </option>
                      ))}
                    </select>
                  </div>
                )}

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5">
                  {/* Day of Week */}
                  <div>
                    <label className="block text-[10px] font-bold text-slate-500 dark:text-slate-400 uppercase mb-1">
                      Day of Week
                    </label>
                    <select
                      value={day}
                      onChange={(e) => setDay(e.target.value)}
                      className="w-full px-3 py-2 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-xs font-bold text-slate-800 dark:text-slate-100 focus:outline-hidden"
                    >
                      {DAYS.map(d => (
                        <option key={d} value={d}>{d}</option>
                      ))}
                    </select>
                  </div>

                  {/* Classroom Room Number */}
                  <div>
                    <label className="block text-[10px] font-bold text-slate-500 dark:text-slate-400 uppercase mb-1">
                      Classroom Room No.
                    </label>
                    <input
                      type="text"
                      required={isCancellation}
                      value={classroom}
                      onChange={(e) => setClassroom(e.target.value.toUpperCase())}
                      placeholder="e.g. T106, LT303"
                      className="w-full px-3 py-2 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-xs font-black uppercase text-slate-800 dark:text-slate-100 focus:outline-hidden"
                    />
                  </div>

                  {/* Time Period Slot */}
                  <div>
                    <label className="block text-[10px] font-bold text-slate-500 dark:text-slate-400 uppercase mb-1">
                      Time Slot
                    </label>
                    <select
                      value={slot}
                      onChange={(e) => setSlot(e.target.value)}
                      className="w-full px-3 py-2 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-xs font-bold text-slate-800 dark:text-slate-100 focus:outline-hidden"
                    >
                      {STANDARD_SLOTS.map(s => (
                        <option key={s.value} value={s.value}>{s.label}</option>
                      ))}
                    </select>
                  </div>
                </div>

                {/* Subject Name */}
                <div>
                  <label className="block text-[10px] font-bold text-slate-500 dark:text-slate-400 uppercase mb-1">
                    Subject / Course Name
                  </label>
                  <input
                    type="text"
                    value={subject}
                    onChange={(e) => setSubject(e.target.value)}
                    placeholder="e.g. Software Engineering, Computer Networks"
                    className="w-full px-3 py-2 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-xs font-bold text-slate-800 dark:text-slate-100 focus:outline-hidden"
                  />
                </div>

                {/* Ownership Verification Alert */}
                {conflictingClass && !isClassOwner ? (
                  <div className="flex items-start gap-2 p-3 rounded-xl bg-amber-50 dark:bg-amber-950/60 border border-amber-300 dark:border-amber-800 text-xs font-bold text-amber-900 dark:text-amber-200">
                    <AlertCircle className="w-4 h-4 text-amber-600 shrink-0 mt-0.5" />
                    <div>
                      <span>Ownership Restriction:</span> Classroom {classroom} at this time is assigned to <strong>{conflictingClass.faculty}</strong> (Teacher ID: <code className="font-mono bg-amber-200/60 dark:bg-amber-900/60 px-1 py-0.5 rounded">{conflictingClass.facultyId || 'FAC_OTHER'}</code>). Your Teacher ID is <code className="font-mono bg-amber-200/60 dark:bg-amber-900/60 px-1 py-0.5 rounded">{userFacultyId}</code>. Only the instructor assigned to this subject ID can cancel this class.
                    </div>
                  </div>
                ) : (
                  <div className="flex items-start gap-2 pt-1 text-[11px] text-emerald-800 dark:text-emerald-300 font-semibold bg-emerald-50/80 dark:bg-emerald-950/40 p-2.5 rounded-xl border border-emerald-200/80 dark:border-emerald-800">
                    <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                    <div>
                      <span>
                        When pinged, <strong>{classroom || 'Classroom'}</strong> will immediately switch to <strong>Available</strong> for {day} during {slot}.
                      </span>
                      <span className="block text-[10px] text-emerald-700 dark:text-emerald-400 mt-0.5 font-bold">
                        ℹ️ Un-occupied for this week only. Next week's class returns to normal scheduled occupancy automatically.
                      </span>
                    </div>
                  </div>
                )}
              </div>
            )}

            {/* Title / Headline (Optional) */}
            <div>
              <label className="block text-[11px] font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider mb-1">
                Headline / Subject
              </label>
              <input
                type="text"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="e.g. Software Engineering Class Cancelled for Monday"
                className="w-full px-3.5 py-2.5 rounded-2xl bg-slate-50 dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 text-slate-900 dark:text-white text-xs font-semibold focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500"
              />
            </div>

            {/* Message Body */}
            <div>
              <label className="block text-[11px] font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider mb-1">
                Broadcast Message Content
              </label>
              <textarea
                rows={3}
                required
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                placeholder="Type your message to students (e.g. Today's class at 10:30 in T106 is cancelled due to department meeting. The classroom is free for self-study)..."
                className="w-full px-3.5 py-2.5 rounded-2xl bg-slate-50 dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 text-slate-900 dark:text-white text-xs font-medium focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 resize-none min-h-[70px]"
              />
            </div>

            {/* Sender Signoff Pill */}
            <div className="flex items-center justify-between text-[11px] text-slate-500 dark:text-slate-400 px-3.5 py-2 rounded-xl bg-slate-50 dark:bg-slate-900/60 border border-slate-200/80 dark:border-slate-800">
              <span>Broadcasting as: <strong className="text-slate-800 dark:text-slate-200">{user?.name}</strong></span>
              <span className="font-mono">{user?.email}</span>
            </div>

            {/* Action Buttons */}
            <div className="flex items-center justify-end gap-2.5 pt-1">
              <button
                type="button"
                onClick={onClose}
                className="px-4 py-2.5 rounded-2xl text-xs font-bold text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
              >
                Close
              </button>
              <button
                type="submit"
                disabled={loading || (isCancellation && !isClassOwner && Boolean(conflictingClass))}
                className="px-5 py-2.5 rounded-2xl bg-indigo-600 hover:bg-indigo-700 text-white font-extrabold text-xs shadow-md shadow-indigo-500/20 transition-all flex items-center gap-2 hover:scale-[1.01] active:scale-[0.99] disabled:opacity-50"
              >
                <Send className="w-3.5 h-3.5" />
                {loading ? 'Pinging Batch...' : isCancellation ? 'Broadcast & Un-Occupy Room' : 'Send Broadcast / Ping Batch'}
              </button>
            </div>
          </form>

          {/* Recent Broadcasts Sent Section */}
          <div className="pt-4 border-t border-slate-100 dark:border-slate-800">
            <div className="flex items-center justify-between mb-2.5">
              <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">
                Recent Broadcasts & Cancellations
              </span>
              <button
                type="button"
                onClick={fetchRecent}
                className="text-[11px] font-bold text-indigo-600 dark:text-indigo-400 hover:underline flex items-center gap-1"
              >
                <RefreshCw className={`w-3 h-3 ${fetchingRecent ? 'animate-spin' : ''}`} />
                Refresh
              </button>
            </div>

            {recentBroadcasts.length === 0 ? (
              <p className="text-xs text-slate-400 py-3 text-center">No broadcasts sent yet.</p>
            ) : (
              <div className="space-y-2 max-h-48 overflow-y-auto pr-1">
                {recentBroadcasts.slice(0, 8).map(b => (
                  <div
                    key={b._id}
                    className="p-3 rounded-2xl bg-slate-50 dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 flex items-start justify-between gap-3 text-xs"
                  >
                    <div className="space-y-1 min-w-0 flex-1">
                      <div className="flex items-center flex-wrap gap-2">
                        <span className="px-2 py-0.5 rounded-md text-[10px] font-extrabold bg-indigo-100 dark:bg-indigo-950 text-indigo-700 dark:text-indigo-300">
                          Batch {b.targetBatch}
                        </span>
                        <span className={`px-2 py-0.5 rounded-md text-[10px] font-extrabold ${
                          b.tag === 'CLASS_CANCELLED' ? 'bg-rose-100 text-rose-700 dark:bg-rose-950 dark:text-rose-300' :
                          b.tag === 'URGENT' ? 'bg-amber-100 text-amber-700 dark:bg-amber-950 dark:text-amber-300' :
                          b.tag === 'RESCHEDULED' ? 'bg-purple-100 text-purple-700 dark:bg-purple-950 dark:text-purple-300' :
                          'bg-blue-100 text-blue-700 dark:bg-blue-950 dark:text-blue-300'
                        }`}>
                          {b.tag?.replace('_', ' ')}
                        </span>
                        {b.classroom && (
                          <span className="px-1.5 py-0.5 rounded-md text-[10px] font-black bg-emerald-100 dark:bg-emerald-950 text-emerald-800 dark:text-emerald-300">
                            Room {b.classroom} Un-occupied
                          </span>
                        )}
                        <span className="text-[10px] text-slate-400">
                          by {b.senderName}
                        </span>
                      </div>
                      <p className="font-bold text-slate-900 dark:text-white leading-tight">
                        {b.title}
                      </p>
                      <p className="text-slate-600 dark:text-slate-400 text-[11px] leading-snug">
                        {b.message}
                      </p>
                    </div>

                    <button
                      type="button"
                      onClick={() => handleDelete(b._id)}
                      className="p-1.5 rounded-xl text-slate-400 hover:text-rose-600 dark:hover:text-rose-400 hover:bg-slate-200 dark:hover:bg-slate-800 transition-colors shrink-0"
                      title="Retract / Restore Class Occupancy"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>

        </div>

      </div>
    </div>
  );
}
