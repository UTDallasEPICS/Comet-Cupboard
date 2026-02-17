<template>
	<UContainer class="py-8">
		<header>
			<SharedTextPageTitle>Inventory Categories</SharedTextPageTitle>
		</header>

		<section class="mt-4">
			<SharedTextSectionTitle>Select a Category</SharedTextSectionTitle>

			<ul class="mt-4 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
				<li v-for="(category, i) in categories" :key="i">
					<SharedCategoryCard variant="inventory" :category-name="category.name" :image-src="category.img" />
				</li>
			</ul>
		</section>
	</UContainer>
</template>

<script setup lang="ts">
const { categories } = useCategories()
</script>
