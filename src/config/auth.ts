import { betterAuth } from "better-auth";
import { admin, openAPI } from "better-auth/plugins";
import { drizzleAdapter } from "better-auth/adapters/drizzle";

import { db } from "../db/index.js";
import { env } from "../env.js";
import { generateSnowflakeId } from "../utils/snowflake.js";

export const auth = betterAuth({
  basePath: "/auth",
  baseURL: env.BETTER_AUTH_URL,

  trustedOrigins: [
    env.DEV_URL, env.DEV_ID_URL,
    env.URL, env.ID_URL,
  ],

  database: drizzleAdapter(db, {
    provider: "pg"
  }),

  plugins: [
    admin(),
    openAPI(),
  ],

  advanced: {
    database: {
      generateId: generateSnowflakeId,
    },

    crossSubDomainCookies: {
      enabled: true,
    },
  },

  session: {
    expiresIn: 60 * 60 * 24 * 7,
  },

  socialProviders: {
    github: {
      clientId: env.GITHUB_CLIENT_ID as string,
      clientSecret: env.GITHUB_CLIENT_SECRET as string,
    },
  },
});