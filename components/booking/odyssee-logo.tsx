import { HOD_INFINITY_PATH } from './hod-infinity-path'

export function OdysseeLogo({ className }: { className?: string }) {
  return (
    <svg
      width="76"
      height="23"
      viewBox="0 0 76 23"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      aria-label="House of Dermatology logo"
      role="img"
      className={`hod-logo ${className ?? ''}`}
    >
      <text x="0" y="22.4" fontSize="24.5" fill="currentColor" fontFamily="inherit">
        H
      </text>
      <path className="double-s" d={HOD_INFINITY_PATH} fill="currentColor" />
      <text x="76" y="22.4" fontSize="24.5" textAnchor="end" fill="currentColor" fontFamily="inherit">
        D
      </text>
    </svg>
  )
}
