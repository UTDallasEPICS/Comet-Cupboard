<template>
	<UBadge v-if="dealType === 'free'" class="bg-deal-green" label="Free" />
	<UBadge v-else-if="dealType === 'deal'" class="bg-deal-green" :label="`${props.itemDeal.actualCount} for ${props.itemDeal.adjustedCount}`" />
</template>

<script lang="ts" setup>
const props = defineProps({
	itemDeal: { type: Object, default: () => ({}) },
})
const dealType = computed(() => {
	if (!props.itemDeal || !("actualCount" in props.itemDeal) || !("adjustedCount" in props.itemDeal)) {
		return null
	}
	if (props.itemDeal.actualCount === 1 && props.itemDeal.adjustedCount === 0) {
		return "free"
	}
	return "deal"
})
</script>
