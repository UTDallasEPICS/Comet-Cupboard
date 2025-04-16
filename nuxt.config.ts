// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
	devtools: { enabled: true },
	modules: ["@nuxt/eslint", "@nuxtjs/tailwindcss", "@pinia/nuxt", "@nuxt/test-utils/module"],
	css: ["~/assets/css/main.css"],
	runtimeConfig: {
		public: {
			LOCAL_URL: "",
		},
	},

	postcss: {
		plugins: {
			tailwindcss: {},
			autoprefixer: {},
		},
	},

	compatibilityDate: "2025-03-07",
})
