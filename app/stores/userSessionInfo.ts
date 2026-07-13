export const useUserSessionInfoStore = defineStore("userSessionInfo", () => {
	const publicCode = ref<string>("")
	const publicIcon = ref<string>("")

	const setUserSessionInfoFromServer = async () => {
		try {
			const userSessionInfo = await $fetch("/api/public/account/userSessionInfo", {
				method: "GET",
			})

			publicCode.value = userSessionInfo.publicCode
			publicIcon.value = userSessionInfo.publicIcon
		} catch (error) {
			publicCode.value = ""
			publicIcon.value = ""
		}
	}

	const clearUserSessionInfo = () => {
		publicCode.value = ""
		publicIcon.value = ""
	}

	return { publicCode, publicIcon, setUserSessionInfoFromServer, clearUserSessionInfo }
})
