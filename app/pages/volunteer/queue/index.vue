<template>
	<UContainer class="py-8">
		<header>
			<SharedTextPageTitle>Manage Queue</SharedTextPageTitle>
		</header>

		<section class="mt-4">
			<UCard>
				<template #header>
					<SharedTextSectionTitle> Cart Sessions </SharedTextSectionTitle>
				</template>
				<!-- <UTable :data="queue" :columns="columns" empty="No one currently in queue" /> -->
			</UCard>
		</section>

		<section class="mt-4">
			<UCard>
				<template #header>
					<SharedTextSectionTitle> Current Queue </SharedTextSectionTitle>
				</template>
				<UTable :data="volunteerQueue" :columns="columns" empty="No one currently in queue" />
			</UCard>
		</section>
	</UContainer>
</template>

<script lang="ts" setup>
import { h, resolveComponent } from "vue"

const UButton = resolveComponent("UButton")
const UDropdownMenu = resolveComponent("UDropdownMenu")

const queueStore = useQueueStore()
const { volunteerQueue } = storeToRefs(queueStore)
const { getVolunteerQueue } = queueStore

const columns = [
	{ accessorKey: "position", header: "Position" },
	{ accessorKey: "publicCode", header: "Display Name" },
	{ accessorKey: "netID", header: "Net ID" },
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
						icon: "i-lucide-ellipsis-vertical",
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
			label: "Approve",
			onClick: () => approveQueueEntry(row),
		},
		{
			label: "Start Timer",
			onClick: () => startQueueEntryTimer(row),
		},
		{
			label: "Remove",
			onClick: () => removeQueueEntry(row),
		},
	]
}

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
