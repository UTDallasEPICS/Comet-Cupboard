<template>
	<div class="p-4">
		<h1 class="mb-2 text-center">Categories</h1>

		<div class="mx-auto grid w-full max-w-437.5 grid-cols-1 gap-x-6 gap-y-3 sm:grid-cols-2 lg:grid-cols-3">
			<SharedCategoryCard v-for="(category, i) in categories" :key="i" variant="shopping" :category-name="category.name" :image-src="category.img" />
		</div>
	</div>
</template>

<script setup lang="ts">
const { categories } = useCategories()

onMounted(async () => {
	try {
		await $fetch("/api/cart/cart", { method: "PUT" })
	} catch {}
})
</script>
