<template>
	<UCollapsible class="w-full">
		<UButton color="neutral" variant="ghost" block class="w-full justify-between">
			<div class="flex min-w-0 items-center gap-3 text-left">
				<UUser :name="queueEntry.publicCode" :description="`Position: ${queueEntry.position}`" :avatar="{ icon: queueEntry.publicIcon }" size="lg" />
			</div>

			<div class="flex shrink-0 items-center gap-2">
				<UBadge v-if="queueEntry.queuePingAcknowledgedAt" label="Acknowledged" color="secondary" variant="subtle" />

				<UBadge v-else-if="queueEntry.queuePingSentAt" label="Ping sent" color="neutral" variant="subtle" />

				<UIcon name="i-lucide-chevron-down" class="size-5" />
			</div>
		</UButton>

		<template #content>
			<div class="flex flex-wrap justify-end gap-2 border-t p-3">
				<SharedConfirmationModal
					title="Confirm Removal?"
					description="This action cannot be undone."
					confirm-text="Confirm Removal"
					@confirm="emit('remove', queueEntry.publicCode)"
				>
					<UButton label="Remove" icon="i-lucide-user-round-minus" color="error" />
				</SharedConfirmationModal>

				<UButton label="Approve" icon="i-lucide-check" color="secondary" @click="emit('approve', queueEntry)" />

				<UButton
					label="Ping"
					icon="i-lucide-send"
					color="neutral"
					variant="outline"
					:loading="isSendingNotification && notificationPublicCode === queueEntry.publicCode"
					@click="emit('ping', queueEntry.publicCode)"
				/>
			</div>

			<SharedTextBaseSecondary v-if="queueEntry.queuePingAcknowledgedAt" class="px-3 pb-3">
				{{ queueEntry.queuePingAcknowledgementMessage || "Acknowledged" }}
			</SharedTextBaseSecondary>
		</template>
	</UCollapsible>
</template>

<script setup lang="ts">
defineProps<{
	queueEntry: {
		publicCode: string
		publicIcon: string
		position: number
		queuePingAcknowledgedAt?: string | null
		queuePingSentAt?: string | null
		queuePingAcknowledgementMessage?: string | null
	}
	isSendingNotification: boolean
	notificationPublicCode: string | null
}>()

const emit = defineEmits<{
	remove: [publicCode: string]
	approve: [queueEntry: unknown]
	ping: [publicCode: string]
}>()
</script>
