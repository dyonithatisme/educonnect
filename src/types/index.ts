// Design Ref: §3.1 Data Model — Supabase table-based TypeScript types

export interface Profile {
  id: string
  name: string
  group_number: number
  role: 'student' | 'admin'
  created_at: string
}

export interface Attendance {
  id: string
  user_id: string
  date: string
  image_url: string
  created_at: string
}

export interface Question {
  id: string
  user_id: string
  category: 'attendance' | 'education' | 'accommodation' | 'health' | 'other'
  content: string
  status: 'pending' | 'answered'
  created_at: string
}

export interface Answer {
  id: string
  question_id: string
  content: string
  created_at: string
}

export interface AdminMemo {
  id: string
  user_id: string
  memo: string
  updated_at: string
}

export type QuestionCategory = Question['category']
export type QuestionStatus = Question['status']
export type UserRole = Profile['role']

export interface QuestionWithUser extends Question {
  user: Pick<Profile, 'name' | 'group_number'>
  answer: Answer | null
}

export interface AttendanceSummary {
  total: number
  submitted: number
  by_group: GroupSummary[]
  missing_users: Pick<Profile, 'id' | 'name' | 'group_number'>[]
  ranking: GroupRanking[]
}

export interface GroupSummary {
  group_number: number
  total: number
  submitted: number
  rate: number
}

export interface GroupRanking {
  group_number: number
  rate: number
  rank: number
}

export interface ApiError {
  code: string
  message: string
}

export interface ApiResponse<T> {
  data: T
}

export interface PaginatedResponse<T> {
  data: T[]
  pagination: {
    total: number
    page: number
    limit: number
  }
}
