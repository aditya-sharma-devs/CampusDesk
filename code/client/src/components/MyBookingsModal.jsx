import React, { useState, useEffect } from 'react';
import { 
  X, 
  CalendarCheck2, 
  Clock, 
  Building2, 
  CheckCircle2, 
  XCircle, 
  AlertCircle, 
  RefreshCw, 
  Trash2,
  Calendar,
  MessageSquare
} from 'lucide-react';
import api from '../services/api';

export default function MyBookingsModal({ onClose, onBookingsChanged }) {
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [cancellingId, setCancellingId] = useState(null);
  const [error, setError] = useState('');

  const fetchMyBookings = async (isBackground = false) => {
    if (!isBackground) setLoading(true);
    setError('');
    try {
      const res = await api.get('/bookings/my');
      if (res.data.success) {
        setBookings(res.data.data);
      }
    } catch (err) {
      console.error('Failed to load user bookings:', err);
      if (!isBackground) setError('Failed to fetch personal bookings. Please try again.');
    } finally {
      if (!isBackground) setLoading(false);
    }
  };

  useEffect(() => {
    fetchMyBookings();
    const interval = setInterval(() => {
      fetchMyBookings(true);
    }, 5000);
    return () => clearInterval(interval);
  }, []);

  const handleCancel = async (bookingId) => {
    if (!window.confirm('Are you sure you want to cancel this booking request?')) {
      return;
    }

    setCancellingId(bookingId);
    try {
      const res = await api.delete(`/bookings/${bookingId}`);
      if (res.data.success) {
        setBookings(prev => prev.filter(b => (b._id !== bookingId && b.bookingId !== bookingId)));
        if (onBookingsChanged) onBookingsChanged();
      }
    } catch (err) {
      alert(err.response?.data?.message || 'Failed to cancel booking.');
    } finally {
      setCancellingId(null);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 bg-slate-900/60 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="relative w-full max-w-3xl max-h-[90vh] flex flex-col rounded-3xl bg-white dark:bg-darkcard border border-slate-200 dark:border-darkborder shadow-2xl overflow-hidden">
        
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-slate-100 dark:border-darkborder">
          <div className="flex items-center gap-3">
            <div className="w-11 h-11 rounded-2xl bg-indigo-100 dark:bg-indigo-950 text-indigo-600 dark:text-indigo-400 flex items-center justify-center">
              <CalendarCheck2 className="w-6 h-6" />
            </div>
            <div>
              <h2 className="text-xl font-extrabold text-slate-900 dark:text-white tracking-tight">
                My Classroom Bookings
              </h2>
              <p className="text-xs text-slate-500 dark:text-slate-400">
                Track status of your submitted classroom reservation requests.
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={fetchMyBookings}
              className="p-2 rounded-xl text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
              title="Refresh List"
            >
              <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} />
            </button>
            <button
              onClick={onClose}
              className="p-2 rounded-xl text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Content Body */}
        <div className="flex-1 overflow-y-auto p-6 space-y-4">
          {error && (
            <div className="p-3.5 rounded-2xl bg-rose-50 dark:bg-rose-950/40 border border-rose-200 dark:border-rose-800 text-rose-700 dark:text-rose-300 text-xs flex items-center gap-2">
              <AlertCircle className="w-4 h-4 shrink-0 text-rose-500" />
              <span>{error}</span>
            </div>
          )}

          {loading ? (
            <div className="py-16 text-center space-y-3">
              <div className="w-8 h-8 border-4 border-indigo-600 border-t-transparent rounded-full animate-spin mx-auto"></div>
              <p className="text-xs text-slate-500 dark:text-slate-400">Loading your reservation requests...</p>
            </div>
          ) : bookings.length === 0 ? (
            <div className="py-16 text-center bg-slate-50 dark:bg-slate-900/40 border border-slate-200 dark:border-slate-800 rounded-3xl p-8 space-y-3">
              <CalendarCheck2 className="w-12 h-12 text-slate-400 mx-auto" />
              <h3 className="text-base font-bold text-slate-800 dark:text-slate-200">No Bookings Found</h3>
              <p className="text-xs text-slate-500 dark:text-slate-400 max-w-sm mx-auto">
                You haven't requested any classroom reservations yet. Browse available rooms on the dashboard and click "Book Room" to reserve a slot.
              </p>
            </div>
          ) : (
            bookings.map((b) => (
              <div
                key={b._id || b.bookingId}
                className="p-5 rounded-2xl bg-white dark:bg-darkcard border border-slate-200/90 dark:border-darkborder shadow-sm space-y-3 hover:border-indigo-500/40 transition-colors"
              >
                {/* Top Row */}
                <div className="flex flex-wrap items-start justify-between gap-3">
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="font-black text-lg text-slate-900 dark:text-white">
                        {b.roomNumber}
                      </span>
                      <span className="text-xs font-semibold px-2.5 py-0.5 rounded-full bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 border border-slate-200 dark:border-slate-700">
                        {b.block}
                      </span>
                      <span className="text-xs font-mono font-bold text-indigo-600 dark:text-indigo-400">
                        {b.bookingId}
                      </span>
                    </div>

                    <div className="flex flex-wrap items-center gap-3 mt-1.5 text-xs text-slate-600 dark:text-slate-400 font-semibold">
                      <div className="flex items-center gap-1.5">
                        <Calendar className="w-3.5 h-3.5 text-indigo-500" />
                        <span>{b.day}</span>
                      </div>
                      <div className="flex items-center gap-1.5">
                        <Clock className="w-3.5 h-3.5 text-indigo-500" />
                        <span>{b.slot || `${b.startTime} - ${b.endTime}`}</span>
                      </div>
                    </div>
                  </div>

                  {/* Status Badge */}
                  <span className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold tracking-wide uppercase shadow-sm ${
                    b.status === 'APPROVED'
                      ? 'bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300 border border-emerald-300 dark:border-emerald-800'
                      : b.status === 'REJECTED'
                      ? 'bg-rose-100 text-rose-800 dark:bg-rose-950 dark:text-rose-300 border border-rose-300 dark:border-rose-800'
                      : 'bg-amber-100 text-amber-800 dark:bg-amber-950 dark:text-amber-300 border border-amber-300 dark:border-amber-800'
                  }`}>
                    {b.status === 'APPROVED' && <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />}
                    {b.status === 'REJECTED' && <XCircle className="w-3.5 h-3.5 text-rose-600" />}
                    {b.status === 'PENDING' && <Clock className="w-3.5 h-3.5 text-amber-600" />}
                    {b.status === 'APPROVED' ? 'BOOKED (APPROVED)' : b.status === 'REJECTED' ? 'REJECTED' : 'PENDING APPROVAL'}
                  </span>
                </div>

                {/* Purpose / Description */}
                <div className="p-3.5 rounded-xl bg-slate-50 dark:bg-slate-900/60 border border-slate-100 dark:border-slate-800 text-xs space-y-1">
                  <div className="flex items-center justify-between text-slate-500 text-[11px]">
                    <span>Category: <strong>{b.category}</strong></span>
                    <span>Requested: {new Date(b.createdAt).toLocaleDateString()}</span>
                  </div>
                  <p className="text-slate-800 dark:text-slate-200 font-medium">
                    "{b.description}"
                  </p>
                </div>

                {/* Admin Remarks if any */}
                {b.adminRemarks && (
                  <div className="p-3 rounded-xl bg-indigo-50/80 dark:bg-indigo-950/40 border border-indigo-200 dark:border-indigo-900 text-xs text-indigo-900 dark:text-indigo-200 flex items-start gap-2">
                    <MessageSquare className="w-4 h-4 text-indigo-600 shrink-0 mt-0.5" />
                    <div>
                      <span className="font-bold">Admin Remarks: </span>
                      <span>{b.adminRemarks}</span>
                    </div>
                  </div>
                )}

                {/* Cancel Action if still Pending */}
                {b.status === 'PENDING' && (
                  <div className="flex justify-end pt-1">
                    <button
                      onClick={() => handleCancel(b._id || b.bookingId)}
                      disabled={cancellingId === (b._id || b.bookingId)}
                      className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-bold text-rose-600 hover:bg-rose-50 dark:hover:bg-rose-950/40 transition-colors"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                      <span>{cancellingId === (b._id || b.bookingId) ? 'Cancelling...' : 'Cancel Request'}</span>
                    </button>
                  </div>
                )}
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
            Close
          </button>
        </div>

      </div>
    </div>
  );
}
