// Design Ref: §4.2 PUT /api/admin/students/{id}/memo — 교육생 메모 upsert
// Plan SC: FR-12
import { createAdminClient, createClient } from '@/lib/supabase/server'
import { NextResponse, type NextRequest } from 'next/server'

export async function PUT(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return NextResponse.json({ error: { code: 'UNAUTHORIZED', message: '로그인이 필요합니다.' } }, { status: 401 })

  const { data: profile } = await supabase.from('profiles').select('role').eq('id', user.id).single()
  if (profile?.role !== 'admin') return NextResponse.json({ error: { code: 'UNAUTHORIZED', message: '관리자 권한이 필요합니다.' } }, { status: 401 })

  const { id: studentId } = await params
  const { memo } = await request.json()
  if (memo === undefined) return NextResponse.json({ error: { code: 'VALIDATION_ERROR', message: 'memo 필드가 필요합니다.' } }, { status: 400 })

  const adminSupabase = createAdminClient()
  const { data, error } = await adminSupabase
    .from('admin_memos')
    .upsert({ user_id: studentId, memo: memo ?? '' }, { onConflict: 'user_id' })
    .select()
    .single()

  if (error) return NextResponse.json({ error: { code: 'DB_ERROR', message: '저장 중 오류가 발생했습니다.' } }, { status: 500 })

  return NextResponse.json(data)
}
