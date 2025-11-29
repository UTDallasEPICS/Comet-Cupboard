<template>
	<div class="flex flex-col bg-gray-100 min-h-screen relative items-center">
		<!-- CART ICON + SLIDE-OUT CART -->
		<V2ShoppingCartIconAnimate ref="cart" />

		<!-- BACK BUTTON -->
		<div class="w-full max-w-[320px] px-1 mt-1 mb-1">
			<V2ShoppingBackButton backTo="Back to Categories" @click="goBack" />
		</div>

		<!-- CATEGORY HEADER -->
		<h1 class="text-2xl font-bold text-left mb-2 mt-4 px-4">
			{{ categoryTitle || "Category Name" }}
		</h1>

		<!-- SEARCH BAR -->
		<V2ShoppingSearchBar v-model="searchQuery" :category-items="filteredItems" class="mt-2 mb-6" />

		<!-- ITEMS GRID -->
		<div class="flex flex-wrap gap-4 justify-center px-4">
			<div v-for="(item, index) in filteredItems" :key="index" class="relative">
				<V2ShoppingItemCard :name="item" @add-to-cart="$refs.cart.addToCart(item)" />

				<!-- DYNAMIC BADGES -->
				<V2ShoppingDealBadge v-if="badgeConfig[item]?.type === 'deal'" :quantity="badgeConfig[item].quantity" :countsAs="badgeConfig[item].countsAs" />
				<V2ShoppingFreeBadge v-else-if="badgeConfig[item]?.type === 'free'" />
			</div>
		</div>
	</div>
</template>

<script setup>
import { ref, computed } from "vue"
import { useRoute } from "vue-router"

const route = useRoute()
const categoryData = {
	"Breakfast Grains": ["Oatmeal", "Cereal", "Pancake Mix", "Granola"],
	"Fruits & Snacks": ["Apple", "Orange", "Banana", "Chips", "Cookies"],
}

const categoryTitle = route.params.category
const items = categoryData[categoryTitle] || []

const searchQuery = ref("")
const filteredItems = computed(() => {
	if (!searchQuery.value) return items
	return items.filter((i) => i.toLowerCase().includes(searchQuery.value.toLowerCase()))
})

const badgeConfig = {
	Pizza: { type: "deal", quantity: 3, countsAs: 1 },
	Oatmeal: { type: "free" },
}

// NAVIGATION
const goBack = async () => {
	await navigateTo({ path: "/v2/shopping" })
}
</script>
