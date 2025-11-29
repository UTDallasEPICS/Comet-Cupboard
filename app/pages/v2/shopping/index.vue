<template lang="pug">
div.p-4
	// CART ICON - top right
	div.fixed.top-0.right-0.z-50
		V2ShoppingCartIconAnimate(ref="cart")

	// HEADER - centered
	h1.text-2xl.font-bold.text-center.mb-2 Category

	// SEARCH BAR (reuse the component from items page)
	div.w-full.flex.justify-center.mb-6
		V2ShoppingSearchBar(class="max-w-[320px]" v-model="searchQuery" :category-items="categories").w-full

	// CATEGORY GRID
	div(class="max-w-[1750px]").grid.w-full.mx-auto.gap-x-6.gap-y-3.grid-cols-1.sm_grid-cols-2.lg_grid-cols-3
		V2ShoppingCategoriesCard(v-for="(category, i) in categories" :key="i" :categoryName="category.name" :imageSrc="category.img")
</template>

<script setup>
import { ref } from "vue"

const searchQuery = ref("")

const categories = [
	{ name: "Breakfast Grains", img: "/test-images/Breakfast Grains/grains.jpg" },
	{ name: "Fridge Items", img: "/test-images/Fridge Items/dairy.jpg" },
	{ name: "Frozen Items", img: "/test-images/Frozen Items/frozen.jpg" },
	{ name: "Fruits", img: "/test-images/Fruits/fruit.jpg" },
	{ name: "Household Items", img: "/test-images/Household Items/household.jpg" },
	{ name: "Miscellaneous", img: "/test-images/Miscellaneous/misc.jpg" },
	{ name: "Pantry Staples", img: "/test-images/Pantry Staples/pantryStaples.jpg" },
	{ name: "Personal Care", img: "/test-images/Personal Care/personal_care.png" },
	{ name: "Proteins", img: "/test-images/Proteins/protein.jpg" },
	{ name: "Snacks", img: "/test-images/Snacks/snacks.jpg" },
	{ name: "Soup", img: "/test-images/Soup/soup.jpg" },
	{ name: "Vegetables", img: "/test-images/Vegetables/vegetables.jpg" },
]

// Navigation
const acceptCart = async () => await navigateTo({ path: "" })
</script>

<style scoped>
@import url("https://fonts.googleapis.com/css2?family=Montserrat:wght@400;500;700&display=swap");
.font-montserrat {
	font-family: "Montserrat", sans-serif;
}
</style>


