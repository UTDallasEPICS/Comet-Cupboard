import { existsSync, mkdirSync } from "fs"

export default defineNitroPlugin((nitroApp) => {
	const uploadDirectory = process.env.FILE_STORAGE_DIRECTORY ?? "storage"
	if (!existsSync(uploadDirectory)) {
		mkdirSync(uploadDirectory, { recursive: true })
	}
})
