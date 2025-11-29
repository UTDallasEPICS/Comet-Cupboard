<template>
	<div class="flex flex-col bg-gray-100 min-h-screen relative items-center p-4">

		<!-- CART ICON -->
		<div class="fixed top-0 right-0 z-50">
			<V2ShoppingCartIconAnimate />
		</div>

		<!-- BACK BUTTON -->
		<div class="w-full max-w-[320px] px-1 mt-1 mb-1">
			<V2ShoppingBackButton backTo="Back to Categories" @click="goBack" />
		</div>

		<!-- TITLE -->
		<h1 class="text-2xl font-bold text-center mb-2">
			{{ categoryTitle || "Category" }}
		</h1>

		<!-- SEARCH BAR (matching your categories page style) -->
		<div class="w-full flex justify-center mb-6">
			<V2ShoppingSearchBar
				class="max-w-[320px] w-full"
				v-model="searchQuery"
				:category-items="items"
			/>
		</div>

		<!-- ITEMS GRID - centered exactly like categories -->
<!-- ITEMS GRID (perfectly aligned under the search bar) -->
<div class="w-full flex justify-center">
  <div class="w-full max-w-[275px]">
    <div class="grid grid-cols-1 gap-y-4">
      <V2ShoppingItemCard
        v-for="item in filteredItems"
        :key="item.name"
        v-bind="item"
        @add-to-cart="addItem"
      />
    </div>
  </div>
</div>
</div>
</template>

<script setup>
import { ref, computed } from "vue"
import { useRouter, useRoute } from "vue-router"
import { useCartStore } from "@/stores/cart"

const router = useRouter()
const route = useRoute()
const store = useCartStore()

const categoryTitle = route.params.category
const searchQuery = ref("")

// Items per category map
const categoryItemsMap = {
	"Breakfast Grains": [
		{ name: "Oatmeal", badge: "free" },
		{ name: "Cereal", badge: "deal", quantity: 3, countsAs: 2 },
		{ name: "Pancake Mix", badge: null },
		{ name: "Granola", badge: "deal", quantity: 2, countsAs: 1 },
		{ name: "Waffles", badge: null },
	],
	"Fridge Items": [
		{ name: "Milk", badge: "deal" },
		{ name: "Eggs", badge: null },
		{ name: "Cheese", badge: null },
		{ name: "Yogurt", badge: "free" },
		{ name: "Butter", badge: null },
	],
	"Frozen Items": [
		{ name: "Pizza", badge: "deal" },
		{ name: "Frozen Veggies", badge: null },
		{ name: "Ice Cream", badge: "deal" },
		{ name: "Frozen Berries", badge: null },
	],
	Fruits: [
		{ name: "Apple", badge: null },
		{ name: "Orange", badge: "free" },
		{ name: "Banana", badge: null },
		{ name: "Grapes", badge: null },
		{ name: "Strawberries", badge: "deal" },
	],
	"Household Items": [
		{ name: "Tide", badge: null },
		{ name: "Toilet Paper", badge: "deal" },
		{ name: "Soap", badge: "free" },
		{ name: "Dishwasher Tabs", badge: null },
	],
	Miscellaneous: [
		{ name: "Pen", badge: null },
		{ name: "Notebook", badge: null },
		{ name: "Cup", badge: "free" },
		{ name: "Scissors", badge: null },
	],
	"Pantry Staples": [
		{ name: "Peanut Butter", badge: "deal" },
		{ name: "Rice", badge: null },
		{ name: "Pasta", badge: null },
		{ name: "Flour", badge: null },
	],
	"Personal Care": [
		{ name: "Mask", badge: "free" },
		{ name: "Toothpaste", badge: null },
		{ name: "Shampoo", badge: null },
		{ name: "Conditioner", badge: "deal" },
	],
	Proteins: [
		{ name: "Chicken", badge: null },
		{ name: "Beef", badge: "deal" },
		{ name: "Tofu", badge: "free" },
		{ name: "Salmon", badge: null },
	],
	Snacks: [
		{ name: "Chips", badge: "deal" },
		{ name: "Crackers", badge: null },
		{ name: "Cookies", badge: "free" },
		{ name: "Popcorn", badge: null },
	],
	Soup: [
		{ name: "Tomato Soup", badge: "deal" },
		{ name: "Chicken Noodle", badge: null },
		{ name: "Lentil Soup", badge: "free" },
		{ name: "Minestrone", badge: null },
	],
	Vegetables: [
		{ name: "Carrot", badge: null },
		{ name: "Spinach", badge: "deal" },
		{ name: "Broccoli", badge: null },
		{ name: "Cauliflower", badge: "free" },
	],
}

const items = ref(categoryItemsMap[categoryTitle] || [])

// FILTERED ITEMS (search)
const filteredItems = computed(() => {
	if (!searchQuery.value.trim()) return items.value
	return items.value.filter((item) =>
		item.name.toLowerCase().includes(searchQuery.value.toLowerCase())
	)
})

// Add item to cart
function addItem(item) {
	store.addToCart({
		name: item.name,
		categoryName: categoryTitle,
		badge: item.badge,
		quantity: item.quantity || 3,
		countsAs: item.countsAs || 1,
	})
}

// Go back
const goBack = async () => await navigateTo("/v2/shopping")
</script>
