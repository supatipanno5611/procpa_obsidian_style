import Link from "next/link";
import { ArrowLeft } from "lucide-react";

export default function NotFound() {
  return (
    <div className="relative mx-auto flex max-w-5xl flex-col items-center justify-center px-6 py-32 text-center">
      {/* Background decorations */}
      <div
        className="hero-glow"
        style={{ top: "-100px", left: "50%", transform: "translateX(-50%)", background: "var(--gradient-start)" }}
      />

      <h1 className="text-8xl font-bold tracking-tighter sm:text-9xl">
404
      </h1>
      <p className="mt-6 text-xl text-muted-foreground">
        페이지를 찾을 수 없습니다.
      </p>
      <p className="mt-2 text-sm text-muted-foreground">
        요청하신 페이지가 존재하지 않거나 이동되었을 수 있습니다.
      </p>
      <Link
        href="/"
        className="btn-gradient mt-10 inline-flex items-center gap-2 rounded-xl px-6 py-3 text-sm font-medium"
      >
        <ArrowLeft className="h-4 w-4" />
        홈으로 돌아가기
      </Link>
    </div>
  );
}
