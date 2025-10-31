/** @type {import('tailwindcss').Config} */
export default {
	content: ["./components/**/*.{js,vue,ts}", "./layouts/**/*.vue", "./pages/**/*.vue", "./plugins/**/*.{js,ts}", "./app.vue", "./error.vue"],
	separator: "_",
	theme: {
		extend: {
			colors: {
				"utd-green": "#154734",
				"utd-orange": "#E4701E", //slightly off from utd's orange, but matches comet cupboard colors
				"cupboard-dg": "#626262",
				"cupboard-mg": "#B1B1B1",
				"cupboard-lg": "#D9D9D9",
				"red-negative": "#E22222",
				"yellow-warning": "#ffc247",
				"cupboardv2-dg": "#4A4A4A",
				"cupboardv2-lg": "#B9B9B9",
				"cupboardv2-elg": "#D9D9D9",
				"yellow-warningv2": "#FFD580",
			},
			fontFamily: {
				utd: ["FF Din Pro", "Barlow"],
				sans: ["Montserrat", "sans-serif"],
			},
			screens: {
				tn: "400px",
				md: "825px",
			},
		},
	},
	plugins: [],
}
