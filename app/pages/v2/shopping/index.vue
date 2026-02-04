<template>
	<div class="p-4">
		<!-- HEADER - centered -->
		<h1 class="mb-2 text-center text-2xl font-bold">Category</h1>

		<!-- CATEGORY GRID -->
		<div class="mx-auto grid w-full max-w-[1750px] grid-cols-1 gap-x-6 gap-y-3 sm:grid-cols-2 lg:grid-cols-3">
			<V2ShoppingCategoriesCard v-for="(category, i) in categories" :key="i" :categoryName="category.name" :imageSrc="category.img" />
		</div>
	</div>
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
