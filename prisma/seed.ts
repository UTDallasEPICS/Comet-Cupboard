import { copyFile } from "node:fs/promises"
import { nanoid } from "nanoid"
import { existsSync, mkdirSync, readdirSync } from "fs"
import "dotenv/config"
import { PrismaBetterSqlite3 } from "@prisma/adapter-better-sqlite3"
import { PrismaClient, RoleType } from "./generated/prisma/client"

const connectionString = `${process.env.DATABASE_URL}`
const adapter = new PrismaBetterSqlite3({ url: connectionString })
const prisma = new PrismaClient({ adapter })

const uploadDirectory = `${process.env.IMAGE_UPLOAD_DIRECTORY}`
if (!existsSync(uploadDirectory)) {
	mkdirSync(uploadDirectory)
}

const sources: Array<string> = ["NTFB", "Community Garden", "Individual Donation", "Cannot Distribute", "Error"]
const categories: Array<string> = readdirSync("./test-images")
const items = []

categories.forEach((category) => {
	const categoryItems: Array<string> = readdirSync("./test-images/" + category)
	categoryItems.forEach(async (categoryItem) => {
		items.push({
			itemID: nanoid(),
			name: categoryItem.split(".")[0],
			quantity: Math.floor(Math.random() * 20),
			imgName: categoryItem,
			categoryName: category,
		})
		await copyFile("./test-images/" + category + "/" + categoryItem, `${uploadDirectory}/${categoryItem}`)
	})
})

const validUsers = [
	{ netID: "stu000000", role: RoleType.STUDENT },
	{ netID: "stu000001", role: RoleType.STUDENT },
	{ netID: "stu000002", role: RoleType.STUDENT },
	{ netID: "vol000000", role: RoleType.VOLUNTEER },
	{ netID: "vol000001", role: RoleType.VOLUNTEER },
	{ netID: "adm000000", role: RoleType.ADMIN },
	{ netID: "had000000", role: RoleType.HEAD_ADMIN },
]

const createUsers = async () => {
	await prisma.user.createMany({ data: validUsers })
}

const createSources = async () => {
	await prisma.source.createMany({
		data: sources.map((source) => {
			return { name: source }
		}),
	})
}

const createCategories = async () => {
	await prisma.category.createMany({
		data: categories.map((category) => {
			return { name: category }
		}),
	})
}

const createItems = async () => {
	await prisma.item.createManyAndReturn({
		data: items,
	})
}

const createDeals = async () => {
	const firstItem = await prisma.item.findFirst({
		where: {
			name: items[0].name,
		},
	})

	await prisma.deal.create({
		data: {
			itemID: firstItem.itemID,
			actualCount: 3,
			adjustedCount: 1,
		},
	})
}

// not going to bother being consistent with item table because this is just for data analytics
const createRestocks = async () => {
	const currentDate = new Date()
	const tempDate = new Date()
	// go back 3 months
	tempDate.setMonth(tempDate.getMonth() - 3)

	const itemCountChanges = []

	while (tempDate < currentDate) {
		// consider only tuesdays and thursdays
		if (tempDate.getDay() === 2 || tempDate.getDay() === 4) {
			const pickedItems = []
			const pickedAmount = 5

			while (pickedItems.length < pickedAmount) {
				const randomItem = items[Math.floor(Math.random() * items.length)]
				if (!pickedItems.includes(randomItem.itemID)) {
					pickedItems.push(randomItem.itemID)
				}
			}

			pickedItems.forEach((itemID) => {
				itemCountChanges.push({
					itemID: itemID,
					date: new Date(tempDate),
					amountChanged: Math.floor(Math.random() * 10) + 5,
					sourceName: sources[Math.floor(Math.random() * sources.length)],
				})
			})
		}
		tempDate.setDate(tempDate.getDate() + 1)
	}

	await prisma.itemCountChange.createMany({
		data: itemCountChanges,
	})
}

// not going to bother being consistent with item table because this is just for data analytics
const createOrders = async () => {
	const currentDate = new Date()
	const tempDate = new Date()
	// go back 3 months
	tempDate.setMonth(tempDate.getMonth() - 3)

	const orders = []
	const ordersItems = []

	while (tempDate < currentDate) {
		// consider only weekdays
		if (!(tempDate.getDay() === 0 || tempDate.getDay() === 6)) {
			const randomUser = validUsers[Math.floor(Math.random() * validUsers.length)].netID

			const pickedItems = []
			const pickedAmount = 3

			while (pickedItems.length < pickedAmount) {
				const randomItem = items[Math.floor(Math.random() * items.length)]
				if (!pickedItems.includes(randomItem.itemID)) {
					pickedItems.push(randomItem.itemID)
				}
			}

			orders.push({
				netID: randomUser,
				date: new Date(tempDate),
			})

			ordersItems.push(
				pickedItems.map((itemID) => ({
					itemID,
					count: Math.floor(Math.random() * 3) + 1,
				}))
			)
		}
		tempDate.setDate(tempDate.getDate() + 1)
	}

	const createdOrders = await prisma.order.createManyAndReturn({
		data: orders,
	})

	createdOrders.forEach((order, index) => {
		ordersItems[index] = ordersItems[index].map((item) => {
			return {
				orderID: order.orderID,
				...item,
			}
		})
	})

	await prisma.orderItem.createMany({
		data: ordersItems.flat(),
	})
}

const main = async () => {
	await createSources()
	await createCategories()
	await createUsers()
	await createItems()
	await createDeals()
	await createRestocks()
	await createOrders()
	console.log(`Database has been seeded. 🌱`)
}

main().catch((err) => {
	console.warn("Error while generating seed: \n", err)
})
