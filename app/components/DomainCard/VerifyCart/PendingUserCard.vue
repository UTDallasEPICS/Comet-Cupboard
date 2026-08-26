<template>
	<SharedButtonActionButton :button-variant="selected ? 'soft' : 'ghost'" class="h-12 w-full" justify="start" @click="emit('select', publicCode)">
		<UUser :name="publicCode" :avatar="{ icon: publicIcon }" size="lg" />
	</SharedButtonActionButton>
</template>

<script setup lang="ts">
defineProps<{
	publicCode: string
	publicIcon: string
	selected: boolean
}>()

const emit = defineEmits<{
	select: [publicCode: string]
}>()
</script>
