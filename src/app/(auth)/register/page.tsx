'use client'

// Design Ref: §5.4 회원가입 페이지 UI Checklist
// Plan SC: FR-01, FR-02 — 이름, 분과 선택, Google/이메일 가입

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { createClient } from '@/lib/supabase/client'
import { User, ChevronDown } from 'lucide-react'

const GROUPS = Array.from({ length: 10 }, (_, i) => i + 1)

export default function RegisterPage() {
  const router = useRouter()
  const supabase = createClient()

  const [name, setName] = useState('')
  const [groupNumber, setGroupNumber] = useState<number | ''>('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [step, setStep] = useState<'info' | 'method'>('info')

  function handleInfoSubmit(e: React.FormEvent) {
    e.preventDefault()
    if (!name.trim() || !groupNumber) {
      setError('이름과 분과를 모두 입력해주세요.')
      return
    }
    setError('')
    setStep('method')
  }

  async function handleGoogleRegister() {
    if (!name.trim() || !groupNumber) return
    setLoading(true)

    localStorage.setItem('register_name', name.trim())
    localStorage.setItem('register_group', String(groupNumber))

    const { error } = await supabase.auth.signInWithOAuth({
      provider: 'google',
      options: {
        redirectTo: `${location.origin}/auth/callback?type=register&reg_name=${encodeURIComponent(name.trim())}&reg_group=${groupNumber}`,
      },
    })

    if (error) {
      setError('Google 회원가입에 실패했습니다.')
      setLoading(false)
    }
  }

  async function handleEmailRegister(e: React.FormEvent) {
    e.preventDefault()
    if (!email || !password || !name.trim() || !groupNumber) return
    setLoading(true)
    setError('')

    const { data, error: signUpError } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: {
          name: name.trim(),
          group_number: groupNumber,
        },
      },
    })

    if (signUpError) {
      setError(signUpError.message === 'User already registered'
        ? '이미 가입된 이메일입니다.'
        : '회원가입에 실패했습니다.')
      setLoading(false)
      return
    }

    if (data.user) {
      router.push('/home')
    }
  }

  return (
    <main className="min-h-screen flex items-center justify-center px-4" style={{ backgroundColor: 'var(--wds-bg-neutral-subtle)' }}>
      <div
        className="w-full max-w-sm bg-white rounded-2xl p-8"
        style={{ border: '1px solid rgba(112,115,124,0.22)' }}
      >
        <h1
          className="text-center mb-2"
          style={{ fontSize: '22px', fontWeight: 700, letterSpacing: '-0.0194em', color: 'var(--wds-fg-neutral-primary)' }}
        >
          회원가입
        </h1>
        <p
          className="text-center mb-8"
          style={{ fontSize: '14px', color: 'var(--wds-fg-neutral-assistive)' }}
        >
          운영진에게 등록된 이름을 입력하세요
        </p>

        {step === 'info' ? (
          <form onSubmit={handleInfoSubmit} className="flex flex-col gap-3">
            <div className="relative">
              <User
                className="absolute left-3 top-1/2 -translate-y-1/2"
                size={18}
                style={{ color: 'var(--wds-fg-neutral-assistive)' }}
              />
              <input
                type="text"
                placeholder="이름"
                value={name}
                onChange={(e) => setName(e.target.value)}
                required
                className="w-full rounded-xl py-3 pl-10 pr-4 outline-none"
                style={{
                  border: '1px solid rgba(112,115,124,0.22)',
                  fontSize: '15px',
                  color: 'var(--wds-fg-neutral-primary)',
                }}
              />
            </div>

            <div className="relative">
              <select
                value={groupNumber}
                onChange={(e) => setGroupNumber(Number(e.target.value))}
                required
                className="w-full appearance-none rounded-xl py-3 px-4 pr-10 outline-none"
                style={{
                  border: '1px solid rgba(112,115,124,0.22)',
                  fontSize: '15px',
                  color: groupNumber ? 'var(--wds-fg-neutral-primary)' : 'var(--wds-fg-neutral-subtle)',
                  backgroundColor: 'var(--wds-bg-page)',
                }}
              >
                <option value="">분과 선택 (필수)</option>
                {GROUPS.map((g) => (
                  <option key={g} value={g}>{g}분과</option>
                ))}
              </select>
              <ChevronDown
                className="absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none"
                size={18}
                style={{ color: 'var(--wds-fg-neutral-assistive)' }}
              />
            </div>

            {error && (
              <p style={{ fontSize: '13px', color: 'var(--wds-fg-status-negative)' }}>{error}</p>
            )}

            <button
              type="submit"
              className="w-full rounded-xl py-3 mt-1"
              style={{
                backgroundColor: 'var(--wds-bg-accent-primary)',
                color: '#ffffff',
                fontSize: '15px',
                fontWeight: 600,
              }}
            >
              다음
            </button>
          </form>
        ) : (
          <div className="flex flex-col gap-3">
            <div
              className="rounded-xl px-4 py-3 mb-2"
              style={{ backgroundColor: 'var(--wds-bg-accent-subtle)', border: '1px solid rgba(112,115,124,0.22)' }}
            >
              <p style={{ fontSize: '13px', color: 'var(--wds-fg-neutral-assistive)' }}>
                {name} · {groupNumber}분과
              </p>
            </div>

            <button
              type="button"
              onClick={handleGoogleRegister}
              disabled={loading}
              className="w-full flex items-center justify-center gap-2 rounded-xl py-3 transition-colors disabled:opacity-50"
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
              Google로 시작하기
            </button>

            <div
              className="flex items-center gap-3"
              style={{ color: 'var(--wds-fg-neutral-assistive)', fontSize: '13px' }}
            >
              <div className="flex-1 h-px" style={{ backgroundColor: 'rgba(112,115,124,0.22)' }} />
              또는
              <div className="flex-1 h-px" style={{ backgroundColor: 'rgba(112,115,124,0.22)' }} />
            </div>

            <form onSubmit={handleEmailRegister} className="flex flex-col gap-3">
              <input
                type="email"
                placeholder="이메일"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                className="w-full rounded-xl py-3 px-4 outline-none"
                style={{
                  border: '1px solid rgba(112,115,124,0.22)',
                  fontSize: '15px',
                  color: 'var(--wds-fg-neutral-primary)',
                }}
              />
              <input
                type="password"
                placeholder="비밀번호 (8자 이상)"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                minLength={8}
                required
                className="w-full rounded-xl py-3 px-4 outline-none"
                style={{
                  border: '1px solid rgba(112,115,124,0.22)',
                  fontSize: '15px',
                  color: 'var(--wds-fg-neutral-primary)',
                }}
              />

              {error && (
                <p style={{ fontSize: '13px', color: 'var(--wds-fg-status-negative)' }}>{error}</p>
              )}

              <button
                type="submit"
                disabled={loading}
                className="w-full rounded-xl py-3 disabled:opacity-50"
                style={{
                  backgroundColor: 'var(--wds-bg-accent-primary)',
                  color: '#ffffff',
                  fontSize: '15px',
                  fontWeight: 600,
                }}
              >
                이메일로 시작하기
              </button>
            </form>

            <button
              type="button"
              onClick={() => { setStep('info'); setError('') }}
              style={{ fontSize: '14px', color: 'var(--wds-fg-neutral-assistive)' }}
            >
              뒤로
            </button>
          </div>
        )}

        <p
          className="text-center mt-6"
          style={{ fontSize: '14px', color: 'var(--wds-fg-neutral-assistive)' }}
        >
          이미 계정이 있으신가요?{' '}
          <Link href="/login" style={{ color: 'var(--wds-fg-accent-primary)', fontWeight: 600 }}>
            로그인
          </Link>
        </p>
      </div>
    </main>
  )
}
