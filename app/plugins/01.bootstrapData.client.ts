export default defineNuxtPlugin(async (nuxtApp) => {
	const bootstrapData: BootstrapData = await $fetch("/api/public/bootstrap/bootstrap", {
		method: "GET",
	})

	const permissionsStore = usePermissionsStore()
	const userSessionStore = useUserSessionInfoStore()
	const queueStore = useQueueStore()
	const cartStore = useCartStore()

	permissionsStore.access = bootstrapData.permissions ?? {}

	userSessionStore.userID = bootstrapData.userSession?.userID ?? ""
	userSessionStore.displayName = bootstrapData.userSession?.User?.displayName ?? ""
	userSessionStore.publicCode = bootstrapData.userSession?.publicCode ?? ""
	userSessionStore.publicIcon = bootstrapData.userSession?.publicIcon ?? ""

	queueStore.queue = bootstrapData.publicQueue ?? []

	queueStore.queueStatus = bootstrapData.queueStatus ?? null

	cartStore.cart = bootstrapData.cart ?? null
})
