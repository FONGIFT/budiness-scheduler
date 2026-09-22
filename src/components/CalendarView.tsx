import React, { useState } from 'react';
import { Appointment } from '../types';

interface CalendarViewProps {
  appointments: Appointment[];
  onSelectAppointment: (apt: Appointment) => void;
  onOpenManualAppointment: () => void;
  onShowToast: (msg: string) => void;
}

export const CalendarView: React.FC<CalendarViewProps> = ({
  appointments,
  onSelectAppointment,
  onOpenManualAppointment,
  onShowToast,
}) => {
  const [viewMode, setViewMode] = useState<'day' | 'week' | 'month'>('week');
  const [staffFilter, setStaffFilter] = useState<'all' | 'Gift' | 'Samuel'>('all');
  const [statusFilter, setStatusFilter] = useState<'all' | 'confirmed' | 'pending'>('all');
  const [selectedStaffGift, setSelectedStaffGift] = useState(true);
  const [selectedStaffSamuel, setSelectedStaffSamuel] = useState(true);
  const [activeDateIndex, setActiveDateIndex] = useState(24);

  const hours = [
    '08:00',
    '09:00',
    '10:00',
    '11:00',
    '12:00',
    '13:00',
    '14:00',
    '15:00',
    '16:00',
    '17:00',
  ];

  const filteredAppointments = appointments.filter((apt) => {
    // Staff filter
    if (staffFilter === 'Gift' && apt.staffName !== 'Gift') return false;
    if (staffFilter === 'Samuel' && apt.staffName !== 'Samuel') return false;
    if (!selectedStaffGift && apt.staffName === 'Gift') return false;
    if (!selectedStaffSamuel && apt.staffName === 'Samuel') return false;

    // Status filter
    if (statusFilter === 'confirmed' && apt.status !== 'Confirmed') return false;
    if (statusFilter === 'pending' && apt.status !== 'Pending') return false;

    return true;
  });

  return (
    <div className="flex flex-col w-full pb-12">
      {/* Top Control Bar */}
      <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4 mb-6">
        {/* Left: Date Range & Jump Navigation */}
        <div className="flex flex-wrap items-center gap-3">
          <div className="flex items-center bg-surface-card p-1 rounded-xl shadow-sm border border-border-subtle">
            <button
              onClick={() => onShowToast('Viewing previous week (Sep 14 – Sep 19)')}
              className="flex items-center justify-center w-8 h-8 rounded-lg hover:bg-surface-muted text-on-surface transition-colors cursor-pointer"
              title="Previous period"
            >
              <span className="material-symbols-outlined text-[18px]">chevron_left</span>
            </button>
            <span className="px-3 font-label-md text-label-md text-on-surface font-semibold select-none">
              Sep 21 – Sep 26, 2025
            </span>
            <button
              onClick={() => onShowToast('Viewing next week (Sep 28 – Oct 03)')}
              className="flex items-center justify-center w-8 h-8 rounded-lg hover:bg-surface-muted text-on-surface transition-colors cursor-pointer"
              title="Next period"
            >
              <span className="material-symbols-outlined text-[18px]">chevron_right</span>
            </button>
          </div>

          <button
            onClick={() => onShowToast('Navigated to Current Week (Sep 21 - Sep 26)')}
            className="px-4 py-2 rounded-xl bg-surface-card hover:bg-surface-muted text-on-surface font-label-md text-label-md shadow-sm border border-border-subtle transition-colors flex items-center gap-2 cursor-pointer"
          >
            <span className="w-2 h-2 rounded-full bg-primary animate-pulse"></span>
            <span>Today</span>
          </button>

          {/* View Switcher (Day / Week / Month) */}
          <div className="flex items-center bg-surface-container-high p-1 rounded-xl border border-border-subtle/50">
            {(['day', 'week', 'month'] as const).map((mode) => (
              <button
                key={mode}
                onClick={() => {
                  setViewMode(mode);
                  onShowToast(`Switched to ${mode} view`);
                }}
                className={`px-4 py-1.5 rounded-lg font-label-sm text-label-sm capitalize transition-all cursor-pointer ${
                  viewMode === mode
                    ? 'bg-surface-card text-on-surface font-semibold shadow-xs'
                    : 'text-on-surface-variant hover:text-on-surface'
                }`}
              >
                {mode}
              </button>
            ))}
          </div>
        </div>

        {/* Right: Filter Toolbar & Primary Action */}
        <div className="flex flex-wrap items-center gap-2.5">
          <div className="relative">
            <select
              value={staffFilter}
              onChange={(e) => setStaffFilter(e.target.value as any)}
              className="appearance-none bg-surface-card text-on-surface font-label-sm text-label-sm pl-3 pr-8 py-2 rounded-xl shadow-sm border border-border-subtle cursor-pointer outline-none hover:bg-surface-muted transition-colors"
            >
              <option value="all">Staff: All (Gift, Samuel)</option>
              <option value="Gift">Gift (Master Barber)</option>
              <option value="Samuel">Samuel (Senior Stylist)</option>
            </select>
            <span className="material-symbols-outlined absolute right-2.5 top-1/2 -translate-y-1/2 text-on-surface-variant pointer-events-none text-[18px]">
              expand_more
            </span>
          </div>

          <div className="relative">
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value as any)}
              className="appearance-none bg-surface-card text-on-surface font-label-sm text-label-sm pl-3 pr-8 py-2 rounded-xl shadow-sm border border-border-subtle cursor-pointer outline-none hover:bg-surface-muted transition-colors"
            >
              <option value="all">Status: Confirmed & Pending</option>
              <option value="confirmed">Only Confirmed</option>
              <option value="pending">Only Pending</option>
            </select>
            <span className="material-symbols-outlined absolute right-2.5 top-1/2 -translate-y-1/2 text-on-surface-variant pointer-events-none text-[18px]">
              expand_more
            </span>
          </div>

          <button
            onClick={onOpenManualAppointment}
            className="flex items-center gap-1.5 bg-primary text-on-primary font-label-md text-label-md px-4 py-2 rounded-xl shadow-sm hover:opacity-95 active:scale-[0.98] transition-all cursor-pointer"
          >
            <span className="material-symbols-outlined text-[18px]">add</span>
            <span>Manual Appointment</span>
          </button>
        </div>
      </div>

      {/* Main View Container: Left Mini Sidebar + Central Week Grid */}
      <div className="grid grid-cols-1 xl:grid-cols-12 gap-6 items-start">
        {/* Left Mini-Sidebar (3 cols) */}
        <div className="xl:col-span-3 flex flex-col gap-4">
          {/* Mini Month Picker */}
          <div className="bg-surface-card rounded-2xl p-4 sm:p-5 shadow-sm border border-border-subtle">
            <div className="flex items-center justify-between mb-3">
              <span className="font-headline-md text-headline-md text-on-surface font-semibold">
                September 2025
              </span>
              <div className="flex items-center gap-1">
                <button
                  onClick={() => onShowToast('Viewing August 2025')}
                  className="w-6 h-6 flex items-center justify-center rounded hover:bg-surface-muted text-on-surface-variant"
                >
                  <span className="material-symbols-outlined text-[16px]">chevron_left</span>
                </button>
                <button
                  onClick={() => onShowToast('Viewing October 2025')}
                  className="w-6 h-6 flex items-center justify-center rounded hover:bg-surface-muted text-on-surface-variant"
                >
                  <span className="material-symbols-outlined text-[16px]">chevron_right</span>
                </button>
              </div>
            </div>

            {/* Mini Calendar Days Grid */}
            <div className="grid grid-cols-7 gap-1 text-center font-caption text-caption text-on-surface-variant mb-1">
              <span>Su</span>
              <span>Mo</span>
              <span>Tu</span>
              <span>We</span>
              <span>Th</span>
              <span>Fr</span>
              <span>Sa</span>
            </div>
            <div className="grid grid-cols-7 gap-1 text-center font-label-sm text-label-sm">
              <span className="py-1 text-outline">31</span>
              {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20].map((d) => (
                <span
                  key={d}
                  onClick={() => onShowToast(`Selected Sep ${d}`)}
                  className="py-1 text-on-surface hover:bg-surface-container rounded cursor-pointer transition-colors"
                >
                  {d}
                </span>
              ))}
              {/* Selected Week Highlight (21-26) */}
              <span
                onClick={() => setActiveDateIndex(21)}
                className={`py-1 text-on-surface cursor-pointer rounded-l ${
                  activeDateIndex === 21
                    ? 'bg-primary text-on-primary font-bold'
                    : 'bg-secondary-container/50'
                }`}
              >
                21
              </span>
              <span
                onClick={() => setActiveDateIndex(22)}
                className={`py-1 text-on-surface cursor-pointer ${
                  activeDateIndex === 22
                    ? 'bg-primary text-on-primary font-bold'
                    : 'bg-secondary-container/50'
                }`}
              >
                22
              </span>
              <span
                onClick={() => setActiveDateIndex(23)}
                className={`py-1 text-on-surface cursor-pointer ${
                  activeDateIndex === 23
                    ? 'bg-primary text-on-primary font-bold'
                    : 'bg-secondary-container/50'
                }`}
              >
                23
              </span>
              <span
                onClick={() => setActiveDateIndex(24)}
                className="py-1 text-on-primary bg-primary font-label-md rounded font-bold cursor-pointer shadow-xs"
              >
                24
              </span>
              <span
                onClick={() => setActiveDateIndex(25)}
                className={`py-1 text-on-surface cursor-pointer ${
                  activeDateIndex === 25
                    ? 'bg-primary text-on-primary font-bold'
                    : 'bg-secondary-container/50'
                }`}
              >
                25
              </span>
              <span
                onClick={() => setActiveDateIndex(26)}
                className={`py-1 text-on-surface cursor-pointer rounded-r ${
                  activeDateIndex === 26
                    ? 'bg-primary text-on-primary font-bold'
                    : 'bg-secondary-container/50'
                }`}
              >
                26
              </span>
              {[27, 28, 29, 30].map((d) => (
                <span
                  key={d}
                  onClick={() => onShowToast(`Selected Sep ${d}`)}
                  className="py-1 text-on-surface hover:bg-surface-container rounded cursor-pointer transition-colors"
                >
                  {d}
                </span>
              ))}
              <span className="py-1 text-outline">1</span>
              <span className="py-1 text-outline">2</span>
              <span className="py-1 text-outline">3</span>
              <span className="py-1 text-outline">4</span>
            </div>
          </div>

          {/* Staff Roster Filter Card */}
          <div className="bg-surface-card rounded-2xl p-4 sm:p-5 shadow-sm border border-border-subtle">
            <div className="flex items-center justify-between mb-3">
              <span className="font-label-md text-label-md text-on-surface font-semibold">
                Staff Members
              </span>
              <span className="font-caption text-caption text-on-surface-variant font-medium">
                2 Active
              </span>
            </div>
            <div className="flex flex-col gap-2">
              <label className="flex items-center justify-between p-2.5 rounded-xl bg-surface-container-low hover:bg-surface-container transition-colors cursor-pointer border border-border-subtle/50">
                <div className="flex items-center gap-3">
                  <span className="w-3 h-3 rounded-full bg-primary"></span>
                  <div>
                    <p className="font-label-sm text-label-sm text-on-surface font-semibold">
                      Gift (Owner)
                    </p>
                    <p className="font-caption text-caption text-on-surface-variant">
                      Chair 1 • Master Barber
                    </p>
                  </div>
                </div>
                <input
                  type="checkbox"
                  checked={selectedStaffGift}
                  onChange={(e) => setSelectedStaffGift(e.target.checked)}
                  className="accent-primary w-4 h-4 rounded cursor-pointer"
                />
              </label>

              <label className="flex items-center justify-between p-2.5 rounded-xl bg-surface-container-low hover:bg-surface-container transition-colors cursor-pointer border border-border-subtle/50">
                <div className="flex items-center gap-3">
                  <span className="w-3 h-3 rounded-full bg-tertiary"></span>
                  <div>
                    <p className="font-label-sm text-label-sm text-on-surface font-semibold">
                      Samuel
                    </p>
                    <p className="font-caption text-caption text-on-surface-variant">
                      Chair 2 • Senior Stylist
                    </p>
                  </div>
                </div>
                <input
                  type="checkbox"
                  checked={selectedStaffSamuel}
                  onChange={(e) => setSelectedStaffSamuel(e.target.checked)}
                  className="accent-primary w-4 h-4 rounded cursor-pointer"
                />
              </label>
            </div>
          </div>

          {/* Utilization Mini Spark & Status Legend */}
          <div className="bg-surface-card rounded-2xl p-4 sm:p-5 shadow-sm border border-border-subtle flex flex-col gap-3">
            <div className="flex items-center justify-between">
              <span className="font-label-md text-label-md text-on-surface font-semibold">
                Capacity Today
              </span>
              <span className="font-label-sm text-label-sm text-status-confirmed font-semibold">
                78% Booked
              </span>
            </div>
            {/* Progress Meter */}
            <div className="w-full bg-surface-container-highest rounded-full h-2 overflow-hidden">
              <div
                className="bg-primary h-full rounded-full transition-all duration-500"
                style={{ width: '78%' }}
              ></div>
            </div>
            <p className="font-caption text-caption text-on-surface-variant">
              14 of 18 available time slots allocated.
            </p>
            {/* Status Legend */}
            <div className="pt-1 flex flex-wrap gap-2">
              <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-status-confirmed-bg text-status-confirmed font-caption text-caption font-semibold">
                <span className="w-1.5 h-1.5 rounded-full bg-status-confirmed"></span>
                Confirmed
              </span>
              <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-status-pending-bg text-status-pending font-caption text-caption font-semibold">
                <span className="w-1.5 h-1.5 rounded-full bg-status-pending"></span>
                Pending
              </span>
              <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-surface-muted text-on-surface-variant font-caption text-caption font-medium">
                <span className="w-1.5 h-1.5 rounded-full bg-outline"></span>
                Blocked
              </span>
            </div>
          </div>
        </div>

        {/* Central Time-Grid Area (Week View: Mon - Sat) */}
        <div className="xl:col-span-9 bg-surface-card rounded-2xl shadow-sm border border-border-subtle overflow-hidden flex flex-col">
          {/* Grid Header: Columns for Mon 21 to Sat 26 */}
          <div className="grid grid-cols-[64px_repeat(6,1fr)] bg-surface-container-low text-center select-none border-b border-border-subtle">
            <div className="py-3 flex items-center justify-center font-caption text-caption text-on-surface-variant font-medium">
              GMT+1
            </div>
            <div className="py-3">
              <p className="font-caption text-caption text-on-surface-variant">Mon</p>
              <p className="font-headline-md text-headline-md text-on-surface font-semibold">21</p>
            </div>
            <div className="py-3">
              <p className="font-caption text-caption text-on-surface-variant">Tue</p>
              <p className="font-headline-md text-headline-md text-on-surface font-semibold">22</p>
            </div>
            <div className="py-3">
              <p className="font-caption text-caption text-on-surface-variant">Wed</p>
              <p className="font-headline-md text-headline-md text-on-surface font-semibold">23</p>
            </div>
            {/* Thursday 24 - Highlighted Today Column */}
            <div className="py-3 bg-primary/10 relative">
              <div className="absolute -top-1 left-1/2 -translate-x-1/2 px-2.5 py-0.5 bg-primary text-on-primary text-[10px] font-caption font-bold rounded-full shadow-xs">
                TODAY
              </div>
              <p className="font-caption text-caption text-primary font-bold">Thu</p>
              <p className="font-headline-md text-headline-md text-primary font-extrabold">24</p>
            </div>
            <div className="py-3">
              <p className="font-caption text-caption text-on-surface-variant">Fri</p>
              <p className="font-headline-md text-headline-md text-on-surface font-semibold">25</p>
            </div>
            <div className="py-3">
              <p className="font-caption text-caption text-on-surface-variant">Sat</p>
              <p className="font-headline-md text-headline-md text-on-surface font-semibold">26</p>
            </div>
          </div>

          {/* Scrollable Schedule Grid (08:00 to 18:00) */}
          <div className="relative overflow-y-auto max-h-[720px] bg-surface-card">
            {/* Background Grid Cells */}
            <div className="grid grid-cols-[64px_repeat(6,1fr)]">
              {hours.map((hour) => {
                const isLunch = hour === '12:00';
                return (
                  <React.Fragment key={hour}>
                    <div className="h-20 flex items-start justify-center pt-2 font-caption text-caption text-on-surface-variant font-mono border-t border-border-subtle/50">
                      {hour}
                    </div>
                    {[1, 2, 3, 4, 5, 6].map((colIdx) => (
                      <div
                        key={colIdx}
                        className={`h-20 border-t border-l border-border-subtle/40 transition-colors ${
                          isLunch
                            ? 'bg-surface-muted/40'
                            : colIdx === 4
                            ? 'bg-primary/[0.02] hover:bg-primary/[0.05]'
                            : 'hover:bg-surface-container-low/60'
                        }`}
                      />
                    ))}
                  </React.Fragment>
                );
              })}
            </div>

            {/* Absolute Layer: Placed Appointments across days */}
            <div className="absolute inset-0 pointer-events-none grid grid-cols-[64px_repeat(6,1fr)]">
              <div></div>

              {/* Column Mon 21 */}
              <div className="relative pointer-events-auto px-1">
                {/* 09:00 Marcus E. */}
                <div
                  onClick={() =>
                    onSelectAppointment(
                      appointments.find((a) => a.id === 'apt-m1') || appointments[0]
                    )
                  }
                  className="absolute top-[80px] left-1 right-1 h-[76px] rounded-xl bg-surface-container p-2 shadow-xs hover:shadow-md cursor-pointer transition-all border-l-4 border-l-primary flex flex-col justify-between"
                >
                  <div>
                    <p className="font-label-sm text-label-sm text-on-surface font-semibold truncate">
                      Marcus E.
                    </p>
                    <p className="font-caption text-caption text-on-surface-variant truncate">
                      Fade & Line Up
                    </p>
                  </div>
                  <div className="flex items-center justify-between text-caption font-caption text-on-surface-variant">
                    <span>09:00</span>
                    <span className="font-semibold text-primary">5,000 F</span>
                  </div>
                </div>

                {/* 14:30 Alain D. */}
                <div
                  onClick={() =>
                    onSelectAppointment(
                      appointments.find((a) => a.id === 'apt-m2') || appointments[0]
                    )
                  }
                  className="absolute top-[520px] left-1 right-1 h-[76px] rounded-xl bg-surface-container p-2 shadow-xs hover:shadow-md cursor-pointer transition-all border-l-4 border-l-tertiary flex flex-col justify-between"
                >
                  <div>
                    <p className="font-label-sm text-label-sm text-on-surface font-semibold truncate">
                      Alain D.
                    </p>
                    <p className="font-caption text-caption text-on-surface-variant truncate">
                      Beard Sculpt
                    </p>
                  </div>
                  <div className="flex items-center justify-between text-caption font-caption text-on-surface-variant">
                    <span>14:30</span>
                    <span className="font-semibold text-tertiary">4,000 F</span>
                  </div>
                </div>
              </div>

              {/* Column Tue 22 */}
              <div className="relative pointer-events-auto px-1">
                {/* 10:30 David B. */}
                <div
                  onClick={() =>
                    onSelectAppointment(
                      appointments.find((a) => a.id === 'apt-t1') || appointments[0]
                    )
                  }
                  className="absolute top-[200px] left-1 right-1 h-[76px] rounded-xl bg-status-pending-bg p-2 shadow-xs hover:shadow-md cursor-pointer transition-all border-l-4 border-l-status-pending flex flex-col justify-between"
                >
                  <div>
                    <div className="flex items-center justify-between">
                      <p className="font-label-sm text-label-sm text-on-surface font-semibold truncate">
                        David B.
                      </p>
                      <span className="w-2 h-2 rounded-full bg-status-pending"></span>
                    </div>
                    <p className="font-caption text-caption text-status-pending truncate">
                      Scissor Cut
                    </p>
                  </div>
                  <div className="flex items-center justify-between text-caption font-caption text-on-surface-variant">
                    <span>10:30</span>
                    <span className="font-bold text-on-surface">6,000 F</span>
                  </div>
                </div>

                {/* 15:00 Blocked */}
                <div className="absolute top-[560px] left-1 right-1 h-[76px] rounded-xl bg-surface-muted p-2 flex flex-col justify-center items-center text-center opacity-80 cursor-not-allowed border border-border-subtle">
                  <span className="material-symbols-outlined text-[18px] text-outline">
                    do_not_disturb_on
                  </span>
                  <p className="font-caption text-caption text-on-surface-variant font-medium mt-0.5">
                    Sterilization & Restock
                  </p>
                </div>
              </div>

              {/* Column Wed 23 */}
              <div className="relative pointer-events-auto px-1">
                {/* 08:30 Cedric N. */}
                <div
                  onClick={() =>
                    onSelectAppointment(
                      appointments.find((a) => a.id === 'apt-w1') || appointments[0]
                    )
                  }
                  className="absolute top-[40px] left-1 right-1 h-[76px] rounded-xl bg-surface-container p-2 shadow-xs hover:shadow-md cursor-pointer transition-all border-l-4 border-l-primary flex flex-col justify-between"
                >
                  <div>
                    <p className="font-label-sm text-label-sm text-on-surface font-semibold truncate">
                      Cedric N.
                    </p>
                    <p className="font-caption text-caption text-on-surface-variant truncate">
                      Exec Haircut
                    </p>
                  </div>
                  <div className="flex items-center justify-between text-caption font-caption text-on-surface-variant">
                    <span>08:30</span>
                    <span className="font-semibold text-primary">8,000 F</span>
                  </div>
                </div>

                {/* 13:00 Boris T. */}
                <div
                  onClick={() =>
                    onSelectAppointment(
                      appointments.find((a) => a.id === 'apt-w2') || appointments[0]
                    )
                  }
                  className="absolute top-[400px] left-1 right-1 h-[96px] rounded-xl bg-surface-container p-2 shadow-xs hover:shadow-md cursor-pointer transition-all border-l-4 border-l-tertiary flex flex-col justify-between"
                >
                  <div>
                    <p className="font-label-sm text-label-sm text-on-surface font-semibold truncate">
                      Boris T.
                    </p>
                    <p className="font-caption text-caption text-on-surface-variant truncate">
                      Color Combo
                    </p>
                  </div>
                  <div className="flex items-center justify-between text-caption font-caption text-on-surface-variant">
                    <span>13:00 (75m)</span>
                    <span className="font-semibold text-tertiary">15,000 F</span>
                  </div>
                </div>
              </div>

              {/* Column Thu 24 (TODAY) */}
              <div className="relative pointer-events-auto px-1 bg-primary/[0.02]">
                {/* 09:00 Arthur Mbida */}
                <div
                  onClick={() =>
                    onSelectAppointment({
                      id: 'apt-thu-1',
                      clientName: 'Arthur Mbida',
                      clientPhone: '+237 675 443 890',
                      serviceId: 'srv-3',
                      serviceName: 'Deluxe Hot Towel Shave',
                      date: 'Thursday, Sep 24',
                      dayKey: '24',
                      dayOfWeek: 'Thu',
                      time: '09:00 AM',
                      endTime: '10:00 AM',
                      duration: '60 min',
                      staffName: 'Gift',
                      chair: 'Chair 1',
                      price: '7,000 FCFA',
                      rawPrice: 7000,
                      status: 'Confirmed',
                      notes: 'Sensitive skin, eucalyptus pre-shave cream.',
                    })
                  }
                  className="absolute top-[80px] left-1 right-1 h-[76px] rounded-xl bg-surface-card shadow-sm hover:shadow-md ring-1 ring-primary/30 p-2 cursor-pointer transition-all border-l-4 border-l-primary flex flex-col justify-between"
                >
                  <div>
                    <div className="flex items-center justify-between">
                      <p className="font-label-sm text-label-sm text-on-surface font-semibold truncate">
                        Arthur Mbida
                      </p>
                      <span className="material-symbols-outlined text-status-confirmed text-[14px]">
                        check_circle
                      </span>
                    </div>
                    <p className="font-caption text-caption text-on-surface-variant truncate">
                      Hot Towel Shave
                    </p>
                  </div>
                  <div className="flex items-center justify-between text-caption font-caption text-on-surface-variant">
                    <span>09:00</span>
                    <span className="font-bold text-primary">7,000 F</span>
                  </div>
                </div>

                {/* Current Time Indicator Ribbon (11:45 AM) */}
                <div className="absolute top-[300px] left-0 right-0 z-20 flex items-center pointer-events-none">
                  <span className="w-2.5 h-2.5 -ml-1 rounded-full bg-status-cancelled ring-2 ring-surface-card"></span>
                  <div className="h-0.5 w-full bg-status-cancelled shadow-xs"></div>
                </div>

                {/* KEY APPOINTMENT: 14:30 Jean Paul */}
                <div
                  onClick={() =>
                    onSelectAppointment(
                      appointments.find((a) => a.id === 'apt-1') || appointments[0]
                    )
                  }
                  className="absolute top-[520px] left-1 right-1 h-[68px] rounded-xl bg-primary text-on-primary shadow-md hover:scale-[1.02] p-2.5 cursor-pointer transition-all flex flex-col justify-between"
                >
                  <div className="flex items-center justify-between">
                    <p className="font-label-sm text-label-sm font-semibold truncate text-on-primary">
                      Jean Paul
                    </p>
                    <span className="px-1.5 py-0.5 rounded-full bg-white/20 text-[10px] font-caption font-medium">
                      Chair 1
                    </span>
                  </div>
                  <div className="flex items-center justify-between font-caption text-caption text-white/90">
                    <span className="truncate">Haircut + Beard</span>
                    <span className="font-bold">6,500 F</span>
                  </div>
                </div>

                {/* 16:00 Franck K. */}
                <div
                  onClick={() =>
                    onSelectAppointment({
                      id: 'apt-thu-3',
                      clientName: 'Franck K.',
                      clientPhone: '+237 691 300 782',
                      serviceId: 'srv-2',
                      serviceName: 'Skin Fade Combo',
                      date: 'Thursday, Sep 24',
                      dayKey: '24',
                      dayOfWeek: 'Thu',
                      time: '04:00 PM',
                      endTime: '05:00 PM',
                      duration: '60 min',
                      staffName: 'Samuel',
                      chair: 'Chair 2',
                      price: '6,000 FCFA',
                      rawPrice: 6000,
                      status: 'Pending',
                      notes: 'Razor shape-up included.',
                    })
                  }
                  className="absolute top-[640px] left-1 right-1 h-[76px] rounded-xl bg-status-pending-bg p-2 shadow-xs hover:shadow-md cursor-pointer transition-all border-l-4 border-l-status-pending flex flex-col justify-between"
                >
                  <div>
                    <p className="font-label-sm text-label-sm text-on-surface font-semibold truncate">
                      Franck K.
                    </p>
                    <p className="font-caption text-caption text-status-pending truncate">
                      Skin Fade Combo
                    </p>
                  </div>
                  <div className="flex items-center justify-between text-caption font-caption text-on-surface-variant">
                    <span>16:00</span>
                    <span className="font-semibold text-status-pending">6,000 F</span>
                  </div>
                </div>
              </div>

              {/* Column Fri 25 */}
              <div className="relative pointer-events-auto px-1">
                {/* 11:00 Stephane O. */}
                <div
                  onClick={() =>
                    onSelectAppointment(
                      appointments.find((a) => a.id === 'apt-f2') || appointments[0]
                    )
                  }
                  className="absolute top-[240px] left-1 right-1 h-[76px] rounded-xl bg-surface-container p-2 shadow-xs hover:shadow-md cursor-pointer transition-all border-l-4 border-l-primary flex flex-col justify-between"
                >
                  <div>
                    <p className="font-label-sm text-label-sm text-on-surface font-semibold truncate">
                      Stephane O.
                    </p>
                    <p className="font-caption text-caption text-on-surface-variant truncate">
                      Beard Trim
                    </p>
                  </div>
                  <div className="flex items-center justify-between text-caption font-caption text-on-surface-variant">
                    <span>11:00</span>
                    <span className="font-semibold text-primary">3,500 F</span>
                  </div>
                </div>

                {/* 15:00 Valerie M. */}
                <div
                  onClick={() =>
                    onSelectAppointment(
                      appointments.find((a) => a.id === 'apt-f3') || appointments[0]
                    )
                  }
                  className="absolute top-[560px] left-1 right-1 h-[116px] rounded-xl bg-surface-container p-2 shadow-xs hover:shadow-md cursor-pointer transition-all border-l-4 border-l-tertiary flex flex-col justify-between"
                >
                  <div>
                    <p className="font-label-sm text-label-sm text-on-surface font-semibold truncate">
                      Valerie M.
                    </p>
                    <p className="font-caption text-caption text-on-surface-variant truncate">
                      Kids Cuts (x2)
                    </p>
                  </div>
                  <div className="flex items-center justify-between text-caption font-caption text-on-surface-variant">
                    <span>15:00 (90m)</span>
                    <span className="font-semibold text-tertiary">9,000 F</span>
                  </div>
                </div>
              </div>

              {/* Column Sat 26 */}
              <div className="relative pointer-events-auto px-1">
                {/* 09:30 Gaston V. */}
                <div
                  onClick={() =>
                    onSelectAppointment(
                      appointments.find((a) => a.id === 'apt-s1') || appointments[0]
                    )
                  }
                  className="absolute top-[120px] left-1 right-1 h-[116px] rounded-xl bg-surface-container p-2 shadow-xs hover:shadow-md cursor-pointer transition-all border-l-4 border-l-primary flex flex-col justify-between"
                >
                  <div>
                    <div className="flex items-center gap-1">
                      <span className="material-symbols-outlined text-primary text-[14px]">star</span>
                      <p className="font-label-sm text-label-sm text-on-surface font-semibold truncate">
                        Gaston V. (VIP)
                      </p>
                    </div>
                    <p className="font-caption text-caption text-on-surface-variant truncate">
                      Groom Package
                    </p>
                  </div>
                  <div className="flex items-center justify-between text-caption font-caption text-on-surface-variant">
                    <span>09:30 (90m)</span>
                    <span className="font-bold text-primary">20,000 F</span>
                  </div>
                </div>

                {/* 14:00 Patrick T. */}
                <div
                  onClick={() =>
                    onSelectAppointment(
                      appointments.find((a) => a.id === 'apt-s2') || appointments[0]
                    )
                  }
                  className="absolute top-[480px] left-1 right-1 h-[76px] rounded-xl bg-surface-container p-2 shadow-xs hover:shadow-md cursor-pointer transition-all border-l-4 border-l-tertiary flex flex-col justify-between"
                >
                  <div>
                    <p className="font-label-sm text-label-sm text-on-surface font-semibold truncate">
                      Patrick T.
                    </p>
                    <p className="font-caption text-caption text-on-surface-variant truncate">
                      Hair Tattoo & Edge
                    </p>
                  </div>
                  <div className="flex items-center justify-between text-caption font-caption text-on-surface-variant">
                    <span>14:00</span>
                    <span className="font-semibold text-tertiary">8,500 F</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
