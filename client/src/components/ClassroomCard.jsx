import React from 'react';
import { CheckCircle2, XCircle, Clock, BookOpen, User, Users, Calendar, ArrowRight, Wrench, AlertTriangle, ShieldCheck } from 'lucide-react';
import { formatTo12Hour } from '../utils/timeFormat';

export default function ClassroomCard({ classroom, onViewSchedule, onViewTicket }) {
  const isAvailable = classroom.status === 'AVAILABLE';
  const occ = classroom.currentOccupancy;
  const ticket = classroom.activeTicket;

  const hasActiveIssue = ticket && (ticket.status === 'UNDER_MAINTENANCE' || ticket.status === 'PENDING');

  return (
    <div className={`group relative rounded-2xl p-5 border flex flex-col justify-between transition-all duration-300 hover:shadow-xl hover:-translate-y-0.5 ${
      ticket && ticket.status === 'UNDER_MAINTENANCE'
        ? 'bg-white dark:bg-darkcard border-amber-300 dark:border-amber-800/80 hover:border-amber-500'
        : ticket && ticket.status === 'PENDING'
        ? 'bg-white dark:bg-darkcard border-yellow-300 dark:border-yellow-800/80 hover:border-yellow-500'
        : isAvailable
        ? 'bg-white dark:bg-darkcard border-slate-200/80 dark:border-darkborder hover:border-emerald-500/50 dark:hover:border-emerald-500/40'
        : 'bg-white dark:bg-darkcard border-slate-200/80 dark:border-darkborder hover:border-rose-500/50 dark:hover:border-rose-500/40'
    }`}>
      
      <div>
        {/* Top Header Row */}
        <div className="flex items-start justify-between gap-3 mb-3">
          <div>
            <div className="flex items-center gap-2">
              <h3 className="text-xl font-extrabold text-slate-900 dark:text-white tracking-tight">
                {classroom.roomNumber}
              </h3>
              <span className="text-[10px] font-semibold px-2.5 py-0.5 rounded-full bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 border border-slate-200 dark:border-slate-700">
                {classroom.block}
              </span>
            </div>
            <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5 capitalize">
              {classroom.roomType.toLowerCase()} Hall • Cap: {classroom.capacity || 60}
            </p>
          </div>

          {/* Occupancy Status Badge */}
          <span className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold tracking-wide uppercase shadow-sm shrink-0 ${
            isAvailable
              ? 'bg-emerald-50 text-emerald-700 border border-emerald-200 dark:bg-emerald-950/50 dark:text-emerald-300 dark:border-emerald-800/60'
              : 'bg-rose-50 text-rose-700 border border-rose-200 dark:bg-rose-950/50 dark:text-rose-300 dark:border-rose-800/60'
          }`}>
            {isAvailable ? (
              <>
                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 dark:text-emerald-400" />
                Available
              </>
            ) : (
              <>
                <XCircle className="w-3.5 h-3.5 text-rose-600 dark:text-rose-400" />
                Occupied
              </>
            )}
          </span>
        </div>

        {/* Dynamic Facility & Ticket Tag Banner Slot (Uniform structure for all cards) */}
        <div className="mb-3">
          {hasActiveIssue ? (
            <button
              onClick={() => onViewTicket && onViewTicket(ticket)}
              className={`w-full flex items-center justify-between p-2.5 rounded-xl border text-xs font-bold transition-all text-left cursor-pointer ${
                ticket.status === 'UNDER_MAINTENANCE'
                  ? 'bg-amber-50 text-amber-900 border-amber-300 hover:bg-amber-100 dark:bg-amber-950/60 dark:text-amber-200 dark:border-amber-800'
                  : 'bg-yellow-50 text-yellow-900 border-yellow-300 hover:bg-yellow-100 dark:bg-yellow-950/60 dark:text-yellow-200 dark:border-yellow-800'
              }`}
            >
              <div className="flex items-center gap-2 truncate">
                {ticket.status === 'UNDER_MAINTENANCE' ? (
                  <Wrench className="w-4 h-4 text-amber-600 shrink-0" />
                ) : (
                  <AlertTriangle className="w-4 h-4 text-yellow-600 shrink-0" />
                )}
                <span className="truncate">
                  {ticket.status === 'UNDER_MAINTENANCE' ? 'UNDER MAINTENANCE' : 'ISSUE REPORTED'} ({ticket.category})
                </span>
              </div>
              <span className="text-[10px] underline font-bold shrink-0 ml-1">View Issue →</span>
            </button>
          ) : (
            <div className="w-full flex items-center justify-between p-2.5 rounded-xl bg-slate-100/70 dark:bg-slate-900/40 border border-slate-200/60 dark:border-slate-800 text-[11px] font-semibold text-slate-500 dark:text-slate-400">
              <div className="flex items-center gap-2">
                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-500 shrink-0" />
                <span>NO ISSUES REPORTED</span>
              </div>
              <span className="text-[10px] text-slate-400 font-medium">Operational</span>
            </div>
          )}
        </div>

        {/* Main Content Info Area */}
        <div className="my-3 pt-3 border-t border-slate-100 dark:border-slate-800/70 min-h-[80px]">
          {isAvailable ? (
            <div className="flex flex-col justify-center h-full">
              <div className="inline-flex items-center gap-2 text-emerald-600 dark:text-emerald-400 font-medium text-xs">
                <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
                Free during this time slot
              </div>
              <p className="text-xs text-slate-500 dark:text-slate-400 mt-1.5">
                Available for immediate guest lecture, student event, or faculty study session.
              </p>
            </div>
          ) : occ ? (
            <div className="space-y-2">
              <div className="flex items-start justify-between gap-2">
                <div className="flex items-center gap-2">
                  <BookOpen className="w-4 h-4 text-thapar-600 dark:text-thapar-400 shrink-0" />
                  <span className="text-xs font-bold text-slate-800 dark:text-slate-200 line-clamp-1">
                    {occ.subject} ({occ.subjectCode})
                  </span>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-2 pt-1 text-[11px] text-slate-600 dark:text-slate-400">
                <div className="flex items-center gap-1.5">
                  <Users className="w-3.5 h-3.5 text-slate-400" />
                  <span>Batch: <strong className="text-slate-700 dark:text-slate-300">{occ.batch}</strong></span>
                </div>
                <div className="flex items-center gap-1.5">
                  <Clock className="w-3.5 h-3.5 text-slate-400" />
                  <span>{formatTo12Hour(occ.startTime)} - {formatTo12Hour(occ.endTime)}</span>
                </div>
              </div>

              {occ.faculty && (
                <div className="flex items-center gap-1.5 text-[11px] text-slate-500 dark:text-slate-400">
                  <User className="w-3.5 h-3.5 text-slate-400" />
                  <span className="truncate">{occ.faculty}</span>
                </div>
              )}
            </div>
          ) : (
            <p className="text-xs text-slate-400 italic">No detailed occupancy metadata.</p>
          )}
        </div>
      </div>

      {/* Footer Action Button */}
      <button
        onClick={() => onViewSchedule(classroom)}
        className="w-full mt-2 flex items-center justify-between px-3 py-2 rounded-xl text-xs font-semibold text-slate-700 dark:text-slate-200 bg-slate-100 dark:bg-slate-800 hover:bg-thapar-50 dark:hover:bg-thapar-950/40 hover:text-thapar-700 dark:hover:text-thapar-300 transition-colors"
      >
        <span className="flex items-center gap-1.5">
          <Calendar className="w-3.5 h-3.5" />
          Full Timetable Schedule
        </span>
        <ArrowRight className="w-3.5 h-3.5 transition-transform group-hover:translate-x-1" />
      </button>

    </div>
  );
}
