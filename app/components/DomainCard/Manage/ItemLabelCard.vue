<template>
	<UCard class="relative w-full">
		<SharedLabel :label="itemLabelName" :archived="archived" />
		<SharedButtonActionButton
			icon="i-lucide-pencil"
			action="neutral"
			button-variant="ghost"
			class="absolute top-2 right-2"
			aria-label="Edit item label"
			@click="emit('edit')"
		/>
	</UCard>
</template>

<script setup lang="ts">
defineProps<{ itemLabelName: string; archived: boolean }>()
const emit = defineEmits<{ edit: [] }>()
</script>