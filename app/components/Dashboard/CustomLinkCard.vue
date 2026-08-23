<template>
	<UButton :to="url" class="border-border-soft w-full border bg-white p-4 shadow-md">
		<div class="flex items-center gap-4">
			<UIcon name="i-lucide-external-link" class="text-text-soft h-8 w-8" />

			<div class="flex flex-col text-left">
				<SharedTextCardTitle>{{ displayName }}</SharedTextCardTitle>
				<SharedTextBase class="text-nowrap">
					{{ description }}
				</SharedTextBase>
			</div>
		</div>
	</UButton>
</template>

<script setup lang="ts">
const props = defineProps({
	dashboardLinkID: { type: String, required: true },
	url: { type: String, required: true },
	displayName: { type: String, required: true },
	description: { type: String, required: true },
})
</script>
