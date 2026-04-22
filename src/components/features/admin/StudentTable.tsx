'use client'

// Design Ref: §5.3 StudentTable — 교육생 리스트 + 메모
// Design Ref: §5.4 관리자 교육생 관리 페이지 UI Checklist
// Plan SC: FR-11, FR-12 — 교육생 리스트, 메모, 검색/필터

import { useState, useMemo } from 'react'
import Badge from '@/components/ui/Badge'
import Modal from '@/components/ui/Modal'
import { Search, ChevronDown, Pencil } from 'lucide-react'
import type { Profile, AdminMemo } from '@/types'

interface StudentRow extends Profile {
  admin_memos: AdminMemo[]
  hasAttendanceToday: boolean
}

interface Props {
  students: StudentRow[]
}

const GROUPS = ['전체', ...Array.from({ length: 10 }, (_, i) => String(i + 1))]

export default function StudentTable({ students }: Props) {
  const [search, setSearch] = useState('')
  const [groupFilter, setGroupFilter] = useState('전체')
  const [memoTarget, setMemoTarget] = useState<StudentRow | null>(null)
  const [memoContent, setMemoContent] = useState('')
  const [memoSaving, setMemoSaving] = useState(false)
  const [memoError, setMemoError] = useState('')
  const [localMemos, setLocalMemos] = useState<Record<string, string>>({})

  const filtered = useMemo(() => {
    return students.filter((s) => {
      const matchGroup = groupFilter === '전체' || s.group_number === parseInt(groupFilter)
      const matchSearch = !search || s.name.includes(search)
      return matchGroup && matchSearch
    })
  }, [students, search, groupFilter])

  function openMemoModal(student: StudentRow) {
    const existing = localMemos[student.id] ?? student.admin_memos[0]?.memo ?? ''
    setMemoContent(existing)
    setMemoError('')
    setMemoTarget(student)
  }

  async function handleSaveMemo() {
    if (!memoTarget) return
    setMemoSaving(true)
    setMemoError('')

    const res = await fetch(`/api/admin/students/${memoTarget.id}/memo`, {
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

    setLocalMemos((prev) => ({ ...prev, [memoTarget.id]: memoContent }))
    setMemoTarget(null)
    setMemoSaving(false)
  }

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
            style={{ border: '1px solid rgba(112,115,124,0.22)', fontSize: '14px', color: 'var(--wds-fg-neutral-primary)', backgroundColor: 'white' }}
          />
        </div>
        <div className="relative">
          <select
            value={groupFilter}
            onChange={(e) => setGroupFilter(e.target.value)}
            className="appearance-none rounded-xl py-2 pl-3 pr-8 outline-none"
            style={{ border: '1px solid rgba(112,115,124,0.22)', fontSize: '14px', color: 'var(--wds-fg-neutral-primary)', backgroundColor: 'white' }}
          >
            {GROUPS.map((g) => <option key={g} value={g}>{g === '전체' ? '전체 분과' : `${g}분과`}</option>)}
          </select>
          <ChevronDown className="absolute right-2 top-1/2 -translate-y-1/2 pointer-events-none" size={14} style={{ color: 'var(--wds-fg-neutral-assistive)' }} />
        </div>
      </div>

      <p style={{ fontSize: '13px', color: 'var(--wds-fg-neutral-assistive)' }}>{filtered.length}명</p>

      {/* 리스트 */}
      <div className="rounded-2xl overflow-hidden" style={{ border: '1px solid rgba(112,115,124,0.22)' }}>
        {filtered.map((s, i) => {
          const memoText = localMemos[s.id] ?? s.admin_memos[0]?.memo ?? ''
          return (
            <div
              key={s.id}
              className="flex items-center gap-3 px-4 py-3 bg-white"
              style={{ borderTop: i > 0 ? '1px solid rgba(112,115,124,0.22)' : undefined }}
            >
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 mb-0.5">
                  <span style={{ fontSize: '15px', fontWeight: 600, color: 'var(--wds-fg-neutral-primary)' }}>{s.name}</span>
                  <span style={{ fontSize: '13px', color: 'var(--wds-fg-neutral-assistive)' }}>{s.group_number}분과</span>
                  <Badge variant={s.hasAttendanceToday ? 'present' : 'absent'} />
                </div>
                {memoText && (
                  <p style={{ fontSize: '12px', color: 'var(--wds-fg-neutral-assistive)', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                    {memoText}
                  </p>
                )}
              </div>
              <button
                onClick={() => openMemoModal(s)}
                className="flex-shrink-0 p-2 rounded-xl"
                style={{ border: '1px solid rgba(112,115,124,0.22)', color: 'var(--wds-fg-neutral-assistive)' }}
              >
                <Pencil size={16} strokeWidth={1.75} />
              </button>
            </div>
          )
        })}
        {filtered.length === 0 && (
          <div className="p-8 text-center bg-white" style={{ fontSize: '14px', color: 'var(--wds-fg-neutral-assistive)' }}>
            검색 결과가 없습니다.
          </div>
        )}
      </div>

      {/* 메모 모달 */}
      {memoTarget && (
        <Modal open title={`${memoTarget.name} 메모`} onClose={() => setMemoTarget(null)}>
          <div className="flex flex-col gap-3">
            <textarea
              value={memoContent}
              onChange={(e) => setMemoContent(e.target.value)}
              placeholder="메모를 입력하세요"
              rows={4}
              className="w-full rounded-xl py-3 px-4 outline-none resize-none"
              style={{ border: '1px solid rgba(112,115,124,0.22)', fontSize: '15px', color: 'var(--wds-fg-neutral-primary)' }}
            />
            {memoError && <p style={{ fontSize: '13px', color: 'var(--wds-fg-status-negative)' }}>{memoError}</p>}
            <button
              onClick={handleSaveMemo}
              disabled={memoSaving}
              className="w-full rounded-xl py-3 disabled:opacity-40"
              style={{ backgroundColor: 'var(--wds-bg-accent-primary)', color: '#ffffff', fontSize: '15px', fontWeight: 600 }}
            >
              {memoSaving ? '저장 중...' : '저장'}
            </button>
          </div>
        </Modal>
      )}
    </div>
  )
}
