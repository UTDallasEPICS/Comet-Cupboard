export default defineAppConfig({
	ui: {
		card: {
			slots: {
				root: "shadow-md border-final-border-soft border",
			}
		},
		button: {
			slots: {
				base: "enabled:hover:cursor-pointer active:scale-95 rounded-lg",
			},
		},
	},
})
