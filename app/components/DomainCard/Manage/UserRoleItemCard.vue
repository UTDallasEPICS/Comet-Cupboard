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
			<SharedButtonActionButton icon="i-lucide-ellipsis" variant="ghost" color="neutral" class="absolute top-2 right-2 h-8 w-8" />
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

const emit = defineEmits<{
	"set-role": [payload: { userID: string; newRole: string }]
	"self-demote": []
}>()

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
					onClick: () => emit("set-role", { userID: props.userID, newRole: "STUDENT" }),
				})
			}
			if (props.role !== "VOLUNTEER") {
				items.push({
					label: "Set to Volunteer",
					onClick: () => emit("set-role", { userID: props.userID, newRole: "VOLUNTEER" }),
				})
			}
			if (props.role !== "ADMIN") {
				items.push({
					label: "Set to Admin",
					onClick: () => emit("set-role", { userID: props.userID, newRole: "ADMIN" }),
					color: "error",
				})
			}
		} else if (currentUserSession.userID === props.userID) {
			items.push({
				label: "SELF DEMOTE TO ADMIN",
				onClick: () => emit("self-demote"),
				color: "error",
			})
		}
		// admin actions
	} else if (permissionsStore.canAdminAccess) {
		if (props.role === "STUDENT") {
			items.push({
				label: "Set to Volunteer",
				onClick: () => emit("set-role", { userID: props.userID, newRole: "VOLUNTEER" }),
			})
		}
		if (props.role === "VOLUNTEER") {
			items.push({
				label: "Set to Student",
				onClick: () => emit("set-role", { userID: props.userID, newRole: "STUDENT" }),
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
</script>
