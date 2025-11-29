<template>
	<div class="relative flex flex-col font-[Montserrat] w-[278px]">
		<!-- sort by button -->
		<button
			@click="open = !open"
			class="flex justify-between items-center w-full bg-white border border-[#B9B9B9] rounded-md px-4 py-2 text-[14px] font-normal text-[#4A4A4A] cursor-pointer"
		>
			<span class="flex items-center font-normal">Sort By</span>
			<!-- downward arrow -->
			<span class="flex w-0 h-0 border-l-[5px] border-l-transparent border-r-[5px] border-r-transparent border-t-[6px] border-t-[#4A4A4A]"></span>
		</button>

		<!-- dropdown menu -->
		<div v-if="open" class="absolute top-full left-0 mt-2 w-full bg-white border border-[#B9B9B9] rounded-md flex flex-col z-20">
			<div
				v-for="(option, idx) in options"
				:key="option.label"
				@click="selectOption(option)"
				@mouseenter="hovered = idx"
				@mouseleave="hovered = null"
				:class="[
					'flex items-center px-4 py-2 text-[14px] text-[#4A4A4A] cursor-pointer select-none',
					hovered === idx ? 'bg-[#D9D9D9] rounded-md' : 'font-normal',
				]"
			>
				{{ option.label }}
			</div>
		</div>
	</div>
</template>

<script>
export default {
	name: "SortBy",
	data() {
		return {
			open: false,
			hovered: null,
			options: [{ label: "Newest" }, { label: "Oldest" }, { label: "Most Frequently Picked" }, { label: "Expired" }],
		}
	},
	methods: {
		selectOption(option) {
			//  logic here if needed
			this.open = false
		},
	},
}
</script>
