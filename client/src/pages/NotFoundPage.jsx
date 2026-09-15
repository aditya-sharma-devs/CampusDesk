import React from 'react';
import { Link } from 'react-router-dom';
import { School, ArrowLeft } from 'lucide-react';

export default function NotFoundPage() {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-slate-50 dark:bg-darkbg px-4 text-center">
      <div className="w-16 h-16 rounded-3xl bg-thapar-100 dark:bg-thapar-950 text-thapar-600 dark:text-thapar-400 flex items-center justify-center mb-6">
        <School className="w-8 h-8" />
      </div>
      <h1 className="text-4xl font-black text-slate-900 dark:text-white tracking-tight">404</h1>
      <p className="text-sm text-slate-500 dark:text-slate-400 mt-2 max-w-sm">
        The classroom page or URL you requested could not be found.
      </p>
      <Link
        to="/dashboard"
        className="mt-6 px-6 py-3 rounded-2xl bg-thapar-600 hover:bg-thapar-700 text-white font-extrabold text-xs flex items-center gap-2 shadow-lg shadow-thapar-500/20"
      >
        <ArrowLeft className="w-4 h-4" />
        Return to Dashboard
      </Link>
    </div>
  );
}
