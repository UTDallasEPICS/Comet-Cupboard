import { randomUUID, createHash } from "node:crypto"

type AuthTransaction = {
	id: string
	client_id: string
	redirect_get_callback: string
	verifier: string
	createdAt: number
}

const TTL = 1000 * 60 * 5
const store = new Map<string, AuthTransaction>()

const cleanup = () => {
	const now = Date.now()
	for (const [id, transaction] of store) {
		if (now - transaction.createdAt > TTL) {
			store.delete(id)
		}
	}
}

export const createTransaction = (client_id: string, redirectGetCallback: string) => {
	cleanup()
	const id = randomUUID()
	const verifier = randomUUID()
	store.set(id, { id, client_id, redirect_get_callback: redirectGetCallback, verifier, createdAt: Date.now() })
	const code_challenge = createHash("sha256").update(verifier).digest("base64url")
	return { id, verifier, code_challenge }
}

export const consumeTransaction = (id: string) => {
	const transaction = store.get(id) ?? null
	if (transaction) {
		store.delete(id)
	}
	cleanup()
	return transaction
}
