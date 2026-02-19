import { existsSync, mkdirSync } from "fs"

export default defineNitroPlugin((nitroApp) => {
	const uploadDirectory = `${process.env.IMAGE_UPLOAD_DIRECTORY}`
	if (!existsSync(uploadDirectory)) {
		mkdirSync(uploadDirectory)
	}
})
