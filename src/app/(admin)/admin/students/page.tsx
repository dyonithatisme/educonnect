// Design Ref: §5.4 관리자 교육생 관리 페이지 UI Checklist
// Plan SC: FR-11, FR-12
import { createAdminClient } from '@/lib/supabase/server'
import StudentTable from '@/components/features/admin/StudentTable'

export const revalidate = 60

export default async function AdminStudentsPage() {
  const supabase = createAdminClient()
  const today = new Date().toISOString().split('T')[0]

  const [{ data: students }, { data: todayAttendances }] = await Promise.all([
    supabase
      .from('profiles')
      .select('*, admin_memos(*)')
      .eq('role', 'student')
      .order('group_number')
      .order('name'),
    supabase.from('attendance').select('user_id').eq('date', today),
  ])

  const attendedIds = new Set((todayAttendances ?? []).map((a) => a.user_id))

  const studentsWithAttendance = (students ?? []).map((s) => ({
    ...s,
    hasAttendanceToday: attendedIds.has(s.id),
  }))

  return (
    <div className="flex flex-col gap-6">
      <h2 style={{ fontSize: '22px', fontWeight: 700, letterSpacing: '-0.0194em', color: 'var(--wds-fg-neutral-primary)' }}>
        교육생 관리
      </h2>
      <StudentTable students={studentsWithAttendance} />
    </div>
  )
}
