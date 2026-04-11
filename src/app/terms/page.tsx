import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: '이용약관',
  description: 'PROCPA 웹사이트의 이용약관',
}

export default function TermsPage() {
  return (
    <div className="mx-auto max-w-3xl px-6 py-24">
      <div className="font-mono text-[11px] uppercase tracking-widest text-muted-foreground">
        Terms of Service
      </div>
      <h1 className="mt-3 text-3xl font-semibold tracking-tight">이용약관</h1>
      <p className="mt-2 text-sm text-muted-foreground">시행일: 2026년 3월 1일</p>

      <div className="mt-10 space-y-8 text-[15px] leading-relaxed text-muted-foreground">
        <section>
          <h2 className="text-lg font-semibold text-foreground mb-3">1. 목적</h2>
          <p>
            본 약관은 PROCPA(이하 &quot;사이트&quot;)가 제공하는 웹사이트 서비스의
            이용 조건 및 절차에 관한 기본적인 사항을 규정함을 목적으로 합니다.
          </p>
        </section>

        <section>
          <h2 className="text-lg font-semibold text-foreground mb-3">
            2. 서비스의 내용
          </h2>
          <p>사이트는 다음과 같은 서비스를 제공합니다.</p>
          <ul className="mt-2 list-disc space-y-1 pl-5">
            <li>회계 &middot; 재무 관련 지식 콘텐츠 제공</li>
            <li>AI 및 기술 활용 관련 콘텐츠 제공</li>
            <li>다운로드 가능한 템플릿 및 자료 제공</li>
            <li>지식 그래프를 통한 콘텐츠 탐색 기능</li>
          </ul>
        </section>

        <section>
          <h2 className="text-lg font-semibold text-foreground mb-3">3. 저작권</h2>
          <p>
            사이트에 게시된 모든 콘텐츠(글, 이미지, 코드 등)의 저작권은 PROCPA에
            있으며, 무단 복제 &middot; 배포 &middot; 전송을 금지합니다.
          </p>
          <ul className="mt-2 list-disc space-y-1 pl-5">
            <li>
              개인적 &middot; 비상업적 목적의 학습 용도로는 자유롭게 활용할 수
              있습니다.
            </li>
            <li>출처를 명시한 경우 일부 인용이 가능합니다.</li>
            <li>
              상업적 이용을 원하는 경우 사전에 운영자의 서면 동의를 받아야
              합니다.
            </li>
          </ul>
        </section>

        <section>
          <h2 className="text-lg font-semibold text-foreground mb-3">4. 면책</h2>
          <p>
            사이트의 콘텐츠는 정보 제공 목적으로 작성되었으며, 전문적인 회계 &middot;
            세무 &middot; 법률 자문을 대체하지 않습니다. 콘텐츠의 활용으로 인한
            결과에 대해 사이트는 법적 책임을 지지 않습니다.
          </p>
        </section>

        <section>
          <h2 className="text-lg font-semibold text-foreground mb-3">
            5. 서비스의 변경 및 중단
          </h2>
          <p>
            사이트는 운영상 필요에 따라 서비스의 내용을 변경하거나 중단할 수
            있으며, 이 경우 사전 공지를 원칙으로 합니다.
          </p>
        </section>

        <section>
          <h2 className="text-lg font-semibold text-foreground mb-3">
            6. 분쟁 해결
          </h2>
          <p>본 약관에 관한 분쟁은 대한민국 법률을 준거법으로 합니다.</p>
        </section>
      </div>
    </div>
  )
}
