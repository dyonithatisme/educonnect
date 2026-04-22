// Design Ref: §5.1 관리자 출석 대시보드 레이아웃
// Plan SC: FR-08 — 분과별 그리드, 미출석자, 완료율, 순위
import { createAdminClient } from '@/lib/supabase/server'
import GroupCompletionBar from '@/components/features/admin/GroupCompletionBar'
import AttendanceGrid from '@/components/features/admin/AttendanceGrid'
import MissingUserList from '@/components/features/admin/MissingUserList'
import type { GroupSummary, GroupRanking } from '@/types'

export const revalidate = 30

export default async function AdminAttendancePage() {
  const supabase = createAdminClient()
  const today = new Date().toISOString().split('T')[0]

  const [{ data: allStudents }, { data: todayAttendances }] = await Promise.all([
    supabase.from('profiles').select('id, name, group_number').eq('role', 'student'),
    supabase
      .from('attendance')
      .select('id, user_id, image_url, created_at, date, profiles(name, group_number)')
      .eq('date', today),
  ])

  const students = allStudents ?? []
  const attendances = todayAttendances ?? []
  const submittedIds = new Set(attendances.map((a) => a.user_id))

  const byGroupMap: Record<number, GroupSummary> = {}
  for (const s of students) {
    if (!byGroupMap[s.group_number]) {
      byGroupMap[s.group_number] = { group_number: s.group_number, total: 0, submitted: 0, rate: 0 }
    }
    byGroupMap[s.group_number].total++
    if (submittedIds.has(s.id)) byGroupMap[s.group_number].submitted++
  }

  const byGroup: GroupSummary[] = Object.values(byGroupMap)
    .filter((g) => g.total > 0)
    .map((g) => ({ ...g, rate: Math.round((g.submitted / g.total) * 1000) / 10 }))
    .sort((a, b) => a.group_number - b.group_number)

  const ranking: GroupRanking[] = [...byGroup]
    .sort((a, b) => b.rate - a.rate || a.group_number - b.group_number)
    .map((g, i) => ({ group_number: g.group_number, rate: g.rate, rank: i + 1 }))

  const missingUsers = students
    .filter((s) => !submittedIds.has(s.id))
    .map((s) => ({ id: s.id, name: s.name, group_number: s.group_number }))

  const attendancesWithProfile = attendances.map((a) => ({
    id: a.id,
    user_id: a.user_id,
    date: a.date,
    image_url: a.image_url,
    created_at: a.created_at,
    profile: (Array.isArray(a.profiles) ? a.profiles[0] : a.profiles) as { name: string; group_number: number },
  }))

  const now = new Date().toLocaleString('ko-KR', { hour: '2-digit', minute: '2-digit' })
  const rate = students.length > 0
    ? Math.round((attendances.length / students.length) * 1000) / 10
    : 0

  return (
    <div className="flex flex-col gap-6">
      <div className="flex items-start justify-between">
        <div>
          <h2 style={{ fontSize: '22px', fontWeight: 700, letterSpacing: '-0.0194em', color: 'var(--wds-fg-neutral-primary)' }}>
            출석 현황
          </h2>
          <p style={{ fontSize: '13px', color: 'var(--wds-fg-neutral-assistive)', marginTop: '2px' }}>
            {today} 기준 {now}
          </p>
        </div>
        <div className="text-right">
          <p style={{ fontSize: '28px', fontWeight: 700, color: 'var(--wds-fg-accent-primary)', letterSpacing: '-0.023em' }}>
            {attendances.length}/{students.length}
          </p>
          <p style={{ fontSize: '14px', fontWeight: 600, color: 'var(--wds-fg-neutral-assistive)' }}>
            {rate}%
          </p>
        </div>
      </div>

      <GroupCompletionBar groups={byGroup} ranking={ranking} />
      <AttendanceGrid attendances={attendancesWithProfile} />
      <MissingUserList missingUsers={missingUsers} />
    </div>
  )
}
