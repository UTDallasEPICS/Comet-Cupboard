export default defineAppConfig({
	ui: {
		card: {
			slots: {
				root: "shadow-md border-border-soft border",
			},
		},
		button: {
			slots: {
				base: "enabled:hover:cursor-pointer active:brightness-80 rounded-xl",
			},
		},
	},
})
