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
  CalendarCheck2,
  GraduationCap,
  LayoutGrid,
  KeyRound,
  BookOpenCheck,
  Calendar,
  Sparkles,
  X
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import ThemeToggle from './ThemeToggle';
import RaiseTicketModal from './RaiseTicketModal';
import AdminTicketPanelModal from './AdminTicketPanelModal';
import BookClassroomModal from './BookClassroomModal';
import MyBookingsModal from './MyBookingsModal';
import AdminBookingPanelModal from './AdminBookingPanelModal';
import ChangePasswordModal from './ChangePasswordModal';

export default function Navbar({ onRefreshData, bookModalInitialRoom, onClearBookInitialRoom }) {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [appsMenuOpen, setAppsMenuOpen] = useState(false);
  const [ticketModalOpen, setTicketModalOpen] = useState(false);
  const [adminPanelOpen, setAdminPanelOpen] = useState(false);
  const [bookModalOpen, setBookModalOpen] = useState(false);
  const [myBookingsOpen, setMyBookingsOpen] = useState(false);
  const [adminBookingsOpen, setAdminBookingsOpen] = useState(false);
  const [changePasswordOpen, setChangePasswordOpen] = useState(false);

  const isStudent = user?.role === 'STUDENT';
  const isAdmin = user?.role === 'ADMIN';
  const isFacultyOrOrg = !isStudent && !isAdmin;

  const getRoleInfo = () => {
    if (isStudent) {
      return {
        label: 'Student',
        Icon: GraduationCap,
        pillClass: 'bg-emerald-100 dark:bg-emerald-950/80 text-emerald-800 dark:text-emerald-300 border-emerald-200 dark:border-emerald-800'
      };
    }
    if (isAdmin) {
      return {
        label: 'Admin',
        Icon: ShieldCheck,
        pillClass: 'bg-rose-100 dark:bg-rose-950/80 text-rose-800 dark:text-rose-300 border-rose-200 dark:border-rose-800'
      };
    }
    return {
      label: 'Faculty / Organisation',
      Icon: User,
      pillClass: 'bg-indigo-100 dark:bg-indigo-950/80 text-indigo-800 dark:text-indigo-300 border-indigo-200 dark:border-indigo-800'
    };
  };

  const roleInfo = getRoleInfo();

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
                {/* Chrome-Style Apps Launcher Button (3x3 Grid) */}
                <div className="relative">
                  <button
                    onClick={() => {
                      setAppsMenuOpen(!appsMenuOpen);
                      setDropdownOpen(false);
                    }}
                    className={`p-2.5 rounded-2xl border transition-all duration-200 flex items-center justify-center ${
                      appsMenuOpen
                        ? 'bg-thapar-50 border-thapar-300 text-thapar-700 dark:bg-thapar-950/80 dark:border-thapar-700 dark:text-thapar-300 shadow-md ring-2 ring-thapar-500/20'
                        : 'border-slate-200/90 dark:border-darkborder bg-white dark:bg-darkcard text-slate-700 dark:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 shadow-sm'
                    }`}
                    title="CampusDesk Apps & Tools"
                  >
                    <LayoutGrid className="w-4.5 h-4.5" />
                  </button>

                  {/* Apps Launcher Floating Popover Window */}
                  {appsMenuOpen && (
                    <div
                      className="absolute right-0 mt-2.5 w-80 sm:w-84 rounded-3xl bg-white dark:bg-darkcard border border-slate-200 dark:border-darkborder shadow-2xl p-4.5 z-50 animate-in fade-in slide-in-from-top-2"
                      onMouseLeave={() => setAppsMenuOpen(false)}
                    >
                      {/* Header of Square Window */}
                      <div className="flex items-center justify-between pb-3 mb-3 border-b border-slate-100 dark:border-darkborder">
                        <div className="flex items-center gap-2">
                          <div className="w-6 h-6 rounded-lg bg-thapar-600 text-white flex items-center justify-center">
                            <School className="w-3.5 h-3.5" />
                          </div>
                          <div>
                            <h4 className="text-xs font-extrabold text-slate-900 dark:text-white leading-none">
                              CampusDesk Apps
                            </h4>
                            <p className="text-[10px] text-slate-400 mt-0.5">Quick Actions & Services</p>
                          </div>
                        </div>
                        <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full border ${roleInfo.pillClass}`}>
                          {roleInfo.label}
                        </span>
                      </div>

                      {/* Grid of App Tiles */}
                      <div className="grid grid-cols-2 gap-2.5">
                        
                        {/* FACULTY / ORGANISATION TILES */}
                        {isFacultyOrOrg && (
                          <>
                            <button
                              onClick={() => {
                                setAppsMenuOpen(false);
                                setBookModalOpen(true);
                              }}
                              className="flex flex-col items-start p-3 rounded-2xl bg-slate-50 dark:bg-slate-900/60 hover:bg-indigo-50/80 dark:hover:bg-indigo-950/50 border border-slate-200/80 dark:border-slate-800 hover:border-indigo-200 dark:hover:border-indigo-800 transition-all text-left group"
                            >
                              <div className="w-9 h-9 rounded-xl bg-indigo-100 dark:bg-indigo-950 text-indigo-600 dark:text-indigo-400 flex items-center justify-center mb-2 group-hover:scale-110 transition-transform shadow-sm">
                                <CalendarPlus className="w-5 h-5" />
                              </div>
                              <span className="text-xs font-extrabold text-slate-900 dark:text-white">Book Room</span>
                              <span className="text-[10px] text-slate-500 dark:text-slate-400">Request empty hall</span>
                            </button>

                            <button
                              onClick={() => {
                                setAppsMenuOpen(false);
                                setMyBookingsOpen(true);
                              }}
                              className="flex flex-col items-start p-3 rounded-2xl bg-slate-50 dark:bg-slate-900/60 hover:bg-emerald-50/80 dark:hover:bg-emerald-950/50 border border-slate-200/80 dark:border-slate-800 hover:border-emerald-200 dark:hover:border-emerald-800 transition-all text-left group"
                            >
                              <div className="w-9 h-9 rounded-xl bg-emerald-100 dark:bg-emerald-950 text-emerald-600 dark:text-emerald-400 flex items-center justify-center mb-2 group-hover:scale-110 transition-transform shadow-sm">
                                <CalendarCheck2 className="w-5 h-5" />
                              </div>
                              <span className="text-xs font-extrabold text-slate-900 dark:text-white">My Bookings</span>
                              <span className="text-[10px] text-slate-500 dark:text-slate-400">Track approval status</span>
                            </button>

                            <button
                              onClick={() => {
                                setAppsMenuOpen(false);
                                setTicketModalOpen(true);
                              }}
                              className="flex flex-col items-start p-3 rounded-2xl bg-slate-50 dark:bg-slate-900/60 hover:bg-amber-50/80 dark:hover:bg-amber-950/50 border border-slate-200/80 dark:border-slate-800 hover:border-amber-200 dark:hover:border-amber-800 transition-all text-left group"
                            >
                              <div className="w-9 h-9 rounded-xl bg-amber-100 dark:bg-amber-950 text-amber-600 dark:text-amber-400 flex items-center justify-center mb-2 group-hover:scale-110 transition-transform shadow-sm">
                                <Wrench className="w-5 h-5" />
                              </div>
                              <span className="text-xs font-extrabold text-slate-900 dark:text-white">Report Issue</span>
                              <span className="text-[10px] text-slate-500 dark:text-slate-400">Facility maintenance</span>
                            </button>

                            <button
                              onClick={() => {
                                setAppsMenuOpen(false);
                                setChangePasswordOpen(true);
                              }}
                              className="flex flex-col items-start p-3 rounded-2xl bg-slate-50 dark:bg-slate-900/60 hover:bg-sky-50/80 dark:hover:bg-sky-950/50 border border-slate-200/80 dark:border-slate-800 hover:border-sky-200 dark:hover:border-sky-800 transition-all text-left group"
                            >
                              <div className="w-9 h-9 rounded-xl bg-sky-100 dark:bg-sky-950 text-sky-600 dark:text-sky-400 flex items-center justify-center mb-2 group-hover:scale-110 transition-transform shadow-sm">
                                <KeyRound className="w-5 h-5" />
                              </div>
                              <span className="text-xs font-extrabold text-slate-900 dark:text-white">Password</span>
                              <span className="text-[10px] text-slate-500 dark:text-slate-400">Change credentials</span>
                            </button>
                          </>
                        )}

                        {/* ADMIN TILES */}
                        {isAdmin && (
                          <>
                            <button
                              onClick={() => {
                                setAppsMenuOpen(false);
                                setAdminBookingsOpen(true);
                              }}
                              className="flex flex-col items-start p-3 rounded-2xl bg-slate-50 dark:bg-slate-900/60 hover:bg-indigo-50/80 dark:hover:bg-indigo-950/50 border border-slate-200/80 dark:border-slate-800 hover:border-indigo-200 dark:hover:border-indigo-800 transition-all text-left group"
                            >
                              <div className="w-9 h-9 rounded-xl bg-indigo-100 dark:bg-indigo-950 text-indigo-600 dark:text-indigo-400 flex items-center justify-center mb-2 group-hover:scale-110 transition-transform shadow-sm">
                                <CalendarCheck2 className="w-5 h-5" />
                              </div>
                              <span className="text-xs font-extrabold text-slate-900 dark:text-white">Approvals</span>
                              <span className="text-[10px] text-slate-500 dark:text-slate-400">Review room bookings</span>
                            </button>

                            <button
                              onClick={() => {
                                setAppsMenuOpen(false);
                                setAdminPanelOpen(true);
                              }}
                              className="flex flex-col items-start p-3 rounded-2xl bg-slate-50 dark:bg-slate-900/60 hover:bg-amber-50/80 dark:hover:bg-amber-950/50 border border-slate-200/80 dark:border-slate-800 hover:border-amber-200 dark:hover:border-amber-800 transition-all text-left group"
                            >
                              <div className="w-9 h-9 rounded-xl bg-amber-100 dark:bg-amber-950 text-amber-600 dark:text-amber-400 flex items-center justify-center mb-2 group-hover:scale-110 transition-transform shadow-sm">
                                <ShieldCheck className="w-5 h-5" />
                              </div>
                              <span className="text-xs font-extrabold text-slate-900 dark:text-white">Maintenance</span>
                              <span className="text-[10px] text-slate-500 dark:text-slate-400">Resolve tickets</span>
                            </button>

                            <button
                              onClick={() => {
                                setAppsMenuOpen(false);
                                setBookModalOpen(true);
                              }}
                              className="flex flex-col items-start p-3 rounded-2xl bg-slate-50 dark:bg-slate-900/60 hover:bg-blue-50/80 dark:hover:bg-blue-950/50 border border-slate-200/80 dark:border-slate-800 hover:border-blue-200 dark:hover:border-blue-800 transition-all text-left group"
                            >
                              <div className="w-9 h-9 rounded-xl bg-blue-100 dark:bg-blue-950 text-blue-600 dark:text-blue-400 flex items-center justify-center mb-2 group-hover:scale-110 transition-transform shadow-sm">
                                <CalendarPlus className="w-5 h-5" />
                              </div>
                              <span className="text-xs font-extrabold text-slate-900 dark:text-white">Book Room</span>
                              <span className="text-[10px] text-slate-500 dark:text-slate-400">Direct booking</span>
                            </button>

                            <button
                              onClick={() => {
                                setAppsMenuOpen(false);
                                setMyBookingsOpen(true);
                              }}
                              className="flex flex-col items-start p-3 rounded-2xl bg-slate-50 dark:bg-slate-900/60 hover:bg-emerald-50/80 dark:hover:bg-emerald-950/50 border border-slate-200/80 dark:border-slate-800 hover:border-emerald-200 dark:hover:border-emerald-800 transition-all text-left group"
                            >
                              <div className="w-9 h-9 rounded-xl bg-emerald-100 dark:bg-emerald-950 text-emerald-600 dark:text-emerald-400 flex items-center justify-center mb-2 group-hover:scale-110 transition-transform shadow-sm">
                                <Calendar className="w-5 h-5" />
                              </div>
                              <span className="text-xs font-extrabold text-slate-900 dark:text-white">All Bookings</span>
                              <span className="text-[10px] text-slate-500 dark:text-slate-400">Reservation list</span>
                            </button>

                            <button
                              onClick={() => {
                                setAppsMenuOpen(false);
                                setChangePasswordOpen(true);
                              }}
                              className="col-span-2 flex items-center justify-between p-3 rounded-2xl bg-slate-50 dark:bg-slate-900/60 hover:bg-sky-50/80 dark:hover:bg-sky-950/50 border border-slate-200/80 dark:border-slate-800 hover:border-sky-200 dark:hover:border-sky-800 transition-all text-left group"
                            >
                              <div className="flex items-center gap-2.5">
                                <div className="w-8 h-8 rounded-xl bg-sky-100 dark:bg-sky-950 text-sky-600 dark:text-sky-400 flex items-center justify-center group-hover:scale-110 transition-transform shadow-sm">
                                  <KeyRound className="w-4 h-4" />
                                </div>
                                <div>
                                  <span className="text-xs font-extrabold text-slate-900 dark:text-white block">Security & Password</span>
                                  <span className="text-[10px] text-slate-500 dark:text-slate-400">Change admin password</span>
                                </div>
                              </div>
                            </button>
                          </>
                        )}

                        {/* STUDENT TILES */}
                        {isStudent && (
                          <>
                            <button
                              onClick={() => {
                                setAppsMenuOpen(false);
                                navigate('/dashboard');
                              }}
                              className="flex flex-col items-start p-3 rounded-2xl bg-slate-50 dark:bg-slate-900/60 hover:bg-emerald-50/80 dark:hover:bg-emerald-950/50 border border-slate-200/80 dark:border-slate-800 hover:border-emerald-200 dark:hover:border-emerald-800 transition-all text-left group"
                            >
                              <div className="w-9 h-9 rounded-xl bg-emerald-100 dark:bg-emerald-950 text-emerald-600 dark:text-emerald-400 flex items-center justify-center mb-2 group-hover:scale-110 transition-transform shadow-sm">
                                <BookOpenCheck className="w-5 h-5" />
                              </div>
                              <span className="text-xs font-extrabold text-slate-900 dark:text-white">Vacant Rooms</span>
                              <span className="text-[10px] text-slate-500 dark:text-slate-400">Find study spots</span>
                            </button>

                            <button
                              onClick={() => {
                                setAppsMenuOpen(false);
                                navigate('/dashboard');
                              }}
                              className="flex flex-col items-start p-3 rounded-2xl bg-slate-50 dark:bg-slate-900/60 hover:bg-blue-50/80 dark:hover:bg-blue-950/50 border border-slate-200/80 dark:border-slate-800 hover:border-blue-200 dark:hover:border-blue-800 transition-all text-left group"
                            >
                              <div className="w-9 h-9 rounded-xl bg-blue-100 dark:bg-blue-950 text-blue-600 dark:text-blue-400 flex items-center justify-center mb-2 group-hover:scale-110 transition-transform shadow-sm">
                                <Calendar className="w-5 h-5" />
                              </div>
                              <span className="text-xs font-extrabold text-slate-900 dark:text-white">Timetables</span>
                              <span className="text-[10px] text-slate-500 dark:text-slate-400">Weekly schedules</span>
                            </button>

                            <button
                              onClick={() => {
                                setAppsMenuOpen(false);
                                setChangePasswordOpen(true);
                              }}
                              className="col-span-2 flex items-center justify-between p-3 rounded-2xl bg-slate-50 dark:bg-slate-900/60 hover:bg-sky-50/80 dark:hover:bg-sky-950/50 border border-slate-200/80 dark:border-slate-800 hover:border-sky-200 dark:hover:border-sky-800 transition-all text-left group"
                            >
                              <div className="flex items-center gap-2.5">
                                <div className="w-8 h-8 rounded-xl bg-sky-100 dark:bg-sky-950 text-sky-600 dark:text-sky-400 flex items-center justify-center group-hover:scale-110 transition-transform shadow-sm">
                                  <KeyRound className="w-4 h-4" />
                                </div>
                                <div>
                                  <span className="text-xs font-extrabold text-slate-900 dark:text-white block">Change Password</span>
                                  <span className="text-[10px] text-slate-500 dark:text-slate-400">Account security settings</span>
                                </div>
                              </div>
                            </button>
                          </>
                        )}

                      </div>
                    </div>
                  )}
                </div>

                {/* Profile Dropdown */}
                <div className="relative">
                  <button
                    onClick={() => {
                      setDropdownOpen(!dropdownOpen);
                      setAppsMenuOpen(false);
                    }}
                    className="flex items-center gap-2 px-2.5 py-1.5 rounded-xl border border-slate-200 dark:border-darkborder hover:bg-slate-100 dark:hover:bg-darkcard transition-colors focus:outline-none"
                  >
                    <div className="w-8 h-8 rounded-lg bg-slate-100 dark:bg-slate-800 text-thapar-600 dark:text-thapar-400 flex items-center justify-center font-bold text-sm">
                      {user.name ? user.name.charAt(0).toUpperCase() : 'U'}
                    </div>
                    <div className="text-left hidden sm:block">
                      <p className="text-xs font-semibold text-slate-800 dark:text-slate-200 leading-none">{user.name}</p>
                      <p className="text-[10px] text-slate-500 dark:text-slate-400 capitalize mt-0.5">{roleInfo.label}</p>
                    </div>
                    <ChevronDown className="w-4 h-4 text-slate-400" />
                  </button>

                  {dropdownOpen && (
                    <div 
                      className="absolute right-0 mt-2 w-60 rounded-2xl bg-white dark:bg-darkcard border border-slate-200 dark:border-darkborder shadow-xl py-2 z-50 animate-in fade-in slide-in-from-top-2"
                      onMouseLeave={() => setDropdownOpen(false)}
                    >
                      <div className="px-4 py-2.5 border-b border-slate-100 dark:border-darkborder">
                        <p className="text-xs font-bold text-slate-900 dark:text-white truncate">{user.name}</p>
                        <p className="text-[11px] text-slate-500 dark:text-slate-400 truncate">{user.email}</p>
                        <span className={`mt-1.5 inline-flex items-center gap-1 text-[10px] font-bold px-2.5 py-0.5 rounded-full border ${roleInfo.pillClass}`}>
                          <roleInfo.Icon className="w-3 h-3" />
                          {roleInfo.label}
                        </span>
                      </div>

                      {/* Change Password in Dropdown */}
                      <button
                        onClick={() => {
                          setDropdownOpen(false);
                          setChangePasswordOpen(true);
                        }}
                        className="w-full flex items-center gap-2.5 px-4 py-2 text-xs text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800/60 transition-colors text-left"
                      >
                        <KeyRound className="w-4 h-4 text-sky-500" />
                        Change Password
                      </button>

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

      {/* Change Password Modal */}
      {changePasswordOpen && (
        <ChangePasswordModal
          onClose={() => setChangePasswordOpen(false)}
        />
      )}
    </>
  );
}
