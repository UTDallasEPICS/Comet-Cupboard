import { defineSafeHandler } from "#server/utils/handler"
import { createTransaction } from "#server/utils/_auth-transactions"

export default defineSafeHandler(async (event) => {
	const clientId = "mycupboard"
	const { LOCAL_URL } = useRuntimeConfig(event).public
	const redirectGetCallback = `${LOCAL_URL}api/public/auth/callback`
	const transaction = createTransaction(clientId, redirectGetCallback)

	const EPICS_SSO_BASE_URL = useRuntimeConfig(event).EPICS_SSO_BASE_URL

	const authorizeUrl = new URL(`${EPICS_SSO_BASE_URL}/api/sso/login`)
	authorizeUrl.search = new URLSearchParams({
		client_id: clientId,
		redirect_get_callback: redirectGetCallback,
		state: transaction.id,
		code_challenge: transaction.code_challenge,
	}).toString()

	return sendRedirect(event, authorizeUrl.toString(), 302)
})
