// Design Ref: §5.4 관리자 질문 관리 페이지 UI Checklist
import AdminQuestionTable from '@/components/features/admin/AdminQuestionTable'

export default function AdminQuestionsPage() {
  return (
    <div className="flex flex-col gap-6">
      <h2 style={{ fontSize: '22px', fontWeight: 700, letterSpacing: '-0.0194em', color: 'var(--wds-fg-neutral-primary)' }}>
        질문 관리
      </h2>
      <AdminQuestionTable />
    </div>
  )
}
