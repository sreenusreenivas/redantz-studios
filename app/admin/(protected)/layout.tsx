import { redirect } from 'next/navigation'
import { createClient } from '@/lib/supabase/server'
import Sidebar from '@/components/admin/Sidebar'

export default async function AdminLayout({ children }: { children: React.ReactNode }) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  if (!user) redirect('/admin/login')

  return (
    <div className="flex min-h-screen bg-[#0f0f0f] text-gray-200" style={{ fontFamily: 'var(--font-dm-sans), DM Sans, sans-serif' }}>
      <Sidebar />
      <main className="flex-1 md:ml-60 min-h-screen overflow-auto">
        {children}
      </main>
    </div>
  )
}
