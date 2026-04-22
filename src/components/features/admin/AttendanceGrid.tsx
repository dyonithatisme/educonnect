'use client'

// Design Ref: §5.3 AttendanceGrid — 분과별 출석 이미지 그리드
// Design Ref: §5.4 관리자 출석 대시보드 UI Checklist
import { useState } from 'react'
import type { Attendance, Profile } from '@/types'

interface AttendanceWithProfile extends Attendance {
  profile: Pick<Profile, 'name' | 'group_number'>
}

interface Props {
  attendances: AttendanceWithProfile[]
}

export default function AttendanceGrid({ attendances }: Props) {
  const groups = Array.from(new Set(attendances.map((a) => a.profile.group_number))).sort((a, b) => a - b)
  const [activeGroup, setActiveGroup] = useState<number | 'all'>('all')

  const filtered = activeGroup === 'all'
    ? attendances
    : attendances.filter((a) => a.profile.group_number === activeGroup)

  return (
    <div
      className="rounded-2xl p-5"
      style={{ backgroundColor: 'white', border: '1px solid rgba(112,115,124,0.22)' }}
    >
      <h3 style={{ fontSize: '15px', fontWeight: 700, color: 'var(--wds-fg-neutral-primary)', marginBottom: '12px' }}>
        출석 이미지
      </h3>

      {/* 탭 필터 */}
      <div className="flex gap-2 overflow-x-auto pb-2 mb-4" style={{ scrollbarWidth: 'none' }}>
        {(['all', ...groups] as (number | 'all')[]).map((g) => (
          <button
            key={g}
            onClick={() => setActiveGroup(g)}
            className="flex-shrink-0 rounded-full px-3 py-1.5 transition-colors"
            style={{
              fontSize: '13px',
              fontWeight: 600,
              backgroundColor: activeGroup === g ? 'var(--wds-bg-accent-primary)' : 'var(--wds-bg-neutral-subtle)',
              color: activeGroup === g ? '#ffffff' : 'var(--wds-fg-neutral-assistive)',
              border: '1px solid rgba(112,115,124,0.22)',
            }}
          >
            {g === 'all' ? '전체' : `${g}분과`}
          </button>
        ))}
      </div>

      {filtered.length === 0 ? (
        <p style={{ fontSize: '14px', color: 'var(--wds-fg-neutral-assistive)', textAlign: 'center', padding: '24px 0' }}>
          아직 제출된 출석이 없습니다.
        </p>
      ) : (
        <div className="grid grid-cols-3 gap-2 sm:grid-cols-4 md:grid-cols-5">
          {filtered.map((a) => (
            <div key={a.id} className="flex flex-col gap-1">
              <img
                src={a.image_url}
                alt={`${a.profile.name} 출석`}
                className="w-full rounded-xl object-cover"
                style={{ aspectRatio: '1/1', border: '1px solid rgba(112,115,124,0.22)' }}
              />
              <p style={{ fontSize: '11px', fontWeight: 600, color: 'var(--wds-fg-neutral-assistive)', textAlign: 'center', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                {a.profile.name}
              </p>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
