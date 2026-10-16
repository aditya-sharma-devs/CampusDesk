import React, { useState, useEffect } from 'react';
import { X, ShieldCheck, Wrench, CheckCircle2, AlertTriangle, Clock, Filter, RefreshCw } from 'lucide-react';
import api from '../services/api';

export default function AdminTicketPanelModal({ onClose, onTicketUpdated }) {
  const [tickets, setTickets] = useState([]);
  const [loading, setLoading] = useState(true);
  const [statusFilter, setStatusFilter] = useState('ALL');
  const [updatingId, setUpdatingId] = useState(null);

  const fetchTickets = async () => {
    setLoading(true);
    try {
      const res = await api.get('/tickets');
      if (res.data.success) {
        setTickets(res.data.data);
      }
    } catch (err) {
      console.error('Failed to fetch admin tickets:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTickets();
  }, []);

  const handleUpdateStatus = async (ticketId, newStatus) => {
    setUpdatingId(ticketId);
    try {
      const res = await api.put(`/tickets/${ticketId}/status`, { status: newStatus });
      if (res.data.success) {
        setTickets(prev =>
          prev.map(t => (t._id === ticketId || t.ticketId === ticketId ? { ...t, status: newStatus } : t))
        );
        if (onTicketUpdated) onTicketUpdated();
      }
    } catch (err) {
      console.error('Failed to update ticket status:', err);
    } finally {
      setUpdatingId(null);
    }
  };

  const filteredTickets = statusFilter === 'ALL'
    ? tickets
    : tickets.filter(t => t.status === statusFilter);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 bg-slate-900/60 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="relative w-full max-w-4xl max-h-[90vh] flex flex-col rounded-3xl bg-white dark:bg-darkcard border border-slate-200 dark:border-darkborder shadow-2xl overflow-hidden">
        
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-slate-100 dark:border-darkborder">
          <div className="flex items-center gap-3">
            <div className="w-11 h-11 rounded-2xl bg-thapar-100 dark:bg-thapar-950 text-thapar-600 dark:text-thapar-400 flex items-center justify-center">
              <ShieldCheck className="w-6 h-6" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-xl font-extrabold text-slate-900 dark:text-white tracking-tight">
                  Admin Maintenance Governance Panel
                </h2>
                <span className="text-[10px] font-extrabold px-2.5 py-0.5 rounded-full bg-thapar-100 text-thapar-700 dark:bg-thapar-900 dark:text-thapar-300">
                  ADMIN ONLY
                </span>
              </div>
              <p className="text-xs text-slate-500 dark:text-slate-400">
                Review reported classroom issues, place rooms under maintenance, or mark issues as resolved.
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

        {/* Filter Controls Bar */}
        <div className="p-4 bg-slate-50 dark:bg-slate-900/50 border-b border-slate-100 dark:border-darkborder flex flex-wrap items-center justify-between gap-3 text-xs">
          <div className="flex items-center gap-2">
            <Filter className="w-4 h-4 text-slate-400" />
            <span className="font-bold text-slate-600 dark:text-slate-300 uppercase tracking-wider">Filter Status:</span>
            {['ALL', 'PENDING', 'UNDER_MAINTENANCE', 'RESOLVED'].map(st => (
              <button
                key={st}
                onClick={() => setStatusFilter(st)}
                className={`px-3 py-1 rounded-xl font-bold transition-all ${
                  statusFilter === st
                    ? 'bg-thapar-600 text-white shadow-sm'
                    : 'bg-white dark:bg-darkcard text-slate-600 dark:text-slate-400 hover:bg-slate-200 dark:hover:bg-slate-800'
                }`}
              >
                {st.replace('_', ' ')}
              </button>
            ))}
          </div>

          <button
            onClick={fetchTickets}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl font-semibold text-slate-600 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-800 transition-colors"
          >
            <RefreshCw className={`w-3.5 h-3.5 ${loading ? 'animate-spin' : ''}`} />
            Refresh List
          </button>
        </div>

        {/* Ticket List Body */}
        <div className="flex-1 overflow-y-auto p-6 space-y-4">
          {loading ? (
            <div className="py-16 text-center text-slate-400 animate-pulse text-xs">
              Loading complaint tickets...
            </div>
          ) : filteredTickets.length === 0 ? (
            <div className="py-12 text-center text-slate-400 text-xs">
              No tickets found matching current filter filter criteria.
            </div>
          ) : (
            filteredTickets.map(t => (
              <div
                key={t._id || t.ticketId}
                className="p-5 rounded-2xl bg-white dark:bg-darkcard border border-slate-200/90 dark:border-darkborder shadow-sm space-y-4 hover:border-thapar-500/40 transition-colors"
              >
                {/* Top Row */}
                <div className="flex flex-wrap items-start justify-between gap-3">
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="font-black text-lg text-slate-900 dark:text-white">
                        {t.roomNumber}
                      </span>
                      <span className="text-xs font-semibold px-2.5 py-0.5 rounded-full bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 border border-slate-200 dark:border-slate-700">
                        {t.block}
                      </span>
                      <span className="text-xs font-mono font-bold text-thapar-600 dark:text-thapar-400">
                        {t.ticketId}
                      </span>
                    </div>
                    <p className="text-xs font-bold text-slate-700 dark:text-slate-300 mt-1">
                      Category: {t.category}
                    </p>
                  </div>

                  {/* Status Badge */}
                  <span className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold tracking-wide uppercase ${
                    t.status === 'UNDER_MAINTENANCE'
                      ? 'bg-amber-100 text-amber-800 dark:bg-amber-950 dark:text-amber-300 border border-amber-300 dark:border-amber-800'
                      : t.status === 'RESOLVED'
                      ? 'bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300 border border-emerald-300 dark:border-emerald-800'
                      : 'bg-yellow-100 text-yellow-800 dark:bg-yellow-950 dark:text-yellow-300 border border-yellow-300 dark:border-yellow-800'
                  }`}>
                    {t.status === 'UNDER_MAINTENANCE' && <Wrench className="w-3.5 h-3.5" />}
                    {t.status === 'RESOLVED' && <CheckCircle2 className="w-3.5 h-3.5" />}
                    {t.status === 'PENDING' && <Clock className="w-3.5 h-3.5" />}
                    {t.status === 'PENDING' ? 'NOT REVIEWED YET' : t.status.replace('_', ' ')}
                  </span>
                </div>

                {/* Description & Reporter Info */}
                <div className="p-3.5 rounded-xl bg-slate-50 dark:bg-slate-900/60 border border-slate-100 dark:border-slate-800 text-xs space-y-1">
                  <p className="text-slate-800 dark:text-slate-200 font-medium">
                    "{t.description}"
                  </p>
                  <p className="text-[11px] text-slate-500 dark:text-slate-400">
                    Reported by <strong>{t.reportedBy?.name}</strong> ({t.reportedBy?.email} • {t.reportedBy?.role})
                  </p>
                </div>

                {/* Admin Status Actions */}
                <div className="flex flex-wrap items-center justify-between gap-3 pt-2 border-t border-slate-100 dark:border-darkborder">
                  <span className="text-[11px] text-slate-400">
                    Logged: {new Date(t.createdAt).toLocaleString()}
                  </span>

                  <div className="flex items-center gap-2">
                    {t.status !== 'UNDER_MAINTENANCE' && (
                      <button
                        disabled={updatingId === (t._id || t.ticketId)}
                        onClick={() => handleUpdateStatus(t._id || t.ticketId, 'UNDER_MAINTENANCE')}
                        className="px-3.5 py-1.5 rounded-xl bg-amber-500 hover:bg-amber-600 text-white font-extrabold text-xs shadow-sm transition-all flex items-center gap-1.5"
                      >
                        <Wrench className="w-3.5 h-3.5" />
                        Mark Under Maintenance
                      </button>
                    )}

                    {t.status !== 'RESOLVED' && (
                      <button
                        disabled={updatingId === (t._id || t.ticketId)}
                        onClick={() => handleUpdateStatus(t._id || t.ticketId, 'RESOLVED')}
                        className="px-3.5 py-1.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-extrabold text-xs shadow-sm transition-all flex items-center gap-1.5"
                      >
                        <CheckCircle2 className="w-3.5 h-3.5" />
                        Mark Resolved
                      </button>
                    )}

                    {t.status !== 'PENDING' && (
                      <button
                        disabled={updatingId === (t._id || t.ticketId)}
                        onClick={() => handleUpdateStatus(t._id || t.ticketId, 'PENDING')}
                        className="px-3 py-1.5 rounded-xl bg-slate-200 dark:bg-slate-800 text-slate-700 dark:text-slate-300 font-bold text-xs hover:bg-slate-300 transition-all"
                      >
                        Reset Status
                      </button>
                    )}
                  </div>
                </div>
              </div>
            ))
          )}
        </div>

        {/* Footer */}
        <div className="p-4 bg-slate-50 dark:bg-slate-900/50 border-t border-slate-100 dark:border-darkborder flex items-center justify-end">
          <button
            onClick={onClose}
            className="px-5 py-2.5 rounded-xl text-xs font-bold text-slate-700 dark:text-slate-200 bg-white dark:bg-darkcard border border-slate-200 dark:border-darkborder hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
          >
            Close Panel
          </button>
        </div>

      </div>
    </div>
  );
}
