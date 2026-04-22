'use client'

// Design Ref: §5.3 QuestionForm — 카테고리 선택 + 질문 텍스트
// Design Ref: §5.4 교육생 질문 페이지 UI Checklist
// Plan SC: FR-05 — 카테고리(근태/교육운영/숙소/건강/기타) + 내용 텍스트

import { useState } from 'react'
import { createClient } from '@/lib/supabase/client'
import { ChevronDown, Send } from 'lucide-react'
import type { QuestionCategory } from '@/types'

const CATEGORIES: { value: QuestionCategory; label: string }[] = [
  { value: 'attendance', label: '근태' },
  { value: 'education', label: '교육운영' },
  { value: 'accommodation', label: '숙소' },
  { value: 'health', label: '건강' },
  { value: 'other', label: '기타' },
]

const MAX_CONTENT_LENGTH = 500

interface Props {
  userId: string
  onSubmitted: () => void
}

export default function QuestionForm({ userId, onSubmitted }: Props) {
  const supabase = createClient()
  const [category, setCategory] = useState<QuestionCategory | ''>('')
  const [content, setContent] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    if (!category) { setError('카테고리를 선택해주세요.'); return }
    if (!content.trim()) { setError('질문 내용을 입력해주세요.'); return }
    setLoading(true)
    setError('')

    const { error: insertError } = await supabase.from('questions').insert({
      user_id: userId,
      category,
      content: content.trim(),
    })

    if (insertError) {
      setError('질문 등록 중 오류가 발생했습니다.')
      setLoading(false)
      return
    }

    setCategory('')
    setContent('')
    onSubmitted()
  }

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-3">
      <div className="relative">
        <select
          value={category}
          onChange={(e) => setCategory(e.target.value as QuestionCategory)}
          className="w-full appearance-none rounded-xl py-3 px-4 pr-10 outline-none"
          style={{
            border: '1px solid rgba(112,115,124,0.22)',
            fontSize: '15px',
            color: category ? 'var(--wds-fg-neutral-primary)' : 'var(--wds-fg-neutral-subtle)',
            backgroundColor: 'var(--wds-bg-page)',
          }}
        >
          <option value="">카테고리 선택 (필수)</option>
          {CATEGORIES.map((c) => (
            <option key={c.value} value={c.value}>{c.label}</option>
          ))}
        </select>
        <ChevronDown
          className="absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none"
          size={18}
          style={{ color: 'var(--wds-fg-neutral-assistive)' }}
        />
      </div>

      <div className="relative">
        <textarea
          value={content}
          onChange={(e) => setContent(e.target.value)}
          placeholder="질문 내용을 입력하세요 (최대 500자)"
          maxLength={MAX_CONTENT_LENGTH}
          rows={4}
          className="w-full rounded-xl py-3 px-4 outline-none resize-none"
          style={{
            border: '1px solid rgba(112,115,124,0.22)',
            fontSize: '15px',
            color: 'var(--wds-fg-neutral-primary)',
          }}
        />
        <span
          className="absolute bottom-3 right-3"
          style={{ fontSize: '12px', color: 'var(--wds-fg-neutral-assistive)' }}
        >
          {content.length}/{MAX_CONTENT_LENGTH}
        </span>
      </div>

      {error && (
        <p style={{ fontSize: '13px', color: 'var(--wds-fg-status-negative)' }}>{error}</p>
      )}

      <button
        type="submit"
        disabled={loading || !category || !content.trim()}
        className="w-full flex items-center justify-center gap-2 rounded-xl py-3 disabled:opacity-40"
        style={{
          backgroundColor: 'var(--wds-bg-accent-primary)',
          color: '#ffffff',
          fontSize: '15px',
          fontWeight: 600,
        }}
      >
        <Send size={16} strokeWidth={1.75} />
        {loading ? '제출 중...' : '질문 제출'}
      </button>
    </form>
  )
}
