<template>
	<div
		class="absolute top-2 right-2 bg-green-500 text-white text-[12px] font-bold px-2 py-1 rounded-lg shadow"
		:style="{ fontSize: fontSize + 'px', padding: paddingY + 'px ' + paddingX + 'px' }"
	>
		Free
	</div>
</template>

<script setup>
const props = defineProps({
	fontSize: { type: Number, default: 12 },
	paddingX: { type: Number, default: 6 },
	paddingY: { type: Number, default: 2 },
})
</script>

<style scoped></style>
