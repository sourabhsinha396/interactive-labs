'use client'
import posthog from 'posthog-js'
import { ReactNode } from 'react';
import { PostHogProvider } from 'posthog-js/react'
import { env } from '@/lib/config'


if (typeof window !== 'undefined' && env.NEXT_PUBLIC_POSTHOG_ENABLED === 'true') {
    posthog.init(env.NEXT_PUBLIC_POSTHOG_KEY || '', {
        api_host: env.NEXT_PUBLIC_POSTHOG_HOST,
        person_profiles: 'identified_only', // or 'always' to create profiles for anonymous users as well
        session_recording: {
            maskAllInputs: false,
        }
    })
}

export function PostHogProviderContext({ children }: { children: ReactNode }) {
    return <PostHogProvider client={posthog}>{children}</PostHogProvider>
}