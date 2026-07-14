import { z } from "zod";

const envSchema = z.object({
  BETTER_AUTH_SECRET: z.string().length(32),

  BETTER_AUTH_URL: z.string(),
  BETTER_AUTH_DOMAIN: z.string().optional(),
  DEFAULT_PORT: z.coerce.number().default(3333),

  // AUTH OPTIONS ==========
  
  // GITHUB
  GITHUB_CLIENT_ID: z.string(),
  GITHUB_CLIENT_SECRET: z.string(),
  
  // ========================

  URL: z.string(),
  ID_URL: z.string(),
  
  DEV_URL: z.string(),
  DEV_ID_URL: z.string(),

  DATABASE_URL: z.string(),
});

export const env = envSchema.parse(process.env);
