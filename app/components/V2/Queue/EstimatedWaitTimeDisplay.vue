<template>
	<div class="flex w-full min-w-72 flex-col overflow-auto rounded-xl bg-white px-4 pb-4">
		<!-- Displays the heading for the estimated wait time display: -->
		<div class="text-utd-green flex h-10 w-full items-center justify-center text-xl font-bold">
			<p>Estimated Wait Time:</p>
		</div>
		<!-- Displays the estimated wait time for the student in the queue: -->
		<div class="bg-cupboardv2-2elg flex h-9 w-full items-center justify-center rounded-xl">
			<p>{{ time }}</p>
		</div>
	</div>
</template>

<script lang="ts" setup>
const props = defineProps<{
	time: string//Estimated wait time for the student in the queue
}>()
</script>
