<template>
	<div class="flex w-full min-w-72 flex-col overflow-auto rounded-xl bg-white px-4 pb-4">
		<!-- Displays the heading for the cupboard display: -->
		<div class="text-utd-green flex h-10 w-full items-center justify-center">
			<p>In Cupboard</p>
		</div>
		<!-- Displays the number of students in the cupboard: -->
		<div class="bg-cupboardv2-2elg flex h-9 w-full items-center justify-center rounded-xl">
			<p># of students: {{ queue.length }}</p>
		</div>
	</div>
</template>

<script lang="ts" setup>
const props = defineProps<{
	queue: string[]//List of students in the cupboard
}>()
</script>
