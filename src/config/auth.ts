import argon2 from "argon2";
import { betterAuth } from "better-auth";
import { mongodbAdapter } from "better-auth/adapters/mongodb";
import {
	admin,
	// createAccessControl,
	openAPI,
	username,
} from "better-auth/plugins";

import { env } from "../env.js";
import { client, db } from "../database/client.js";
import { generateSnowflakeId } from "../utils/snowflake.js";
// import { is } from "zod/locales";

const DISCORD_USERNAME_REGEX = /^[a-z0-9_.]+$/;
const hasConsecutivePeriods = (value: string) => value.includes("..");
const normalizeDiscordUsername = (value: string) =>
	value.trim().toLowerCase();
const isDiscordUsername = (value: string) => {
	const username = normalizeDiscordUsername(value);

	if (username.length < 2 || username.length > 32) return false;
	if (!DISCORD_USERNAME_REGEX.test(username)) return false;
	if (hasConsecutivePeriods(username)) return false;

	return true;
};

export const auth = betterAuth({
	basePath: "/auth",
	trustedOrigins: [env.URL, env.DEV_URL, env.ID_URL, env.DEV_ID_URL],

	database: mongodbAdapter(db, {
		client,
		debugLogs: process.env.NODE_ENV === "development",
	}),

	plugins: [
		admin(
			// {
			// defaultRole: "member",
			// adminRoles: ["owner", "admin"],
			// roles: {
			// 	owner: ownerRole,
			// 	admin: adminRole,
			// 	mod: modRole,
			// 	premium: premiumRole,
			// 	member: memberRole,
			// },
			// }
		),
		openAPI(),
		username({
			minUsernameLength: 2,
			maxUsernameLength: 32,

			usernameValidator: (value) => {
				return isDiscordUsername(value);
			},

			displayUsernameValidator: (value) => {
				return isDiscordUsername(value);
			},
		}),
	],

	advanced: {
		// crossSubDomainCookies: {
		// 	enabled: true,
		// 	domain: isDev ? "localhost" : env.BETTER_AUTH_DOMAIN,
		// },
		database: {
			generateId: generateSnowflakeId,
		},
	},

	session: {
		expiresIn: 60 * 60 * 24 * 7, // Auto logout in 7 days
		// cookieCache: {
		// 	enabled: true,
		// 	maxAge: 60 * 5, // salva os cookies por 5 minutos
		// },
		// Para uso de Redis no futuro
		// secondaryCookie: {
		// 	get: async (key: string) => {},
		// 	set: async () => {},
		// 	delete: async () => {},
		// }
	},

	emailAndPassword: {
		enabled: true,
		autoSignIn: true,
		// requireEmailVerification: true,
		minPasswordLength: 8,
		maxPasswordLength: 120,
		password: {
			hash: (password) => argon2.hash(password),
			verify: ({ password, hash }) => argon2.verify(hash, password),
		},
	},

	// emailVerification: {
	//   sendOnSignInUp: true,
	//   sendVerificationEmail: async ({ user, url }) => {
	//     try {
	//       await new Resend(env.RESEND_API_KEY).emails.send({
	//         from: "ARC Studio, Inc. <no-reply@arcstudio.online>",
	//         to: user.email,
	//         subject: "Verify your email address",
	//         react: (
	//           await import("../email/verify-email.jsx")
	//         ).default({
	//           verifyUrl: url,
	//           username: user.name || "unknown",
	//         }),
	//       });
	//     } catch (err) {
	//       console.error("Email verification failed", err);
	//       throw err;
	//     }
	//   },
	// },

	socialProviders: {
		github: {
			clientId: env.GITHUB_CLIENT_ID,
			clientSecret: env.GITHUB_CLIENT_SECRET,
		},
		// vercel: {
		//   clientId: env.VERCEL_CLIENT_ID,
		//   clientSecret: env.VERCEL_CLIENT_SECRET,
		//   scope: ["openid", "email", "profile"],
		// },
	},
});
