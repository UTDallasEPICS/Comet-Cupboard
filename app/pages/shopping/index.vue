<template>
	<UContainer class="py-8">
		<header>
			<SharedTextPageTitle>Shopping Categories</SharedTextPageTitle>
		</header>

		<section class="mt-4">
			<SharedTextSectionTitle>Select a Category</SharedTextSectionTitle>

			<ul class="mt-4 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
				<li v-for="(category, i) in categories" :key="i">
					<SharedCategoryCard variant="shopping" :category-name="category.name" :image-src="category.img" />
				</li>
			</ul>
		</section>
	</UContainer>
</template>

<script setup lang="ts">
const { categories } = useCategories()

onMounted(async () => {
	try {
		await $fetch("/api/cart/cart", { method: "PUT" })
	} catch {}
})
</script>
