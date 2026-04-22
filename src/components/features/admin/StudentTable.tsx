'use client'

import { useState, useMemo } from 'react'
import Badge from '@/components/ui/Badge'
import Modal from '@/components/ui/Modal'
import { Search, ChevronDown, ChevronRight, Pencil, Calendar, MessageCircle } from 'lucide-react'

interface StudentRow {
  id: string
  name: string
  group_number: number
  created_at: string
  memo: string
  memo_updated_at: string | null
  attendances: Record<string, string> // date → created_at (ISO)
  hasAttendanceToday: boolean
  questionCount: number
  pendingCount: number
}

interface Props {
  students: StudentRow[]
  startDate: string
  todayStr: string
}

const GROUPS = ['전체', ...Array.from({ length: 10 }, (_, i) => String(i + 1))]

function formatTime(isoStr: string) {
  return new Date(isoStr).toLocaleTimeString('ko-KR', { hour: '2-digit', minute: '2-digit' })
}

function formatDateLabel(dateStr: string) {
  const d = new Date(dateStr)
  const month = d.getMonth() + 1
  const day = d.getDate()
  const weekdays = ['일', '월', '화', '수', '목', '금', '토']
  return `${month}/${day}(${weekdays[d.getDay()]})`
}

// 날짜 배열 생성 (startDate ~ todayStr, 최근 14일만 표시)
function getRecentDates(startDate: string, todayStr: string): string[] {
  const dates: string[] = []
  const start = new Date(startDate)
  const end = new Date(todayStr)
  for (let d = new Date(end); d >= start; d.setDate(d.getDate() - 1)) {
    dates.push(d.toISOString().split('T')[0])
  }
  return dates.slice(0, 14) // 최근 14일
}

export default function StudentTable({ students, startDate, todayStr }: Props) {
  const [search, setSearch] = useState('')
  const [groupFilter, setGroupFilter] = useState('전체')
  const [detailTarget, setDetailTarget] = useState<StudentRow | null>(null)
  const [memoContent, setMemoContent] = useState('')
  const [memoSaving, setMemoSaving] = useState(false)
  const [memoError, setMemoError] = useState('')
  const [localMemos, setLocalMemos] = useState<Record<string, string>>({})

  const recentDates = useMemo(() => getRecentDates(startDate, todayStr), [startDate, todayStr])

  const filtered = useMemo(() => {
    return students.filter((s) => {
      const matchGroup = groupFilter === '전체' || s.group_number === parseInt(groupFilter)
      const matchSearch = !search || s.name.includes(search)
      return matchGroup && matchSearch
    })
  }, [students, search, groupFilter])

  function openDetail(student: StudentRow) {
    setDetailTarget(student)
    setMemoContent(localMemos[student.id] ?? student.memo)
    setMemoError('')
  }

  async function handleSaveMemo() {
    if (!detailTarget) return
    setMemoSaving(true)
    setMemoError('')

    const res = await fetch(`/api/admin/students/${detailTarget.id}/memo`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ memo: memoContent }),
    })

    if (!res.ok) {
      const json = await res.json()
      setMemoError(json.error?.message ?? '저장 중 오류가 발생했습니다.')
      setMemoSaving(false)
      return
    }

    setLocalMemos((prev) => ({ ...prev, [detailTarget.id]: memoContent }))
    setMemoSaving(false)
  }

  const currentMemo = detailTarget
    ? (localMemos[detailTarget.id] ?? detailTarget.memo)
    : ''

  return (
    <div className="flex flex-col gap-4">
      {/* 검색 + 분과 필터 */}
      <div className="flex gap-2">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2" size={16} style={{ color: 'var(--wds-fg-neutral-assistive)' }} />
          <input
            type="text"
            placeholder="이름 검색"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full rounded-xl py-2 pl-9 pr-4 outline-none"
            style={{ border: '1px solid rgba(112,115,124,0.22)', fontSize: '14px', backgroundColor: 'white', color: 'var(--wds-fg-neutral-primary)' }}
          />
        </div>
        <div className="relative">
          <select
            value={groupFilter}
            onChange={(e) => setGroupFilter(e.target.value)}
            className="appearance-none rounded-xl py-2 pl-3 pr-8 outline-none"
            style={{ border: '1px solid rgba(112,115,124,0.22)', fontSize: '14px', backgroundColor: 'white', color: 'var(--wds-fg-neutral-primary)' }}
          >
            {GROUPS.map((g) => <option key={g} value={g}>{g === '전체' ? '전체 분과' : `${g}분과`}</option>)}
          </select>
          <ChevronDown className="absolute right-2 top-1/2 -translate-y-1/2 pointer-events-none" size={14} style={{ color: 'var(--wds-fg-neutral-assistive)' }} />
        </div>
      </div>

      <p style={{ fontSize: '13px', color: 'var(--wds-fg-neutral-assistive)' }}>{filtered.length}명</p>

      {/* 리스트 */}
      <div className="rounded-2xl overflow-hidden" style={{ border: '1px solid rgba(112,115,124,0.22)' }}>
        {filtered.length === 0 ? (
          <div className="p-8 text-center bg-white" style={{ fontSize: '14px', color: 'var(--wds-fg-neutral-assistive)' }}>
            검색 결과가 없습니다.
          </div>
        ) : filtered.map((s, i) => {
          const memo = localMemos[s.id] ?? s.memo
          return (
            <button
              key={s.id}
              onClick={() => openDetail(s)}
              className="w-full flex items-center gap-3 px-4 py-3 bg-white text-left"
              style={{ borderTop: i > 0 ? '1px solid rgba(112,115,124,0.22)' : undefined }}
            >
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 mb-0.5 flex-wrap">
                  <span style={{ fontSize: '15px', fontWeight: 600, color: 'var(--wds-fg-neutral-primary)' }}>{s.name}</span>
                  <span style={{ fontSize: '13px', color: 'var(--wds-fg-neutral-assistive)' }}>{s.group_number}분과</span>
                  <Badge variant={s.hasAttendanceToday ? 'present' : 'absent'} />
                  {s.pendingCount > 0 && (
                    <span
                      className="rounded-full px-2 py-0.5"
                      style={{ fontSize: '11px', fontWeight: 600, backgroundColor: 'var(--wds-bg-status-negative-subtle)', color: 'var(--wds-fg-status-negative)' }}
                    >
                      미답변 {s.pendingCount}
                    </span>
                  )}
                </div>
                {memo && (
                  <p style={{ fontSize: '12px', color: 'var(--wds-fg-neutral-assistive)', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap', maxWidth: '200px' }}>
                    {memo}
                  </p>
                )}
              </div>
              <ChevronRight size={16} style={{ color: 'var(--wds-fg-neutral-assistive)', flexShrink: 0 }} strokeWidth={1.75} />
            </button>
          )
        })}
      </div>

      {/* 교육생 상세 모달 */}
      {detailTarget && (
        <Modal open onClose={() => setDetailTarget(null)} title={`${detailTarget.name} · ${detailTarget.group_number}분과`}>
          <div className="flex flex-col gap-5">

            {/* 출석 현황 */}
            <div>
              <div className="flex items-center gap-1.5 mb-3">
                <Calendar size={14} style={{ color: 'var(--wds-fg-accent-primary)' }} strokeWidth={1.75} />
                <p style={{ fontSize: '13px', fontWeight: 700, color: 'var(--wds-fg-neutral-primary)' }}>최근 출석 (14일)</p>
              </div>
              <div className="flex flex-col gap-1">
                {recentDates.map((date) => {
                  const submittedAt = detailTarget.attendances[date]
                  return (
                    <div key={date} className="flex items-center justify-between py-1.5 px-3 rounded-xl"
                      style={{ backgroundColor: submittedAt ? 'var(--wds-bg-status-positive-subtle)' : 'var(--wds-bg-neutral-subtle)' }}
                    >
                      <span style={{ fontSize: '13px', color: 'var(--wds-fg-neutral-assistive)', fontVariantNumeric: 'tabular-nums' }}>
                        {formatDateLabel(date)}
                      </span>
                      {submittedAt ? (
                        <span style={{ fontSize: '13px', fontWeight: 600, color: 'var(--wds-fg-status-positive)' }}>
                          {formatTime(submittedAt)}
                        </span>
                      ) : (
                        <span style={{ fontSize: '13px', color: 'var(--wds-fg-neutral-subtle)' }}>미출석</span>
                      )}
                    </div>
                  )
                })}
              </div>
            </div>

            {/* 질문 현황 */}
            <div className="flex items-center gap-3 rounded-xl px-4 py-3"
              style={{ backgroundColor: 'var(--wds-bg-neutral-subtle)', border: '1px solid rgba(112,115,124,0.22)' }}
            >
              <MessageCircle size={16} style={{ color: 'var(--wds-fg-accent-primary)' }} strokeWidth={1.75} />
              <div>
                <p style={{ fontSize: '13px', fontWeight: 700, color: 'var(--wds-fg-neutral-primary)' }}>질문</p>
                <p style={{ fontSize: '12px', color: 'var(--wds-fg-neutral-assistive)' }}>
                  전체 {detailTarget.questionCount}건
                  {detailTarget.pendingCount > 0 && (
                    <span style={{ color: 'var(--wds-fg-status-negative)', marginLeft: '6px' }}>
                      미답변 {detailTarget.pendingCount}건
                    </span>
                  )}
                </p>
              </div>
            </div>

            {/* 특이사항 메모 */}
            <div>
              <div className="flex items-center gap-1.5 mb-2">
                <Pencil size={14} style={{ color: 'var(--wds-fg-accent-primary)' }} strokeWidth={1.75} />
                <p style={{ fontSize: '13px', fontWeight: 700, color: 'var(--wds-fg-neutral-primary)' }}>특이사항</p>
              </div>
              <textarea
                value={memoContent}
                onChange={(e) => setMemoContent(e.target.value)}
                placeholder="특이사항을 입력하세요"
                rows={3}
                className="w-full rounded-xl py-3 px-4 outline-none resize-none"
                style={{ border: '1px solid rgba(112,115,124,0.22)', fontSize: '14px', color: 'var(--wds-fg-neutral-primary)', backgroundColor: 'white' }}
              />
              {memoError && (
                <p style={{ fontSize: '12px', color: 'var(--wds-fg-status-negative)', marginTop: '4px' }}>{memoError}</p>
              )}
              <button
                onClick={handleSaveMemo}
                disabled={memoSaving || memoContent === currentMemo}
                className="w-full rounded-xl py-2.5 mt-2 disabled:opacity-40"
                style={{ backgroundColor: 'var(--wds-bg-accent-primary)', color: '#ffffff', fontSize: '14px', fontWeight: 600 }}
              >
                {memoSaving ? '저장 중...' : '특이사항 저장'}
              </button>
            </div>

          </div>
        </Modal>
      )}
    </div>
  )
}
