import { prisma } from "#server/utils/db"

export default defineTask({
	meta: {
		name: "db:cleanup",
		description: "Run database cleanup",
	},
	async run({ payload, context }) {
		console.info(`${new Date().toISOString()}: Starting DB cleanup task...`)
		try {
			const deletedCartSessions = await prisma.cart.deleteMany()
			const deletedQueueEntries = await prisma.queueEntry.deleteMany()
			const deletedInventoryIntakeSessions = await prisma.inventoryIntakeSession.deleteMany()
			const deletedUserSessions = await prisma.userSession.deleteMany()
			console.info(
				`Deleted ${deletedCartSessions.count} cart sessions, ${deletedQueueEntries.count} queue entries, ${deletedInventoryIntakeSessions.count} inventory intake sessions, and ${deletedUserSessions.count} user sessions`
			)
		} catch (error) {
			console.error("Error during DB cleanup:", error)
		}

		return { result: "Success" }
	},
})
