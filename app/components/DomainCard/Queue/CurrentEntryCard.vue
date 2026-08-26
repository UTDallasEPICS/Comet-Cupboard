<template>
	<div class="border-border-soft flex w-full items-center rounded-lg border p-3" :class="{ 'bg-utd-green/10': isCurrent }">
		<UUser :name="queueEntry.publicCode" :description="`Position: ${queueEntry.position}`" :avatar="{ icon: queueEntry.publicIcon }" size="lg" />
	</div>
</template>

<script setup lang="ts">
defineProps<{
	queueEntry: {
		publicCode: string
		publicIcon: string
		position: number
	}
	isCurrent: boolean
}>()
</script>
