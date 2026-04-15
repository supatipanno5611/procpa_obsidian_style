import { MessageCircle } from 'lucide-react'

export function KakaoBanner() {
  return (
    <div>
      <p className="mt-3 max-w-xl text-[15px] leading-[1.85] text-muted-foreground">
        회계/세무/재무 실무자들이 <span className="text-foreground">업무자동화</span>와{' '}
        <span className="text-foreground">AI 활용</span> 인사이트를 공유하는 소규모 모임입니다.
        현업에서 바로 적용 가능한 노하우를 함께 나눕니다.
      </p>

      <a
        href="https://open.kakao.com/o/sQCXbyXg"
        target="_blank"
        rel="noreferrer"
        className="mt-5 inline-flex items-center gap-2 rounded-md border border-border/60 px-4 py-2 font-mono text-[11px] text-muted-foreground transition-colors hover:border-foreground/40 hover:text-foreground"
      >
        <MessageCircle className="h-3.5 w-3.5" />
        오픈채팅 참여하기 →
      </a>

      <p className="mt-3 text-[11px] leading-relaxed text-muted-foreground/60">
        참여 시 현재 직무 및 AI를 활용하고 싶은 분야를 간단히 알려주세요.
      </p>
    </div>
  )
}
