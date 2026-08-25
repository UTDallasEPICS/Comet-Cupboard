<template>
	<UCard
		class="border-border-soft w-full border bg-white shadow-md"
		:ui="{
			body: 'p-4 py-4 sm:p-4 sm:py-4',
		}"
	>
		<div class="flex items-center gap-4">
			<SharedIcon name="i-lucide-external-link" class="text-text-soft h-8 w-8" />

			<div class="flex flex-col text-left">
				<SharedTextCardTitle>{{ displayName }}</SharedTextCardTitle>
				<SharedTextBase class="text-nowrap">
					{{ description }}
				</SharedTextBase>
			</div>

			<SharedButtonActionButton
				class="ml-auto"
				icon="i-lucide-edit"
				variant="ghost"
				color="neutral"
				:to="`/head-admin/dashboard-links/${dashboardLinkID}/edit`"
			/>
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
