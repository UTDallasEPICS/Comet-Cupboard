<template>
	<div class="relative flex w-full max-w-[320px] flex-col rounded p-4 shadow-md" style="height: 119px; background-color: #ffd580">
		<!-- header -->
		<div class="mb-2 flex justify-center">
			<span class=" text-black" style="font-size: 20px; line-height: 24px">Reason for rejection</span>
		</div>

		<!-- message -->
		<div class="flex flex-1 items-center px-2">
			<!-- warning icon -->
			<ExclamationTriangleIcon class="mr-3 flex-shrink-0 text-black" style="width: 24px; height: 24px" />

			<!-- dunamic Message -->
			<p class=" flex-1 text-left text-black" style="font-size: 16px; line-height: 20px">{{ message }}</p>
		</div>
	</div>
</template>

<script setup lang="ts">
import { ExclamationTriangleIcon } from "@heroicons/vue/24/outline"

defineProps({
	message: {
		type: String,
		default: "Sample message: blah bla bla blah.",
	},
})
</script>
