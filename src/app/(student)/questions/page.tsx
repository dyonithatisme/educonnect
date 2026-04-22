'use client'

// Design Ref: §5.4 교육생 질문 페이지 UI Checklist
// Plan SC: FR-05, FR-06, FR-07

import { useState, useEffect, useCallback } from 'react'
import { createClient } from '@/lib/supabase/client'
import QuestionForm from '@/components/features/questions/QuestionForm'
import QuestionList from '@/components/features/questions/QuestionList'
import AnswerNotificationPopup from '@/components/ui/AnswerNotificationPopup'
import type { Question, Answer } from '@/types'

interface QuestionWithAnswer extends Question {
  answers: Answer[]
}

export default function QuestionsPage() {
  const supabase = createClient()
  const [userId, setUserId] = useState<string | null>(null)
  const [questions, setQuestions] = useState<QuestionWithAnswer[]>([])
  const [newAnswerCount, setNewAnswerCount] = useState(0)
  const [loading, setLoading] = useState(true)

  const fetchQuestions = useCallback(async (uid: string) => {
    const { data } = await supabase
      .from('questions')
      .select('*, answers(*)')
      .eq('user_id', uid)
      .order('created_at', { ascending: false })

    const qs = (data ?? []) as QuestionWithAnswer[]
    setQuestions(qs)

    // 미확인 답변: answered 상태이면서 마지막 세션 이후 답변된 것
    const lastSeen = localStorage.getItem('last_seen_at')
    const newAnswers = qs.filter(
      (q) => q.status === 'answered' && q.answers[0] &&
        (!lastSeen || new Date(q.answers[0].created_at) > new Date(lastSeen))
    )
    setNewAnswerCount(newAnswers.length)
    localStorage.setItem('last_seen_at', new Date().toISOString())
  }, [supabase])

  useEffect(() => {
    supabase.auth.getUser().then(({ data: { user } }) => {
      if (!user) return
      setUserId(user.id)
      fetchQuestions(user.id).finally(() => setLoading(false))
    })
  }, [fetchQuestions, supabase.auth])

  if (loading) {
    return (
      <div className="flex items-center justify-center py-20">
        <p style={{ fontSize: '14px', color: 'var(--wds-fg-neutral-assistive)' }}>불러오는 중...</p>
      </div>
    )
  }

  return (
    <div className="flex flex-col gap-6">
      <h2 style={{ fontSize: '22px', fontWeight: 700, letterSpacing: '-0.0194em', color: 'var(--wds-fg-neutral-primary)' }}>
        질문하기
      </h2>

      {userId && (
        <QuestionForm userId={userId} onSubmitted={() => fetchQuestions(userId)} />
      )}

      <div>
        <h3 style={{ fontSize: '15px', fontWeight: 700, color: 'var(--wds-fg-neutral-primary)', marginBottom: '12px' }}>
          내 질문 목록
        </h3>
        <QuestionList questions={questions} />
      </div>

      <AnswerNotificationPopup count={newAnswerCount} />
    </div>
  )
}
