import React, { useState, useEffect } from 'react';
import { 
  X, 
  Megaphone, 
  Bell, 
  Clock, 
  Users, 
  RefreshCw, 
  AlertTriangle, 
  CheckCircle2, 
  MessageSquareQuote,
  Sparkles,
  Search,
  Filter
} from 'lucide-react';
import api from '../services/api';
import { useAuth } from '../context/AuthContext';

export default function StudentBroadcastModal({ onClose }) {
  const { user } = useAuth();
  
  // Student's personal registered batch identity
  const registeredBatch = user?.batch || '3P14';
  
  // 3 Clear Modes: 'registered' (My Batch) | 'all' (All Batches) | 'custom' (Custom Batch)
  const [filterMode, setFilterMode] = useState('registered');
  const [customBatchInput, setCustomBatchInput] = useState('');
  const [selectedBatch, setSelectedBatch] = useState(registeredBatch);
  
  const [announcements, setAnnouncements] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchBroadcasts = async () => {
    // If in custom mode and no custom batch is entered yet
    if (filterMode === 'custom' && !selectedBatch) {
      setAnnouncements([]);
      setLoading(false);
      return;
    }

    setLoading(true);
    try {
      const res = await api.get('/announcements', {
        params: { batch: selectedBatch }
      });
      if (res.data.success) {
        setAnnouncements(res.data.data || []);
      }
    } catch (err) {
      console.warn('Failed to load broadcasts:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchBroadcasts();
  }, [selectedBatch, filterMode]);

  // Format timestamp nicely
  const formatTime = (isoString) => {
    if (!isoString) return 'Recent';
    const date = new Date(isoString);
    const now = new Date();
    const diffMs = now - date;
    const diffMins = Math.floor(diffMs / (1000 * 60));
    
    if (diffMins < 1) return 'Just now';
    if (diffMins < 60) return `${diffMins} min${diffMins > 1 ? 's' : ''} ago`;
    const diffHours = Math.floor(diffMins / 60);
    if (diffHours < 24) return `${diffHours} hour${diffHours > 1 ? 's' : ''} ago`;
    return date.toLocaleDateString(undefined, { month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' });
  };

  const getTagBadge = (tag) => {
    const t = tag || 'ANNOUNCEMENT';
    if (t === 'CLASS_CANCELLED') {
      return (
        <span className="px-2.5 py-0.5 rounded-full text-[10px] font-black uppercase tracking-wider bg-rose-100 text-rose-700 dark:bg-rose-950/80 dark:text-rose-300 border border-rose-200 dark:border-rose-800 animate-pulse">
          Class Cancelled
        </span>
      );
    }
    if (t === 'URGENT') {
      return (
        <span className="px-2.5 py-0.5 rounded-full text-[10px] font-black uppercase tracking-wider bg-amber-100 text-amber-700 dark:bg-amber-950/80 dark:text-amber-300 border border-amber-200 dark:border-amber-800">
          Urgent Notice
        </span>
      );
    }
    if (t === 'RESCHEDULED') {
      return (
        <span className="px-2.5 py-0.5 rounded-full text-[10px] font-black uppercase tracking-wider bg-purple-100 text-purple-700 dark:bg-purple-950/80 dark:text-purple-300 border border-purple-200 dark:border-purple-800">
          Rescheduled
        </span>
      );
    }
    return (
      <span className="px-2.5 py-0.5 rounded-full text-[10px] font-black uppercase tracking-wider bg-blue-100 text-blue-700 dark:bg-blue-950/80 dark:text-blue-300 border border-blue-200 dark:border-blue-800">
        Announcement
      </span>
    );
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="relative w-full max-w-xl rounded-3xl bg-white dark:bg-darkcard border border-slate-200 dark:border-darkborder shadow-2xl flex flex-col max-h-[92vh] overflow-hidden">
        
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-100 dark:border-darkborder shrink-0">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-emerald-100 dark:bg-emerald-950 text-emerald-600 dark:text-emerald-400 flex items-center justify-center shadow-xs">
              <Megaphone className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="text-base sm:text-lg font-black text-slate-900 dark:text-white tracking-tight">
                  Teacher's Messages & Broadcasts
                </h3>
                <span className="px-2 py-0.5 rounded-md bg-emerald-100 dark:bg-emerald-950 text-emerald-800 dark:text-emerald-300 text-[10px] font-black uppercase">
                  {filterMode === 'all' 
                    ? 'All Batches' 
                    : filterMode === 'registered' 
                      ? `Batch ${registeredBatch}` 
                      : (selectedBatch ? `Batch ${selectedBatch}` : 'Custom Batch')}
                </span>
              </div>
              <p className="text-[11px] text-slate-500 dark:text-slate-400">
                Live faculty notices, class cancellations, and timetable adjustments.
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={fetchBroadcasts}
              className="p-1.5 rounded-xl text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
              title="Refresh Messages"
            >
              <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin text-emerald-500' : ''}`} />
            </button>
            <button
              onClick={onClose}
              className="p-1.5 rounded-xl text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Batch Filter Bar: Registered Batch | All Batches | Custom Batch */}
        <div className="px-6 py-3 bg-slate-50 dark:bg-slate-900/60 border-b border-slate-100 dark:border-slate-800 space-y-2.5 shrink-0">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2.5">
            <span className="text-[11px] font-bold text-slate-500 flex items-center gap-1.5 shrink-0">
              <Users className="w-3.5 h-3.5 text-emerald-500" />
              View Broadcasts For:
            </span>

            {/* 3 Clear Options */}
            <div className="inline-flex items-center p-1 rounded-2xl bg-slate-200/70 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700/60 w-full sm:w-auto">
              {/* 1. Registered Batch */}
              <button
                type="button"
                onClick={() => {
                  setFilterMode('registered');
                  setSelectedBatch(registeredBatch);
                }}
                className={`flex-1 sm:flex-initial flex items-center justify-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-bold transition-all ${
                  filterMode === 'registered'
                    ? 'bg-white dark:bg-slate-900 text-emerald-600 dark:text-emerald-400 shadow-sm'
                    : 'text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white'
                }`}
              >
                <span>My Batch</span>
                <span className={`px-1.5 py-0.5 rounded-md text-[10px] font-black ${
                  filterMode === 'registered'
                    ? 'bg-emerald-100 dark:bg-emerald-950/80 text-emerald-700 dark:text-emerald-300'
                    : 'bg-slate-300/60 dark:bg-slate-700 text-slate-600 dark:text-slate-300'
                }`}>
                  {registeredBatch}
                </span>
              </button>

              {/* 2. All Batches */}
              <button
                type="button"
                onClick={() => {
                  setFilterMode('all');
                  setSelectedBatch('ALL');
                }}
                className={`flex-1 sm:flex-initial px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all text-center ${
                  filterMode === 'all'
                    ? 'bg-white dark:bg-slate-900 text-emerald-600 dark:text-emerald-400 shadow-sm'
                    : 'text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white'
                }`}
              >
                All Batches
              </button>

              {/* 3. Custom Batch */}
              <button
                type="button"
                onClick={() => {
                  setFilterMode('custom');
                  if (customBatchInput.trim()) {
                    setSelectedBatch(customBatchInput.trim().toUpperCase());
                  } else {
                    setSelectedBatch('');
                  }
                }}
                className={`flex-1 sm:flex-initial px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all text-center ${
                  filterMode === 'custom'
                    ? 'bg-white dark:bg-slate-900 text-emerald-600 dark:text-emerald-400 shadow-sm'
                    : 'text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white'
                }`}
              >
                Custom Batch
              </button>
            </div>
          </div>

          {/* Custom Batch Input Panel when Custom Batch is active */}
          {filterMode === 'custom' && (
            <div className="pt-1 flex flex-col sm:flex-row sm:items-center gap-2 animate-in fade-in slide-in-from-top-1 duration-150">
              <div className="relative flex-1">
                <input
                  type="text"
                  value={customBatchInput}
                  onChange={(e) => {
                    const val = e.target.value.toUpperCase();
                    setCustomBatchInput(val);
                    setSelectedBatch(val.trim());
                  }}
                  placeholder="Type any batch (e.g. 3CO1, 3CO2, 3ENC1)..."
                  className="w-full px-3.5 py-2 pl-9 rounded-xl text-xs font-bold bg-white dark:bg-slate-900 border border-emerald-500/50 dark:border-emerald-500/50 focus:outline-hidden focus:ring-2 focus:ring-emerald-500/20 text-slate-800 dark:text-slate-100 placeholder:text-slate-400 shadow-xs"
                  autoFocus
                />
                <Search className="w-4 h-4 text-emerald-500 absolute left-3 top-2.5 pointer-events-none" />
              </div>

              {/* Quick Picks for common batches */}
              <div className="flex items-center gap-1.5 overflow-x-auto pb-0.5 shrink-0">
                <span className="text-[10px] font-bold text-slate-400 shrink-0">Quick:</span>
                {['3CO1', '3CO2', '3CO3', '3CO4', '3ENC1'].map(b => (
                  <button
                    key={b}
                    type="button"
                    onClick={() => {
                      setCustomBatchInput(b);
                      setSelectedBatch(b);
                    }}
                    className={`px-2 py-1 rounded-lg text-[10px] font-bold border transition-colors shrink-0 ${
                      customBatchInput === b
                        ? 'bg-emerald-600 text-white border-emerald-600 shadow-xs'
                        : 'bg-white dark:bg-slate-800 border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-300 hover:border-emerald-400'
                    }`}
                  >
                    {b}
                  </button>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Scrollable Broadcast Feed */}
        <div className="p-6 overflow-y-auto space-y-4 scrollbar-thin [scrollbar-width:thin] [&::-webkit-scrollbar]:w-1.5 [&::-webkit-scrollbar-track]:bg-transparent [&::-webkit-scrollbar-thumb]:bg-slate-200 dark:[&::-webkit-scrollbar-thumb]:bg-slate-700 [&::-webkit-scrollbar-thumb]:rounded-full">
          
          {loading ? (
            <div className="py-16 text-center space-y-3">
              <div className="w-8 h-8 border-4 border-emerald-600 border-t-transparent rounded-full animate-spin mx-auto"></div>
              <p className="text-xs text-slate-500 dark:text-slate-400">Loading teacher announcements...</p>
            </div>
          ) : filterMode === 'custom' && !selectedBatch ? (
            <div className="py-14 text-center bg-slate-50 dark:bg-slate-900/40 border border-slate-200 dark:border-slate-800 rounded-3xl p-8 space-y-3">
              <div className="w-12 h-12 rounded-2xl bg-emerald-100 dark:bg-emerald-950 text-emerald-600 dark:text-emerald-400 flex items-center justify-center mx-auto">
                <Search className="w-6 h-6" />
              </div>
              <h3 className="text-base font-bold text-slate-800 dark:text-slate-200">
                Enter a Custom Batch Code
              </h3>
              <p className="text-xs text-slate-500 dark:text-slate-400 max-w-sm mx-auto">
                Type a batch code like <strong>3CO1</strong>, <strong>3CO2</strong>, or <strong>3ENC1</strong> above to view broadcasts sent to that class.
              </p>
            </div>
          ) : announcements.length === 0 ? (
            <div className="py-14 text-center bg-slate-50 dark:bg-slate-900/40 border border-slate-200 dark:border-slate-800 rounded-3xl p-8 space-y-3">
              <div className="w-12 h-12 rounded-2xl bg-emerald-100 dark:bg-emerald-950 text-emerald-600 dark:text-emerald-400 flex items-center justify-center mx-auto">
                <CheckCircle2 className="w-6 h-6" />
              </div>
              <h3 className="text-base font-bold text-slate-800 dark:text-slate-200">
                No New Teacher Messages for {selectedBatch === 'ALL' ? 'All Batches' : `Batch ${selectedBatch}`}
              </h3>
              <p className="text-xs text-slate-500 dark:text-slate-400 max-w-sm mx-auto">
                No active cancellations or announcements have been pinged to this batch. You are all up to date!
              </p>
            </div>
          ) : (
            announcements.map((ann) => (
              <div
                key={ann._id}
                className="p-5 rounded-2xl bg-white dark:bg-darkcard border border-slate-200/90 dark:border-darkborder shadow-sm space-y-3 hover:border-emerald-500/40 transition-colors"
              >
                {/* Header of Announcement Card */}
                <div className="flex flex-wrap items-center justify-between gap-2 pb-2 border-b border-slate-100 dark:border-slate-800">
                  <div className="flex items-center gap-2.5">
                    <div className="w-8 h-8 rounded-xl bg-slate-100 dark:bg-slate-800 text-thapar-600 dark:text-thapar-400 flex items-center justify-center font-bold text-xs">
                      {ann.senderName ? ann.senderName.charAt(0).toUpperCase() : 'T'}
                    </div>
                    <div>
                      <span className="text-xs font-bold text-slate-900 dark:text-white block leading-tight">
                        {ann.senderName}
                      </span>
                      <span className="text-[10px] text-slate-400">
                        {ann.senderRole === 'ADMIN' ? 'Administration' : 'Faculty Instructor'}
                      </span>
                    </div>
                  </div>

                  <div className="flex items-center gap-2">
                    {getTagBadge(ann.tag)}
                    <span className="text-[10px] text-slate-400 flex items-center gap-1 font-medium">
                      <Clock className="w-3 h-3 text-slate-400" />
                      {formatTime(ann.createdAt)}
                    </span>
                  </div>
                </div>

                {/* Title & Body Content */}
                <div className="space-y-1">
                  <h4 className="text-sm font-black text-slate-900 dark:text-white leading-snug">
                    {ann.title}
                  </h4>
                  <p className="text-xs text-slate-700 dark:text-slate-300 leading-relaxed whitespace-pre-wrap">
                    {ann.message}
                  </p>
                </div>

                {/* Footer Meta */}
                <div className="pt-2 flex items-center justify-between text-[11px] text-slate-400 border-t border-slate-100 dark:border-slate-800/60">
                  <span className="flex items-center gap-1 text-emerald-600 dark:text-emerald-400 font-bold">
                    <Users className="w-3.5 h-3.5" />
                    Target: {ann.targetBatch === 'ALL' ? 'All Batches' : `Batch ${ann.targetBatch}`}
                  </span>
                  <span>Institutional Broadcast</span>
                </div>
              </div>
            ))
          )}

        </div>

        {/* Footer */}
        <div className="p-4 bg-slate-50 dark:bg-slate-900/40 border-t border-slate-100 dark:border-darkborder flex items-center justify-between text-xs">
          <span className="text-slate-500 text-[11px]">
            Logged in as <strong className="text-slate-800 dark:text-slate-200">{user?.name}</strong> ({user?.batch ? `Batch ${user.batch}` : `Batch ${registeredBatch}`})
          </span>
          <button
            onClick={onClose}
            className="px-4 py-2 rounded-xl text-xs font-bold bg-slate-200 dark:bg-slate-800 hover:bg-slate-300 text-slate-800 dark:text-slate-200 transition-colors"
          >
            Done
          </button>
        </div>

      </div>
    </div>
  );
}
