import { OdysseeLogo } from './odyssee-logo'

const links = [
  { href: '/treatments', label: 'Treatments' },
  { href: '/concerns', label: 'Concerns' },
  { href: '/about', label: 'About' },
  { href: '/book', label: 'Book Consultation', current: true },
]

export function SiteHeader() {
  return (
    <header className="sticky top-0 z-50 border-b border-od-blue/10 bg-od-bg/85 backdrop-blur-md">
      <div className="mx-auto flex h-16 max-w-[1440px] items-center justify-between gap-6 px-5">
        <a href="/" className="od-logo inline-block" style={{ perspective: '400px' }}>
          <OdysseeLogo className="block h-[23px] w-auto" />
          <span className="sr-only">Home</span>
        </a>
        <p className="hidden text-[18px] lg:block">Medical aesthetics for timeless results.</p>
        <nav aria-label="Main" className="flex items-center gap-5 md:gap-14">
          {links.map((link) => (
            <a
              key={link.href}
              href={link.href}
              aria-current={link.current ? 'page' : undefined}
              className={`od-caps od-link pb-0.5 ${link.current ? '' : 'hidden md:inline'}`}
            >
              {link.label}
            </a>
          ))}
        </nav>
      </div>
    </header>
  )
}
