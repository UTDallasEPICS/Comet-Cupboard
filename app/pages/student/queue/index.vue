<template>
	<UContainer class="py-8">
		<header>
			<SharedButtonNavigateBack text="Back to Dashboard" :to="{ path: '/student' }" />
			<SharedTextPageTitle>Queue</SharedTextPageTitle>
		</header>

		<section class="mt-4">
			<div class="flex items-baseline gap-4">
				<SharedTextSectionTitle>Queue Actions</SharedTextSectionTitle>
				<UButton 
					icon="i-heroicons-question-mark-circle" 
					color="gray" 
					variant="ghost" 
					label="Take a Tour" 
					@click="startTour"
					class="self-end"
				/>
			</div>
		</section>
		
		<section class="mt-4" id="status">
			<UCard>
				<template #header>
					<SharedTextSectionTitle> Current Status </SharedTextSectionTitle>
				</template>

				<div class="space-y-2">
					<div v-if="queueStatus">
						<SharedTextBase> Public Code: {{ queueStatus.publicCode }} </SharedTextBase>
						<SharedTextBase> Position: {{ queueStatus.position }} </SharedTextBase>
						<SharedButtonCancel text="Leave Queue" @click="leaveQueue" />
					</div>
					<div v-else>
						<div v-if="cart">
							<SharedTextBase> You already have an active cart. </SharedTextBase>
						</div>
						<div v-else>
							<SharedTextBase> You are not currently in the queue. </SharedTextBase>
							<SharedButtonPositiveAction text="Join Queue" @click="joinQueue" />
						</div>
					</div>
				</div>
			</UCard>
		</section>

		<section class="mt-4" id="queue">
			<UCard>
				<template #header>
					<SharedTextSectionTitle> Current Queue </SharedTextSectionTitle>
				</template>
				<UTable :data="queue" :columns="tableColumns" :meta="meta" empty="No one currently in queue" />
			</UCard>
		</section>
	</UContainer>
</template>

<script lang="ts" setup>

const queueStore = useQueueStore()
const { queue, queueStatus } = storeToRefs(queueStore)
const { getQueue, updateQueueStatus } = queueStore

const cartStore = useCartStore()
const { cart } = storeToRefs(cartStore)

const columnsDef = [
	{ header: "Position", accessorKey: "position", type: "text" },
	{ header: "Display Name", accessorKey: "publicCode", type: "text" },
]
const tableColumns = buildNuxtUITable(columnsDef, {})

const meta = {
	class: {
		tr: (row) => {
			if (row.original.publicCode === queueStatus.value?.publicCode) {
				return "bg-final-utd-green/10"
			}
			return ""
		},
	},
}

const { startTour } = StudentQueueTour()

onMounted(async () => {
	await getQueue()
	await updateQueueStatus()
	startTour()
})

const joinQueue = async () => {
	await $fetch("/api/student/queue/join", {
		method: "POST",
	})
}

const leaveQueue = async () => {
	await $fetch("/api/student/queue/leave", {
		method: "POST",
	})
}
</script>
