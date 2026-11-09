import { Reveal } from './reveal'

const stages = [
  {
    title: 'Listen',
    body: 'We begin with an in-depth conversation about your concerns, history and the results you hope to achieve.',
  },
  {
    title: 'Assess',
    body: 'Your clinician evaluates your facial architecture and skin integrity, honoring your natural anatomy.',
  },
  {
    title: 'Plan',
    body: 'Together we shape an evidence-based treatment plan, layer by layer, at a pace that feels right for you.',
  },
]

export function WhatToExpect() {
  return (
    <section aria-labelledby="expect-heading" className="pb-24 md:pb-40">
      <div className="relative h-[60svh] overflow-hidden">
        <video
          src="/site-assets/videos/KPGV1XD6O5cOIjbvgI9gju6ONgFCF3f600Vx00SLBswTw.mp4"
          poster="/site-assets/media/a40de43fd485fe51d91b.webp"
          aria-label="House of Dermatology brand film"
          autoPlay
          muted
          loop
          playsInline
          controls
          preload="metadata"
          width={1280}
          height={800}
          className="absolute inset-0 h-full w-full object-cover"
        />
        <div className="pointer-events-none absolute inset-0 bg-od-blue/10" aria-hidden="true" />
      </div>
      <div className="mx-auto mt-24 grid max-w-[1440px] gap-12 px-5 md:mt-32 md:grid-cols-12 md:gap-5">
        <Reveal className="md:col-span-4">
          <h2 id="expect-heading" className="text-[32px] leading-[1.05] md:text-[48px] md:leading-none">
            What to expect
          </h2>
        </Reveal>
        <ol className="flex flex-col gap-12 md:col-span-7 md:col-start-6">
          {stages.map((stage, index) => (
            <Reveal as="li" key={stage.title} delay={index * 120} className="flex gap-6 border-t border-od-blue/15 pt-6">
              <span className="od-caps w-10 shrink-0 opacity-60">{`(${index + 1}).`}</span>
              <div className="flex flex-col gap-3">
                <h3 className="text-[28px] leading-[1.1]">{stage.title}</h3>
                <p className="max-w-lg text-[18px] leading-snug opacity-80">{stage.body}</p>
              </div>
            </Reveal>
          ))}
        </ol>
      </div>
      <Reveal className="mx-auto mt-24 max-w-[1440px] px-5">
        <p className="text-[18px] leading-snug">
          {'Prefer to speak with us? Call '}
          <a href="tel:3135550100" className="od-link">
            (313) 555-0100
          </a>
          {' or email '}
          <a href="mailto:info@houseofdermatology.com" className="od-link">
            info@houseofdermatology.com
          </a>
          .
        </p>
      </Reveal>
    </section>
  )
}
