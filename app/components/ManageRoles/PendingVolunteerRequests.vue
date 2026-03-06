<template>
	<UCard>
		<template #header>
			<SharedTextSectionTitle> Pending Volunteer Requests </SharedTextSectionTitle>
		</template>
		<UTable :data="pendingVolunteerRequests" :columns="columns" empty="No pending volunteer requests currently available" />
	</UCard>
</template>

<script lang="ts" setup>
import { h, resolveComponent } from "vue"

const UButton = resolveComponent("UButton")
const UDropdownMenu = resolveComponent("UDropdownMenu")

const { data: pendingVolunteerRequests, refresh } = await useFetch("/api/admin/user/pendingVolunteerRequests", {
	method: "GET",
})
const columns = [
	{ accessorKey: "userID", header: "User ID" },
	{
		id: "actions",
		meta: {
			class: {
				td: "text-right",
			},
		},
		cell: ({ row }) => {
			return h(
				UDropdownMenu,
				{
					content: {
						align: "end",
					},
					items: getRowItems(row),
					"aria-label": "Actions dropdown",
				},
				() =>
					h(UButton, {
						icon: icons["ellipsesActions"],
						color: "neutral",
						variant: "ghost",
						"aria-label": "Actions dropdown",
					})
			)
		},
	},
]

const getRowItems = (row) => {
	return [
		{
			type: "label",
			label: "Actions",
		},
		{
			type: "separator",
		},
		{
			label: "Accept",
			onClick: () => approveVolunteerRequest(row),
		},
		{
			label: "Reject",
			onClick: () => rejectVolunteerRequest(row),
		},
	]
}

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
