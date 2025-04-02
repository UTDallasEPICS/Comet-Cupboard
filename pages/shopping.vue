<template lang="pug">
div
	Suspense
		template(#default)
			div
				SkeletonDummyTimer
				div.flex.flex-row
					div.w-screen
						div.flex.flex-col.md_flex-row.pb-7.max-md_space-y-3.md_space-x-10.sm_text-nowrap
							div.flex.flex-col.md_flex-row.md_space-x-5
								ControlsFilter(@filterChange="(selectedFilters) => (filters = selectedFilters)")
							div.flex.grow
								ControlsSearch(@searchTermChange="(newTerm) => (searchTerm = newTerm)")
						CategoryItemsGrid(v-for="category in Object.keys(filteredCategoryItems)" :headingName="category").my-4
							ItemCard(
								v-for="item in filteredCategoryItems[category]"
								typeOfCard="SHOPPING"
								:imgName="item.imgName"
								:itemDeal="item.Deal ? { actualCount: item.Deal.actualCount, adjustedCount: item.Deal.adjustedCount } : {}"
								:itemID="item.itemID"
								:name="item.name"
							)
				div.sticky.bottom-5.flex.justify-end
					button(class="w-[50px]" @click="scrollToTop").button.bg-utd-green.text-white.pointer-events-auto
						ChevronUpIcon.m-auto.h-6.fill-white.stroke-white
				TransitionsSlideLeft
					CartView(v-if="cartView" @openPendingModal="currentModal = ModalType.PENDING").fixed.z-50.right-0.top-20.bottom-0
				// Pending Review Pop-Up
				Modal(v-if="currentModal == ModalType.PENDING" title="Pending Review" @toggleModal="closeModal")
					div.flex.flex-col.p-5
						div.text-xl.h-20
							| Your cart has been submitted, please take it to a volunteer for review.
						div.flex.flex-row.mt-auto
							button(@click="retractCart").modal-button.bg-utd-orange.text-white.ml-auto.w-full.sm_w-32.mr-5
								| Edit Cart
							button(@click="closeModal").modal-button.bg-utd-green.text-white.w-full.sm_w-32
								| Close

				// Rejected Pop-Up
				Modal(v-if="currentModal == ModalType.REJECTED" title="Cart Rejected" @toggleModal="closeModal")
					div.flex.flex-col.p-5
						div.text-xl.h-20
							| Your cart has been rejected, possible reasons include:
						div.flex.flex-row.mt-auto
							button(@click="closeModal").modal-button.bg-utd-green.text-white.w-full.sm_w-32.ml-auto
								| Close

				// Accepted Pop-Up
				Modal(v-if="currentModal == ModalType.ACCEPTED" title="Cart Accepted" @toggleModal="closeModal")
					div.flex.flex-col.p-5
						div.text-xl.h-20
							| Your cart has been approved!
						div.flex.flex-row.mt-auto
							button(@click="closeModal").modal-button.bg-utd-green.text-white.w-full.sm_w-32.ml-auto
								| Close

		//- Skeleton - change as needed when UI changes, hardcoded here to reduce maintaining skeleton components
		template(#fallback)
			div.flex.flex-row
				div.w-screen
					div.flex.flex-col.md_flex-row.pb-7.max-md_space-y-3.md_space-x-10
						//- Filter and search
						div.flex.flex-col.md_w-44.md_flex-row.md_space-x-5
							div.skeleton.w-full.h-12
						div.flex.grow
							div.skeleton.w-full.h-12
					div
						//- Category grid and items
						div.skeleton.h-12
						div(style="grid-template-columns: repeat(auto-fill, minmax(288px, 1fr))").my-4.grid.place-items-center.gap-4
							div.skeleton.w-72.h-72
							div.skeleton.w-72.h-72
							div.skeleton.w-72.h-72
							div.skeleton.w-72.h-72
							div.skeleton.w-72.h-72
							div.skeleton.w-72.h-72
							div.skeleton.w-72.h-72
							div.skeleton.w-72.h-72
							div.skeleton.w-72.h-72
</template>

<script lang="ts" setup>
import { ChevronUpIcon } from "@heroicons/vue/24/solid"
import { useCartStore } from "~/stores/cart"

const store = useCartStore()
const { resetCartView, getCart } = store
const { cartView } = storeToRefs(store)

const searchTerm = ref("")
const filters = ref([])
const currentModal = ref("")
const verificationUpdate = ref<EventSource>()

const ModalType = Object.freeze({
	PENDING: "PENDING",
	ACCEPTED: "ACCEPTED",
	REJECTED: "REJECTED",
})

if (import.meta.client) {
	// change this to use env later
	// also probably use zod to type check the message...
	verificationUpdate.value = new EventSource("http://localhost:3000/api/verification/cartRequestVerificationResponseWaiting")
	verificationUpdate.value.onmessage = async (event) => {
		// put a better response as to accepted or declined cart later
		const { type, payload } = JSON.parse(event.data)
		if (type === "REJECT CART") {
			currentModal.value = ModalType.REJECTED
		}
		if (type === "ACCEPT CART") {
			currentModal.value = ModalType.ACCEPTED
		}
		await getCart()
		resetCartView()
	}
}

const scrollToTop = (): void => {
	window.scrollTo({ top: 0, behavior: "smooth" })
}

// get items with count greater than 0
const { data: items } = await useFetch("/api/inventory/items", {
	query: { checkAvailability: true },
})

const filteredCategoryItems = computed(() => {
	const categoryFilters = filters.value.filter((filter) => filter !== "Deals")
	const dealFilter = filters.value.includes("Deals")
	const searchFilter = new RegExp(searchTerm.value.trim(), "i")
	// show all items if no filters are selected
	return Object.groupBy(
		items.value.filter((item) => {
			return (
				(searchTerm.value == "" || searchFilter.test(item.name)) &&
				(categoryFilters.length == 0 || categoryFilters.includes(item.categoryName)) &&
				(!dealFilter || item.Deal)
			)
		}),
		(item) => {
			return item.categoryName
		}
	)
})

const closeModal = () => {
	currentModal.value = ""
}

const retractCart = async () => {
	await $fetch("/api/verification/retractCart", { method: "PUT" })
	closeModal()
}

onMounted(async () => {
	try {
		await $fetch("/api/cart/cart", { method: "PUT" })
	} catch (e) {
		/* lol */
	}
})
</script>
