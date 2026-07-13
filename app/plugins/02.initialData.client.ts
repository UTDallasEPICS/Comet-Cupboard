export default defineNuxtPlugin(async (nuxtApp) => {
	const queueStore = useQueueStore()
	const cartStore = useCartStore()
	await queueStore.getQueue()
	await queueStore.updateQueueStatus()
	await cartStore.getCart()
})
