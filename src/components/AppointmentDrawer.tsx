import React from 'react';
import { Appointment } from '../types';

interface AppointmentDrawerProps {
  appointment: Appointment | null;
  isOpen: boolean;
  onClose: () => void;
  onUpdateStatus: (id: string, newStatus: Appointment['status']) => void;
  onShowToast: (msg: string) => void;
}

export const AppointmentDrawer: React.FC<AppointmentDrawerProps> = ({
  appointment,
  isOpen,
  onClose,
  onUpdateStatus,
  onShowToast,
}) => {
  if (!isOpen || !appointment) return null;

  const initials = appointment.initials || appointment.clientName
    .split(' ')
    .map((n) => n[0])
    .join('')
    .slice(0, 2)
    .toUpperCase();

  const isPending = appointment.status === 'Pending';
  const isCompleted = appointment.status === 'Completed';

  const handleSendReminder = () => {
    onShowToast(`SMS & WhatsApp reminder dispatched to ${appointment.clientName}!`);
  };

  const handleMarkCompleted = () => {
    onUpdateStatus(appointment.id, 'Completed');
    onShowToast(`Appointment for ${appointment.clientName} marked as Completed!`);
    onClose();
  };

  const handleConfirmSlot = () => {
    onUpdateStatus(appointment.id, 'Confirmed');
    onShowToast(`Slot confirmed for ${appointment.clientName}!`);
    onClose();
  };

  const handleCancel = () => {
    onUpdateStatus(appointment.id, 'Cancelled');
    onShowToast(`Appointment for ${appointment.clientName} cancelled.`);
    onClose();
  };

  const handleReschedule = () => {
    onShowToast(`Rescheduling flow opened for ${appointment.clientName}`);
  };

  return (
    <div className="fixed inset-0 z-50 overflow-hidden">
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-inverse-surface/30 backdrop-blur-xs transition-opacity duration-300"
        onClick={onClose}
      />

      <div className="fixed inset-y-0 right-0 max-w-full flex pl-10">
        <div className="w-screen max-w-md bg-surface-card shadow-2xl flex flex-col justify-between p-6 sm:p-8 overflow-y-auto border-l border-border-subtle animate-in slide-in-from-right duration-300">
          {/* Top Section */}
          <div>
            {/* Header / Status bar */}
            <div className="flex items-center justify-between pb-4 border-b border-border-subtle/70">
              <div className="flex items-center gap-2">
                <span
                  className={`w-2.5 h-2.5 rounded-full ${
                    appointment.status === 'Confirmed'
                      ? 'bg-status-confirmed'
                      : appointment.status === 'Pending'
                      ? 'bg-status-pending animate-pulse'
                      : appointment.status === 'Completed'
                      ? 'bg-status-noshow'
                      : 'bg-status-cancelled'
                  }`}
                />
                <span className="font-caption text-caption text-on-surface-variant uppercase tracking-wider font-semibold">
                  {appointment.status} Booking
                </span>
                {appointment.clientTag && (
                  <span className="ml-1 px-2 py-0.5 rounded-full bg-secondary-container text-on-secondary-fixed text-caption font-semibold">
                    {appointment.clientTag}
                  </span>
                )}
              </div>
              <button
                onClick={onClose}
                className="p-1 rounded-lg hover:bg-surface-muted text-on-surface-variant hover:text-on-surface transition-colors"
              >
                <span className="material-symbols-outlined text-[20px]">close</span>
              </button>
            </div>

            {/* Client Avatar & Name */}
            <div className="flex items-center gap-4 py-4">
              {appointment.avatarUrl ? (
                <img
                  src={appointment.avatarUrl}
                  alt={appointment.clientName}
                  className="w-14 h-14 rounded-full object-cover shadow-sm ring-2 ring-primary/20"
                />
              ) : (
                <div className="w-14 h-14 rounded-full bg-secondary-container text-on-secondary-fixed flex items-center justify-center font-headline-md text-headline-md font-bold shadow-xs">
                  {initials}
                </div>
              )}
              <div>
                <h2 className="font-headline-lg text-headline-lg text-on-surface font-semibold">
                  {appointment.clientName}
                </h2>
                <p className="font-body-sm text-body-sm text-primary font-medium mt-0.5">
                  {appointment.serviceName}
                </p>
              </div>
            </div>

            {/* Metadata Grid */}
            <div className="grid grid-cols-2 gap-3 my-4 p-4 bg-surface-container-low rounded-xl border border-border-subtle/50">
              <div>
                <p className="font-caption text-caption text-on-surface-variant">Date & Time</p>
                <p className="font-label-sm text-label-sm text-on-surface font-semibold mt-0.5">
                  {appointment.date} • {appointment.time}
                </p>
              </div>
              <div>
                <p className="font-caption text-caption text-on-surface-variant">Duration</p>
                <p className="font-label-sm text-label-sm text-on-surface font-semibold mt-0.5">
                  {appointment.duration}
                </p>
              </div>
              <div className="mt-1">
                <p className="font-caption text-caption text-on-surface-variant">Assigned Stylist</p>
                <p className="font-label-sm text-label-sm text-on-surface font-semibold mt-0.5">
                  {appointment.staffName} • {appointment.chair}
                </p>
              </div>
              <div className="mt-1">
                <p className="font-caption text-caption text-on-surface-variant">Pricing</p>
                <p className="font-label-sm text-label-sm text-on-surface font-bold mt-0.5 text-primary">
                  {appointment.price}
                </p>
              </div>
            </div>

            {/* Phone & Direct Call */}
            {appointment.clientPhone && (
              <div className="p-3 rounded-xl bg-surface-card border border-border-subtle shadow-xs flex items-center justify-between my-3">
                <div className="flex items-center gap-2.5">
                  <span className="material-symbols-outlined text-on-surface-variant text-[20px]">
                    phone
                  </span>
                  <span className="font-body-md text-body-md text-on-surface font-medium">
                    {appointment.clientPhone}
                  </span>
                </div>
                <a
                  href={`tel:${appointment.clientPhone}`}
                  className="text-primary hover:underline font-label-sm text-label-sm font-semibold"
                >
                  Call
                </a>
              </div>
            )}

            {/* Notes */}
            <div className="p-4 rounded-xl bg-surface-container-low border border-border-subtle/50 my-3">
              <p className="font-caption text-caption text-on-surface-variant uppercase font-semibold mb-1">
                Appointment Notes
              </p>
              <p className="font-body-sm text-body-sm text-on-surface italic">
                "{appointment.notes || 'No special requests provided.'}"
              </p>
            </div>

            {/* Auto-reminder Info */}
            <div className="p-3.5 rounded-xl bg-surface-card border border-border-subtle shadow-xs flex items-center justify-between">
              <div className="flex items-center gap-3">
                <span className="material-symbols-outlined text-tertiary text-[20px]">chat</span>
                <div>
                  <p className="font-label-sm text-label-sm text-on-surface font-medium">
                    Auto-reminder
                  </p>
                  <p className="font-caption text-caption text-on-surface-variant">
                    WhatsApp message dispatched 2 hrs before
                  </p>
                </div>
              </div>
              <span className="material-symbols-outlined text-status-confirmed text-[18px]">
                done_all
              </span>
            </div>
          </div>

          {/* Action Buttons Footer */}
          <div className="pt-6 flex flex-col gap-2 border-t border-border-subtle/70 mt-4">
            <button
              onClick={handleSendReminder}
              className="w-full py-2.5 px-4 rounded-xl bg-secondary-container hover:bg-secondary-fixed text-on-secondary-fixed font-label-md text-label-md flex items-center justify-center gap-2 transition-colors cursor-pointer"
            >
              <span className="material-symbols-outlined text-[18px]">forward_to_inbox</span>
              <span>Send Reminder (SMS / WhatsApp)</span>
            </button>

            <div className="grid grid-cols-2 gap-2">
              <button
                onClick={handleReschedule}
                className="py-2.5 px-3 rounded-xl bg-surface-container hover:bg-surface-container-high text-on-surface font-label-md text-label-md flex items-center justify-center gap-1.5 transition-colors cursor-pointer"
              >
                <span className="material-symbols-outlined text-[18px]">update</span>
                <span>Reschedule</span>
              </button>

              {isPending ? (
                <button
                  onClick={handleConfirmSlot}
                  className="py-2.5 px-3 rounded-xl bg-primary hover:opacity-95 text-on-primary font-label-md text-label-md flex items-center justify-center gap-1.5 transition-colors cursor-pointer shadow-sm"
                >
                  <span className="material-symbols-outlined text-[18px]">check</span>
                  <span>Confirm Slot</span>
                </button>
              ) : (
                <button
                  onClick={handleMarkCompleted}
                  disabled={isCompleted}
                  className={`py-2.5 px-3 rounded-xl font-label-md text-label-md flex items-center justify-center gap-1.5 transition-colors cursor-pointer shadow-sm ${
                    isCompleted
                      ? 'bg-surface-muted text-on-surface-variant/60 cursor-not-allowed'
                      : 'bg-status-confirmed hover:opacity-95 text-on-primary'
                  }`}
                >
                  <span className="material-symbols-outlined text-[18px]">
                    {isCompleted ? 'check_circle' : 'check'}
                  </span>
                  <span>{isCompleted ? 'Completed' : 'Mark Completed'}</span>
                </button>
              )}
            </div>

            {appointment.status !== 'Cancelled' && (
              <button
                onClick={handleCancel}
                className="w-full py-2 px-4 rounded-xl text-error hover:bg-error-container/40 font-label-sm text-label-sm flex items-center justify-center gap-1.5 transition-colors mt-1 cursor-pointer"
              >
                <span className="material-symbols-outlined text-[16px]">cancel</span>
                <span>Cancel Appointment</span>
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
