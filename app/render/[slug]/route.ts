import { readFile } from 'node:fs/promises'
import path from 'node:path'
import { NextRequest } from 'next/server'
import manifest from '../../../site-content/manifest.json'

const posterStyles = manifest.media
  .filter((asset) => asset.source.startsWith('https://image.mux.com/'))
  .map((asset) => `video[poster^=${JSON.stringify(asset.source.split('?')[0])}]{background-image:url(${JSON.stringify(asset.local)})}`)
  .join('\n')

// The captured bundles resize observed elements inside their own observer callbacks
// (text splitting, spacer sizing). Deferring delivery to the next frame breaks that
// synchronous loop so the browser never reports undelivered notifications.
const resizeObserverShim = `<script>(()=>{const N=window.ResizeObserver;if(!N||N.__deferred)return;class D extends N{constructor(c){let f=0,q=null;super((e,o)=>{q=e;if(f)return;f=requestAnimationFrame(()=>{f=0;const b=q;q=null;c(b,o)})})}}D.__deferred=true;window.ResizeObserver=D})()</script>`

const pages = new Set(['index', 'about', 'treatments', 'concerns', 'privacy-policy', 'terms-of-use'])

export async function GET(request: NextRequest, context: { params: Promise<{ slug: string }> }) {
  const { slug } = await context.params
  if (!pages.has(slug)) return new Response('Not found', { status: 404 })
  const source = await readFile(path.join(process.cwd(), 'site-content', `${slug}.html`), 'utf8')
  // Never hide the server-rendered page behind a client-controlled loading gate.
  // Use the ordinary public asset path for styles, independent of Next's runtime.
  const html = source
    // Flight payload chunks can split a tag; strip only complete IDs so URLs stay intact.
  .replace(/\?dpl=dpl_[A-Za-z0-9]{28}(?![A-Za-z0-9])/g, '')
    .replace(/ data-dpl-id="[^"]*"/g, '')
    .replace(/<video\b[^>]*>/g, (tag) => {
      const id = tag.match(/poster="https:\/\/image\.mux\.com\/([A-Za-z0-9]+)\//)?.[1]
      if (!id) return tag
      const autoplay = /\bmuted(?:[\s=>])/.test(tag) ? ' autoplay' : ''
      return tag.replace('<video', `<video src="/site-assets/videos/${id}.mp4"${autoplay}`)
    })
    .replaceAll('/book', '/book')
    .replace(/(<link\b[^>]*href=")\/_next\/static\/(\S+?\.css)/gi, '$1/site-assets/next/$2')
    .replace(/<head\b[^>]*>/i, (head) => head + resizeObserverShim)
    .replace('</head>', `<link rel="stylesheet" href="/site-assets/preview.css"><style>${posterStyles}</style></head>`)
  return new Response(html, {
    headers: {
      'Content-Type': 'text/html; charset=utf-8',
      'Cache-Control': 'no-store',
    },
  })
}
