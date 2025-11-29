<template>
	<div
		v-if="badge === 'free'"
		class="absolute top-2 right-2 bg-green-500 text-white font-bold rounded-lg shadow"
		:style="{ fontSize: fontSize + 'px', padding: paddingY + 'px ' + paddingX + 'px' }"
	>
		Free
	</div>

	<div
		v-else-if="badge === 'deal'"
		class="absolute top-2 right-2 bg-orange-500 text-white font-bold rounded-lg shadow"
		:style="{ fontSize: fontSize + 'px', padding: paddingY + 'px ' + paddingX + 'px' }"
	>
		{{ quantity }} for {{ countsAs }}
	</div>
</template>

<script setup>
const props = defineProps({
	badge: { type: String, default: null },
	quantity: { type: Number, default: 3 },
	countsAs: { type: Number, default: 1 },
	fontSize: { type: Number, default: 12 },
	paddingX: { type: Number, default: 6 },
	paddingY: { type: Number, default: 2 },
})
</script>
