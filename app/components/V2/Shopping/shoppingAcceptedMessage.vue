<template>
	<div class="relative w-full h-[97px] bg-[#8ABF65] rounded-none flex items-center justify-center px-4">
		<p class="font-montserrat font-medium text-[20px] leading-[24px] text-black text-center">
			Your cart has been accepted. Automatically signing out in {{ countdown }}...
		</p>
	</div>
</template>

<script setup>
defineProps({
	countdown: {
		type: Number,
		required: true,
	},
})
</script>

<style scoped></style>
