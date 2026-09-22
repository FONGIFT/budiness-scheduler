import React, { useState } from 'react';
import { OWNER_PHOTO_URL } from './Sidebar';
import { NavigationTab } from '../types';

interface HeaderProps {
  onOpenMobileSidebar: () => void;
  onOpenNewAppointment: () => void;
  onNavigate: (tab: NavigationTab) => void;
  searchQuery: string;
  onSearchChange: (q: string) => void;
}

export const Header: React.FC<HeaderProps> = ({
  onOpenMobileSidebar,
  onOpenNewAppointment,
  onNavigate,
  searchQuery,
  onSearchChange,
}) => {
  const [showNotifications, setShowNotifications] = useState(false);

  const sampleNotifications = [
    {
      id: 'notif-1',
      title: 'New Online Booking',
      desc: 'Sarah M. booked Haircut + Beard Styling for 10:00 AM',
      time: '12m ago',
      read: false,
    },
    {
      id: 'notif-2',
      title: 'Schedule Adjusted',
      desc: 'Marc O. moved appointment to Friday 11:00 AM',
      time: '48m ago',
      read: false,
    },
    {
      id: 'notif-3',
      title: 'Reminder Dispatched',
      desc: 'WhatsApp & SMS confirmation sent to David K.',
      time: '1h ago',
      read: true,
    },
  ];

  return (
    <header className="fixed top-0 left-0 lg:left-64 right-0 h-16 bg-surface-card/90 backdrop-blur-xl shadow-[0_1px_8px_rgba(0,0,0,0.04)] border-b border-border-subtle/60 z-40 px-4 sm:px-6 lg:px-8 flex items-center justify-between gap-3">
      {/* Mobile Menu Trigger & Search */}
      <div className="flex items-center gap-3 flex-1 max-w-xl">
        <button
          onClick={onOpenMobileSidebar}
          className="p-2 -ml-2 rounded-lg hover:bg-surface-muted text-on-surface-variant lg:hidden"
          title="Open menu"
        >
          <span className="material-symbols-outlined text-[22px]">menu</span>
        </button>

        <div className="relative w-full max-w-md">
          <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-on-surface-variant text-[20px]">
            search
          </span>
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => onSearchChange(e.target.value)}
            placeholder="Search appointments, clients, or services..."
            className="w-full pl-9 pr-4 py-2 rounded-lg bg-surface-muted text-on-surface placeholder:text-outline font-body-sm text-body-sm outline-none focus:bg-surface-card focus:ring-2 focus:ring-primary/20 border border-transparent focus:border-primary/40 transition-all"
          />
          {searchQuery && (
            <button
              onClick={() => onSearchChange('')}
              className="absolute right-2.5 top-1/2 -translate-y-1/2 text-outline hover:text-on-surface"
            >
              <span className="material-symbols-outlined text-[16px]">close</span>
            </button>
          )}
        </div>
      </div>

      {/* Right Actions */}
      <div className="flex items-center gap-2 sm:gap-4">
        {/* View Public Page Trigger */}
        <button
          onClick={() => onNavigate('booking-portal')}
          className="hidden md:flex items-center gap-1.5 text-on-surface-variant hover:text-on-surface font-label-sm text-label-sm px-2.5 py-1.5 rounded-lg hover:bg-surface-container transition-colors"
        >
          <span className="material-symbols-outlined text-[18px]">visibility</span>
          <span>View Public Page</span>
          <span className="material-symbols-outlined text-[14px]">open_in_new</span>
        </button>

        {/* New Appointment Primary Button */}
        <button
          onClick={onOpenNewAppointment}
          className="flex items-center gap-1.5 bg-primary text-on-primary font-label-md text-label-md px-3.5 py-2 rounded-lg shadow-sm hover:opacity-95 active:scale-[0.98] transition-all cursor-pointer"
        >
          <span className="material-symbols-outlined text-[18px]">add</span>
          <span className="hidden sm:inline">New Appointment</span>
          <span className="sm:hidden">Book</span>
        </button>

        {/* Notifications Dropdown */}
        <div className="relative">
          <button
            onClick={() => setShowNotifications(!showNotifications)}
            className="relative flex items-center justify-center w-9 h-9 rounded-lg hover:bg-surface-muted transition-colors cursor-pointer"
            title="Notifications"
          >
            <span className="material-symbols-outlined text-on-surface-variant text-[22px]">
              notifications
            </span>
            <span className="absolute top-2 right-2 w-2 h-2 bg-error rounded-full ring-2 ring-surface-card"></span>
          </button>

          {showNotifications && (
            <div className="absolute right-0 mt-2 w-80 bg-surface-card rounded-xl shadow-xl border border-border-subtle p-3 z-50 animate-in fade-in zoom-in-95 duration-150">
              <div className="flex items-center justify-between pb-2 mb-2 border-b border-border-subtle">
                <span className="font-label-md text-label-md font-semibold text-on-surface">
                  Notifications
                </span>
                <span className="text-caption font-caption text-primary bg-primary-fixed/40 px-2 py-0.5 rounded-full font-semibold">
                  2 unread
                </span>
              </div>
              <div className="flex flex-col gap-2 max-h-72 overflow-y-auto">
                {sampleNotifications.map((n) => (
                  <div
                    key={n.id}
                    className={`p-2.5 rounded-lg text-left transition-colors ${
                      !n.read ? 'bg-surface-container-low' : 'hover:bg-surface-muted'
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <p className="font-label-sm text-label-sm font-semibold text-on-surface">
                        {n.title}
                      </p>
                      <span className="font-caption text-caption text-outline">{n.time}</span>
                    </div>
                    <p className="font-caption text-caption text-on-surface-variant mt-0.5 leading-snug">
                      {n.desc}
                    </p>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Profile Avatar & Info */}
        <div
          onClick={() => onNavigate('settings')}
          className="flex items-center gap-2 pl-1 cursor-pointer hover:opacity-85 transition-opacity"
        >
          <img
            alt="Gift Studio Profile"
            className="w-8 h-8 rounded-full object-cover ring-2 ring-primary/20"
            src={OWNER_PHOTO_URL}
          />
          <div className="hidden lg:block text-left">
            <p className="font-label-sm text-label-sm text-on-surface font-medium leading-none">
              Gift Studio
            </p>
            <p className="font-caption text-caption text-on-surface-variant mt-0.5">Owner</p>
          </div>
        </div>
      </div>
    </header>
  );
};
