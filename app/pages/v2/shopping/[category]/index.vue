<template lang="pug">
  //-main continer
  div.flex.flex-col.bg-gray-100.min-h-screen.relative.items-center.p-4
  
    //- nav back to category (use shared comp)
    div.w-full.max-w-320px.mt-2.mb-1.flex.justify-start
      V2SharedNavigateBackButton(backTo="Categories" @click="goBack")
    
    //- category title
    h1.text-2xl.font-bold.text-center.mt-1.mb-2 {{ categoryTitle || "Category" }}

    //- sortby
    div.w-full.flex.justify-center.mb-3
      div.flex.gap-2.items-center
        Listbox(v-model="sortOption" v-slot="{ open }")
          div.relative
            ListboxButton.modal-button.flex.flex-row.w-72.bg-white.text-lg.px-4.items-center.text-left.font-normal.border-2.border-cupboardv2-lg
              div.grow
                | {{ sortOption }}
              ChevronUpIcon(v-if="open").fill-cupboardv2-dg.stroke-cupboardv2-dg.h-5
              ChevronDownIcon(v-else).fill-cupboardv2-dg.stroke-cupboardv2-dg.h-5
            TransitionsDropDown
              ListboxOptions.absolute.top-12.z-50.bg-white.drop-shadow-standard.rounded-xl.w-full.max-h-36.divide-y.divide-cupboard-lg.overflow-y-auto.overscroll-contain
                ListboxOption(
                  v-for="option in sortOptions"
                  :key="option"
                  :value="option"
                ).p-1.text-center.text-lg.cursor-pointer.text-wrap.hover_bg-cupboardv2-lg
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

const sortOption = ref("Frequently Selected") // default
const sortOptions = ["Frequently Selected", "Newest Items","Deals", "Expired"]

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

const filteredItems = computed(() => {
	const query = searchQuery.value.trim().toLowerCase()
	if (!query) return items.value
	return items.value.filter((item) => item.name.toLowerCase().includes(query))
})

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
