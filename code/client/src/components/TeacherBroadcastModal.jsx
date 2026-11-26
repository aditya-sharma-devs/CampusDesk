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
  Sparkles
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

    const defaultTitle = 
      tag === 'CLASS_CANCELLED' ? `Class Cancelled: Batch ${effectiveBatch}` :
      tag === 'RESCHEDULED' ? `Class Rescheduled: Batch ${effectiveBatch}` :
      tag === 'URGENT' ? `Urgent Notice for Batch ${effectiveBatch}` :
      `Announcement for Batch ${effectiveBatch}`;

    setLoading(true);
    try {
      const res = await api.post('/announcements', {
        targetBatch: effectiveBatch,
        title: title.trim() || defaultTitle,
        message: message.trim(),
        tag
      });

      if (res.data.success) {
        setSuccessMsg(`Ping sent! Students of Batch ${effectiveBatch} will now see your broadcast.`);
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
    } catch (err) {
      console.warn('Failed to delete announcement:', err);
    }
  };

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
              <h3 className="text-base sm:text-lg font-black text-slate-900 dark:text-white tracking-tight">
                Ping Batch / Broadcast Message
              </h3>
              <p className="text-[11px] text-slate-500 dark:text-slate-400">
                Send an instant broadcast to students (e.g. Class Cancelled, Schedule change).
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
                    <span>Will ping all students belonging to <strong>Batch {targetBatch}</strong></span>
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

            {/* Title / Headline (Optional) */}
            <div>
              <label className="block text-[11px] font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider mb-1">
                Headline / Subject (Optional)
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
                placeholder="Type your message to students (e.g. Today's class at 09:40 in T106 is cancelled due to seminar. Extra session will be announced later)..."
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
                disabled={loading}
                className="px-5 py-2.5 rounded-2xl bg-indigo-600 hover:bg-indigo-700 text-white font-extrabold text-xs shadow-md shadow-indigo-500/20 transition-all flex items-center gap-2 hover:scale-[1.01] active:scale-[0.99] disabled:opacity-50"
              >
                <Send className="w-3.5 h-3.5" />
                {loading ? 'Pinging Batch...' : 'Send Broadcast / Ping Batch'}
              </button>
            </div>
          </form>

          {/* Recent Broadcasts Sent Section */}
          <div className="pt-4 border-t border-slate-100 dark:border-slate-800">
            <div className="flex items-center justify-between mb-2.5">
              <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">
                Recent Broadcasts Sent
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
                {recentBroadcasts.slice(0, 6).map(b => (
                  <div
                    key={b._id}
                    className="p-3 rounded-2xl bg-slate-50 dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 flex items-start justify-between gap-3 text-xs"
                  >
                    <div className="space-y-1 min-w-0 flex-1">
                      <div className="flex items-center gap-2">
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
                      className="p-1 rounded-lg text-slate-400 hover:text-rose-600 dark:hover:text-rose-400 hover:bg-slate-200 dark:hover:bg-slate-800 transition-colors shrink-0"
                      title="Retract / Delete Broadcast"
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
