<template lang="pug">
  //-main continer
  div.flex.flex-col.min-h-screen.relative.items-center.p-4
  
    //- nav back to category (use shared comp)
    div.w-full.max-w-320px.mt-2.mb-1.flex.justify-start
      V2SharedNavigateBackButton(backTo="Categories" @click="goBack")
    
    //- category title
    h1.text-2xl.font-bold.text-center.mt-1.mb-2 {{ categoryTitle || "Category" }}
    div.max-w-xl.w-full
      //- sortby
      div.w-full.flex.justify-center.mb-3
        Listbox(v-model="sortOption" v-slot="{ open }")
            div.relative.grow
                ListboxButton.modal-button.flex.flex-row.w-full.bg-white.text-sm.px-3.items-center.text-left.font-normal.border.border-cupboardv2-lg.h-8
                    div.grow
                        | {{ sortOption }}
                    ChevronUpIcon(v-if="open").fill-cupboardv2-dg.stroke-cupboardv2-dg.h-5
                    ChevronDownIcon(v-else).fill-cupboardv2-dg.stroke-cupboardv2-dg.h-5
                TransitionsDropDown
                    ListboxOptions.absolute.top-10.z-50.bg-white.drop-shadow-standard.rounded-xl.w-full.max-h-48.divide-y.divide-cupboard-lg.overflow-y-auto.overscroll-contain
                        ListboxOption(
                            v-for="option in sortOptions"
                            :key="option"
                            :value="option"
                        ).p-1.text-center.text-sm.cursor-pointer.text-wrap.hover_bg-cupboardv2-lg
                            | {{ option }}
      
      //- seach bar
      div.w-full.flex.justify-center.mb-6
        V2SharedSearchBar(style="width: 320px" v-model="searchQuery" :category-items="filteredItems")

      //- display items
      div.w-full.flex.justify-center
        div.max-w-275px.flex.flex-col.items-center
          div.grid.grid-cols-1.gap-y-4
            V2ShoppingItemCard(
              v-for="item in filteredItems"
              :key="item.itemID"
              typeOfCard="SHOPPING"
              :imgName="item.imgName"
              :itemDeal="item.Deal ? { actualCount: item.Deal.actualCount, adjustedCount: item.Deal.adjustedCount } : {}"
              :itemID="item.itemID"
              :name="item.name"
            )
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

const goBack = async () => await navigateTo("/v2/shopping")
</script>
