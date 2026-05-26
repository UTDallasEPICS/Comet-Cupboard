<template>
	<div class="relative cursor-pointer" :class="{ 'cursor-not-allowed opacity-50': cartDisabled }">
		<div class="relative flex items-center justify-center rounded-md bg-green-900" style="width: 50px; height: 50px; background-color: #154734">
			<UIcon :name="icons['shopping']" class="hover:text-final-utd-orange text-white transition-colors duration-200" style="width: 40px; height: 40px" />
			<!-- cart item animate open/close -->
			<div
				class="absolute origin-bottom transform rounded-sm bg-white transition-all duration-300"
				:class="cartView ? 'translate-x-[-40%] translate-y-[-180%] rotate-[-45deg] opacity-100' : 'translate-x-0 translate-y-0 rotate-0 opacity-0'"
				style="left: 35%; top: 40%; width: 10%; height: 8%"
			></div>

			<div
				class="absolute origin-bottom transform rounded-sm bg-white transition-all duration-300"
				:class="cartView ? 'translate-x-[0%] translate-y-[-200%] rotate-[60deg] opacity-100' : 'translate-x-0 translate-y-0 rotate-0 opacity-0'"
				style="left: 33%; top: 30%; width: 10%; height: 8%"
			></div>

			<div
				class="absolute origin-bottom transform rounded-sm bg-white transition-all duration-300"
				:class="cartView ? 'translate-x-[40%] translate-y-[-180%] rotate-[-60deg] opacity-100' : 'translate-x-0 translate-y-0 rotate-0 opacity-0'"
				style="left: 55%; top: 32%; width: 10%; height: 8%"
			></div>

			<!-- orange bubble -->
			<div
				v-if="cartTotalCount > 0"
				class="absolute right-0 flex items-center justify-center rounded-full text-white"
				style="width: 20px; height: 20px; background-color: #e87500; top: 4px"
			>
				{{ cartTotalCount }}
			</div>
		</div>
	</div>
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
