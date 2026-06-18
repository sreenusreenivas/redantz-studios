-- Run this in Supabase SQL Editor

create table if not exists contact_submissions (
  id          uuid primary key default uuid_generate_v4(),
  name        text not null,
  email       text not null,
  phone       text,
  event_type  text,
  event_date  text,
  message     text not null,
  status      text not null default 'new', -- new | read | replied
  created_at  timestamptz not null default now()
);

create index if not exists contact_submissions_status_idx on contact_submissions(status);
create index if not exists contact_submissions_created_at_idx on contact_submissions(created_at desc);

-- Only authenticated admins can read; inserts are done via service role in the API route
alter table contact_submissions enable row level security;

create policy "Authenticated users manage contact submissions"
  on contact_submissions for all
  using (auth.uid() is not null);
