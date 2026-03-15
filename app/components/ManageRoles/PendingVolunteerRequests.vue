<template>
	<UCard>
		<template #header>
			<SharedTextSectionTitle> Pending Volunteer Requests </SharedTextSectionTitle>
		</template>
		<UTable :data="pendingVolunteerRequests" :columns="tableColumns" empty="No pending volunteer requests currently available" />
	</UCard>
</template>

<script lang="ts" setup>
const { data: pendingVolunteerRequests, refresh } = await useFetch("/api/admin/user/pendingVolunteerRequests", {
	method: "GET",
})

const UButton = resolveComponent("UButton")
const UCheckbox = resolveComponent("UCheckbox")
const UDropdownMenu = resolveComponent("UDropdownMenu")

const getActionItems = (row) => {
	return [
		{ type: "label", label: "Actions" },
		{ type: "separator" },
		{ label: "Accept", onClick: () => approveVolunteerRequest(row) },
		{ label: "Reject", onClick: () => rejectVolunteerRequest(row) },
	]
}

const columnsDef = [
	{ header: "User ID", accessorKey: "userID", type: "text", sortable: true },
	{ id: "actions", type: "actions", items: getActionItems, meta: { class: { td: "text-right" } } },
]
const tableColumns = buildNuxtUITable(columnsDef, { UButton, UCheckbox, UDropdownMenu })

const approveVolunteerRequest = async (row) => {
	try {
		await $fetch("/api/admin/user/volunteerRequestAction", {
			method: "POST",
			body: {
				userID: row.original.userID,
				action: "ACCEPT",
			},
		})
		await refresh()
	} catch (e) {}
}
const rejectVolunteerRequest = async (row) => {
	try {
		await $fetch("/api/admin/user/volunteerRequestAction", {
			method: "POST",
			body: {
				userID: row.original.userID,
				action: "REJECT",
			},
		})
		await refresh()
	} catch (e) {}
}
</script>
