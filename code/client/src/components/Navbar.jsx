import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { School, LogOut, User, Sparkles, ChevronDown, ShieldCheck, Wrench } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import ThemeToggle from './ThemeToggle';
import RaiseTicketModal from './RaiseTicketModal';
import AdminTicketPanelModal from './AdminTicketPanelModal';

export default function Navbar({ onRefreshData }) {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [ticketModalOpen, setTicketModalOpen] = useState(false);
  const [adminPanelOpen, setAdminPanelOpen] = useState(false);

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <>
      <header className="sticky top-0 z-40 backdrop-blur-md bg-white/80 dark:bg-darkbg/80 border-b border-slate-200/80 dark:border-darkborder transition-colors">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          
          {/* Brand Logo */}
          <Link to={user ? '/dashboard' : '/'} className="flex items-center gap-3 group">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-thapar-600 to-thapar-500 text-white flex items-center justify-center shadow-md shadow-thapar-500/20 group-hover:scale-105 transition-transform duration-200">
              <School className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="font-bold text-lg text-slate-900 dark:text-white tracking-tight">Thapar</span>
                <span className="text-xs font-semibold px-2 py-0.5 rounded-md bg-thapar-100 text-thapar-700 dark:bg-thapar-900/60 dark:text-thapar-300 border border-thapar-200 dark:border-thapar-700/50">
                  Classrooms
                </span>
              </div>
              <p className="text-[10px] text-slate-500 dark:text-slate-400 font-medium tracking-wide">Availability Platform</p>
            </div>
          </Link>

          {/* Navigation Actions */}
          <div className="flex items-center gap-3">
            <ThemeToggle />

            {user ? (
              <>
                {/* Raise Ticket Button - ONLY for Teacher & Organisation Head (Hidden for Admin) */}
                {user.role !== 'ADMIN' && (
                  <button
                    onClick={() => setTicketModalOpen(true)}
                    className="flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl text-xs font-bold text-amber-800 dark:text-amber-300 bg-amber-50 dark:bg-amber-950/60 border border-amber-200 dark:border-amber-800 hover:bg-amber-100 dark:hover:bg-amber-900/50 transition-colors shadow-sm"
                    title="Report classroom maintenance issue or inconvenience"
                  >
                    <Wrench className="w-3.5 h-3.5 text-amber-600 dark:text-amber-400" />
                    <span>Report Issue</span>
                  </button>
                )}

                {/* Admin Ticket Governance Button for Admin Role */}
                {user.role === 'ADMIN' && (
                  <button
                    onClick={() => setAdminPanelOpen(true)}
                    className="flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl text-xs font-bold text-thapar-800 dark:text-thapar-200 bg-thapar-50 dark:bg-thapar-950/60 border border-thapar-200 dark:border-thapar-800 hover:bg-thapar-100 dark:hover:bg-thapar-900/50 transition-colors shadow-sm"
                  >
                    <ShieldCheck className="w-3.5 h-3.5 text-thapar-600" />
                    <span>Admin Panel</span>
                  </button>
                )}

                {/* Profile Dropdown */}
                <div className="relative">
                  <button
                    onClick={() => setDropdownOpen(!dropdownOpen)}
                    className="flex items-center gap-2.5 px-3 py-1.5 rounded-xl border border-slate-200 dark:border-darkborder hover:bg-slate-100 dark:hover:bg-darkcard transition-colors focus:outline-none"
                  >
                    <div className="w-8 h-8 rounded-lg bg-slate-100 dark:bg-slate-800 text-thapar-600 dark:text-thapar-400 flex items-center justify-center font-bold text-sm">
                      {user.name ? user.name.charAt(0).toUpperCase() : 'U'}
                    </div>
                    <div className="text-left hidden sm:block">
                      <p className="text-xs font-semibold text-slate-800 dark:text-slate-200 leading-none">{user.name}</p>
                      <p className="text-[10px] text-slate-500 dark:text-slate-400 capitalize mt-0.5">{user.role.replace('_', ' ')}</p>
                    </div>
                    <ChevronDown className="w-4 h-4 text-slate-400" />
                  </button>

                  {dropdownOpen && (
                    <div 
                      className="absolute right-0 mt-2 w-56 rounded-2xl bg-white dark:bg-darkcard border border-slate-200 dark:border-darkborder shadow-xl py-2 z-50 animate-in fade-in slide-in-from-top-2"
                      onMouseLeave={() => setDropdownOpen(false)}
                    >
                      <div className="px-4 py-2 border-b border-slate-100 dark:border-darkborder">
                        <p className="text-xs font-semibold text-slate-900 dark:text-white truncate">{user.name}</p>
                        <p className="text-[11px] text-slate-500 dark:text-slate-400 truncate">{user.email}</p>
                        <span className="mt-1 inline-flex items-center gap-1 text-[10px] font-medium px-2 py-0.5 rounded-full bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300">
                          <ShieldCheck className="w-3 h-3 text-thapar-500" />
                          {user.role}
                        </span>
                      </div>

                      {user.role !== 'ADMIN' && (
                        <button
                          onClick={() => {
                            setDropdownOpen(false);
                            setTicketModalOpen(true);
                          }}
                          className="w-full flex items-center gap-2.5 px-4 py-2 text-xs text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800/60 transition-colors text-left"
                        >
                          <Wrench className="w-4 h-4 text-amber-500" />
                          Report Issue
                        </button>
                      )}

                      {user.role === 'ADMIN' && (
                        <button
                          onClick={() => {
                            setDropdownOpen(false);
                            setAdminPanelOpen(true);
                          }}
                          className="w-full flex items-center gap-2.5 px-4 py-2 text-xs text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800/60 transition-colors text-left"
                        >
                          <ShieldCheck className="w-4 h-4 text-thapar-500" />
                          Admin Ticket Panel
                        </button>
                      )}

                      <button
                        onClick={handleLogout}
                        className="w-full flex items-center gap-2.5 px-4 py-2 text-xs text-rose-600 dark:text-rose-400 hover:bg-rose-50 dark:hover:bg-rose-950/30 transition-colors text-left"
                      >
                        <LogOut className="w-4 h-4" />
                        Logout
                      </button>
                    </div>
                  )}
                </div>
              </>
            ) : (
              <div className="flex items-center gap-2">
                <Link
                  to="/login"
                  className="px-4 py-2 rounded-xl text-xs font-semibold text-slate-700 dark:text-slate-200 hover:bg-slate-100 dark:hover:bg-darkcard transition-colors"
                >
                  Sign In
                </Link>
                <Link
                  to="/signup"
                  className="px-4 py-2 rounded-xl text-xs font-semibold text-white bg-thapar-600 hover:bg-thapar-700 shadow-md shadow-thapar-500/20 transition-all hover:scale-[1.02] active:scale-[0.98]"
                >
                  Get Started
                </Link>
              </div>
            )}
          </div>
        </div>
      </header>

      {/* Raise Ticket Modal */}
      {ticketModalOpen && (
        <RaiseTicketModal
          onClose={() => setTicketModalOpen(false)}
          onSuccess={() => {
            if (onRefreshData) onRefreshData();
          }}
        />
      )}

      {/* Admin Panel Modal */}
      {adminPanelOpen && (
        <AdminTicketPanelModal
          onClose={() => setAdminPanelOpen(false)}
          onTicketUpdated={() => {
            if (onRefreshData) onRefreshData();
          }}
        />
      )}
    </>
  );
}
