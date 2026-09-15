import React, { useState } from 'react';
import { X, Wrench, Send, AlertCircle, CheckCircle2, Building2, Tag } from 'lucide-react';
import api from '../services/api';
import { useAuth } from '../context/AuthContext';
import CustomSelect from './CustomSelect';

export default function RaiseTicketModal({ initialRoomNumber = '', onClose, onSuccess }) {
  const { user } = useAuth();
  const [roomNumber, setRoomNumber] = useState(initialRoomNumber || 'T106');
  const [category, setCategory] = useState('Projector & AV Display');
  const [description, setDescription] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [createdTicket, setCreatedTicket] = useState(null);

  const categories = [
    'Projector & AV Display',
    'Microphone & Sound System',
    'Air Conditioning & Lighting',
    'Whiteboard & Markers',
    'Podium & Seating',
    'Other'
  ];

  const commonRooms = [
    { label: 'T106 (T Block)', value: 'T106' },
    { label: 'T101 (T Block)', value: 'T101' },
    { label: 'T102 (T Block)', value: 'T102' },
    { label: 'T107 (T Block)', value: 'T107' },
    { label: 'T108 (T Block)', value: 'T108' },
    { label: 'T109 (T Block)', value: 'T109' },
    { label: 'LT303 (LT Block)', value: 'LT303' },
    { label: 'LT101 (LT Block)', value: 'LT101' },
    { label: 'LT102 (LT Block)', value: 'LT102' },
    { label: 'LT301 (LT Block)', value: 'LT301' },
    { label: 'LT302 (LT Block)', value: 'LT302' },
    { label: 'LT304 (LT Block)', value: 'LT304' },
    { label: 'F201 (F Block)', value: 'F201' },
    { label: 'F202 (F Block)', value: 'F202' },
    { label: 'F203 (F Block)', value: 'F203' },
    { label: 'F204 (F Block)', value: 'F204' },
    { label: 'E104 (E Block)', value: 'E104' },
    { label: 'E101 (E Block)', value: 'E101' },
    { label: 'E102 (E Block)', value: 'E102' },
    { label: 'E105 (E Block)', value: 'E105' },
    { label: 'L302 (L Block)', value: 'L302' },
    { label: 'L301 (L Block)', value: 'L301' },
    { label: 'L303 (L Block)', value: 'L303' },
    { label: 'L304 (L Block)', value: 'L304' },
    { label: 'LP109 (LP Block)', value: 'LP109' },
    { label: 'LP108 (LP Block)', value: 'LP108' },
    { label: 'LP110 (LP Block)', value: 'LP110' }
  ];

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    if (!roomNumber.trim() || !description.trim()) {
      return setError('Please provide both classroom room number and issue description.');
    }

    setLoading(true);
    try {
      const res = await api.post('/tickets', {
        roomNumber: roomNumber.trim().toUpperCase(),
        category,
        description: description.trim()
      });

      if (res.data.success) {
        setCreatedTicket(res.data.data);
        if (onSuccess) onSuccess(res.data.data);
      } else {
        setError(res.data.message || 'Failed to submit ticket.');
      }
    } catch (err) {
      const msg = err.response?.data?.message || 'Failed to submit ticket. Check server connection.';
      setError(msg);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="relative w-full max-w-lg p-6 sm:p-8 rounded-3xl bg-white dark:bg-darkcard border border-slate-200 dark:border-darkborder shadow-2xl space-y-6">
        
        {/* Modal Header */}
        <div className="flex items-center justify-between pb-4 border-b border-slate-100 dark:border-darkborder">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-amber-100 dark:bg-amber-950/80 text-amber-600 dark:text-amber-400 flex items-center justify-center">
              <Wrench className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-lg font-extrabold text-slate-900 dark:text-white tracking-tight">
                Report Classroom Issue
              </h3>
              <p className="text-xs text-slate-500 dark:text-slate-400">
                Logged by: {user?.name || 'Faculty Member'} ({user?.role?.replace('_', ' ') || 'TEACHER'})
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
        {createdTicket ? (
          <div className="py-6 text-center space-y-4">
            <div className="w-14 h-14 rounded-full bg-emerald-100 dark:bg-emerald-950 text-emerald-600 dark:text-emerald-400 flex items-center justify-center mx-auto">
              <CheckCircle2 className="w-8 h-8" />
            </div>

            <div>
              <h4 className="text-lg font-black text-slate-900 dark:text-white">
                Ticket Raised Successfully!
              </h4>
              <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
                Your complaint has been submitted to Academic Maintenance Administration.
              </p>
            </div>

            <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-left space-y-2 text-xs">
              <div className="flex justify-between">
                <span className="text-slate-500">Unique Ticket ID:</span>
                <span className="font-extrabold text-thapar-600 dark:text-thapar-400">{createdTicket.ticketId}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-500">Classroom:</span>
                <span className="font-bold text-slate-800 dark:text-slate-200">{createdTicket.roomNumber} ({createdTicket.block})</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-500">Category:</span>
                <span className="font-semibold text-slate-700 dark:text-slate-300">{createdTicket.category}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-500">Initial Status:</span>
                <span className="font-bold text-amber-600 dark:text-amber-400">PENDING REVIEW</span>
              </div>
            </div>

            <button
              onClick={onClose}
              className="w-full py-3 rounded-2xl bg-thapar-600 hover:bg-thapar-700 text-white font-extrabold text-xs shadow-lg transition-all"
            >
              Done & Close
            </button>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-4">
            {error && (
              <div className="p-3.5 rounded-2xl bg-rose-50 dark:bg-rose-950/40 border border-rose-200 dark:border-rose-800 text-rose-700 dark:text-rose-300 text-xs flex items-center gap-2">
                <AlertCircle className="w-4 h-4 shrink-0 text-rose-500" />
                <span>{error}</span>
              </div>
            )}

            {/* Custom Room Number Select */}
            <CustomSelect
              label="Classroom Room Number"
              options={commonRooms}
              value={roomNumber}
              onChange={setRoomNumber}
              icon={Building2}
              placeholder="Select Classroom..."
            />

            {/* Custom Category Select */}
            <CustomSelect
              label="Issue Category"
              options={categories}
              value={category}
              onChange={setCategory}
              icon={Tag}
              placeholder="Select Category..."
            />

            <div>
              <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1.5 uppercase tracking-wider">
                Problem Description
              </label>
              <textarea
                rows={3}
                required
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="Describe the classroom issue (e.g., HDMI display flicker, podium mic battery low, AC not cooling)..."
                className="w-full px-4 py-3 rounded-2xl bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-slate-900 dark:text-white text-xs font-medium focus:outline-none focus:ring-2 focus:ring-thapar-500 resize-none"
              />
            </div>

            <div className="pt-2 flex items-center justify-end gap-3">
              <button
                type="button"
                onClick={onClose}
                className="px-5 py-3 rounded-2xl text-xs font-bold text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={loading}
                className="px-6 py-3 rounded-2xl bg-thapar-600 hover:bg-thapar-700 text-white font-extrabold text-xs shadow-lg shadow-thapar-500/25 transition-all hover:scale-[1.01] active:scale-[0.99] disabled:opacity-50 flex items-center gap-2"
              >
                {loading ? 'Logging Ticket...' : 'Submit Complaint Ticket'}
                <Send className="w-3.5 h-3.5" />
              </button>
            </div>
          </form>
        )}

      </div>
    </div>
  );
}
