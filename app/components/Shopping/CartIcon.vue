<template>
	<UChip
		:show="cartTotalCount > 0"
		:text="cartTotalCount"
		:ui="{
			base: 'h-[20px] min-w-[20px] text-[20px] ring-0 text-sm',
		}"
	>
		<div class="relative cursor-pointer" :class="{ 'cursor-not-allowed opacity-50': cartDisabled }">
			<div class="relative flex items-center justify-center rounded-md" style="width: 24px; height: 24px">
				<UIcon :name="icons['shopping']" class="hover:text-utd-orange text-white transition-colors duration-200" style="width: 40px; height: 40px" />
				<!-- cart item animate open/close -->
				<div
					class="absolute origin-bottom transform rounded-sm bg-white transition-all duration-300"
					:class="cartView ? 'translate-x-[-40%] translate-y-[-180%] rotate-[-45deg] opacity-100' : 'translate-x-0 translate-y-0 rotate-0 opacity-0'"
					style="left: 45%; top: 20%; width: 15%; height: 15%"
				></div>

				<div
					class="absolute origin-bottom transform rounded-sm bg-white transition-all duration-300"
					:class="cartView ? 'translate-x-[0%] translate-y-[-200%] rotate-[60deg] opacity-100' : 'translate-x-0 translate-y-0 rotate-0 opacity-0'"
					style="left: 43%; top: 10%; width: 15%; height: 15%"
				></div>

				<div
					class="absolute origin-bottom transform rounded-sm bg-white transition-all duration-300"
					:class="cartView ? 'translate-x-[40%] translate-y-[-180%] rotate-[-60deg] opacity-100' : 'translate-x-0 translate-y-0 rotate-0 opacity-0'"
					style="left: 65%; top: 12%; width: 15%; height: 15%"
				></div>
			</div>
		</div>
	</UChip>
</template>

<script setup lang="ts">
const props = defineProps({
	cartView: {
		type: Boolean,
		required: true,
	},
	cartDisabled: {
		type: Boolean,
		required: true,
	},
	cartTotalCount: {
		type: Number,
		default: 0,
	},
})
</script>
