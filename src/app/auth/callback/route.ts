import { NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'

export async function GET(request: Request) {
  const { searchParams, origin } = new URL(request.url)
  const code = searchParams.get('code')
  const type = searchParams.get('type')
  const regName = searchParams.get('reg_name')
  const regGroup = searchParams.get('reg_group')

  if (!code) {
    return NextResponse.redirect(`${origin}/login?error=no_code`)
  }

  try {
    const supabase = await createClient()
    const { data, error } = await supabase.auth.exchangeCodeForSession(code)

    if (error || !data.user) {
      console.error('Auth exchange error:', error)
      return NextResponse.redirect(`${origin}/login?error=auth_failed`)
    }

    const user = data.user

    const { data: existingProfile } = await supabase
      .from('profiles')
      .select('role')
      .eq('id', user.id)
      .single()

    if (!existingProfile) {
      // 신규 가입: register 페이지에서 전달된 name/group 우선 사용
      const profileName =
        (type === 'register' && regName)
          ? decodeURIComponent(regName)
          : (user.user_metadata?.full_name ?? user.user_metadata?.name ?? user.email?.split('@')[0] ?? '이름 미설정')

      const groupNumber =
        (type === 'register' && regGroup && !isNaN(parseInt(regGroup)))
          ? parseInt(regGroup)
          : 1

      await supabase.from('profiles').upsert({
        id: user.id,
        name: profileName,
        group_number: groupNumber,
        role: 'student',
      })

      return NextResponse.redirect(`${origin}/home`)
    }

    if (existingProfile.role === 'admin') {
      return NextResponse.redirect(`${origin}/admin/attendance`)
    }

    return NextResponse.redirect(`${origin}/home`)
  } catch (err) {
    console.error('Callback route error:', err)
    return NextResponse.redirect(`${origin}/login?error=server_error`)
  }
}
