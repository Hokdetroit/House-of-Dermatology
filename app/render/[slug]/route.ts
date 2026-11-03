import { readFile } from 'node:fs/promises'
import path from 'node:path'
import { NextRequest } from 'next/server'

const pages = new Set(['index', 'about', 'treatments', 'concerns', 'privacy-policy', 'terms-of-use'])

export async function GET(request: NextRequest, context: { params: Promise<{ slug: string }> }) {
  const { slug } = await context.params
  if (!pages.has(slug)) return new Response('Not found', { status: 404 })
  const html = await readFile(path.join(process.cwd(), 'site-content', `${slug}.html`), 'utf8')
  return new Response(html, {
    headers: {
      'Content-Type': 'text/html; charset=utf-8',
      'Cache-Control': 'public, max-age=0, must-revalidate',
    },
  })
}
