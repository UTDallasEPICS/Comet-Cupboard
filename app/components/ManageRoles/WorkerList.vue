<template>
	<UCard>
		<SharedTextSectionTitle> Volunteers and Admins </SharedTextSectionTitle>
		<UTable :data="workerUsers" :columns="tableColumns" empty="No worker users currently available" />
	</UCard>
</template>

<script lang="ts" setup>
const toast = useToast()

const permissionsStore = usePermissionsStore()

const currentUserNetID = useCookie("netID")

const { data: workerUsers, refresh } = await useFetch("/api/admin/user/workerUsers", {
	method: "GET",
})

const UButton = resolveComponent("UButton")
const UCheckbox = resolveComponent("UCheckbox")
const UDropdownMenu = resolveComponent("UDropdownMenu")

const getActionItems = (row) => {
	const items = [{ type: "label", label: "Actions" }, { type: "separator" }]

	if (permissionsStore.canHeadAdminAccess) {
		if (row.original.role !== "HEAD_ADMIN") {
			if (row.original.role !== "STUDENT") {
				items.push({
					label: "Set to Student",
					onClick: () => setUserToRoleHeadAdminFunction(row, "STUDENT"),
				})
			}
			if (row.original.role !== "VOLUNTEER") {
				items.push({
					label: "Set to Volunteer",
					onClick: () => setUserToRoleHeadAdminFunction(row, "VOLUNTEER"),
				})
			}
			if (row.original.role !== "ADMIN") {
				items.push({
					label: "Set to Admin",
					onClick: () => setUserToRoleHeadAdminFunction(row, "ADMIN"),
					color: "error",
				})
			}
		} else if (currentUserNetID.value === row.original.netID) {
			items.push({
				label: "SELF DEMOTE TO ADMIN",
				onClick: () => headAdminSelfDemote(row),
				color: "error",
			})
		}
	} else if (permissionsStore.canAdminAccess) {
		if (row.original.role === "VOLUNTEER") {
			items.push({
				label: "Demote to Student",
				onClick: () => demoteVolunteertoStudent(row),
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
}

const columnsDef = [
	{ header: "Net ID", accessorKey: "netID", type: "text", sortable: true },
	{ header: "Role", accessorKey: "role", type: "text", sortable: true },
	{ id: "actions", type: "actions", items: getActionItems, meta: { class: { td: "text-right" } } },
]
const tableColumns = buildNuxtUITable(columnsDef, { UButton, UCheckbox, UDropdownMenu })

const demoteVolunteertoStudent = async (row) => {
	try {
		await $fetch("/api/admin/user/demoteVolunteer", {
			method: "POST",
			body: {
				userID: row.original.netID,
			},
		})
		await refresh()
	} catch (e) {}
}

const setUserToRoleHeadAdminFunction = async (row, role) => {
	try {
		await $fetch("/api/head-admin/user/role", {
			method: "POST",
			body: {
				userID: row.original.netID,
				newRole: role,
			},
		})
		await refresh()
	} catch (e) {}
}

const headAdminSelfDemote = async (row) => {
	try {
		await $fetch("/api/head-admin/user/selfDemote", {
			method: "POST",
		})
		await refresh()
	} catch (e) {
		toast.add({
			title: "Error",
			description: e.data?.message || "An error occurred while trying to self-demote. Please try again later.",
			color: "error",
		})
	}
}
</script>
