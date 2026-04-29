<template>
	<UContainer class="py-8">
		<header>
			<SharedTextPageTitle>Queue</SharedTextPageTitle>
		</header>

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
import { driver } from 'driver.js'
import 'driver.js/dist/driver.css'

onMounted(async () => {
	await getQueue()
	await updateQueueStatus()

	const driverObj = driver({
		showProgress: false,
		steps: [
			{
				element: '#status',
				popover: {
					title: 'Current Status',
					description: 'Click Join Queue to get in line. Once joined you can see your position and public display name.',
                    side: 'bottom',
				}
			},
			{
				element: '#queue',
                popover: {
                    title: 'Current Queue',
                    description: 'See everyone currently waiting in the queue. Your row will be highlighted when you join.',
                    side: 'bottom',
				}
			}
		]
	})

	driverObj.drive()
})

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

onMounted(async () => {
	await getQueue()
	await updateQueueStatus()
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
