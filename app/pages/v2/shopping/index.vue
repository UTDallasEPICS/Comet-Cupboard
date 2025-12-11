<template lang="pug">
div.p-4
	// HEADER - centered
	h1.text-2xl.font-bold.text-center.mb-2 Category

	// CATEGORY GRID
	div(class="max-w-[1750px]").grid.w-full.mx-auto.gap-x-6.gap-y-3.grid-cols-1.sm_grid-cols-2.lg_grid-cols-3
		V2ShoppingCategoriesCard(v-for="(category, i) in categories" :key="i" :categoryName="category.name" :imageSrc="category.img")
</template>

<script setup lang="ts">
//- categories
const categories = [
    { name: "Breakfast Grains", img: "/category_banners/grains.jpg" },
    { name: "Fridge Items", img: "/category_banners/fridge.jpg" },
    { name: "Frozen Items", img: "/category_banners/frozen.jpg" },
    { name: "Fruits", img: "/category_banners/fruits.jpg" },
    { name: "Household Items", img: "/category_banners/household.jpg" },
    { name: "Miscellaneous", img: "/category_banners/misc.jpg" },
    { name: "Pantry Staples", img: "/category_banners/pantry_staples.jpg" },
    { name: "Personal Care", img: "/category_banners/personal_care.png" },
    { name: "Proteins", img: "/category_banners/proteins.jpg" },
    { name: "Snacks", img: "/category_banners/snacks.jpg" },
    { name: "Soup", img: "/category_banners/soup.jpg" },
    { name: "Vegetables", img: "/category_banners/vegetables.jpg" },
]

onMounted(async () => {
  try {
    await $fetch("/api/cart/cart", { method: "PUT" })
  } catch {}
})

</script>

