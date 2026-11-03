import React, { useState, useEffect } from 'react';
import { 
  X, 
  ShieldCheck, 
  CalendarCheck2, 
  CheckCircle2, 
  XCircle, 
  Clock, 
  Filter, 
  RefreshCw, 
  User, 
  Calendar, 
  MessageSquare,
  Building2,
  AlertTriangle
} from 'lucide-react';
import api from '../services/api';

export default function AdminBookingPanelModal({ onClose, onBookingUpdated }) {
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [statusFilter, setStatusFilter] = useState('ALL');
  const [updatingId, setUpdatingId] = useState(null);
  const [remarksMap, setRemarksMap] = useState({});

  const fetchBookings = async (isBackground = false) => {
    if (!isBackground) setLoading(true);
    try {
      const res = await api.get('/bookings');
      if (res.data.success) {
        setBookings(res.data.data);
      }
    } catch (err) {
      console.error('Failed to fetch admin bookings:', err);
    } finally {
      if (!isBackground) setLoading(false);
    }
  };

  useEffect(() => {
    fetchBookings();
    const interval = setInterval(() => {
      fetchBookings(true);
    }, 5000);
    return () => clearInterval(interval);
  }, []);

  const handleUpdateStatus = async (bookingId, newStatus) => {
    setUpdatingId(bookingId);
    try {
      const remarks = remarksMap[bookingId] !== undefined ? remarksMap[bookingId] : '';
      const res = await api.put(`/bookings/${bookingId}/status`, { 
        status: newStatus,
        adminRemarks: remarks
      });
      if (res.data.success) {
        setBookings(prev =>
          prev.map(b => (b._id === bookingId || b.bookingId === bookingId ? res.data.data : b))
        );
        if (onBookingUpdated) onBookingUpdated();
      }
    } catch (err) {
      alert(err.response?.data?.message || 'Failed to update booking status.');
    } finally {
      setUpdatingId(null);
    }
  };

  const handleRemarkChange = (bookingId, text) => {
    setRemarksMap(prev => ({ ...prev, [bookingId]: text }));
  };

  const filteredBookings = statusFilter === 'ALL'
    ? bookings
    : bookings.filter(b => b.status === statusFilter);

  const pendingCount = bookings.filter(b => b.status === 'PENDING').length;
  const approvedCount = bookings.filter(b => b.status === 'APPROVED').length;
  const rejectedCount = bookings.filter(b => b.status === 'REJECTED').length;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 bg-slate-900/60 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="relative w-full max-w-4xl max-h-[90vh] flex flex-col rounded-3xl bg-white dark:bg-darkcard border border-slate-200 dark:border-darkborder shadow-2xl overflow-hidden">
        
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-slate-100 dark:border-darkborder">
          <div className="flex items-center gap-3">
            <div className="w-11 h-11 rounded-2xl bg-indigo-100 dark:bg-indigo-950 text-indigo-600 dark:text-indigo-400 flex items-center justify-center">
              <CalendarCheck2 className="w-6 h-6" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-xl font-extrabold text-slate-900 dark:text-white tracking-tight">
                  Classroom Booking Approvals Panel
                </h2>
                <span className="text-[10px] font-extrabold px-2.5 py-0.5 rounded-full bg-indigo-100 text-indigo-700 dark:bg-indigo-900 dark:text-indigo-300">
                  ADMIN GOVERNANCE
                </span>
              </div>
              <p className="text-xs text-slate-500 dark:text-slate-400">
                Review classroom booking requests from faculty and student heads. Approve or reject reservations.
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

        {/* Filter and Metric Bar */}
        <div className="p-4 bg-slate-50 dark:bg-slate-900/50 border-b border-slate-100 dark:border-darkborder flex flex-wrap items-center justify-between gap-3 text-xs">
          <div className="flex items-center gap-2">
            <Filter className="w-4 h-4 text-slate-400" />
            <span className="font-bold text-slate-600 dark:text-slate-300 uppercase tracking-wider">Status:</span>
            {[
              { id: 'ALL', label: `All (${bookings.length})` },
              { id: 'PENDING', label: `Pending (${pendingCount})` },
              { id: 'APPROVED', label: `Approved (${approvedCount})` },
              { id: 'REJECTED', label: `Rejected (${rejectedCount})` }
            ].map(st => (
              <button
                key={st.id}
                onClick={() => setStatusFilter(st.id)}
                className={`px-3 py-1 rounded-xl font-bold transition-all ${
                  statusFilter === st.id
                    ? 'bg-indigo-600 text-white shadow-sm'
                    : 'bg-white dark:bg-darkcard text-slate-600 dark:text-slate-400 hover:bg-slate-200 dark:hover:bg-slate-800'
                }`}
              >
                {st.label}
              </button>
            ))}
          </div>

          <button
            onClick={fetchBookings}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl font-semibold text-slate-600 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-800 transition-colors"
          >
            <RefreshCw className={`w-3.5 h-3.5 ${loading ? 'animate-spin' : ''}`} />
            Refresh
          </button>
        </div>

        {/* Booking Requests List */}
        <div className="flex-1 overflow-y-auto p-6 space-y-4">
          {loading ? (
            <div className="py-16 text-center text-slate-400 animate-pulse text-xs">
              Loading classroom booking requests...
            </div>
          ) : filteredBookings.length === 0 ? (
            <div className="py-12 text-center text-slate-400 text-xs">
              No booking requests found matching selected filter.
            </div>
          ) : (
            filteredBookings.map(b => (
              <div
                key={b._id || b.bookingId}
                className="p-5 rounded-2xl bg-white dark:bg-darkcard border border-slate-200/90 dark:border-darkborder shadow-sm space-y-4 hover:border-indigo-500/40 transition-colors"
              >
                {/* Top Row: Room, Block, Booking ID, Status */}
                <div className="flex flex-wrap items-start justify-between gap-3">
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="font-black text-xl text-slate-900 dark:text-white">
                        {b.roomNumber}
                      </span>
                      <span className="text-xs font-semibold px-2.5 py-0.5 rounded-full bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 border border-slate-200 dark:border-slate-700">
                        {b.block}
                      </span>
                      <span className="text-xs font-mono font-bold text-indigo-600 dark:text-indigo-400">
                        {b.bookingId}
                      </span>
                    </div>

                    <div className="flex flex-wrap items-center gap-3 mt-1.5 text-xs font-semibold text-slate-600 dark:text-slate-400">
                      <div className="flex items-center gap-1.5">
                        <Calendar className="w-3.5 h-3.5 text-indigo-500" />
                        <span>{b.day}</span>
                      </div>
                      <div className="flex items-center gap-1.5">
                        <Clock className="w-3.5 h-3.5 text-indigo-500" />
                        <span>{b.slot || `${b.startTime} - ${b.endTime}`}</span>
                      </div>
                      <span className="px-2 py-0.5 rounded-md bg-indigo-50 dark:bg-indigo-950 text-indigo-700 dark:text-indigo-300 font-bold text-[10px]">
                        {b.category}
                      </span>
                    </div>
                  </div>

                  {/* Status Badge */}
                  <span className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold tracking-wide uppercase ${
                    b.status === 'APPROVED'
                      ? 'bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300 border border-emerald-300 dark:border-emerald-800'
                      : b.status === 'REJECTED'
                      ? 'bg-rose-100 text-rose-800 dark:bg-rose-950 dark:text-rose-300 border border-rose-300 dark:border-rose-800'
                      : 'bg-amber-100 text-amber-800 dark:bg-amber-950 dark:text-amber-300 border border-amber-300 dark:border-amber-800'
                  }`}>
                    {b.status === 'APPROVED' && <CheckCircle2 className="w-3.5 h-3.5" />}
                    {b.status === 'REJECTED' && <XCircle className="w-3.5 h-3.5" />}
                    {b.status === 'PENDING' && <Clock className="w-3.5 h-3.5" />}
                    {b.status === 'APPROVED' ? 'APPROVED & BOOKED' : b.status === 'REJECTED' ? 'REJECTED' : 'PENDING APPROVAL'}
                  </span>
                </div>

                {/* Purpose / Description & Requester */}
                <div className="p-3.5 rounded-xl bg-slate-50 dark:bg-slate-900/60 border border-slate-100 dark:border-slate-800 text-xs space-y-1.5">
                  <p className="text-slate-800 dark:text-slate-200 font-medium">
                    "{b.description}"
                  </p>
                  <div className="flex flex-wrap items-center justify-between text-[11px] text-slate-500 dark:text-slate-400 pt-1 border-t border-slate-200/40 dark:border-slate-800">
                    <span className="flex items-center gap-1">
                      <User className="w-3 h-3 text-slate-400" />
                      Requested by <strong>{b.requestedBy?.name}</strong> ({b.requestedBy?.email} • {b.requestedBy?.role})
                    </span>
                    <span>Submitted: {new Date(b.createdAt).toLocaleString()}</span>
                  </div>
                </div>

                {/* Admin Remarks Input / Display */}
                <div className="space-y-1.5">
                  <label className="block text-[11px] font-bold text-slate-500 uppercase tracking-wider">
                    Admin Remarks (Optional feedback to requester):
                  </label>
                  <input
                    type="text"
                    value={remarksMap[b._id || b.bookingId] !== undefined ? remarksMap[b._id || b.bookingId] : (b.adminRemarks || '')}
                    onChange={(e) => handleRemarkChange(b._id || b.bookingId, e.target.value)}
                    placeholder="e.g. Approved. Keys available with caretaker. / Rejected due to department exam."
                    className="w-full px-3 py-2 rounded-xl bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-slate-900 dark:text-white text-xs focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  />
                </div>

                {/* Action Buttons */}
                <div className="flex flex-wrap items-center justify-between gap-3 pt-2 border-t border-slate-100 dark:border-darkborder">
                  <span className="text-[11px] text-slate-400">
                    {b.processedBy ? `Last updated by: ${b.processedBy.name}` : 'Awaiting administrative decision'}
                  </span>

                  <div className="flex items-center gap-2">
                    {b.status !== 'APPROVED' && (
                      <button
                        disabled={updatingId === (b._id || b.bookingId)}
                        onClick={() => handleUpdateStatus(b._id || b.bookingId, 'APPROVED')}
                        className="px-4 py-1.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-extrabold text-xs shadow-sm transition-all flex items-center gap-1.5"
                      >
                        <CheckCircle2 className="w-3.5 h-3.5" />
                        Approve Booking
                      </button>
                    )}

                    {b.status !== 'REJECTED' && (
                      <button
                        disabled={updatingId === (b._id || b.bookingId)}
                        onClick={() => handleUpdateStatus(b._id || b.bookingId, 'REJECTED')}
                        className="px-4 py-1.5 rounded-xl bg-rose-600 hover:bg-rose-700 text-white font-extrabold text-xs shadow-sm transition-all flex items-center gap-1.5"
                      >
                        <XCircle className="w-3.5 h-3.5" />
                        Reject Booking
                      </button>
                    )}

                    {b.status !== 'PENDING' && (
                      <button
                        disabled={updatingId === (b._id || b.bookingId)}
                        onClick={() => handleUpdateStatus(b._id || b.bookingId, 'PENDING')}
                        className="px-3 py-1.5 rounded-xl bg-slate-200 dark:bg-slate-800 text-slate-700 dark:text-slate-300 font-bold text-xs hover:bg-slate-300 transition-all"
                      >
                        Re-open as Pending
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
