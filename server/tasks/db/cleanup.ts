import { prisma } from "#server/utils/db"

export default defineTask({
	meta: {
		name: "db:cleanup",
		description: "Run database cleanup",
	},
	async run({ payload, context }) {
		console.log(`${new Date().toISOString()}: Starting DB cleanup task...`)
		try {
			const deletedCartSessions = await prisma.cart.deleteMany()
			const deletedQueueEntries = await prisma.queueEntry.deleteMany()
			const deletedInventoryChangeSessions = await prisma.inventoryChangeSession.deleteMany()
			const deletedUserSessions = await prisma.userSession.deleteMany()
			console.log(
				`Deleted ${deletedCartSessions.count} cart sessions, ${deletedQueueEntries.count} queue entries, ${deletedInventoryChangeSessions.count} inventory change sessions, and ${deletedUserSessions.count} user sessions`
			)
		} catch (error) {
			console.error("Error during DB cleanup:", error)
		}

		return { result: "Success" }
	},
})
