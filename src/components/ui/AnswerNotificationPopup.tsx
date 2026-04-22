'use client'

// Design Ref: §5.3 AnswerNotificationPopup — 미확인 답변 알림 팝업
// Plan SC: FR-07 — 로그인 후 미확인 답변 있을 경우 팝업 표시

import { useState } from 'react'
import { Bell, X } from 'lucide-react'

interface Props {
  count: number
}

export default function AnswerNotificationPopup({ count }: Props) {
  const [dismissed, setDismissed] = useState(false)

  if (count === 0 || dismissed) return null

  return (
    <div
      className="fixed bottom-20 left-4 right-4 max-w-sm mx-auto rounded-2xl p-4 flex items-center gap-3 z-40 shadow-lg"
      style={{ backgroundColor: 'white', border: '1px solid rgba(112,115,124,0.22)' }}
    >
      <div
        className="w-9 h-9 rounded-full flex items-center justify-center flex-shrink-0"
        style={{ backgroundColor: 'var(--wds-bg-accent-subtle)' }}
      >
        <Bell size={18} style={{ color: 'var(--wds-fg-accent-primary)' }} strokeWidth={1.75} />
      </div>
      <p style={{ fontSize: '14px', color: 'var(--wds-fg-neutral-primary)', flex: 1 }}>
        새 답변이 <strong style={{ color: 'var(--wds-fg-accent-primary)' }}>{count}건</strong> 도착했습니다.
      </p>
      <button onClick={() => setDismissed(true)}>
        <X size={18} style={{ color: 'var(--wds-fg-neutral-assistive)' }} strokeWidth={1.75} />
      </button>
    </div>
  )
}
