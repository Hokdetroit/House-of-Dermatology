import { readFileSync, writeFileSync, readdirSync } from 'node:fs'
import { join } from 'node:path'

const root = new URL('..', import.meta.url).pathname

// Calligraphic lemniscate: a broad nib held at an angle gives thick and thin
// strokes, so the mark reads differently once it is flipped on hover.
function infinityPath({ cx, cy, a, nib, hairline, nibAngle, steps = 220 }) {
  const pts = []
  for (let i = 0; i <= steps; i++) {
    const t = (i / steps) * Math.PI * 2
    const d = 1 + Math.sin(t) ** 2
    pts.push([(a * Math.cos(t)) / d, (a * Math.sin(t) * Math.cos(t)) / d * 1.25])
  }
  const left = []
  const right = []
  for (let i = 0; i < steps; i++) {
    const [x0, y0] = pts[(i - 1 + steps) % steps]
    const [x1, y1] = pts[i + 1]
    const theta = Math.atan2(y1 - y0, x1 - x0)
    const w = hairline + nib * Math.abs(Math.sin(theta - nibAngle))
    const nx = -Math.sin(theta) * (w / 2)
    const ny = Math.cos(theta) * (w / 2)
    const [x, y] = pts[i]
    left.push([cx + x + nx, cy + y + ny])
    right.push([cx + x - nx, cy + y - ny])
  }
  const fmt = (p) => `${p[0].toFixed(2)} ${p[1].toFixed(2)}`
  const ring = (arr) => `M${fmt(arr[0])}` + arr.slice(1).map((p) => `L${fmt(p)}`).join('') + 'Z'
  return ring(left) + ring(right.reverse())
}

const VIEW_W = 76
const INFINITY_D = infinityPath({ cx: 38, cy: 13.8, a: 15, nib: 3.1, hairline: 0.55, nibAngle: Math.PI / 4 })

const letters = [
  { x: '0', label: 'H' },
  { x: VIEW_W.toString(), label: 'D', anchor: 'end' },
]

const htmlChildren =
  letters
    .map(
      (l) =>
        `<text x="${l.x}" y="22.4" font-size="24.5"${l.anchor ? ` text-anchor="${l.anchor}"` : ''} fill="currentColor" font-family="inherit">${l.label}</text>`,
    )
    .join('') + `<path class="double-s" d="${INFINITY_D}" fill="currentColor"></path>`

const jsChildren =
  '[' +
  letters
    .map(
      (l) =>
        `(0,t.jsx)("text",{x:"${l.x}",y:"22.4",fontSize:"24.5",${l.anchor ? `textAnchor:"${l.anchor}",` : ''}fill:"currentColor",fontFamily:"inherit",children:"${l.label}"})`,
    )
    .join(',') +
  `,(0,t.jsx)("path",{className:"double-s",d:"${INFINITY_D}",fill:"currentColor"})]`

const q = '\\"'
const rscNode = (tag, props) =>
  `[${q}$${q},${q}${tag}${q},null,{` +
  Object.entries(props)
    .map(([k, v]) => `${q}${k}${q}:${q}${v}${q}`)
    .join(',') +
  '}]'
const rscChildren =
  '[' +
  letters
    .map((l) =>
      rscNode('text', {
        x: l.x,
        y: '22.4',
        fontSize: '24.5',
        ...(l.anchor ? { textAnchor: l.anchor } : {}),
        fill: 'currentColor',
        fontFamily: 'inherit',
        children: l.label,
      }),
    )
    .join(',') +
  ',' +
  rscNode('path', { className: 'double-s', d: INFINITY_D, fill: 'currentColor' }) +
  ']'

function replaceBracketed(src, anchor, newAnchor, childrenKey, children, guard) {
  let count = 0
  let from = 0
  let at
  while ((at = src.indexOf(anchor, from)) !== -1) {
    const c = src.indexOf(childrenKey, at)
    let depth = 0
    let end = -1
    for (let i = c + childrenKey.length - 1; i < src.length; i++) {
      if (guard && src.startsWith(guard, i)) throw new Error('payload split')
      if (src[i] === '[') depth++
      else if (src[i] === ']' && --depth === 0) {
        end = i + 1
        break
      }
    }
    const head = newAnchor + src.slice(at + anchor.length, c)
    const replacement = head + childrenKey.slice(0, -1) + children
    src = src.slice(0, at) + replacement + src.slice(end)
    from = at + replacement.length
    count++
  }
  return [src, count]
}

const contentDir = join(root, 'site-content')
for (const f of readdirSync(contentDir).filter((n) => n.endsWith('.html'))) {
  const file = join(contentDir, f)
  let src = readFileSync(file, 'utf8')
  const html = src.replace(
    /<svg([^>]*?)width="120" height="23" viewBox="0 0 120 23"([^>]*aria-label="House of Dermatology logo"[^>]*)>[\s\S]*?<\/svg>/g,
    (_m, a, b) => `<svg${a}width="${VIEW_W}" height="23" viewBox="0 0 ${VIEW_W} 23"${b}>${htmlChildren}</svg>`,
  )
  const rscAnchor = `[${q}$${q},${q}svg${q},null,{${q}width${q}:${q}120${q},${q}height${q}:${q}23${q},${q}viewBox${q}:${q}0 0 120 23${q}`
  const rscNew = `[${q}$${q},${q}svg${q},null,{${q}width${q}:${q}${VIEW_W}${q},${q}height${q}:${q}23${q},${q}viewBox${q}:${q}0 0 ${VIEW_W} 23${q}`
  const [out, n] = replaceBracketed(html, rscAnchor, rscNew, `${q}children${q}:[`, rscChildren, '</script>')
  writeFileSync(file, out)
  console.log(f, 'rsc', n)
}

const chunk = join(root, 'public/site-assets/next/chunks/0c4vo7lg2di3r.js')
const [js, jn] = replaceBracketed(
  readFileSync(chunk, 'utf8'),
  'width:"120",height:"23",viewBox:"0 0 120 23"',
  `width:"${VIEW_W}",height:"23",viewBox:"0 0 ${VIEW_W} 23"`,
  'children:[',
  jsChildren,
)
writeFileSync(chunk, js)
console.log('chunk', jn)

writeFileSync(join(root, 'components/booking/hod-infinity-path.ts'), `export const HOD_INFINITY_PATH =\n  '${INFINITY_D}'\n`)
