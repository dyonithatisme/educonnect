// Design Ref: §2.2 Data Flow — 클라이언트 사이드 이미지 압축 (< 500KB)
// Plan SC: SC-7 — 이미지 업로드 클라이언트 압축 적용
import imageCompression from 'browser-image-compression'

export const MAX_FILE_SIZE_KB = 500

export async function compressImage(file: File): Promise<File> {
  const options = {
    maxSizeMB: MAX_FILE_SIZE_KB / 1024,
    maxWidthOrHeight: 1920,
    useWebWorker: true,
    fileType: file.type as 'image/jpeg' | 'image/png' | 'image/webp',
  }
  return imageCompression(file, options)
}

export function validateImageFile(file: File): string | null {
  const allowed = ['image/jpeg', 'image/png', 'image/webp']
  if (!allowed.includes(file.type)) {
    return 'JPG, PNG, WEBP 형식의 이미지만 업로드할 수 있습니다.'
  }
  return null
}
