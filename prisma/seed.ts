import { nanoid } from "nanoid"
import fs from "fs"

import { PrismaClient } from "@prisma/client"

const prisma: PrismaClient = new PrismaClient()

const sources: Array<string> = ["NTFB", "Community Garden", "Individual Donation", "Cannot Distribute", "Error"]

const categories: Array<string> = fs.readdirSync("./public/test-images")

const items = []

categories.forEach((category) => {
	const categoryItems: Array<string> = fs.readdirSync("./public/test-images/" + category)
	categoryItems.forEach((categoryItem) => {
		items.push({
			itemID: nanoid(),
			name: categoryItem.split(".")[0],
			quantity: Math.floor(Math.random() * 20),
			imgURL: "test-images/" + category + "/" + categoryItem,
			categoryName: category,
		})
	})
})

const main = async () => {
	await prisma.source.createMany({
		data: sources.map ((source) => {
			return { name: source }
		})
	})
	await prisma.category.createMany({
		data: categories.map((category) => {
			return { name: category }
		}),
	})
	await prisma.item.createMany({
		data: items,
	})
	await prisma.deal.create({
		data: {
			itemID: items[0].itemID,
			actualCount: 3,
			adjustedCount: 1,
		}
	})
	await prisma.user.createMany({
		data: [{ netID: "stu000000" }, { netID: "stu000001" }, { netID: "stu000002" }, { netID: "vol000000" }, { netID: "vol000001" }, { netID: "adm000000" }],
	})
	await prisma.student.createMany({
		data: [{ netID: "stu000000" }, { netID: "stu000001" }, { netID: "stu000002" }, { netID: "vol000000" }, { netID: "vol000001" }],
	})
	await prisma.volunteer.createMany({
		data: [{ netID: "vol000000" }, { netID: "vol000001" }],
	})
	await prisma.admin.create({ data: { netID: "adm000000" } })
	console.log(`Database has been seeded. 🌱`)
}

main().catch((err) => {
	console.warn("Error While generating Seed: \n", err)
})
