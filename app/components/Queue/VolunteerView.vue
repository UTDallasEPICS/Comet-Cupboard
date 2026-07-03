<template>
	<UCard>
		<SharedTextSectionTitle> Current Queue </SharedTextSectionTitle>
		<div v-for="queueEntry in queueStore.queue" :key="queueEntry.position" class="mt-4">
			<div
				class="flex flex-row items-center justify-between"
				:class="{
					'bg-utd-green/10': queueEntry.publicCode === queueStore.queueStatus?.publicCode,
					'rounded-lg': true,
				}"
			>
				<UUser :name="queueEntry.publicCode" :description="`Position: ${queueEntry.position}`" :avatar="{ icon: queueEntry.publicIcon }" size="xl" />
				<UDropdownMenu
					:items="[
						{ label: 'Approve', onClick: () => approveQueueEntry(queueEntry) },
						{ label: 'Remove', onClick: () => removeQueueEntry(queueEntry) },
					]"
				>
					<UButton :icon="icons['ellipsesActions']" variant="ghost" class="h-8 w-8" />
				</UDropdownMenu>
			</div>
		</div>
	</UCard>
</template>

<script lang="ts" setup>
const queueStore = useQueueStore()

onMounted(async () => {
	await queueStore.getQueue()
})

const approveQueueEntry = async (queueEntry) => {
	try {
		await $fetch("/api/volunteer/queue/approve", {
			method: "POST",
			body: {
				publicCode: queueEntry.publicCode,
			},
		})
	} catch (e) {}
}

const removeQueueEntry = async (queueEntry) => {
	try {
		await $fetch("/api/volunteer/queue/remove", {
			method: "POST",
			body: {
				publicCode: queueEntry.publicCode,
			},
		})
	} catch (e) {}
}
</script>
