'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { createClient } from '@/lib/supabase/client'

const EVENT_TYPES = ['Wedding', 'Pre-Wedding', 'Engagement', 'Event', 'Portrait']

function slugify(str: string) {
  return str.toLowerCase().replace(/[^a-z0-9\s-]/g, '').trim().replace(/\s+/g, '-')
}

export default function NewPortfolioPage() {
  const router = useRouter()
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState('')
  const [form, setForm] = useState({
    couple_names: '',
    slug: '',
    event_type: 'Wedding',
    date: '',
    location: '',
    photographer: 'RedAntz Studios',
    cover_image: '',
    excerpt: '',
    published: false,
  })

  const set = (k: string) => (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const value = e.target.type === 'checkbox' ? (e.target as HTMLInputElement).checked : e.target.value
    setForm((prev) => ({
      ...prev,
      [k]: value,
      ...(k === 'couple_names' && !prev.slug ? { slug: slugify(e.target.value) } : {}),
    }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')
    setSaving(true)
    const supabase = createClient()
    const { data, error: err } = await supabase
      .from('portfolios')
      .insert({ ...form })
      .select('id')
      .single()
    if (err) {
      setError(err.message)
      setSaving(false)
    } else {
      router.push(`/admin/portfolios/${data.id}`)
    }
  }

  return (
    <div className="p-6 md:p-10 max-w-2xl">
      <div className="mb-8">
        <p className="text-[0.62rem] font-semibold uppercase tracking-[0.2em] text-[#C81010] mb-1">
          <a href="/admin/portfolios" className="hover:text-red-400">Portfolios</a> · New
        </p>
        <h1 className="font-display text-3xl text-white tracking-wide">New Portfolio</h1>
      </div>

      <form onSubmit={handleSubmit} className="space-y-5">
        <Field label="Couple / Subject Names" required>
          <input value={form.couple_names} onChange={set('couple_names')} required
            placeholder="e.g. Priya & Arjun"
            className="admin-input" />
        </Field>

        <Field label="Slug (URL)" required>
          <input value={form.slug} onChange={set('slug')} required
            placeholder="e.g. priya-arjun-wedding"
            className="admin-input" />
        </Field>

        <div className="grid grid-cols-2 gap-4">
          <Field label="Event Type" required>
            <select value={form.event_type} onChange={set('event_type')} className="admin-input">
              {EVENT_TYPES.map((t) => <option key={t}>{t}</option>)}
            </select>
          </Field>
          <Field label="Date">
            <input value={form.date} onChange={set('date')} placeholder="e.g. Dec 2024" className="admin-input" />
          </Field>
        </div>

        <Field label="Location">
          <input value={form.location} onChange={set('location')} placeholder="e.g. Visakhapatnam" className="admin-input" />
        </Field>

        <Field label="Photographer">
          <input value={form.photographer} onChange={set('photographer')} className="admin-input" />
        </Field>

        <Field label="Cover Image URL">
          <input value={form.cover_image} onChange={set('cover_image')} placeholder="https://res.cloudinary.com/…" className="admin-input" />
          {form.cover_image && (
            <img src={form.cover_image} alt="" className="mt-2 h-28 w-auto rounded-lg object-cover" />
          )}
        </Field>

        <Field label="Excerpt / Description">
          <textarea value={form.excerpt} onChange={set('excerpt')} rows={3}
            placeholder="A short description of this session…"
            className="admin-input resize-none" />
        </Field>

        <label className="flex items-center gap-3 cursor-pointer">
          <input type="checkbox" checked={form.published} onChange={set('published')} className="w-4 h-4 rounded accent-red-600" />
          <span className="text-sm text-gray-300">Publish immediately</span>
        </label>

        {error && (
          <p className="text-[0.75rem] text-red-400 bg-red-950 border border-red-900 rounded-lg px-3 py-2.5">{error}</p>
        )}

        <div className="flex items-center gap-3 pt-2">
          <button type="submit" disabled={saving}
            className="bg-[#C81010] text-white text-[0.75rem] font-semibold uppercase tracking-widest px-7 py-2.5 rounded-lg hover:bg-red-700 transition-colors disabled:opacity-70">
            {saving ? 'Creating…' : 'Create Portfolio'}
          </button>
          <a href="/admin/portfolios"
            className="text-[0.75rem] text-gray-500 hover:text-gray-300 transition-colors">
            Cancel
          </a>
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
