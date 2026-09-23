-- BookFlow Scheduler: Supabase PostgreSQL schema
-- Run this file once in the Supabase SQL Editor before configuring the client.

create table if not exists public.appointments (
  id text primary key,
  "clientName" text not null,
  "clientPhone" text not null,
  "clientEmail" text,
  "serviceId" text not null,
  "serviceName" text not null,
  date text not null,
  "dayKey" text not null,
  "dayOfWeek" text not null check ("dayOfWeek" in ('Mon','Tue','Wed','Thu','Fri','Sat','Sun')),
  time text not null,
  "endTime" text not null,
  duration text not null,
  "staffName" text not null,
  chair text not null,
  price text not null,
  "rawPrice" integer not null check ("rawPrice" >= 0),
  status text not null check (status in ('Confirmed','Pending','Completed','Cancelled','Blocked')),
  notes text,
  "clientTag" text,
  "avatarUrl" text,
  initials text,
  "createdAt" timestamptz not null default now()
);

create index if not exists appointments_schedule_idx on public.appointments ("dayKey", time, "staffName");
create index if not exists appointments_client_phone_idx on public.appointments ("clientPhone");

create table if not exists public.customers (
  id text primary key, name text not null, phone text not null unique, email text not null,
  "totalVisits" integer not null default 0, "totalSpentFcfa" integer not null default 0,
  "lastVisit" text not null, "preferredBarber" text not null, notes text not null, tag text
);

create table if not exists public.services (
  id text primary key, name text not null, tag text, "durationMinutes" integer not null check ("durationMinutes" > 0),
  "priceFcfa" integer not null check ("priceFcfa" >= 0), "assignedStaff" text[] not null,
  "isActive" boolean not null default true, "iconName" text not null, description text not null
);

create table if not exists public.working_days (
  "dayName" text primary key, "shortName" text not null, "isOpen" boolean not null,
  "openTime" text not null, "closeTime" text not null, "hasBreak" boolean not null,
  "breakStart" text not null, "breakEnd" text not null
);

create table if not exists public.studio_settings (
  id smallint primary key default 1 check (id = 1), name text not null, tagline text not null,
  address text not null, city text not null, phone text not null, currency text not null,
  "bookingUrl" text not null, "isOpen" boolean not null, "appointmentBufferMinutes" integer not null,
  "minimumNoticeHours" integer not null, "maxBookingHorizonDays" integer not null,
  "autoRemindersEnabled" boolean not null
);

-- This starter policy is intentionally limited to authenticated users. Keep the
-- Supabase service-role key off the client; it must never be placed in Vite env vars.
alter table public.appointments enable row level security;
alter table public.customers enable row level security;
alter table public.services enable row level security;
alter table public.working_days enable row level security;
alter table public.studio_settings enable row level security;

create policy "Authenticated users manage appointments" on public.appointments for all to authenticated using (true) with check (true);
create policy "Authenticated users manage customers" on public.customers for all to authenticated using (true) with check (true);
create policy "Authenticated users manage services" on public.services for all to authenticated using (true) with check (true);
create policy "Authenticated users manage working days" on public.working_days for all to authenticated using (true) with check (true);
create policy "Authenticated users manage studio settings" on public.studio_settings for all to authenticated using (true) with check (true);
