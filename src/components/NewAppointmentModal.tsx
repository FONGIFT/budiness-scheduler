import React, { useState } from 'react';
import { Appointment, ServiceItem } from '../types';

interface NewAppointmentModalProps {
  isOpen: boolean;
  onClose: () => void;
  services: ServiceItem[];
  onAddAppointment: (apt: Appointment) => void;
  onShowToast: (msg: string) => void;
}

export const NewAppointmentModal: React.FC<NewAppointmentModalProps> = ({
  isOpen,
  onClose,
  services,
  onAddAppointment,
  onShowToast,
}) => {
  const [clientName, setClientName] = useState('');
  const [clientPhone, setClientPhone] = useState('+237 ');
  const [clientEmail, setClientEmail] = useState('');
  const [serviceId, setServiceId] = useState(services[0]?.id || 'srv-1');
  const [staffName, setStaffName] = useState<'Gift' | 'Samuel'>('Gift');
  const [date, setDate] = useState('Thursday, Sep 24');
  const [time, setTime] = useState('11:00');
  const [notes, setNotes] = useState('');

  if (!isOpen) return null;

  const selectedService = services.find((s) => s.id === serviceId) || services[0];

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!clientName.trim()) {
      onShowToast('Please enter the client name');
      return;
    }

    const newApt: Appointment = {
      id: `apt-${Date.now()}`,
      clientName: clientName.trim(),
      clientPhone: clientPhone.trim(),
      clientEmail: clientEmail.trim() || undefined,
      serviceId: selectedService.id,
      serviceName: selectedService.name,
      date: date,
      dayKey: '24',
      dayOfWeek: 'Thu',
      time: time,
      endTime: '11:45',
      duration: `${selectedService.durationMinutes}m`,
      staffName: staffName,
      chair: staffName === 'Gift' ? 'Chair 1' : 'Chair 2',
      price: `${selectedService.priceFcfa.toLocaleString()} FCFA`,
      rawPrice: selectedService.priceFcfa,
      status: 'Confirmed',
      clientTag: 'New',
      notes: notes.trim() || 'Booked directly via studio admin',
    };

    onAddAppointment(newApt);
    onShowToast(`Appointment created for ${clientName}!`);
    onClose();
    // Reset form
    setClientName('');
    setClientPhone('+237 ');
    setNotes('');
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-inverse-surface/40 backdrop-blur-xs p-4 animate-in fade-in duration-150">
      <div className="bg-surface-card rounded-2xl max-w-lg w-full p-6 sm:p-8 shadow-2xl relative border border-border-subtle max-h-[90vh] overflow-y-auto">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-on-surface-variant hover:text-on-surface p-1 rounded-lg hover:bg-surface-container transition-colors"
        >
          <span className="material-symbols-outlined text-[20px]">close</span>
        </button>

        <div className="flex items-center gap-3 mb-5">
          <div className="w-10 h-10 rounded-xl bg-primary/10 text-primary flex items-center justify-center">
            <span className="material-symbols-outlined text-[22px]">edit_calendar</span>
          </div>
          <div>
            <h3 className="font-headline-md text-headline-md text-on-surface font-semibold">
              New Appointment
            </h3>
            <p className="font-caption text-caption text-on-surface-variant">
              Manually schedule a client session on Chair 1 or Chair 2
            </p>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="block font-label-sm text-label-sm text-on-surface font-medium mb-1">
                Client Full Name *
              </label>
              <input
                type="text"
                required
                value={clientName}
                onChange={(e) => setClientName(e.target.value)}
                placeholder="e.g. Roland Kamga"
                className="w-full px-3 py-2 rounded-lg bg-surface-container-low border border-border-subtle focus:bg-surface-card focus:border-primary outline-none font-body-sm text-body-sm"
              />
            </div>
            <div>
              <label className="block font-label-sm text-label-sm text-on-surface font-medium mb-1">
                Phone / WhatsApp Number
              </label>
              <input
                type="text"
                value={clientPhone}
                onChange={(e) => setClientPhone(e.target.value)}
                placeholder="+237 6XX XXX XXX"
                className="w-full px-3 py-2 rounded-lg bg-surface-container-low border border-border-subtle focus:bg-surface-card focus:border-primary outline-none font-body-sm text-body-sm"
              />
            </div>
          </div>

          <div>
            <label className="block font-label-sm text-label-sm text-on-surface font-medium mb-1">
              Select Service
            </label>
            <select
              value={serviceId}
              onChange={(e) => setServiceId(e.target.value)}
              className="w-full px-3 py-2.5 rounded-lg bg-surface-container-low border border-border-subtle focus:bg-surface-card focus:border-primary outline-none font-body-sm text-body-sm text-on-surface"
            >
              {services.map((s) => (
                <option key={s.id} value={s.id}>
                  {s.name} • {s.durationMinutes}m ({s.priceFcfa.toLocaleString()} FCFA)
                </option>
              ))}
            </select>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="block font-label-sm text-label-sm text-on-surface font-medium mb-1">
                Assigned Barber & Chair
              </label>
              <select
                value={staffName}
                onChange={(e) => setStaffName(e.target.value as 'Gift' | 'Samuel')}
                className="w-full px-3 py-2 rounded-lg bg-surface-container-low border border-border-subtle focus:bg-surface-card focus:border-primary outline-none font-body-sm text-body-sm text-on-surface"
              >
                <option value="Gift">Gift (Master Barber • Chair 1)</option>
                <option value="Samuel">Samuel (Senior Stylist • Chair 2)</option>
              </select>
            </div>
            <div>
              <label className="block font-label-sm text-label-sm text-on-surface font-medium mb-1">
                Time Slot
              </label>
              <select
                value={time}
                onChange={(e) => setTime(e.target.value)}
                className="w-full px-3 py-2 rounded-lg bg-surface-container-low border border-border-subtle focus:bg-surface-card focus:border-primary outline-none font-body-sm text-body-sm text-on-surface"
              >
                <option value="08:30">08:30 AM</option>
                <option value="09:00">09:00 AM</option>
                <option value="10:00">10:00 AM</option>
                <option value="11:00">11:00 AM</option>
                <option value="11:30">11:30 AM</option>
                <option value="14:00">02:00 PM</option>
                <option value="14:30">02:30 PM</option>
                <option value="15:30">03:30 PM</option>
                <option value="16:00">04:00 PM</option>
                <option value="17:00">05:00 PM</option>
              </select>
            </div>
          </div>

          <div>
            <label className="block font-label-sm text-label-sm text-on-surface font-medium mb-1">
              Barber Notes & Style Preferences
            </label>
            <textarea
              rows={2}
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              placeholder="e.g. Low skin taper fade, beard shaping with razor outline"
              className="w-full px-3 py-2 rounded-lg bg-surface-container-low border border-border-subtle focus:bg-surface-card focus:border-primary outline-none font-body-sm text-body-sm resize-none"
            />
          </div>

          <div className="flex items-center justify-end gap-3 pt-3 border-t border-border-subtle mt-2">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 rounded-xl bg-surface-container hover:bg-surface-container-high text-on-surface font-label-md text-label-md transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-5 py-2 rounded-xl bg-primary text-on-primary hover:opacity-95 font-label-md text-label-md shadow-sm transition-all"
            >
              Book Appointment
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
