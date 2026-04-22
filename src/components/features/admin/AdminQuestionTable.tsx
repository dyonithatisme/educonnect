'use client'

// Design Ref: §5.3 AdminQuestionTable — 질문 관리 테이블
// Design Ref: §5.4 관리자 질문 관리 페이지 UI Checklist
// Plan SC: FR-09, FR-10

import { useState, useEffect, useCallback } from 'react'
import Badge from '@/components/ui/Badge'
import Modal from '@/components/ui/Modal'
import AnswerModal from './AnswerModal'
import { ChevronDown } from 'lucide-react'
import type { Question, Answer, Profile, QuestionCategory } from '@/types'

interface QuestionRow extends Question {
  profiles: Pick<Profile, 'name' | 'group_number'>
  answers: Answer[]
}

const CATEGORIES: { value: string; label: string }[] = [
  { value: 'all', label: '전체' },
  { value: 'attendance', label: '근태' },
  { value: 'education', label: '교육운영' },
  { value: 'accommodation', label: '숙소' },
  { value: 'health', label: '건강' },
  { value: 'other', label: '기타' },
]

const CATEGORY_LABEL: Record<string, string> = {
  attendance: '근태', education: '교육운영', accommodation: '숙소', health: '건강', other: '기타',
}

export default function AdminQuestionTable() {
  const [questions, setQuestions] = useState<QuestionRow[]>([])
  const [total, setTotal] = useState(0)
  const [category, setCategory] = useState('all')
  const [status, setStatus] = useState('all')
  const [page, setPage] = useState(1)
  const [loading, setLoading] = useState(true)
  const [answerTarget, setAnswerTarget] = useState<QuestionRow | null>(null)
  const [viewTarget, setViewTarget] = useState<QuestionRow | null>(null)

  const fetchQuestions = useCallback(async () => {
    setLoading(true)
    const params = new URLSearchParams({ category, status, page: String(page), limit: '20' })
    const res = await fetch(`/api/admin/questions?${params}`)
    const json = await res.json()
    // answers가 UNIQUE FK라 PostgREST가 객체로 반환 — 배열로 정규화
    const normalized = (json.data ?? []).map((q: QuestionRow) => ({
      ...q,
      answers: q.answers
        ? (Array.isArray(q.answers) ? q.answers : [q.answers])
        : [],
    }))
    setQuestions(normalized)
    setTotal(json.pagination?.total ?? 0)
    setLoading(false)
  }, [category, status, page])

  useEffect(() => { fetchQuestions() }, [fetchQuestions])

  function handleAnswered() {
    setAnswerTarget(null)
    fetchQuestions()
  }

  return (
    <div className="flex flex-col gap-4">
      {/* 필터 */}
      <div className="flex gap-2 flex-wrap">
        <div className="relative">
          <select
            value={category}
            onChange={(e) => { setCategory(e.target.value); setPage(1) }}
            className="appearance-none rounded-xl py-2 pl-3 pr-8 outline-none"
            style={{ border: '1px solid rgba(112,115,124,0.22)', fontSize: '14px', color: 'var(--wds-fg-neutral-primary)', backgroundColor: 'white' }}
          >
            {CATEGORIES.map((c) => <option key={c.value} value={c.value}>{c.label}</option>)}
          </select>
          <ChevronDown className="absolute right-2 top-1/2 -translate-y-1/2 pointer-events-none" size={14} style={{ color: 'var(--wds-fg-neutral-assistive)' }} />
        </div>
        <div className="relative">
          <select
            value={status}
            onChange={(e) => { setStatus(e.target.value); setPage(1) }}
            className="appearance-none rounded-xl py-2 pl-3 pr-8 outline-none"
            style={{ border: '1px solid rgba(112,115,124,0.22)', fontSize: '14px', color: 'var(--wds-fg-neutral-primary)', backgroundColor: 'white' }}
          >
            <option value="all">전체 상태</option>
            <option value="pending">미답변</option>
            <option value="answered">답변완료</option>
          </select>
          <ChevronDown className="absolute right-2 top-1/2 -translate-y-1/2 pointer-events-none" size={14} style={{ color: 'var(--wds-fg-neutral-assistive)' }} />
        </div>
        <span style={{ fontSize: '14px', color: 'var(--wds-fg-neutral-assistive)', alignSelf: 'center' }}>총 {total}건</span>
      </div>

      {/* 테이블 */}
      <div className="rounded-2xl overflow-hidden" style={{ border: '1px solid rgba(112,115,124,0.22)' }}>
        {loading ? (
          <div className="p-8 text-center" style={{ fontSize: '14px', color: 'var(--wds-fg-neutral-assistive)' }}>불러오는 중...</div>
        ) : questions.length === 0 ? (
          <div className="p-8 text-center" style={{ fontSize: '14px', color: 'var(--wds-fg-neutral-assistive)' }}>질문이 없습니다.</div>
        ) : (
          <div className="flex flex-col">
            {questions.map((q, i) => (
              <div
                key={q.id}
                className="flex items-start gap-3 px-4 py-3"
                style={{ borderTop: i > 0 ? '1px solid rgba(112,115,124,0.22)' : undefined, backgroundColor: 'white' }}
              >
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-1 flex-wrap">
                    <span style={{ fontSize: '13px', fontWeight: 600, color: 'var(--wds-fg-neutral-primary)' }}>
                      {q.profiles.name}
                    </span>
                    <span style={{ fontSize: '12px', color: 'var(--wds-fg-neutral-assistive)' }}>
                      {q.profiles.group_number}분과
                    </span>
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
                    {new Date(q.created_at).toLocaleString('ko-KR')}
                  </p>
                </div>
                {q.status === 'pending' ? (
                  <button
                    onClick={() => setAnswerTarget(q)}
                    className="flex-shrink-0 rounded-xl px-3 py-1.5"
                    style={{ backgroundColor: 'var(--wds-bg-accent-primary)', color: '#ffffff', fontSize: '13px', fontWeight: 600 }}
                  >
                    답변
                  </button>
                ) : (
                  <button
                    onClick={() => setViewTarget(q)}
                    className="flex-shrink-0 rounded-xl px-3 py-1.5"
                    style={{ border: '1px solid rgba(112,115,124,0.22)', backgroundColor: 'white', color: 'var(--wds-fg-neutral-primary)', fontSize: '13px', fontWeight: 600 }}
                  >
                    보기
                  </button>
                )}
              </div>
            ))}
          </div>
        )}
      </div>

      {answerTarget && (
        <AnswerModal
          question={answerTarget}
          onClose={() => setAnswerTarget(null)}
          onAnswered={handleAnswered}
        />
      )}

      {viewTarget && (
        <Modal open={!!viewTarget} onClose={() => setViewTarget(null)} title={CATEGORY_LABEL[viewTarget.category]}>
          <div className="flex flex-col gap-4">
            <div>
              <p style={{ fontSize: '12px', fontWeight: 600, color: 'var(--wds-fg-neutral-assistive)', marginBottom: '4px' }}>
                {viewTarget.profiles.name} · {viewTarget.profiles.group_number}분과
              </p>
              <p style={{ fontSize: '15px', color: 'var(--wds-fg-neutral-primary)', lineHeight: 1.6 }}>
                {viewTarget.content}
              </p>
              <p style={{ fontSize: '12px', color: 'var(--wds-fg-neutral-assistive)', marginTop: '6px' }}>
                {new Date(viewTarget.created_at).toLocaleString('ko-KR')}
              </p>
            </div>
            {viewTarget.answers[0] && (
              <div
                className="rounded-xl p-4"
                style={{ backgroundColor: 'var(--wds-bg-accent-subtle)', border: '1px solid rgba(112,115,124,0.22)' }}
              >
                <p style={{ fontSize: '12px', fontWeight: 600, color: 'var(--wds-fg-accent-primary)', marginBottom: '6px' }}>내 답변</p>
                <p style={{ fontSize: '15px', color: 'var(--wds-fg-neutral-primary)', lineHeight: 1.6 }}>
                  {viewTarget.answers[0].content}
                </p>
                <p style={{ fontSize: '12px', color: 'var(--wds-fg-neutral-assistive)', marginTop: '6px' }}>
                  {new Date(viewTarget.answers[0].created_at).toLocaleString('ko-KR')}
                </p>
              </div>
            )}
          </div>
        </Modal>
      )}
    </div>
  )
}
