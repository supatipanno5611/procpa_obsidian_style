import {
  Download,
  File,
  FileSpreadsheet,
  FileText,
  FileImage,
  FileArchive,
  FileCode,
  Presentation,
} from 'lucide-react'

const extIcon: Record<string, typeof File> = {
  xlsx: FileSpreadsheet,
  xls: FileSpreadsheet,
  csv: FileSpreadsheet,
  pdf: FileText,
  doc: FileText,
  docx: FileText,
  hwp: FileText,
  hwpx: FileText,
  txt: FileText,
  png: FileImage,
  jpg: FileImage,
  jpeg: FileImage,
  gif: FileImage,
  svg: FileImage,
  zip: FileArchive,
  rar: FileArchive,
  '7z': FileArchive,
  pptx: Presentation,
  ppt: Presentation,
  js: FileCode,
  ts: FileCode,
  json: FileCode,
  py: FileCode,
}

function getExt(href: string) {
  const m = href.match(/\.(\w+)$/)
  return m ? m[1].toLowerCase() : ''
}

function getFileName(href: string) {
  return decodeURIComponent(href.split('/').pop() ?? href)
}

interface FileDownloadProps {
  href: string
  name?: string
  size?: string
  description?: string
}

export function FileDownload({ href, name, size, description }: FileDownloadProps) {
  const ext = getExt(href)
  const Icon = extIcon[ext] ?? File
  const displayName = name ?? getFileName(href)

  return (
    <a
      href={href}
      download
      className="my-4 flex items-center gap-3 rounded-md border border-border/60 bg-muted/30 px-4 py-3 no-underline transition-colors hover:bg-muted/60 not-prose"
    >
      <Icon className="h-5 w-5 shrink-0 text-muted-foreground" />
      <div className="min-w-0 flex-1">
        <span className="block truncate text-sm font-medium text-foreground">
          {displayName}
        </span>
        {description && (
          <span className="block truncate text-xs text-muted-foreground">
            {description}
          </span>
        )}
      </div>
      <div className="flex shrink-0 items-center gap-2">
        {(size || ext) && (
          <span className="font-mono text-xs text-muted-foreground">
            {[ext.toUpperCase(), size].filter(Boolean).join(' · ')}
          </span>
        )}
        <Download className="h-4 w-4 text-muted-foreground" />
      </div>
    </a>
  )
}
