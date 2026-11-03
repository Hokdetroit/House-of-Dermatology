import { readFileSync, writeFileSync, readdirSync, statSync } from 'node:fs'
import { join } from 'node:path'

const root = new URL('..', import.meta.url).pathname

const targets = [
  ...readdirSync(join(root, 'site-content')).map((f) => join('site-content', f)),
  'public/site-assets/next/chunks/0c4vo7lg2di3r.js',
  'public/site-assets/next/chunks/16kfgt0f3me26.js',
  'app/layout.tsx',
  'app/book/page.tsx',
  'app/render/[slug]/route.ts',
  ...readdirSync(join(root, 'components/booking')).map((f) => join('components/booking', f)),
].filter((p) => statSync(join(root, p)).isFile())

const SITE = 'https://www.houseofdermatology.com'
const EMAIL = 'info@houseofdermatology.com'
const PHONE = '(313) 555-0100'
const TEL = 'tel:3135550100'

const replacements = [
  ['https://odysseeaesthetic.dapplecrm.com/start/book', '/book'],
  ['https://odysseeaesthetic.dapplecrm.com/start/giftcard', '/book'],
  ['info@odysseeclinic.com.au', EMAIL],
  ['info@odysseeaesthetic.com.au', EMAIL],
  ['https://www.odysseeclinic.com.au', SITE],
  ['www.odysseeclinic.com.au', SITE.replace('https://', '')],
  ['instagram.com/odysseeclinic', 'instagram.com/houseofdermatology'],
  ['tel:(02) 9140 0868', TEL],
  ['tel:0291400868', TEL],
  ['(02) 9140 0868', PHONE],
  ['Garibaldi Village Square', 'Downtown Detroit'],
  ['37 Alexandra St, Hunters Hill, NSW 2110', 'Detroit, MI'],
  ['37 Alexandra St, Hunters Hill NSW 2110', 'Detroit, MI'],
  ['Australia/Sydney', 'America/Detroit'],
  ['Privacy Act 1988 (Cth) and the Australian Privacy Principles (APPs)', 'applicable United States federal and Michigan privacy laws'],
  ['handled consistently with the APPs', 'handled consistently with this policy'],
  ['outside Australia', 'outside the United States'],
  ['the Australian Consumer Law', 'the Michigan Consumer Protection Act'],
  ['Competition and Consumer Act 2010 (Cth) and applicable Australian consumer protection law', 'applicable United States and Michigan law'],
  ['the laws of New South Wales, Australia', 'the laws of the State of Michigan, United States'],
  ['the courts of New South Wales', 'the courts of the State of Michigan'],
  ['Australian intellectual property law', 'United States intellectual property law'],
  ['applicable Australian law', 'applicable United States or Michigan law'],
  ['the Office of the Australian Information Commissioner (OAIC)', 'the Michigan Department of Attorney General'],
  ['www.oaic.gov.au', 'www.michigan.gov/ag'],
  ['1300 363 992', '(877) 765-8388'],
  ['Odyssée Clinic', 'House of Dermatology'],
  ['Odyssée logo', 'House of Dermatology logo'],
  ['Odyssée', 'House of Dermatology'],
  ['Hunters Hill', 'Detroit'],
  ['the clinic', 'the spa'],
  [/\b([Pp])ersonalis(e|ed|es|ing|ation)\b/g, '$1ersonaliz$2'],
  [/\b([Pp])rioritis(e|ed|es|ing)\b/g, '$1rioritiz$2'],
  [/\b([Uu])tilis(e|ed|es|ing)\b/g, '$1tiliz$2'],
  [/\b([Oo])ptimis(e|ed|es|ing|ation)\b/g, '$1ptimiz$2'],
  [/\b([Ss])pecialis(e|ed|es|ing)\b/g, '$1pecializ$2'],
  [/\b([Mm])inimis(e|ed|es|ing)\b/g, '$1inimiz$2'],
  [/\b([Rr])ecognis(e|ed|es|ing)\b/g, '$1ecogniz$2'],
  [/\bunauthorised\b/g, 'unauthorized'],
  [/\bendeavour\b/g, 'endeavor'],
  [/\b([Hh])onour(ing|ed|s)?\b/g, '$1onor$2'],
]

const wordmark = (q) =>
  `<text x="0" y="7" font-size="7" letter-spacing="0.2" textLength="120" lengthAdjust="spacingAndGlyphs" fill="currentColor" font-family="inherit">HOUSE OF</text>` +
  `<text x="0" y="22" font-size="14.5" textLength="120" lengthAdjust="spacingAndGlyphs" fill="currentColor" font-family="inherit">DERMATOLOGY</text>`

const jsWordmark =
  `[(0,t.jsx)("text",{x:"0",y:"7",fontSize:"7",textLength:"120",lengthAdjust:"spacingAndGlyphs",fill:"currentColor",fontFamily:"inherit",children:"HOUSE OF"}),` +
  `(0,t.jsx)("text",{x:"0",y:"22",fontSize:"14.5",textLength:"120",lengthAdjust:"spacingAndGlyphs",fill:"currentColor",fontFamily:"inherit",children:"DERMATOLOGY"})]`

function replaceHtmlLogos(src) {
  return src.replace(
    /<svg([^>]*?)width="100" height="23" viewBox="0 0 100 23"([^>]*aria-label="(?:Odyssée|House of Dermatology) logo"[^>]*)>[\s\S]*?<\/svg>/g,
    (_m, a, b) => `<svg${a}width="120" height="23" viewBox="0 0 120 23"${b}>${wordmark()}</svg>`,
  )
}

function replaceJsLogo(src) {
  const anchor = 'width:"100",height:"23",viewBox:"0 0 100 23"'
  const at = src.indexOf(anchor)
  if (at === -1) return src
  const childrenAt = src.indexOf('children:[', at)
  let depth = 0
  let end = -1
  for (let i = childrenAt + 'children:'.length; i < src.length; i++) {
    const c = src[i]
    if (c === '[') depth++
    else if (c === ']') {
      depth--
      if (depth === 0) {
        end = i + 1
        break
      }
    }
  }
  return (
    src.slice(0, at) +
    'width:"120",height:"23",viewBox:"0 0 120 23"' +
    src.slice(at + anchor.length, childrenAt) +
    'children:' +
    jsWordmark +
    src.slice(end)
  )
}

for (const rel of targets) {
  const file = join(root, rel)
  const before = readFileSync(file, 'utf8')
  let out = before
  if (rel.endsWith('.html')) out = replaceHtmlLogos(out)
  if (rel.endsWith('0c4vo7lg2di3r.js')) out = replaceJsLogo(out)
  for (const [from, to] of replacements) {
    out = typeof from === 'string' ? out.split(from).join(to) : out.replace(from, to)
  }
  if (out !== before) {
    writeFileSync(file, out)
    console.log('updated', rel)
  }
}
