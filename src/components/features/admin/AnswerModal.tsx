'use client'

// Design Ref: §5.3 AnswerModal — 답변 작성 모달
// Design Ref: §5.4 관리자 질문 관리 페이지 UI Checklist
// Plan SC: FR-10 — 답변 작성 + 상태 변경

import { useState } from 'react'
import Modal from '@/components/ui/Modal'
import type { Question, Profile } from '@/types'

interface Props {
  question: Question & { profiles: Pick<Profile, 'name' | 'group_number'> }
  onClose: () => void
  onAnswered: () => void
}

const CATEGORY_LABEL: Record<string, string> = {
  attendance: '근태', education: '교육운영', accommodation: '숙소', health: '건강', other: '기타',
}

export default function AnswerModal({ question, onClose, onAnswered }: Props) {
  const [content, setContent] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    if (!content.trim()) { setError('답변 내용을 입력해주세요.'); return }
    setLoading(true)
    setError('')

    const res = await fetch(`/api/admin/questions/${question.id}/answer`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ content: content.trim() }),
    })

    if (!res.ok) {
      const json = await res.json()
      setError(json.error?.message ?? '저장 중 오류가 발생했습니다.')
      setLoading(false)
      return
    }

    onAnswered()
  }

  return (
    <Modal open title={`${CATEGORY_LABEL[question.category]} 답변`} onClose={onClose}>
      <div className="flex flex-col gap-4">
        <div
          className="rounded-xl p-3"
          style={{ backgroundColor: 'var(--wds-bg-neutral-subtle)', border: '1px solid rgba(112,115,124,0.22)' }}
        >
          <p style={{ fontSize: '12px', fontWeight: 600, color: 'var(--wds-fg-neutral-assistive)', marginBottom: '4px' }}>
            {question.profiles.name} ({question.profiles.group_number}분과)
          </p>
          <p style={{ fontSize: '14px', color: 'var(--wds-fg-neutral-primary)', lineHeight: 1.6 }}>{question.content}</p>
        </div>

        <form onSubmit={handleSubmit} className="flex flex-col gap-3">
          <textarea
            value={content}
            onChange={(e) => setContent(e.target.value)}
            placeholder="답변을 입력하세요"
            rows={4}
            className="w-full rounded-xl py-3 px-4 outline-none resize-none"
            style={{ border: '1px solid rgba(112,115,124,0.22)', fontSize: '15px', color: 'var(--wds-fg-neutral-primary)' }}
          />
          {error && <p style={{ fontSize: '13px', color: 'var(--wds-fg-status-negative)' }}>{error}</p>}
          <button
            type="submit"
            disabled={loading || !content.trim()}
            className="w-full rounded-xl py-3 disabled:opacity-40"
            style={{ backgroundColor: 'var(--wds-bg-accent-primary)', color: '#ffffff', fontSize: '15px', fontWeight: 600 }}
          >
            {loading ? '저장 중...' : '답변 저장'}
          </button>
        </form>
      </div>
    </Modal>
  )
}
