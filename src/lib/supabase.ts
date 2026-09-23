import { Appointment, Customer, ServiceItem, StudioSettings, WorkingDay } from '../types';

/**
 * Minimal Supabase REST client. Keeping this dependency-free means the application
 * still starts in demo mode when a Supabase project has not been configured.
 */
const url = import.meta.env.VITE_SUPABASE_URL?.replace(/\/$/, '');
const anonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;
const isConfigured = Boolean(url && anonKey);

type DatabaseState = {
  appointments: Appointment[];
  customers: Customer[];
  services: ServiceItem[];
  workingDays: WorkingDay[];
  settings: StudioSettings;
};

const headers = {
  apikey: anonKey || '',
  Authorization: `Bearer ${anonKey || ''}`,
  'Content-Type': 'application/json',
};

async function request<T>(path: string, init?: RequestInit): Promise<T> {
  const response = await fetch(`${url}/rest/v1/${path}`, { ...init, headers: { ...headers, ...init?.headers } });
  if (!response.ok) throw new Error(`Database request failed (${response.status})`);
  if (response.status === 204 || !response.headers.get('content-type')?.includes('application/json')) {
    return undefined as T;
  }
  return response.json() as Promise<T>;
}

export async function loadDatabaseState(): Promise<Partial<DatabaseState> | null> {
  if (!isConfigured) return null;
  const [appointments, customers, services, workingDays, settings] = await Promise.all([
    request<Appointment[]>('appointments?select=*'),
    request<Customer[]>('customers?select=*'),
    request<ServiceItem[]>('services?select=*'),
    request<WorkingDay[]>('working_days?select=*'),
    request<StudioSettings[]>('studio_settings?select=*&limit=1'),
  ]);
  return { appointments, customers, services, workingDays, settings: settings[0] };
}

export async function saveAppointment(appointment: Appointment): Promise<void> {
  await saveRecord('appointments', appointment, 'id');
}

export async function saveCustomer(customer: Customer): Promise<void> {
  await saveRecord('customers', customer, 'id');
}

export async function saveServices(services: ServiceItem[]): Promise<void> {
  await saveRecord('services', services, 'id');
}

export async function saveWorkingDays(workingDays: WorkingDay[]): Promise<void> {
  await saveRecord('working_days', workingDays, 'dayName');
}

export async function saveSettings(settings: StudioSettings): Promise<void> {
  await saveRecord('studio_settings', { ...settings, id: 1 }, 'id');
}

async function saveRecord(table: string, record: unknown, conflictColumn: string): Promise<void> {
  if (!isConfigured) return;
  await request<void>(`${table}?on_conflict=${conflictColumn}`, {
    method: 'POST',
    headers: { Prefer: 'resolution=merge-duplicates,return=minimal' },
    body: JSON.stringify(record),
  });
}

export const databaseEnabled = isConfigured;
