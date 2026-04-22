'use client'

// Design Ref: §5.4 로그인 페이지 UI Checklist
// Plan SC: FR-01, FR-02 — Google/이메일 로그인 지원

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { createClient } from '@/lib/supabase/client'
import { Mail, Lock, LogIn } from 'lucide-react'

export default function LoginPage() {
  const router = useRouter()
  const supabase = createClient()

  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  async function handleEmailLogin(e: React.FormEvent) {
    e.preventDefault()
    setLoading(true)
    setError('')

    const { error } = await supabase.auth.signInWithPassword({ email, password })

    if (error) {
      setError('이메일 또는 비밀번호가 올바르지 않습니다.')
      setLoading(false)
      return
    }

    router.refresh()
    router.push('/home')
  }

  async function handleGoogleLogin() {
    setLoading(true)
    setError('')

    const { error } = await supabase.auth.signInWithOAuth({
      provider: 'google',
      options: {
        redirectTo: `${location.origin}/auth/callback`,
      },
    })

    if (error) {
      setError('Google 로그인에 실패했습니다.')
      setLoading(false)
    }
  }

  return (
    <main className="min-h-screen flex items-center justify-center px-4" style={{ backgroundColor: 'var(--wds-bg-neutral-subtle)' }}>
      <div
        className="w-full max-w-sm bg-white rounded-2xl p-8"
        style={{ border: '1px solid rgba(112,115,124,0.22)' }}
      >
        <h1
          className="text-center mb-8"
          style={{ fontSize: '22px', fontWeight: 700, letterSpacing: '-0.0194em', color: 'var(--wds-fg-neutral-primary)' }}
        >
          EduConnect
        </h1>

        {/* Google 로그인 */}
        <button
          type="button"
          onClick={handleGoogleLogin}
          disabled={loading}
          className="w-full flex items-center justify-center gap-2 rounded-xl py-3 mb-3 transition-colors disabled:opacity-50"
          style={{
            border: '1px solid rgba(112,115,124,0.22)',
            fontSize: '15px',
            fontWeight: 600,
            color: 'var(--wds-fg-neutral-primary)',
          }}
        >
          <svg width="18" height="18" viewBox="0 0 18 18" fill="none">
            <path d="M17.64 9.205c0-.639-.057-1.252-.164-1.841H9v3.481h4.844a4.14 4.14 0 0 1-1.796 2.716v2.259h2.908c1.702-1.567 2.684-3.875 2.684-6.615z" fill="#4285F4"/>
            <path d="M9 18c2.43 0 4.467-.806 5.956-2.18l-2.908-2.259c-.806.54-1.837.86-3.048.86-2.344 0-4.328-1.584-5.036-3.711H.957v2.332A8.997 8.997 0 0 0 9 18z" fill="#34A853"/>
            <path d="M3.964 10.71A5.41 5.41 0 0 1 3.682 9c0-.593.102-1.17.282-1.71V4.958H.957A8.996 8.996 0 0 0 0 9c0 1.452.348 2.827.957 4.042l3.007-2.332z" fill="#FBBC05"/>
            <path d="M9 3.58c1.321 0 2.508.454 3.44 1.345l2.582-2.58C13.463.891 11.426 0 9 0A8.997 8.997 0 0 0 .957 4.958L3.964 7.29C4.672 5.163 6.656 3.58 9 3.58z" fill="#EA4335"/>
          </svg>
          Google로 로그인
        </button>

        <div
          className="flex items-center gap-3 my-4"
          style={{ color: 'var(--wds-fg-neutral-assistive)', fontSize: '13px' }}
        >
          <div className="flex-1 h-px" style={{ backgroundColor: 'rgba(112,115,124,0.22)' }} />
          또는
          <div className="flex-1 h-px" style={{ backgroundColor: 'rgba(112,115,124,0.22)' }} />
        </div>

        {/* 이메일 로그인 폼 */}
        <form onSubmit={handleEmailLogin} className="flex flex-col gap-3">
          <div className="relative">
            <Mail
              className="absolute left-3 top-1/2 -translate-y-1/2"
              size={18}
              style={{ color: 'var(--wds-fg-neutral-assistive)' }}
            />
            <input
              type="email"
              placeholder="이메일"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              className="w-full rounded-xl py-3 pl-10 pr-4 outline-none transition-colors"
              style={{
                border: '1px solid rgba(112,115,124,0.22)',
                fontSize: '15px',
                color: 'var(--wds-fg-neutral-primary)',
                backgroundColor: 'var(--wds-bg-page)',
              }}
            />
          </div>

          <div className="relative">
            <Lock
              className="absolute left-3 top-1/2 -translate-y-1/2"
              size={18}
              style={{ color: 'var(--wds-fg-neutral-assistive)' }}
            />
            <input
              type="password"
              placeholder="비밀번호"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              className="w-full rounded-xl py-3 pl-10 pr-4 outline-none transition-colors"
              style={{
                border: '1px solid rgba(112,115,124,0.22)',
                fontSize: '15px',
                color: 'var(--wds-fg-neutral-primary)',
                backgroundColor: 'var(--wds-bg-page)',
              }}
            />
          </div>

          {error && (
            <p style={{ fontSize: '13px', color: 'var(--wds-fg-status-negative)' }}>{error}</p>
          )}

          <button
            type="submit"
            disabled={loading}
            className="w-full flex items-center justify-center gap-2 rounded-xl py-3 mt-1 transition-opacity disabled:opacity-50"
            style={{
              backgroundColor: 'var(--wds-bg-accent-primary)',
              color: '#ffffff',
              fontSize: '15px',
              fontWeight: 600,
            }}
          >
            <LogIn size={18} />
            이메일 로그인
          </button>
        </form>

        <p
          className="text-center mt-6"
          style={{ fontSize: '14px', color: 'var(--wds-fg-neutral-assistive)' }}
        >
          계정이 없으신가요?{' '}
          <Link
            href="/register"
            style={{ color: 'var(--wds-fg-accent-primary)', fontWeight: 600 }}
          >
            회원가입
          </Link>
        </p>
      </div>
    </main>
  )
}
