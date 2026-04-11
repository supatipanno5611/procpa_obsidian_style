import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: '면책조항',
  description: 'PROCPA 웹사이트의 면책조항',
}

export default function DisclaimerPage() {
  return (
    <div className="mx-auto max-w-3xl px-6 py-24">
      <div className="font-mono text-[11px] uppercase tracking-widest text-muted-foreground">
        Disclaimer
      </div>
      <h1 className="mt-3 text-3xl font-semibold tracking-tight">면책조항</h1>
      <p className="mt-2 text-sm text-muted-foreground">시행일: 2026년 3월 1일</p>

      <div className="mt-10 space-y-8 text-[15px] leading-relaxed text-muted-foreground">
        <section>
          <h2 className="text-lg font-semibold text-foreground mb-3">
            1. 정보 제공 목적
          </h2>
          <p>
            PROCPA(이하 &quot;사이트&quot;)에 게시된 모든 콘텐츠는 정보 제공
            목적으로 작성되었습니다. 해당 콘텐츠는 특정 상황에 대한 전문적인
            회계, 세무, 법률 또는 재무 자문을 구성하지 않습니다.
          </p>
        </section>

        <section>
          <h2 className="text-lg font-semibold text-foreground mb-3">
            2. 전문 자문 대체 불가
          </h2>
          <p>
            사이트의 콘텐츠는 공인회계사, 세무사, 변호사 등 전문가의 개별 자문을
            대체할 수 없습니다. 중요한 의사결정을 하기 전에 반드시 해당 분야의
            전문가와 상담하시기 바랍니다.
          </p>
        </section>

        <section>
          <h2 className="text-lg font-semibold text-foreground mb-3">
            3. 정확성 보증 제한
          </h2>
          <p>
            사이트는 콘텐츠의 정확성, 완전성, 최신성을 위해 노력하지만, 이를
            보증하지는 않습니다. 회계 기준, 세법, 관련 법규는 수시로 개정될 수
            있으며, 콘텐츠가 최신 변경사항을 반영하지 못할 수 있습니다.
          </p>
        </section>

        <section>
          <h2 className="text-lg font-semibold text-foreground mb-3">
            4. 손해 배상 제한
          </h2>
          <p>
            사이트의 콘텐츠를 활용하여 발생한 직접적 &middot; 간접적 손해에 대해
            사이트 운영자는 법적 책임을 지지 않습니다. 콘텐츠의 활용은 전적으로
            이용자 본인의 판단과 책임하에 이루어집니다.
          </p>
        </section>

        <section>
          <h2 className="text-lg font-semibold text-foreground mb-3">
            5. 외부 링크
          </h2>
          <p>
            사이트는 편의를 위해 외부 웹사이트로의 링크를 제공할 수 있습니다.
            이러한 외부 사이트의 콘텐츠, 개인정보 보호 정책 또는 관행에 대해
            사이트는 통제할 수 없으며 책임을 지지 않습니다.
          </p>
        </section>

        <section>
          <h2 className="text-lg font-semibold text-foreground mb-3">
            6. 코드 및 템플릿
          </h2>
          <p>
            사이트에서 제공하는 코드 예시, 스크립트, 템플릿 등은 교육 및 참고
            목적으로 제공됩니다. 실제 업무 환경에 적용하기 전에 충분한 테스트와
            검증을 수행하시기 바랍니다. 해당 자료의 사용으로 인한 데이터 손실이나
            시스템 오류 등에 대해 사이트는 책임을 지지 않습니다.
          </p>
        </section>

        <section>
          <h2 className="text-lg font-semibold text-foreground mb-3">7. 문의</h2>
          <p>
            본 면책조항에 대한 문의사항은 아래 연락처로 문의해 주시기 바랍니다.
          </p>
          <ul className="mt-2 list-disc space-y-1 pl-5">
            <li>이메일: wogus3575@naver.com</li>
          </ul>
        </section>
      </div>
    </div>
  )
}
