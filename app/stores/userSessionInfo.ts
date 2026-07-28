export const useUserSessionInfoStore = defineStore("userSessionInfo", () => {
	const userID = ref<string>("")
	const displayName = ref<string>("")
	const publicCode = ref<string>("")
	const publicIcon = ref<string>("")

	const setUserSessionInfoFromServer = async () => {
		try {
			const userSessionInfo = await $fetch("/api/public/account/userSessionInfo", {
				method: "GET",
			})

			userID.value = userSessionInfo.userID
			displayName.value = userSessionInfo.displayName
			publicCode.value = userSessionInfo.publicCode
			publicIcon.value = userSessionInfo.publicIcon
		} catch (error) {
			clearUserSessionInfo()
		}
	}

	const clearUserSessionInfo = () => {
		userID.value = ""
		displayName.value = ""
		publicCode.value = ""
		publicIcon.value = ""
	}

	return { userID, displayName, publicCode, publicIcon, setUserSessionInfoFromServer, clearUserSessionInfo }
})
