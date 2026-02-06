<template>
	<div>
		<div class="mt-20 flex flex-col items-center gap-3 p-6 pt-10 lg:items-start">
			<!-- Source Dropdown -->
			<Listbox v-model="selectedSource" v-slot="{ open }">
				<div class="relative">
					<ListboxButton class="modal-buttonflex w-72 flex-row items-center border-2 bg-white px-4 text-left">
						<div class="grow">
							{{ selectedSource || "Source" }}
						</div>
						<ChevronUpIcon v-if="open" class="h-7" />
						<ChevronDownIcon v-else class="h-7" />
					</ListboxButton>
					<ListboxOptions
						class="drop-shadow-standard absolute top-14 z-50 max-h-36 w-full divide-y overflow-y-auto overscroll-contain rounded-xl bg-white"
					>
						<ListboxOption
							v-for="source in sources"
							:key="source.name"
							:value="source.name"
							class="hover:cursor-pointer p-1 text-center text-wrap"
						>
							{{ source.name }}
						</ListboxOption>
					</ListboxOptions>
				</div>
			</Listbox>
			<!-- Metadata input field -->
			<div v-if="fields.length > 0" class="flex flex-col gap-3 lg:flex-row">
				<div v-for="fieldName in fields" :key="fieldName" class="flex w-72 flex-col gap-1">
					<label :for="fieldName" class="">{{ fieldName }}</label>

					<div
						class="flex h-12 items-center rounded-md border border-gray-300 bg-white transition-all duration-50"
						:class="{ 'focus-within:drop-shadow-standard focus-within:border-blue-400': true }"
					>
						<input
							v-model="fieldInputs[fieldName]"
							type="text"
							placeholder="Enter data"
							:id="fieldName"
							class="w-full border-none bg-transparent pl-2 outline-none"
						/>
					</div>
				</div>
			</div>

			<!-- Small Screens (Rectangle Cards), width scales and keeps a single column format -->
			<div v-if="displayRectangleCards" class="mx-auto my-4 block flex w-full max-w-xl flex-col items-stretch gap-y-3">
				<V2InventoryReviewCardRectangle
					v-for="item in changedItems"
					:key="item.id"
					:adjustedCount="item.newCount"
					:imgName="item.imgName"
					:itemCount="item.oldCount"
					:itemName="item.name"
				></V2InventoryReviewCardRectangle>
			</div>
			<!-- Large Screens (Square Cards) -->
			<div
				v-if="displaySquareCards"
				:style="{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(200px, 250px))', gap: '1rem' }"
				class="mx-auto my-4 w-full"
			>
				<V2InventoryReviewCardSquare
					v-for="item in changedItems"
					:key="item.id"
					:adjustedCount="item.newCount"
					:imgName="item.imgName"
					:itemCount="item.oldCount"
					:itemName="item.name"
				></V2InventoryReviewCardSquare>
			</div>

			<!-- Footer Buttons -->
			<div class="lg_mt-0 lg_justify-end lg_self-end mt-32 flex flex-row gap-x-4">
				<button @click="goBack" class="drop-shadow-standard flex h-12 w-32 items-center justify-center rounded-xl">
					<p class="text-white">Cancel</p>
				</button>
				<button
					:class="selectedSource ? '' : '/40 cursor-not-allowed'"
					@click="submit"
					:disabled="!selectedSource"
					class="drop-shadow-standard flex h-12 w-32 items-center justify-center rounded-xl"
				>
					<p class="text-white">Submit</p>
				</button>
			</div>
		</div>
	</div>
</template>

<script lang="ts" setup>
import { ChevronDownIcon, ChevronUpIcon } from "@heroicons/vue/24/solid"
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
const changedItems = computed(() => inventoryStore.changedList)
const windowWidth = ref(0)

// --Page navigations for each button--
// Goes back to the inventory page for the current category
const goBack = () => {
	navigateTo(`/inventory/${categoryName}`)
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
		inventoryStore.resetChanges()
		navigateTo(`/inventory/${categoryName}`)
	} catch (error) {
		console.error("Error submitting item count changes:", error)
	}
}
</script>
