import React, { useState } from 'react';
import { NavigationTab, ServiceItem, StudioSettings, WorkingDay } from '../types';
import { STUDIO_COVER_URL } from './Sidebar';

interface ServicesAvailabilityViewProps {
  services: ServiceItem[];
  workingDays: WorkingDay[];
  settings: StudioSettings;
  onUpdateServices: (services: ServiceItem[]) => void;
  onUpdateWorkingDays: (days: WorkingDay[]) => void;
  onUpdateSettings: (settings: StudioSettings) => void;
  onNavigate: (tab: NavigationTab) => void;
  onShowToast: (msg: string) => void;
  initialTab?: 'services' | 'hours' | 'staff' | 'breaks';
}

export const ServicesAvailabilityView: React.FC<ServicesAvailabilityViewProps> = ({
  services,
  workingDays,
  settings,
  onUpdateServices,
  onUpdateWorkingDays,
  onUpdateSettings,
  onNavigate,
  onShowToast,
  initialTab = 'services',
}) => {
  const [activeSubTab, setActiveSubTab] = useState<'services' | 'hours' | 'staff' | 'breaks'>(
    initialTab
  );

  // Local state for settings form
  const [bufferMins, setBufferMins] = useState(settings.appointmentBufferMinutes);
  const [minNoticeHours, setMinNoticeHours] = useState(settings.minimumNoticeHours);
  const [bookingHorizonDays, setBookingHorizonDays] = useState(settings.maxBookingHorizonDays);

  // Add Service Modal state
  const [isAddServiceOpen, setIsAddServiceOpen] = useState(false);
  const [newServiceName, setNewServiceName] = useState('');
  const [newServicePrice, setNewServicePrice] = useState(4000);
  const [newServiceDuration, setNewServiceDuration] = useState(30);
  const [newServiceDesc, setNewServiceDesc] = useState('');

  const toggleServiceActive = (id: string) => {
    const updated = services.map((s) => (s.id === id ? { ...s, isActive: !s.isActive } : s));
    onUpdateServices(updated);
    const srv = services.find((s) => s.id === id);
    onShowToast(`${srv?.name} is now ${!srv?.isActive ? 'active' : 'inactive'}`);
  };

  const handleDuplicate = (srv: ServiceItem) => {
    const dup: ServiceItem = {
      ...srv,
      id: `srv-${Date.now()}`,
      name: `${srv.name} (Copy)`,
    };
    onUpdateServices([...services, dup]);
    onShowToast(`Duplicated ${srv.name}`);
  };

  const handleDelete = (id: string) => {
    const srv = services.find((s) => s.id === id);
    onUpdateServices(services.filter((s) => s.id !== id));
    onShowToast(`Removed ${srv?.name}`);
  };

  const handleCreateService = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newServiceName.trim()) return;

    const created: ServiceItem = {
      id: `srv-${Date.now()}`,
      name: newServiceName.trim(),
      durationMinutes: newServiceDuration,
      priceFcfa: newServicePrice,
      assignedStaff: ['Gift', 'Samuel'],
      isActive: true,
      iconName: 'content_cut',
      description: newServiceDesc.trim() || 'Custom salon service',
    };

    onUpdateServices([...services, created]);
    onShowToast(`Created new service: ${created.name}!`);
    setIsAddServiceOpen(false);
    setNewServiceName('');
    setNewServiceDesc('');
  };

  const handleCopyMonToWeekdays = () => {
    const mon = workingDays.find((d) => d.dayName === 'Monday') || workingDays[0];
    const updated = workingDays.map((d) => {
      if (['Tuesday', 'Wednesday', 'Thursday', 'Friday'].includes(d.dayName)) {
        return {
          ...d,
          isOpen: mon.isOpen,
          openTime: mon.openTime,
          closeTime: mon.closeTime,
          hasBreak: mon.hasBreak,
          breakStart: mon.breakStart,
          breakEnd: mon.breakEnd,
        };
      }
      return d;
    });
    onUpdateWorkingDays(updated);
    onShowToast('Applied Monday schedule to all weekdays (Tue–Fri)!');
  };

  const handleSaveSchedulingRules = () => {
    onUpdateSettings({
      ...settings,
      appointmentBufferMinutes: bufferMins,
      minimumNoticeHours: minNoticeHours,
      maxBookingHorizonDays: bookingHorizonDays,
    });
    onShowToast('Availability & scheduling rules saved successfully!');
  };

  return (
    <div className="flex flex-col w-full pb-12">
      {/* Sub-navigation Tabs */}
      <div className="flex items-center gap-2 border-b border-border-subtle pb-4 mb-6 overflow-x-auto">
        <button
          onClick={() => setActiveSubTab('services')}
          className={`flex items-center gap-2 px-4 py-2 rounded-xl font-label-md text-label-md whitespace-nowrap transition-all cursor-pointer ${
            activeSubTab === 'services'
              ? 'bg-primary text-on-primary font-semibold shadow-xs'
              : 'bg-surface-card text-on-surface-variant hover:text-on-surface border border-border-subtle'
          }`}
        >
          <span className="material-symbols-outlined text-[18px]">content_cut</span>
          <span>Services Catalog ({services.length})</span>
        </button>

        <button
          onClick={() => setActiveSubTab('hours')}
          className={`flex items-center gap-2 px-4 py-2 rounded-xl font-label-md text-label-md whitespace-nowrap transition-all cursor-pointer ${
            activeSubTab === 'hours'
              ? 'bg-primary text-on-primary font-semibold shadow-xs'
              : 'bg-surface-card text-on-surface-variant hover:text-on-surface border border-border-subtle'
          }`}
        >
          <span className="material-symbols-outlined text-[18px]">schedule</span>
          <span>Weekly Working Hours</span>
        </button>

        <button
          onClick={() => setActiveSubTab('staff')}
          className={`flex items-center gap-2 px-4 py-2 rounded-xl font-label-md text-label-md whitespace-nowrap transition-all cursor-pointer ${
            activeSubTab === 'staff'
              ? 'bg-primary text-on-primary font-semibold shadow-xs'
              : 'bg-surface-card text-on-surface-variant hover:text-on-surface border border-border-subtle'
          }`}
        >
          <span className="material-symbols-outlined text-[18px]">badge</span>
          <span>Staff & Team Availability</span>
        </button>

        <button
          onClick={() => setActiveSubTab('breaks')}
          className={`flex items-center gap-2 px-4 py-2 rounded-xl font-label-md text-label-md whitespace-nowrap transition-all cursor-pointer ${
            activeSubTab === 'breaks'
              ? 'bg-primary text-on-primary font-semibold shadow-xs'
              : 'bg-surface-card text-on-surface-variant hover:text-on-surface border border-border-subtle'
          }`}
        >
          <span className="material-symbols-outlined text-[18px]">event_busy</span>
          <span>Breaks & Blocked Dates</span>
        </button>
      </div>

      {/* Main 2-Column Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* Left Column (8 cols): Active Tab Content */}
        <div className="lg:col-span-8 flex flex-col gap-6">
          {/* TAB 1: Services Catalog */}
          {activeSubTab === 'services' && (
            <div className="flex flex-col gap-4">
              {/* Header card */}
              <div className="bg-surface-card rounded-2xl p-5 shadow-sm border border-border-subtle flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div>
                  <h2 className="font-headline-md text-headline-md text-on-surface font-semibold">
                    Services & Pricing Menu
                  </h2>
                  <p className="font-body-sm text-body-sm text-on-surface-variant mt-0.5">
                    Configure services, durations, prices in FCFA, and assigned barber chairs.
                  </p>
                </div>
                <button
                  onClick={() => setIsAddServiceOpen(true)}
                  className="flex items-center gap-1.5 bg-primary text-on-primary font-label-md text-label-md px-4 py-2 rounded-xl shadow-sm hover:opacity-95 active:scale-[0.98] transition-all cursor-pointer shrink-0"
                >
                  <span className="material-symbols-outlined text-[18px]">add</span>
                  <span>Add New Service</span>
                </button>
              </div>

              {/* Service Cards List */}
              <div className="flex flex-col gap-3">
                {services.map((srv) => (
                  <div
                    key={srv.id}
                    className={`bg-surface-card rounded-2xl p-5 shadow-sm border border-border-subtle hover:border-primary/40 transition-all flex flex-col sm:flex-row sm:items-center justify-between gap-4 ${
                      !srv.isActive ? 'opacity-65 bg-surface-muted/30' : ''
                    }`}
                  >
                    <div className="flex items-start gap-4">
                      <div className="w-12 h-12 rounded-xl bg-secondary-container text-on-secondary-fixed flex items-center justify-center shrink-0 shadow-xs">
                        <span className="material-symbols-outlined text-[24px]">
                          {srv.iconName}
                        </span>
                      </div>
                      <div>
                        <div className="flex items-center gap-2.5 flex-wrap">
                          <h3 className="font-label-lg text-label-lg font-semibold text-on-surface">
                            {srv.name}
                          </h3>
                          {srv.tag && (
                            <span
                              className={`px-2.5 py-0.5 rounded-full font-caption text-caption font-semibold ${
                                srv.tag === 'Most Popular'
                                  ? 'bg-status-confirmed-bg text-status-confirmed'
                                  : srv.tag === 'Signature'
                                  ? 'bg-tertiary-fixed text-on-tertiary-fixed'
                                  : 'bg-surface-container text-on-surface-variant'
                              }`}
                            >
                              {srv.tag}
                            </span>
                          )}
                        </div>
                        <p className="font-body-sm text-body-sm text-on-surface-variant mt-1 max-w-md">
                          {srv.description}
                        </p>
                        <div className="flex items-center gap-3 mt-2 font-caption text-caption text-on-surface-variant">
                          <span className="flex items-center gap-1">
                            <span className="material-symbols-outlined text-[15px]">schedule</span>
                            <span>{srv.durationMinutes} mins</span>
                          </span>
                          <span>•</span>
                          <span className="flex items-center gap-1">
                            <span className="material-symbols-outlined text-[15px]">person</span>
                            <span>
                              {srv.assignedStaff.length} Staff ({srv.assignedStaff.join(', ')})
                            </span>
                          </span>
                        </div>
                      </div>
                    </div>

                    <div className="flex items-center justify-between sm:justify-end gap-4 border-t sm:border-t-0 pt-3 sm:pt-0 border-border-subtle/60">
                      <div className="text-right">
                        <p className="font-headline-md text-headline-md font-bold text-primary">
                          {srv.priceFcfa.toLocaleString()} FCFA
                        </p>
                        <span className="font-caption text-caption text-outline">
                          Tax incl.
                        </span>
                      </div>

                      {/* Active Toggle Switch */}
                      <button
                        onClick={() => toggleServiceActive(srv.id)}
                        className={`relative inline-flex h-6 w-11 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none ${
                          srv.isActive ? 'bg-primary' : 'bg-surface-container-highest'
                        }`}
                        title={srv.isActive ? 'Active on booking portal' : 'Offline'}
                      >
                        <span
                          className={`pointer-events-none inline-block h-5 w-5 transform rounded-full bg-white shadow ring-0 transition duration-200 ease-in-out ${
                            srv.isActive ? 'translate-x-5' : 'translate-x-0'
                          }`}
                        />
                      </button>

                      {/* More Menu Dropdown trigger */}
                      <div className="flex items-center gap-1">
                        <button
                          onClick={() => handleDuplicate(srv)}
                          className="p-1.5 rounded-lg text-on-surface-variant hover:bg-surface-container hover:text-on-surface"
                          title="Duplicate service"
                        >
                          <span className="material-symbols-outlined text-[18px]">
                            content_copy
                          </span>
                        </button>
                        <button
                          onClick={() => handleDelete(srv.id)}
                          className="p-1.5 rounded-lg text-on-surface-variant hover:bg-error-container/40 hover:text-error"
                          title="Delete service"
                        >
                          <span className="material-symbols-outlined text-[18px]">delete</span>
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* TAB 2: Weekly Working Hours */}
          {activeSubTab === 'hours' && (
            <div className="bg-surface-card rounded-2xl p-6 shadow-sm border border-border-subtle flex flex-col gap-6">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 border-b border-border-subtle">
                <div>
                  <h2 className="font-headline-md text-headline-md text-on-surface font-semibold">
                    Weekly Schedule & Shift Matrix
                  </h2>
                  <p className="font-body-sm text-body-sm text-on-surface-variant mt-0.5">
                    Define studio operational hours, lunch breaks, and rest days.
                  </p>
                </div>
                <button
                  onClick={handleCopyMonToWeekdays}
                  className="px-3.5 py-1.5 rounded-xl bg-surface-container hover:bg-surface-container-high text-on-surface font-label-sm text-label-sm transition-colors border border-border-subtle cursor-pointer self-start sm:self-auto"
                >
                  Copy Mon to Weekdays
                </button>
              </div>

              <div className="flex flex-col gap-3">
                {workingDays.map((day, idx) => (
                  <div
                    key={day.dayName}
                    className={`p-4 rounded-xl border flex flex-col sm:flex-row sm:items-center justify-between gap-4 transition-colors ${
                      day.isOpen
                        ? 'bg-surface-container-low border-border-subtle/80'
                        : 'bg-surface-muted/40 border-dashed border-border-subtle'
                    }`}
                  >
                    <div className="flex items-center gap-3 w-32">
                      <input
                        type="checkbox"
                        checked={day.isOpen}
                        onChange={(e) => {
                          const updated = [...workingDays];
                          updated[idx].isOpen = e.target.checked;
                          onUpdateWorkingDays(updated);
                        }}
                        className="accent-primary w-4 h-4 rounded cursor-pointer"
                      />
                      <span
                        className={`font-label-md text-label-md font-semibold ${
                          day.isOpen ? 'text-on-surface' : 'text-on-surface-variant line-through'
                        }`}
                      >
                        {day.dayName}
                      </span>
                    </div>

                    {day.isOpen ? (
                      <div className="flex flex-wrap items-center gap-4 text-body-sm font-body-sm">
                        <div className="flex items-center gap-2">
                          <span className="font-caption text-caption text-on-surface-variant">
                            Open:
                          </span>
                          <input
                            type="time"
                            value={day.openTime}
                            onChange={(e) => {
                              const updated = [...workingDays];
                              updated[idx].openTime = e.target.value;
                              onUpdateWorkingDays(updated);
                            }}
                            className="px-2 py-1 rounded bg-surface-card border border-border-subtle font-mono text-body-sm text-on-surface outline-none"
                          />
                          <span className="text-outline">to</span>
                          <input
                            type="time"
                            value={day.closeTime}
                            onChange={(e) => {
                              const updated = [...workingDays];
                              updated[idx].closeTime = e.target.value;
                              onUpdateWorkingDays(updated);
                            }}
                            className="px-2 py-1 rounded bg-surface-card border border-border-subtle font-mono text-body-sm text-on-surface outline-none"
                          />
                        </div>

                        {day.hasBreak && (
                          <div className="flex items-center gap-1.5 text-caption font-caption text-on-surface-variant bg-surface-card px-2.5 py-1 rounded-md border border-border-subtle">
                            <span className="material-symbols-outlined text-[14px]">
                              restaurant
                            </span>
                            <span>
                              Break: {day.breakStart} – {day.breakEnd}
                            </span>
                          </div>
                        )}
                      </div>
                    ) : (
                      <span className="font-label-sm text-label-sm text-error bg-error-container/30 px-3 py-1 rounded-full font-medium">
                        Studio Closed
                      </span>
                    )}
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* TAB 3: Staff & Team Availability */}
          {activeSubTab === 'staff' && (
            <div className="bg-surface-card rounded-2xl p-6 shadow-sm border border-border-subtle flex flex-col gap-6">
              <div>
                <h2 className="font-headline-md text-headline-md text-on-surface font-semibold">
                  Team Members & Barber Chairs
                </h2>
                <p className="font-body-sm text-body-sm text-on-surface-variant mt-0.5">
                  Manage individual stylist shifts, chair assignments, and commission rates.
                </p>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {/* Gift */}
                <div className="p-5 rounded-2xl bg-surface-container-low border border-border-subtle flex flex-col justify-between">
                  <div>
                    <div className="flex items-center gap-3">
                      <div className="w-12 h-12 rounded-full bg-primary-fixed text-on-primary-fixed flex items-center justify-center font-bold text-headline-md shadow-xs">
                        G
                      </div>
                      <div>
                        <h3 className="font-label-lg text-label-lg font-semibold text-on-surface">
                          Gift (Owner)
                        </h3>
                        <p className="font-caption text-caption text-primary font-medium">
                          Master Barber • Chair 1
                        </p>
                      </div>
                    </div>
                    <div className="mt-4 flex flex-col gap-2 font-body-sm text-body-sm text-on-surface">
                      <p className="flex justify-between">
                        <span className="text-on-surface-variant">Working Days:</span>
                        <strong className="font-medium">Mon – Sat</strong>
                      </p>
                      <p className="flex justify-between">
                        <span className="text-on-surface-variant">Max daily clients:</span>
                        <strong className="font-medium">10</strong>
                      </p>
                      <p className="flex justify-between">
                        <span className="text-on-surface-variant">Services:</span>
                        <strong className="font-medium">All 5 services</strong>
                      </p>
                    </div>
                  </div>
                  <span className="mt-4 inline-flex items-center gap-1 text-caption font-caption text-status-confirmed bg-status-confirmed-bg px-2.5 py-1 rounded-full font-semibold self-start">
                    <span className="w-1.5 h-1.5 rounded-full bg-status-confirmed"></span> On Duty
                  </span>
                </div>

                {/* Samuel */}
                <div className="p-5 rounded-2xl bg-surface-container-low border border-border-subtle flex flex-col justify-between">
                  <div>
                    <div className="flex items-center gap-3">
                      <div className="w-12 h-12 rounded-full bg-secondary-fixed text-on-secondary-fixed flex items-center justify-center font-bold text-headline-md shadow-xs">
                        S
                      </div>
                      <div>
                        <h3 className="font-label-lg text-label-lg font-semibold text-on-surface">
                          Samuel
                        </h3>
                        <p className="font-caption text-caption text-tertiary font-medium">
                          Senior Stylist • Chair 2
                        </p>
                      </div>
                    </div>
                    <div className="mt-4 flex flex-col gap-2 font-body-sm text-body-sm text-on-surface">
                      <p className="flex justify-between">
                        <span className="text-on-surface-variant">Working Days:</span>
                        <strong className="font-medium">Mon – Sat</strong>
                      </p>
                      <p className="flex justify-between">
                        <span className="text-on-surface-variant">Max daily clients:</span>
                        <strong className="font-medium">8</strong>
                      </p>
                      <p className="flex justify-between">
                        <span className="text-on-surface-variant">Services:</span>
                        <strong className="font-medium">Haircuts & Beards</strong>
                      </p>
                    </div>
                  </div>
                  <span className="mt-4 inline-flex items-center gap-1 text-caption font-caption text-status-confirmed bg-status-confirmed-bg px-2.5 py-1 rounded-full font-semibold self-start">
                    <span className="w-1.5 h-1.5 rounded-full bg-status-confirmed"></span> On Duty
                  </span>
                </div>
              </div>
            </div>
          )}

          {/* TAB 4: Breaks & Blocked Dates */}
          {activeSubTab === 'breaks' && (
            <div className="bg-surface-card rounded-2xl p-6 shadow-sm border border-border-subtle flex flex-col gap-5">
              <div>
                <h2 className="font-headline-md text-headline-md text-on-surface font-semibold">
                  Breaks & Blocked Dates
                </h2>
                <p className="font-body-sm text-body-sm text-on-surface-variant mt-0.5">
                  Block vacation periods, public holidays, and staff training events.
                </p>
              </div>

              <div className="flex flex-col gap-3">
                <div className="p-4 rounded-xl bg-surface-container-low border border-border-subtle flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <span className="material-symbols-outlined text-primary text-[22px]">
                      celebration
                    </span>
                    <div>
                      <p className="font-label-md text-label-md font-semibold text-on-surface">
                        Cameroon Youth Day (Holiday)
                      </p>
                      <p className="font-caption text-caption text-on-surface-variant">
                        February 11 • All chairs closed
                      </p>
                    </div>
                  </div>
                  <span className="font-label-sm text-label-sm text-error bg-error-container/30 px-3 py-1 rounded-full font-medium">
                    Blocked
                  </span>
                </div>

                <div className="p-4 rounded-xl bg-surface-container-low border border-border-subtle flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <span className="material-symbols-outlined text-primary text-[22px]">
                      build_circle
                    </span>
                    <div>
                      <p className="font-label-md text-label-md font-semibold text-on-surface">
                        Studio Deep Cleaning & Sanitation
                      </p>
                      <p className="font-caption text-caption text-on-surface-variant">
                        Every Sunday 14:00 - 18:00
                      </p>
                    </div>
                  </div>
                  <span className="font-label-sm text-label-sm text-on-surface-variant bg-surface-container px-3 py-1 rounded-full font-medium">
                    Recurring
                  </span>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Right Column (4 cols): Studio Showcase & Scheduling Bounds */}
        <div className="lg:col-span-4 flex flex-col gap-6">
          {/* Studio Hero Showcase Card */}
          <div className="bg-surface-card rounded-2xl overflow-hidden shadow-sm border border-border-subtle group">
            <div className="relative h-44 w-full overflow-hidden">
              <img
                src={STUDIO_COVER_URL}
                alt="Gift's Barbershop & Studio"
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/30 to-transparent"></div>
              <div className="absolute bottom-3 left-4 right-4 text-white">
                <div className="flex items-center gap-1.5">
                  <h3 className="font-headline-md text-headline-md font-bold truncate">
                    Gift's Barbershop & Studio
                  </h3>
                  <span className="material-symbols-outlined text-primary-fixed text-[18px]">
                    verified
                  </span>
                </div>
                <p className="font-caption text-caption text-white/80 flex items-center gap-1 mt-0.5">
                  <span className="material-symbols-outlined text-[13px]">location_on</span>
                  <span>Bonanjo, Douala • Mon–Sat 08:00–18:00</span>
                </p>
              </div>
            </div>
            <div className="p-4 bg-surface-card flex items-center justify-between">
              <div className="flex items-center gap-1 text-on-surface">
                <span className="material-symbols-outlined text-tertiary text-[18px]">star</span>
                <span className="font-label-md text-label-md font-bold">4.9</span>
                <span className="font-caption text-caption text-on-surface-variant">
                  (142 reviews)
                </span>
              </div>
              <button
                onClick={() => onNavigate('booking-portal')}
                className="px-3.5 py-1.5 rounded-lg bg-primary text-on-primary font-label-sm text-label-sm hover:opacity-95 shadow-xs transition-opacity flex items-center gap-1 cursor-pointer"
              >
                <span>Preview Portal</span>
                <span className="material-symbols-outlined text-[14px]">open_in_new</span>
              </button>
            </div>
          </div>

          {/* Scheduling Bounds Card */}
          <div className="bg-surface-card rounded-2xl p-5 shadow-sm border border-border-subtle flex flex-col gap-4">
            <div className="flex items-center gap-2">
              <span className="material-symbols-outlined text-primary text-[20px]">tune</span>
              <h2 className="font-label-lg text-label-lg text-on-surface font-semibold">
                Scheduling Bounds
              </h2>
            </div>

            <div className="flex flex-col gap-3">
              <div>
                <label className="block font-label-sm text-label-sm text-on-surface font-medium mb-1">
                  Appointment Buffer (Cleaning Time)
                </label>
                <select
                  value={bufferMins}
                  onChange={(e) => setBufferMins(Number(e.target.value))}
                  className="w-full px-3 py-2 rounded-lg bg-surface-container-low border border-border-subtle focus:bg-surface-card focus:border-primary outline-none font-body-sm text-body-sm text-on-surface"
                >
                  <option value={0}>No buffer (0 mins)</option>
                  <option value={5}>5 minutes</option>
                  <option value={10}>10 minutes (Recommended)</option>
                  <option value={15}>15 minutes</option>
                  <option value={20}>20 minutes</option>
                </select>
              </div>

              <div>
                <label className="block font-label-sm text-label-sm text-on-surface font-medium mb-1">
                  Minimum Notice (Lead Time)
                </label>
                <select
                  value={minNoticeHours}
                  onChange={(e) => setMinNoticeHours(Number(e.target.value))}
                  className="w-full px-3 py-2 rounded-lg bg-surface-container-low border border-border-subtle focus:bg-surface-card focus:border-primary outline-none font-body-sm text-body-sm text-on-surface"
                >
                  <option value={1}>1 hour in advance</option>
                  <option value={2}>2 hours in advance</option>
                  <option value={4}>4 hours in advance</option>
                  <option value={24}>24 hours (Next-day only)</option>
                </select>
              </div>

              <div>
                <label className="block font-label-sm text-label-sm text-on-surface font-medium mb-1">
                  Max Booking Horizon
                </label>
                <select
                  value={bookingHorizonDays}
                  onChange={(e) => setBookingHorizonDays(Number(e.target.value))}
                  className="w-full px-3 py-2 rounded-lg bg-surface-container-low border border-border-subtle focus:bg-surface-card focus:border-primary outline-none font-body-sm text-body-sm text-on-surface"
                >
                  <option value={7}>7 days in advance</option>
                  <option value={14}>14 days in advance</option>
                  <option value={30}>30 days in advance (Standard)</option>
                  <option value={60}>60 days in advance</option>
                  <option value={90}>90 days in advance</option>
                </select>
              </div>
            </div>

            <div className="p-3 bg-surface-container-low rounded-xl border border-border-subtle/60 flex items-center justify-between">
              <span className="font-caption text-caption text-on-surface-variant">
                Estimated Studio Utilization:
              </span>
              <span className="font-label-md text-label-md font-bold text-status-confirmed">
                84%
              </span>
            </div>

            <button
              onClick={handleSaveSchedulingRules}
              className="w-full py-2.5 rounded-xl bg-primary text-on-primary font-label-md text-label-md hover:opacity-95 shadow-xs transition-opacity cursor-pointer text-center"
            >
              Save Availability Rules
            </button>
          </div>
        </div>
      </div>

      {/* Add New Service Modal */}
      {isAddServiceOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-inverse-surface/40 backdrop-blur-xs p-4 animate-in fade-in duration-150">
          <div className="bg-surface-card rounded-2xl max-w-md w-full p-6 shadow-2xl relative border border-border-subtle">
            <button
              onClick={() => setIsAddServiceOpen(false)}
              className="absolute top-4 right-4 text-on-surface-variant hover:text-on-surface p-1 rounded-lg"
            >
              <span className="material-symbols-outlined text-[20px]">close</span>
            </button>
            <h3 className="font-headline-md text-headline-md text-on-surface font-semibold mb-4">
              Add New Service
            </h3>
            <form onSubmit={handleCreateService} className="flex flex-col gap-4">
              <div>
                <label className="block font-label-sm text-label-sm text-on-surface font-medium mb-1">
                  Service Title *
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Scissor Haircut & Hot Compress"
                  value={newServiceName}
                  onChange={(e) => setNewServiceName(e.target.value)}
                  className="w-full px-3 py-2 rounded-lg bg-surface-container-low border border-border-subtle font-body-sm text-body-sm outline-none focus:border-primary"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-label-sm text-label-sm text-on-surface font-medium mb-1">
                    Price (FCFA) *
                  </label>
                  <input
                    type="number"
                    step="500"
                    required
                    value={newServicePrice}
                    onChange={(e) => setNewServicePrice(Number(e.target.value))}
                    className="w-full px-3 py-2 rounded-lg bg-surface-container-low border border-border-subtle font-body-sm text-body-sm outline-none focus:border-primary"
                  />
                </div>
                <div>
                  <label className="block font-label-sm text-label-sm text-on-surface font-medium mb-1">
                    Duration (mins) *
                  </label>
                  <select
                    value={newServiceDuration}
                    onChange={(e) => setNewServiceDuration(Number(e.target.value))}
                    className="w-full px-3 py-2 rounded-lg bg-surface-container-low border border-border-subtle font-body-sm text-body-sm outline-none focus:border-primary"
                  >
                    <option value={15}>15 mins</option>
                    <option value={20}>20 mins</option>
                    <option value={30}>30 mins</option>
                    <option value={45}>45 mins</option>
                    <option value={60}>60 mins</option>
                    <option value={90}>90 mins</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block font-label-sm text-label-sm text-on-surface font-medium mb-1">
                  Description
                </label>
                <textarea
                  rows={2}
                  placeholder="What does this service include?"
                  value={newServiceDesc}
                  onChange={(e) => setNewServiceDesc(e.target.value)}
                  className="w-full px-3 py-2 rounded-lg bg-surface-container-low border border-border-subtle font-body-sm text-body-sm outline-none focus:border-primary resize-none"
                />
              </div>

              <div className="flex items-center justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setIsAddServiceOpen(false)}
                  className="px-4 py-2 rounded-xl bg-surface-container text-on-surface font-label-md text-label-md"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-xl bg-primary text-on-primary font-label-md text-label-md shadow-xs"
                >
                  Add Service
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
