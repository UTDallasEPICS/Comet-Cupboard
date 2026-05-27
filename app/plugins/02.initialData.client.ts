export default defineNuxtPlugin(async (nuxtApp) => {
	const queueStore = useQueueStore()
	const cartStore = useCartStore()
	const permissionsStore = usePermissionsStore()
	await queueStore.getQueue()
	await queueStore.updateQueueStatus()
	await cartStore.getCart()
	if (permissionsStore.canVolunteerAccess) {
		await queueStore.getVolunteerQueue()
	}
})
