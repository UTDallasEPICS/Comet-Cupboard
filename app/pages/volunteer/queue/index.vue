<template>
	<div>
		<NuxtLayout name="main" :title="`Manage Queue`" :back-navigation="{ text: `Back to Dashboard`, to: '/volunteer' }">
			<USeparator class="my-4" />
			<section>
				<UCard>
					<SharedTextSectionTitle class="mb-4"> Cart Sessions </SharedTextSectionTitle>
					<div v-if="cartSessionsStore.cartSessions.length !== 0" class="flex flex-col gap-y-2">
						<div v-for="cart in cartSessionsStore.cartSessions" :key="cart.publicCode">
							<div class="flex flex-row items-center">
								<UUser :name="cart.publicCode" :avatar="{ icon: cart.publicIcon }" size="lg" />
							</div>
						</div>
					</div>
					<div v-else class="flex flex-col items-center justify-center gap-y-4">
						<SharedTextBase> No students in cupboard </SharedTextBase>
						<!-- <img src="/placeholderAsset.png" class="aspect-square w-48" alt="placeholder image" /> -->
					</div>
				</UCard>
			</section>

			<section>
				<UCard class="mt-4">
					<SharedTextSectionTitle class="mb-4"> Current Queue </SharedTextSectionTitle>
					<div v-if="queueStore.queue.length !== 0" class="flex flex-col gap-y-2">
						<div
							v-for="queueEntry in queueStore.queue"
							:key="queueEntry.position"
							class="flex flex-row items-center justify-between"
							:class="{
								'bg-utd-green/10': queueEntry.publicCode === queueStore.queueStatus?.publicCode,
								'rounded-lg': true,
							}"
						>
							<UUser
								:name="queueEntry.publicCode"
								:description="`Position: ${queueEntry.position}`"
								:avatar="{ icon: queueEntry.publicIcon }"
								size="lg"
							/>
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
					<div v-else class="flex flex-col items-center justify-center gap-y-4">
						<SharedTextBase> No students in queue </SharedTextBase>
						<!-- <img src="/placeholderAsset.png" class="aspect-square w-48" alt="placeholder image" /> -->
					</div>
				</UCard>
			</section>
		</NuxtLayout>
	</div>
</template>

<script lang="ts" setup>
definePageMeta({ layout: false })

const cartSessionsStore = useCartSessionsStore()
const queueStore = useQueueStore()

onMounted(async () => {
	await cartSessionsStore.getCartSessions()
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
