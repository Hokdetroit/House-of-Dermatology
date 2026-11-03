import type { Metadata } from 'next'
import './book.css'
import { SiteHeader } from '@/components/booking/site-header'
import { SiteFooter } from '@/components/booking/site-footer'
import { BookingHero } from '@/components/booking/booking-hero'
import { BookingFlow } from '@/components/booking/booking-flow'
import { WhatToExpect } from '@/components/booking/what-to-expect'
import { Reveal } from '@/components/booking/reveal'

export const metadata: Metadata = {
  title: 'House of Dermatology | Book Consultation',
  description: 'Book a consultation at House of Dermatology, Detroit. Personalized, evidence-based medical aesthetics for timeless results.',
}

export default function BookPage() {
  return (
    <div className="od-page min-h-svh antialiased">
      <SiteHeader />
      <main>
        <BookingHero />
        <div className="mx-auto max-w-[1440px] px-5 py-24 md:py-40">
          <Reveal>
            <BookingFlow />
          </Reveal>
        </div>
        <WhatToExpect />
      </main>
      <SiteFooter />
    </div>
  )
}
