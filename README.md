# 프로젝트 개요

👨🏼‍💻 목표:

- 국내외 마라톤 일정을 한눈에 확인할 수 있고, 날짜별 / 지역별 / 카테고리별로 필터링 가능한 웹 & 앱을 제작.

🏃🏼‍♂️ 핵심 기능:

- 마라톤 일정 리스트 (날짜, 대회명, 지역, 링크, 접수 기간)
- 상세 페이지 (주최, 장소, 참가비, 코스, 지도, 사진 등)
- 즐겨찾기 / 알림 기능
- 일정 캘린더 보기 (월간/주간)
- 반응형 웹 + 모바일 앱(WebView 기반)

🎯 목적:

- 마라톤 정보를 찾기 어렵고 흩어져 있는 문제를 해결
- 전국 및 지역별 대회 일정을 한곳에 모아 제공
- 접수일 알림, 후기 공유, 코스 정보 등 러너를 위한 통합 허브 구축

🍳 사용 스킬:

- [Next.js documentation](https://nextjs.org/docs/app/getting-started)
- [shadcn documentaion](https://ui.shadcn.com/docs/installation/next)
- [supabase documentaion](https://supabase.com/docs/reference/javascript/introduction)
- [tailwindcss documentaion](https://tailwindcss.com/docs/installation/using-vite)
- [lucide icons](https://lucide.dev/)

<br>
<br>

## 🧩 1. 기획 단계 (Planning)  

- 기본 기능에 충실 — 마라톤 일정 확인 및 접수 중심.
- 필요한 데이터 구조(Supabase 테이블)와 화면 흐름만 명확히 정의.
- Next.js + Supabase 기반 MVP 범위 확정.

## 🎨 2. 디자인 단계 (Design)  

- 모던하고 심플한 인터페이스, 리스트 중심 레이아웃.
- 색상·폰트·컴포넌트 일관성 확보로 깔끔한 UI 구성.
- 모바일 우선(반응형) 설계로 앱과 웹 일체감 유지.

## 💻 3. 개발 단계 (Development)  

- Next.js로 웹, React Native(WebView)로 앱 동시 제작.
- Supabase 연동으로 일정 데이터 CRUD 및 Auth 구현.
- Tailwind + Shadcn UI로 빠른 컴포넌트 개발.

## 🧪 4. 테스트 단계 (Testing)  

- 리스트·필터·상세 이동 등 주요 기능 점검.
- 모바일/PC/앱 환경별 반응형 및 속도 테스트.
- Supabase API 및 알림 기능 정상 작동 확인.

## 🚀 5. 배포 단계 (Deployment)  

- 웹은 Vercel로 자동 배포, 앱은 Expo EAS 빌드.
- 도메인(runzoa.kr) 연결 및 환경변수 설정 완료.
- App Store / Play Store 등록 및 기본 SEO 세팅.

## 🎯 6. 운영 & 업데이트 (Operation)  

- 크론으로 마라톤 일정 자동 갱신 및 상태 업데이트.
- 알림 스케줄 관리(접수 시작/마감 기준).
- 피드백 기반으로 후기·코스 정보 등 점진적 기능 확장.

<br>
<br>

### Getting Started

Next.js 프로젝트 생성

```bash
npx create-next-app@latest ./
```

Shadcn

```bash
npx shadcn@latest init
```

supabase

```bash
npm install @supabase/supabase-js @supabase/ssr
```

필요한 기능 추가

```bash
npm install -g tsx
npm install dotenv

npx shadcn@latest add button
npx shadcn@latest add sheet
npx shadcn@latest add scroll-area
npx shadcn@latest add dialog
npx shadcn@latest add card
npx shadcn@latest add table
npx shadcn@latest add input
npx shadcn@latest add badge
npx shadcn@latest add textarea
```

### env

```bash
# Supabase
NEXT_PUBLIC_SUPABASE_URL=your-supabase-url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key

# 네이버 지도 API
NEXT_PUBLIC_NAVER_MAP_CLIENT_ID=your-naver-map-client-id
NEXT_PUBLIC_NAVER_MAP_CLIENT_SECRET=your-naver-map-client-secret
```

### Json

```json
{
  "name": "",
  "slug": "",
  "description": "",
  "scale": 15000,
  "highlights": ["서울"],
  "registration": {
    "start": "2025-09-09 09:00",
    "end": "",
    "status": "접수마감",
    "text": "선착순 마감",
    "site": ""
  },
  "event": {
    "date": "2025-10-26",
    "start_time": "09:00"
  },
  "location": {
    "text": "",
    "latitude": 37.526496,
    "longitude": 126.922867
  },
  "price": {
    "10km": 60000
  },
  "hosts": {
    "organizer": "",
    "operator": "",
    "sponsor": [""],
    "souvenir": [""]
  },
  "images": {
    "main": "",
    "sub": [""]
  },
  "contacts": {
    "home": "",
    "tel": "",
    "email": "",
    "instagram": "",
    "kakao": ""
  }
}
```

### Table

```sql
CREATE TABLE marathons (
  id BIGSERIAL PRIMARY KEY,                      -- 고유 ID
  name TEXT NOT NULL,                            -- 대회명
  slug TEXT UNIQUE NOT NULL,                     -- 슬러그 (URL용 고유 식별자)
  description TEXT,                              -- 설명
  scale TEXT,                                    -- 대회 규모
  highlights JSONB,                              -- 주요 포인트 (하이라이트)
  registration JSONB,                            -- 접수 정보 (기간, 방법 등)
  event JSONB,                                   -- 대회 일정 및 코스 정보
  location JSONB,                                -- 위치 정보 (지역, 좌표 등)
  price JSONB,                                   -- 참가비 정보
  hosts JSONB,                                   -- 주최/주관 정보
  images JSONB,                                  -- 이미지 (대표, 썸네일 등)
  contacts JSONB,                                -- 연락처 정보
  comment_count INT DEFAULT 0 NOT NULL,          -- 댓글 수
  view_count INT DEFAULT 0 NOT NULL,             -- 조회 수
  created_at TIMESTAMPTZ DEFAULT NOW()           -- 생성 시각
);
```

```sql
CREATE TABLE comments (
  id INT GENERATED ALWAYS AS IDENTITY PRIMARY KEY,                                  -- 고유 ID
  marathon_id INT NOT NULL REFERENCES public.marathons(id) ON DELETE CASCADE,       -- 연결된 마라톤 ID
  name TEXT DEFAULT '익명' NOT NULL,                                                 -- 작성자 이름
  content VARCHAR(255) NOT NULL,                                                    -- 댓글 내용
  created_at TIMESTAMPTZ DEFAULT NOW() NOT NULL                                     -- 작성 시각
);
```

```sql
CREATE TABLE contact (
  id BIGSERIAL PRIMARY KEY,                     -- 고유 ID
  name TEXT NOT NULL,                           -- 이름
  email TEXT NOT NULL,                          -- 이메일
  message TEXT NOT NULL,                        -- 문의 내용
  status TEXT DEFAULT 'pending',                -- 처리 상태
  created_at TIMESTAMPTZ DEFAULT NOW(),         -- 작성 시각
  updated_at TIMESTAMPTZ DEFAULT NOW()          -- 수정 시각
);
```

### Deploy on Vercel

### Deploy on AWS
