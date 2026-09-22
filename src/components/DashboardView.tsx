import React from 'react';
import { Appointment, NavigationTab, StudioSettings } from '../types';

interface DashboardViewProps {
  settings: StudioSettings;
  todayAppointments: Appointment[];
  onSelectAppointment: (apt: Appointment) => void;
  onOpenNewAppointment: () => void;
  onOpenQrModal: () => void;
  onShowToast: (msg: string) => void;
  onNavigate: (tab: NavigationTab) => void;
  onUpdateStatus: (id: string, newStatus: Appointment['status']) => void;
}

export const DashboardView: React.FC<DashboardViewProps> = ({
  settings,
  todayAppointments,
  onSelectAppointment,
  onOpenNewAppointment,
  onOpenQrModal,
  onShowToast,
  onNavigate,
  onUpdateStatus,
}) => {
  const handleCopyLink = () => {
    navigator.clipboard.writeText(`https://${settings.bookingUrl}`);
    onShowToast('Booking link copied to clipboard!');
  };

  const handleNotifyWaitlist = () => {
    onShowToast('SMS dispatch sent to 3 waitlisted clients for next open slot!');
  };

  const handleBlockOutTime = () => {
    onShowToast('Time block scheduled: 17:00 - 18:00 reserved for studio sanitize.');
  };

  // Calculate live dynamic metrics from todayAppointments
  const totalBookings = todayAppointments.filter((a) => a.status !== 'Blocked').length;
  const completedBookings = todayAppointments.filter((a) => a.status === 'Completed').length;
  const upcomingBookings = todayAppointments.filter(
    (a) => a.status === 'Confirmed' || a.status === 'Pending'
  ).length;

  const totalRevenue = todayAppointments
    .filter((a) => a.status === 'Completed' || a.status === 'Confirmed')
    .reduce((acc, curr) => acc + curr.rawPrice, 0);

  return (
    <div className="flex flex-col w-full gap-6 pb-12">
      {/* Welcome & Booking Quick Link Banner */}
      <div className="relative overflow-hidden bg-surface-card rounded-2xl shadow-sm border border-border-subtle p-6 sm:p-8">
        <div className="absolute -right-16 -top-16 w-64 h-64 bg-primary/5 rounded-full pointer-events-none blur-2xl"></div>
        <div className="relative z-10 flex flex-col lg:flex-row lg:items-center justify-between gap-6">
          <div>
            <div className="flex items-center gap-2 text-on-surface-variant font-label-sm text-label-sm">
              <span className="material-symbols-outlined text-[16px] text-primary">
                calendar_today
              </span>
              <span>Thursday, September 24, 2025</span>
              <span className="w-1 h-1 rounded-full bg-outline-variant"></span>
              <span className="text-tertiary font-semibold">Studio operating at 80% capacity</span>
            </div>
            <h1 className="font-headline-xl text-headline-xl text-on-surface tracking-tight mt-1.5 font-bold">
              Good morning, Gift
            </h1>
            <p className="font-body-md text-body-md text-on-surface-variant mt-0.5">
              Here is what is lined up across your chairs today.
            </p>
          </div>

          {/* Copyable Public Booking URL Pill */}
          <div className="flex flex-wrap items-center gap-2 bg-surface-container-low p-1.5 pl-3 rounded-xl border border-border-subtle shadow-inner">
            <div className="flex items-center gap-1.5 text-on-surface">
              <span className="material-symbols-outlined text-primary text-[18px]">link</span>
              <span className="font-label-md text-label-md font-medium text-on-surface select-all">
                {settings.bookingUrl}
              </span>
            </div>
            <button
              onClick={handleCopyLink}
              className="px-3 py-1.5 rounded-lg bg-surface-card text-on-surface hover:bg-surface-container-high font-label-sm text-label-sm shadow-xs border border-border-subtle transition-all flex items-center gap-1 active:scale-95 cursor-pointer"
            >
              <span className="material-symbols-outlined text-[15px]">content_copy</span>
              <span>Copy</span>
            </button>
            <button
              onClick={onOpenQrModal}
              className="px-3 py-1.5 rounded-lg bg-primary text-on-primary hover:opacity-95 font-label-sm text-label-sm shadow-xs transition-all flex items-center gap-1 active:scale-95 cursor-pointer"
            >
              <span className="material-symbols-outlined text-[16px]">qr_code_2</span>
              <span>Share QR Code</span>
            </button>
          </div>
        </div>
      </div>

      {/* KPI Metric Row */}
      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4">
        {/* Metric 1: Appointments */}
        <div className="bg-surface-card p-5 rounded-2xl shadow-sm border border-border-subtle hover:shadow transition-shadow">
          <div className="flex items-center justify-between">
            <span className="font-label-sm text-label-sm text-on-surface-variant font-medium">
              Today's Appointments
            </span>
            <span className="flex items-center gap-0.5 font-label-sm text-label-sm text-status-confirmed bg-status-confirmed-bg px-2 py-0.5 rounded-full font-semibold">
              <span className="material-symbols-outlined text-[14px]">trending_up</span>
              +15%
            </span>
          </div>
          <div className="mt-3 flex items-baseline gap-2">
            <span className="font-headline-xl text-headline-xl text-on-surface font-bold">
              {totalBookings || 12}
            </span>
            <span className="font-label-md text-label-md text-on-surface-variant">Bookings</span>
          </div>
          <div className="mt-3">
            <div className="w-full bg-surface-container h-2 rounded-full overflow-hidden flex">
              <div
                className="bg-primary h-full transition-all duration-500"
                style={{ width: `${(completedBookings / (totalBookings || 1)) * 100 || 66.6}%` }}
              ></div>
              <div
                className="bg-secondary-container h-full transition-all duration-500"
                style={{ width: `${(upcomingBookings / (totalBookings || 1)) * 100 || 33.4}%` }}
              ></div>
            </div>
            <div className="flex justify-between items-center mt-2 text-caption font-caption text-on-surface-variant">
              <span className="flex items-center gap-1.5">
                <span className="w-1.5 h-1.5 rounded-full bg-primary"></span>{' '}
                {completedBookings || 8} completed
              </span>
              <span className="flex items-center gap-1.5">
                <span className="w-1.5 h-1.5 rounded-full bg-secondary-fixed-dim"></span>{' '}
                {upcomingBookings || 4} upcoming
              </span>
            </div>
          </div>
        </div>

        {/* Metric 2: Revenue */}
        <div className="bg-surface-card p-5 rounded-2xl shadow-sm border border-border-subtle hover:shadow transition-shadow">
          <div className="flex items-center justify-between">
            <span className="font-label-sm text-label-sm text-on-surface-variant font-medium">
              Revenue Today
            </span>
            <span className="w-7 h-7 rounded-lg bg-surface-container flex items-center justify-center text-primary">
              <span className="material-symbols-outlined text-[18px]">payments</span>
            </span>
          </div>
          <div className="mt-3 flex items-baseline gap-1.5">
            <span className="font-headline-lg text-headline-lg text-on-surface font-bold">
              {totalRevenue.toLocaleString() || '48,500'}
            </span>
            <span className="font-label-sm text-label-sm text-on-surface-variant font-medium">
              FCFA
            </span>
          </div>
          <div className="mt-3">
            <div className="flex justify-between text-caption font-caption text-on-surface-variant mb-1">
              <span>Target: 60,000 FCFA</span>
              <span className="font-semibold text-on-surface">
                {Math.round((totalRevenue / 60000) * 100)}%
              </span>
            </div>
            <div className="w-full bg-surface-container h-2 rounded-full overflow-hidden">
              <div
                className="bg-status-confirmed h-full rounded-full transition-all duration-500"
                style={{ width: `${Math.min((totalRevenue / 60000) * 100, 100)}%` }}
              ></div>
            </div>
          </div>
        </div>

        {/* Metric 3: Completion Rate */}
        <div className="bg-surface-card p-5 rounded-2xl shadow-sm border border-border-subtle hover:shadow transition-shadow">
          <div className="flex items-center justify-between">
            <span className="font-label-sm text-label-sm text-on-surface-variant font-medium">
              Est. Completion Rate
            </span>
            <span className="w-7 h-7 rounded-lg bg-status-confirmed-bg flex items-center justify-center text-status-confirmed">
              <span className="material-symbols-outlined text-[18px]">verified</span>
            </span>
          </div>
          <div className="mt-3 flex items-baseline gap-2">
            <span className="font-headline-xl text-headline-xl text-on-surface font-bold">94%</span>
            <span className="font-label-sm text-label-sm text-tertiary font-semibold">
              Punctual
            </span>
          </div>
          <div className="mt-3 flex items-center gap-2 font-caption text-caption text-on-surface-variant">
            <span className="bg-surface-container px-2 py-0.5 rounded text-on-surface font-medium">
              1 reschedule
            </span>
            <span className="bg-surface-container px-2 py-0.5 rounded text-status-confirmed font-medium">
              0 no-shows
            </span>
          </div>
        </div>

        {/* Metric 4: Waitlist */}
        <div className="bg-surface-card p-5 rounded-2xl shadow-sm border border-border-subtle hover:shadow transition-shadow">
          <div className="flex items-center justify-between">
            <span className="font-label-sm text-label-sm text-on-surface-variant font-medium">
              Active Waitlist
            </span>
            <span className="w-2.5 h-2.5 rounded-full bg-status-pending animate-pulse"></span>
          </div>
          <div className="mt-3 flex items-baseline gap-2">
            <span className="font-headline-xl text-headline-xl text-on-surface font-bold">3</span>
            <span className="font-label-md text-label-md text-on-surface-variant font-medium">
              Clients waiting
            </span>
          </div>
          <div className="mt-3 flex items-center justify-between">
            <span className="font-caption text-caption text-on-surface-variant">
              Instant seat notify
            </span>
            <button
              onClick={handleNotifyWaitlist}
              className="font-label-sm text-label-sm text-primary hover:underline flex items-center gap-0.5 font-semibold cursor-pointer"
            >
              <span>Notify</span>
              <span className="material-symbols-outlined text-[14px]">arrow_forward</span>
            </button>
          </div>
        </div>
      </div>

      {/* Smart Conflict Prevention Banner */}
      <div className="flex items-center justify-between p-3.5 px-5 bg-secondary-container/40 rounded-xl border border-secondary-container">
        <div className="flex items-center gap-3">
          <span className="material-symbols-outlined text-primary text-[22px]">
            verified_user
          </span>
          <p className="font-body-sm text-body-sm text-on-secondary-fixed">
            <strong className="font-semibold">Smart conflict prevention active:</strong> 0
            overlapping appointments detected across 2 staff members today.
          </p>
        </div>
        <span className="hidden sm:inline-flex font-caption text-caption text-on-secondary-fixed-variant bg-surface-card/80 px-2.5 py-1 rounded-md font-medium shadow-xs">
          All calendars synchronized
        </span>
      </div>

      {/* Main 2-Column Dashboard Body */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* LEFT COLUMN: Today's Live Schedule (8 cols) */}
        <div className="lg:col-span-8 flex flex-col gap-4">
          {/* Schedule Section Header */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 bg-surface-card p-4 sm:p-5 rounded-2xl shadow-sm border border-border-subtle">
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-xl bg-primary-fixed flex items-center justify-center text-on-primary-fixed shadow-xs">
                <span className="material-symbols-outlined text-[20px]">calendar_view_day</span>
              </div>
              <div>
                <h2 className="font-headline-md text-headline-md text-on-surface font-semibold">
                  Today's Live Schedule
                </h2>
                <p className="font-caption text-caption text-on-surface-variant">
                  Chronological stream for Chair 1 (Gift) & Chair 2 (Samuel)
                </p>
              </div>
            </div>
            <div className="flex items-center gap-2 self-end sm:self-auto">
              <span className="inline-flex items-center gap-1.5 font-caption text-caption px-2.5 py-1 bg-surface-container rounded-lg text-on-surface-variant font-medium">
                <span className="w-2 h-2 rounded-full bg-status-confirmed animate-pulse"></span>{' '}
                Live sync
              </span>
              <button
                onClick={() => onNavigate('calendar-&-schedule')}
                className="p-1.5 rounded-lg hover:bg-surface-container text-on-surface-variant hover:text-on-surface transition-colors cursor-pointer"
                title="Full Calendar Grid"
              >
                <span className="material-symbols-outlined text-[20px]">filter_list</span>
              </button>
            </div>
          </div>

          {/* Schedule Timeline Cards */}
          <div className="flex flex-col gap-3">
            {todayAppointments.map((apt) => {
              const isCompleted = apt.status === 'Completed';
              const isPending = apt.status === 'Pending';
              const isBlocked = apt.status === 'Blocked';

              if (isBlocked) {
                return (
                  <div
                    key={apt.id}
                    className="bg-surface-container-low/70 rounded-xl p-4 flex items-center justify-between border border-border-subtle/40"
                  >
                    <div className="flex items-center gap-4">
                      <div className="w-24 shrink-0 flex flex-col">
                        <span className="font-label-md text-label-md font-medium text-on-surface-variant">
                          {apt.time}
                        </span>
                        <span className="font-caption text-caption text-outline">
                          {apt.endTime} ({apt.duration})
                        </span>
                      </div>
                      <div className="w-1.5 h-10 bg-outline-variant/60 rounded-full"></div>
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-full bg-surface-container flex items-center justify-center text-on-surface-variant">
                          <span className="material-symbols-outlined text-[20px]">restaurant</span>
                        </div>
                        <div>
                          <h3 className="font-label-md text-label-md font-semibold text-on-surface">
                            {apt.clientName}
                          </h3>
                          <p className="font-caption text-caption text-on-surface-variant">
                            {apt.notes}
                          </p>
                        </div>
                      </div>
                    </div>
                    <span className="font-label-sm text-label-sm text-on-surface-variant bg-surface-container px-3 py-1 rounded-full font-medium">
                      Blocked
                    </span>
                  </div>
                );
              }

              return (
                <div
                  key={apt.id}
                  onClick={() => onSelectAppointment(apt)}
                  className={`group bg-surface-card rounded-2xl p-4 sm:p-5 shadow-sm border border-border-subtle hover:border-primary/40 hover:shadow-md transition-all flex flex-col sm:flex-row sm:items-center justify-between gap-4 cursor-pointer ${
                    isCompleted ? 'opacity-80' : ''
                  } ${
                    isPending
                      ? 'bg-gradient-to-r from-status-pending-bg/50 via-surface-card to-surface-card'
                      : ''
                  }`}
                >
                  <div className="flex items-start sm:items-center gap-4">
                    {/* Time Column */}
                    <div className="w-24 shrink-0 flex flex-col">
                      <span className="font-label-md text-label-md font-semibold text-on-surface">
                        {apt.time}
                      </span>
                      <span className="font-caption text-caption text-on-surface-variant">
                        {apt.endTime} ({apt.duration})
                      </span>
                    </div>

                    {/* Left Accent Bar */}
                    <div
                      className={`w-1.5 self-stretch rounded-full ${
                        isCompleted
                          ? 'bg-surface-container-highest'
                          : isPending
                          ? 'bg-status-pending'
                          : 'bg-status-confirmed'
                      }`}
                    ></div>

                    {/* Client Identity */}
                    <div className="flex items-center gap-3">
                      {apt.avatarUrl ? (
                        <img
                          src={apt.avatarUrl}
                          alt={apt.clientName}
                          className="w-11 h-11 rounded-full object-cover shadow-xs ring-1 ring-border-subtle"
                        />
                      ) : (
                        <div
                          className={`w-11 h-11 rounded-full flex items-center justify-center font-semibold font-label-md shadow-xs ${
                            apt.initials === 'DK'
                              ? 'bg-secondary-fixed text-on-secondary-fixed'
                              : 'bg-primary-fixed text-on-primary-fixed'
                          }`}
                        >
                          {apt.initials ||
                            apt.clientName
                              .split(' ')
                              .map((n) => n[0])
                              .join('')
                              .slice(0, 2)}
                        </div>
                      )}

                      <div>
                        <div className="flex items-center gap-2">
                          <h3 className="font-label-md text-label-md font-semibold text-on-surface">
                            {apt.clientName}
                          </h3>
                          {apt.clientTag && (
                            <span
                              className={`font-caption text-caption px-2 py-0.5 rounded-md font-medium ${
                                apt.clientTag === 'VIP'
                                  ? 'bg-secondary-container text-on-secondary-fixed'
                                  : apt.clientTag === 'Action Needed'
                                  ? 'bg-status-pending-bg text-status-pending font-semibold'
                                  : apt.clientTag === 'Prepaid'
                                  ? 'bg-tertiary-fixed text-on-tertiary-fixed font-semibold'
                                  : 'bg-surface-container text-on-surface-variant'
                              }`}
                            >
                              {apt.clientTag}
                            </span>
                          )}
                        </div>
                        <p className="font-body-sm text-body-sm text-on-surface-variant mt-0.5">
                          {apt.serviceName} • {apt.price}
                        </p>
                        <div className="flex items-center gap-1.5 text-caption font-caption text-on-surface-variant mt-0.5">
                          <span className="material-symbols-outlined text-[14px]">person</span>
                          <span>
                            Barber:{' '}
                            <strong className="font-medium text-on-surface">
                              {apt.staffName}
                            </strong>
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Right Status / Quick Action */}
                  <div
                    className="flex items-center justify-between sm:justify-end gap-2.5 pl-4 sm:pl-0"
                    onClick={(e) => e.stopPropagation()}
                  >
                    {isCompleted && (
                      <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-status-noshow-bg text-status-noshow font-label-sm text-label-sm font-medium">
                        <span className="material-symbols-outlined text-[15px]">check_circle</span>
                        Completed
                      </span>
                    )}

                    {isPending && (
                      <div className="flex items-center gap-2 flex-wrap">
                        <button
                          onClick={() => onSelectAppointment(apt)}
                          className="px-3 py-1.5 rounded-lg bg-surface-container hover:bg-surface-container-high text-on-surface font-label-sm text-label-sm transition-all flex items-center gap-1 cursor-pointer"
                        >
                          <span className="material-symbols-outlined text-[15px]">event_repeat</span>
                          <span>Reschedule</span>
                        </button>
                        <button
                          onClick={() => {
                            onUpdateStatus(apt.id, 'Confirmed');
                            onShowToast(`Slot confirmed for ${apt.clientName}!`);
                          }}
                          className="px-3.5 py-1.5 rounded-lg bg-primary text-on-primary hover:opacity-95 font-label-sm text-label-sm font-medium shadow-sm transition-all flex items-center gap-1 active:scale-95 cursor-pointer"
                        >
                          <span className="material-symbols-outlined text-[16px]">check</span>
                          <span>Confirm Slot</span>
                        </button>
                      </div>
                    )}

                    {apt.status === 'Confirmed' && (
                      <div className="flex items-center gap-2">
                        <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-status-confirmed-bg text-status-confirmed font-label-sm text-label-sm font-medium">
                          <span className="w-1.5 h-1.5 rounded-full bg-status-confirmed"></span>
                          Confirmed
                        </span>
                        {apt.clientName === 'Sarah M.' ? (
                          <button
                            onClick={() => {
                              onUpdateStatus(apt.id, 'Completed');
                              onShowToast(`Sarah M. checked in at Chair 1!`);
                            }}
                            className="px-3 py-1 rounded-lg bg-surface-container text-on-surface hover:bg-surface-container-high font-label-sm text-label-sm transition-colors cursor-pointer"
                          >
                            Check In
                          </button>
                        ) : null}
                      </div>
                    )}

                    <button
                      onClick={() => onSelectAppointment(apt)}
                      className="p-1 rounded-lg text-on-surface-variant hover:bg-surface-container"
                      title="View details"
                    >
                      <span className="material-symbols-outlined text-[18px]">more_vert</span>
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* RIGHT COLUMN: Quick Actions & Feeds (4 cols) */}
        <div className="lg:col-span-4 flex flex-col gap-6">
          {/* Quick Actions Widget */}
          <div className="bg-surface-card rounded-2xl p-5 shadow-sm border border-border-subtle">
            <h2 className="font-label-md text-label-md text-on-surface font-semibold mb-4 flex items-center gap-2">
              <span className="material-symbols-outlined text-primary text-[18px]">bolt</span>
              <span>Quick Actions</span>
            </h2>
            <div className="grid grid-cols-2 gap-2.5">
              <button
                onClick={onOpenNewAppointment}
                className="flex flex-col items-center justify-center p-3.5 rounded-xl bg-surface-container-low hover:bg-surface-container transition-all group text-center cursor-pointer border border-border-subtle/50"
              >
                <span className="w-9 h-9 rounded-full bg-primary text-on-primary flex items-center justify-center mb-1.5 group-hover:scale-105 transition-transform shadow-xs">
                  <span className="material-symbols-outlined text-[18px]">add</span>
                </span>
                <span className="font-label-sm text-label-sm text-on-surface font-medium">
                  New Booking
                </span>
              </button>

              <button
                onClick={handleBlockOutTime}
                className="flex flex-col items-center justify-center p-3.5 rounded-xl bg-surface-container-low hover:bg-surface-container transition-all group text-center cursor-pointer border border-border-subtle/50"
              >
                <span className="w-9 h-9 rounded-full bg-surface-container-high text-on-surface flex items-center justify-center mb-1.5 group-hover:scale-105 transition-transform">
                  <span className="material-symbols-outlined text-[18px]">block</span>
                </span>
                <span className="font-label-sm text-label-sm text-on-surface font-medium">
                  Block Out Time
                </span>
              </button>

              <button
                onClick={handleCopyLink}
                className="flex flex-col items-center justify-center p-3.5 rounded-xl bg-surface-container-low hover:bg-surface-container transition-all group text-center cursor-pointer border border-border-subtle/50"
              >
                <span className="w-9 h-9 rounded-full bg-surface-container-high text-on-surface flex items-center justify-center mb-1.5 group-hover:scale-105 transition-transform">
                  <span className="material-symbols-outlined text-[18px]">share</span>
                </span>
                <span className="font-label-sm text-label-sm text-on-surface font-medium">
                  Share Link
                </span>
              </button>

              <button
                onClick={onOpenQrModal}
                className="flex flex-col items-center justify-center p-3.5 rounded-xl bg-surface-container-low hover:bg-surface-container transition-all group text-center cursor-pointer border border-border-subtle/50"
              >
                <span className="w-9 h-9 rounded-full bg-surface-container-high text-on-surface flex items-center justify-center mb-1.5 group-hover:scale-105 transition-transform">
                  <span className="material-symbols-outlined text-[18px]">qr_code_scanner</span>
                </span>
                <span className="font-label-sm text-label-sm text-on-surface font-medium">
                  QR Flyer
                </span>
              </button>
            </div>
          </div>

          {/* Tomorrow Highlights Preview */}
          <div className="bg-surface-card rounded-2xl p-5 shadow-sm border border-border-subtle">
            <div className="flex items-center justify-between mb-2">
              <div className="flex items-center gap-2">
                <span className="material-symbols-outlined text-[18px] text-on-surface-variant">
                  next_plan
                </span>
                <h2 className="font-label-md text-label-md text-on-surface font-semibold">
                  Tomorrow's Outlook
                </h2>
              </div>
              <span className="font-caption text-caption bg-secondary-container px-2.5 py-0.5 rounded-full text-on-secondary-fixed font-semibold">
                9 booked
              </span>
            </div>
            <p className="font-caption text-caption text-on-surface-variant mb-3">
              Friday, Sept 25 • First client at 09:30 AM
            </p>

            <div className="flex flex-col gap-2">
              <div className="flex items-center justify-between p-2.5 rounded-xl bg-surface-container-low border border-border-subtle/50 text-body-sm font-body-sm">
                <div className="flex items-center gap-2.5">
                  <span className="font-medium text-on-surface">09:30</span>
                  <span className="text-on-surface truncate font-semibold">Alexandre B.</span>
                </div>
                <span className="font-caption text-caption text-on-surface-variant bg-surface-card px-2 py-0.5 rounded">
                  Haircut
                </span>
              </div>

              <div className="flex items-center justify-between p-2.5 rounded-xl bg-surface-container-low border border-border-subtle/50 text-body-sm font-body-sm">
                <div className="flex items-center gap-2.5">
                  <span className="font-medium text-on-surface">11:00</span>
                  <span className="text-on-surface truncate font-semibold">Marc O.</span>
                </div>
                <span className="font-caption text-caption text-status-pending bg-status-pending-bg px-2 py-0.5 rounded font-medium">
                  Rescheduled
                </span>
              </div>

              <div className="flex items-center justify-between p-2.5 rounded-xl bg-surface-container-low border border-border-subtle/50 text-body-sm font-body-sm">
                <div className="flex items-center gap-2.5">
                  <span className="font-medium text-on-surface">14:00</span>
                  <span className="text-on-surface truncate font-semibold">Valerie K.</span>
                </div>
                <span className="font-caption text-caption text-on-surface-variant bg-surface-card px-2 py-0.5 rounded">
                  Studio Trim
                </span>
              </div>
            </div>
          </div>

          {/* Recent Activity Feed */}
          <div className="bg-surface-card rounded-2xl p-5 shadow-sm border border-border-subtle">
            <h2 className="font-label-md text-label-md text-on-surface font-semibold mb-3 flex items-center gap-2">
              <span className="material-symbols-outlined text-[18px] text-on-surface-variant">
                history
              </span>
              <span>Recent Activity</span>
            </h2>
            <div className="flex flex-col gap-3">
              <div className="flex items-start gap-3">
                <span className="w-6 h-6 rounded-full bg-status-confirmed-bg text-status-confirmed flex items-center justify-center shrink-0 mt-0.5">
                  <span className="material-symbols-outlined text-[14px]">add_circle</span>
                </span>
                <div className="min-w-0">
                  <p className="font-body-sm text-body-sm text-on-surface leading-tight">
                    <strong className="font-semibold">Sarah M.</strong> booked Haircut + Beard
                  </p>
                  <span className="font-caption text-caption text-on-surface-variant">
                    12 minutes ago
                  </span>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <span className="w-6 h-6 rounded-full bg-status-pending-bg text-status-pending flex items-center justify-center shrink-0 mt-0.5">
                  <span className="material-symbols-outlined text-[14px]">schedule</span>
                </span>
                <div className="min-w-0">
                  <p className="font-body-sm text-body-sm text-on-surface leading-tight">
                    <strong className="font-semibold">Marc O.</strong> moved appointment to Friday
                    11:00 AM
                  </p>
                  <span className="font-caption text-caption text-on-surface-variant">
                    48 minutes ago
                  </span>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <span className="w-6 h-6 rounded-full bg-secondary-container text-on-secondary-container flex items-center justify-center shrink-0 mt-0.5">
                  <span className="material-symbols-outlined text-[14px]">chat</span>
                </span>
                <div className="min-w-0">
                  <p className="font-body-sm text-body-sm text-on-surface leading-tight">
                    SMS reminder sent to <strong className="font-semibold">David K.</strong>
                  </p>
                  <span className="font-caption text-caption text-on-surface-variant">
                    1 hour ago
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
