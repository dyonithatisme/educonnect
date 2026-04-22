// Design Ref: §5.4 — 답변 상태 배지, 출석 상태 배지

interface Props {
  variant: 'pending' | 'answered' | 'present' | 'absent'
}

const CONFIG = {
  pending: { label: '미답변', bg: 'var(--wds-bg-neutral-strong)', color: 'var(--wds-fg-neutral-assistive)' },
  answered: { label: '답변완료', bg: 'var(--wds-bg-accent-subtle)', color: 'var(--wds-fg-accent-primary)' },
  present: { label: '출석완료', bg: 'var(--wds-bg-status-positive-subtle)', color: 'var(--wds-fg-status-positive)' },
  absent: { label: '미출석', bg: 'var(--wds-bg-status-negative-subtle)', color: 'var(--wds-fg-status-negative)' },
}

export default function Badge({ variant }: Props) {
  const { label, bg, color } = CONFIG[variant]
  return (
    <span
      className="inline-block rounded-full px-2 py-0.5"
      style={{ fontSize: '12px', fontWeight: 600, backgroundColor: bg, color }}
    >
      {label}
    </span>
  )
}
