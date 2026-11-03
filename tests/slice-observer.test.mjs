import assert from 'node:assert/strict'
import { readFileSync } from 'node:fs'
import test from 'node:test'
import vm from 'node:vm'

const bundle = readFileSync(new URL('../public/site-assets/next/chunks/0r-~gfmzy7kz7.js', import.meta.url), 'utf8')

function mountObserver(height = 767) {
  const effects = []
  let callback, state, component
  const react = {
    useMemo: (fn) => fn(),
    useRef: (current) => ({ current }),
    useCallback: (fn) => fn,
    useEffect: (fn) => effects.push(fn),
    useState: (initial) => [initial, (next) => { state = next }],
  }
  const context = vm.createContext({
    document: { currentScript: null, documentElement: { clientHeight: height }, body: {}, querySelectorAll: () => [] },
    window: { innerHeight: height },
    IntersectionObserver: class {
      constructor(fn) { callback = fn }
      observe() {}
      disconnect() {}
    },
    MutationObserver: class { observe() {} disconnect() {} },
  })
  vm.runInContext(bundle, context)
  const modules = context.TURBOPACK[0]
  const factory = modules[modules.indexOf(21513) + 1]
  factory({
    i: (id) => id === 71645 ? react : id === 47287 ? { useResize: () => ({ top: 0, height: 0 }) } : {},
    s: (exports) => { component = exports[2] },
  })
  component({ slices: [{ _key: 'section-one' }], jumpToNav: null })
  effects.forEach((effect) => effect())
  return (rootBounds, isIntersecting = true) => {
    callback([{ target: { dataset: { sliceKey: 'section-one' } }, boundingClientRect: { top: -20, bottom: 300 }, rootBounds, isIntersecting, intersectionRatio: 0.5 }])
    return state
  }
}

test('null iframe root bounds fall back to the local viewport', () => {
  const result = mountObserver()(null).get('section-one')
  assert.equal(result.offsetTop.fromViewportTop, 0)
  assert.equal(result.offsetTop.fromViewportBottom, 767)
  assert.equal(result.offsetBottom.fromViewportTop, 300)
  assert.equal(result.offsetBottom.fromViewportBottom, 467)
})

test('reported root bounds retain their existing geometry', () => {
  const result = mountObserver()({ top: 10, bottom: 200, height: 190 }).get('section-one')
  assert.equal(result.offsetTop.fromViewportTop, 10)
  assert.equal(result.offsetBottom.fromViewportTop, 200)
  assert.equal(result.intersectionRatio, 0.5)
})

test('non-intersecting entries do not become active', () => {
  assert.equal(mountObserver()(null, false).size, 0)
})

test('fallback supports smaller viewport dimensions', () => {
  assert.equal(mountObserver(480)(null).get('section-one').offsetTop.fromViewportBottom, 480)
})
