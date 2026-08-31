<template>
	<UModal v-model:open="isOpen" title="Nutrition Label">
		<SharedButtonActionButton icon="i-lucide-info" button-variant="ghost" action="neutral" size="sm" aria-label="View nutrition label" />
		<template #content>
			<SharedLayoutSectionUCard title="Nutrition Label">
				<template #header>
					<SharedButtonActionButton icon="i-lucide-x" button-variant="ghost" action="neutral" size="sm" aria-label="Close" @click="isOpen = false" />
				</template>
				<img :src="`/api/public/image/${imgName}`" alt="Nutrition label" class="border-border-soft mx-auto max-h-[70vh] rounded-lg border object-contain" />
			</SharedLayoutSectionUCard>
		</template>
	</UModal>
</template>

<script setup lang="ts">
defineProps<{
	imgName: string
}>()

const isOpen = ref(false)
</script>
