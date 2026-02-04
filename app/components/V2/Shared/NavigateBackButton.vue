<template>
	<button class="flex items-center gap-x-2">
		<ArrowLeftIcon class="h-4 w-4 stroke-2" />
		<p class="text-cupboardv2-dg text-base">{{ backTo }}</p>
	</button>
</template>

<script lang="ts" setup>
import { ArrowLeftIcon } from "@heroicons/vue/24/outline"

const props = defineProps({
	backTo: {
		type: String,
		default: "Page name",
	},
})
</script>
