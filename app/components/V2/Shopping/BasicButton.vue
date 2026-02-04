<template>
	<!-- basic button -->
	<button
		class="flex items-center justify-center rounded-md shadow-md hover:opacity-90"
		:style="{ position: 'absolute', top: top + 'px', left: left + 'px', backgroundColor: color }"
		@click="$emit('click')"
	>
		<span class="text-white">{{ label }}</span>
	</button>
</template>

<script setup lang="ts">
defineProps({
	label: { type: String, default: "Button" },
	color: { type: String, default: "#4A4A4A" },
	top: { type: Number, default: 0 },
	left: { type: Number, default: 0 },
})

defineEmits(["click"])
</script>
