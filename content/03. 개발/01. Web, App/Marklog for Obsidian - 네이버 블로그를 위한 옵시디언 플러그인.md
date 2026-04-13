---
title: "Marklog for Obsidian - 네이버 블로그를 위한 옵시디언 플러그인"
type: post
index: []
tags: []
date_created: "2026-02-23"
date_modified: "2026-02-23"
status: draft
description: ""
thumbnail: ""
date: "2026-01-12"
---
안녕하세요, **생산적 회계사(PROCPA)** 입니다.

기존에 개발했던 [Marklog 웹 서비스](https://marklog.procpa.co.kr)는 마크다운을 네이버 블로그 호환 HTML로 변환해주는 훌륭한 도구였지만, **옵시디언** 사용자 입장에서는 조금 아쉬움이 남았습니다. "전체 복사 →  웹으로 이동 → 붙여넣기 → 변환 → 다시 복사"라는 과정이 흐름을 끊었기 때문이죠.

그래서 **옵시디언** 안에서 모든 걸 끝낼 수 있는 **Marklog 플러그인**을 제작해봤습니다.

이번 글에서는 React로 만들어진 웹 앱을 옵시디언 플러그인으로 변환하여 배포하기까지의 개발 과정을 공유합니다.

![](https://i.imgur.com/KEHiJB4.png)



---
## 1. 개발 과정

### 1.1. 프로젝트 구조 개편(Monorepo)

가장 먼저 한 일은 기존 React 웹 프로젝트와 새로운 옵시디언 플러그인을 한 곳에서 관리하도록 구조를 바꾸는 것이었습니다. 핵심 변환 로직(`convertToNaverHtml`)을 두 프로젝트가 공유해야 했기 때문입니다.

**변경 전:**
```bash
Markdown2Naver/
├── src/ (React Web App)
├── package.json
```

**변경 후:**
```bash
Markdown2Naver/
├── web-app/         # 기존 React 프로젝트 이동
├── obsidian-plugin/ # 신규 플러그인 프로젝트
│   ├── src/
│   ├── main.ts
│   └── manifest.json
└── README.md        # 통합 문서
```

이렇게 구조를 잡으니 `styleConverter.ts`와 같은 핵심 로직 파일을 효율적으로 관리할 수 있었습니다. 

### 1.2. 핵심 로직 이식

웹 앱의 핵심은 `styleConverter.ts`였습니다. 이 파일은 `marked.js`로 마크다운을 파싱하고, 네이버 블로그가 허용하는 인라인 스타일(Inline CSS)을 주입합니다. 이 로직을 옵시디언 환경(Node.js + Electron)으로 가져오는 과정에서 몇 가지 난관이 있었습니다.

제가 겪은 문제와 해결책을 표로 정리해 보았습니다.

| 문제 현상 (Problem) | 해결 방법 (Solution)                                                       |
| :-------------- | :--------------------------------------------------------------------- |
| **DOM 의존성**     | 브라우저 전용 API 대신 `DOMPurify` 설정을 조정하고, 옵시디언 내부의 DOM Parser 활용            |
| **외부 CSS 차단**   | 네이버는 외부 CSS를 막으므로, 모든 스타일을 태그 내 `style="..."` 속성(Inline Style)으로 직접 주입 |
| **코드 블록 깨짐**    | `highlight.js` 스타일을 인라인으로 강제 변환하여 `pre`, `code` 태그에 배경색과 폰트 스타일 고정     |
| **줄간격 부조화**     | 헤더(H1~H5)와 본문의 `line-height`를 분리하여 가독성 높은 최적의 줄간격 값 적용                 |

### 1.3. 설정(Settings) UI 구현

가장 공을 들인 부분은 **사용자 설정(Settings)** 입니다.  단순히 기능을 제공하는 것을 넘어, '쓰기 편한' UI를 만드는 데 집중했습니다.

- **폰트 선택**: 드롭다운 메뉴를 도입하여 '나눔고딕', '마루부리', '나눔스퀘어' 등 네이버 블로그와 호환되는 폰트만 선택하게 제한했습니다.
- **색상 선택**: `addColorPicker`를 도입하여 눈으로 보고 색상을 고를 수 있게 변경했습니다.
- **디테일한 설정**: H1부터 H5까지 제목 수준별로 크기와 색상을 다르게 설정할 수 있도록 하고, 인용구와 테이블 스타일까지 커스터마이징 범위를 넓혔습니다.

```typescript
// 코드 예시: 폰트 설정 드롭다운 구현
new Setting(containerEl)
    .setName('기본 폰트')
    .addDropdown(dropdown => dropdown
        .addOption('"NanumSquare", sans-serif', '나눔스퀘어')
        .addOption('"MaruBuri", serif', '마루부리')
        .setValue(this.plugin.settings.global.fontFamily)
        .onChange(async (val) => { ... }));
```

### 1.4. 배포

마지막으로 누구나 쉽게 사용할 수 있도록 패키징 작업을 마쳤습니다.
- **빌드**: `esbuild`로 코드를 번들링하여 `main.js` 생성
- **배포**: GitHub Releases를 통해 배포 파일(`main.js`, `manifest.json`, `styles.css`) 공유

아직 옵시디언 커뮤니티 플러그인 목록에는 등록되지 않았지만, `BRAT` 플러그인을 통하거나 파일을 직접 넣는 방식으로 바로 사용할 수 있습니다.

> 옵시디언 커뮤니티 플러그인 신청은 해놨는데 채택 될 수 있을지는 모르겠습니다..

## 2. 설치 방법

현재 이 플러그인은 옵시디언 커뮤니티 플러그인 목록에 등록되지 않았으므로, 수동으로 설치해야 합니다. (또는 `BRAT` 플러그인 사용)
1. 이 저장소의 [Releases](https://github.com/PROCPA/Markdown2Naver/releases) 페이지에서 최신 버전의 `main.js`, `manifest.json`, `styles.css` 파일을 다운로드합니다.
2. 내 옵시디언 볼트(Vault) 폴더를 엽니다.
3. `.obsidian/plugins/marklog-obsidian` 폴더를 생성합니다.
4. 다운로드한 3개의 파일을 해당 폴더에 넣습니다.
5. 옵시디언 **설정 > 커뮤니티 플러그인**에서 '새로고침' 후 **Marklog**를 활성화합니다.
![](https://i.imgur.com/FHcoetS.png)

## 3. 사용방법

1. **변환할 노트 열기**: 옵시디언에서 포스팅할 마크다운 문서를 엽니다.
2. **명령어 실행**:
	- 왼쪽 사이드바의 **문서 모양 아이콘(Ribbon Icon)** 을 클릭합니다.
	* 또는 `Ctrl/Cmd + P`를 누르고 `Marklog: Copy as Naver Blog HTML`을 실행합니다.
3. **복사 완료**: "Naver Blog HTML copied to clipboard!" 알림이 뜨면 클립보드에 HTML이 복사된 상태입니다.
4. **붙여넣기**: 네이버 블로그 글쓰기 화면에서 **붙여넣기(Ctrl+V)** 합니다.

---
이제 옵시디언에서 글을 쓰고, `Ctrl+P` -> `Enter` 한 번이면 네이버 블로그 발행 준비가 끝납니다. 

실제 코드와 개발 과정에 대한 사항은 [GitHub 저장소](https://github.com/procpa/marklog)에서 자세히 확인할 수 있습니다.

Marklog가 여러분의 생산적인 블로그 운영에 도움이 되기를 바랍니다.
기능 제안이나 버그 제보는 언제든 환영입니다.
