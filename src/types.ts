export type NavigationTab = 
  | 'dashboard'
  | 'calendar-&-schedule'
  | 'services-&-pricing'
  | 'availability-&-hours'
  | 'customers'
  | 'settings'
  | 'booking-portal';

export type AppointmentStatus = 'Confirmed' | 'Pending' | 'Completed' | 'Cancelled' | 'Blocked';

export interface Appointment {
  id: string;
  clientName: string;
  clientPhone: string;
  clientEmail?: string;
  serviceId: string;
  serviceName: string;
  date: string; // e.g., 'Thursday, Sep 24'
  dayKey: string; // e.g. '2025-09-24' or '24'
  dayOfWeek: 'Mon' | 'Tue' | 'Wed' | 'Thu' | 'Fri' | 'Sat' | 'Sun';
  time: string; // e.g. '09:00'
  endTime: string; // e.g. '09:30'
  duration: string; // e.g. '30m' or '45 mins'
  staffName: string; // 'Gift' | 'Samuel'
  chair: string; // 'Chair 1' | 'Chair 2'
  price: string; // e.g. '3,000 FCFA'
  rawPrice: number;
  status: AppointmentStatus;
  notes?: string;
  clientTag?: 'VIP' | 'Repeat Client' | 'Prepaid' | 'Action Needed' | 'New';
  avatarUrl?: string;
  initials?: string;
}

export interface ServiceItem {
  id: string;
  name: string;
  tag?: 'Standard' | 'Most Popular' | 'Signature' | 'Inactive';
  durationMinutes: number;
  priceFcfa: number;
  assignedStaff: string[]; // e.g. ['Gift', 'Samuel']
  isActive: boolean;
  iconName: string;
  description: string;
}

export interface WorkingDay {
  dayName: string;
  shortName: string;
  isOpen: boolean;
  openTime: string;
  closeTime: string;
  hasBreak: boolean;
  breakStart: string;
  breakEnd: string;
}

export interface Customer {
  id: string;
  name: string;
  phone: string;
  email: string;
  totalVisits: number;
  totalSpentFcfa: number;
  lastVisit: string;
  preferredBarber: string;
  notes: string;
  tag?: 'VIP' | 'Regular' | 'New';
}

export interface StudioSettings {
  name: string;
  tagline: string;
  address: string;
  city: string;
  phone: string;
  currency: string;
  bookingUrl: string;
  isOpen: boolean;
  appointmentBufferMinutes: number;
  minimumNoticeHours: number;
  maxBookingHorizonDays: number;
  autoRemindersEnabled: boolean;
}
