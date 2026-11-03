import type { CSSProperties } from 'react'

const headingLines = ['A consultation', 'shaped around you.']

export function BookingHero() {
  return (
    <section className="mx-auto grid max-w-[1440px] gap-10 px-5 pt-16 md:grid-cols-12 md:gap-5 md:pt-24">
      <div className="flex flex-col justify-between gap-10 md:col-span-6 md:pb-10">
        <p className="od-caps od-line-in opacity-60">Book Consultation</p>
        <div className="flex flex-col gap-8">
          <h1 className="text-[48px] leading-none md:text-[80px] md:leading-[0.95]">
            {headingLines.map((line, index) => (
              <span key={line} className="block overflow-hidden pb-[0.08em]">
                <span className="od-line-in block" style={{ '--delay': `${150 + index * 120}ms` } as CSSProperties}>
                  {line}
                </span>
              </span>
            ))}
          </h1>
          <p
            className="od-line-in max-w-md text-[18px] leading-snug opacity-80"
            style={{ '--delay': '450ms' } as CSSProperties}
          >
            Every treatment at House of Dermatology begins with listening. Tell us a little about what brings you here, then
            choose a time that suits you at our Detroit clinic.
          </p>
        </div>
      </div>
      <div className="relative overflow-hidden md:col-span-5 md:col-start-8">
        <img
          src="/site-assets/media/54e465df83092261a5de.webp"
          alt="Close-up portrait showing luminous, natural skin"
          width={1280}
          height={1820}
          className="od-hero-image aspect-[4/5] w-full object-cover"
        />
      </div>
    </section>
  )
}
