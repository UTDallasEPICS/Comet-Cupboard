// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
	devtools: { enabled: true },
	modules: ["@nuxt/eslint", "@pinia/nuxt", "@nuxt/ui"],
	css: ["~/assets/css/main.css"],
	runtimeConfig: { EPICS_SSO_BASE_URL: "", public: { LOCAL_URL: "", NODE_ENV: "" } },
	features: { inlineStyles: false },
	ui: {
		colorMode: false,
	},
	vite: {
		optimizeDeps: {
			include: ["zod", "fuse.js", "@vue/devtools-core", "@vue/devtools-kit", "@vueuse/core", "nanoid"],
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
	compatibilityDate: "2025-03-07",
})
