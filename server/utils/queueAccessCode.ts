import { createHmac } from "node:crypto"
import z from "zod"

const TIME_BASED_ONE_TIME_PASSWORD_SECRET = process.env.NUXT_TIME_BASED_ONE_TIME_PASSWORD_SECRET

const CODE_LENGTH = 6
const CODE_RANGE = 10 ** CODE_LENGTH
const TIME_STEP_MS = 60_000

export const getQueueAccessCode = (now = Date.now()) => {
	const timeStep = Math.floor(now / TIME_STEP_MS)
	const hash = createHmac("sha256", TIME_BASED_ONE_TIME_PASSWORD_SECRET).update(`queue-access:${timeStep}`).digest()
	const value = hash.readUInt32BE(0) % CODE_RANGE
	return String(value).padStart(CODE_LENGTH, "0")
}

const queueAccessCodeSchema = z.string().regex(/^\d{6}$/)

export const validateQueueAccessCode = (code: string, now = Date.now()) => {
	if (!queueAccessCodeSchema.safeParse(code).success) {
		return false
	}

	return code === getQueueAccessCode(now)
}
