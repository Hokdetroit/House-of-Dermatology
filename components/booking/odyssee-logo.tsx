export function OdysseeLogo({ className }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 120 23"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      aria-label="House of Dermatology"
      role="img"
      className={className}
    >
      <text x="0" y="7" fontSize="7" textLength="120" lengthAdjust="spacingAndGlyphs" fill="currentColor" fontFamily="inherit">
        HOUSE OF
      </text>
      <text x="0" y="22" fontSize="14.5" textLength="120" lengthAdjust="spacingAndGlyphs" fill="currentColor" fontFamily="inherit">
        DERMATOLOGY
      </text>
    </svg>
  )
}
