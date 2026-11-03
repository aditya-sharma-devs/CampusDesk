import React, { useState } from 'react';
import { 
  X, 
  Calendar, 
  Clock, 
  Building2, 
  Send, 
  AlertCircle, 
  CheckCircle2, 
  Tag, 
  Info,
  CalendarCheck2
} from 'lucide-react';
import api from '../services/api';
import { useAuth } from '../context/AuthContext';
import CustomSelect from './CustomSelect';
import { DAYS_OF_WEEK } from '../utils/timeFormat';

export default function BookClassroomModal({ 
  initialRoomNumber = '', 
  initialDay = '', 
  onClose, 
  onBookingCreated,
  onOpenMyBookings
}) {
  const { user } = useAuth();
  
  const [roomNumber, setRoomNumber] = useState(initialRoomNumber || 'T106');
  const [day, setDay] = useState(initialDay || 'Monday');
  const [selectedSlotIndex, setSelectedSlotIndex] = useState('2'); // Default to 09:40 - 10:30
  const [category, setCategory] = useState('Guest Lecture');
  const [description, setDescription] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [createdBooking, setCreatedBooking] = useState(null);

  const slotOptions = [
    { label: '08:00 AM - 08:50 AM', startTime: '08:00', endTime: '08:50' },
    { label: '08:50 AM - 09:40 AM', startTime: '08:50', endTime: '09:40' },
    { label: '09:40 AM - 10:30 AM', startTime: '09:40', endTime: '10:30' },
    { label: '10:30 AM - 11:20 AM', startTime: '10:30', endTime: '11:20' },
    { label: '11:20 AM - 12:10 PM', startTime: '11:20', endTime: '12:10' },
    { label: '12:10 PM - 01:00 PM (Lunch Slot)', startTime: '12:10', endTime: '13:00' },
    { label: '01:00 PM - 01:50 PM', startTime: '13:00', endTime: '13:50' },
    { label: '01:50 PM - 02:40 PM', startTime: '13:50', endTime: '14:40' },
    { label: '02:40 PM - 03:30 PM', startTime: '14:40', endTime: '15:30' },
    { label: '03:30 PM - 04:20 PM', startTime: '15:30', endTime: '16:20' },
    { label: '04:20 PM - 05:10 PM', startTime: '16:20', endTime: '17:10' }
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

  const categories = [
    'Guest Lecture',
    'Makeup Class',
    'Student Society Event',
    'Workshop / Hackathon',
    'Faculty Meeting',
    'Exam / Test',
    'Other'
  ];

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    if (!roomNumber.trim()) {
      return setError('Please select a classroom room number.');
    }
    if (!description.trim()) {
      return setError('Please provide a booking purpose/description.');
    }

    const slotObj = slotOptions[parseInt(selectedSlotIndex, 10)] || slotOptions[0];

    setLoading(true);
    try {
      const res = await api.post('/bookings', {
        roomNumber: roomNumber.trim().toUpperCase(),
        day,
        startTime: slotObj.startTime,
        endTime: slotObj.endTime,
        slot: slotObj.label,
        category,
        description: description.trim()
      });

      if (res.data.success) {
        setCreatedBooking(res.data.data);
        if (onBookingCreated) onBookingCreated(res.data.data);
      } else {
        setError(res.data.message || 'Failed to submit booking request.');
      }
    } catch (err) {
      const msg = err.response?.data?.message || 'Failed to submit booking request. Please check server connection.';
      setError(msg);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="relative w-full max-w-lg p-6 sm:p-8 rounded-3xl bg-white dark:bg-darkcard border border-slate-200 dark:border-darkborder shadow-2xl space-y-6 max-h-[92vh] overflow-y-auto">
        
        {/* Header */}
        <div className="flex items-center justify-between pb-4 border-b border-slate-100 dark:border-darkborder">
          <div className="flex items-center gap-3">
            <div className="w-11 h-11 rounded-2xl bg-indigo-100 dark:bg-indigo-950/80 text-indigo-600 dark:text-indigo-400 flex items-center justify-center">
              <CalendarCheck2 className="w-6 h-6" />
            </div>
            <div>
              <h3 className="text-lg font-extrabold text-slate-900 dark:text-white tracking-tight">
                Request Classroom Booking
              </h3>
              <p className="text-xs text-slate-500 dark:text-slate-400">
                Submit an empty slot reservation for Admin approval.
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

        {/* Body */}
        {createdBooking ? (
          <div className="py-6 text-center space-y-4">
            <div className="w-14 h-14 rounded-full bg-emerald-100 dark:bg-emerald-950 text-emerald-600 dark:text-emerald-400 flex items-center justify-center mx-auto">
              <CheckCircle2 className="w-8 h-8" />
            </div>

            <div>
              <h4 className="text-lg font-black text-slate-900 dark:text-white">
                Booking Request Submitted!
              </h4>
              <p className="text-xs text-slate-500 dark:text-slate-400 mt-1 max-w-sm mx-auto">
                Your request has been forwarded to Academic Administration. Once reviewed, you will see its updated status under <strong>My Bookings</strong>.
              </p>
            </div>

            <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-left space-y-2 text-xs">
              <div className="flex justify-between">
                <span className="text-slate-500">Booking Reference:</span>
                <span className="font-extrabold font-mono text-indigo-600 dark:text-indigo-400">{createdBooking.bookingId}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-500">Classroom:</span>
                <span className="font-bold text-slate-800 dark:text-slate-200">{createdBooking.roomNumber} ({createdBooking.block})</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-500">Day & Slot:</span>
                <span className="font-semibold text-slate-700 dark:text-slate-300">{createdBooking.day}, {createdBooking.slot}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-500">Event Category:</span>
                <span className="font-semibold text-slate-700 dark:text-slate-300">{createdBooking.category}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-500">Initial Status:</span>
                <span className="font-bold text-amber-600 dark:text-amber-400">PENDING ADMIN APPROVAL</span>
              </div>
            </div>

            <div className="flex flex-col sm:flex-row gap-3 pt-2">
              <button
                type="button"
                onClick={() => {
                  onClose();
                  if (onOpenMyBookings) onOpenMyBookings();
                }}
                className="flex-1 py-3 rounded-2xl bg-indigo-600 hover:bg-indigo-700 text-white font-extrabold text-xs shadow-lg shadow-indigo-500/25 transition-all flex items-center justify-center gap-2"
              >
                <CalendarCheck2 className="w-4 h-4" />
                View in My Bookings
              </button>
              <button
                type="button"
                onClick={onClose}
                className="flex-1 py-3 rounded-2xl bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-200 font-extrabold text-xs transition-colors"
              >
                Done
              </button>
            </div>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-4">
            {error && (
              <div className="p-3.5 rounded-2xl bg-rose-50 dark:bg-rose-950/40 border border-rose-200 dark:border-rose-800 text-rose-700 dark:text-rose-300 text-xs flex items-center gap-2">
                <AlertCircle className="w-4 h-4 shrink-0 text-rose-500" />
                <span>{error}</span>
              </div>
            )}

            {/* Room Selector */}
            <CustomSelect
              label="Classroom Room Number"
              options={commonRooms}
              value={roomNumber}
              onChange={setRoomNumber}
              icon={Building2}
              placeholder="Select Classroom..."
            />

            {/* Day and Slot Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <CustomSelect
                label="Day of Week"
                options={DAYS_OF_WEEK.map(d => ({ label: d, value: d }))}
                value={day}
                onChange={setDay}
                icon={Calendar}
                placeholder="Select Day..."
              />

              <div>
                <label className="block text-[11px] font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider mb-1.5 flex items-center gap-1.5">
                  <Clock className="w-3.5 h-3.5 text-indigo-500" />
                  Time Period / Slot
                </label>
                <select
                  value={selectedSlotIndex}
                  onChange={(e) => setSelectedSlotIndex(e.target.value)}
                  className="w-full px-3 py-2.5 rounded-2xl bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-slate-900 dark:text-white text-xs font-semibold focus:outline-none focus:ring-2 focus:ring-indigo-500"
                >
                  {slotOptions.map((opt, idx) => (
                    <option key={idx} value={String(idx)}>
                      {opt.label}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            {/* Event Category Selector */}
            <CustomSelect
              label="Booking Category / Purpose Type"
              options={categories}
              value={category}
              onChange={setCategory}
              icon={Tag}
              placeholder="Select Category..."
            />

            {/* Purpose / Description */}
            <div>
              <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1.5 uppercase tracking-wider">
                Event Description & Requirement
              </label>
              <textarea
                rows={3}
                required
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="Explain the purpose of this booking (e.g. Extra lecture on Distributed Systems, ACM Society orientation, Hackathon mentoring session)..."
                className="w-full px-4 py-3 rounded-2xl bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-slate-900 dark:text-white text-xs font-medium focus:outline-none focus:ring-2 focus:ring-indigo-500 resize-none"
              />
            </div>

            {/* Requester Profile Preview */}
            <div className="p-3.5 rounded-2xl bg-slate-50 dark:bg-slate-900/60 border border-slate-200/80 dark:border-slate-800 text-[11px] text-slate-600 dark:text-slate-400 flex items-start gap-2.5">
              <Info className="w-4 h-4 text-indigo-500 shrink-0 mt-0.5" />
              <div>
                <span>Booking will be registered under </span>
                <strong className="text-slate-800 dark:text-slate-200">{user?.name}</strong>
                <span> ({user?.email} • {user?.role?.replace('_', ' ')})</span>.
              </div>
            </div>

            {/* Actions */}
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
                className="px-6 py-3 rounded-2xl bg-indigo-600 hover:bg-indigo-700 text-white font-extrabold text-xs shadow-lg shadow-indigo-500/25 transition-all hover:scale-[1.01] active:scale-[0.99] disabled:opacity-50 flex items-center gap-2"
              >
                {loading ? 'Submitting Request...' : 'Submit Booking Request'}
                <Send className="w-3.5 h-3.5" />
              </button>
            </div>
          </form>
        )}

      </div>
    </div>
  );
}
