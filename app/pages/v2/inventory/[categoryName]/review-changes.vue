<template lang="pug">
div
	div.flex.absolute.top-20.left-0.w-full.h-16.z-30.justify-center
		V2SharedHeaderSubheader(pageTitle="Review Changes")(class="md_max-w-[600px]").md_rounded-b-3xl
	div.flex.flex-col.items-center.p-6.gap-3.lg_items-start.pt-10.mt-20
		// Source Dropdown
		Listbox(v-model="selectedSource" v-slot="{ open }")
			div.relative
				ListboxButton.modal-button.flex.flex-row.w-72.bg-white.text-lg.px-4.items-center.text-left.font-normal.border-2.border-cupboardv2-lg
					div.grow
						| {{ selectedSource || "Source" }}
					ChevronUpIcon(v-if="open").fill-cupboardv2-dg.stroke-cupboardv2-dg.h-7
					ChevronDownIcon(v-else).fill-cupboardv2-dg.stroke-cupboardv2-dg.h-7
				TransitionsDropDown
					ListboxOptions.absolute.top-14.bg-white.drop-shadow-standard.rounded-xl.w-full.max-h-36.divide-y.divide-cupboard-lg.overflow-y-auto.overscroll-contain.z-50
						ListboxOption(
							v-for="source in sources"
							:key="source.name"
							:value="source.name"
						).p-1.text-center.text-lg.cursor-pointer.text-wrap.hover_bg-cupboardv2-lg
							| {{ source.name }}
		// Metadata input field
		div(v-if="fields.length > 0").flex.flex-col.lg_flex-row.gap-3
			div(v-for="fieldName in fields" :key="fieldName").flex.flex-col.gap-1.w-72
				label(:for="fieldName").text-lg.font-semibold {{ fieldName }}

				div.bg-white.h-12.rounded-md.flex.items-center.border.border-gray-300.transition-all.duration-50(
					class="focus-within_border-blue-400 focus-within_drop-shadow-standard"
				)
					input.w-full.bg-transparent.outline-none.border-none.text-base.pl-2(
						type="text"
						placeholder="Enter data"
						:id="fieldName"
						v-model="fieldInputs[fieldName]"
					)

		// Small Screens (Rectangle Cards), width scales and keeps a single column format
		div(v-if="displayRectangleCards").flex.flex-col.gap-y-3.my-4.items-stretch.block.w-full.max-w-xl.mx-auto
			V2InventoryReviewCardRectangle(
				v-for="item in changedItems"
				:key="item.id"
				:adjustedCount="item.newCount"
				:imgName="item.imgName"
				:itemCount="item.oldCount"
				:itemName="item.name"
			).w-full
		// Large Screens (Square Cards)
		div(v-if="displaySquareCards" :style="{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(200px, 250px))', gap: '1rem' }").my-4.w-full.mx-auto
			V2InventoryReviewCardSquare(
				v-for="item in changedItems"
				:key="item.id"
				:adjustedCount="item.newCount"
				:imgName="item.imgName"
				:itemCount="item.oldCount"
				:itemName="item.name"
			)

		// Footer Buttons
		div.flex.flex-row.gap-x-4.mt-32.lg_mt-0.lg_justify-end.lg_self-end
			button(@click="goBack").bg-cupboardv2-dg.w-32.h-12.rounded-xl.flex.items-center.justify-center.drop-shadow-standard
				p.text-white.text-xl.font-bold Cancel
			button(
				:class="selectedSource ? 'bg-utd-orange' : 'bg-utd-orange/40 cursor-not-allowed'"
				@click="submit"
				:disabled="!selectedSource"
			).w-32.h-12.rounded-xl.flex.items-center.justify-center.drop-shadow-standard
				p.text-white.text-xl.font-bold Submit
</template>

<script lang="ts" setup>
import { CloudArrowUpIcon, ChevronDownIcon, ChevronUpIcon } from "@heroicons/vue/24/solid"
import { Listbox, ListboxButton, ListboxOption, ListboxOptions } from "@headlessui/vue"
import { useRoute, navigateTo } from "#imports"
import { useInventoryStore } from "~/stores/useInventoryStore"

const route = useRoute()
const categoryName = route.params.categoryName as string
const selectedSource = ref<string | null>(null)
const { data: sources } = await useFetch("/api/controls/sources")
const fields = ref<string[]>([])
const fieldInputs = ref<Record<string, string>>({})
const inventoryStore = useInventoryStore()
const changedItems = computed(() => inventoryStore.changedItems)
const windowWidth = ref(0)

// --Page navigations for each button--
// Goes back to the inventory page for the current category
const goBack = () => {
	navigateTo(`/v2/inventory/${categoryName}`)
}

// Determining when to display rectangle cards and square cards
onMounted(() => {
	windowWidth.value = window.innerWidth
	window.addEventListener("resize", () => {
		windowWidth.value = window.innerWidth
	})
})

// Handling metadata being present in a source
watch(selectedSource, async (newSource) => {
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

// For rectangle cards
const displayRectangleCards = computed(() => windowWidth.value < 1024) // Width is less than 1024
// For square cards
const displaySquareCards = computed(() => windowWidth.value >= 1024) // Width is greater than or equal to 1024

watchEffect(() => {
	console.log("changedItems:", changedItems.value)
})

const submit = async () => {
	try {
		if (!selectedSource.value) return

		const inventoryCountChanges = changedItems.value.map((item) => ({
			itemID: item.id,
			countChange: item.newCount - item.oldCount,
		}))

		await $fetch("/api/inventory/itemCountChanges", {
			method: "POST",
			body: {
				source: selectedSource.value,
				fieldMap: fieldInputs.value,
				inventoryCountChanges,
			},
		})
		navigateTo(`/v2/inventory/${categoryName}`)
	} catch (error) {
		console.error("Error submitting item count changes:", error)
	}
}
</script>
