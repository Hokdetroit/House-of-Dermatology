import { Reveal } from './reveal'

export function SiteFooter() {
  return (
    <footer className="bg-od-blue text-od-bg">
      <div className="mx-auto flex max-w-[1440px] flex-col gap-16 px-5 pt-32 pb-8">
        <Reveal>
          <p className="max-w-xl text-[32px] leading-[1.05] md:text-[48px] md:leading-none">
            Medical aesthetics for timeless results.
          </p>
        </Reveal>
        <div className="flex flex-col gap-10 md:flex-row md:justify-between">
          <dl className="flex flex-col gap-4 text-[18px] leading-snug">
            <div className="flex gap-10">
              <dt className="uppercase">A.</dt>
              <dd>
                Downtown Detroit
                <br />
                Detroit, MI
                <br />
                <a href="https://maps.app.goo.gl/vUsQGG21r9VXzvQb9" target="_blank" rel="noreferrer noopener" className="od-link">
                  Get Directions
                </a>
              </dd>
            </div>
            <div className="flex gap-10">
              <dt className="uppercase">C.</dt>
              <dd>
                <a href="mailto:info@houseofdermatology.com" className="od-link">
                  info@houseofdermatology.com
                </a>
                <br />
                <a href="tel:3135550100" className="od-link">
                  (313) 555-0100
                </a>
              </dd>
            </div>
            <div className="flex gap-10">
              <dt className="uppercase">S.</dt>
              <dd>
                <a href="https://www.instagram.com/houseofdermatology/" target="_blank" rel="noreferrer noopener" className="od-link">
                  Instagram
                </a>
                {' / '}
                <a href="/book" target="_blank" rel="noreferrer noopener" className="od-link">
                  Gift Cards
                </a>
              </dd>
            </div>
          </dl>
          <div className="flex items-end justify-between gap-8 text-xs md:justify-end">
            <a href="/privacy-policy" className="od-link opacity-40 transition-opacity duration-500 hover:opacity-100">
              Privacy Policy
            </a>
            <a href="/terms-of-use" className="od-link opacity-40 transition-opacity duration-500 hover:opacity-100">
              Terms of Use
            </a>
          </div>
        </div>
        <p className="text-sm opacity-60">{'\u00A9'}2026 House of Dermatology</p>
      </div>
    </footer>
  )
}
