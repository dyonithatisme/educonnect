import type { Metadata } from 'next'
import './globals.css'

export const metadata: Metadata = {
  title: 'EduConnect',
  description: '교육 출석·질문 관리 시스템',
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="ko" className="h-full">
      <body className="min-h-full flex flex-col">{children}</body>
    </html>
  )
}
