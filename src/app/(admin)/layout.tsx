// Design Ref: §2.1 관리자 영역 — /admin/* 레이아웃
import { redirect } from 'next/navigation'
import { createClient } from '@/lib/supabase/server'
import Link from 'next/link'
import { BarChart2, Camera, MessageCircle, Users, LogOut } from 'lucide-react'

export default async function AdminLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  if (!user) redirect('/login')

  const { data: profile } = await supabase
    .from('profiles')
    .select('name, role')
    .eq('id', user.id)
    .single()

  if (profile?.role !== 'admin') redirect('/home')

  return (
    <div className="min-h-screen flex flex-col" style={{ backgroundColor: 'var(--wds-bg-neutral-subtle)' }}>
      <header
        className="sticky top-0 z-10 bg-white px-4 py-3 flex items-center justify-between"
        style={{ borderBottom: '1px solid rgba(112,115,124,0.22)' }}
      >
        <div>
          <span style={{ fontSize: '17px', fontWeight: 700, letterSpacing: '-0.002em', color: 'var(--wds-fg-neutral-primary)' }}>
            EduConnect
          </span>
          <span
            className="ml-2 px-2 py-0.5 rounded-full text-white"
            style={{ fontSize: '11px', fontWeight: 700, backgroundColor: 'var(--wds-bg-accent-primary)' }}
          >
            Admin
          </span>
        </div>
        <form action="/api/auth/signout" method="post">
          <button
            type="submit"
            style={{ color: 'var(--wds-fg-neutral-assistive)', fontSize: '14px' }}
            className="flex items-center gap-1"
          >
            <LogOut size={16} />
            로그아웃
          </button>
        </form>
      </header>

      <main className="flex-1 max-w-5xl mx-auto w-full px-4 py-6">
        {children}
      </main>

      <nav
        className="sticky bottom-0 bg-white grid grid-cols-4"
        style={{ borderTop: '1px solid rgba(112,115,124,0.22)' }}
      >
        {[
          { href: '/admin/attendance', icon: Camera, label: '출석' },
          { href: '/admin/questions', icon: MessageCircle, label: '질문' },
          { href: '/admin/students', icon: Users, label: '교육생' },
          { href: '/admin/dashboard', icon: BarChart2, label: '대시보드' },
        ].map(({ href, icon: Icon, label }) => (
          <Link
            key={href}
            href={href}
            className="flex flex-col items-center gap-1 py-3 transition-colors"
            style={{ color: 'var(--wds-fg-neutral-assistive)', fontSize: '12px', fontWeight: 600 }}
          >
            <Icon size={22} strokeWidth={1.75} />
            {label}
          </Link>
        ))}
      </nav>
    </div>
  )
}
