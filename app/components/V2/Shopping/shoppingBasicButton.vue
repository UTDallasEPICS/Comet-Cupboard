<template>
	<button
		class="shadow-md rounded-[7px] flex items-center justify-center w-[142px] h-[43px]"
		:style="{
			position: 'absolute',
			top: top + 'px',
			left: left + 'px',
			backgroundColor: color,
		}"
		@click="$emit('click')"
	>
		<span class="text-white font-montserrat font-bold text-[18px] leading-[22px]">
			{{ label }}
		</span>
	</button>
</template>

<script setup>
defineProps({
	label: { type: String, default: "Button" }, // Button text
	color: { type: String, default: "#4A4A4A" }, // Default gray color
	top: { type: Number, default: 478 },
	left: { type: Number, default: 165 },
})

defineEmits(["click"])
</script>

<style scoped></style>
