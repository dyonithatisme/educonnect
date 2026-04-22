import { createClient } from '@/lib/supabase/server'
import Link from 'next/link'
import { Camera, MessageCircle } from 'lucide-react'

export default async function HomePage() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  const { data: profile } = await supabase
    .from('profiles')
    .select('name, group_number')
    .eq('id', user!.id)
    .single()

  const today = new Date().toISOString().split('T')[0]
  const { data: todayAttendance } = await supabase
    .from('attendance')
    .select('id, created_at')
    .eq('user_id', user!.id)
    .eq('date', today)
    .single()

  return (
    <div className="flex flex-col gap-6">
      <div>
        <p style={{ fontSize: '15px', color: 'var(--wds-fg-neutral-assistive)' }}>
          {profile?.group_number}분과
        </p>
        <h2 style={{ fontSize: '22px', fontWeight: 700, letterSpacing: '-0.0194em', color: 'var(--wds-fg-neutral-primary)' }}>
          안녕하세요, {profile?.name}님
        </h2>
      </div>

      <div
        className="rounded-2xl p-5"
        style={{
          backgroundColor: todayAttendance ? 'var(--wds-bg-status-positive-subtle)' : 'var(--wds-bg-accent-subtle)',
          border: '1px solid rgba(112,115,124,0.22)',
        }}
      >
        <p style={{ fontSize: '13px', fontWeight: 600, color: todayAttendance ? 'var(--wds-fg-status-positive)' : 'var(--wds-fg-accent-primary)' }}>
          오늘 출석
        </p>
        <p style={{ fontSize: '17px', fontWeight: 700, marginTop: '4px', color: 'var(--wds-fg-neutral-primary)' }}>
          {todayAttendance ? '제출 완료' : '아직 출석하지 않았어요'}
        </p>
        {todayAttendance && (
          <p style={{ fontSize: '13px', color: 'var(--wds-fg-neutral-assistive)', marginTop: '2px' }}>
            {new Date(todayAttendance.created_at).toLocaleTimeString('ko-KR', { hour: '2-digit', minute: '2-digit' })} 제출
          </p>
        )}
      </div>

      <div className="grid grid-cols-2 gap-3">
        <Link
          href="/attendance"
          className="rounded-2xl p-5 flex flex-col gap-2 transition-colors"
          style={{ backgroundColor: 'white', border: '1px solid rgba(112,115,124,0.22)' }}
        >
          <Camera size={24} style={{ color: 'var(--wds-fg-accent-primary)' }} strokeWidth={1.75} />
          <p style={{ fontSize: '15px', fontWeight: 600, color: 'var(--wds-fg-neutral-primary)' }}>출석 체크</p>
          <p style={{ fontSize: '13px', color: 'var(--wds-fg-neutral-assistive)' }}>사진으로 출석하기</p>
        </Link>

        <Link
          href="/questions"
          className="rounded-2xl p-5 flex flex-col gap-2 transition-colors"
          style={{ backgroundColor: 'white', border: '1px solid rgba(112,115,124,0.22)' }}
        >
          <MessageCircle size={24} style={{ color: 'var(--wds-fg-accent-primary)' }} strokeWidth={1.75} />
          <p style={{ fontSize: '15px', fontWeight: 600, color: 'var(--wds-fg-neutral-primary)' }}>질문하기</p>
          <p style={{ fontSize: '13px', color: 'var(--wds-fg-neutral-assistive)' }}>운영진에게 문의</p>
        </Link>
      </div>
    </div>
  )
}
