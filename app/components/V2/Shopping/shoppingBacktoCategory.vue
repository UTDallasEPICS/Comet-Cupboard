<template>
	<div class="flex items-center space-x-1 h-[9px]">
		<!-- clickable arrow + text section -->
		<button @click="goBack" class="flex items-center space-x-1 focus:outline-none">
			<!-- left arrow SVG -->
			<svg xmlns="http://www.w3.org/2000/svg" class="w-2.5 h-2.5 text-[#4A4A4A]" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
				<path stroke-linecap="round" stroke-linejoin="round" d="M15 19l-7-7 7-7" />
			</svg>

			<!-- categories text -->
			<span class="font-montserrat font-bold text-[7px] leading-[9px] text-[#4A4A4A]"> Categories </span>
		</button>
	</div>
</template>

<script setup>
function goBack() {
	router.push("/v2/shopping")
}
</script>

<style scoped>
</style>
