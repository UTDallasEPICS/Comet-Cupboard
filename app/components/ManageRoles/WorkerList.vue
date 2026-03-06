<template>
	<UCard>
		<template #header>
			<SharedTextSectionTitle> Volunteers and Admins </SharedTextSectionTitle>
		</template>
		<UTable :data="workerUsers" :columns="columns" empty="No worker users currently available" />
	</UCard>
</template>

<script lang="ts" setup>
import { h, resolveComponent } from "vue"

const toast = useToast()

const UButton = resolveComponent("UButton")
const UDropdownMenu = resolveComponent("UDropdownMenu")

const permissions = usePermissionsStore()
const { canAdminAccess, canHeadAdminAccess } = storeToRefs(permissions)

const currentUserNetID = useCookie("netID")

const { data: workerUsers, refresh } = await useFetch("/api/admin/user/workerUsers", {
	method: "GET",
})
const columns = [
	{
		accessorKey: "netID",
		header: ({ column }) => {
			const isSorted = column.getIsSorted()

			return h(UButton, {
				color: "neutral",
				variant: "ghost",
				label: "Net ID",
				icon: isSorted ? (isSorted === "asc" ? icons["sortAsc"] : icons["sortDesc"]) : icons["sort"],
				class: "-mx-2.5",
				onClick: () => column.toggleSorting(column.getIsSorted() === "asc"),
			})
		},
	},
	{
		accessorKey: "role",
		header: ({ column }) => {
			const isSorted = column.getIsSorted()

			return h(UButton, {
				color: "neutral",
				variant: "ghost",
				label: "Role",
				icon: isSorted ? (isSorted === "asc" ? icons["sortAsc"] : icons["sortDesc"]) : icons["sort"],
				class: "-mx-2.5",
				onClick: () => column.toggleSorting(column.getIsSorted() === "asc"),
			})
		},
	},
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
	const items = [
		{
			type: "label",
			label: "Actions",
		},
		{
			type: "separator",
		},
	]

	if (canHeadAdminAccess.value) {
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
	} else if (canAdminAccess.value) {
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
