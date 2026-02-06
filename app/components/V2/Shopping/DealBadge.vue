<template>
	<!-- free deal -->
	<div v-if="badge === 'free'" class="absolute top-2 right-2 rounded-lg bg-green-500 text-white shadow" :style="badgeStyle">Free</div>

	<!-- deal badge -->
	<div v-else-if="badge === 'deal'" class="absolute top-2 right-2 rounded-lg bg-orange-500 text-white shadow" :style="badgeStyle">
		{{ quantity }} for {{ countsAs }}
	</div>
</template>

<script setup lang="ts">
const props = defineProps({
  badge: { type: String },
  quantity: { type: Number, default: 3 },
  countsAs: { type: Number, default: 1 },
  fontSize: { type: Number, default: 12 },
  paddingX: { type: Number, default: 6 },
  paddingY: { type: Number, default: 2 },
})

const badgeStyle = computed(() => ({
  fontSize: props.fontSize + 'px',
  padding: props.paddingY + 'px ' + props.paddingX + 'px',
}))
</script>
