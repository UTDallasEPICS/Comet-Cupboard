// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
	devtools: { enabled: true },
	modules: ["@nuxt/eslint", "@pinia/nuxt", "@nuxt/ui"],
	css: ["~/assets/css/main.css"],
	runtimeConfig: { public: { LOCAL_URL: "" } },
	features: { inlineStyles: false },

	compatibilityDate: "2025-03-07",
})
