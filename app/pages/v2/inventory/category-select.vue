<template lang="pug">
div
	div.flex.absolute.top-20.left-0.w-full.h-16.z-30.justify-center
		V2SharedHeaderSubheader(pageTitle="Category Select")(class="md_max-w-[600px]").md_rounded-b-3xl
	div.p-6.mt-20
		div(style="grid-template-columns: repeat(auto-fill, minmax(288px, 1fr))").grid.w-full.mx-auto.gap-x-6.gap-y-3
			V2SharedCategoryCard(v-for="(category, i) in categories" :key="i" :categoryName="category.name" :imageSrc="category.img")
</template>

<script lang="ts" setup>
const categories = [
	{ name: "Breakfast Grains", img: "/category_banners/grains.jpg" },
	{ name: "Fridge Items", img: "/category_banners/fridge.jpg" },
	{ name: "Frozen Items", img: "/category_banners/frozen.jpg" },
	{ name: "Fruits", img: "/category_banners/fruits.jpg" },
	{ name: "Household Items", img: "/category_banners/household.jpg" },
	{ name: "Misc", img: "/category_banners/misc.jpg" },
	{ name: "Pantry Staples", img: "/category_banners/pantry_staples.jpg" },
	{ name: "Personal Care", img: "/category_banners/personal_care.png" },
	{ name: "Proteins", img: "/category_banners/proteins.jpg" },
	{ name: "Snacks", img: "/category_banners/snacks.jpg" },
	{ name: "Soup", img: "/category_banners/soup.jpg" },
	{ name: "Vegetables", img: "/category_banners/vegetables.jpg" },
]
</script>
