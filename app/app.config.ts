export default defineAppConfig({
	ui: {
		card: {
			slots: {
				root: "shadow-md border-final-border-soft border",
			},
		},
		button: {
			slots: {
				base: "enabled:hover:cursor-pointer active:brightness-80 rounded-lg",
			},
		},
	},
})
