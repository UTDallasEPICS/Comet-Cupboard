<template>
	<div class="flex flex-col bg-gray-100 min-h-screen relative items-center">
		<!-- BACK BUTTON -->
		<div class="w-full max-w-[320px] px-1 mt-1 mb--1">
			<V2ShoppingBackButton backTo="Back to Categories" @click="goBack" />
		</div>

		<!-- CATEGORY HEADER -->
		<h1 class="text-2xl font-bold text-left mb-2 mt-4 px-4" :class="!categoryName ? 'text-gray-400' : 'text-black'">
			{{ categoryName || "Category Name" }}
		</h1>

		<!-- SEARCH BAR -->
		<V2ShoppingSearchBar v-model="searchQuery" :category-items="items" class="mt-2 mb-6" />

		<!-- ITEMS GRID -->
		<div class="flex flex-wrap gap-4 justify-center px-4">
			<div v-for="(item, index) in items" :key="index" class="relative">
				<V2ShoppingItemCard :name="item.name" @add-to-cart="$refs.cart.addToCart(item)" />

				<!-- DYNAMIC BADGES -->
				<V2ShoppingDealBadge
					v-if="badgeConfig[item.name]?.type === 'deal'"
					:quantity="badgeConfig[item.name].quantity"
					:countsAs="badgeConfig[item.name].countsAs"
				/>
				<V2ShoppingFreeBadge v-else-if="badgeConfig[item.name]?.type === 'free'" />
			</div>
		</div>
	</div>
</template>

<script setup>
import { ref } from "vue"

const items = ref([
	{ name: "Pizza" },
	{ name: "Oatmeal" },
	{ name: "Sandwich" },
	{ name: "Orange" },
	{ name: "Apple" },
	{ name: "Tide" },
	{ name: "Cup" },
	{ name: "Toilet Paper" },
	{ name: "Watermellon" },
	{ name: "Penut Butter" },
	{ name: "Mask" },
	{ name: "Utensil" },
	{ name: "Pencil" },
	{ name: "Paper" },
	{ name: "Notebook" },
])

const categoryName = ref("Fruits & Snacks")
const searchQuery = ref("")

// DYNAMIC BADGES CONFIG
const badgeConfig = {
	Pizza: { type: "deal", quantity: 3, countsAs: 1 },
	Oatmeal: { type: "free" },
}

// NAVIGATION
const goBack = async () => await navigateTo("/v2/shopping")
</script>
