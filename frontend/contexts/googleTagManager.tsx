'use client'
import { GoogleTagManager } from '@next/third-parties/google'
import { env } from '@/lib/config'
import { ReactNode } from 'react'

export function GoogleTagManagerProvider({ children }: { children: ReactNode }) {
  return (
    <>
      {env.NEXT_PUBLIC_GOOGLE_TAG_MANAGER_ENABLED === 'true' && 
       env.NEXT_PUBLIC_GOOGLE_TAG_MANAGER_ID && (
        <GoogleTagManager gtmId={env.NEXT_PUBLIC_GOOGLE_TAG_MANAGER_ID} />
      )}
      {children}
    </>
  )
}