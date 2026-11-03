import { readFileSync, writeFileSync, readdirSync } from 'node:fs'
import { join } from 'node:path'

const dir = new URL('../site-content', import.meta.url).pathname
const q = '\\"'
const anchor = `[${q}$${q},${q}svg${q},null,{${q}width${q}:${q}100${q},${q}height${q}:${q}23${q},${q}viewBox${q}:${q}0 0 100 23${q}`
const text = (y, size, label) =>
  `[${q}$${q},${q}text${q},null,{${q}x${q}:${q}0${q},${q}y${q}:${q}${y}${q},${q}fontSize${q}:${q}${size}${q},${q}textLength${q}:${q}120${q},${q}lengthAdjust${q}:${q}spacingAndGlyphs${q},${q}fill${q}:${q}currentColor${q},${q}fontFamily${q}:${q}inherit${q},${q}children${q}:${q}${label}${q}}]`
const children = `[${text(7, 7, 'HOUSE OF')},${text(22, 14.5, 'DERMATOLOGY')}]`

for (const f of readdirSync(dir).filter((n) => n.endsWith('.html'))) {
  const file = join(dir, f)
  let src = readFileSync(file, 'utf8')
  let count = 0
  let at
  while ((at = src.indexOf(anchor)) !== -1) {
    const key = `${q}children${q}:[`
    const c = src.indexOf(key, at)
    let depth = 0
    let end = -1
    for (let i = c + key.length - 1; i < src.length; i++) {
      if (src.startsWith('</script>', i)) throw new Error(`payload split in ${f}`)
      if (src[i] === '[') depth++
      else if (src[i] === ']' && --depth === 0) { end = i + 1; break }
    }
    const head = src.slice(at, c).replace(`${q}100${q}`, `${q}120${q}`).replace('0 0 100 23', '0 0 120 23')
    src = src.slice(0, at) + head + `${q}children${q}:` + children + src.slice(end)
    count++
  }
  writeFileSync(file, src)
  console.log(f, count)
}
