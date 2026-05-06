import Image, { type StaticImageData } from 'next/image'
import Link from 'next/link'

type CTAPosition = 'top-left' | 'top-right' | 'bottom-left' | 'bottom-right' | 'center'

interface CTAConfig {
  label: string
  href: string
  /** Overrides default button styles when provided */
  className?: string
}

interface HeroBannerProps {
  /** Local static import or absolute/relative URL string */
  src: string | StaticImageData
  alt: string
  /** Optional semi-transparent dark overlay for text readability */
  overlay?: boolean
  /** Optional CTA button rendered absolutely over the banner */
  cta?: CTAConfig
  /** Where to anchor the CTA — defaults to bottom-right */
  ctaPosition?: CTAPosition
  /** Extra classes on the outer <section> (e.g. custom height) */
  className?: string
}

const CTA_POSITIONS: Record<CTAPosition, string> = {
  'top-left':     'top-6 left-6 md:top-10 md:left-10',
  'top-right':    'top-6 right-6 md:top-10 md:right-10',
  'bottom-left':  'bottom-6 left-6 md:bottom-10 md:left-10',
  'bottom-right': 'bottom-6 right-6 md:bottom-10 md:right-10',
  center:         'top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2',
}

export default function HeroBanner({
  src,
  alt,
  overlay = true,
  cta,
  ctaPosition = 'bottom-right',
  className = '',
}: HeroBannerProps) {
  return (
    <section
      className={`relative w-full overflow-hidden h-[280px] sm:h-[380px] md:h-[520px] ${className}`}
    >
      {/* Full-width background image — priority because it is always above the fold */}
      <Image
        src={src}
        alt={alt}
        fill
        priority
        sizes="100vw"
        className="object-cover"
      />

      {overlay && (
        <div className="absolute inset-0 bg-black/35" aria-hidden="true" />
      )}

      {cta && (
        <div className={`absolute z-10 ${CTA_POSITIONS[ctaPosition]}`}>
          <Link
            href={cta.href}
            className={
              cta.className ??
              'inline-block bg-[#0f75bc] hover:bg-[#07446c] active:scale-95 text-white font-bold px-6 py-3 rounded-2xl text-sm transition-all shadow-lg shadow-black/25 whitespace-nowrap'
            }
          >
            {cta.label}
          </Link>
        </div>
      )}
    </section>
  )
}
