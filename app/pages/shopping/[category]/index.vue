<template>
	<div class="p-4">
		<!-- nav back to category (use shared comp) -->
		<div class="mt-2 mb-1 flex w-full max-w-[320px] justify-start">
			<V2SharedNavigateBackButton backTo="Categories" @click="goBack" />
		</div>

		<!-- category title -->
		<h1 class="mt-1 mb-2 text-center text-2xl font-bold">{{ categoryTitle || "Category" }}</h1>
		<div class="mx-auto mb-6 flex w-full max-w-xl flex-col items-center">
			<!-- sortby -->
			<div class="mb-3 flex w-full justify-center">
				<Listbox v-model="sortOption" v-slot="{ open }">
					<div class="relative grow">
						<ListboxButton
							class="modal-button border-cupboardv2-lg flex h-8 w-full flex-row items-center rounded border bg-white px-3 text-left text-sm font-normal"
						>
							<div class="grow">{{ sortOption }}</div>
							<ChevronUpIcon v-if="open" class="fill-cupboardv2-dg stroke-cupboardv2-dg h-5" />
							<ChevronDownIcon v-else class="fill-cupboardv2-dg stroke-cupboardv2-dg h-5" />
						</ListboxButton>
						<TransitionsDropDown>
							<ListboxOptions
								class="divide-cupboard-lg drop-shadow-standard absolute top-10 z-50 max-h-48 w-full divide-y overflow-y-auto overscroll-contain rounded-xl bg-white"
							>
								<ListboxOption
									v-for="option in sortOptions"
									:key="option"
									:value="option"
									class="hover:bg-cupboardv2-lg cursor-pointer p-1 text-center text-sm text-wrap"
								>
									{{ option }}
								</ListboxOption>
							</ListboxOptions>
						</TransitionsDropDown>
					</div>
				</Listbox>
			</div>

			<!-- seach bar -->
			<div class="mb-6 flex w-full justify-center">
				<V2SharedSearchBar style="width: 320px" v-model="searchQuery" :category-items="filteredItems" />
			</div>
		</div>

		<!-- display items -->
		<div class="flex w-full justify-center">
			<div class="max-w-275px flex flex-col items-center">
				<div class="grid grid-cols-1 gap-y-4">
					<V2ShoppingItemCard
						v-for="item in filteredItems"
						:key="item.itemID"
						typeOfCard="SHOPPING"
						:imgName="item.imgName"
						:itemDeal="item.Deal ? { actualCount: item.Deal.actualCount, adjustedCount: item.Deal.adjustedCount } : {}"
						:itemID="item.itemID"
						:name="item.name"
					/>
				</div>
			</div>
		</div>
	</div>
</template>

<script setup lang="ts">
import { useRoute } from "vue-router"
import { useCartStore } from "~/stores/cart"
import { Listbox, ListboxButton, ListboxOption, ListboxOptions } from "@headlessui/vue"
import { ChevronDownIcon, ChevronUpIcon } from "@heroicons/vue/24/solid"
import Fuse from "fuse.js"

const sortOption = ref("Alphabetical") // default
const sortOptions = ["Alphabetical", "Frequently Selected", "Newest Items"]

const route = useRoute()
const store = useCartStore()

const { resetCartView, getCart } = store

const categoryTitle = route.params.category as string
const searchQuery = ref("")
const currentModal = ref("")
const verificationUpdate = ref<EventSource>()

const ModalType = Object.freeze({
	PENDING: "PENDING",
	ACCEPTING: "ACCEPTING",
	ACCEPTED: "ACCEPTED",
	REJECTED: "REJECTED",
})

const { data: allItems } = await useFetch("/api/inventory/items", {
	query: { checkAvailability: "true" },
})

const items = computed(() => {
	return (
		allItems.value?.filter((item) => {
			const itemCategory = item.categoryName?.trim().toLowerCase() || ""
			const currentCategory = categoryTitle?.trim().toLowerCase() || ""
			return itemCategory.includes(currentCategory)
		}) || []
	)
})

const currentCategory = computed(() => route.params.category)
const reactiveItems = ref<any[]>([])

watch(items, (val) => {
	reactiveItems.value = val || []
}, { immediate: true })

// Watches reactiveItems and currentCategory, returns only items whose categoryName matches the URL
const categoryItems = computed(() => {
	return reactiveItems.value.filter(
		item => item.categoryName?.toLowerCase() === currentCategory.value?.toLowerCase()
	)
})

const filteredItems = computed(() => {
  if(!categoryItems.value) return []

	// Sort by search
	const term = searchQuery.value.trim()
	let filtered: typeof categoryItems.value = []

	if(!term) {
		// Nothing searched, show all
		filtered = [...categoryItems.value]
	} else {
		const fuse = new Fuse(categoryItems.value, {
			keys: ["name"],
			threshold: 0.6,
		})
		filtered = fuse.search(term).map(r => r.item)
	}

  // Alphabetical
  if(sortOption.value === "Alphabetical") {
      filtered.sort((a, b) => a.name.localeCompare(b.name))
  }
  // Sort by frequently selected
  else if(sortOption.value === "Frequently Selected") {
      // Compares pairs of items and decides their order based on popualarity score
      filtered.sort((a, b) => {
          const aScore = computeExponentialWeight(a.popularityCounts || {})
          const bScore = computeExponentialWeight(b.popularityCounts || {})

          return bScore - aScore // descending order
      })
  // Sort by newest items
  } else if(sortOption.value === "Newest Items") {
      // Compares pairs of items and decides their order based on timestamp
      filtered.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
  }

	return filtered
})

// Function for computing exponential weight in frequency sorting
function computeExponentialWeight(counts: Record<string, number> = {}) {
    const DECAY_RATE = 0.7; // decay constant of a 3-day half-life, makes recent days matter most
    const MAX_DAYS = 3;

    const today = new Date()
    let score = 0

    // Iterate over each count
    for(const [dateStr, count] of Object.entries(counts || {})) {
        // Store day in a date object so we can do math w/ it
        const day = new Date(dateStr)
        // Converting time difference into days
        const diff = (today.getTime() - day.getTime()) / (1000 * 60 * 60 * 24)

        // Remove anything older than 3 days (last 3 days accounted for)
        if(diff <= MAX_DAYS) {
            const decay = Math.exp(-DECAY_RATE * diff) // Decay amount based on difference time (days)
            score += count * decay
        }
    }
    return score
}

const config = useRuntimeConfig()

if (import.meta.client) {
	verificationUpdate.value = new EventSource(`${config.public.LOCAL_URL}api/verification/cartRequestVerificationResponseWaiting`)

	verificationUpdate.value.onmessage = async (event) => {
		const { type } = JSON.parse(event.data)
		if (type === "REJECT CART") currentModal.value = ModalType.REJECTED
		if (type === "ACCEPT CART") currentModal.value = ModalType.ACCEPTED

		await getCart()
		resetCartView()
	}
}

onBeforeUnmount(() => {
	if (verificationUpdate.value) verificationUpdate.value.close()
	resetCartView()
})

const goBack = async () => await navigateTo("/shopping")
</script>
