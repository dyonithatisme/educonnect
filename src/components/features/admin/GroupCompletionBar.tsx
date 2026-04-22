// Design Ref: §5.3 GroupCompletionBar — 분과별 완료율 바 차트
// Design Ref: §5.4 관리자 출석 대시보드 UI Checklist
import type { GroupSummary, GroupRanking } from '@/types'

interface Props {
  groups: GroupSummary[]
  ranking: GroupRanking[]
}

export default function GroupCompletionBar({ groups, ranking }: Props) {
  const rankMap = new Map(ranking.map((r) => [r.group_number, r.rank]))

  return (
    <div
      className="rounded-2xl p-5"
      style={{ backgroundColor: 'white', border: '1px solid rgba(112,115,124,0.22)' }}
    >
      <h3 style={{ fontSize: '15px', fontWeight: 700, color: 'var(--wds-fg-neutral-primary)', marginBottom: '16px' }}>
        분과별 완료율
      </h3>
      <div className="flex flex-col gap-3">
        {groups.map((g) => (
          <div key={g.group_number} className="flex items-center gap-3">
            <span
              style={{ fontSize: '13px', fontWeight: 600, color: 'var(--wds-fg-neutral-assistive)', minWidth: '40px' }}
            >
              {g.group_number}분과
            </span>
            <div className="flex-1 rounded-full overflow-hidden" style={{ height: '8px', backgroundColor: 'var(--wds-bg-neutral-strong)' }}>
              <div
                className="h-full rounded-full transition-all duration-500"
                style={{
                  width: `${g.rate}%`,
                  backgroundColor: g.rate === 100 ? 'var(--wds-fg-status-positive)' : 'var(--wds-bg-accent-primary)',
                }}
              />
            </div>
            <span
              style={{ fontSize: '13px', fontWeight: 600, minWidth: '36px', textAlign: 'right', color: 'var(--wds-fg-neutral-primary)' }}
            >
              {g.rate}%
            </span>
            {rankMap.get(g.group_number) === 1 && (
              <span
                className="rounded-full px-2 py-0.5"
                style={{ fontSize: '11px', fontWeight: 700, backgroundColor: '#FFF7E0', color: '#B7791F' }}
              >
                1위
              </span>
            )}
          </div>
        ))}
      </div>
    </div>
  )
}
