'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'

const EVENT_TYPES = ['Wedding', 'Pre-Wedding', 'Engagement', 'Event', 'Portrait']

function nanoid(n = 8) {
  return Math.random().toString(36).slice(2, 2 + n)
}

export default function NewClientGalleryPage() {
  const router = useRouter()
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState('')
  const [form, setForm] = useState({
    gallery_id: nanoid(10),
    couple_names: '',
    event_type: 'Wedding',
    date: '',
    location: '',
    password: '',
    expires_at: '',
    active: true,
    total_photos: 0,
  })

  const set = (k: string) => (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const value = e.target.type === 'checkbox' ? (e.target as HTMLInputElement).checked : e.target.value
    setForm((prev) => ({ ...prev, [k]: value }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')
    setSaving(true)
    const res = await fetch('/api/clients', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(form),
    })
    if (res.ok) {
      const { id } = await res.json()
      router.push(`/admin/clients/${id}`)
    } else {
      const { error: msg } = await res.json()
      setError(msg || 'Failed to create gallery')
      setSaving(false)
    }
  }

  return (
    <div className="p-6 md:p-10 max-w-2xl">
      <div className="mb-8">
        <p className="text-[0.62rem] font-semibold uppercase tracking-[0.2em] text-[#C81010] mb-1">
          <a href="/admin/clients" className="hover:text-red-400">Client Galleries</a> · New
        </p>
        <h1 className="font-display text-3xl text-white tracking-wide">New Client Gallery</h1>
      </div>

      <form onSubmit={handleSubmit} className="space-y-5">
        <Field label="Couple / Client Name" required>
          <input value={form.couple_names} onChange={set('couple_names')} required placeholder="Priya & Arjun" className="admin-input" />
        </Field>

        <div className="grid grid-cols-2 gap-4">
          <Field label="Event Type" required>
            <select value={form.event_type} onChange={set('event_type')} className="admin-input">
              {EVENT_TYPES.map((t) => <option key={t}>{t}</option>)}
            </select>
          </Field>
          <Field label="Date">
            <input value={form.date} onChange={set('date')} placeholder="Dec 2024" className="admin-input" />
          </Field>
        </div>

        <Field label="Location">
          <input value={form.location} onChange={set('location')} placeholder="Visakhapatnam" className="admin-input" />
        </Field>

        <Field label="Gallery ID (URL)" required>
          <div className="flex gap-2">
            <input value={form.gallery_id} onChange={set('gallery_id')} required className="admin-input flex-1" />
            <button type="button" onClick={() => setForm((f) => ({ ...f, gallery_id: nanoid(10) }))}
              className="text-[0.68rem] text-gray-500 hover:text-white border border-gray-700 px-3 rounded-lg transition-colors">
              Regen
            </button>
          </div>
          <p className="text-[0.62rem] text-gray-600 mt-1">Gallery URL: /client/{form.gallery_id}</p>
        </Field>

        <Field label="Gallery Password" required>
          <input type="text" value={form.password} onChange={set('password')} required placeholder="Set a secure password" className="admin-input" />
        </Field>

        <Field label="Access Expires">
          <input type="date" value={form.expires_at} onChange={set('expires_at')} className="admin-input" />
          <p className="text-[0.62rem] text-gray-600 mt-1">Leave blank for no expiry</p>
        </Field>

        <label className="flex items-center gap-3 cursor-pointer">
          <input type="checkbox" checked={form.active} onChange={set('active')} className="w-4 h-4 rounded accent-red-600" />
          <span className="text-sm text-gray-300">Gallery active (accessible to clients)</span>
        </label>

        {error && <p className="text-[0.75rem] text-red-400 bg-red-950 border border-red-900 rounded-lg px-3 py-2.5">{error}</p>}

        <div className="flex items-center gap-3 pt-2">
          <button type="submit" disabled={saving}
            className="bg-[#C81010] text-white text-[0.75rem] font-semibold uppercase tracking-widest px-7 py-2.5 rounded-lg hover:bg-red-700 transition-colors disabled:opacity-70">
            {saving ? 'Creating…' : 'Create Gallery'}
          </button>
          <a href="/admin/clients" className="text-[0.75rem] text-gray-500 hover:text-gray-300">Cancel</a>
        </div>
      </form>
      <style>{`.admin-input { width: 100%; background: #111827; border: 1px solid #374151; border-radius: 0.5rem; padding: 0.625rem 0.875rem; font-size: 0.875rem; color: #f3f4f6; outline: none; } .admin-input:focus { border-color: #6b7280; } .admin-input::placeholder { color: #4b5563; }`}</style>
    </div>
  )
}

function Field({ label, children, required }: { label: string; children: React.ReactNode; required?: boolean }) {
  return (
    <div>
      <label className="block text-[0.65rem] font-semibold uppercase tracking-widest text-gray-500 mb-1.5">
        {label}{required && <span className="text-red-600 ml-0.5">*</span>}
      </label>
      {children}
    </div>
  )
}
