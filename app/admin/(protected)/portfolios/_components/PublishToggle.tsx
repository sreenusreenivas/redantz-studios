'use client'

import { useState, useTransition } from 'react'
import { createClient } from '@/lib/supabase/client'
import { useRouter } from 'next/navigation'

export default function PublishToggle({ id, published }: { id: string; published: boolean }) {
  const [value, setValue] = useState(published)
  const [, startTransition] = useTransition()
  const router = useRouter()

  const toggle = async () => {
    const next = !value
    setValue(next)
    const supabase = createClient()
    await supabase.from('portfolios').update({ published: next }).eq('id', id)
    startTransition(() => router.refresh())
  }

  return (
    <button onClick={toggle}
      className={`relative inline-flex h-5 w-9 items-center rounded-full transition-colors flex-shrink-0
        ${value ? 'bg-green-600' : 'bg-gray-700'}`}>
      <span className={`inline-block h-3.5 w-3.5 rounded-full bg-white shadow transition-transform
        ${value ? 'translate-x-4.5' : 'translate-x-0.5'}`} />
    </button>
  )
}
