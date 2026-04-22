// Design Ref: §2.1 교육생 영역 — /home, /attendance, /questions 레이아웃
import { redirect } from 'next/navigation'
import { createClient } from '@/lib/supabase/server'
import Link from 'next/link'
import { Home, Camera, MessageCircle, LogOut } from 'lucide-react'

export default async function StudentLayout({
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

  if (profile?.role === 'admin') redirect('/admin/attendance')

  return (
    <div className="min-h-screen flex flex-col" style={{ backgroundColor: 'var(--wds-bg-neutral-subtle)' }}>
      <header
        className="sticky top-0 z-10 bg-white px-4 py-3 flex items-center justify-between"
        style={{ borderBottom: '1px solid rgba(112,115,124,0.22)' }}
      >
        <span style={{ fontSize: '17px', fontWeight: 700, letterSpacing: '-0.002em', color: 'var(--wds-fg-neutral-primary)' }}>
          EduConnect
        </span>
        <form action="/auth/signout" method="post">
          <button
            formAction="/api/auth/signout"
            style={{ color: 'var(--wds-fg-neutral-assistive)', fontSize: '14px' }}
            className="flex items-center gap-1"
          >
            <LogOut size={16} />
            로그아웃
          </button>
        </form>
      </header>

      <main className="flex-1 max-w-lg mx-auto w-full px-4 py-6">
        {children}
      </main>

      <nav
        className="sticky bottom-0 bg-white grid grid-cols-3"
        style={{ borderTop: '1px solid rgba(112,115,124,0.22)' }}
      >
        {[
          { href: '/home', icon: Home, label: '홈' },
          { href: '/attendance', icon: Camera, label: '출석' },
          { href: '/questions', icon: MessageCircle, label: '질문' },
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
