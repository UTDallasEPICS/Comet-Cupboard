<template lang="pug">
div.flex.flex-col.pt-2.pb-5.px-5.overflow-y-auto.overscroll-contain.relative
	div.flex.items-center.max-md_order-first.max-md_pb-3
		ControlsSource(:key="addedSource" @sourceChange="(selectedSource) => (source = selectedSource)").mr-3
		button(
			@click="showInput = !showInput"
		).bg-utd-green.text-white.rounded-full.w-12.h-12.flex.place-content-center.place-items-center.hover_drop-shadow-standard.overflow-y-auto.mr-3
			PlusIcon.fill-white.stroke-white.h-6
		input(v-if="showInput" placeholder="Enter new source" type="text" v-model="newSource" @keydown.enter="addSource").flex-1.p-2.border.rounded-lg.outline-none.overflow-hidden
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
import { PlusIcon } from "@heroicons/vue/24/solid"

const newSource = ref("")
// key used to refresh the source list when a new source is added
const addedSource = ref("")
const showInput = ref(false)

const props = defineProps({
	changes: {
		type: Object,
		required: true,
	},
})

const addSource = async () => {
	await $fetch("/api/inventory/source", {
		method: "PUT",
		body: JSON.stringify({ source: newSource.value }),
	})
	addedSource.value = newSource.value
	newSource.value = ""
}

const emit = defineEmits(["cancel", "accept", "sourceChange"])
const source = ref("")
</script>
