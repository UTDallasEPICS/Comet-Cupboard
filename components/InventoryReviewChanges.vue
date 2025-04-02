<template lang="pug">
div.flex.flex-col.pt-2.pb-5.px-5.overflow-y-auto.overscroll-contain
	container.flex
		ControlsSource(@sourceChange="(selectedSource) => (source = selectedSource)").max-md_order-first.max-md_pb-3
		input(placeholder="Enter new source" type="text" v-model="newSource" @keydown.enter="addSource").flex-1.p-2.border.rounded-lg.outline-none
		button(@click="addSource").bg-utd-green.text-white.rounded-full.w-12.h-10.flex.place-content-center.place-items-center.hover_drop-shadow-standard
			PlusIcon.fill-white.stroke-white.h-6
	div.divide-y.divide-cupboard-lg.mb-5
		div(v-for="(change, index) in props.changes").py-2
			InventoryReviewItemCard(:change="change" :id="index")
	div.flex.flex-row.justify-end.space-x-5
		button(@click="emit('cancel')").modal-button.w-40.bg-red-negative.text-white
			| Cancel
		button(v-if="source === ''").modal-button.bg-red-negative.text-white.w-full.sm_w-72.cursor-not-allowed.pointer-events-auto No Source Selected
		button(v-else @click="emit('accept', source)").modal-button.w-40.bg-utd-green.text-white
			| Submit
</template>

<script lang="ts" setup>
import { PlusIcon } from "@heroicons/vue/24/solid"

const newSource = ref("")

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
	newSource.value = ""
}

const emit = defineEmits(["cancel", "accept", "sourceChange"])
const source = ref("")
</script>
