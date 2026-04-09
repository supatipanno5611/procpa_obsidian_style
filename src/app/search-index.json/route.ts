import { NextResponse } from 'next/server'
import { getSearchDocs } from '@/lib/search'

export const dynamic = 'force-static'

export function GET() {
  return NextResponse.json({ docs: getSearchDocs() })
}
