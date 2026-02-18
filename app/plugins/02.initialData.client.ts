export default defineNuxtPlugin(async (nuxtApp) => {
	const { getQueue, updateQueueStatus } = useQueueStore()
	const { getCart } = useCartStore()
	await getQueue()
	await updateQueueStatus()
	await getCart()
})
