// Design Ref: §4.2 POST /api/admin/questions/{id}/answer — 답변 작성 + 질문 상태 변경
// Plan SC: FR-10
import { createAdminClient, createClient } from '@/lib/supabase/server'
import { NextResponse, type NextRequest } from 'next/server'

export async function POST(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return NextResponse.json({ error: { code: 'UNAUTHORIZED', message: '로그인이 필요합니다.' } }, { status: 401 })

  const { data: profile } = await supabase.from('profiles').select('role').eq('id', user.id).single()
  if (profile?.role !== 'admin') return NextResponse.json({ error: { code: 'UNAUTHORIZED', message: '관리자 권한이 필요합니다.' } }, { status: 401 })

  const { id: questionId } = await params
  const { content } = await request.json()
  if (!content?.trim()) return NextResponse.json({ error: { code: 'VALIDATION_ERROR', message: '답변 내용을 입력해주세요.' } }, { status: 400 })

  const adminSupabase = createAdminClient()

  const { data: existing } = await adminSupabase.from('answers').select('id').eq('question_id', questionId).single()
  if (existing) return NextResponse.json({ error: { code: 'ALREADY_ANSWERED', message: '이미 답변이 등록된 질문입니다.' } }, { status: 409 })

  const { data: answer, error: insertError } = await adminSupabase
    .from('answers')
    .insert({ question_id: questionId, content: content.trim() })
    .select()
    .single()

  if (insertError) return NextResponse.json({ error: { code: 'DB_ERROR', message: '저장 중 오류가 발생했습니다.' } }, { status: 500 })

  await adminSupabase.from('questions').update({ status: 'answered' }).eq('id', questionId)

  return NextResponse.json(answer, { status: 201 })
}
