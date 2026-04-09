"use client";

import { Download } from "lucide-react";
import { cn } from "@/lib/utils";

interface DownloadButtonProps {
  fileUrl: string;
  fileName?: string;
  className?: string;
}

export function DownloadButton({ fileUrl, fileName, className }: DownloadButtonProps) {
  return (
    <a
      href={fileUrl}
      download={fileName}
      className={cn(
        "inline-flex items-center gap-2 rounded-lg bg-primary px-5 py-3 text-sm font-semibold text-white shadow-sm hover:bg-primary/90 transition-all",
        className
      )}
    >
      <Download className="h-4 w-4" />
      다운로드
    </a>
  );
}
