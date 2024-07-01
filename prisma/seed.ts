import { nanoid } from "nanoid"
import fs from "fs"

import { PrismaClient } from "@prisma/client"

const prisma: PrismaClient = new PrismaClient()

const testImages: Array<string> = fs.readdirSync("./public/test-images")

const categories = Array.from(["Food"]).map((category) => {
	return {
		name: category
	}
})

const items = Array.from({ length: 20 }).map(() => {
	let index: number
	do {
		index = Math.floor(Math.random() * testImages.length)
	} while (testImages[index].split(".")[1] !== "png" && testImages[index].split(".")[1] !== "jpg" && testImages[index].split(".")[1] !== "jpeg")
	return {
		itemID: nanoid(),
		name: testImages[index].split(".")[0],
		quantity: Math.floor(Math.random() * 100),
		imgURL: "test-images/" + testImages[index],
		categoryName: "Food"
	}
})

const main = async () => {
	await prisma.category.createMany({
		data: categories
	})
	await prisma.item.createMany({
		data: items
	})
	console.log(`Database has been seeded. 🌱`)
}

main().catch((err) => {
	console.warn("Error While generating Seed: \n", err)
})
