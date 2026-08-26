import { readFile, copyFile } from "node:fs/promises"
import { nanoid } from "nanoid"
import { existsSync, mkdirSync, readdirSync } from "fs"
import "dotenv/config"
import { PrismaBetterSqlite3 } from "@prisma/adapter-better-sqlite3"
import { Prisma, PrismaClient, RoleType } from "./generated/prisma/client"
import { uploadImage, processImage } from "../server/utils/image"

const connectionString = `${process.env.DATABASE_URL}`
const adapter = new PrismaBetterSqlite3({ url: connectionString })
const prisma = new PrismaClient({ adapter })

const uploadDirectory = process.env.FILE_STORAGE_DIRECTORY ?? "storage"
if (!existsSync(uploadDirectory)) {
	mkdirSync(uploadDirectory, { recursive: true })
}

if (!existsSync(`${uploadDirectory}/images`)) {
	mkdirSync(`${uploadDirectory}/images`, { recursive: true })
}

type SeedItem = { itemID: string; itemName: string; imgName: string; categoryName: string; quantity: number }

const sources: Array<{ sourceID: string; sourceName: string }> = []
const items: SeedItem[] = []
const categoryNameToID = new Map<string, string>()
const defaultSpecificItemIDs = new Map<string, string>()

const populateItems = async () => {
	const categories: Array<string> = readdirSync("./test-images").filter((file) => {
		return !(file === "_category_banners") && !(file === "_location_images") && !(file === "Locations")
	})
	const promises = categories.flatMap((category) => {
		const categoryItems: Array<string> = readdirSync("./test-images/" + category)
		return categoryItems.map(async (categoryItem) => {
			const imgBuffer = await processImage(await readFile("./test-images/" + category + "/" + categoryItem))
			const imgName = await uploadImage(imgBuffer)
			items.push({
				itemID: nanoid(),
				itemName: categoryItem.split(".")[0]!,
				quantity: Math.floor(Math.random() * 20),
				imgName: imgName,
				categoryName: category,
			})
		})
	})
	await Promise.all(promises)
}

const validUsers = [
	{ userID: "stu000000@utdallas.edu", displayName: "Tobor", role: RoleType.STUDENT },
	{ userID: "vol000000@utdallas.edu", displayName: "Temoc", role: RoleType.VOLUNTEER },
	{ userID: "adm000000@utdallas.edu", displayName: "Perlica", role: RoleType.ADMIN },
	{ userID: "had000000@utdallas.edu", displayName: "Penguinistrator", role: RoleType.HEAD_ADMIN },
]

const populateLocations = async () => {
	const locationImages = readdirSync("./test-images/_location_images")
	const locationData = [
		{ locationName: "Police Station", description: "100 N Floyd Road" },
		{ locationName: "Activity Center", description: "800 Campbell Rd" },
	]
	const promises = locationData.map(async (location) => {
		const imgName = locationImages.find((image) => image.split(".")[0] === location.locationName.replace(/\s/g, "_").toLowerCase())
		if (imgName) {
			const imgBuffer = await processImage(await readFile("./test-images/_location_images/" + imgName))
			const uploadedImgName = await uploadImage(imgBuffer)
			return { ...location, imgName: uploadedImgName }
		}
		return { ...location, imgName: "" }
	})
	return await Promise.all(promises)
}

const emergencyBagSeeds = [
	{
		labels: [] as string[],
		expiryDate: new Date("2026-07-28"),
		label: "12345",
		locationName: "Police Station",
		private: true,
	},
	{ labels: [] as string[], expiryDate: new Date("2027-01-01"), label: "15453", locationName: undefined, private: false },
	{ labels: ["Vegetarian"], expiryDate: new Date("2026-09-30"), label: "54321", locationName: undefined, private: false },
	{ labels: ["Peanut Butter"], expiryDate: new Date("2026-09-30"), label: "00000", locationName: undefined, private: false },
]

const createUsers = async () => {
	await prisma.user.createMany({ data: validUsers })
}

const createSources = async () => {
	const sourceNames = ["NTFB", "Community Garden", "Individual Donation", "Cannot Distribute", "Error"]
	const createdSources = await prisma.source.createManyAndReturn({
		data: sourceNames.map((sourceName) => {
			return { sourceName }
		}),
	})
	sources.push(...createdSources)
}

const createCategories = async () => {
	const categoriesWithImages = [
		{ categoryName: "Breakfast Grains", img: "./test-images/_category_banners/grains.jpg" },
		{ categoryName: "Fridge Items", img: "./test-images/_category_banners/fridge.jpg" },
		{ categoryName: "Frozen Items", img: "./test-images/_category_banners/frozen.jpg" },
		{ categoryName: "Fruits", img: "./test-images/_category_banners/fruits.jpg" },
		{ categoryName: "Household Items", img: "./test-images/_category_banners/household.jpg" },
		{ categoryName: "Miscellaneous", img: "./test-images/_category_banners/misc.jpg" },
		{ categoryName: "Pantry Staples", img: "./test-images/_category_banners/pantry_staples.jpg" },
		{ categoryName: "Personal Care", img: "./test-images/_category_banners/personal_care.png" },
		{ categoryName: "Proteins", img: "./test-images/_category_banners/proteins.jpg" },
		{ categoryName: "Snacks", img: "./test-images/_category_banners/snacks.jpg" },
		{ categoryName: "Soup", img: "./test-images/_category_banners/soup.jpg" },
		{ categoryName: "Vegetables", img: "./test-images/_category_banners/vegetables.jpg" },
	]

	const categoriesWithNewImages = categoriesWithImages.map(async (category) => {
		const buffer = await processImage(await readFile(category.img))
		const imgName = await uploadImage(buffer)
		return { ...category, imgName }
	})
	const createdCategories = await prisma.category.createManyAndReturn({
		data: (await Promise.all(categoriesWithNewImages)).map((category) => {
			return { categoryName: category.categoryName, imgName: category.imgName }
		}),
	})
	createdCategories.forEach((category) => categoryNameToID.set(category.categoryName, category.categoryID))
	for (const category of categoriesWithImages) {
		await copyFile(category.img, `${uploadDirectory}/images/${category.img.split("/").slice(-1)[0]}`)
	}
}

const createItems = async () => {
	await prisma.item.createMany({
		data: items.map((item) => ({
			itemID: item.itemID,
			itemName: item.itemName,
			categoryID: categoryNameToID.get(item.categoryName)!,
		})),
	})
	const defaultProducts = await prisma.specificItem.createManyAndReturn({
		data: items.map((item) => ({
			itemID: item.itemID,
			productName: "Default",
			quantity: item.quantity,
			imgName: item.imgName,
		})),
	})
	defaultProducts.forEach((product) => defaultSpecificItemIDs.set(product.itemID, product.specificItemID))
}

const createDeals = async () => {
	const firstItem = await prisma.item.findFirst({
		where: {
			itemName: items[0]!.itemName,
		},
	})
	if (!firstItem) throw new Error("No seeded items available for deal creation")

	await prisma.deal.create({
		data: {
			itemID: firstItem.itemID,
			actualCount: 3,
			adjustedCount: 1,
		},
	})
}

const createLocations = async () => {
	const locations = await populateLocations()
	await prisma.location.createMany({
		data: locations,
	})
}

const createLabels = async () => {
	const itemLabelColors: Record<string, string> = {
		"Gluten Free": "#F59E0B",
		Halal: "#10B981",
		Kosher: "#3B82F6",
		Vegan: "#22C55E",
		Vegetarian: "#84CC16",
	}

	await prisma.itemLabel.createMany({
		data: Object.entries(itemLabelColors).map(([itemLabelName, color]) => ({ itemLabelName, color, archived: false })),
	})
}

const createEmergencyBags = async () => {
	const locations = await prisma.location.findMany()
	for (const bag of emergencyBagSeeds) {
		const location = locations.find((location) => location.locationName === bag.locationName)
		await prisma.emergencyBag.create({
			data: {
				expiryDate: bag.expiryDate,
				label: bag.label,
				private: bag.private,
				locationID: location?.locationID,
				emergencyBagLabels: {
					connectOrCreate: bag.labels.map((emergencyBagLabelName) => ({
						where: { emergencyBagLabelName },
						create: { emergencyBagLabelName, color: "#6B7280", archived: false },
					})),
				},
			},
		})
	}
}

const createEmergencyBagItems = async () => {
	const bags = await prisma.emergencyBag.findMany()

	await prisma.emergencyBagItem.createMany({
		data: [
			{ specificItemID: defaultSpecificItemIDs.get(items[0]!.itemID)!, emergencyBagID: bags[0]!.emergencyBagID, count: 3 },
			{ specificItemID: defaultSpecificItemIDs.get(items[0]!.itemID)!, emergencyBagID: bags[1]!.emergencyBagID, count: 5 },
			{ specificItemID: defaultSpecificItemIDs.get(items[2]!.itemID)!, emergencyBagID: bags[2]!.emergencyBagID, count: 7 },
		],
	})
}

const createIssuedEmergencyBags = async () => {
	const location = await prisma.location.findFirst({ where: { locationName: "Police Station" } })
	await prisma.issuedEmergencyBag.createMany({
		data: [
			{
				expiryDate: new Date("2026-05-01"),
				label: "99999",
				locationID: location?.locationID,
				private: false,
				bagDescription: "Seed issued emergency bag",
			},
		],
	})
}

const createIssuedEmergencyBagItems = async () => {
	const bags = await prisma.issuedEmergencyBag.findMany()

	await prisma.issuedEmergencyBagItem.createMany({
		data: [{ specificItemID: defaultSpecificItemIDs.get(items[0]!.itemID)!, issuedEmergencyBagID: bags[0]!.issuedEmergencyBagID, count: 3 }],
	})
}

// not going to bother being consistent with item table because this is just for data analytics
const createRestocks = async () => {
	const currentDate = new Date()
	const tempDate = new Date()
	// go back 3 months
	tempDate.setMonth(tempDate.getMonth() - 3)

	while (tempDate < currentDate) {
		// consider only tuesdays and thursdays
		if (tempDate.getDay() === 2 || tempDate.getDay() === 4) {
			const source = sources[Math.floor(Math.random() * sources.length)]!
			const session = await prisma.completedInventoryIntakeSession.create({
				data: {
					sourceID: source.sourceID,
					sourceName: source.sourceName,
					inventoryIntakeSessionName: `Seed Intake ${tempDate.toISOString().slice(0, 10)}`,
					intakeDate: new Date(tempDate),
					notes: "",
					completedAt: new Date(tempDate),
				},
			})

			const pickedItems: string[] = []
			const pickedAmount = 5

			while (pickedItems.length < pickedAmount) {
				const randomItem = items[Math.floor(Math.random() * items.length)]!
				if (!pickedItems.includes(randomItem.itemID)) {
					pickedItems.push(randomItem.itemID)
				}
			}

			await prisma.completedInventoryIntakeSessionItem.createMany({
				data: pickedItems.map((itemID) => ({
					completedInventoryIntakeSessionID: session.completedInventoryIntakeSessionID,
					specificItemID: defaultSpecificItemIDs.get(itemID)!,
					amountChanged: Math.floor(Math.random() * 10) + 5,
				})),
			})
		}
		tempDate.setDate(tempDate.getDate() + 1)
	}
}

// not going to bother being consistent with item table because this is just for data analytics
const createOrders = async () => {
	const currentDate = new Date()
	const tempDate = new Date()
	// go back 3 months
	tempDate.setMonth(tempDate.getMonth() - 6)

	const orders: Prisma.OrderCreateManyInput[] = []
	const ordersItems: Prisma.OrderItemCreateManyInput[][] = []

	while (tempDate < currentDate) {
		// consider only weekdays
		if (!(tempDate.getDay() === 0 || tempDate.getDay() === 6)) {
			const randomUser = validUsers[Math.floor(Math.random() * validUsers.length)]!.userID

			const pickedItems: string[] = []
			const pickedAmount = 3

			while (pickedItems.length < pickedAmount) {
				const randomItem = items[Math.floor(Math.random() * items.length)]!
				if (!pickedItems.includes(randomItem.itemID)) {
					pickedItems.push(randomItem.itemID)
				}
			}

			orders.push({
				orderID: nanoid(),
				userID: randomUser,
				cartCreatedAt: new Date(tempDate),
				createdAt: new Date(tempDate),
			})

			ordersItems.push(
				pickedItems.map((itemID) => ({
					specificItemID: defaultSpecificItemIDs.get(itemID)!,
					count: Math.floor(Math.random() * 3) + 1,
				}))
			)
		}
		tempDate.setDate(tempDate.getDate() + 1)
	}

	await prisma.order.createMany({
		data: orders,
	})

	const finalOrderItems = ordersItems.flatMap((orderItems, index) => {
		return orderItems.map((item) => ({
			orderID: orders[index]!.orderID!,
			...item,
		}))
	})

	await prisma.orderItem.createMany({
		data: finalOrderItems,
	})
}

const createTutorialGroups = async () => {
	const groupNames = ["Student", "Volunteer", "Admin", "Head Admin"]

	const groups = await prisma.tutorialGroup.createMany({
		data: groupNames.map((tutorialGroupName) => ({ tutorialGroupName })),
	})

	return groups
}

const main = async () => {
	await populateItems()
	await createSources()
	await createCategories()
	await createUsers()
	await createItems()
	await createDeals()
	await createRestocks()
	await createOrders()

	await createLocations()
	await createLabels()
	await createTutorialGroups()
	await createEmergencyBags()
	await createEmergencyBagItems()

	await createIssuedEmergencyBags()
	await createIssuedEmergencyBagItems()

	console.info(`Database has been seeded. 🌱`)
}

main()
	.catch((err) => {
		console.error("Error while generating seed:\n", err)
		process.exitCode = 1
	})
	.finally(async () => {
		await prisma.$disconnect()
	})
