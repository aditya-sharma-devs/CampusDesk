import React, { useState, useEffect } from 'react';
import { 
  Search, 
  Filter, 
  Calendar, 
  Clock, 
  Building2, 
  CheckCircle2, 
  XCircle, 
  RefreshCw, 
  Layers, 
  HelpCircle,
  X,
  Wrench,
  AlertTriangle
} from 'lucide-react';
import api from '../services/api';
import Navbar from '../components/Navbar';
import ClassroomCard from '../components/ClassroomCard';
import ClassroomScheduleModal from '../components/ClassroomScheduleModal';
import TicketDetailModal from '../components/TicketDetailModal';
import CustomSelect from '../components/CustomSelect';
import { STANDARD_SLOTS, DAYS_OF_WEEK } from '../utils/timeFormat';

export default function DashboardPage() {
  const [loading, setLoading] = useState(true);
  const [data, setData] = useState(null);
  const [selectedDay, setSelectedDay] = useState('');
  const [selectedTime, setSelectedTime] = useState('');
  const [selectedBlock, setSelectedBlock] = useState('ALL');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedClassroomModal, setSelectedClassroomModal] = useState(null);
  const [selectedTicketModal, setSelectedTicketModal] = useState(null);

  // Fetch availability data whenever filters change
  const fetchAvailability = async () => {
    setLoading(true);
    try {
      const params = {};
      if (selectedDay) params.day = selectedDay;
      if (selectedTime) params.time = selectedTime;
      if (selectedBlock && selectedBlock !== 'ALL') params.block = selectedBlock;
      if (searchQuery) params.search = searchQuery;

      const res = await api.get('/classrooms/availability', { params });
      if (res.data.success) {
        setData(res.data.data);
      }
    } catch (err) {
      console.error('Failed to fetch availability report:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAvailability();
  }, [selectedDay, selectedTime, selectedBlock]);

  // Debounced search trigger
  useEffect(() => {
    const timer = setTimeout(() => {
      fetchAvailability();
    }, 300);
    return () => clearTimeout(timer);
  }, [searchQuery]);

  const resetFilters = () => {
    setSelectedDay('');
    setSelectedTime('');
    setSelectedBlock('ALL');
    setSearchQuery('');
  };

  const hasActiveFilters = selectedDay !== '' || selectedTime !== '' || selectedBlock !== 'ALL' || searchQuery !== '';

  const summary = data?.summary || { totalClassrooms: 0, availableCount: 0, occupiedCount: 0, maintenanceCount: 0, pendingIssueCount: 0, blockSummary: {} };
  const classrooms = data?.classrooms || [];
  const meta = data?.meta || {};

  const dayOptions = [
    { label: 'Current Today', value: '' },
    ...DAYS_OF_WEEK.map(d => ({ label: d, value: d }))
  ];

  const availableBlocks = ['ALL', 'T Block', 'LT Block', 'F Block', 'E Block', 'L Block', 'LP Block'];

  return (
    <div className="min-h-screen flex flex-col bg-slate-50 dark:bg-darkbg text-slate-900 dark:text-slate-100 transition-colors pb-16">
      <Navbar onRefreshData={fetchAvailability} />

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-8 flex-1 w-full space-y-8">
        
        {/* Page Top Header */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <h1 className="text-2xl sm:text-3xl font-black text-slate-900 dark:text-white tracking-tight">
              Classroom Availability & Maintenance Engine
            </h1>
            <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 mt-1">
              Real-time occupancy status based on Thapar Institute weekly timetable data and facility maintenance tags.
            </p>
          </div>

          {/* Current Search Target Badge */}
          <div className="flex items-center gap-2.5 self-start md:self-auto px-4 py-2.5 rounded-2xl bg-white dark:bg-darkcard border border-slate-200/80 dark:border-darkborder shadow-sm text-xs font-semibold text-slate-700 dark:text-slate-300">
            <div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></div>
            <span>Targeting: <strong className="text-thapar-600 dark:text-thapar-400 font-bold">{meta.day || 'Today'}</strong> at <strong className="text-thapar-600 dark:text-thapar-400 font-bold">{meta.time || 'Current Time'}</strong></span>
          </div>
        </div>

        {/* Filter & Controls Panel */}
        <div className="p-6 rounded-3xl bg-white dark:bg-darkcard border border-slate-200/90 dark:border-darkborder shadow-sm space-y-6">
          
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Filter className="w-4 h-4 text-thapar-500" />
              <h3 className="text-xs font-bold text-slate-800 dark:text-slate-200 uppercase tracking-wider">
                Availability Filters
              </h3>
            </div>

            {hasActiveFilters && (
              <button
                onClick={resetFilters}
                className="flex items-center gap-1.5 text-xs font-bold text-rose-600 dark:text-rose-400 hover:text-rose-700 dark:hover:text-rose-300 transition-colors"
              >
                <X className="w-3.5 h-3.5" />
                Reset Filters
              </button>
            )}
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            
            {/* Custom Day Selector */}
            <CustomSelect
              label="Day of Week"
              options={dayOptions}
              value={selectedDay}
              onChange={setSelectedDay}
              icon={Calendar}
              placeholder="Current Today"
            />

            {/* Custom Time Slot Selector */}
            <CustomSelect
              label="Time Slot"
              options={STANDARD_SLOTS}
              value={selectedTime}
              onChange={setSelectedTime}
              icon={Clock}
              placeholder="Current Time"
            />

            {/* Room Search Input */}
            <div>
              <label className="block text-[11px] font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider mb-1.5">
                Search Room Number or Subject
              </label>
              <div className="relative">
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="e.g. T106, LT303, CAO, SE..."
                  className="w-full pl-10 pr-4 py-3 rounded-2xl bg-slate-50 dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 text-slate-900 dark:text-white text-xs font-bold focus:outline-none focus:ring-2 focus:ring-thapar-500/20 focus:border-thapar-500 focus:bg-white dark:focus:bg-darkcard transition-all"
                />
                <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
              </div>
            </div>

          </div>

          {/* Academic Block Tabs */}
          <div className="pt-4 border-t border-slate-100 dark:border-slate-800">
            <div className="flex flex-col sm:flex-row sm:items-center gap-2">
              <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider shrink-0 mr-2">
                Academic Block:
              </span>
              <div className="flex items-center gap-2 overflow-x-auto pb-1.5 scrollbar-none w-full">
                {availableBlocks.map(b => {
                  const isSelected = selectedBlock === b;
                  return (
                    <button
                      key={b}
                      onClick={() => setSelectedBlock(b)}
                      className={`px-4 py-2 rounded-2xl text-xs font-extrabold transition-all shrink-0 ${
                        isSelected
                          ? 'bg-thapar-600 text-white shadow-lg shadow-thapar-500/25 scale-[1.02]'
                          : 'bg-slate-100 dark:bg-slate-800/80 text-slate-600 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-700 hover:text-slate-900'
                      }`}
                    >
                      {b}
                    </button>
                  );
                })}
              </div>
            </div>
          </div>

        </div>

        {/* Summary Metric Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-4 gap-4">
          
          <div className="p-5 rounded-3xl bg-white dark:bg-darkcard border border-slate-200/90 dark:border-darkborder shadow-sm flex items-center justify-between">
            <div>
              <p className="text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider">
                Total Classrooms
              </p>
              <p className="text-3xl font-black text-slate-900 dark:text-white mt-1">
                {summary.totalClassrooms}
              </p>
            </div>
            <div className="w-12 h-12 rounded-2xl bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 flex items-center justify-center">
              <Building2 className="w-6 h-6" />
            </div>
          </div>

          <div className="p-5 rounded-3xl bg-white dark:bg-darkcard border border-slate-200/90 dark:border-darkborder shadow-sm flex items-center justify-between">
            <div>
              <p className="text-xs font-bold text-emerald-600 dark:text-emerald-400 uppercase tracking-wider">
                Available Now
              </p>
              <p className="text-3xl font-black text-emerald-600 dark:text-emerald-400 mt-1">
                {summary.availableCount}
              </p>
            </div>
            <div className="w-12 h-12 rounded-2xl bg-emerald-50 dark:bg-emerald-950/50 text-emerald-600 dark:text-emerald-400 flex items-center justify-center border border-emerald-200 dark:border-emerald-800">
              <CheckCircle2 className="w-6 h-6" />
            </div>
          </div>

          <div className="p-5 rounded-3xl bg-white dark:bg-darkcard border border-slate-200/90 dark:border-darkborder shadow-sm flex items-center justify-between">
            <div>
              <p className="text-xs font-bold text-rose-600 dark:text-rose-400 uppercase tracking-wider">
                Occupied Now
              </p>
              <p className="text-3xl font-black text-rose-600 dark:text-rose-400 mt-1">
                {summary.occupiedCount}
              </p>
            </div>
            <div className="w-12 h-12 rounded-2xl bg-rose-50 dark:bg-rose-950/50 text-rose-600 dark:text-rose-400 flex items-center justify-center border border-rose-200 dark:border-rose-800">
              <XCircle className="w-6 h-6" />
            </div>
          </div>

          <div className="p-5 rounded-3xl bg-white dark:bg-darkcard border border-slate-200/90 dark:border-darkborder shadow-sm flex items-center justify-between">
            <div>
              <p className="text-xs font-bold text-amber-600 dark:text-amber-400 uppercase tracking-wider">
                Issues / Maintenance
              </p>
              <p className="text-3xl font-black text-amber-600 dark:text-amber-400 mt-1">
                {summary.maintenanceCount || 0}
              </p>
            </div>
            <div className="w-12 h-12 rounded-2xl bg-amber-50 dark:bg-amber-950/50 text-amber-600 dark:text-amber-400 flex items-center justify-center border border-amber-200 dark:border-amber-800">
              <Wrench className="w-6 h-6" />
            </div>
          </div>

        </div>

        {/* Classrooms Grid Area */}
        <div>
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-bold text-slate-900 dark:text-white flex items-center gap-2">
              <Layers className="w-5 h-5 text-thapar-500" />
              Classroom Directory
            </h2>
            <button
              onClick={fetchAvailability}
              className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-2xl text-xs font-bold text-slate-700 dark:text-slate-200 bg-white dark:bg-darkcard border border-slate-200 dark:border-darkborder hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors shadow-sm"
            >
              <RefreshCw className={`w-3.5 h-3.5 ${loading ? 'animate-spin' : ''}`} />
              Refresh
            </button>
          </div>

          {loading ? (
            <div className="py-20 text-center space-y-3">
              <div className="w-8 h-8 border-4 border-thapar-600 border-t-transparent rounded-full animate-spin mx-auto"></div>
              <p className="text-xs font-semibold text-slate-500 dark:text-slate-400">Evaluating classroom occupancy and maintenance status...</p>
            </div>
          ) : classrooms.length === 0 ? (
            <div className="py-16 text-center bg-white dark:bg-darkcard border border-slate-200 dark:border-darkborder rounded-3xl p-8">
              <HelpCircle className="w-10 h-10 text-slate-400 mx-auto mb-3" />
              <h3 className="text-base font-bold text-slate-800 dark:text-slate-200">No Classrooms Found</h3>
              <p className="text-xs text-slate-500 dark:text-slate-400 mt-1 max-w-sm mx-auto">
                No classrooms match the selected academic block or search query. Try resetting your search filters.
              </p>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
              {classrooms.map((room) => (
                <ClassroomCard
                  key={room.id}
                  classroom={room}
                  onViewSchedule={(cls) => setSelectedClassroomModal(cls)}
                  onViewTicket={(tkt) => setSelectedTicketModal(tkt)}
                />
              ))}
            </div>
          )}
        </div>

      </main>

      {/* Schedule Modal Drawer */}
      {selectedClassroomModal && (
        <ClassroomScheduleModal
          classroom={selectedClassroomModal}
          onClose={() => setSelectedClassroomModal(null)}
        />
      )}

      {/* Ticket Details View Modal */}
      {selectedTicketModal && (
        <TicketDetailModal
          ticket={selectedTicketModal}
          onClose={() => setSelectedTicketModal(null)}
        />
      )}
    </div>
  );
}
