import React, { useState } from 'react';
import { Appointment, NavigationTab, ServiceItem, StudioSettings } from '../types';
import { BOOKFLOW_LOGO_URL, STUDIO_COVER_URL } from './Sidebar';

interface PublicBookingPortalProps {
  services: ServiceItem[];
  settings: StudioSettings;
  onNewBookingCreated: (apt: Appointment) => void;
  onNavigate: (tab: NavigationTab) => void;
  onShowToast: (msg: string) => void;
}

export const PublicBookingPortal: React.FC<PublicBookingPortalProps> = ({
  services,
  settings,
  onNewBookingCreated,
  onNavigate,
  onShowToast,
}) => {
  const activeServices = services.filter((s) => s.isActive);
  const [selectedServiceId, setSelectedServiceId] = useState<string>(
    activeServices[1]?.id || activeServices[0]?.id || 'srv-1'
  );

  const [selectedDayKey, setSelectedDayKey] = useState('24');
  const [selectedTime, setSelectedTime] = useState('14:45');

  // Contact form state
  const [fullName, setFullName] = useState('');
  const [phone, setPhone] = useState('+237 ');
  const [email, setEmail] = useState('');
  const [notes, setNotes] = useState('');
  const [preferredBarber, setPreferredBarber] = useState<'Any' | 'Gift' | 'Samuel'>('Gift');

  // Confirmation modal
  const [confirmedBooking, setConfirmedBooking] = useState<Appointment | null>(null);

  const selectedService =
    activeServices.find((s) => s.id === selectedServiceId) || activeServices[0];

  const daysList = [
    { key: '21', dayName: 'Mon', dayNum: '21', isToday: false },
    { key: '22', dayName: 'Tue', dayNum: '22', isToday: false },
    { key: '23', dayName: 'Wed', dayNum: '23', isToday: false },
    { key: '24', dayName: 'Thu', dayNum: '24', isToday: true },
    { key: '25', dayName: 'Fri', dayNum: '25', isToday: false },
    { key: '26', dayName: 'Sat', dayNum: '26', isToday: false },
  ];

  const morningSlots = ['09:00', '09:45', '10:30', '11:15'];
  const afternoonSlots = ['14:00', '14:45', '15:30', '16:15', '17:00'];

  const handleBookNow = (e: React.FormEvent) => {
    e.preventDefault();
    if (!fullName.trim()) {
      onShowToast('Please enter your name to confirm booking');
      return;
    }
    if (phone.trim().length < 9) {
      onShowToast('Please enter a valid phone number for SMS reminders');
      return;
    }

    const assignedStaff =
      preferredBarber === 'Samuel'
        ? 'Samuel'
        : preferredBarber === 'Gift'
        ? 'Gift'
        : 'Gift';

    const dayObj = daysList.find((d) => d.key === selectedDayKey) || daysList[3];

    const newApt: Appointment = {
      id: `online-apt-${Date.now()}`,
      clientName: fullName.trim(),
      clientPhone: phone.trim(),
      clientEmail: email.trim() || undefined,
      serviceId: selectedService.id,
      serviceName: selectedService.name,
      date: `${dayObj.dayName}day, Sep ${dayObj.dayNum}`,
      dayKey: selectedDayKey,
      dayOfWeek: dayObj.dayName as any,
      time: selectedTime,
      endTime: '15:30',
      duration: `${selectedService.durationMinutes}m`,
      staffName: assignedStaff,
      chair: assignedStaff === 'Gift' ? 'Chair 1' : 'Chair 2',
      price: `${selectedService.priceFcfa.toLocaleString()} FCFA`,
      rawPrice: selectedService.priceFcfa,
      status: 'Confirmed',
      clientTag: 'New',
      notes: notes.trim() || 'Online Self-Booking Portal',
    };

    onNewBookingCreated(newApt);
    setConfirmedBooking(newApt);
    onShowToast('Appointment successfully reserved!');
  };

  return (
    <div className="min-h-screen bg-surface flex flex-col">
      {/* Top Client Navbar */}
      <header className="sticky top-0 z-40 bg-surface-card/95 backdrop-blur-md border-b border-border-subtle px-4 sm:px-8 py-3 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <img
            src={BOOKFLOW_LOGO_URL}
            alt="BookFlow"
            className="h-7 w-auto object-contain"
          />
          <div>
            <h1 className="font-label-lg text-label-lg font-bold text-on-surface leading-tight">
              {settings.name}
            </h1>
            <div className="flex items-center gap-1.5">
              <span className="w-2 h-2 rounded-full bg-status-confirmed animate-pulse"></span>
              <span className="font-caption text-caption text-on-surface-variant">
                Live Online Booking Portal
              </span>
            </div>
          </div>
        </div>

        {/* Back to Studio Admin trigger */}
        <button
          onClick={() => onNavigate('dashboard')}
          className="flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl bg-surface-container hover:bg-surface-container-high text-on-surface font-label-sm text-label-sm border border-border-subtle transition-colors cursor-pointer"
        >
          <span className="material-symbols-outlined text-[16px]">arrow_back</span>
          <span>Return to Admin Studio</span>
        </button>
      </header>

      {/* Hero Studio Banner */}
      <div className="relative bg-surface-card border-b border-border-subtle overflow-hidden">
        <div className="max-w-6xl mx-auto px-4 sm:px-8 py-6 sm:py-8 flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4">
            <img
              src={STUDIO_COVER_URL}
              alt="Gift's Barbershop"
              className="w-20 h-20 sm:w-24 sm:h-24 rounded-2xl object-cover shadow-md ring-2 ring-border-subtle"
            />
            <div>
              <div className="flex items-center gap-2 flex-wrap">
                <h2 className="font-headline-lg text-headline-lg font-bold text-on-surface">
                  {settings.name}
                </h2>
                <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-primary-fixed text-on-primary-fixed font-caption text-caption font-semibold">
                  <span className="material-symbols-outlined text-[14px]">verified</span>
                  Verified Partner
                </span>
              </div>
              <div className="flex items-center gap-3 mt-1.5 text-body-sm font-body-sm text-on-surface-variant flex-wrap">
                <span className="flex items-center gap-1 text-on-surface font-semibold">
                  <span className="material-symbols-outlined text-tertiary text-[17px]">star</span>
                  4.9 (142 reviews)
                </span>
                <span>•</span>
                <span className="flex items-center gap-1">
                  <span className="material-symbols-outlined text-[17px]">location_on</span>
                  {settings.address}, {settings.city}
                </span>
                <span>•</span>
                <span className="flex items-center gap-1">
                  <span className="material-symbols-outlined text-[17px]">schedule</span>
                  Mon–Sat 08:00–18:00
                </span>
              </div>
            </div>
          </div>

          <div className="flex items-center gap-2 bg-surface-container-low p-3 rounded-xl border border-border-subtle/80 self-start md:self-auto">
            <span className="material-symbols-outlined text-status-confirmed text-[22px]">
              mark_chat_read
            </span>
            <div className="text-left">
              <p className="font-label-sm text-label-sm font-semibold text-on-surface">
                Instant Confirmation
              </p>
              <p className="font-caption text-caption text-on-surface-variant">
                SMS & WhatsApp reminders sent automatically
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Main Booking Content: 3 Steps (Left) + Sticky Summary (Right) */}
      <main className="max-w-6xl mx-auto px-4 sm:px-8 py-8 w-full flex-1">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          {/* Left Column (8 cols): 3-Step Selection */}
          <form onSubmit={handleBookNow} className="lg:col-span-8 flex flex-col gap-8">
            {/* STEP 1: Select Service */}
            <div className="bg-surface-card rounded-2xl p-6 shadow-sm border border-border-subtle">
              <div className="flex items-center gap-3 mb-5">
                <span className="w-8 h-8 rounded-full bg-primary text-on-primary font-bold text-label-md flex items-center justify-center">
                  1
                </span>
                <div>
                  <h3 className="font-headline-md text-headline-md font-semibold text-on-surface">
                    Select Your Service
                  </h3>
                  <p className="font-body-sm text-body-sm text-on-surface-variant">
                    All treatments include complimentary hot towel & organic oil finish
                  </p>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
                {activeServices.map((srv) => {
                  const isSelected = selectedServiceId === srv.id;
                  return (
                    <div
                      key={srv.id}
                      onClick={() => setSelectedServiceId(srv.id)}
                      className={`p-4 rounded-xl border-2 transition-all cursor-pointer flex flex-col justify-between ${
                        isSelected
                          ? 'border-primary bg-primary/5 shadow-sm'
                          : 'border-border-subtle bg-surface-container-low hover:border-primary/40'
                      }`}
                    >
                      <div>
                        <div className="flex items-center justify-between gap-2">
                          <h4 className="font-label-md text-label-md font-semibold text-on-surface">
                            {srv.name}
                          </h4>
                          <span
                            className={`w-5 h-5 rounded-full border-2 flex items-center justify-center ${
                              isSelected
                                ? 'border-primary bg-primary text-on-primary'
                                : 'border-outline'
                            }`}
                          >
                            {isSelected && (
                              <span className="w-2 h-2 rounded-full bg-white"></span>
                            )}
                          </span>
                        </div>
                        <p className="font-caption text-caption text-on-surface-variant mt-1">
                          {srv.description}
                        </p>
                      </div>

                      <div className="flex items-center justify-between mt-4 pt-2 border-t border-border-subtle/60 font-body-sm">
                        <span className="font-caption text-caption text-on-surface-variant flex items-center gap-1">
                          <span className="material-symbols-outlined text-[15px]">schedule</span>
                          {srv.durationMinutes} mins
                        </span>
                        <span className="font-bold text-primary font-label-lg text-label-lg">
                          {srv.priceFcfa.toLocaleString()} FCFA
                        </span>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* STEP 2: Date & Time Selection */}
            <div className="bg-surface-card rounded-2xl p-6 shadow-sm border border-border-subtle">
              <div className="flex items-center gap-3 mb-5">
                <span className="w-8 h-8 rounded-full bg-primary text-on-primary font-bold text-label-md flex items-center justify-center">
                  2
                </span>
                <div>
                  <h3 className="font-headline-md text-headline-md font-semibold text-on-surface">
                    Choose Date & Time Slot
                  </h3>
                  <p className="font-body-sm text-body-sm text-on-surface-variant">
                    Times shown in West Africa Time (GMT+1)
                  </p>
                </div>
              </div>

              {/* Day Pills Carousel */}
              <div className="grid grid-cols-3 sm:grid-cols-6 gap-2 mb-6">
                {daysList.map((d) => {
                  const isSelected = selectedDayKey === d.key;
                  return (
                    <button
                      key={d.key}
                      type="button"
                      onClick={() => setSelectedDayKey(d.key)}
                      className={`p-3 rounded-xl flex flex-col items-center justify-center transition-all cursor-pointer border ${
                        isSelected
                          ? 'bg-primary text-on-primary border-primary shadow-sm'
                          : 'bg-surface-container-low hover:bg-surface-container text-on-surface border-border-subtle'
                      }`}
                    >
                      <span className="font-caption text-caption uppercase font-medium">
                        {d.dayName}
                      </span>
                      <span className="font-headline-md text-headline-md font-bold mt-0.5">
                        {d.dayNum}
                      </span>
                      {d.isToday && (
                        <span
                          className={`mt-1 text-[9px] px-1.5 py-0.2 rounded-full font-bold uppercase ${
                            isSelected
                              ? 'bg-white/30 text-white'
                              : 'bg-primary/20 text-primary'
                          }`}
                        >
                          Today
                        </span>
                      )}
                    </button>
                  );
                })}
              </div>

              {/* Time Slots: Morning & Afternoon */}
              <div className="flex flex-col gap-4">
                <div>
                  <span className="font-label-sm text-label-sm text-on-surface-variant font-medium block mb-2">
                    Morning
                  </span>
                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5">
                    {morningSlots.map((slot) => {
                      const isSelected = selectedTime === slot;
                      return (
                        <button
                          key={slot}
                          type="button"
                          onClick={() => setSelectedTime(slot)}
                          className={`py-2 px-3 rounded-lg font-label-md text-label-md text-center transition-all cursor-pointer border ${
                            isSelected
                              ? 'bg-primary text-on-primary border-primary shadow-xs font-semibold'
                              : 'bg-surface-container-low hover:bg-surface-container text-on-surface border-border-subtle'
                          }`}
                        >
                          {slot}
                        </button>
                      );
                    })}
                  </div>
                </div>

                <div>
                  <span className="font-label-sm text-label-sm text-on-surface-variant font-medium block mb-2">
                    Afternoon
                  </span>
                  <div className="grid grid-cols-2 sm:grid-cols-5 gap-2.5">
                    {afternoonSlots.map((slot) => {
                      const isSelected = selectedTime === slot;
                      return (
                        <button
                          key={slot}
                          type="button"
                          onClick={() => setSelectedTime(slot)}
                          className={`py-2 px-3 rounded-lg font-label-md text-label-md text-center transition-all cursor-pointer border ${
                            isSelected
                              ? 'bg-primary text-on-primary border-primary shadow-xs font-semibold'
                              : 'bg-surface-container-low hover:bg-surface-container text-on-surface border-border-subtle'
                          }`}
                        >
                          {slot}
                        </button>
                      );
                    })}
                  </div>
                </div>
              </div>

              {/* Preferred Stylist Choice */}
              <div className="mt-5 pt-4 border-t border-border-subtle/80 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                <span className="font-label-sm text-label-sm text-on-surface font-medium">
                  Preferred Stylist / Chair:
                </span>
                <div className="flex gap-2">
                  {(['Any', 'Gift', 'Samuel'] as const).map((stylist) => (
                    <button
                      key={stylist}
                      type="button"
                      onClick={() => setPreferredBarber(stylist)}
                      className={`px-3 py-1.5 rounded-lg font-label-sm text-label-sm border transition-colors cursor-pointer ${
                        preferredBarber === stylist
                          ? 'bg-primary text-on-primary border-primary font-semibold'
                          : 'bg-surface-container-low text-on-surface border-border-subtle hover:bg-surface-container'
                      }`}
                    >
                      {stylist === 'Any'
                        ? 'Next Available'
                        : stylist === 'Gift'
                        ? 'Gift (Chair 1)'
                        : 'Samuel (Chair 2)'}
                    </button>
                  ))}
                </div>
              </div>
            </div>

            {/* STEP 3: Contact Details */}
            <div className="bg-surface-card rounded-2xl p-6 shadow-sm border border-border-subtle">
              <div className="flex items-center gap-3 mb-5">
                <span className="w-8 h-8 rounded-full bg-primary text-on-primary font-bold text-label-md flex items-center justify-center">
                  3
                </span>
                <div>
                  <h3 className="font-headline-md text-headline-md font-semibold text-on-surface">
                    Your Contact Information
                  </h3>
                  <p className="font-body-sm text-body-sm text-on-surface-variant">
                    We will send appointment updates & calendar links via SMS / WhatsApp
                  </p>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block font-label-sm text-label-sm text-on-surface font-medium mb-1">
                    Your Full Name *
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Jean Paul"
                    value={fullName}
                    onChange={(e) => setFullName(e.target.value)}
                    className="w-full px-3.5 py-2.5 rounded-xl bg-surface-container-low border border-border-subtle focus:bg-surface-card focus:border-primary outline-none font-body-sm text-body-sm text-on-surface"
                  />
                </div>

                <div>
                  <label className="block font-label-sm text-label-sm text-on-surface font-medium mb-1">
                    Phone / WhatsApp Number *
                  </label>
                  <input
                    type="tel"
                    required
                    placeholder="+237 670 123 456"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    className="w-full px-3.5 py-2.5 rounded-xl bg-surface-container-low border border-border-subtle focus:bg-surface-card focus:border-primary outline-none font-body-sm text-body-sm text-on-surface"
                  />
                </div>

                <div>
                  <label className="block font-label-sm text-label-sm text-on-surface font-medium mb-1">
                    Email Address (Optional)
                  </label>
                  <input
                    type="email"
                    placeholder="name@example.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="w-full px-3.5 py-2.5 rounded-xl bg-surface-container-low border border-border-subtle focus:bg-surface-card focus:border-primary outline-none font-body-sm text-body-sm text-on-surface"
                  />
                </div>

                <div>
                  <label className="block font-label-sm text-label-sm text-on-surface font-medium mb-1">
                    Special Requests or Style Notes
                  </label>
                  <input
                    type="text"
                    placeholder="e.g. Scissor taper, skin fade contour"
                    value={notes}
                    onChange={(e) => setNotes(e.target.value)}
                    className="w-full px-3.5 py-2.5 rounded-xl bg-surface-container-low border border-border-subtle focus:bg-surface-card focus:border-primary outline-none font-body-sm text-body-sm text-on-surface"
                  />
                </div>
              </div>
            </div>

            {/* Mobile Submit Button (Visible only on small screens) */}
            <div className="lg:hidden">
              <button
                type="submit"
                className="w-full py-3.5 rounded-xl bg-primary text-on-primary font-label-lg text-label-lg font-bold shadow-md hover:opacity-95 transition-opacity"
              >
                Confirm Appointment ({selectedService.priceFcfa.toLocaleString()} FCFA)
              </button>
            </div>
          </form>

          {/* Right Column (4 cols): Sticky Summary Card */}
          <div className="lg:col-span-4 lg:sticky lg:top-20 flex flex-col gap-4">
            <div className="bg-surface-card rounded-2xl p-6 shadow-sm border border-border-subtle flex flex-col gap-4">
              <h3 className="font-headline-md text-headline-md font-semibold text-on-surface pb-3 border-b border-border-subtle">
                Appointment Summary
              </h3>

              <div className="flex flex-col gap-3 font-body-sm text-body-sm">
                <div className="flex justify-between items-start">
                  <span className="text-on-surface-variant">Service:</span>
                  <span className="font-semibold text-on-surface text-right">
                    {selectedService.name}
                  </span>
                </div>

                <div className="flex justify-between items-center">
                  <span className="text-on-surface-variant">Duration:</span>
                  <span className="font-medium text-on-surface">
                    {selectedService.durationMinutes} minutes
                  </span>
                </div>

                <div className="flex justify-between items-center">
                  <span className="text-on-surface-variant">Stylist / Chair:</span>
                  <span className="font-medium text-on-surface">
                    {preferredBarber === 'Samuel'
                      ? 'Samuel (Chair 2)'
                      : preferredBarber === 'Gift'
                      ? 'Gift (Chair 1)'
                      : 'Next Available'}
                  </span>
                </div>

                <div className="flex justify-between items-center">
                  <span className="text-on-surface-variant">Date & Time:</span>
                  <span className="font-semibold text-primary">
                    Sep {selectedDayKey}, 2025 at {selectedTime}
                  </span>
                </div>

                <div className="flex justify-between items-start">
                  <span className="text-on-surface-variant">Location:</span>
                  <span className="font-medium text-on-surface text-right">
                    {settings.address}
                  </span>
                </div>
              </div>

              {/* Price Calculation */}
              <div className="pt-4 border-t border-border-subtle flex flex-col gap-2">
                <div className="flex justify-between text-body-sm text-on-surface-variant">
                  <span>Subtotal</span>
                  <span>{selectedService.priceFcfa.toLocaleString()} FCFA</span>
                </div>
                <div className="flex justify-between text-caption text-caption text-status-confirmed">
                  <span>Online Deposit</span>
                  <span>0 FCFA (Pay at Studio)</span>
                </div>
                <div className="flex justify-between font-headline-md text-headline-md font-bold text-on-surface pt-2 border-t border-border-subtle">
                  <span>Total Amount</span>
                  <span className="text-primary">
                    {selectedService.priceFcfa.toLocaleString()} FCFA
                  </span>
                </div>
              </div>

              {/* Primary Confirmation Action */}
              <button
                type="button"
                onClick={handleBookNow}
                className="w-full py-3.5 rounded-xl bg-primary text-on-primary font-label-md text-label-md font-bold shadow-md hover:opacity-95 transition-opacity flex items-center justify-center gap-2 cursor-pointer mt-2"
              >
                <span className="material-symbols-outlined text-[20px]">check_circle</span>
                <span>Confirm Appointment</span>
              </button>

              <div className="flex items-center justify-center gap-1.5 text-caption font-caption text-on-surface-variant pt-1 text-center">
                <span className="material-symbols-outlined text-[15px] text-status-confirmed">
                  lock
                </span>
                <span>Real-time seat reserve • Zero double-booking</span>
              </div>
            </div>
          </div>
        </div>
      </main>

      {/* Booking Confirmed Modal */}
      {confirmedBooking && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-inverse-surface/50 backdrop-blur-xs p-4 animate-in fade-in duration-200">
          <div className="bg-surface-card rounded-2xl max-w-md w-full p-6 sm:p-8 shadow-2xl relative border border-border-subtle text-center">
            <div className="w-16 h-16 rounded-full bg-status-confirmed-bg text-status-confirmed flex items-center justify-center mx-auto mb-4 animate-in zoom-in-50 duration-300">
              <span className="material-symbols-outlined text-[36px]">check</span>
            </div>

            <h3 className="font-headline-lg text-headline-lg font-bold text-on-surface">
              Booking Confirmed!
            </h3>
            <p className="font-body-md text-body-md text-on-surface-variant mt-1">
              Your appointment is locked in at Gift's Barbershop & Studio.
            </p>

            <div className="my-5 p-4 rounded-xl bg-surface-container-low border border-border-subtle text-left flex flex-col gap-2 font-body-sm text-body-sm">
              <p className="flex justify-between">
                <span className="text-on-surface-variant">Client:</span>
                <strong className="font-semibold text-on-surface">
                  {confirmedBooking.clientName}
                </strong>
              </p>
              <p className="flex justify-between">
                <span className="text-on-surface-variant">Service:</span>
                <strong className="font-semibold text-on-surface">
                  {confirmedBooking.serviceName}
                </strong>
              </p>
              <p className="flex justify-between">
                <span className="text-on-surface-variant">Date & Time:</span>
                <strong className="font-semibold text-primary">
                  {confirmedBooking.date} • {confirmedBooking.time}
                </strong>
              </p>
              <p className="flex justify-between">
                <span className="text-on-surface-variant">Stylist:</span>
                <strong className="font-semibold text-on-surface">
                  {confirmedBooking.staffName} ({confirmedBooking.chair})
                </strong>
              </p>
              <p className="flex justify-between">
                <span className="text-on-surface-variant">Amount:</span>
                <strong className="font-bold text-on-surface">
                  {confirmedBooking.price} (Pay on Arrival)
                </strong>
              </p>
            </div>

            <p className="font-caption text-caption text-on-surface-variant mb-5">
              An automated SMS & WhatsApp reminder with directions will be dispatched to{' '}
              <strong className="text-on-surface">{confirmedBooking.clientPhone}</strong>.
            </p>

            <div className="flex flex-col gap-2">
              <button
                onClick={() => {
                  setConfirmedBooking(null);
                  onNavigate('dashboard');
                }}
                className="w-full py-3 rounded-xl bg-primary text-on-primary font-label-md text-label-md font-semibold hover:opacity-95 shadow-sm transition-opacity cursor-pointer"
              >
                Go to Admin Dashboard
              </button>
              <button
                onClick={() => setConfirmedBooking(null)}
                className="w-full py-2.5 rounded-xl bg-surface-container text-on-surface font-label-md text-label-md hover:bg-surface-container-high transition-colors cursor-pointer"
              >
                Book Another Appointment
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
