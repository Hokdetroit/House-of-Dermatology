import { Analytics } from '@vercel/analytics/next'
import type { Metadata, Viewport } from 'next'
import './globals.css'

export const metadata: Metadata = {
  title: 'House of Dermatology',
  description: 'Medical aesthetics for timeless results. Discover personalized, evidence-based aesthetic care at House of Dermatology in Detroit.',
  generator: 'v0.app',
  icons: {
    icon: [
      {
        url: '/icon-light-32x32.png',
        media: '(prefers-color-scheme: light)',
      },
      {
        url: '/icon-dark-32x32.png',
        media: '(prefers-color-scheme: dark)',
      },
      {
        url: '/icon.svg',
        type: 'image/svg+xml',
      },
    ],
    apple: '/apple-icon.png',
  },
}

export const viewport: Viewport = {
  colorScheme: 'light',
  themeColor: '#FFFCF8',
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en">
      <head>
        {/* Defers ResizeObserver callbacks a frame so layout changes inside them don't trigger "loop completed" errors */}
        <script
          dangerouslySetInnerHTML={{
            __html: `(()=>{const N=window.ResizeObserver;if(!N||N.__deferred)return;class D extends N{constructor(c){let f=0,q=null;super((e,o)=>{q=e;if(f)return;f=requestAnimationFrame(()=>{f=0;const b=q;q=null;c(b,o)})})}}D.__deferred=true;window.ResizeObserver=D})()`,
          }}
        />
      </head>
      <body className="antialiased">
        {children}
        {process.env.NODE_ENV === 'production' && <Analytics />}
      </body>
    </html>
  )
}
