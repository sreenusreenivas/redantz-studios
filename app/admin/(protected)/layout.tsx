import { redirect } from 'next/navigation'
import { createClient } from '@/lib/supabase/server'
import Sidebar from '@/components/admin/Sidebar'

export default async function AdminLayout({ children }: { children: React.ReactNode }) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  if (!user) redirect('/admin/login')

  return (
    <div className="flex min-h-screen bg-gray-950 text-gray-200">
      <Sidebar />
      <main className="flex-1 ml-0 md:ml-60 min-h-screen">
        {children}
      </main>
    </div>
  )
}
