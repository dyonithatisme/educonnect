// Design Ref: §4.2 GET /api/admin/questions — 카테고리/상태 필터 + 페이지네이션
// Plan SC: FR-09
import { createAdminClient, createClient } from '@/lib/supabase/server'
import { NextResponse, type NextRequest } from 'next/server'

export async function GET(request: NextRequest) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return NextResponse.json({ error: { code: 'UNAUTHORIZED', message: '로그인이 필요합니다.' } }, { status: 401 })

  const { data: profile } = await supabase.from('profiles').select('role').eq('id', user.id).single()
  if (profile?.role !== 'admin') return NextResponse.json({ error: { code: 'UNAUTHORIZED', message: '관리자 권한이 필요합니다.' } }, { status: 401 })

  const adminSupabase = createAdminClient()
  const { searchParams } = new URL(request.url)
  const category = searchParams.get('category')
  const status = searchParams.get('status')
  const page = parseInt(searchParams.get('page') ?? '1')
  const limit = parseInt(searchParams.get('limit') ?? '20')
  const offset = (page - 1) * limit

  let query = adminSupabase
    .from('questions')
    .select('*, profiles(name, group_number), answers(*)', { count: 'exact' })
    .order('created_at', { ascending: false })
    .range(offset, offset + limit - 1)

  if (category && category !== 'all') query = query.eq('category', category)
  if (status && status !== 'all') query = query.eq('status', status)

  const { data, count, error } = await query
  if (error) return NextResponse.json({ error: { code: 'DB_ERROR', message: '조회 중 오류가 발생했습니다.' } }, { status: 500 })

  return NextResponse.json({
    data: data ?? [],
    pagination: { total: count ?? 0, page, limit },
  })
}
