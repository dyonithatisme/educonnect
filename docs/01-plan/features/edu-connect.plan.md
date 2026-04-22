# EduConnect MVP Planning Document

> **Summary**: 대규모 오프라인 교육 운영을 위한 출석·질문 관리 웹 앱 MVP
>
> **Project**: EduConnect
> **Version**: 0.1.0
> **Author**: 운영팀
> **Date**: 2026-04-22
> **Status**: Draft

---

## Executive Summary

| Perspective | Content |
|-------------|---------|
| **Problem** | 약 100명 규모 오프라인 교육에서 수기 출석 관리, 분산된 질문 대응으로 운영 효율이 극히 낮다 |
| **Solution** | Next.js + Supabase 기반 웹 앱으로 사진 출석 자동화 및 질문 중앙 집중 관리 시스템 구축 |
| **Function/UX Effect** | 교육생은 모바일 브라우저에서 30초 내 출석 완료, 운영진은 실시간 대시보드로 현황 파악 |
| **Core Value** | 운영진 수작업 제거 + 교육생 경험 통일 → 교육 집중도 향상 |

---

## Context Anchor

> Auto-generated from Executive Summary. Propagated to Design/Do documents for context continuity.

| Key | Value |
|-----|-------|
| **WHY** | 수기 출석·분산 질문 대응으로 인한 운영 비효율 해소 |
| **WHO** | 교육생(약 100명, 분과 1~10), 운영진(Admin) |
| **RISK** | 동시 접속(100명) 부하 / 사진 업로드 속도 / 카카오 OAuth 구성 복잡도 |
| **SUCCESS** | 출석 제출 성공률 100% / 질문 답변 운영진 응답시간 단축 / 관리자 대시보드 실시간 반영 |
| **SCOPE** | 1단계: 회원가입+출석 → 2단계: 출석 대시보드 → 3단계: 질문 → 4단계: 질문 관리 |

---

## 1. Overview

### 1.1 Purpose

약 100명이 참여하는 오프라인 교육 캠프에서 운영진과 교육생 간 커뮤니케이션 효율을 높인다.
수기 출석 체크와 개인 채널로 분산되는 질문을 중앙화하여 운영 리소스를 절감한다.

### 1.2 Background

- 교육 기간 동안 하루 1회 출석 체크가 필요하나 수기 관리 시 누락·오기 위험
- 운영진 개인 연락처로 질문이 분산되어 대응 누락 및 중복 답변 발생
- 교육 종료 후 전체 데이터 삭제가 예정된 단기 운영 서비스 (데이터 보존 필요 없음)

### 1.3 Related Documents

- PRD: [edu_connect_prd.md](../../edu_connect_prd.md)

---

## 2. Scope

### 2.1 In Scope

- [x] 회원가입 (이름, 분과 선택, 소셜/이메일 로그인)
- [x] 로그인 (Google, 이메일; 카카오는 추후 검토)
- [x] 교육생 출석 체크 (사진 1장 업로드, 하루 1회 제한)
- [x] 교육생 질문 등록 (카테고리 선택 + 텍스트)
- [x] 교육생 본인 질문/답변 조회 (답변 팝업 알림)
- [x] 관리자 출석 현황 대시보드 (분과별 그리드, 미출석자, 완료율, 순위)
- [x] 관리자 질문 리스트 및 답변 작성
- [x] 관리자 교육생 리스트 (메모, 필터, 검색)

### 2.2 Out of Scope

- 카카오 OAuth (초기 MVP에서 제외 — Supabase 기본 지원 밖, 별도 구현 필요)
- 공지사항 기능
- QR 코드 출석
- AI 질문 분류
- 모바일 앱 (네이티브)
- 출결 부정행위 자동 감지 (운영 통제로 대응)

---

## 3. Requirements

### 3.1 Functional Requirements

| ID | Requirement | Priority | Status |
|----|-------------|----------|--------|
| FR-01 | 교육생 회원가입: 이름, 분과(1~10), Google/이메일 로그인 선택 | High | Pending |
| FR-02 | 가입 완료 시 자동 로그인 처리 | High | Pending |
| FR-03 | 출석 체크: 사진 1장 업로드 + 하루 1회 제한 | High | Pending |
| FR-04 | 출석 제출 시 날짜·시간 자동 저장 | High | Pending |
| FR-05 | 질문 등록: 카테고리(근태/교육운영/숙소/건강/기타) + 내용 텍스트 | High | Pending |
| FR-06 | 교육생 본인 질문만 조회 가능 | High | Pending |
| FR-07 | 답변 등록 시 교육생 로그인 후 팝업 알림 | Medium | Pending |
| FR-08 | 관리자 출석 대시보드: 분과별 이미지 그리드, 미출석자 리스트, 완료율(%), 전체 순위 | High | Pending |
| FR-09 | 관리자 질문 리스트: 카테고리 필터, 작성자/시간/내용/상태 표시 | High | Pending |
| FR-10 | 관리자 질문 답변 작성 및 상태 변경 (미답변/답변완료) | High | Pending |
| FR-11 | 관리자 교육생 리스트: 이름/분과/출석상태/메모 + 분과 필터 + 검색 | Medium | Pending |
| FR-12 | 관리자 교육생 메모 작성/수정 | Medium | Pending |
| FR-13 | 관리자 페이지는 별도 로그인 (admin 계정 분리) | High | Pending |

### 3.2 Non-Functional Requirements

| Category | Criteria | Measurement Method |
|----------|----------|-------------------|
| Performance | 출석 사진 업로드 < 5초 (이미지 클라이언트 압축 적용) | Lighthouse / 수동 테스트 |
| Performance | 페이지 초기 로드 < 3초 (모바일 기준) | Lighthouse Mobile |
| Concurrency | 동시 100명 접속 시 정상 동작 | Supabase 기본 tier 확인 |
| Availability | 교육 기간(단기) 중 99% 가용성 | Vercel + Supabase 기본 SLA |
| Security | 교육생은 본인 데이터만 접근 (RLS 적용) | Supabase RLS Policy |
| Usability | 모바일 브라우저(iOS Safari, Android Chrome) 에서 정상 동작 | 수동 디바이스 테스트 |
| Data Retention | 교육 종료 후 전체 데이터 삭제 (운영진 수동 실행) | 관리자 삭제 기능 or Supabase 직접 삭제 |

---

## 4. Success Criteria

### 4.1 Definition of Done

- [x] FR-01 ~ FR-13 모든 기능 구현 완료
- [x] Supabase RLS Policy로 교육생 데이터 격리 적용
- [x] 모바일 Safari/Chrome에서 출석 사진 업로드 동작 확인
- [x] 관리자 대시보드 실시간(새로고침 기준) 출석 현황 반영
- [x] 빌드 에러 없음, TypeScript 타입 에러 없음

### 4.2 Quality Criteria

- [x] ESLint 에러 0건
- [x] 핵심 API 엔드포인트 응답 코드 정상 (200/201/400/401)
- [x] Supabase Storage 버킷 퍼블릭 접근 정책 확인
- [x] 이미지 업로드 클라이언트 사이드 압축 (< 500KB) 적용

---

## 5. Risks and Mitigation

| Risk | Impact | Likelihood | Mitigation |
|------|--------|------------|------------|
| 카카오 OAuth 미지원 (Supabase 기본) | Medium | High | MVP에서 Google + 이메일로 제한, 카카오는 2차 개발 |
| 동시 100명 사진 업로드 부하 | High | Medium | 클라이언트 이미지 압축 (< 500KB), Supabase Storage CDN 활용 |
| 출석 부정행위 (대리 제출) | Medium | Medium | 운영 통제로 대응, QR 연동은 향후 확장 아이디어 |
| 교육 당일 서비스 장애 | High | Low | Vercel/Supabase 기본 SLA 확인, 비상 수기 대비책 준비 |
| 관리자 권한 오남용 | Medium | Low | Supabase RLS + 관리자 계정 수동 부여 방식 |
| 이미지 스토리지 용량 초과 | Low | Low | 하루 100장 × 교육 기간 예상, Supabase 무료 tier 1GB 이내 |

---

## 6. Impact Analysis

### 6.1 Changed Resources

| Resource | Type | Change Description |
|----------|------|--------------------|
| User 테이블 | DB Schema | 신규 생성: id, name, group(1~10), role(user/admin), login_type, created_at |
| Attendance 테이블 | DB Schema | 신규 생성: id, user_id, date, image_url, created_at |
| Question 테이블 | DB Schema | 신규 생성: id, user_id, category, content, status, created_at |
| Answer 테이블 | DB Schema | 신규 생성: id, question_id, content, created_at |
| AdminMemo 테이블 | DB Schema | 신규 생성: id, user_id, memo, updated_at |
| Supabase Storage | 파일 저장소 | attendance-photos 버킷 신규 생성 |

### 6.2 Current Consumers

신규 프로젝트이므로 기존 소비자 없음. 초기 설계 단계.

### 6.3 Verification

- [x] RLS 정책으로 교육생은 본인 데이터만 접근 가능함을 확인
- [x] 관리자 role 기반 접근 제어 설계 검토 완료

---

## 7. Architecture Considerations

### 7.1 Project Level Selection

| Level | Characteristics | Recommended For | Selected |
|-------|-----------------|-----------------|:--------:|
| **Starter** | Simple structure (`components/`, `lib/`, `types/`) | Static sites, portfolios, landing pages | ☐ |
| **Dynamic** | Feature-based modules, BaaS integration (Supabase) | Web apps with backend, SaaS MVPs, fullstack apps | ☑ |
| **Enterprise** | Strict layer separation, DI, microservices | High-traffic systems, complex architectures | ☐ |

**선택: Dynamic** — 단기 운영 MVP, Supabase BaaS 활용, 빠른 개발 속도 필요

### 7.2 Key Architectural Decisions

| Decision | Options | Selected | Rationale |
|----------|---------|----------|-----------|
| Framework | Next.js / React / Vue | Next.js (App Router) | PRD 명시, SSR + API Route 지원 |
| Backend | Supabase / Firebase / Custom | Supabase | PRD 명시, 인증+DB+Storage 통합 |
| Styling | Tailwind / CSS Modules | Tailwind CSS | 빠른 UI 개발, 모바일 대응 용이 |
| State Management | Context / Zustand / React Query | Zustand + React Query | 서버 상태(RQ) + 클라이언트 상태(Zustand) 분리 |
| Form Handling | react-hook-form / formik / native | react-hook-form + zod | 유효성 검사 타입 안전성 |
| Image Upload | 직접 업로드 / Presigned URL | Supabase Storage SDK | 클라이언트에서 직접 Supabase Storage로 |
| Auth | Supabase Auth | Supabase Auth | Google OAuth + 이메일 내장 지원 |

### 7.3 Folder Structure Preview

```
src/
├── app/
│   ├── (auth)/                # 로그인/회원가입 레이아웃
│   │   ├── login/
│   │   └── register/
│   ├── (student)/             # 교육생 영역
│   │   ├── home/
│   │   ├── attendance/
│   │   └── questions/
│   ├── (admin)/               # 관리자 영역
│   │   ├── dashboard/
│   │   ├── attendance/
│   │   ├── questions/
│   │   └── students/
│   └── api/                   # API Routes (서버사이드 로직)
├── components/
│   ├── ui/                    # 공통 UI 컴포넌트
│   └── features/              # 기능별 컴포넌트
│       ├── attendance/
│       ├── questions/
│       └── admin/
├── lib/
│   ├── supabase/              # Supabase 클라이언트
│   └── utils/                 # 유틸리티
└── types/                     # TypeScript 타입 정의
```

---

## 8. Convention Prerequisites

### 8.1 Existing Project Conventions

- [ ] `CLAUDE.md` 에 코딩 컨벤션 섹션 추가 예정
- [ ] `tsconfig.json` — Next.js 기본 설정
- [ ] `eslint.config.js` — Next.js 기본 설정
- [ ] `.prettierrc` — 별도 설정 예정

### 8.2 Conventions to Define/Verify

| Category | Current State | To Define | Priority |
|----------|---------------|-----------|:--------:|
| **Naming** | 미정 | PascalCase(컴포넌트), camelCase(함수/변수), kebab-case(폴더) | High |
| **Folder structure** | 미정 | feature-based 구조 (위 7.3 기준) | High |
| **Import order** | 미정 | external → internal → relative → types → styles | Medium |
| **Environment variables** | 미정 | NEXT_PUBLIC_ 접두사 규칙 | Medium |
| **Error handling** | 미정 | try/catch + toast 알림 패턴 | Medium |

### 8.3 Environment Variables Needed

| Variable | Purpose | Scope | To Be Created |
|----------|---------|-------|:-------------:|
| `NEXT_PUBLIC_SUPABASE_URL` | Supabase 프로젝트 URL | Client | ☐ |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY` | Supabase 익명 키 | Client | ☐ |
| `SUPABASE_SERVICE_ROLE_KEY` | 관리자 작업용 서비스 키 | Server only | ☐ |

---

## 9. Next Steps

1. [ ] 디자인 문서 작성 (`edu-connect.design.md`)
2. [ ] Supabase 프로젝트 생성 및 스키마 설정
3. [ ] Next.js 프로젝트 초기화
4. [ ] RLS 정책 설계 및 적용
5. [ ] 1단계(회원가입 + 출석) 구현 시작

---

## Version History

| Version | Date | Changes | Author |
|---------|------|---------|--------|
| 0.1 | 2026-04-22 | Initial draft (PRD 기반 자동 생성) | 운영팀 |
