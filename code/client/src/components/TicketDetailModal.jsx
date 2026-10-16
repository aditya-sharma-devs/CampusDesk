import React from 'react';
import { X, Wrench, AlertTriangle, CheckCircle2, Clock, User, ShieldCheck } from 'lucide-react';

export default function TicketDetailModal({ ticket, onClose }) {
  if (!ticket) return null;

  const isMaintenance = ticket.status === 'UNDER_MAINTENANCE';

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="relative w-full max-w-lg p-6 sm:p-8 rounded-3xl bg-white dark:bg-darkcard border border-slate-200 dark:border-darkborder shadow-2xl space-y-6">
        
        {/* Header */}
        <div className="flex items-center justify-between pb-4 border-b border-slate-100 dark:border-darkborder">
          <div className="flex items-center gap-3">
            <div className={`w-11 h-11 rounded-2xl flex items-center justify-center font-bold ${
              isMaintenance
                ? 'bg-amber-100 dark:bg-amber-950/80 text-amber-700 dark:text-amber-300'
                : 'bg-yellow-100 dark:bg-yellow-950/80 text-yellow-700 dark:text-yellow-300'
            }`}>
              {isMaintenance ? <Wrench className="w-6 h-6" /> : <AlertTriangle className="w-6 h-6" />}
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="text-xl font-black text-slate-900 dark:text-white">
                  {ticket.roomNumber} Issue Report
                </h3>
              </div>
              <p className="text-xs font-mono font-bold text-thapar-600 dark:text-thapar-400">
                Ticket ID: {ticket.ticketId}
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

        {/* Ticket Details Body */}
        <div className="space-y-4 text-xs">
          
          {/* Status Banner */}
          <div className={`p-4 rounded-2xl border flex items-center gap-3 ${
            isMaintenance
              ? 'bg-amber-50 dark:bg-amber-950/40 border-amber-200 dark:border-amber-800 text-amber-900 dark:text-amber-200'
              : 'bg-yellow-50 dark:bg-yellow-950/40 border-yellow-200 dark:border-yellow-800 text-yellow-900 dark:text-yellow-200'
          }`}>
            {isMaintenance ? <Wrench className="w-5 h-5 shrink-0 text-amber-600" /> : <Clock className="w-5 h-5 shrink-0 text-yellow-600" />}
            <div>
              <p className="font-extrabold uppercase tracking-wide">
                Status: {isMaintenance ? 'Under Maintenance' : 'Issue Reported (Not Reviewed Yet)'}
              </p>
              <p className="text-[11px] opacity-90 mt-0.5">
                {isMaintenance
                  ? 'Academic admin has marked this classroom under active facility repair.'
                  : 'Complaint logged. Awaiting academic admin review.'}
              </p>
            </div>
          </div>

          <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-900/60 border border-slate-200/80 dark:border-slate-800 space-y-3">
            <div>
              <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider block mb-1">
                Category
              </span>
              <p className="font-bold text-slate-800 dark:text-slate-200 text-sm">
                {ticket.category}
              </p>
            </div>

            <div>
              <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider block mb-1">
                Problem Description
              </span>
              <p className="font-medium text-slate-700 dark:text-slate-300 leading-relaxed bg-white dark:bg-darkcard p-3 rounded-xl border border-slate-200/60 dark:border-slate-800">
                "{ticket.description}"
              </p>
            </div>

            {ticket.reportedBy && (
              <div className="pt-2 border-t border-slate-200/60 dark:border-slate-800 flex items-center justify-between text-[11px] text-slate-500 dark:text-slate-400">
                <span>Reported by: <strong className="text-slate-700 dark:text-slate-300">{ticket.reportedBy.name}</strong></span>
                <span>{new Date(ticket.createdAt).toLocaleDateString()}</span>
              </div>
            )}
          </div>

        </div>

        {/* Footer */}
        <div className="p-4 bg-slate-50 dark:bg-slate-900/50 border-t border-slate-100 dark:border-darkborder flex items-center justify-end">
          <button
            onClick={onClose}
            className="px-5 py-2.5 rounded-xl text-xs font-bold text-slate-700 dark:text-slate-200 bg-white dark:bg-darkcard border border-slate-200 dark:border-darkborder hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
          >
            Close Details
          </button>
        </div>

      </div>
    </div>
  );
}
