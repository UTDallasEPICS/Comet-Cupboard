<template lang="pug">
div.flex.flex-col.pt-2.pb-5.px-5.overflow-y-auto.overscroll-contain.relative
	Suspense
		template(#default)
			div
				SkeletonDummyTimer
				div.flex.items-start.gap-x-8.max-md_order-first.max-md_pb-3
					ControlsSource(@sourceChange="(selectedSource) => (source = selectedSource)").mr-3
					div(v-if="fields.length > 0").flex.flex-col.space-y-3
						div(v-for="fieldName in fields" :key="fieldName").flex.flex-col
							label(:for="fieldName").text-xl.font-semibold {{ fieldName }}
							input(type="text" v-model="fieldInputs[fieldName]" :id="fieldName").border.p-2.rounded-md
				div.divide-y.divide-cupboard-lg.mb-5
					div(v-for="(change, index) in props.changes" :key="index").py-2
						InventoryReviewItemCard(:change="change" :id="index")
					div.flex.flex-row.justify-end.space-x-5.mt-8
						button(@click="emit('cancel')").modal-button.w-40.bg-cupboard-dg.text-white
							| Cancel
						button(v-if="source === ''" disabled).modal-button.bg-cupboard-dg.text-white.w-full.sm_w-72
							| No Source Selected
						button(v-else @click="emit('accept', { source: source, fieldMap: fieldInputs })").modal-button.w-40.bg-utd-green.text-white
							| Submit

		//- Skeleton
		template(#fallback)
			div.flex.flex-row
				div.w-screen
					// page control components
					div.flex.flex-row.md_flex-row.pb-3.md_space-x-3 
						div.skeleton.w-full.h-12.md_w-44.rounded-xl
					//Boxes
					div.flex.flex-col.divide-y.divide-cupboard-lg.mb-5 
						div.skeleton.w-full.h-12.md_w-44.rounded-xl
					//Buttons
					div.flex.flex-row.justify-end.space-x-5
						div.skeleton.w-40.h-12.rounded-xl
						div.skeleton.w-72.h012.rounded-xl
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
const fields = ref<string[]>([])
const fieldInputs = ref<Record<string, string>>({})

watch(source, async (newSource) => {
	if (newSource) {
		const { data } = await useFetch("/api/controls/fields", {
			query: { source: newSource },
		})
		fields.value = data.value?.map((field) => field.name) || []
		fieldInputs.value = Object.fromEntries(fields.value.map((name) => [name, ""]))
	} else {
		fields.value = []
		fieldInputs.value = {}
	}
})
</script>
