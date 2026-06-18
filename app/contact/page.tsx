'use client'

import { useState } from 'react'
import Link from 'next/link'
import SiteHeader from '@/components/home/SiteHeader'

const EVENT_TYPES = ['Wedding', 'Pre-Wedding', 'Engagement', 'Portrait', 'Commercial', 'Event', 'Other']

const contactDetails = [
  {
    icon: (
      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
        <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07A19.5 19.5 0 0 1 4.69 12 19.79 19.79 0 0 1 1.61 3.39 2 2 0 0 1 3.59 1h3a2 2 0 0 1 2 1.72c.127.96.361 1.903.7 2.81a2 2 0 0 1-.45 2.11L7.91 8.56a16 16 0 0 0 6.12 6.12l.56-.56a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z" />
      </svg>
    ),
    label: 'Phone',
    value: '+91 98765 43210',
    href: 'tel:+919876543210',
  },
  {
    icon: (
      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
        <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z" />
        <polyline points="22,6 12,13 2,6" />
      </svg>
    ),
    label: 'Email',
    value: 'hello@redantzstudios.com',
    href: 'mailto:hello@redantzstudios.com',
  },
  {
    icon: (
      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
        <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z" />
        <circle cx="12" cy="10" r="3" />
      </svg>
    ),
    label: 'Studio',
    value: 'Visakhapatnam, Andhra Pradesh, India',
    href: 'https://maps.google.com/?q=Visakhapatnam',
  },
]

type FormState = 'idle' | 'loading' | 'success' | 'error'

export default function ContactPage() {
  const [form, setForm] = useState({
    name: '', email: '', phone: '', event_type: '', event_date: '', message: '',
  })
  const [state, setState] = useState<FormState>('idle')
  const [errorMsg, setErrorMsg] = useState('')

  const set = (field: string, value: string) =>
    setForm(prev => ({ ...prev, [field]: value }))

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setState('loading')
    setErrorMsg('')
    try {
      const res = await fetch('/api/contact', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form),
      })
      const data = await res.json()
      if (!res.ok) throw new Error(data.error || 'Something went wrong.')
      setState('success')
    } catch (err: unknown) {
      setErrorMsg(err instanceof Error ? err.message : 'Something went wrong.')
      setState('error')
    }
  }

  return (
    <div className="min-h-screen bg-white">
      <SiteHeader />

      {/* Page header */}
      <div className="pt-[4.5rem] border-b border-gray-100">
        <div className="max-w-[var(--max-w)] mx-auto px-[var(--px)] py-16">
          <p className="text-[0.68rem] font-bold tracking-[0.35em] uppercase text-[#C81010] mb-3">Get in Touch</p>
          <h1 className="text-gray-900 font-bold tracking-tight" style={{ fontSize: 'clamp(2.2rem,5vw,3.5rem)' }}>
            Let&apos;s Plan Your<br />Perfect Day
          </h1>
          <p className="text-gray-400 font-light mt-4 max-w-md leading-relaxed text-sm">
            Tell us about your event and we&apos;ll get back to you within 24 hours.
          </p>
        </div>
      </div>

      {/* Main content */}
      <div className="max-w-[var(--max-w)] mx-auto px-[var(--px)] py-16 lg:py-24">
        <div className="grid grid-cols-1 lg:grid-cols-5 gap-12 lg:gap-20">

          {/* Left — contact info */}
          <div className="lg:col-span-2 space-y-10">

            {/* Contact details */}
            <div className="space-y-6">
              {contactDetails.map(({ icon, label, value, href }) => (
                <a key={label} href={href} target={href.startsWith('http') ? '_blank' : undefined}
                  rel="noreferrer"
                  className="flex items-start gap-4 group">
                  <div className="w-10 h-10 rounded-xl bg-gray-50 border border-gray-100 flex items-center justify-center text-gray-400 flex-shrink-0 group-hover:bg-red-50 group-hover:border-red-100 group-hover:text-[#C81010] transition-all">
                    {icon}
                  </div>
                  <div className="pt-1">
                    <p className="text-[0.65rem] font-bold uppercase tracking-widest text-gray-300 mb-0.5">{label}</p>
                    <p className="text-sm font-medium text-gray-700 group-hover:text-[#C81010] transition-colors leading-snug">{value}</p>
                  </div>
                </a>
              ))}
            </div>

            {/* Divider */}
            <div className="h-px bg-gray-100" />

            {/* Working hours */}
            <div>
              <p className="text-[0.65rem] font-bold uppercase tracking-widest text-gray-300 mb-4">Availability</p>
              <div className="space-y-2.5">
                {[
                  { day: 'Monday – Friday', time: '10:00 AM – 7:00 PM' },
                  { day: 'Saturday', time: '9:00 AM – 8:00 PM' },
                  { day: 'Sunday', time: 'By Appointment' },
                ].map(({ day, time }) => (
                  <div key={day} className="flex items-center justify-between">
                    <span className="text-sm text-gray-500">{day}</span>
                    <span className="text-sm font-medium text-gray-800">{time}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Divider */}
            <div className="h-px bg-gray-100" />

            {/* Social */}
            <div>
              <p className="text-[0.65rem] font-bold uppercase tracking-widest text-gray-300 mb-4">Follow Us</p>
              <div className="flex items-center gap-3">
                {[
                  {
                    name: 'Instagram',
                    href: 'https://instagram.com/redantzstudios',
                    icon: <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8"><rect x="2" y="2" width="20" height="20" rx="5" /><path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z" /><line x1="17.5" y1="6.5" x2="17.51" y2="6.5" /></svg>,
                  },
                  {
                    name: 'Facebook',
                    href: 'https://facebook.com/redantzstudios',
                    icon: <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8"><path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z" /></svg>,
                  },
                  {
                    name: 'YouTube',
                    href: 'https://youtube.com/@redantzstudios',
                    icon: <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8"><path d="M22.54 6.42a2.78 2.78 0 0 0-1.95-1.96C18.88 4 12 4 12 4s-6.88 0-8.59.46a2.78 2.78 0 0 0-1.95 1.96A29 29 0 0 0 1 12a29 29 0 0 0 .46 5.58A2.78 2.78 0 0 0 3.41 19.6C5.12 20 12 20 12 20s6.88 0 8.59-.46a2.78 2.78 0 0 0 1.95-1.96A29 29 0 0 0 23 12a29 29 0 0 0-.46-5.58z" /><polygon points="9.75 15.02 15.5 12 9.75 8.98 9.75 15.02" /></svg>,
                  },
                ].map(({ name, href, icon }) => (
                  <a key={name} href={href} target="_blank" rel="noreferrer"
                    className="w-10 h-10 rounded-xl bg-gray-50 border border-gray-100 flex items-center justify-center text-gray-400 hover:bg-gray-900 hover:border-gray-900 hover:text-white transition-all">
                    {icon}
                  </a>
                ))}
              </div>
            </div>
          </div>

          {/* Right — form */}
          <div className="lg:col-span-3">
            {state === 'success' ? (
              <div className="h-full flex flex-col items-center justify-center text-center py-20 bg-gray-50 rounded-2xl border border-gray-100 px-8">
                <div className="w-14 h-14 rounded-full bg-emerald-50 border border-emerald-100 flex items-center justify-center mb-5">
                  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#10b981" strokeWidth="2">
                    <polyline points="20 6 9 17 4 12" />
                  </svg>
                </div>
                <h2 className="text-xl font-bold text-gray-900 mb-2">Message Sent!</h2>
                <p className="text-gray-400 text-sm font-light max-w-xs leading-relaxed mb-8">
                  Thank you for reaching out. We&apos;ll get back to you within 24 hours.
                </p>
                <button onClick={() => { setState('idle'); setForm({ name: '', email: '', phone: '', event_type: '', event_date: '', message: '' }) }}
                  className="text-sm font-semibold text-[#C81010] hover:underline">
                  Send another message
                </button>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="bg-gray-50 border border-gray-100 rounded-2xl p-8 lg:p-10 space-y-5">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                  <Field label="Full Name" required>
                    <Input
                      type="text" placeholder="Priya & Rahul"
                      value={form.name} onChange={v => set('name', v)} required />
                  </Field>
                  <Field label="Email Address" required>
                    <Input
                      type="email" placeholder="you@example.com"
                      value={form.email} onChange={v => set('email', v)} required />
                  </Field>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                  <Field label="Phone Number">
                    <Input
                      type="tel" placeholder="+91 98765 43210"
                      value={form.phone} onChange={v => set('phone', v)} />
                  </Field>
                  <Field label="Event Type">
                    <select
                      value={form.event_type} onChange={e => set('event_type', e.target.value)}
                      className="w-full bg-white border border-gray-200 rounded-lg px-4 py-3 text-sm text-gray-800 outline-none focus:border-gray-400 transition-colors appearance-none cursor-pointer">
                      <option value="">Select event type</option>
                      {EVENT_TYPES.map(t => <option key={t} value={t}>{t}</option>)}
                    </select>
                  </Field>
                </div>

                <Field label="Event Date">
                  <Input
                    type="date"
                    value={form.event_date} onChange={v => set('event_date', v)} />
                </Field>

                <Field label="Tell Us About Your Event" required>
                  <textarea
                    rows={5} placeholder="Share details about your venue, style, special moments you want captured..."
                    value={form.message} onChange={e => set('message', e.target.value)}
                    required
                    className="w-full bg-white border border-gray-200 rounded-lg px-4 py-3 text-sm text-gray-800 placeholder-gray-300 outline-none focus:border-gray-400 transition-colors resize-none" />
                </Field>

                {state === 'error' && (
                  <div className="flex items-center gap-2.5 bg-red-50 border border-red-100 rounded-lg px-4 py-3">
                    <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="#ef4444" strokeWidth="2" className="flex-shrink-0">
                      <circle cx="12" cy="12" r="10" /><line x1="12" y1="8" x2="12" y2="12" /><line x1="12" y1="16" x2="12.01" y2="16" />
                    </svg>
                    <p className="text-red-600 text-xs">{errorMsg}</p>
                  </div>
                )}

                <button type="submit" disabled={state === 'loading'}
                  className="w-full bg-gray-900 text-white text-sm font-bold py-3.5 rounded-lg hover:bg-[#C81010] transition-colors disabled:opacity-60 flex items-center justify-center gap-2.5">
                  {state === 'loading' ? (
                    <>
                      <svg className="animate-spin" width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2">
                        <path d="M21 12a9 9 0 1 1-6.219-8.56" />
                      </svg>
                      Sending…
                    </>
                  ) : (
                    <>
                      Send Message
                      <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                        <path d="M5 12h14M12 5l7 7-7 7" />
                      </svg>
                    </>
                  )}
                </button>

                <p className="text-center text-[0.7rem] text-gray-300 font-light">
                  We respond to all inquiries within 24 hours.
                </p>
              </form>
            )}
          </div>
        </div>
      </div>

      {/* Footer */}
      <footer className="border-t border-gray-100 px-[var(--px)] py-8">
        <div className="max-w-[var(--max-w)] mx-auto flex flex-col sm:flex-row items-center justify-between gap-4">
          <img src="/logo.png" alt="RedAntz Studios" className="h-6 w-auto" />
          <p className="text-xs text-gray-300 font-medium">
            © {new Date().getFullYear()} RedAntz Studios · Visakhapatnam, India
          </p>
          <div className="flex items-center gap-4">
            <Link href="/portfolio" className="text-xs text-gray-400 hover:text-gray-700 transition-colors">Portfolio</Link>
            <Link href="/contact" className="text-xs text-gray-400 hover:text-gray-700 transition-colors">Contact</Link>
          </div>
        </div>
      </footer>
    </div>
  )
}

function Field({ label, required, children }: { label: string; required?: boolean; children: React.ReactNode }) {
  return (
    <div>
      <label className="block text-[0.7rem] font-bold uppercase tracking-widest text-gray-400 mb-2">
        {label}{required && <span className="text-[#C81010] ml-0.5">*</span>}
      </label>
      {children}
    </div>
  )
}

function Input({ type, placeholder, value, onChange, required }: {
  type: string; placeholder?: string; value: string;
  onChange: (v: string) => void; required?: boolean
}) {
  return (
    <input
      type={type} placeholder={placeholder} value={value} required={required}
      onChange={e => onChange(e.target.value)}
      className="w-full bg-white border border-gray-200 rounded-lg px-4 py-3 text-sm text-gray-800 placeholder-gray-300 outline-none focus:border-gray-400 transition-colors"
    />
  )
}
