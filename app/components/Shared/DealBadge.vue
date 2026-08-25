<template>
	<UBadge
		v-if="dealType === 'free'"
		:ui="{
			base: 'h-5 px-2 leading-none',
		}"
		class="bg-deal-green"
		label="Free"
	/>
	<UBadge
		v-else-if="dealType === 'deal'"
		:ui="{
			base: 'h-5 px-2 leading-none',
		}"
		:label="`${itemDeal.actualCount} for ${itemDeal.adjustedCount}`"
	/>
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
