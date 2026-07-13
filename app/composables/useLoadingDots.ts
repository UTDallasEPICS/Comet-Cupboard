export const useLoadingDots = () => {
	const loadingDots = ref("")

	let interval
	onMounted(() => {
		interval = setInterval(() => {
			loadingDots.value = loadingDots.value.length >= 3 ? "." : loadingDots.value + "."
		}, 500)
	})

	onUnmounted(() => {
		clearInterval(interval)
	})

	return {
		loadingDots: readonly(loadingDots),
	}
}
