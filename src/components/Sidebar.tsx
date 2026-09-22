import React from 'react';
import { NavigationTab } from '../types';

interface SidebarProps {
  currentTab: NavigationTab;
  onTabChange: (tab: NavigationTab) => void;
  isOpenOnMobile?: boolean;
  onCloseMobile?: () => void;
}

export const BOOKFLOW_LOGO_URL = "https://lh3.googleusercontent.com/aida/AEtjO1WU5QWZlKlkOYz_IjVUdkCTTSM9PQKkRMClfa65R8zJPToiuiP5231b_JRhYpgNY_Lel91lk85vWu2R0KPdxvfUp1ssXnVtR6ZTwrQ_7XRTsSDu3sbyCzzmIb7JXaxqCQbWWUxaH6aoEnluifPn5JqOJZGbjGXyvuoo-NcTMneZiqGIsP-LrU6Qh-814BiTW9z0nS6JbPWYlgCnEWL26I_GRHMuqVMXQZUoGtxSHjFBXwsJoSvfo87mUg";

export const OWNER_PHOTO_URL = "https://lh3.googleusercontent.com/aida-public/AB6AXuAkmuVfvY2XBpl8X910MEHVMoMuEZoWTTmTLgca5smav4jZZd5f7QA1WbtjDbBhohHn3gTxb8mhFNq7gxrS31ZQtKPTWw-92nnFvSy0JW121jVErfDCvBfTdRRCKwdy2nP_Wz8VUqv9w9Qj5XLlas8nXlB4ak2VjMtmCd_C_aul4Lm1H5qO4xmsDkO43F2dqRGEIJznKU1tvQeYIb-azsPz6_RpsYU2n-0wibb7q77h2MEOpoPPiSY";

export const STUDIO_COVER_URL = "https://lh3.googleusercontent.com/aida-public/AB6AXuDgGqB7Y4gnKr0T25wWorF2s4XCVJVSReXYXVbfdjMAAIK7cvd40P3MR3BXb1ndrbaSBMjW3zhqq8UDCl_h3FeYn7fssF81Cp7XGwracJBSQ2RQERHORHvgjc4Dc-dEMBZgFlzz7jSi2ZGBgfMIwBSNjSQqPHjO5C7-kMNCQJIhgYvo4BdQVd4INZykHvqsUFwVygP8k5LEK-gPfouMl8Uig2d9y2bXQPiau73-Pt0PilMASadyr8Q";

export const Sidebar: React.FC<SidebarProps> = ({
  currentTab,
  onTabChange,
  isOpenOnMobile = false,
  onCloseMobile,
}) => {
  const navItems: { id: NavigationTab; label: string; icon: string }[] = [
    { id: 'dashboard', label: 'Dashboard', icon: 'space_dashboard' },
    { id: 'calendar-&-schedule', label: 'Calendar & Schedule', icon: 'calendar_today' },
    { id: 'services-&-pricing', label: 'Services & Pricing', icon: 'content_cut' },
    { id: 'availability-&-hours', label: 'Availability & Hours', icon: 'schedule' },
    { id: 'customers', label: 'Customers', icon: 'groups' },
    { id: 'settings', label: 'Settings', icon: 'settings' },
  ];

  return (
    <>
      {/* Mobile backdrop */}
      {isOpenOnMobile && (
        <div
          className="fixed inset-0 bg-inverse-surface/40 backdrop-blur-xs z-40 lg:hidden"
          onClick={onCloseMobile}
        />
      )}

      <aside
        className={`fixed left-0 top-0 h-full w-64 bg-surface-card z-50 flex flex-col shadow-[0_1px_8px_rgba(0,0,0,0.04)] border-r border-border-subtle transition-transform duration-200 ease-in-out ${
          isOpenOnMobile ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'
        }`}
      >
        {/* Brand Header */}
        <div className="h-16 px-4 flex items-center justify-between bg-surface-card border-b border-border-subtle/50">
          <div className="flex items-center gap-2">
            <img
              alt="BookFlow Logo"
              className="h-8 w-auto object-contain"
              src={BOOKFLOW_LOGO_URL}
            />
            <span className="font-headline-md text-headline-md text-on-surface font-semibold tracking-tight">
              BookFlow
            </span>
          </div>
          {isOpenOnMobile && (
            <button
              onClick={onCloseMobile}
              className="p-1 rounded-lg hover:bg-surface-container text-on-surface-variant lg:hidden"
            >
              <span className="material-symbols-outlined text-[20px]">close</span>
            </button>
          )}
        </div>

        {/* Tenant Studio Profile Pill */}
        <div className="px-4 py-3">
          <div className="p-3 bg-surface-container-low rounded-lg border border-border-subtle/60">
            <p className="font-label-md text-label-md text-on-surface font-medium truncate">
              Gift's Barbershop & Studio
            </p>
            <div className="flex items-center gap-1.5 mt-1">
              <span className="w-2 h-2 rounded-full bg-status-confirmed shrink-0 animate-pulse"></span>
              <span className="font-caption text-caption text-on-surface-variant">
                Open • Taking bookings
              </span>
            </div>
          </div>
        </div>

        {/* Navigation Items */}
        <nav className="flex-1 px-3 py-2 flex flex-col gap-1 overflow-y-auto">
          {navItems.map((item) => {
            const isActive =
              currentTab === item.id ||
              (item.id === 'services-&-pricing' && currentTab === 'availability-&-hours') ||
              (item.id === 'availability-&-hours' && currentTab === 'services-&-pricing');

            const isExactActive = currentTab === item.id;

            return (
              <button
                key={item.id}
                onClick={() => {
                  onTabChange(item.id);
                  if (onCloseMobile) onCloseMobile();
                }}
                className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-lg transition-all text-left ${
                  isExactActive
                    ? 'bg-secondary-container text-on-secondary-fixed font-label-md shadow-xs'
                    : 'text-on-surface-variant hover:bg-surface-container hover:text-on-surface font-body-md text-body-md'
                }`}
              >
                <span
                  className={`material-symbols-outlined text-[20px] ${
                    isExactActive ? 'text-primary' : 'text-on-surface-variant'
                  }`}
                >
                  {item.icon}
                </span>
                <span className="truncate">{item.label}</span>
              </button>
            );
          })}
        </nav>

        {/* Public Page Footer CTA */}
        <div className="p-4 bg-surface-card border-t border-border-subtle/60">
          <button
            onClick={() => {
              onTabChange('booking-portal');
              if (onCloseMobile) onCloseMobile();
            }}
            className="w-full flex items-center justify-between px-3 py-2 rounded-lg bg-surface-muted hover:bg-surface-container hover:text-on-surface text-on-surface-variant font-label-sm text-label-sm transition-colors group"
          >
            <span className="flex items-center gap-2">
              <span className="material-symbols-outlined text-[16px] text-primary group-hover:scale-110 transition-transform">
                visibility
              </span>
              <span>Public Page</span>
            </span>
            <span className="material-symbols-outlined text-[16px] text-outline group-hover:text-on-surface transition-colors">
              open_in_new
            </span>
          </button>
        </div>
      </aside>
    </>
  );
};
