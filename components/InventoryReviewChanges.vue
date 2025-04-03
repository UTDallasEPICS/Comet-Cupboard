<template lang="pug">
div.flex.flex-col.pt-2.pb-5.px-5.overflow-y-auto.overscroll-contain
	ControlsSource(@sourceChange="(selectedSource) => (source = selectedSource)").max-md_order-first.max-md_pb-3
	div.divide-y.divide-cupboard-lg.mb-5
		div(v-for="(change, index) in props.changes").py-2
			InventoryReviewItemCard(:change="change" :id="index")
	div.flex.flex-row.justify-end.space-x-5
		button(@click="emit('cancel')").modal-button.w-40.bg-cupboard-dg.text-white
			| Cancel
		button(v-if="source === ''" disabled).modal-button.bg-red-negative.text-white.w-full.sm_w-72 No Source Selected
		button(v-else @click="emit('accept', source)").modal-button.w-40.bg-utd-green.text-white
			| Submit
</template>

<script lang="ts" setup>
const props = defineProps({
	changes: {
		type: Object,
		required: true,
	},
})

const emit = defineEmits(["cancel", "accept", "sourceChange"])
const source = ref("")
</script>
