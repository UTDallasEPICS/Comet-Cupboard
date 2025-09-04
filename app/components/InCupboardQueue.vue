<template lang="pug">
div.w-full.flex.flex-col.border-2.border-utd-green.rounded-md.overflow-auto.bg-white
	div.text-2xl.font-bold.text-center.border-b-2.border-utd-green.bg-cupboard-mg.text-white
		| In Cupboard
	div(v-if="queue.length == 0").flex.flex-col.items-center.justify-center.h-72
		div.text-xl
			| Nobody is in the cupboard right now.
	div(v-else as="div").flex.flex-col.justify-start.items-start
		div(v-for="(queueItem, index) in queue" :key="index").w-full.mb-1
			div.flex.flex-row.justify-start.pl-2.gap-2
				div.w-4
					| {{ index + 1 }}
				div
					| {{ queueItem }}
</template>
<script lang="ts" setup>
const props = defineProps<{
	queue: string[]
}>()
</script>
