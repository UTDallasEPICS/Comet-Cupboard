<template>
	<UCard>
		<template #header>
			<SharedTextSectionTitle> Current Queue </SharedTextSectionTitle>
		</template>
		<UTable :data="volunteerQueue" :columns="tableColumns" empty="No one currently in queue" />
	</UCard>
</template>

<script lang="ts" setup>
const queueStore = useQueueStore()
const { volunteerQueue } = storeToRefs(queueStore)
const { getVolunteerQueue } = queueStore

const UButton = resolveComponent("UButton")
const UCheckbox = resolveComponent("UCheckbox")
const UDropdownMenu = resolveComponent("UDropdownMenu")

const getActionItems = (row) => {
	return [
		{ type: "label", label: "Actions" },
		{ type: "separator" },
		{ label: "Approve", onClick: () => approveQueueEntry(row) },
		{ label: "Start Timer", onClick: () => startQueueEntryTimer(row) },
		{ label: "Remove", onClick: () => removeQueueEntry(row) },
	]
}

const columnsDef = [
	{ header: "Position", accessorKey: "position", type: "text" },
	{ header: "Display Name", accessorKey: "publicCode", type: "text" },
	{ header: "Net ID", accessorKey: "netID", type: "text" },
	{ id: "actions", type: "actions", items: getActionItems, meta: { class: { td: "text-right" } } },
]
const tableColumns = buildNuxtUITable(columnsDef, { UButton, UCheckbox, UDropdownMenu })

onMounted(async () => {
	await getVolunteerQueue()
})

const approveQueueEntry = async (row) => {
	try {
		await $fetch("/api/volunteer/queue/approve", {
			method: "POST",
			body: {
				netID: row.original.netID,
			},
		})
	} catch (e) {}
}

const startQueueEntryTimer = async (row) => {
	// Implement
}

const removeQueueEntry = async (row) => {
	try {
		await $fetch("/api/volunteer/queue/remove", {
			method: "POST",
			body: {
				netID: row.original.netID,
			},
		})
	} catch (e) {}
}
</script>
