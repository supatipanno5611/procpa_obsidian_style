import type { Metadata } from 'next'
import fs from 'node:fs'
import path from 'node:path'
import { FileDownload } from '@/components/mdx/file-download'

export const metadata: Metadata = {
  title: '자료실',
  description: '실무에 활용할 수 있는 엑셀 템플릿, 가이드 등 첨부파일을 다운로드할 수 있습니다.',
  alternates: { canonical: '/downloads' },
}

interface FileEntry {
  name: string
  href: string
  size: string
}

function getFiles(): FileEntry[] {
  const dir = path.join(process.cwd(), 'public', 'files')
  if (!fs.existsSync(dir)) return []

  return fs
    .readdirSync(dir)
    .filter((f) => !f.startsWith('.'))
    .map((f) => {
      const stat = fs.statSync(path.join(dir, f))
      const bytes = stat.size
      const size =
        bytes < 1024
          ? `${bytes}B`
          : bytes < 1024 * 1024
            ? `${(bytes / 1024).toFixed(0)}KB`
            : `${(bytes / (1024 * 1024)).toFixed(1)}MB`
      return { name: f, href: `/files/${f}`, size }
    })
}

export default function DownloadsPage() {
  const files = getFiles()

  return (
    <section>
      <div className="mx-auto max-w-5xl px-6 py-12">
        <p className="font-mono text-[11px] uppercase tracking-wider text-muted-foreground">
          Downloads
        </p>
        <h1 className="mt-6 text-3xl font-semibold tracking-tight sm:text-4xl">
          자료실
        </h1>
        <p className="mt-4 max-w-2xl text-[15px] leading-[1.85] text-muted-foreground">
          실무에 활용할 수 있는 엑셀 템플릿, 가이드 등을 다운로드할 수 있습니다.
        </p>

        <div className="mt-12 space-y-3">
          {files.length === 0 ? (
            <p className="text-sm text-muted-foreground">등록된 파일이 없습니다.</p>
          ) : (
            files.map((f) => (
              <FileDownload key={f.href} href={f.href} size={f.size} />
            ))
          )}
        </div>
      </div>
    </section>
  )
}
