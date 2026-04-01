import { prisma } from "#server/utils/db"

export default defineTask({
	meta: {
		name: "db:cleanup",
		description: "Run database cleanup",
	},
	async run({ payload, context }) {
		console.log(`${new Date().toISOString()}: Starting DB cleanup task...`)
		try {
			const deletedRoleRequests = await prisma.roleRequest.deleteMany()
			const deletedCartSessions = await prisma.cart.deleteMany()
			const deletedQueueEntries = await prisma.queueEntry.deleteMany()
			const deletedInventoryChangeSessions = await prisma.inventoryChangeSession.deleteMany()
			console.log(
				`Deleted ${deletedRoleRequests.count} role requests, ${deletedCartSessions.count} cart sessions, ${deletedQueueEntries.count} queue entries, and ${deletedInventoryChangeSessions.count} inventory change sessions`
			)
		} catch (error) {
			console.error("Error during DB cleanup:", error)
		}

		return { result: "Success" }
	},
})
