import { createAdminClient } from '@/lib/supabase/server'
import StudentTable from '@/components/features/admin/StudentTable'

export const revalidate = 60

export default async function AdminStudentsPage() {
  const supabase = createAdminClient()

  // 최근 30일 범위
  const today = new Date()
  const thirtyDaysAgo = new Date(today)
  thirtyDaysAgo.setDate(today.getDate() - 29)
  const startDate = thirtyDaysAgo.toISOString().split('T')[0]
  const todayStr = today.toISOString().split('T')[0]

  const [
    { data: rawStudents },
    { data: attendances },
    { data: questions },
  ] = await Promise.all([
    supabase
      .from('profiles')
      .select('id, name, group_number, created_at')
      .eq('role', 'student')
      .order('group_number')
      .order('name'),
    supabase
      .from('attendance')
      .select('user_id, date, created_at')
      .gte('date', startDate)
      .lte('date', todayStr),
    supabase
      .from('questions')
      .select('id, user_id, status'),
  ])

  // admin_memos 별도 조회 (UNIQUE FK → 객체 반환 대응)
  const { data: rawMemos } = await supabase
    .from('admin_memos')
    .select('user_id, memo, updated_at')

  const memoMap: Record<string, { memo: string; updated_at: string }> = {}
  for (const m of rawMemos ?? []) {
    memoMap[m.user_id] = { memo: m.memo, updated_at: m.updated_at }
  }

  // 출석 기록 user별 맵 (date → 제출시간 KST)
  const attendanceMap: Record<string, Record<string, string>> = {}
  for (const a of attendances ?? []) {
    if (!attendanceMap[a.user_id]) attendanceMap[a.user_id] = {}
    attendanceMap[a.user_id][a.date] = a.created_at
  }

  // 질문 수 user별 맵
  const questionCountMap: Record<string, { total: number; pending: number }> = {}
  for (const q of questions ?? []) {
    if (!questionCountMap[q.user_id]) questionCountMap[q.user_id] = { total: 0, pending: 0 }
    questionCountMap[q.user_id].total++
    if (q.status === 'pending') questionCountMap[q.user_id].pending++
  }

  const students = (rawStudents ?? []).map((s) => ({
    id: s.id,
    name: s.name,
    group_number: s.group_number,
    created_at: s.created_at,
    memo: memoMap[s.id]?.memo ?? '',
    memo_updated_at: memoMap[s.id]?.updated_at ?? null,
    attendances: attendanceMap[s.id] ?? {},
    hasAttendanceToday: !!attendanceMap[s.id]?.[todayStr],
    questionCount: questionCountMap[s.id]?.total ?? 0,
    pendingCount: questionCountMap[s.id]?.pending ?? 0,
  }))

  return (
    <div className="flex flex-col gap-6">
      <h2 style={{ fontSize: '22px', fontWeight: 700, letterSpacing: '-0.0194em', color: 'var(--wds-fg-neutral-primary)' }}>
        교육생 관리
      </h2>
      <StudentTable students={students} startDate={startDate} todayStr={todayStr} />
    </div>
  )
}
