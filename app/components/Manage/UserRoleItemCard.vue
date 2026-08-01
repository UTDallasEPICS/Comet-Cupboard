<template>
	<UCard class="relative">
		<UUser
			:name="userID"
			:description="displayName"
			size="lg"
			:class="{
				'rounded-lg': true,
			}"
		/>
		<SharedTextBaseSecondary
			><span :class="`text-${roleColor}`">{{ role }}</span></SharedTextBaseSecondary
		>

		<UDropdownMenu :items="actionItems">
			<UButton :icon="icons['ellipsesActions']" variant="ghost" color="neutral" class="absolute top-2 right-2 h-8 w-8" />
		</UDropdownMenu>
	</UCard>
</template>

<script lang="ts" setup>
const props = defineProps({
	userID: { type: String, required: true },
	role: { type: String, required: true },
	displayName: { type: String, required: true },
})

const permissionsStore = usePermissionsStore()
const currentUserSession = useUserSessionInfoStore()

const roleColor = computed(() => {
	switch (props.role) {
		case "STUDENT":
			return "neutral"
		case "VOLUNTEER":
			return "deal-green"
		case "ADMIN":
			return "utd-orange"
		case "HEAD_ADMIN":
			return "utd-orange"
		default:
			return "neutral"
	}
})

const actionItems = computed(() => {
	const items = [{ type: "label", label: "Actions" }, { type: "separator" }]

	// head admin actions
	if (permissionsStore.canHeadAdminAccess) {
		if (props.role !== "HEAD_ADMIN") {
			if (props.role !== "STUDENT") {
				items.push({
					label: "Set to Student",
					onClick: () => setUserToRoleHeadAdminFunction("STUDENT"),
				})
			}
			if (props.role !== "VOLUNTEER") {
				items.push({
					label: "Set to Volunteer",
					onClick: () => setUserToRoleHeadAdminFunction("VOLUNTEER"),
				})
			}
			if (props.role !== "ADMIN") {
				items.push({
					label: "Set to Admin",
					onClick: () => setUserToRoleHeadAdminFunction("ADMIN"),
					color: "error",
				})
			}
		} else if (currentUserSession.userID === props.userID) {
			items.push({
				label: "SELF DEMOTE TO ADMIN",
				onClick: () => headAdminSelfDemote(),
				color: "error",
			})
		}
		// admin actions
	} else if (permissionsStore.canAdminAccess) {
		if (props.role === "STUDENT") {
			items.push({
				label: "Set to Volunteer",
				onClick: () => setUserToRoleAdminFunction("VOLUNTEER"),
			})
		}
		if (props.role === "VOLUNTEER") {
			items.push({
				label: "Set to Student",
				onClick: () => setUserToRoleAdminFunction("STUDENT"),
			})
		}
	}

	if (items.length === 2) {
		items.push({
			label: "No actions available",
			disabled: true,
		})
	}

	return items
})

const setUserToRoleAdminFunction = async (role) => {
	try {
		await $fetch("/api/admin/user/role", {
			method: "POST",
			body: {
				userID: props.userID,
				newRole: role,
			},
		})
	} catch (e) {}
}

const setUserToRoleHeadAdminFunction = async (role) => {
	try {
		await $fetch("/api/head-admin/user/role", {
			method: "POST",
			body: {
				userID: props.userID,
				newRole: role,
			},
		})
	} catch (e) {}
}

const headAdminSelfDemote = async () => {
	try {
		await $fetch("/api/head-admin/user/selfDemote", {
			method: "POST",
		})
	} catch (e) {}
}
</script>
