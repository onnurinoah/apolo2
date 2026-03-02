# APOLO 2

전도 대상자 관리, 변증 답변, 예배 초대, 기도문 생성을 하나로 묶은 Next.js 앱입니다.

## 핵심 구조

- `내 전도`: 전도 대상자 저장, 상태 관리, 기도 기록
- `변증답변`: AI 자유 질문 + 질문 DB 탐색
- `예배초대`: 카카오톡용 초대 메시지 생성
- `기도문`: 개인 기도문 생성 + 기도제목 나눔

## 로컬 실행

```bash
npm install
npm run dev
```

브라우저에서 `http://localhost:3000`을 열면 됩니다.

## 환경변수

`.env.local` 파일을 만들고 아래 값을 넣으면 AI 생성이 활성화됩니다.

```bash
OPENAI_API_KEY=your_openai_api_key
```

키가 없으면 앱은 내장 fallback 템플릿으로 동작합니다.

## 배포

이 앱은 GitHub Pages가 아니라 **Vercel 배포**가 맞습니다.

이유:

- Next.js App Router 사용
- `/api/*` 서버 라우트 사용
- OpenAI 서버 호출 사용
- 정적 export 전용 앱이 아님

### Vercel 배포 절차

1. [Vercel](https://vercel.com/)에 로그인
2. GitHub 저장소 `onnurinoah/apolo2` import
3. Framework Preset: `Next.js` 확인
4. Environment Variables에 `OPENAI_API_KEY` 추가
5. Deploy 실행

기본 설정으로도 배포 가능합니다.

### 권장 Vercel 설정

- Build Command: `next build`
- Install Command: `npm install`
- Output Directory: 비워두기
- Node.js Runtime: 기본값 사용

## 현재 제약

- `내 전도`, `기도제목 나눔`은 현재 localStorage 기반입니다.
- 즉, 브라우저/기기별로 데이터가 분리됩니다.
- 실제 다자간 공유를 하려면 Supabase 같은 백엔드 연동이 다음 단계입니다.

## 다음 단계

1. Supabase로 `기도제목 나눔` 실시간 공유화
2. 로그인 기반 대상자 동기화
3. `오늘의 전도 액션` 대시보드 추가

