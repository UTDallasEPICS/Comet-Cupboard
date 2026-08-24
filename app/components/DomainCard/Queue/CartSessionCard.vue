<template>
	<UCollapsible class="w-full">
		<UButton color="neutral" variant="ghost" block class="w-full justify-between">
			<UUser :name="cart.publicCode" :avatar="{ icon: cart.publicIcon }" size="lg" />

			<UIcon name="i-lucide-chevron-down" class="size-5" />
		</UButton>

		<template #content>
			<div class="flex flex-wrap items-center justify-between gap-3 border-t p-3">
				<SharedTextBaseSecondary> Current session: {{ formatSessionDuration(cart.createdAt) }} </SharedTextBaseSecondary>

				<SharedConfirmationModal
					title="Confirm Cancel?"
					description="This action cannot be undone."
					confirm-text="Confirm Cancel"
					@confirm="emit('cancel', cart.publicCode)"
				>
					<UButton label="Cancel Session" icon="i-lucide-x" color="error" />
				</SharedConfirmationModal>
			</div>
		</template>
	</UCollapsible>
</template>

<script setup lang="ts">
defineProps<{
	cart: {
		publicCode: string
		publicIcon: string
		createdAt: string
	}
}>()

const emit = defineEmits<{
	cancel: [publicCode: string]
}>()

const currentTime = ref(Date.now())

const sessionDurationTimer = ref<NodeJS.Timeout | null>(null)

onMounted(() => {
	sessionDurationTimer.value = setInterval(() => {
		currentTime.value = Date.now()
	}, 1_000)
})

onBeforeUnmount(() => {
	if (sessionDurationTimer.value) {
		clearInterval(sessionDurationTimer.value)
	}
})

const formatSessionDuration = (createdAt: string | Date) => {
	const elapsedSeconds = Math.max(0, Math.floor((currentTime.value - new Date(createdAt).getTime()) / 1_000))
	const hours = Math.floor(elapsedSeconds / 3_600)
	const minutes = Math.floor((elapsedSeconds % 3_600) / 60)
	const seconds = elapsedSeconds % 60
	return hours ? `${hours}h ${minutes}m ${seconds}s` : `${minutes}m ${seconds}s`
}
</script>
