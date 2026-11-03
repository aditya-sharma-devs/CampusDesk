import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { 
  School, 
  LogOut, 
  User, 
  ChevronDown, 
  ShieldCheck, 
  Wrench, 
  CalendarPlus, 
  CalendarCheck2 
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import ThemeToggle from './ThemeToggle';
import RaiseTicketModal from './RaiseTicketModal';
import AdminTicketPanelModal from './AdminTicketPanelModal';
import BookClassroomModal from './BookClassroomModal';
import MyBookingsModal from './MyBookingsModal';
import AdminBookingPanelModal from './AdminBookingPanelModal';

export default function Navbar({ onRefreshData, bookModalInitialRoom, onClearBookInitialRoom }) {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [ticketModalOpen, setTicketModalOpen] = useState(false);
  const [adminPanelOpen, setAdminPanelOpen] = useState(false);
  const [bookModalOpen, setBookModalOpen] = useState(false);
  const [myBookingsOpen, setMyBookingsOpen] = useState(false);
  const [adminBookingsOpen, setAdminBookingsOpen] = useState(false);

  // If a room was selected from a card to book
  const activeBookModalOpen = bookModalOpen || Boolean(bookModalInitialRoom);

  const handleCloseBookModal = () => {
    setBookModalOpen(false);
    if (onClearBookInitialRoom) onClearBookInitialRoom();
  };

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
                  CampusDesk
                </span>
              </div>
              <p className="text-[10px] text-slate-500 dark:text-slate-400 font-medium tracking-wide">Availability & Scheduling</p>
            </div>
          </Link>

          {/* Navigation Actions */}
          <div className="flex items-center gap-2.5">
            <ThemeToggle />

            {user ? (
              <>
                {/* Book Room Button */}
                <button
                  onClick={() => setBookModalOpen(true)}
                  className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-bold text-indigo-700 dark:text-indigo-300 bg-indigo-50 dark:bg-indigo-950/60 border border-indigo-200 dark:border-indigo-800 hover:bg-indigo-100 dark:hover:bg-indigo-900/50 transition-colors shadow-sm"
                  title="Request an empty classroom booking"
                >
                  <CalendarPlus className="w-3.5 h-3.5 text-indigo-600 dark:text-indigo-400" />
                  <span className="hidden sm:inline">Book Room</span>
                </button>

                {/* My Bookings Button */}
                <button
                  onClick={() => setMyBookingsOpen(true)}
                  className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-bold text-slate-700 dark:text-slate-200 bg-white dark:bg-darkcard border border-slate-200 dark:border-darkborder hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors shadow-sm"
                  title="View my booking requests and approval status"
                >
                  <CalendarCheck2 className="w-3.5 h-3.5 text-slate-500 dark:text-slate-400" />
                  <span className="hidden sm:inline">My Bookings</span>
                </button>

                {/* Report Issue Button - For Faculty & Org Heads */}
                {user.role !== 'ADMIN' && (
                  <button
                    onClick={() => setTicketModalOpen(true)}
                    className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-bold text-amber-800 dark:text-amber-300 bg-amber-50 dark:bg-amber-950/60 border border-amber-200 dark:border-amber-800 hover:bg-amber-100 dark:hover:bg-amber-900/50 transition-colors shadow-sm"
                    title="Report classroom maintenance issue"
                  >
                    <Wrench className="w-3.5 h-3.5 text-amber-600 dark:text-amber-400" />
                    <span className="hidden md:inline">Report Issue</span>
                  </button>
                )}

                {/* Admin Booking Approvals Button */}
                {user.role === 'ADMIN' && (
                  <button
                    onClick={() => setAdminBookingsOpen(true)}
                    className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-bold text-indigo-800 dark:text-indigo-200 bg-indigo-50 dark:bg-indigo-950/60 border border-indigo-200 dark:border-indigo-800 hover:bg-indigo-100 dark:hover:bg-indigo-900/50 transition-colors shadow-sm"
                    title="Approve or Reject Classroom Bookings"
                  >
                    <CalendarCheck2 className="w-3.5 h-3.5 text-indigo-600" />
                    <span className="hidden lg:inline">Booking Approvals</span>
                  </button>
                )}

                {/* Admin Maintenance Panel Button */}
                {user.role === 'ADMIN' && (
                  <button
                    onClick={() => setAdminPanelOpen(true)}
                    className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-bold text-thapar-800 dark:text-thapar-200 bg-thapar-50 dark:bg-thapar-950/60 border border-thapar-200 dark:border-thapar-800 hover:bg-thapar-100 dark:hover:bg-thapar-900/50 transition-colors shadow-sm"
                    title="Admin Complaint Governance"
                  >
                    <ShieldCheck className="w-3.5 h-3.5 text-thapar-600" />
                    <span className="hidden md:inline">Maintenance Panel</span>
                  </button>
                )}

                {/* Profile Dropdown */}
                <div className="relative">
                  <button
                    onClick={() => setDropdownOpen(!dropdownOpen)}
                    className="flex items-center gap-2 px-2.5 py-1.5 rounded-xl border border-slate-200 dark:border-darkborder hover:bg-slate-100 dark:hover:bg-darkcard transition-colors focus:outline-none"
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
                      className="absolute right-0 mt-2 w-60 rounded-2xl bg-white dark:bg-darkcard border border-slate-200 dark:border-darkborder shadow-xl py-2 z-50 animate-in fade-in slide-in-from-top-2"
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

                      <button
                        onClick={() => {
                          setDropdownOpen(false);
                          setBookModalOpen(true);
                        }}
                        className="w-full flex items-center gap-2.5 px-4 py-2 text-xs text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800/60 transition-colors text-left"
                      >
                        <CalendarPlus className="w-4 h-4 text-indigo-500" />
                        Book Classroom
                      </button>

                      <button
                        onClick={() => {
                          setDropdownOpen(false);
                          setMyBookingsOpen(true);
                        }}
                        className="w-full flex items-center gap-2.5 px-4 py-2 text-xs text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800/60 transition-colors text-left"
                      >
                        <CalendarCheck2 className="w-4 h-4 text-indigo-500" />
                        My Bookings
                      </button>

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
                        <>
                          <button
                            onClick={() => {
                              setDropdownOpen(false);
                              setAdminBookingsOpen(true);
                            }}
                            className="w-full flex items-center gap-2.5 px-4 py-2 text-xs text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800/60 transition-colors text-left"
                          >
                            <CalendarCheck2 className="w-4 h-4 text-indigo-600" />
                            Booking Approvals
                          </button>
                          <button
                            onClick={() => {
                              setDropdownOpen(false);
                              setAdminPanelOpen(true);
                            }}
                            className="w-full flex items-center gap-2.5 px-4 py-2 text-xs text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800/60 transition-colors text-left"
                          >
                            <ShieldCheck className="w-4 h-4 text-thapar-500" />
                            Maintenance Panel
                          </button>
                        </>
                      )}

                      <div className="my-1 border-t border-slate-100 dark:border-darkborder" />

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

      {/* Book Classroom Modal */}
      {activeBookModalOpen && (
        <BookClassroomModal
          initialRoomNumber={bookModalInitialRoom || ''}
          onClose={handleCloseBookModal}
          onBookingCreated={() => {
            if (onRefreshData) onRefreshData();
          }}
          onOpenMyBookings={() => {
            handleCloseBookModal();
            setMyBookingsOpen(true);
          }}
        />
      )}

      {/* My Bookings Modal */}
      {myBookingsOpen && (
        <MyBookingsModal
          onClose={() => setMyBookingsOpen(false)}
          onBookingsChanged={() => {
            if (onRefreshData) onRefreshData();
          }}
        />
      )}

      {/* Admin Booking Approvals Panel */}
      {adminBookingsOpen && (
        <AdminBookingPanelModal
          onClose={() => setAdminBookingsOpen(false)}
          onBookingUpdated={() => {
            if (onRefreshData) onRefreshData();
          }}
        />
      )}

      {/* Raise Ticket Modal */}
      {ticketModalOpen && (
        <RaiseTicketModal
          onClose={() => setTicketModalOpen(false)}
          onSuccess={() => {
            if (onRefreshData) onRefreshData();
          }}
        />
      )}

      {/* Admin Maintenance Panel Modal */}
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
