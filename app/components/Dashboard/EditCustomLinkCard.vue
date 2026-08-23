<template>
	<UCard
		class="border-border-soft w-full border bg-white shadow-md"
		:ui="{
			body: 'p-4 py-4 sm:p-4 sm:py-4',
		}"
	>
		<div class="flex items-center gap-4">
			<UIcon name="i-lucide-external-link" class="text-text-soft h-8 w-8" />

			<div class="flex flex-col text-left">
				<SharedTextCardTitle>{{ displayName }}</SharedTextCardTitle>
				<SharedTextBase class="text-nowrap">
					{{ description }}
				</SharedTextBase>
			</div>

			<div class="ml-auto flex gap-1">
				<UButton icon="i-lucide-edit" variant="ghost" color="neutral" :to="`/head-admin/dashboard-links/${dashboardLinkID}/edit`" />
				<UModal v-model:open="isDeleteModalOpen">
					<UButton icon="i-lucide-trash-2" color="error" variant="ghost" />
					<template #content>
						<UCard>
							<SharedTextCardTitle>Confirm Deletion?</SharedTextCardTitle>
							<USeparator class="my-2" />
							<div class="mt-4 flex flex-row items-center justify-center gap-2">
								<SharedButtonCancel text="Cancel" @click="isDeleteModalOpen = false" />
								<SharedButtonNegativeAction text="Confirm Deletion" @click="emit('deleteLink')" />
							</div>
						</UCard>
					</template>
				</UModal>
			</div>
		</div>
	</UCard>
</template>

<script setup lang="ts">
const props = defineProps({
	dashboardLinkID: { type: String, required: true },
	url: { type: String, required: true },
	displayName: { type: String, required: true },
	description: { type: String, required: true },
})

const emit = defineEmits(["deleteLink"])
const isDeleteModalOpen = ref(false)
</script>
