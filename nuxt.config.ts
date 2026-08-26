// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
	devtools: { enabled: true },
	modules: ["@nuxt/eslint", "@pinia/nuxt", "@nuxt/ui", "nuxt-auth-utils"],
	css: ["~/assets/css/main.css"],
	runtimeConfig: { EPICS_SSO_BASE_URL: "", EPICS_SSO_INTERNAL_URL: "", TIME_BASED_ONE_TIME_PASSWORD_SECRET: "", public: { LOCAL_URL: "", NODE_ENV: "" } },
	features: { inlineStyles: false },
	ui: {
		colorMode: false,
	},
	vite: {
		optimizeDeps: {
			include: ["zod", "fuse.js", "nanoid", "qrcode"],
		},
	},
	nitro: {
		experimental: {
			tasks: true,
		},
		scheduledTasks: {
			// Run `db:cleanup` task every day at midnight
			"0 0 * * *": ["db:cleanup"],
		},
	},
	icon: {
		clientBundle: {
			scan: true,
		},
	},
	compatibilityDate: "2025-03-07",
})
