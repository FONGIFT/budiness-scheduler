import React, { useState } from 'react';
import { StudioSettings } from '../types';

interface SettingsViewProps {
  settings: StudioSettings;
  onUpdateSettings: (s: StudioSettings) => void;
  onShowToast: (msg: string) => void;
}

export const SettingsView: React.FC<SettingsViewProps> = ({
  settings,
  onUpdateSettings,
  onShowToast,
}) => {
  const [name, setName] = useState(settings.name);
  const [address, setAddress] = useState(settings.address);
  const [city, setCity] = useState(settings.city);
  const [phone, setPhone] = useState(settings.phone);
  const [currency, setCurrency] = useState(settings.currency);
  const [bookingUrl, setBookingUrl] = useState(settings.bookingUrl);
  const [autoReminders, setAutoReminders] = useState(settings.autoRemindersEnabled);

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    onUpdateSettings({
      ...settings,
      name,
      address,
      city,
      phone,
      currency,
      bookingUrl,
      autoRemindersEnabled: autoReminders,
    });
    onShowToast('Studio business profile and settings saved!');
  };

  return (
    <div className="flex flex-col w-full max-w-4xl gap-6 pb-12">
      <div className="bg-surface-card rounded-2xl p-6 shadow-sm border border-border-subtle">
        <h2 className="font-headline-lg text-headline-lg font-semibold text-on-surface">
          Studio Profile & Business Preferences
        </h2>
        <p className="font-body-sm text-body-sm text-on-surface-variant mt-1">
          Customize your business identity, public booking slug, automated notifications, and regional currency.
        </p>

        <form onSubmit={handleSave} className="flex flex-col gap-5 mt-6">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block font-label-sm text-label-sm text-on-surface font-medium mb-1">
                Studio Name
              </label>
              <input
                type="text"
                required
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="w-full px-3.5 py-2.5 rounded-xl bg-surface-container-low border border-border-subtle focus:bg-surface-card focus:border-primary outline-none font-body-sm text-body-sm"
              />
            </div>

            <div>
              <label className="block font-label-sm text-label-sm text-on-surface font-medium mb-1">
                Public Booking Link (Slug)
              </label>
              <div className="flex items-center rounded-xl bg-surface-container-low border border-border-subtle overflow-hidden">
                <span className="px-3 text-caption font-caption text-outline">https://</span>
                <input
                  type="text"
                  required
                  value={bookingUrl}
                  onChange={(e) => setBookingUrl(e.target.value)}
                  className="w-full py-2.5 pr-3 bg-transparent outline-none font-body-sm text-body-sm text-on-surface"
                />
              </div>
            </div>

            <div>
              <label className="block font-label-sm text-label-sm text-on-surface font-medium mb-1">
                Business Phone / WhatsApp
              </label>
              <input
                type="text"
                required
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                className="w-full px-3.5 py-2.5 rounded-xl bg-surface-container-low border border-border-subtle focus:bg-surface-card focus:border-primary outline-none font-body-sm text-body-sm"
              />
            </div>

            <div>
              <label className="block font-label-sm text-label-sm text-on-surface font-medium mb-1">
                Currency & Pricing Unit
              </label>
              <select
                value={currency}
                onChange={(e) => setCurrency(e.target.value)}
                className="w-full px-3.5 py-2.5 rounded-xl bg-surface-container-low border border-border-subtle focus:bg-surface-card focus:border-primary outline-none font-body-sm text-body-sm text-on-surface"
              >
                <option value="FCFA (XAF)">FCFA (XAF) - Central African Franc</option>
                <option value="USD ($)">USD ($) - US Dollar</option>
                <option value="EUR (€)">EUR (€) - Euro</option>
                <option value="NGN (₦)">NGN (₦) - Nigerian Naira</option>
              </select>
            </div>

            <div>
              <label className="block font-label-sm text-label-sm text-on-surface font-medium mb-1">
                Street Address
              </label>
              <input
                type="text"
                value={address}
                onChange={(e) => setAddress(e.target.value)}
                className="w-full px-3.5 py-2.5 rounded-xl bg-surface-container-low border border-border-subtle focus:bg-surface-card focus:border-primary outline-none font-body-sm text-body-sm"
              />
            </div>

            <div>
              <label className="block font-label-sm text-label-sm text-on-surface font-medium mb-1">
                City & Country
              </label>
              <input
                type="text"
                value={city}
                onChange={(e) => setCity(e.target.value)}
                className="w-full px-3.5 py-2.5 rounded-xl bg-surface-container-low border border-border-subtle focus:bg-surface-card focus:border-primary outline-none font-body-sm text-body-sm"
              />
            </div>
          </div>

          {/* Automated Reminders toggle */}
          <div className="p-4 rounded-xl bg-surface-container-low border border-border-subtle flex items-center justify-between mt-2">
            <div className="flex items-center gap-3">
              <span className="material-symbols-outlined text-primary text-[24px]">
                notifications_active
              </span>
              <div>
                <p className="font-label-md text-label-md font-semibold text-on-surface">
                  Automated WhatsApp & SMS Reminders
                </p>
                <p className="font-caption text-caption text-on-surface-variant">
                  Automatically send appointment confirmations and 2-hour pre-service reminders to reduce no-shows.
                </p>
              </div>
            </div>
            <button
              type="button"
              onClick={() => setAutoReminders(!autoReminders)}
              className={`relative inline-flex h-6 w-11 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none ${
                autoReminders ? 'bg-primary' : 'bg-surface-container-highest'
              }`}
            >
              <span
                className={`pointer-events-none inline-block h-5 w-5 transform rounded-full bg-white shadow ring-0 transition duration-200 ease-in-out ${
                  autoReminders ? 'translate-x-5' : 'translate-x-0'
                }`}
              />
            </button>
          </div>

          <div className="flex justify-end pt-4 border-t border-border-subtle">
            <button
              type="submit"
              className="px-6 py-2.5 rounded-xl bg-primary text-on-primary font-label-md text-label-md font-semibold shadow-sm hover:opacity-95 transition-opacity cursor-pointer"
            >
              Save Changes
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
