import React, { useState } from 'react';
import { Customer } from '../types';

interface CustomersViewProps {
  customers: Customer[];
  onShowToast: (msg: string) => void;
  onOpenNewAppointment: () => void;
}

export const CustomersView: React.FC<CustomersViewProps> = ({
  customers,
  onShowToast,
  onOpenNewAppointment,
}) => {
  const [filterQuery, setFilterQuery] = useState('');
  const [tagFilter, setTagFilter] = useState<'All' | 'VIP' | 'Regular'>('All');

  const filtered = customers.filter((c) => {
    if (tagFilter !== 'All' && c.tag !== tagFilter) return false;
    if (
      filterQuery &&
      !c.name.toLowerCase().includes(filterQuery.toLowerCase()) &&
      !c.phone.includes(filterQuery)
    ) {
      return false;
    }
    return true;
  });

  const vipCount = customers.filter((c) => c.tag === 'VIP').length;
  const totalRevenue = customers.reduce((acc, c) => acc + c.totalSpentFcfa, 0);

  return (
    <div className="flex flex-col w-full gap-6 pb-12">
      {/* Header & Metrics */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-surface-card p-5 rounded-2xl shadow-sm border border-border-subtle">
          <span className="font-label-sm text-label-sm text-on-surface-variant font-medium">
            Total Client Directory
          </span>
          <p className="font-headline-xl text-headline-xl text-on-surface font-bold mt-2">
            {customers.length}
          </p>
          <span className="font-caption text-caption text-status-confirmed">
            Active clients on file
          </span>
        </div>

        <div className="bg-surface-card p-5 rounded-2xl shadow-sm border border-border-subtle">
          <span className="font-label-sm text-label-sm text-on-surface-variant font-medium">
            VIP Members
          </span>
          <p className="font-headline-xl text-headline-xl text-on-surface font-bold mt-2">
            {vipCount}
          </p>
          <span className="font-caption text-caption text-primary">High-frequency patrons</span>
        </div>

        <div className="bg-surface-card p-5 rounded-2xl shadow-sm border border-border-subtle">
          <span className="font-label-sm text-label-sm text-on-surface-variant font-medium">
            Repeat Booking Rate
          </span>
          <p className="font-headline-xl text-headline-xl text-on-surface font-bold mt-2">
            87%
          </p>
          <span className="font-caption text-caption text-tertiary">Retention score</span>
        </div>

        <div className="bg-surface-card p-5 rounded-2xl shadow-sm border border-border-subtle">
          <span className="font-label-sm text-label-sm text-on-surface-variant font-medium">
            Total Client Spend
          </span>
          <p className="font-headline-lg text-headline-lg text-on-surface font-bold mt-2">
            {totalRevenue.toLocaleString()} FCFA
          </p>
          <span className="font-caption text-caption text-status-confirmed">
            Lifetime salon revenue
          </span>
        </div>
      </div>

      {/* Filter Toolbar */}
      <div className="bg-surface-card rounded-2xl p-4 shadow-sm border border-border-subtle flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div className="flex items-center gap-2 flex-1 max-w-md">
          <div className="relative w-full">
            <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-outline text-[18px]">
              search
            </span>
            <input
              type="text"
              value={filterQuery}
              onChange={(e) => setFilterQuery(e.target.value)}
              placeholder="Search clients by name or phone..."
              className="w-full pl-9 pr-4 py-2 rounded-xl bg-surface-container-low border border-border-subtle focus:bg-surface-card focus:border-primary outline-none font-body-sm text-body-sm"
            />
          </div>
        </div>

        <div className="flex items-center gap-2">
          {(['All', 'VIP', 'Regular'] as const).map((tag) => (
            <button
              key={tag}
              onClick={() => setTagFilter(tag)}
              className={`px-3.5 py-1.5 rounded-xl font-label-sm text-label-sm transition-colors cursor-pointer ${
                tagFilter === tag
                  ? 'bg-primary text-on-primary font-semibold shadow-xs'
                  : 'bg-surface-container-low hover:bg-surface-container text-on-surface'
              }`}
            >
              {tag}
            </button>
          ))}
          <button
            onClick={onOpenNewAppointment}
            className="flex items-center gap-1.5 px-4 py-1.5 rounded-xl bg-primary text-on-primary font-label-sm text-label-sm shadow-sm hover:opacity-95 cursor-pointer ml-2"
          >
            <span className="material-symbols-outlined text-[16px]">add</span>
            <span>Book Client</span>
          </button>
        </div>
      </div>

      {/* Customers List Table */}
      <div className="bg-surface-card rounded-2xl shadow-sm border border-border-subtle overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-surface-container-low border-b border-border-subtle text-caption font-caption text-on-surface-variant uppercase">
                <th className="py-3 px-4 font-semibold">Client Name</th>
                <th className="py-3 px-4 font-semibold">Contact Info</th>
                <th className="py-3 px-4 font-semibold">Preferred Barber</th>
                <th className="py-3 px-4 font-semibold">Visits</th>
                <th className="py-3 px-4 font-semibold">Total Spent</th>
                <th className="py-3 px-4 font-semibold">Last Visit</th>
                <th className="py-3 px-4 font-semibold text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border-subtle/60 text-body-sm font-body-sm">
              {filtered.map((c) => (
                <tr key={c.id} className="hover:bg-surface-container-low/50 transition-colors">
                  <td className="py-3.5 px-4">
                    <div className="flex items-center gap-3">
                      <div className="w-9 h-9 rounded-full bg-primary-fixed text-on-primary-fixed flex items-center justify-center font-bold text-label-md shadow-xs">
                        {c.name
                          .split(' ')
                          .map((n) => n[0])
                          .join('')
                          .slice(0, 2)}
                      </div>
                      <div>
                        <div className="flex items-center gap-1.5">
                          <span className="font-semibold text-on-surface">{c.name}</span>
                          {c.tag === 'VIP' && (
                            <span className="px-2 py-0.2 rounded-full bg-secondary-container text-on-secondary-fixed text-[10px] font-bold">
                              VIP
                            </span>
                          )}
                        </div>
                        <p className="font-caption text-caption text-on-surface-variant truncate max-w-xs">
                          {c.notes}
                        </p>
                      </div>
                    </div>
                  </td>
                  <td className="py-3.5 px-4">
                    <div className="text-on-surface font-mono text-caption">{c.phone}</div>
                    <div className="font-caption text-caption text-outline">{c.email}</div>
                  </td>
                  <td className="py-3.5 px-4">
                    <span className="px-2.5 py-1 rounded-lg bg-surface-container text-on-surface font-caption text-caption font-medium">
                      {c.preferredBarber} (Chair {c.preferredBarber === 'Gift' ? '1' : '2'})
                    </span>
                  </td>
                  <td className="py-3.5 px-4 font-semibold text-on-surface">{c.totalVisits}</td>
                  <td className="py-3.5 px-4 font-bold text-primary">
                    {c.totalSpentFcfa.toLocaleString()} FCFA
                  </td>
                  <td className="py-3.5 px-4 text-on-surface-variant font-caption text-caption">
                    {c.lastVisit}
                  </td>
                  <td className="py-3.5 px-4 text-right">
                    <div className="flex items-center justify-end gap-1.5">
                      <a
                        href={`tel:${c.phone}`}
                        className="p-1.5 rounded-lg text-primary hover:bg-surface-container"
                        title="Call Client"
                      >
                        <span className="material-symbols-outlined text-[18px]">phone</span>
                      </a>
                      <button
                        onClick={() =>
                          onShowToast(`Dispatched WhatsApp greeting to ${c.name}!`)
                        }
                        className="p-1.5 rounded-lg text-tertiary hover:bg-surface-container cursor-pointer"
                        title="Send WhatsApp Message"
                      >
                        <span className="material-symbols-outlined text-[18px]">chat</span>
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
