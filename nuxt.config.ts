// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
	devtools: { enabled: true },
	modules: ["@nuxt/eslint", "@nuxtjs/tailwindcss", "@pinia/nuxt", "@nuxt/test-utils/module"],
	css: ["~/assets/css/main.css"],

	postcss: {
		plugins: {
			tailwindcss: {},
			autoprefixer: {},
		},
	},
	build: {
		transpile: ["@vuepic/vue-datepicker"],
	},

	compatibilityDate: "2025-03-07",
})
