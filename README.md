# PROCPA Blog

한국공인회계사 이재현의 개인 블로그 / 지식 데이터베이스 ([procpa.co.kr](https://procpa.co.kr))

회계·재무 전문성과 AI 생산성을 주제로 한 콘텐츠를 제공합니다.

## Tech Stack

- **Framework**: Next.js 16 (App Router, Turbopack)
- **Content**: Velite (Markdown/MDX → typed JSON)
- **Styling**: Tailwind CSS v4 + shadcn/ui
- **Deploy**: Vercel

## Getting Started

```bash
npm install
npm run dev
```

`npm run dev` 실행 시 Velite 콘텐츠 빌드가 자동으로 선행됩니다.

## Commands

| Command | Description |
|---|---|
| `npm run dev` | 개발 서버 (Velite 자동 빌드 + Next.js Turbopack) |
| `npm run build` | 프로덕션 빌드 |
| `npm run content` | Velite 콘텐츠 빌드 (1회) |
| `npm run content:watch` | Velite watch 모드 (콘텐츠 편집 시) |
| `npm run lint` | ESLint |

## Content Structure

Obsidian에서 마크다운을 작성하고 `content/` 폴더에 배치하면 Velite가 빌드 시 자동으로 처리합니다.

```
content/
├── 00. 인사이트/              # 독립 포스트 (depth 2 지원)
├── 01. 회계실무/
│   └── 01. ICFR/             # 서브카테고리 → 시리즈/포스트
├── 02. AI&생산성/
│   └── 01. AI 활용/          # 서브카테고리 → 시리즈/포스트
├── 03. 개발/
│   ├── 01. Web, App/
│   └── 02. MCP/
└── downloads/                 # 자료실 (Velite 컬렉션)
```

### Collections

| Collection | Pattern | Description |
|---|---|---|
| **posts** | `*/*.md`, `*/*/*.md` | 독립 블로그 글 |
| **series** | `*/*/*/index.md` | 시리즈(ebook) 메타 |
| **chapters** | `*/*/*/**/*.md` | 시리즈 내 챕터 |
| **downloads** | `downloads/*.md` | 자료실 첨부파일 |

### Category Auto-Mapping

폴더명에서 카테고리 키가 자동 추출됩니다 (번호 접두사 제거 + 소문자화):

| Folder | Category Key | URL |
|---|---|---|
| `00. 인사이트` | `인사이트` | `/인사이트` |
| `01. 회계실무` | `회계실무` | `/회계실무` |
| `02. AI&생산성` | `ai-생산성` | `/ai-생산성` |
| `03. 개발` | `개발` | `/개발` |

새 카테고리 추가 시 `content/` 아래에 폴더를 만들면 자동 인식됩니다. UI 라벨과 정렬 순서는 `src/lib/topics.ts`에 등록합니다.

## Project Structure

```
src/
├── app/                      # Next.js App Router pages
│   ├── [...slug]/            # 카테고리/포스트/시리즈/챕터 (catch-all)
│   ├── downloads/            # 자료실
│   ├── explore/              # 탐색 (faceted search)
│   ├── graph/                # 지식 그래프
│   ├── search/               # 고급 검색
│   └── api/og/               # OG 이미지 생성
├── components/
│   ├── mdx/                  # MDX 컴포넌트 (Callout, FileDownload)
│   ├── vault/                # INDEX 사이드바 트리
│   ├── graph/                # 그래프 시각화
│   └── ui/                   # shadcn/ui primitives
├── lib/
│   ├── topics.ts             # 카테고리 라벨/순서 정의
│   ├── vault-tree.ts         # 사이드바 트리 빌드
│   ├── search.ts             # 검색 데이터 소스
│   └── velite/               # Velite 플러그인 (wiki-link, callout, graph)
└── ...
```

## Adding Content

### Post

`content/<카테고리>/파일명.md` 또는 `content/<카테고리>/<서브카테고리>/파일명.md`:

```yaml
---
title: 글 제목
description: 요약 (300자 이내)
date: 2026-04-13
tags: [태그1, 태그2]
---
```

### Series

`content/<카테고리>/<서브카테고리>/<시리즈명>/index.md`로 시리즈 메타 생성 후, 같은 폴더에 챕터 파일 배치.

### Download

1. `public/files/`에 파일 저장
2. `content/downloads/xxx.md` 작성:

```yaml
---
title: 자료 이름
description: 설명
file: /files/파일명.xlsx
category: ai-생산성
tags: [태그1, 태그2]
date: 2026-04-13
---
```

## License

Private repository. All rights reserved.
