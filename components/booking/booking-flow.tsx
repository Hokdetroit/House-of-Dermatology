'use client'

import { useState } from 'react'

const BOOKING_URL = 'https://odysseeaesthetic.dapplecrm.com/start/book'

const focusAreas = [
  { id: 'facial', title: 'Facial Aesthetics & Structure', detail: 'Lines, volume, lips, contouring and jawline.' },
  { id: 'skin', title: 'Skin Health & Restoration', detail: 'Tightening, scarring, rosacea, melasma and hair.' },
  { id: 'laser', title: 'Laser and Energy Devices', detail: 'Sciton BBL Hero, Halo and laser resurfacing.' },
  { id: 'bio', title: 'Biostimulation', detail: 'Exosomes, collagen stimulation and skin needling.' },
  { id: 'unsure', title: 'Not sure yet', detail: 'Let our clinicians guide you towards the right plan.' },
]

const visitTypes = [
  { id: 'new', title: 'Initial Consultation', detail: 'For new clients. An unhurried assessment of your concerns, goals and anatomy.' },
  { id: 'return', title: 'Treatment Appointment', detail: 'For existing clients continuing a plan already discussed with your clinician.' },
  { id: 'review', title: 'Review', detail: 'A follow-up to assess results and refine your ongoing care.' },
]

const steps = ['Focus', 'Visit', 'Confirm'] as const

type OptionProps = {
  index: number
  title: string
  detail: string
  selected: boolean
  onSelect: () => void
}

function Option({ index, title, detail, selected, onSelect }: OptionProps) {
  return (
    <button
      type="button"
      role="radio"
      aria-checked={selected}
      onClick={onSelect}
      className={`group relative flex w-full items-baseline gap-6 overflow-hidden border-t border-od-blue/15 py-6 text-left transition-colors duration-700 ease-od last:border-b ${
        selected ? 'text-od-bg' : 'hover:text-od-blue'
      }`}
    >
      <span
        aria-hidden="true"
        className={`absolute inset-0 origin-bottom bg-od-blue transition-transform duration-700 ease-od ${
          selected ? 'scale-y-100' : 'scale-y-0'
        }`}
      />
      <span className="od-caps relative w-10 shrink-0 pl-4 opacity-60">{`(${index + 1}).`}</span>
      <span className="relative flex flex-1 flex-col gap-1 pr-4 md:flex-row md:items-baseline md:justify-between md:gap-8">
        <span className="text-[24px] leading-[1.1] transition-transform duration-700 ease-od group-hover:translate-x-2 md:text-[28px]">
          {title}
        </span>
        <span className="max-w-sm text-[16px] leading-snug opacity-70">{detail}</span>
      </span>
    </button>
  )
}

export function BookingFlow() {
  const [step, setStep] = useState(0)
  const [focus, setFocus] = useState<string | null>(null)
  const [visit, setVisit] = useState<string | null>(null)

  const focusChoice = focusAreas.find((item) => item.id === focus)
  const visitChoice = visitTypes.find((item) => item.id === visit)
  const canContinue = (step === 0 && focus) || (step === 1 && visit)

  return (
    <section aria-labelledby="booking-heading" className="flex flex-col gap-10">
      <div className="flex flex-col gap-6 md:flex-row md:items-end md:justify-between">
        <h2 id="booking-heading" className="text-[32px] leading-[1.05] md:text-[48px] md:leading-none">
          Begin your tailored journey
        </h2>
        <ol className="flex items-center gap-6" aria-label="Booking progress">
          {steps.map((label, index) => (
            <li key={label} className="flex items-center gap-3" aria-current={index === step ? 'step' : undefined}>
              <span
                className={`flex size-7 items-center justify-center rounded-full border text-xs transition-all duration-700 ease-od ${
                  index <= step ? 'border-od-blue bg-od-blue text-od-bg' : 'border-od-blue/30'
                }`}
              >
                {index + 1}
              </span>
              <span className={`od-caps transition-opacity duration-700 ${index === step ? 'opacity-100' : 'opacity-40'}`}>
                {label}
              </span>
            </li>
          ))}
        </ol>
      </div>

      <div className="h-px w-full bg-od-blue/10" aria-hidden="true">
        <div
          className="h-px bg-od-blue transition-[width] duration-1000 ease-od"
          style={{ width: `${((step + 1) / steps.length) * 100}%` }}
        />
      </div>

      {step === 0 && (
        <div key="focus" className="od-step flex flex-col gap-6">
          <p className="max-w-xl text-[18px] leading-snug opacity-80">
            Which area of care brings you to Odyssée? This helps us prepare for your visit.
          </p>
          <div role="radiogroup" aria-label="Area of focus">
            {focusAreas.map((item, index) => (
              <Option
                key={item.id}
                index={index}
                title={item.title}
                detail={item.detail}
                selected={focus === item.id}
                onSelect={() => setFocus(item.id)}
              />
            ))}
          </div>
        </div>
      )}

      {step === 1 && (
        <div key="visit" className="od-step flex flex-col gap-6">
          <p className="max-w-xl text-[18px] leading-snug opacity-80">What kind of appointment are you looking for?</p>
          <div role="radiogroup" aria-label="Appointment type">
            {visitTypes.map((item, index) => (
              <Option
                key={item.id}
                index={index}
                title={item.title}
                detail={item.detail}
                selected={visit === item.id}
                onSelect={() => setVisit(item.id)}
              />
            ))}
          </div>
        </div>
      )}

      {step === 2 && focusChoice && visitChoice && (
        <div key="confirm" className="od-step flex flex-col gap-10">
          <dl className="grid gap-px overflow-hidden bg-od-blue/15 md:grid-cols-2">
            <div className="flex flex-col gap-3 bg-od-bg p-6">
              <dt className="od-caps opacity-60">Area of focus</dt>
              <dd className="text-[28px] leading-[1.1]">{focusChoice.title}</dd>
            </div>
            <div className="flex flex-col gap-3 bg-od-bg p-6">
              <dt className="od-caps opacity-60">Appointment</dt>
              <dd className="text-[28px] leading-[1.1]">{visitChoice.title}</dd>
            </div>
          </dl>
          <p className="max-w-xl text-[18px] leading-snug opacity-80">
            {
              "You'll continue to our secure booking system to choose a time with live availability. A clinician will review your selection before your visit."
            }
          </p>
        </div>
      )}

      <div className="flex flex-wrap items-center justify-between gap-6">
        <button
          type="button"
          onClick={() => setStep((current) => Math.max(0, current - 1))}
          className={`od-caps od-link pb-0.5 transition-opacity duration-500 ${step === 0 ? 'invisible' : ''}`}
        >
          Back
        </button>
        {step < 2 ? (
          <button
            type="button"
            disabled={!canContinue}
            onClick={() => setStep((current) => current + 1)}
            className="od-caps group relative overflow-hidden rounded-full border border-od-blue px-8 py-4 transition-opacity duration-500 disabled:cursor-not-allowed disabled:opacity-30"
          >
            <span className="absolute inset-0 origin-left scale-x-0 bg-od-blue transition-transform duration-700 ease-od group-enabled:group-hover:scale-x-100" aria-hidden="true" />
            <span className="relative transition-colors duration-700 group-enabled:group-hover:text-od-bg">Continue</span>
          </button>
        ) : (
          <a
            href={BOOKING_URL}
            target="_blank"
            rel="noreferrer noopener"
            className="od-caps group relative overflow-hidden rounded-full bg-od-blue px-8 py-4 text-od-bg"
          >
            <span className="relative flex items-center gap-3">
              Choose a time
              <span aria-hidden="true" className="inline-block transition-transform duration-700 ease-od group-hover:translate-x-1.5">
                {'\u2192'}
              </span>
            </span>
          </a>
        )}
      </div>
    </section>
  )
}
