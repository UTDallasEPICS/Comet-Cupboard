import { readFile, copyFile } from "node:fs/promises"
import { nanoid } from "nanoid"
import { existsSync, mkdirSync, readdirSync } from "fs"
import "dotenv/config"
import { PrismaBetterSqlite3 } from "@prisma/adapter-better-sqlite3"
import { PrismaClient, RoleType, BagCategory } from "./generated/prisma/client"
import { uploadImage, processImage } from "../server/utils/image"

const connectionString = `${process.env.DATABASE_URL}`
const adapter = new PrismaBetterSqlite3({ url: connectionString })
const prisma = new PrismaClient({ adapter })

const uploadDirectory = process.env.IMAGE_UPLOAD_DIRECTORY
if (!existsSync(uploadDirectory)) {
	mkdirSync(uploadDirectory)
}

const sources = []

const categories: Array<string> = readdirSync("./test-images").filter((file) => {
	return !(file === "_category_banners")
})
const items = []

categories.forEach((category) => {
	const categoryItems: Array<string> = readdirSync("./test-images/" + category)
	categoryItems.forEach(async (categoryItem) => {
		const imgBuffer = await processImage(await readFile("./test-images/" + category + "/" + categoryItem))
		const imgName = await uploadImage(imgBuffer)
		items.push({
			itemID: nanoid(),
			name: categoryItem.split(".")[0],
			quantity: Math.floor(Math.random() * 20),
			imgName: imgName,
			categoryName: category,
		})
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

const locations = [
	{ name: "Police Station", address: "100 N Floyd Road" },
	{ name: "Activity Center", address: "800 Campbell Rd" },
]

const emergencyBags = [
	{ bagCategory: BagCategory.NONVEGETARIAN_AND_NON_PEANUT_BUTTER, expiryDate: new Date("2026-07-28"), label: "12345", locationName: "Police Station" },
	{ bagCategory: BagCategory.VEGETARIAN_AND_NON_PEANUT_BUTTER, expiryDate: new Date("2027-01-01"), label: "15453" },
	{ bagCategory: BagCategory.NONVEGETARIAN_AND_PEANUT_BUTTER, expiryDate: new Date("2026-09-31"), label: "54321" },
]

const createUsers = async () => {
	await prisma.user.createMany({ data: validUsers })
}

const createSources = async () => {
	const sourceNames = ["NTFB", "Community Garden", "Individual Donation", "Cannot Distribute", "Error"]
	const createdSources = await prisma.source.createManyAndReturn({
		data: sourceNames.map((source) => {
			return { name: source }
		}),
	})
	sources.push(...createdSources)
}

const createCategories = async () => {
	const categoriesWithImages = [
		{ name: "Breakfast Grains", img: "./test-images/_category_banners/grains.jpg" },
		{ name: "Fridge Items", img: "./test-images/_category_banners/fridge.jpg" },
		{ name: "Frozen Items", img: "./test-images/_category_banners/frozen.jpg" },
		{ name: "Fruits", img: "./test-images/_category_banners/fruits.jpg" },
		{ name: "Household Items", img: "./test-images/_category_banners/household.jpg" },
		{ name: "Miscellaneous", img: "./test-images/_category_banners/misc.jpg" },
		{ name: "Pantry Staples", img: "./test-images/_category_banners/pantry_staples.jpg" },
		{ name: "Personal Care", img: "./test-images/_category_banners/personal_care.png" },
		{ name: "Proteins", img: "./test-images/_category_banners/proteins.jpg" },
		{ name: "Snacks", img: "./test-images/_category_banners/snacks.jpg" },
		{ name: "Soup", img: "./test-images/_category_banners/soup.jpg" },
		{ name: "Vegetables", img: "./test-images/_category_banners/vegetables.jpg" },
	]

	const categoriesWithNewImages = categoriesWithImages.map(async (category) => {
		const buffer = await processImage(await readFile(category.img))
		const imgName = await uploadImage(buffer)
		return { ...category, imgName }
	})
	await prisma.category.createMany({
		data: (await Promise.all(categoriesWithNewImages)).map((category) => {
			return { name: category.name, imgName: category.imgName }
		}),
	})
	for (const category of categoriesWithImages) {
		await copyFile(category.img, `${uploadDirectory}/${category.img.split("/").slice(-1)[0]}`)
	}
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

const createLocations = async () => {
	await prisma.location.createMany({ 
		data: locations 
	})
}

const createEmergencyBags = async () => {
	await prisma.emergencyBag.createMany({
		data: emergencyBags 
	})
}

const createEmergencyBagItems = async () => {
	const bags = await prisma.emergencyBag.findMany()

	await prisma.emergencyBagItem.createMany({
		data: [
			{ itemID: items[0].itemID, bagID: bags[0].bagID, count: 3 },
			{ itemID: items[0].itemID, bagID: bags[1].bagID, count: 5 },
			{ itemID: items[2].itemID, bagID: bags[2].bagID, count: 7 },
		],
	})
}

const createIssuedEmergencyBags = async () => {
	await prisma.issuedEmergencyBag.createMany({
		data: [ 
			{ bagCategory: BagCategory.VEGETARIAN_AND_NON_PEANUT_BUTTER, expiryDate: new Date("2026-05-01"), label: "99999", location: "Police Station" }
		],
	})
}

const createIssuedEmergencyBagItems = async () => {
	const bags = await prisma.issuedEmergencyBag.findMany()

	await prisma.issuedEmergencyBagItem.createMany({
		data: [
			{ itemID: items[0].itemID, bagID: bags[0].bagID, count: 3 },
			{ itemID: items[0].itemID, bagID: bags[1].bagID, count: 5 },
			{ itemID: items[2].itemID, bagID: bags[2].bagID, count: 7 },
		],
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
					sourceID: sources[Math.floor(Math.random() * sources.length)].sourceID,
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
				cartCreatedAt: new Date(tempDate),
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

	await createLocations()
	await createEmergencyBags()
	await createEmergencyBagItems()

	await createIssuedEmergencyBags()
	await createIssuedEmergencyBagItems()

	console.log(`Database has been seeded. 🌱`)
}

main().catch((err) => {
	console.warn("Error while generating seed: \n", err)
})
