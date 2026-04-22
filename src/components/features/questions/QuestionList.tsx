'use client'

// Design Ref: §5.3 QuestionList — 내 질문 목록 (교육생용)
// Design Ref: §5.4 교육생 질문 페이지 UI Checklist
// Plan SC: FR-06, FR-07 — 본인 질문 조회, 답변 알림 모달

import { useState } from 'react'
import Badge from '@/components/ui/Badge'
import Modal from '@/components/ui/Modal'
import type { Question, Answer } from '@/types'
import { MessageCircle, ChevronRight } from 'lucide-react'

const CATEGORY_LABEL: Record<string, string> = {
  attendance: '근태',
  education: '교육운영',
  accommodation: '숙소',
  health: '건강',
  other: '기타',
}

interface QuestionWithAnswer extends Question {
  answers: Answer[]
}

interface Props {
  questions: QuestionWithAnswer[]
}

export default function QuestionList({ questions }: Props) {
  const [selected, setSelected] = useState<QuestionWithAnswer | null>(null)

  if (questions.length === 0) {
    return (
      <div
        className="rounded-2xl p-8 text-center"
        style={{ backgroundColor: 'var(--wds-bg-neutral-subtle)', border: '1px solid rgba(112,115,124,0.22)' }}
      >
        <MessageCircle size={32} style={{ color: 'var(--wds-fg-neutral-assistive)', margin: '0 auto 8px' }} strokeWidth={1.5} />
        <p style={{ fontSize: '14px', color: 'var(--wds-fg-neutral-assistive)' }}>아직 등록한 질문이 없습니다.</p>
      </div>
    )
  }

  return (
    <>
      <div className="flex flex-col gap-2">
        {questions.map((q) => (
          <button
            key={q.id}
            onClick={() => setSelected(q)}
            className="w-full text-left rounded-2xl p-4 flex items-start gap-3 transition-colors"
            style={{ backgroundColor: 'white', border: '1px solid rgba(112,115,124,0.22)' }}
          >
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2 mb-1">
                <span
                  className="rounded-full px-2 py-0.5"
                  style={{ fontSize: '11px', fontWeight: 600, backgroundColor: 'var(--wds-bg-neutral-strong)', color: 'var(--wds-fg-neutral-assistive)' }}
                >
                  {CATEGORY_LABEL[q.category]}
                </span>
                <Badge variant={q.status === 'answered' ? 'answered' : 'pending'} />
              </div>
              <p
                style={{ fontSize: '14px', color: 'var(--wds-fg-neutral-primary)', overflow: 'hidden', display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical' }}
              >
                {q.content}
              </p>
              <p style={{ fontSize: '12px', color: 'var(--wds-fg-neutral-assistive)', marginTop: '4px' }}>
                {new Date(q.created_at).toLocaleDateString('ko-KR')}
              </p>
            </div>
            <ChevronRight size={18} style={{ color: 'var(--wds-fg-neutral-assistive)', flexShrink: 0, marginTop: '2px' }} strokeWidth={1.75} />
          </button>
        ))}
      </div>

      <Modal
        open={!!selected}
        onClose={() => setSelected(null)}
        title={selected ? CATEGORY_LABEL[selected.category] : ''}
      >
        {selected && (
          <div className="flex flex-col gap-4">
            <div>
              <p style={{ fontSize: '12px', fontWeight: 600, color: 'var(--wds-fg-neutral-assistive)', marginBottom: '6px' }}>내 질문</p>
              <p style={{ fontSize: '15px', color: 'var(--wds-fg-neutral-primary)', lineHeight: 1.6 }}>{selected.content}</p>
              <p style={{ fontSize: '12px', color: 'var(--wds-fg-neutral-assistive)', marginTop: '6px' }}>
                {new Date(selected.created_at).toLocaleString('ko-KR')}
              </p>
            </div>

            {selected.answers.length > 0 ? (
              <div
                className="rounded-xl p-4"
                style={{ backgroundColor: 'var(--wds-bg-accent-subtle)', border: '1px solid rgba(112,115,124,0.22)' }}
              >
                <p style={{ fontSize: '12px', fontWeight: 600, color: 'var(--wds-fg-accent-primary)', marginBottom: '6px' }}>운영진 답변</p>
                <p style={{ fontSize: '15px', color: 'var(--wds-fg-neutral-primary)', lineHeight: 1.6 }}>
                  {selected.answers[0].content}
                </p>
                <p style={{ fontSize: '12px', color: 'var(--wds-fg-neutral-assistive)', marginTop: '6px' }}>
                  {new Date(selected.answers[0].created_at).toLocaleString('ko-KR')}
                </p>
              </div>
            ) : (
              <div
                className="rounded-xl p-4 text-center"
                style={{ backgroundColor: 'var(--wds-bg-neutral-subtle)', border: '1px solid rgba(112,115,124,0.22)' }}
              >
                <p style={{ fontSize: '14px', color: 'var(--wds-fg-neutral-assistive)' }}>아직 답변이 등록되지 않았습니다.</p>
              </div>
            )}
          </div>
        )}
      </Modal>
    </>
  )
}
