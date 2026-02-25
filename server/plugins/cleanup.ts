import { prisma } from "#server/utils/prismaUtil"
import cron from "node-cron"

export default defineNitroPlugin((nitroApp) => {
	// console.log("Nitro plugin", nitroApp)
	// cron.schedule(
	// 	// "0 0 * * *",
	// 	"* * * * *",
	// 	async () => {
	// 		console.log("Running daily cleanup task at 12:00 AM CST")
	// 		// await prisma.queueEntry.deleteMany({ where: { state: { in: ["WAITING", "INACTIVE"] } } })
	// 		// await prisma.cart.deleteMany()
	// 	},
	// 	{
	// 		timezone: "America/Chicago",
	// 	}
	// )
})
