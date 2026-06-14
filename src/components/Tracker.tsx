'use client'

import { useEffect } from 'react'
import { usePathname } from 'next/navigation'
import { trackPageView } from '@/app/actions/tracking'

export function Tracker() {
  const pathname = usePathname()

  useEffect(() => {
    // Small delay to ensure page is loaded and avoid rapid double-fires in dev mode
    const timeoutId = setTimeout(() => {
      trackPageView(pathname)
    }, 500)

    return () => clearTimeout(timeoutId)
  }, [pathname])

  return null
}
