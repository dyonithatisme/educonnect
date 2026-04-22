'use client'

import { useState, useRef } from 'react'
import { compressImage, validateImageFile } from '@/lib/utils/compressImage'
import { Camera, CheckCircle, Upload } from 'lucide-react'
import type { Attendance } from '@/types'

interface Props {
  userId: string
  existingAttendance: Attendance | null
}

export default function AttendanceUploader({ userId, existingAttendance }: Props) {
  const inputRef = useRef<HTMLInputElement>(null)

  const [preview, setPreview] = useState<string | null>(null)
  const [selectedFile, setSelectedFile] = useState<File | null>(null)
  const [uploading, setUploading] = useState(false)
  const [submitted, setSubmitted] = useState<Attendance | null>(existingAttendance)
  const [error, setError] = useState('')

  function handleFileChange(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0]
    if (!file) return

    const validationError = validateImageFile(file)
    if (validationError) {
      setError(validationError)
      return
    }

    setError('')
    setSelectedFile(file)
    setPreview(URL.createObjectURL(file))
  }

  async function handleSubmit() {
    if (!selectedFile || uploading) return
    setUploading(true)
    setError('')

    try {
      const compressed = await compressImage(selectedFile)

      const formData = new FormData()
      formData.append('file', compressed, `photo.${compressed.type.split('/')[1] || 'jpg'}`)

      const res = await fetch('/api/attendance/upload', {
        method: 'POST',
        body: formData,
      })

      const json = await res.json()

      if (!res.ok) {
        if (res.status === 409) {
          setError('오늘 이미 출석을 제출했습니다.')
        } else {
          setError(json.error || '업로드 중 오류가 발생했습니다. 다시 시도해주세요.')
        }
        return
      }

      setSubmitted(json.data)
      setPreview(null)
      setSelectedFile(null)
    } catch (err) {
      console.error(err)
      setError('업로드 중 오류가 발생했습니다. 다시 시도해주세요.')
    } finally {
      setUploading(false)
    }
  }

  if (submitted) {
    return (
      <div
        className="rounded-2xl p-6 flex flex-col items-center gap-3 text-center"
        style={{ backgroundColor: 'var(--wds-bg-status-positive-subtle)', border: '1px solid rgba(112,115,124,0.22)' }}
      >
        <CheckCircle size={48} style={{ color: 'var(--wds-fg-status-positive)' }} strokeWidth={1.75} />
        <div>
          <p style={{ fontSize: '17px', fontWeight: 700, color: 'var(--wds-fg-neutral-primary)' }}>
            출석 완료
          </p>
          <p style={{ fontSize: '14px', color: 'var(--wds-fg-neutral-assistive)', marginTop: '4px' }}>
            {new Date(submitted.created_at).toLocaleTimeString('ko-KR', { hour: '2-digit', minute: '2-digit' })} 제출
          </p>
        </div>
        {submitted.image_url && (
          <img
            src={submitted.image_url}
            alt="제출한 출석 사진"
            className="w-full max-w-xs rounded-xl object-cover"
            style={{ aspectRatio: '4/3', border: '1px solid rgba(112,115,124,0.22)' }}
          />
        )}
      </div>
    )
  }

  return (
    <div className="flex flex-col gap-4">
      <div
        className="rounded-2xl overflow-hidden cursor-pointer flex flex-col items-center justify-center"
        style={{
          border: '1px solid rgba(112,115,124,0.22)',
          backgroundColor: preview ? 'transparent' : 'var(--wds-bg-neutral-subtle)',
          minHeight: '240px',
        }}
        onClick={() => inputRef.current?.click()}
      >
        {preview ? (
          <img
            src={preview}
            alt="선택한 이미지 미리보기"
            className="w-full h-full object-cover"
            style={{ maxHeight: '320px' }}
          />
        ) : (
          <div className="flex flex-col items-center gap-3 p-8">
            <Camera size={40} style={{ color: 'var(--wds-fg-neutral-assistive)' }} strokeWidth={1.75} />
            <p style={{ fontSize: '15px', color: 'var(--wds-fg-neutral-assistive)', textAlign: 'center' }}>
              사진 업로드 영역<br />
              <span style={{ fontSize: '13px' }}>클릭하여 사진 선택</span>
            </p>
          </div>
        )}
      </div>

      {/* 파일 input — accept=image/*, capture=environment (모바일 카메라 직접 열기) */}
      <input
        ref={inputRef}
        type="file"
        accept="image/*"
        capture="environment"
        className="hidden"
        onChange={handleFileChange}
      />

      <button
        type="button"
        onClick={() => inputRef.current?.click()}
        className="w-full flex items-center justify-center gap-2 rounded-xl py-3"
        style={{
          border: '1px solid rgba(112,115,124,0.22)',
          fontSize: '15px',
          fontWeight: 600,
          color: 'var(--wds-fg-neutral-primary)',
          backgroundColor: 'var(--wds-bg-page)',
        }}
      >
        <Camera size={18} strokeWidth={1.75} />
        사진 선택하기
      </button>

      {error && (
        <p style={{ fontSize: '13px', color: 'var(--wds-fg-status-negative)' }}>{error}</p>
      )}

      <button
        type="button"
        onClick={handleSubmit}
        disabled={!selectedFile || uploading}
        className="w-full flex items-center justify-center gap-2 rounded-xl py-3 transition-opacity disabled:opacity-40"
        style={{
          backgroundColor: 'var(--wds-bg-accent-primary)',
          color: '#ffffff',
          fontSize: '15px',
          fontWeight: 600,
        }}
      >
        <Upload size={18} strokeWidth={1.75} />
        {uploading ? '제출 중...' : '출석 제출하기'}
      </button>
    </div>
  )
}
