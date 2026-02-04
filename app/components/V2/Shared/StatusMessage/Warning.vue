<template>
	<div class="bg-yellow-warningv2 flex h-24 w-full max-w-[600px] items-center justify-center rounded-xl px-3">
		<!-- Warning name/icon -->
		<ExclamationTriangleIcon class="h-10 w-10 flex-shrink-0" />
		<p class="ml-3 overflow-hidden text-left text-base font-medium break-words whitespace-normal">
			{{ warningMessage }}
		</p>
	</div>
</template>

<script lang="ts" setup>
import { ExclamationTriangleIcon } from "@heroicons/vue/24/solid"

const props = defineProps({
	warningMessage: {
		type: String,
		default: "This is a very scary warning",
	},
})
</script>
