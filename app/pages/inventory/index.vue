<template>
	<div>
		<div class="absolute top-20 left-0 z-30 flex h-16 w-full justify-center">
			<V2SharedHeaderSubheader pageTitle="Category Select" class="md:max-w-[600px] md:rounded-b-3xl"></V2SharedHeaderSubheader>
		</div>
		<div class="mt-20 p-6">
			<div class="mx-auto grid w-full gap-x-6 gap-y-3" style="grid-template-columns: repeat(auto-fill, minmax(288px, 1fr))">
				<V2SharedCategoryCard v-for="(category, i) in categories" :key="i" :categoryName="category.name" :imageSrc="category.img" />
			</div>
		</div>
	</div>
</template>

<script lang="ts" setup>
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
</script>
