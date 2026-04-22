// Design Ref: §5.1 교육생 출석 체크 페이지 레이아웃
import { createClient } from '@/lib/supabase/server'
import AttendanceUploader from '@/components/features/attendance/AttendanceUploader'

export default async function AttendancePage() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  const today = new Date().toISOString().split('T')[0]
  const { data: todayAttendance } = await supabase
    .from('attendance')
    .select('*')
    .eq('user_id', user!.id)
    .eq('date', today)
    .single()

  return (
    <div className="flex flex-col gap-6">
      <div>
        <h2 style={{ fontSize: '22px', fontWeight: 700, letterSpacing: '-0.0194em', color: 'var(--wds-fg-neutral-primary)' }}>
          오늘의 출석
        </h2>
        <p style={{ fontSize: '14px', color: 'var(--wds-fg-neutral-assistive)', marginTop: '4px' }}>
          오늘 아침 출석미션을 대강당에서 확인하세요!
        </p>
      </div>

      <AttendanceUploader userId={user!.id} existingAttendance={todayAttendance} />
    </div>
  )
}
