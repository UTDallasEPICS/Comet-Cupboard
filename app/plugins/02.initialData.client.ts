export default defineNuxtPlugin(async (nuxtApp) => {
	const { getQueue, updateQueueStatus, getVolunteerQueue } = useQueueStore()
	const { getCart } = useCartStore()
	const { canVolunteerAccess } = usePermissionsStore()
	await getQueue()
	await updateQueueStatus()
	await getCart()
	if (canVolunteerAccess) {
		await getVolunteerQueue()
	}
})
