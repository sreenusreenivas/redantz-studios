'use client'

import { useState, useTransition } from 'react'
import { useRouter } from 'next/navigation'

const EVENT_TYPES = ['Wedding', 'Pre-Wedding', 'Engagement', 'Event', 'Portrait']

export default function ClientGalleryEditForm({ gallery }: { gallery: Record<string, unknown> }) {
  const router = useRouter()
  const [, startTransition] = useTransition()
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState('')
  const [saved, setSaved] = useState(false)
  const [form, setForm] = useState({
    couple_names: (gallery.couple_names as string) || '',
    event_type: (gallery.event_type as string) || 'Wedding',
    date: (gallery.date as string) || '',
    location: (gallery.location as string) || '',
    password: '',
    expires_at: (gallery.expires_at as string)?.split('T')[0] || '',
    active: (gallery.active as boolean) ?? true,
  })

  const set = (k: string) => (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const value = e.target.type === 'checkbox' ? (e.target as HTMLInputElement).checked : e.target.value
    setForm((prev) => ({ ...prev, [k]: value }))
    setSaved(false)
  }

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')
    setSaving(true)
    const res = await fetch(`/api/clients/${gallery.id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(form),
    })
    if (res.ok) {
      setSaved(true)
      startTransition(() => router.refresh())
    } else {
      const { error: msg } = await res.json()
      setError(msg || 'Failed to save')
    }
    setSaving(false)
  }

  return (
    <form onSubmit={handleSave} className="space-y-4">
      <div className="grid grid-cols-2 gap-4">
        <Field label="Couple Name">
          <input value={form.couple_names} onChange={set('couple_names')} className="admin-input" />
        </Field>
        <Field label="Event Type">
          <select value={form.event_type} onChange={set('event_type')} className="admin-input">
            {EVENT_TYPES.map((t) => <option key={t}>{t}</option>)}
          </select>
        </Field>
      </div>
      <div className="grid grid-cols-2 gap-4">
        <Field label="Date">
          <input value={form.date} onChange={set('date')} placeholder="Dec 2024" className="admin-input" />
        </Field>
        <Field label="Location">
          <input value={form.location} onChange={set('location')} className="admin-input" />
        </Field>
      </div>
      <Field label="New Password (leave blank to keep current)">
        <input type="text" value={form.password} onChange={set('password')} placeholder="New password" className="admin-input" />
      </Field>
      <Field label="Access Expires">
        <input type="date" value={form.expires_at} onChange={set('expires_at')} className="admin-input" />
      </Field>
      <label className="flex items-center gap-3 cursor-pointer">
        <input type="checkbox" checked={form.active} onChange={set('active')} className="w-4 h-4 rounded accent-red-600" />
        <span className="text-sm text-gray-300">Gallery active</span>
      </label>
      {error && <p className="text-[0.75rem] text-red-400 bg-red-950 border border-red-900 rounded-lg px-3 py-2">{error}</p>}
      <div className="flex items-center gap-3 pt-1">
        <button type="submit" disabled={saving}
          className="bg-[#C81010] text-white text-[0.72rem] font-semibold uppercase tracking-widest px-6 py-2.5 rounded-lg hover:bg-red-700 transition-colors disabled:opacity-70">
          {saving ? 'Saving…' : 'Save Changes'}
        </button>
        {saved && <span className="text-[0.72rem] text-green-500">Saved!</span>}
      </div>
      <style>{`.admin-input { width: 100%; background: #111827; border: 1px solid #374151; border-radius: 0.5rem; padding: 0.625rem 0.875rem; font-size: 0.875rem; color: #f3f4f6; outline: none; } .admin-input:focus { border-color: #6b7280; }`}</style>
    </form>
  )
}

function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div>
      <label className="block text-[0.65rem] font-semibold uppercase tracking-widest text-gray-600 mb-1.5">{label}</label>
      {children}
    </div>
  )
}
