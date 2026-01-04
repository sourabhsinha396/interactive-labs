import { z } from "zod";

const envSchema = z.object({
  NEXT_PUBLIC_POSTHOG_ENABLED: z.enum(['true', 'false']).default('false'),
  NEXT_PUBLIC_POSTHOG_KEY: z.string().optional(),
  NEXT_PUBLIC_POSTHOG_HOST: z.string().optional(),

  NEXT_PUBLIC_GOOGLE_TAG_MANAGER_ENABLED: z.enum(['true', 'false']).default('false'),
  NEXT_PUBLIC_GOOGLE_TAG_MANAGER_ID: z.string().optional(),

  NEXT_PUBLIC_CRISP_WEBSITE_ID: z.string().optional(),
}).superRefine((data, ctx) => {
  if (data.NEXT_PUBLIC_GOOGLE_TAG_MANAGER_ENABLED === 'true' && !data.NEXT_PUBLIC_GOOGLE_TAG_MANAGER_ID) {
    ctx.addIssue({
      code: z.ZodIssueCode.custom,
      message: 'NEXT_PUBLIC_GOOGLE_TAG_MANAGER_ID is required when NEXT_PUBLIC_GOOGLE_TAG_MANAGER_ENABLED is true',
    })
  }

  if (data.NEXT_PUBLIC_POSTHOG_ENABLED === 'true' && !data.NEXT_PUBLIC_POSTHOG_KEY) {
    ctx.addIssue({
      code: z.ZodIssueCode.custom,
      message: 'NEXT_PUBLIC_POSTHOG_KEY is required when NEXT_PUBLIC_POSTHOG_ENABLED is true',
    })
  }
})

export const env = envSchema.parse(process.env);