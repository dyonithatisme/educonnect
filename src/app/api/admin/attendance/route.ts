// Design Ref: §4.2 GET /api/admin/attendance — service role key로 전체 출석 조회
// Plan SC: FR-08 — 분과별 이미지 그리드, 미출석자, 완료율, 순위
import { createAdminClient } from '@/lib/supabase/server'
import { createClient } from '@/lib/supabase/server'
import { NextResponse } from 'next/server'
import type { AttendanceSummary, GroupSummary } from '@/types'

export async function GET() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  if (!user) {
    return NextResponse.json({ error: { code: 'UNAUTHORIZED', message: '로그인이 필요합니다.' } }, { status: 401 })
  }

  const { data: profile } = await supabase
    .from('profiles')
    .select('role')
    .eq('id', user.id)
    .single()

  if (profile?.role !== 'admin') {
    return NextResponse.json({ error: { code: 'UNAUTHORIZED', message: '관리자 권한이 필요합니다.' } }, { status: 401 })
  }

  const adminSupabase = createAdminClient()
  const today = new Date().toISOString().split('T')[0]

  const [{ data: allProfiles }, { data: todayAttendances }] = await Promise.all([
    adminSupabase.from('profiles').select('id, name, group_number').eq('role', 'student'),
    adminSupabase.from('attendance').select('id, user_id, image_url, created_at').eq('date', today),
  ])

  const students = allProfiles ?? []
  const attendances = todayAttendances ?? []
  const submittedIds = new Set(attendances.map((a) => a.user_id))

  const byGroup: Record<number, GroupSummary> = {}
  for (let g = 1; g <= 10; g++) {
    byGroup[g] = { group_number: g, total: 0, submitted: 0, rate: 0 }
  }

  for (const s of students) {
    byGroup[s.group_number].total++
    if (submittedIds.has(s.id)) byGroup[s.group_number].submitted++
  }

  const byGroupArr: GroupSummary[] = Object.values(byGroup)
    .filter((g) => g.total > 0)
    .map((g) => ({ ...g, rate: g.total > 0 ? Math.round((g.submitted / g.total) * 100 * 10) / 10 : 0 }))

  const ranking = [...byGroupArr]
    .sort((a, b) => b.rate - a.rate || a.group_number - b.group_number)
    .map((g, i) => ({ group_number: g.group_number, rate: g.rate, rank: i + 1 }))

  const missingUsers = students
    .filter((s) => !submittedIds.has(s.id))
    .map((s) => ({ id: s.id, name: s.name, group_number: s.group_number }))

  const summary: AttendanceSummary = {
    total: students.length,
    submitted: attendances.length,
    by_group: byGroupArr,
    missing_users: missingUsers,
    ranking,
  }

  return NextResponse.json({ data: summary })
}
