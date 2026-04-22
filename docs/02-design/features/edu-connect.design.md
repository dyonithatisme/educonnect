# EduConnect MVP Design Document

> **Summary**: Next.js + Supabase 기반 교육 출석·질문 관리 웹 앱 MVP 설계
>
> **Project**: EduConnect
> **Version**: 0.1.0
> **Author**: 운영팀
> **Date**: 2026-04-22
> **Status**: Draft
> **Planning Doc**: [edu-connect.plan.md](../01-plan/features/edu-connect.plan.md)

### Pipeline References

| Phase | Document | Status |
|-------|----------|--------|
| Phase 1 | Schema Definition | N/A |
| Phase 2 | Coding Conventions | N/A |
| Phase 3 | Mockup | N/A |
| Phase 4 | API Spec | 본 문서 §4 |

---

## Context Anchor

> Copied from Plan document. Ensures strategic context survives Design→Do handoff.

| Key | Value |
|-----|-------|
| **WHY** | 수기 출석·분산 질문 대응으로 인한 운영 비효율 해소 |
| **WHO** | 교육생(약 100명, 분과 1~10), 운영진(Admin) |
| **RISK** | 동시 접속(100명) 부하 / 사진 업로드 속도 / 카카오 OAuth 구성 복잡도 |
| **SUCCESS** | 출석 제출 성공률 100% / 질문 답변 운영진 응답시간 단축 / 관리자 대시보드 실시간 반영 |
| **SCOPE** | 1단계: 회원가입+출석 → 2단계: 출석 대시보드 → 3단계: 질문 → 4단계: 질문 관리 |

---

## 1. Overview

### 1.1 Design Goals

- Supabase Auth/DB/Storage를 최대한 활용하여 커스텀 백엔드 코드 최소화
- Next.js App Router 기반 교육생/관리자 영역 라우트 분리
- 모바일 우선 UI — 교육생은 주로 스마트폰으로 접근
- RLS(Row Level Security)로 데이터 격리, 서버사이드 로직 최소화

### 1.2 Design Principles

- **BaaS-First**: Supabase 자동 생성 REST API 적극 활용, 커스텀 API Route는 최소화
- **Mobile-First**: Tailwind 반응형으로 모바일 레이아웃 우선 설계
- **Role-Based Routing**: 교육생 / 관리자 레이아웃 완전 분리 (`(student)` / `(admin)` route group)

---

## 2. Architecture Options

### 2.0 Architecture Comparison

| Criteria | Option A: Minimal | Option B: Clean | Option C: Pragmatic |
|----------|:-:|:-:|:-:|
| **Approach** | Pages Router + 단순 fetch | 엄격한 레이어 분리 (domain/app/infra) | App Router + feature 폴더 + Supabase SDK |
| **New Files** | ~15 | ~40 | ~25 |
| **Modified Files** | - | - | - |
| **Complexity** | Low | High | Medium |
| **Maintainability** | Low | High | High |
| **Effort** | Low | High | Medium |
| **Risk** | 확장 어려움 | 과설계 우려 (단기 서비스) | 균형 잡힌 구조 |
| **Recommendation** | 빠른 프로토타입 | 장기 운영 시스템 | **MVP 기본 선택** |

**Selected**: Option C — Pragmatic Balance
**Rationale**: 단기 운영 서비스이지만 4단계 기능 확장이 예정되어 있어 feature 폴더 구조로 유지보수성 확보. 엄격한 레이어 분리는 불필요.

### 2.1 Component Diagram

```
┌─────────────────────────────────────────────────────────────┐
│  Browser (모바일/데스크톱)                                     │
│  ┌──────────────┐   ┌──────────────────────────────────┐   │
│  │  교육생 화면   │   │         관리자 화면               │   │
│  │  /student/*  │   │         /admin/*                 │   │
│  └──────┬───────┘   └──────────────┬───────────────────┘   │
└─────────┼──────────────────────────┼───────────────────────┘
          │ Next.js App Router        │
          ▼                          ▼
┌─────────────────────────────────────────────────────────────┐
│  Next.js Server (Vercel)                                    │
│  ┌────────────────────┐  ┌─────────────────────────────┐   │
│  │  Server Components │  │  API Routes (최소화)         │   │
│  │  (데이터 페칭)      │  │  /api/admin/* (권한 체크)    │   │
│  └────────────────────┘  └─────────────────────────────┘   │
└───────────────────────────────┬─────────────────────────────┘
                                │ Supabase SDK
                                ▼
┌─────────────────────────────────────────────────────────────┐
│  Supabase (BaaS)                                            │
│  ┌──────────┐  ┌──────────┐  ┌──────────────────────────┐  │
│  │   Auth   │  │ Postgres │  │  Storage                 │  │
│  │ (Google/ │  │  (RLS)   │  │  (attendance-photos)     │  │
│  │  Email)  │  │          │  │                          │  │
│  └──────────┘  └──────────┘  └──────────────────────────┘  │
└─────────────────────────────────────────────────────────────┘
```

### 2.2 Data Flow

```
[교육생 출석 체크]
브라우저에서 이미지 선택
  → 클라이언트 사이드 이미지 압축 (< 500KB)
  → Supabase Storage에 직접 업로드
  → 업로드 URL 획득
  → Supabase DB (attendance 테이블) INSERT
  → 성공 화면 표시

[관리자 대시보드]
관리자 로그인 확인
  → Supabase DB에서 출석 데이터 조회 (RLS 우회: service role)
  → 분과별 집계 처리 (서버 컴포넌트)
  → 대시보드 렌더링
```

### 2.3 Dependencies

| Component | Depends On | Purpose |
|-----------|-----------|---------|
| 출석 체크 페이지 | Supabase Storage, Supabase DB | 사진 업로드 + 출석 기록 |
| 관리자 대시보드 | Supabase DB (service role) | 전체 출석 현황 조회 |
| 질문/답변 | Supabase DB (RLS) | 교육생 본인 데이터 격리 |
| 인증 | Supabase Auth | Google OAuth + 이메일 |

---

## 3. Data Model

### 3.1 Entity Definition

```typescript
// Supabase 테이블 기반 TypeScript 타입

// profiles 테이블 (Supabase auth.users와 연동)
interface Profile {
  id: string;           // auth.users.id (UUID)
  name: string;         // 교육생 이름
  group_number: number; // 분과 번호 (1~10)
  role: 'student' | 'admin';
  created_at: string;
}

// attendance 테이블
interface Attendance {
  id: string;
  user_id: string;      // profiles.id 참조
  date: string;         // YYYY-MM-DD (당일 날짜)
  image_url: string;    // Supabase Storage URL
  created_at: string;
}

// questions 테이블
interface Question {
  id: string;
  user_id: string;
  category: 'attendance' | 'education' | 'accommodation' | 'health' | 'other';
  content: string;
  status: 'pending' | 'answered';
  created_at: string;
}

// answers 테이블
interface Answer {
  id: string;
  question_id: string;
  content: string;
  created_at: string;
}

// admin_memos 테이블
interface AdminMemo {
  id: string;
  user_id: string;      // 교육생 profiles.id
  memo: string;
  updated_at: string;
}
```

### 3.2 Entity Relationships

```
[profiles] 1 ──── N [attendance]
     │
     └── 1 ──── N [questions] 1 ──── 1 [answers]
     │
     └── 1 ──── 1 [admin_memos]
```

### 3.3 Database Schema (Supabase SQL)

```sql
-- profiles (auth.users 트리거로 자동 생성)
CREATE TABLE profiles (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  group_number INTEGER NOT NULL CHECK (group_number BETWEEN 1 AND 10),
  role TEXT NOT NULL DEFAULT 'student' CHECK (role IN ('student', 'admin')),
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- attendance
CREATE TABLE attendance (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  date DATE NOT NULL DEFAULT CURRENT_DATE,
  image_url TEXT NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE (user_id, date)   -- 하루 1회 제한
);

-- questions
CREATE TABLE questions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  category TEXT NOT NULL CHECK (category IN ('attendance','education','accommodation','health','other')),
  content TEXT NOT NULL,
  status TEXT NOT NULL DEFAULT 'pending' CHECK (status IN ('pending','answered')),
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- answers
CREATE TABLE answers (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  question_id UUID NOT NULL REFERENCES questions(id) ON DELETE CASCADE UNIQUE,
  content TEXT NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- admin_memos
CREATE TABLE admin_memos (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE UNIQUE,
  memo TEXT NOT NULL DEFAULT '',
  updated_at TIMESTAMPTZ DEFAULT NOW()
);
```

### 3.4 RLS Policies

```sql
-- profiles RLS
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;
-- 교육생: 본인만 조회
CREATE POLICY "student_select_own" ON profiles FOR SELECT USING (auth.uid() = id);
-- 교육생: 가입 시 INSERT (트리거 처리)
-- 관리자: 전체 조회 (service role 또는 role 체크)

-- attendance RLS
ALTER TABLE attendance ENABLE ROW LEVEL SECURITY;
CREATE POLICY "student_own_attendance" ON attendance FOR ALL USING (auth.uid() = user_id);
-- 관리자 전체 조회는 service role key 사용 (서버사이드)

-- questions RLS
ALTER TABLE questions ENABLE ROW LEVEL SECURITY;
CREATE POLICY "student_own_questions" ON questions FOR ALL USING (auth.uid() = user_id);

-- answers RLS (교육생은 본인 질문의 답변만 조회)
ALTER TABLE answers ENABLE ROW LEVEL SECURITY;
CREATE POLICY "student_view_own_answers" ON answers FOR SELECT
  USING (question_id IN (SELECT id FROM questions WHERE user_id = auth.uid()));
```

---

## 4. API Specification

### 4.1 Supabase 자동 생성 엔드포인트

Supabase는 테이블 생성 시 REST API를 자동 생성한다. 별도 구현 불필요.

| Method | Endpoint | Description | Auth |
|--------|----------|-------------|------|
| GET | `/rest/v1/profiles?id=eq.{id}` | 내 프로필 조회 | anon key + RLS |
| POST | `/rest/v1/attendance` | 출석 등록 | anon key + RLS |
| GET | `/rest/v1/attendance?user_id=eq.{id}&date=eq.{today}` | 오늘 출석 여부 확인 | anon key + RLS |
| POST | `/rest/v1/questions` | 질문 등록 | anon key + RLS |
| GET | `/rest/v1/questions?user_id=eq.{id}` | 내 질문 목록 | anon key + RLS |

### 4.2 커스텀 API Routes (Next.js)

서버사이드에서 service role key가 필요한 관리자 기능만 API Route로 구현.

#### `GET /api/admin/attendance`

관리자 전체 출석 현황 조회 (service role key 사용)

**Response (200 OK):**
```json
{
  "data": {
    "total": 100,
    "submitted": 73,
    "by_group": [
      { "group_number": 1, "total": 10, "submitted": 8, "rate": 80.0 },
      ...
    ],
    "missing_users": [
      { "id": "uuid", "name": "홍길동", "group_number": 3 }
    ],
    "ranking": [
      { "group_number": 5, "rate": 100.0, "rank": 1 }
    ]
  }
}
```

#### `GET /api/admin/questions`

관리자 질문 리스트 조회

**Query Params**: `category`, `status`, `page`, `limit`

**Response (200 OK):**
```json
{
  "data": [
    {
      "id": "uuid",
      "user": { "name": "김철수", "group_number": 2 },
      "category": "accommodation",
      "content": "숙소 와이파이 비밀번호 알 수 있나요?",
      "status": "pending",
      "created_at": "2026-04-22T09:00:00Z",
      "answer": null
    }
  ],
  "pagination": { "total": 15, "page": 1, "limit": 20 }
}
```

#### `POST /api/admin/questions/{id}/answer`

답변 작성 + 질문 상태 변경

**Request:**
```json
{ "content": "와이파이 비밀번호는 educamp2026입니다." }
```

**Response (201 Created):**
```json
{ "id": "uuid", "question_id": "uuid", "content": "...", "created_at": "..." }
```

**Error Responses:**
- `401 Unauthorized`: 관리자가 아닌 경우
- `409 Conflict`: 이미 답변이 존재하는 경우

#### `PUT /api/admin/students/{id}/memo`

교육생 메모 작성/수정 (upsert)

**Request:**
```json
{ "memo": "3분과 리더, 건강 이상 여부 확인 필요" }
```

**Response (200 OK):**
```json
{ "user_id": "uuid", "memo": "...", "updated_at": "..." }
```

---

## 5. UI/UX Design

### 5.1 Screen Layout

#### 교육생 — 출석 체크 페이지

```
┌─────────────────────────┐
│  EduConnect    [로그아웃] │
├─────────────────────────┤
│  📸 오늘의 출석 미션      │
│                         │
│  "오늘 아침 출석미션을    │
│   대강당에서 확인하세요!" │
│                         │
│  ┌─────────────────────┐│
│  │                     ││
│  │   사진 업로드 영역    ││
│  │   (클릭 또는 드래그)  ││
│  │                     ││
│  └─────────────────────┘│
│                         │
│  [📷 사진 선택하기]      │
│                         │
│  [✅ 출석 제출하기]      │
│                         │
│  ── 오늘 이미 제출했습니다 ──│
└─────────────────────────┘
```

#### 관리자 — 출석 대시보드

```
┌──────────────────────────────────────────┐
│  EduConnect Admin    2026-04-22          │
├──────────────────────────────────────────┤
│  📊 전체 출석현황: 73/100 (73%)           │
│                                          │
│  ┌─── 분과별 완료율 ─────────────────────┐│
│  │ 1분과 ████████░░ 80%                 ││
│  │ 2분과 ██████████ 100%  🏆 1위        ││
│  │ 3분과 ██████░░░░ 60%                 ││
│  └───────────────────────────────────────┘│
│                                          │
│  ┌─── 출석 이미지 Grid ───────────────── ┐│
│  │ [img][img][img][img][img]            ││
│  │ [img][img][img]...                   ││
│  └──────────────────────────────────────┘│
│                                          │
│  ┌─── 미출석자 (27명) ─────────────────── ┐│
│  │ 홍길동 (3분과) / 이영희 (5분과)...    ││
│  └──────────────────────────────────────┘│
└──────────────────────────────────────────┘
```

### 5.2 User Flow

```
[교육생]
홈 → 로그인/회원가입 → 출석 페이지 → 사진 업로드 → 제출 완료
                    → 질문 페이지 → 질문 작성 → 제출
                                 → 내 질문 목록 → 답변 확인 팝업

[관리자]
로그인 → 대시보드 → 출석 현황 (분과별/미출석/이미지그리드)
               → 질문 관리 (필터 → 답변 작성)
               → 교육생 관리 (검색/필터 → 메모 작성)
```

### 5.3 Component List

| Component | Location | Responsibility |
|-----------|----------|----------------|
| `AttendanceUploader` | `components/features/attendance/` | 사진 선택, 압축, 업로드 |
| `AttendanceGrid` | `components/features/admin/` | 분과별 출석 이미지 그리드 |
| `GroupCompletionBar` | `components/features/admin/` | 분과별 완료율 바 차트 |
| `MissingUserList` | `components/features/admin/` | 미출석자 리스트 |
| `QuestionForm` | `components/features/questions/` | 카테고리 선택 + 질문 텍스트 |
| `QuestionList` | `components/features/questions/` | 내 질문 목록 (교육생용) |
| `AdminQuestionTable` | `components/features/admin/` | 질문 관리 테이블 (관리자용) |
| `AnswerModal` | `components/features/admin/` | 답변 작성 모달 |
| `StudentTable` | `components/features/admin/` | 교육생 리스트 + 메모 |
| `AnswerNotificationPopup` | `components/ui/` | 답변 알림 팝업 |
| `GroupFilter` | `components/ui/` | 분과 필터 드롭다운 |

### 5.4 Page UI Checklist

#### 회원가입 페이지 (`/register`)

- [ ] Input: 이름 텍스트 필드 (필수)
- [ ] Select: 분과 드롭다운 (1~10 선택, 필수)
- [ ] Button: Google로 시작하기
- [ ] Button: 이메일로 시작하기
- [ ] Text: 안내 문구 ("운영진에게 등록된 이름을 입력하세요")

#### 로그인 페이지 (`/login`)

- [ ] Button: Google로 로그인
- [ ] Input: 이메일 필드
- [ ] Input: 비밀번호 필드
- [ ] Button: 이메일 로그인
- [ ] Link: 회원가입으로 이동

#### 교육생 출석 페이지 (`/attendance`)

- [ ] Text: 안내 문구 ("오늘 아침 출석미션을 대강당에서 확인하세요!")
- [ ] Area: 사진 업로드 영역 (클릭 가능)
- [ ] Input: 파일 선택 input (accept="image/*", capture="environment")
- [ ] Preview: 선택한 이미지 미리보기
- [ ] Button: 출석 제출하기 (사진 선택 후 활성화)
- [ ] State: 이미 제출 완료 상태 표시 (오늘 제출 시 버튼 비활성화)
- [ ] Text: 제출 시간 표시 (제출 완료 후)

#### 교육생 질문 페이지 (`/questions`)

- [ ] Select: 카테고리 드롭다운 (근태/교육운영/숙소/건강/기타)
- [ ] Textarea: 질문 내용 입력 (필수, 최대 500자)
- [ ] Button: 질문 제출
- [ ] List: 내 질문 목록 (카테고리, 상태 배지, 내용, 날짜)
- [ ] Badge: 답변 상태 (미답변/답변완료)
- [ ] Popup: 새 답변 알림 팝업 (로그인 시 미확인 답변 있을 경우)
- [ ] Modal: 답변 내용 확인 모달

#### 관리자 출석 대시보드 (`/admin/attendance`)

- [ ] Text: 전체 제출 현황 (N/100, N%)
- [ ] Chart: 분과별 완료율 바 (1~10분과, 완료율 %)
- [ ] Badge: 1위 분과 표시 (게임 요소, 🏆)
- [ ] Grid: 출석 완료 이미지 그리드 (분과별 탭 또는 전체)
- [ ] List: 미출석자 리스트 (이름, 분과)
- [ ] Text: 실시간 기준 시간 표시

#### 관리자 질문 관리 페이지 (`/admin/questions`)

- [ ] Filter: 카테고리 필터 (전체/근태/교육운영/숙소/건강/기타)
- [ ] Filter: 상태 필터 (전체/미답변/답변완료)
- [ ] Table: 질문 리스트 (작성자, 분과, 카테고리, 내용 요약, 시간, 상태)
- [ ] Badge: 답변 상태 배지 (색상 구분)
- [ ] Button: 답변 작성 버튼 (미답변 항목에만)
- [ ] Modal: 답변 작성 모달 (질문 전문 + 답변 textarea + 저장 버튼)

#### 관리자 교육생 관리 페이지 (`/admin/students`)

- [ ] Input: 이름 검색 필드
- [ ] Filter: 분과 필터 드롭다운 (1~10 + 전체)
- [ ] Table: 교육생 리스트 (이름, 분과, 오늘 출석 상태, 메모 미리보기)
- [ ] Badge: 출석 상태 배지 (출석완료/미출석, 색상 구분)
- [ ] Button: 메모 편집 버튼 (행별)
- [ ] Modal: 메모 작성/수정 모달 (textarea + 저장)

---

## 6. Error Handling

### 6.1 Error Code Definition

| Code | Message | Cause | Handling |
|------|---------|-------|----------|
| 400 | 입력값을 확인해주세요 | 유효성 검사 실패 | 필드별 에러 메시지 표시 |
| 401 | 로그인이 필요합니다 | 미인증 접근 | 로그인 페이지로 리다이렉트 |
| 403 | 권한이 없습니다 | 교육생이 관리자 페이지 접근 | 홈으로 리다이렉트 |
| 409 | 오늘 이미 출석을 제출했습니다 | attendance UNIQUE 제약 | 출석 완료 상태 표시 |
| 413 | 이미지 파일이 너무 큽니다 | 클라이언트 압축 후에도 초과 | 재시도 안내 |
| 500 | 서버 오류가 발생했습니다 | Supabase 오류 | 재시도 toast 알림 |

### 6.2 Error Response Format

```typescript
// API Route 에러 형식
{
  "error": {
    "code": "ALREADY_SUBMITTED",
    "message": "오늘 이미 출석을 제출했습니다"
  }
}
```

### 6.3 전역 에러 처리 패턴

```typescript
// 클라이언트: react-hot-toast 활용
try {
  await submitAttendance(data)
  toast.success('출석이 완료되었습니다!')
} catch (error) {
  toast.error(getErrorMessage(error))
}
```

---

## 7. Security Considerations

- [x] Supabase RLS — 교육생은 본인 데이터만 접근 (SELECT/INSERT/UPDATE)
- [x] 관리자 API Route — `service_role` key는 서버사이드에서만 사용 (SUPABASE_SERVICE_ROLE_KEY)
- [x] 관리자 접근 제어 — middleware에서 `role === 'admin'` 검사
- [x] 이미지 파일 검증 — MIME type 확인 (image/jpeg, image/png, image/webp만 허용)
- [x] 이미지 압축 — 클라이언트에서 < 500KB 압축 후 업로드 (업로드 용량 제한)
- [x] HTTPS 강제 — Vercel 배포 시 자동 적용
- [x] Storage 버킷 — 퍼블릭 읽기 허용 (출석 이미지 URL로 관리자 조회), 쓰기는 인증 사용자만

---

## 8. Test Plan

### 8.1 Test Scope

| Type | Target | Tool | Phase |
|------|--------|------|-------|
| L1: API Tests | Supabase REST + 커스텀 API Routes | curl / Playwright request | Do |
| L2: UI Action Tests | 출석 업로드, 질문 등록, 답변 모달 | Playwright | Do |
| L3: E2E Scenario Tests | 교육생 출석 전체 플로우, 관리자 답변 플로우 | Playwright | Do |

### 8.2 L1: API Test Scenarios

| # | Endpoint | Method | Test Description | Expected Status | Expected Response |
|---|----------|--------|-----------------|:--------------:|-------------------|
| 1 | `/rest/v1/attendance` | POST | 출석 정상 제출 | 201 | `id` 존재 |
| 2 | `/rest/v1/attendance` (중복) | POST | 같은 날 2번 제출 | 409 | UNIQUE 제약 오류 |
| 3 | `/api/admin/attendance` | GET | 관리자 전체 출석 조회 | 200 | `data.total`, `data.by_group` 배열 |
| 4 | `/api/admin/attendance` (비관리자) | GET | 교육생이 접근 | 401 | `error.code = UNAUTHORIZED` |
| 5 | `/rest/v1/questions` | POST | 질문 정상 등록 | 201 | `id`, `status = pending` |
| 6 | `/api/admin/questions/{id}/answer` | POST | 답변 작성 | 201 | `question_id` 존재 |
| 7 | `/api/admin/questions/{id}/answer` (중복) | POST | 이미 답변된 질문 | 409 | `ALREADY_ANSWERED` |

### 8.3 L2: UI Action Test Scenarios

| # | Page | Action | Expected Result | Data Verification |
|---|------|--------|----------------|-------------------|
| 1 | 출석 페이지 | 이미지 선택 | 미리보기 표시 | 파일 선택 input 동작 |
| 2 | 출석 페이지 | 출석 제출 | 성공 메시지 toast | attendance 테이블에 레코드 존재 |
| 3 | 출석 페이지 | 재방문 (제출 후) | "이미 제출" 상태 표시 | 제출 버튼 비활성화 |
| 4 | 질문 페이지 | 카테고리 없이 제출 | 유효성 오류 표시 | 제출 차단 |
| 5 | 질문 페이지 | 정상 제출 | 질문 목록에 추가 | status = pending |
| 6 | 관리자 질문 | 카테고리 필터 클릭 | 해당 카테고리만 표시 | 필터 적용 결과 |
| 7 | 관리자 질문 | 답변 작성 제출 | 상태 배지 → 답변완료 | answers 테이블 레코드 |

### 8.4 L3: E2E Scenario Test Scenarios

| # | Scenario | Steps | Success Criteria |
|---|----------|-------|-----------------|
| 1 | 교육생 전체 플로우 | 회원가입 → 로그인 → 출석 제출 → 질문 등록 | 출석/질문 DB 저장 확인 |
| 2 | 관리자 답변 플로우 | 관리자 로그인 → 질문 목록 → 답변 작성 → 교육생 로그인 → 팝업 확인 | 답변 팝업 노출 |
| 3 | 권한 분리 확인 | 교육생으로 /admin/* 접근 시도 | 홈으로 리다이렉트 |
| 4 | 출석 중복 방지 | 출석 제출 → 동일 날짜 재제출 시도 | 제출 버튼 비활성화 or 에러 |

### 8.5 Seed Data Requirements

| Entity | Minimum Count | Key Fields Required |
|--------|:------------:|---------------------|
| profiles (student) | 10 | name, group_number(1~5), role=student |
| profiles (admin) | 1 | name, role=admin |
| attendance | 7 | user_id, date=today, image_url |
| questions | 5 | user_id, category, content, status=pending |

---

## 9. Clean Architecture

### 9.1 Layer Structure (Dynamic Level)

| Layer | Responsibility | Location |
|-------|---------------|----------|
| **Presentation** | 페이지, UI 컴포넌트, 훅 | `src/app/`, `src/components/` |
| **Application** | 비즈니스 로직, 데이터 변환 | `src/features/*/hooks/`, `src/lib/` |
| **Domain** | TypeScript 타입, 상수 | `src/types/` |
| **Infrastructure** | Supabase 클라이언트, API 호출 | `src/lib/supabase/`, `src/app/api/` |

### 9.2 This Feature's Layer Assignment

| Component | Layer | Location |
|-----------|-------|----------|
| `AttendanceUploader` | Presentation | `src/components/features/attendance/` |
| `useAttendance` | Application | `src/features/attendance/hooks/` |
| `Attendance`, `Profile` 타입 | Domain | `src/types/index.ts` |
| `createClient()` | Infrastructure | `src/lib/supabase/client.ts` |
| `createServerClient()` | Infrastructure | `src/lib/supabase/server.ts` |

---

## 10. Coding Convention Reference

### 10.1 Naming Conventions

| Target | Rule | Example |
|--------|------|---------|
| Components | PascalCase | `AttendanceUploader`, `QuestionForm` |
| Functions | camelCase | `submitAttendance()`, `getQuestions()` |
| Constants | UPPER_SNAKE_CASE | `MAX_FILE_SIZE`, `CATEGORIES` |
| Types/Interfaces | PascalCase | `Profile`, `Question` |
| Files (component) | PascalCase.tsx | `AttendanceUploader.tsx` |
| Files (utility) | camelCase.ts | `compressImage.ts` |
| Folders | kebab-case | `attendance/`, `admin-questions/` |

### 10.2 Environment Variables

| Variable | Purpose | Scope |
|----------|---------|-------|
| `NEXT_PUBLIC_SUPABASE_URL` | Supabase 프로젝트 URL | Client |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY` | 공개 익명 키 | Client |
| `SUPABASE_SERVICE_ROLE_KEY` | 관리자 서버사이드 키 | Server only |

---

## 11. Implementation Guide

### 11.1 File Structure

```
src/
├── app/
│   ├── (auth)/
│   │   ├── login/page.tsx
│   │   └── register/page.tsx
│   ├── (student)/
│   │   ├── layout.tsx           # 교육생 레이아웃 + 인증 체크
│   │   ├── home/page.tsx
│   │   ├── attendance/page.tsx
│   │   └── questions/page.tsx
│   ├── (admin)/
│   │   ├── layout.tsx           # 관리자 레이아웃 + role 체크
│   │   ├── dashboard/page.tsx
│   │   ├── attendance/page.tsx
│   │   ├── questions/page.tsx
│   │   └── students/page.tsx
│   └── api/
│       └── admin/
│           ├── attendance/route.ts
│           ├── questions/[id]/answer/route.ts
│           └── students/[id]/memo/route.ts
├── components/
│   ├── ui/
│   │   ├── Button.tsx
│   │   ├── Modal.tsx
│   │   ├── Badge.tsx
│   │   └── AnswerNotificationPopup.tsx
│   └── features/
│       ├── attendance/
│       │   ├── AttendanceUploader.tsx
│       │   └── AttendanceStatus.tsx
│       ├── questions/
│       │   ├── QuestionForm.tsx
│       │   └── QuestionList.tsx
│       └── admin/
│           ├── AttendanceGrid.tsx
│           ├── GroupCompletionBar.tsx
│           ├── MissingUserList.tsx
│           ├── AdminQuestionTable.tsx
│           ├── AnswerModal.tsx
│           └── StudentTable.tsx
├── lib/
│   ├── supabase/
│   │   ├── client.ts            # 브라우저용 클라이언트
│   │   └── server.ts            # 서버용 클라이언트
│   └── utils/
│       └── compressImage.ts     # 이미지 압축 유틸
└── types/
    └── index.ts                 # Profile, Attendance, Question, Answer, AdminMemo
```

### 11.2 Implementation Order

1. [ ] TypeScript 타입 정의 (`src/types/index.ts`)
2. [ ] Supabase 클라이언트 설정 (`src/lib/supabase/`)
3. [ ] Supabase DB 스키마 + RLS 정책 적용
4. [ ] Supabase Storage 버킷 생성 (attendance-photos)
5. [ ] 인증 플로우 (회원가입/로그인 페이지)
6. [ ] middleware.ts (교육생/관리자 라우트 보호)
7. [ ] 이미지 압축 유틸 (`compressImage.ts`)
8. [ ] 출석 체크 기능 (AttendanceUploader + page)
9. [ ] 질문/답변 기능 (교육생 측)
10. [ ] 관리자 API Routes
11. [ ] 관리자 출석 대시보드
12. [ ] 관리자 질문 관리 페이지
13. [ ] 관리자 교육생 관리 페이지
14. [ ] 답변 알림 팝업

### 11.3 Session Guide

#### Module Map

| Module | Scope Key | Description | Estimated Turns |
|--------|-----------|-------------|:---------------:|
| 인프라 & 인증 | `module-1` | Supabase 설정, 타입, 회원가입/로그인, middleware | 40-50 |
| 출석 기능 | `module-2` | 이미지 압축, 업로드, 출석 체크 페이지, 관리자 대시보드 | 40-50 |
| 질문/답변 기능 | `module-3` | 질문 등록, 목록, 관리자 답변, 알림 팝업 | 30-40 |
| 교육생 관리 | `module-4` | 교육생 리스트, 메모, 검색/필터 | 20-30 |

#### Recommended Session Plan

| Session | Phase | Scope | Turns |
|---------|-------|-------|:-----:|
| Session 1 | Plan + Design | 전체 (현재) | 30-35 |
| Session 2 | Do | `--scope module-1` (인프라 & 인증) | 40-50 |
| Session 3 | Do | `--scope module-2` (출석 기능) | 40-50 |
| Session 4 | Do | `--scope module-3,module-4` (질문 + 교육생관리) | 40-50 |
| Session 5 | Check + Report | 전체 | 30-40 |

---

## Version History

| Version | Date | Changes | Author |
|---------|------|---------|--------|
| 0.1 | 2026-04-22 | Initial draft (Plan 기반 자동 생성, Option C 선택) | 운영팀 |
