// Design Ref: §5.3 MissingUserList — 미출석자 리스트
// Design Ref: §5.4 관리자 출석 대시보드 UI Checklist
import type { Profile } from '@/types'
import { UserX } from 'lucide-react'

interface Props {
  missingUsers: Pick<Profile, 'id' | 'name' | 'group_number'>[]
}

export default function MissingUserList({ missingUsers }: Props) {
  if (missingUsers.length === 0) {
    return (
      <div
        className="rounded-2xl p-5 text-center"
        style={{ backgroundColor: 'var(--wds-bg-status-positive-subtle)', border: '1px solid rgba(112,115,124,0.22)' }}
      >
        <p style={{ fontSize: '15px', fontWeight: 600, color: 'var(--wds-fg-status-positive)' }}>
          전원 출석 완료
        </p>
      </div>
    )
  }

  return (
    <div
      className="rounded-2xl p-5"
      style={{ backgroundColor: 'white', border: '1px solid rgba(112,115,124,0.22)' }}
    >
      <div className="flex items-center gap-2 mb-3">
        <UserX size={18} style={{ color: 'var(--wds-fg-status-negative)' }} strokeWidth={1.75} />
        <h3 style={{ fontSize: '15px', fontWeight: 700, color: 'var(--wds-fg-neutral-primary)' }}>
          미출석 ({missingUsers.length}명)
        </h3>
      </div>
      <div className="flex flex-wrap gap-2">
        {missingUsers.map((u) => (
          <span
            key={u.id}
            className="rounded-full px-3 py-1"
            style={{
              fontSize: '13px',
              fontWeight: 600,
              backgroundColor: 'var(--wds-bg-status-negative-subtle)',
              color: 'var(--wds-fg-status-negative)',
              border: '1px solid rgba(112,115,124,0.22)',
            }}
          >
            {u.name} ({u.group_number}분과)
          </span>
        ))}
      </div>
    </div>
  )
}
