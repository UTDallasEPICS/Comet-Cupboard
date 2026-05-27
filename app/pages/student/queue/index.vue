<template>
	<div>
		<NuxtLayout name="main" title="Queue" :back-navigation="{ text: 'Back to Dashboard', to: '/student' }">
			<section>
				<UCard>
					<template #header>
						<SharedTextSectionTitle> Current Status </SharedTextSectionTitle>
					</template>

					<div class="space-y-2">
						<div v-if="queueStore.queueStatus">
							<SharedTextBase> Public Code: {{ queueStore.queueStatus.publicCode }} </SharedTextBase>
							<SharedTextBase> Position: {{ queueStore.queueStatus.position }} </SharedTextBase>
							<SharedButtonCancel text="Leave Queue" @click="leaveQueue" />
						</div>
						<div v-else>
							<div v-if="cartStore.cart">
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

			<section>
				<UCard>
					<template #header>
						<SharedTextSectionTitle> Current Queue </SharedTextSectionTitle>
					</template>
					<UTable :data="queueStore.queue" :columns="tableColumns" :meta="meta" empty="No one currently in queue" />
				</UCard>
			</section>
		</NuxtLayout>
	</div>
</template>

<script lang="ts" setup>
definePageMeta({ layout: false })

const queueStore = useQueueStore()

const cartStore = useCartStore()

const columnsDef = [
	{ header: "Position", accessorKey: "position", type: "text" },
	{ header: "Display Name", accessorKey: "publicCode", type: "text" },
]
const tableColumns = buildNuxtUITable(columnsDef, {})

const meta = {
	class: {
		tr: (row) => {
			if (row.original.publicCode === queueStore.queueStatus?.publicCode) {
				return "bg-final-utd-green/10"
			}
			return ""
		},
	},
}

onMounted(async () => {
	await queueStore.getQueue()
	await queueStore.updateQueueStatus()
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
