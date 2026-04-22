import { NextResponse } from 'next/server'
import { createClient, createAdminClient } from '@/lib/supabase/server'

export async function POST(request: Request) {
  try {
    const supabase = await createClient()
    const { data: { user }, error: authError } = await supabase.auth.getUser()

    if (authError || !user) {
      return NextResponse.json({ error: '인증이 필요합니다.' }, { status: 401 })
    }

    const formData = await request.formData()
    const file = formData.get('file') as File | null

    if (!file) {
      return NextResponse.json({ error: '파일이 없습니다.' }, { status: 400 })
    }

    const today = new Date().toISOString().split('T')[0]
    const ext = file.type.split('/')[1] || 'jpg'
    const filePath = `${user.id}/${today}.${ext}`

    const arrayBuffer = await file.arrayBuffer()
    const buffer = Buffer.from(arrayBuffer)

    const adminClient = createAdminClient()

    const { error: uploadError } = await adminClient.storage
      .from('attendance-photos')
      .upload(filePath, buffer, {
        contentType: file.type,
        upsert: true,
      })

    if (uploadError) {
      console.error('Storage upload error:', uploadError)
      return NextResponse.json({ error: '사진 업로드에 실패했습니다.' }, { status: 500 })
    }

    const { data: { publicUrl } } = adminClient.storage
      .from('attendance-photos')
      .getPublicUrl(filePath)

    const { data, error: insertError } = await adminClient
      .from('attendance')
      .insert({ user_id: user.id, date: today, image_url: publicUrl })
      .select()
      .single()

    if (insertError) {
      if (insertError.code === '23505') {
        return NextResponse.json({ error: '오늘 이미 출석을 제출했습니다.' }, { status: 409 })
      }
      console.error('Attendance insert error:', insertError)
      return NextResponse.json({ error: '출석 기록 저장에 실패했습니다.' }, { status: 500 })
    }

    return NextResponse.json({ data })
  } catch (err) {
    console.error('Upload route error:', err)
    return NextResponse.json({ error: '서버 오류가 발생했습니다.' }, { status: 500 })
  }
}
