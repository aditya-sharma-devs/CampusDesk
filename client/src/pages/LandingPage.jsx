import React from 'react';
import { Link } from 'react-router-dom';
import { 
  School, 
  Search, 
  Clock, 
  Layers, 
  ShieldCheck, 
  Sparkles, 
  ArrowRight, 
  CheckCircle2, 
  Calendar, 
  BookOpen, 
  Users,
  Wrench,
  ArrowDown,
  Building2,
  Check,
  Zap,
  MessageSquare,
  Shield,
  Sliders,
  ChevronRight
} from 'lucide-react';
import Navbar from '../components/Navbar';

export default function LandingPage() {
  // Smooth scroll handler for hero CTA button
  const scrollToPreview = () => {
    const previewElement = document.getElementById('preview-section');
    if (previewElement) {
      previewElement.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-slate-50 dark:bg-darkbg text-slate-900 dark:text-slate-100 transition-colors selection:bg-thapar-500 selection:text-white">
      <Navbar />

      {/* Hero Section */}
      <section className="relative overflow-hidden pt-12 pb-20 sm:pt-24 sm:pb-32">
        {/* Glow ambient background */}
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full max-w-7xl h-[480px] bg-gradient-to-b from-thapar-500/15 via-indigo-500/10 to-transparent blur-3xl -z-10 pointer-events-none"></div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          
          {/* Institution Badge */}
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-thapar-100 dark:bg-thapar-950/80 border border-thapar-200 dark:border-thapar-800 text-thapar-700 dark:text-thapar-300 text-xs font-bold mb-6 shadow-sm animate-in fade-in slide-in-from-bottom-3 duration-500">
            <Sparkles className="w-4 h-4 text-thapar-500" />
            Thapar Institute of Engineering & Technology
          </div>

          {/* Headline */}
          <h1 className="text-4xl sm:text-6xl lg:text-7xl font-black text-slate-900 dark:text-white tracking-tight leading-[1.1] max-w-5xl mx-auto">
            Find Available Classrooms in Seconds,{' '}
            <span className="bg-gradient-to-r from-thapar-600 via-thapar-500 to-indigo-500 bg-clip-text text-transparent">
              Not Hours.
            </span>
          </h1>

          <p className="mt-6 text-base sm:text-lg text-slate-600 dark:text-slate-300 max-w-3xl mx-auto leading-relaxed font-medium">
            Eliminate manual timetable checking. Instantly locate empty lecture halls across <strong>T Block, LT Block, F Block, E Block, L Block, and LP Block</strong> for guest lectures, student events, and faculty sessions.
          </p>

          {/* Hero Action Buttons */}
          <div className="mt-10 flex flex-col sm:flex-row items-center justify-center gap-4">
            {/* Primary Action Button: Smooth scroll down to live preview */}
            <button
              onClick={scrollToPreview}
              className="w-full sm:w-auto px-8 py-4 rounded-2xl text-sm font-extrabold text-white bg-thapar-600 hover:bg-thapar-700 shadow-xl shadow-thapar-500/25 transition-all hover:scale-[1.02] active:scale-[0.98] flex items-center justify-center gap-2.5 cursor-pointer"
            >
              Explore Live Availability
              <ArrowDown className="w-4 h-4 animate-bounce" />
            </button>

            {/* Secondary Action Button: Directs to sign in */}
            <Link
              to="/login"
              className="w-full sm:w-auto px-8 py-4 rounded-2xl text-sm font-bold text-slate-800 dark:text-slate-200 bg-white dark:bg-darkcard border border-slate-200 dark:border-darkborder hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors shadow-sm flex items-center justify-center gap-2"
            >
              Faculty Sign In
              <ArrowRight className="w-4 h-4 text-slate-400" />
            </Link>
          </div>

          {/* Live Preview Showcase Container (Scroll Target) */}
          <div id="preview-section" className="mt-16 pt-6 relative max-w-5xl mx-auto">
            <div className="rounded-3xl p-3 bg-slate-200/60 dark:bg-slate-800/50 backdrop-blur-md border border-slate-300/80 dark:border-slate-700/60 shadow-2xl">
              <div className="rounded-2xl bg-white dark:bg-darkcard border border-slate-200 dark:border-darkborder p-6 text-left space-y-6">
                
                {/* Preview Header */}
                <div className="flex flex-wrap items-center justify-between gap-4 pb-4 border-b border-slate-100 dark:border-darkborder">
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-pulse"></span>
                      <h3 className="text-sm font-bold text-slate-900 dark:text-white">Live Classroom Availability Engine</h3>
                    </div>
                    <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">Monday • 10:30 AM Slot • Academic Block Filtering</p>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="px-3 py-1 rounded-full text-xs font-bold bg-emerald-50 text-emerald-700 dark:bg-emerald-950/60 dark:text-emerald-300 border border-emerald-200 dark:border-emerald-800">
                      27 Rooms Free Now
                    </span>
                  </div>
                </div>

                {/* Sample Classroom Cards Showcase Grid */}
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                  
                  <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-900/60 border border-slate-200/80 dark:border-slate-800 hover:border-emerald-500/40 transition-colors">
                    <div className="flex items-center justify-between mb-2">
                      <span className="font-black text-xl text-slate-900 dark:text-white">T106</span>
                      <span className="text-[10px] font-bold px-2.5 py-0.5 rounded-full bg-emerald-100 text-emerald-800 dark:bg-emerald-900/60 dark:text-emerald-300">AVAILABLE</span>
                    </div>
                    <p className="text-xs text-slate-500 dark:text-slate-400">T Block • Capacity: 80 seats</p>
                    <p className="text-[11px] text-emerald-600 dark:text-emerald-400 font-semibold mt-3 flex items-center gap-1">
                      <CheckCircle2 className="w-3.5 h-3.5" /> Free for next 2 hours
                    </p>
                  </div>

                  <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-900/60 border border-slate-200/80 dark:border-slate-800 hover:border-rose-500/40 transition-colors">
                    <div className="flex items-center justify-between mb-2">
                      <span className="font-black text-xl text-slate-900 dark:text-white">LT303</span>
                      <span className="text-[10px] font-bold px-2.5 py-0.5 rounded-full bg-rose-100 text-rose-800 dark:bg-rose-900/60 dark:text-rose-300">OCCUPIED</span>
                    </div>
                    <p className="text-xs text-slate-500 dark:text-slate-400">LT Block • Capacity: 200 seats</p>
                    <p className="text-[11px] text-slate-600 dark:text-slate-300 font-medium mt-3">
                      CAO (3P14) • 09:40 - 10:30 AM
                    </p>
                  </div>

                  <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-900/60 border border-slate-200/80 dark:border-slate-800 hover:border-emerald-500/40 transition-colors">
                    <div className="flex items-center justify-between mb-2">
                      <span className="font-black text-xl text-slate-900 dark:text-white">F201</span>
                      <span className="text-[10px] font-bold px-2.5 py-0.5 rounded-full bg-emerald-100 text-emerald-800 dark:bg-emerald-900/60 dark:text-emerald-300">AVAILABLE</span>
                    </div>
                    <p className="text-xs text-slate-500 dark:text-slate-400">F Block • Capacity: 70 seats</p>
                    <p className="text-[11px] text-emerald-600 dark:text-emerald-400 font-semibold mt-3 flex items-center gap-1">
                      <CheckCircle2 className="w-3.5 h-3.5" /> Free until 01:00 PM
                    </p>
                  </div>

                </div>

              </div>
            </div>
          </div>

        </div>
      </section>

      {/* Feature Presentation Grid Section */}
      <section className="py-20 bg-white dark:bg-darkcard border-y border-slate-200/80 dark:border-darkborder">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          
          <div className="text-center max-w-3xl mx-auto mb-16">
            <span className="text-xs font-bold uppercase tracking-widest text-thapar-600 dark:text-thapar-400 bg-thapar-50 dark:bg-thapar-950/60 px-3.5 py-1 rounded-full border border-thapar-200 dark:border-thapar-800">
              Complete Academic Platform Blueprint
            </span>
            <h2 className="text-3xl sm:text-5xl font-extrabold text-slate-900 dark:text-white tracking-tight mt-4">
              Designed for Academic Governance & Operations
            </h2>
            <p className="mt-3 text-sm sm:text-base text-slate-600 dark:text-slate-400">
              A comprehensive showcase of timetable processing, venue booking, and facility maintenance tools.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            
            {/* Feature 1: Real-time Timetable Lookup */}
            <div className="p-8 rounded-3xl bg-slate-50 dark:bg-slate-900/50 border border-slate-200/80 dark:border-slate-800 space-y-4 hover:border-thapar-500/40 transition-colors">
              <div className="w-14 h-14 rounded-2xl bg-thapar-100 dark:bg-thapar-950 text-thapar-600 dark:text-thapar-400 flex items-center justify-center">
                <Search className="w-7 h-7" />
              </div>
              <h3 className="text-xl font-extrabold text-slate-900 dark:text-white">Real-Time Occupancy Engine</h3>
              <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed">
                Dynamic regex block parser (`T106` $\rightarrow$ T Block, `LT303` $\rightarrow$ LT Block) matching weekly timetable entries, automatically filtering out laboratory sessions.
              </p>
              <ul className="space-y-2 text-xs text-slate-700 dark:text-slate-300 pt-2">
                <li className="flex items-center gap-2">
                  <Check className="w-4 h-4 text-emerald-500" />
                  Instant Day & Time Slot search
                </li>
                <li className="flex items-center gap-2">
                  <Check className="w-4 h-4 text-emerald-500" />
                  Lab session exclusion rule
                </li>
              </ul>
            </div>

            {/* Feature 2: Event & Guest Lecture Booking */}
            <div className="p-8 rounded-3xl bg-slate-50 dark:bg-slate-900/50 border border-slate-200/80 dark:border-slate-800 space-y-4 hover:border-indigo-500/40 transition-colors">
              <div className="w-14 h-14 rounded-2xl bg-indigo-100 dark:bg-indigo-950 text-indigo-600 dark:text-indigo-400 flex items-center justify-center">
                <Calendar className="w-7 h-7" />
              </div>
              <h3 className="text-xl font-extrabold text-slate-900 dark:text-white">Event & Guest Lecture Booking</h3>
              <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed">
                Faculty and Student Organisation Heads can reserve available lecture halls for guest lectures, society workshops, and makeup exams.
              </p>
              <ul className="space-y-2 text-xs text-slate-700 dark:text-slate-300 pt-2">
                <li className="flex items-center gap-2">
                  <Check className="w-4 h-4 text-emerald-500" />
                  Conflict-free reservation workflow
                </li>
                <li className="flex items-center gap-2">
                  <Check className="w-4 h-4 text-emerald-500" />
                  Department Head approval matrix
                </li>
              </ul>
            </div>

            {/* Feature 3: Inconvenience & Maintenance Reporting Presentation Card */}
            <div className="p-8 rounded-3xl bg-slate-50 dark:bg-slate-900/50 border border-slate-200/80 dark:border-slate-800 space-y-4 hover:border-amber-500/40 transition-colors">
              <div className="w-14 h-14 rounded-2xl bg-amber-100 dark:bg-amber-950 text-amber-600 dark:text-amber-400 flex items-center justify-center">
                <Wrench className="w-7 h-7" />
              </div>
              <h3 className="text-xl font-extrabold text-slate-900 dark:text-white">Facility Issue Reporting</h3>
              <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed">
                Notice a broken projector, podium mic failure, or AC issue during your lecture? Faculty can log classroom issues directly to campus maintenance.
              </p>
              <ul className="space-y-2 text-xs text-slate-700 dark:text-slate-300 pt-2">
                <li className="flex items-center gap-2">
                  <Check className="w-4 h-4 text-emerald-500" />
                  Projector, Mic, AC & Seating ticketing
                </li>
                <li className="flex items-center gap-2">
                  <Check className="w-4 h-4 text-emerald-500" />
                  Real-time repair status tracking
                </li>
              </ul>
            </div>

          </div>

        </div>
      </section>

      {/* Classroom Inconvenience & Maintenance Presentation Showcase Section */}
      <section className="py-20 bg-slate-50 dark:bg-darkbg">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            
            <div className="space-y-6">
              <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-amber-100 dark:bg-amber-950/80 text-amber-800 dark:text-amber-300 text-xs font-bold border border-amber-200 dark:border-amber-800">
                <Wrench className="w-4 h-4" />
                Classroom Infrastructure & Maintenance Vision
              </div>

              <h2 className="text-3xl sm:text-4xl font-black text-slate-900 dark:text-white tracking-tight leading-tight">
                Report Classroom Inconveniences Effortlessly
              </h2>

              <p className="text-sm text-slate-600 dark:text-slate-300 leading-relaxed">
                Whether a projector display is flickering, a podium microphone is non-functional, or an AC unit requires attention, faculty members can highlight classroom issues to ensure smooth teaching operations.
              </p>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2">
                
                <div className="p-4 rounded-2xl bg-white dark:bg-darkcard border border-slate-200/80 dark:border-darkborder shadow-sm space-y-1">
                  <div className="w-8 h-8 rounded-xl bg-rose-100 dark:bg-rose-950 text-rose-600 dark:text-rose-400 flex items-center justify-center font-bold text-xs">
                    AV
                  </div>
                  <h4 className="text-xs font-bold text-slate-900 dark:text-white">AV Equipment Malfunctions</h4>
                  <p className="text-[11px] text-slate-500 dark:text-slate-400">Projectors, HDMI cables, speakers, soundboards.</p>
                </div>

                <div className="p-4 rounded-2xl bg-white dark:bg-darkcard border border-slate-200/80 dark:border-darkborder shadow-sm space-y-1">
                  <div className="w-8 h-8 rounded-xl bg-amber-100 dark:bg-amber-950 text-amber-600 dark:text-amber-400 flex items-center justify-center font-bold text-xs">
                    AC
                  </div>
                  <h4 className="text-xs font-bold text-slate-900 dark:text-white">Environmental & Furniture</h4>
                  <p className="text-[11px] text-slate-500 dark:text-slate-400">Air conditioning, podium mics, whiteboards, seating.</p>
                </div>

              </div>
            </div>

            {/* Visual Presentation Showcase Card */}
            <div className="p-8 rounded-3xl bg-white dark:bg-darkcard border border-slate-200 dark:border-darkborder shadow-xl space-y-6 relative overflow-hidden">
              <div className="flex items-center justify-between pb-4 border-b border-slate-100 dark:border-darkborder">
                <div className="flex items-center gap-2.5">
                  <div className="w-3 h-3 rounded-full bg-amber-500"></div>
                  <h3 className="text-xs font-bold text-slate-900 dark:text-white uppercase tracking-wider">
                    Maintenance Ticketing Integration
                  </h3>
                </div>
                <span className="text-[10px] font-extrabold px-2.5 py-1 rounded-full bg-amber-100 text-amber-800 dark:bg-amber-950 dark:text-amber-300 border border-amber-200 dark:border-amber-800">
                  PLANNED EXTENSION
                </span>
              </div>

              <div className="space-y-4 text-xs">
                <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-900/60 border border-slate-200/80 dark:border-slate-800 space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="font-bold text-slate-900 dark:text-white">Ticket #THP-1049: Projector Display Flicker</span>
                    <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-emerald-100 text-emerald-800 dark:bg-emerald-900/60 dark:text-emerald-300">RESOLVED</span>
                  </div>
                  <p className="text-[11px] text-slate-500 dark:text-slate-400">Classroom: T106 (T Block) • Reported by Dr. R. Sharma</p>
                </div>

                <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-900/60 border border-slate-200/80 dark:border-slate-800 space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="font-bold text-slate-900 dark:text-white">Ticket #THP-1052: Podium Microphone Inaudible</span>
                    <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-amber-100 text-amber-800 dark:bg-amber-900/60 dark:text-amber-300">IN PROGRESS</span>
                  </div>
                  <p className="text-[11px] text-slate-500 dark:text-slate-400">Classroom: LT303 (LT Block) • Reported by Prof. A. Gupta</p>
                </div>
              </div>

              <div className="p-4 rounded-2xl bg-slate-100/70 dark:bg-slate-800/60 text-slate-600 dark:text-slate-300 text-xs">
                <p className="font-semibold flex items-center gap-1.5">
                  <Sparkles className="w-4 h-4 text-thapar-500" />
                  Planned Facility Automation Module
                </p>
                <p className="text-[11px] text-slate-500 dark:text-slate-400 mt-1">
                  Integrates campus maintenance dispatch with classroom availability schedules to prevent scheduling classes in rooms with active high-severity issues.
                </p>
              </div>
            </div>

          </div>

        </div>
      </section>

      {/* How It Works 4-Step Process Grid */}
      <section className="py-20 bg-white dark:bg-darkcard border-t border-slate-200/80 dark:border-darkborder">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          
          <div className="text-center max-w-2xl mx-auto mb-16">
            <h2 className="text-3xl sm:text-4xl font-extrabold text-slate-900 dark:text-white tracking-tight">
              How The Platform Works
            </h2>
            <p className="mt-2 text-xs sm:text-sm text-slate-600 dark:text-slate-400">
              Simple 4-step workflow for academic classroom scheduling and management.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            
            <div className="p-6 rounded-3xl bg-slate-50 dark:bg-slate-900/50 border border-slate-200/80 dark:border-slate-800 relative">
              <span className="text-4xl font-black text-thapar-500/20 dark:text-thapar-400/20 absolute top-4 right-4">01</span>
              <h4 className="text-base font-bold text-slate-900 dark:text-white">Query Timetable</h4>
              <p className="text-xs text-slate-600 dark:text-slate-400 mt-2 leading-relaxed">
                Select your target day of week and time slot to search current or upcoming classroom openings.
              </p>
            </div>

            <div className="p-6 rounded-3xl bg-slate-50 dark:bg-slate-900/50 border border-slate-200/80 dark:border-slate-800 relative">
              <span className="text-4xl font-black text-thapar-500/20 dark:text-thapar-400/20 absolute top-4 right-4">02</span>
              <h4 className="text-base font-bold text-slate-900 dark:text-white">Filter Academic Block</h4>
              <p className="text-xs text-slate-600 dark:text-slate-400 mt-2 leading-relaxed">
                Narrow down empty rooms instantly by T, LT, F, E, L, or LP Blocks using dynamic regex parsing.
              </p>
            </div>

            <div className="p-6 rounded-3xl bg-slate-50 dark:bg-slate-900/50 border border-slate-200/80 dark:border-slate-800 relative">
              <span className="text-4xl font-black text-thapar-500/20 dark:text-thapar-400/20 absolute top-4 right-4">03</span>
              <h4 className="text-base font-bold text-slate-900 dark:text-white">Reserve Venue</h4>
              <p className="text-xs text-slate-600 dark:text-slate-400 mt-2 leading-relaxed">
                Inspect full weekly room schedules and request classroom permission for guest lectures or events.
              </p>
            </div>

            <div className="p-6 rounded-3xl bg-slate-50 dark:bg-slate-900/50 border border-slate-200/80 dark:border-slate-800 relative">
              <span className="text-4xl font-black text-thapar-500/20 dark:text-thapar-400/20 absolute top-4 right-4">04</span>
              <h4 className="text-base font-bold text-slate-900 dark:text-white">Report Inconvenience</h4>
              <p className="text-xs text-slate-600 dark:text-slate-400 mt-2 leading-relaxed">
                Report broken equipment or classroom issues directly to maintenance for quick resolution.
              </p>
            </div>

          </div>

        </div>
      </section>

      {/* Footer */}
      <footer className="mt-auto py-10 bg-slate-100 dark:bg-darkbg border-t border-slate-200 dark:border-darkborder text-xs text-slate-500 dark:text-slate-400">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-6">
          <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
            <div className="flex items-center gap-2">
              <School className="w-5 h-5 text-thapar-600 dark:text-thapar-400" />
              <span className="font-bold text-slate-900 dark:text-white">Thapar Classrooms Platform</span>
            </div>
            <p>© 2026 Thapar Institute of Engineering & Technology — Software Engineering Project.</p>
          </div>
          <div className="pt-4 border-t border-slate-200/60 dark:border-slate-800 flex flex-wrap items-center justify-between gap-4 text-[11px]">
            <div className="flex items-center gap-3 font-semibold text-slate-600 dark:text-slate-300">
              <span>React 18</span> • <span>Vite</span> • <span>Node.js</span> • <span>Express</span> • <span>MongoDB</span>
            </div>
            <div className="flex items-center gap-4">
              <Link to="/login" className="hover:underline">Faculty Sign In</Link>
              <Link to="/signup" className="hover:underline">Register Account</Link>
              <Link to="/dashboard" className="hover:underline">Availability Dashboard</Link>
            </div>
          </div>
        </div>
      </footer>

    </div>
  );
}
