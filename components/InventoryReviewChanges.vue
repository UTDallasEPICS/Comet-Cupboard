<template lang="pug">
div.flex.flex-col.pt-2.pb-5.px-5.overflow-y-auto.overscroll-contain.relative
	Suspense
		template(#default)
			div
				SkeletonDummyTimer
				div.flex.items-center.max-md_order-first.max-md_pb-3
					ControlsSource(:key="addedSource" @sourceChange="(selectedSource) => (source = selectedSource)").mr-3
					button(
						@click="showInput = !showInput"
					).bg-utd-green.text-white.rounded-full.min-w-12.min-h-12.flex.place-content-center.place-items-center.hover_drop-shadow-standard.overflow-y-auto.mr-3
						PlusIcon.fill-white.stroke-white.h-6
					input(
						v-if="showInput"
						placeholder="Enter new source"
						type="text"
						v-model="newSource"
						@keydown.enter="addSource"
					).flex-1.p-2.border.rounded-lg.outline-none.overflow-hidden.w-full
				div.divide-y.divide-cupboard-lg.mb-5
					div(v-for="(change, index) in props.changes").py-2
						InventoryReviewItemCard(:change="change" :id="index")
				div.flex.flex-row.justify-end.space-x-5
					button(@click="emit('cancel')").modal-button.w-40.bg-cupboard-dg.text-white
						| Cancel
					button(v-if="source === ''" disabled).modal-button.bg-cupboard-dg.text-white.w-full.sm_w-72 No Source Selected
					button(v-else @click="emit('accept', source)").modal-button.w-40.bg-utd-green.text-white
						| Submit
		template(#fallback)
			div.flex.flex-row
				div.w-screen
					// page control components
					div.flex.flex-row.md_flex-row.pb-3.md_space-x-3
						div.skeleton.w-full.h-12.md_w-44.rounded-xl
						//Circle Plus
						div.skeleton.w-12.h-12.rounded-full
					//Boxes
					div.flex.flex-col.divide-y.divide-cupboard-lg.mb-5
						div.skeleton.w-full.h-20.rounded-xl
					//Buttons
					div.flex.flex-row.justify-end.space-x-5
						div.skeleton.w-40.h-12.rounded-xl
						div.skeleton.w-72.h-12.rounded-xl
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
