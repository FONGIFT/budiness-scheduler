import React, { useEffect, useState } from 'react';
import {
  Appointment,
  Customer,
  NavigationTab,
  ServiceItem,
  StudioSettings,
  WorkingDay,
} from './types';
import {
  initialAppointments,
  initialCustomers,
  initialServices,
  initialStudioSettings,
  initialWorkingDays,
} from './data/mockData';
import { Sidebar } from './components/Sidebar';
import { Header } from './components/Header';
import { DashboardView } from './components/DashboardView';
import { CalendarView } from './components/CalendarView';
import { ServicesAvailabilityView } from './components/ServicesAvailabilityView';
import { PublicBookingPortal } from './components/PublicBookingPortal';
import { CustomersView } from './components/CustomersView';
import { SettingsView } from './components/SettingsView';
import { AppointmentDrawer } from './components/AppointmentDrawer';
import { NewAppointmentModal } from './components/NewAppointmentModal';
import { QrCodeModal } from './components/QrCodeModal';
import { loadDatabaseState, saveAppointment, saveCustomer, saveServices, saveSettings, saveWorkingDays } from './lib/supabase';

export default function App() {
  const [currentTab, setCurrentTab] = useState<NavigationTab>('dashboard');
  const [appointments, setAppointments] = useState<Appointment[]>(initialAppointments);
  const [services, setServices] = useState<ServiceItem[]>(initialServices);
  const [workingDays, setWorkingDays] = useState<WorkingDay[]>(initialWorkingDays);
  const [settings, setSettings] = useState<StudioSettings>(initialStudioSettings);
  const [customers, setCustomers] = useState<Customer[]>(initialCustomers);

  // Search & Filter
  const [searchQuery, setSearchQuery] = useState('');

  // Modals & Drawers
  const [isMobileSidebarOpen, setIsMobileSidebarOpen] = useState(false);
  const [isNewAppointmentOpen, setIsNewAppointmentOpen] = useState(false);
  const [isQrModalOpen, setIsQrModalOpen] = useState(false);
  const [selectedAppointment, setSelectedAppointment] = useState<Appointment | null>(null);

  // Toast Notification System
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  useEffect(() => {
    let active = true;
    void loadDatabaseState()
      .then((data) => {
        if (!active || !data) return;
        if (data.appointments) setAppointments(data.appointments);
        if (data.customers) setCustomers(data.customers);
        if (data.services) setServices(data.services);
        if (data.workingDays) setWorkingDays(data.workingDays);
        if (data.settings) setSettings(data.settings);
      })
      .catch(() => showToast('Could not load the database; using demo data.'));
    return () => { active = false; };
  }, []);

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => {
      setToastMessage((prev) => (prev === msg ? null : prev));
    }, 3500);
  };

  const handleUpdateAppointmentStatus = (id: string, newStatus: Appointment['status']) => {
    setAppointments((prev) =>
      prev.map((apt) => {
        if (apt.id !== id) return apt;
        const updated = { ...apt, status: newStatus };
        void saveAppointment(updated).catch(() => showToast('Appointment status was not saved to the database.'));
        return updated;
      })
    );
    if (selectedAppointment && selectedAppointment.id === id) {
      setSelectedAppointment((prev) => (prev ? { ...prev, status: newStatus } : null));
    }
  };

  const handleAddAppointment = (newApt: Appointment) => {
    setAppointments((prev) => [newApt, ...prev]);
    void saveAppointment(newApt).catch(() => showToast('Appointment was not saved to the database.'));

    // Also add to client directory if not exists
    if (!customers.some((c) => c.name.toLowerCase() === newApt.clientName.toLowerCase())) {
      const newCust: Customer = {
        id: `cust-${Date.now()}`,
        name: newApt.clientName,
        phone: newApt.clientPhone,
        email: newApt.clientEmail || 'client@example.com',
        totalVisits: 1,
        totalSpentFcfa: newApt.rawPrice,
        lastVisit: 'Today, ' + newApt.time,
        preferredBarber: newApt.staffName,
        notes: newApt.notes || 'First visit',
        tag: 'New',
      };
      setCustomers((prev) => [newCust, ...prev]);
      void saveCustomer(newCust).catch(() => showToast('Customer was not saved to the database.'));
    }
  };

  const handleUpdateServices = (updatedServices: ServiceItem[]) => {
    setServices(updatedServices);
    void saveServices(updatedServices).catch(() => showToast('Services were not saved to the database.'));
  };

  const handleUpdateWorkingDays = (updatedWorkingDays: WorkingDay[]) => {
    setWorkingDays(updatedWorkingDays);
    void saveWorkingDays(updatedWorkingDays).catch(() => showToast('Working hours were not saved to the database.'));
  };

  const handleUpdateSettings = (updatedSettings: StudioSettings) => {
    setSettings(updatedSettings);
    void saveSettings(updatedSettings).catch(() => showToast('Settings were not saved to the database.'));
  };

  // Filtered appointments for today based on search
  const todayAppointments = appointments.filter((apt) => {
    if (apt.dayKey !== '24') return false;
    if (!searchQuery) return true;
    const q = searchQuery.toLowerCase();
    return (
      apt.clientName.toLowerCase().includes(q) ||
      apt.serviceName.toLowerCase().includes(q) ||
      apt.staffName.toLowerCase().includes(q) ||
      apt.chair.toLowerCase().includes(q) ||
      apt.clientPhone.includes(q)
    );
  });

  // Render Public Booking Portal as a full-bleed client experience when active
  if (currentTab === 'booking-portal') {
    return (
      <div className="min-h-screen bg-surface selection:bg-secondary-container selection:text-on-secondary-fixed">
        <PublicBookingPortal
          services={services}
          settings={settings}
          onNewBookingCreated={handleAddAppointment}
          onNavigate={setCurrentTab}
          onShowToast={showToast}
        />

        {/* Global Toast Notification */}
        {toastMessage && (
          <div className="fixed bottom-6 right-6 z-50 flex items-center gap-2.5 bg-on-surface text-surface-card px-4 py-3 rounded-xl shadow-xl animate-in slide-in-from-bottom duration-200">
            <span className="material-symbols-outlined text-tertiary-fixed text-[20px]">
              check_circle
            </span>
            <span className="font-label-md text-label-md">{toastMessage}</span>
          </div>
        )}
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-surface-canvas selection:bg-secondary-container selection:text-on-secondary-fixed">
      {/* Merchant Left Sidebar */}
      <Sidebar
        currentTab={currentTab}
        onTabChange={setCurrentTab}
        isOpenOnMobile={isMobileSidebarOpen}
        onCloseMobile={() => setIsMobileSidebarOpen(false)}
      />

      {/* Merchant Top Header */}
      <Header
        onOpenMobileSidebar={() => setIsMobileSidebarOpen(true)}
        onOpenNewAppointment={() => setIsNewAppointmentOpen(true)}
        onNavigate={setCurrentTab}
        searchQuery={searchQuery}
        onSearchChange={setSearchQuery}
      />

      {/* Main Content Area */}
      <main className="lg:ml-64 pt-20 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto transition-all">
        {currentTab === 'dashboard' && (
          <DashboardView
            settings={settings}
            todayAppointments={todayAppointments}
            onSelectAppointment={setSelectedAppointment}
            onOpenNewAppointment={() => setIsNewAppointmentOpen(true)}
            onOpenQrModal={() => setIsQrModalOpen(true)}
            onShowToast={showToast}
            onNavigate={setCurrentTab}
            onUpdateStatus={handleUpdateAppointmentStatus}
          />
        )}

        {currentTab === 'calendar-&-schedule' && (
          <CalendarView
            appointments={appointments}
            onSelectAppointment={setSelectedAppointment}
            onOpenManualAppointment={() => setIsNewAppointmentOpen(true)}
            onShowToast={showToast}
          />
        )}

        {(currentTab === 'services-&-pricing' || currentTab === 'availability-&-hours') && (
          <ServicesAvailabilityView
            services={services}
            workingDays={workingDays}
            settings={settings}
            onUpdateServices={handleUpdateServices}
            onUpdateWorkingDays={handleUpdateWorkingDays}
            onUpdateSettings={handleUpdateSettings}
            onNavigate={setCurrentTab}
            onShowToast={showToast}
            initialTab={currentTab === 'availability-&-hours' ? 'hours' : 'services'}
          />
        )}

        {currentTab === 'customers' && (
          <CustomersView
            customers={customers}
            onShowToast={showToast}
            onOpenNewAppointment={() => setIsNewAppointmentOpen(true)}
          />
        )}

        {currentTab === 'settings' && (
          <SettingsView
            settings={settings}
            onUpdateSettings={handleUpdateSettings}
            onShowToast={showToast}
          />
        )}
      </main>

      {/* Slide-over Inspector Drawer for Appointments */}
      <AppointmentDrawer
        appointment={selectedAppointment}
        isOpen={Boolean(selectedAppointment)}
        onClose={() => setSelectedAppointment(null)}
        onUpdateStatus={handleUpdateAppointmentStatus}
        onShowToast={showToast}
      />

      {/* Manual Appointment Booking Modal */}
      <NewAppointmentModal
        isOpen={isNewAppointmentOpen}
        onClose={() => setIsNewAppointmentOpen(false)}
        services={services}
        onAddAppointment={handleAddAppointment}
        onShowToast={showToast}
      />

      {/* Storefront QR Code Flyer Modal */}
      <QrCodeModal
        isOpen={isQrModalOpen}
        onClose={() => setIsQrModalOpen(false)}
        bookingUrl={settings.bookingUrl}
        onShowToast={showToast}
      />

      {/* Toast Notification Toast */}
      {toastMessage && (
        <div className="fixed bottom-6 right-6 z-50 flex items-center gap-2.5 bg-on-surface text-surface-card px-4 py-3 rounded-xl shadow-xl animate-in slide-in-from-bottom duration-200 border border-border-subtle/20">
          <span className="material-symbols-outlined text-tertiary-fixed text-[20px]">
            check_circle
          </span>
          <span className="font-label-md text-label-md">{toastMessage}</span>
        </div>
      )}
    </div>
  );
}
