'use client'

import { useState, useTransition } from 'react'
import { useRouter } from 'next/navigation'
import { createClient } from '@/lib/supabase/client'

const EVENT_TYPES = ['Wedding', 'Pre-Wedding', 'Engagement', 'Event', 'Portrait']

export default function PortfolioEditForm({ portfolio }: { portfolio: Record<string, unknown> }) {
  const router = useRouter()
  const [, startTransition] = useTransition()
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState('')
  const [saved, setSaved] = useState(false)
  const [form, setForm] = useState({
    couple_names: (portfolio.couple_names as string) || '',
    slug: (portfolio.slug as string) || '',
    event_type: (portfolio.event_type as string) || 'Wedding',
    date: (portfolio.date as string) || '',
    location: (portfolio.location as string) || '',
    photographer: (portfolio.photographer as string) || '',
    cover_image: (portfolio.cover_image as string) || '',
    excerpt: (portfolio.excerpt as string) || '',
    published: (portfolio.published as boolean) || false,
  })

  const set = (k: string) => (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const value = e.target.type === 'checkbox' ? (e.target as HTMLInputElement).checked : e.target.value
    setForm((prev) => ({ ...prev, [k]: value }))
    setSaved(false)
  }

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')
    setSaving(true)
    const supabase = createClient()
    const { error: err } = await supabase.from('portfolios').update(form).eq('id', portfolio.id as string)
    if (err) {
      setError(err.message)
    } else {
      setSaved(true)
      startTransition(() => router.refresh())
    }
    setSaving(false)
  }

  return (
    <form onSubmit={handleSave} className="space-y-4">
      <div className="grid grid-cols-2 gap-4">
        <Field label="Couple Names">
          <input value={form.couple_names} onChange={set('couple_names')} className="admin-input" />
        </Field>
        <Field label="Slug">
          <input value={form.slug} onChange={set('slug')} className="admin-input" />
        </Field>
      </div>
      <div className="grid grid-cols-2 gap-4">
        <Field label="Event Type">
          <select value={form.event_type} onChange={set('event_type')} className="admin-input">
            {EVENT_TYPES.map((t) => <option key={t}>{t}</option>)}
          </select>
        </Field>
        <Field label="Date">
          <input value={form.date} onChange={set('date')} placeholder="Dec 2024" className="admin-input" />
        </Field>
      </div>
      <div className="grid grid-cols-2 gap-4">
        <Field label="Location">
          <input value={form.location} onChange={set('location')} className="admin-input" />
        </Field>
        <Field label="Photographer">
          <input value={form.photographer} onChange={set('photographer')} className="admin-input" />
        </Field>
      </div>
      <Field label="Cover Image URL">
        <input value={form.cover_image} onChange={set('cover_image')} className="admin-input" />
      </Field>
      <Field label="Excerpt">
        <textarea value={form.excerpt} onChange={set('excerpt')} rows={2} className="admin-input resize-none" />
      </Field>
      <label className="flex items-center gap-3 cursor-pointer">
        <input type="checkbox" checked={form.published} onChange={set('published')} className="w-4 h-4 rounded accent-red-600" />
        <span className="text-sm text-gray-300">Published</span>
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
