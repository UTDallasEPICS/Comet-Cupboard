<template>
	<UContainer class="py-8">
		<header>
			<SharedTextPageTitle>Inventory Categories</SharedTextPageTitle>
		</header>

		<section class="mt-4">
			<SharedTextSectionTitle>Select a Category</SharedTextSectionTitle>

			<ul class="mt-4 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
				<li v-for="(category, i) in categories" :key="i">
					<SharedCategoryCard variant="inventory" :category-name="category.name" :img-name="category.imgName" />
				</li>
			</ul>
		</section>
	</UContainer>
</template>

<script setup lang="ts">
const { getCategories } = useCategories()
const categories = await getCategories()
const inventoryStore = useInventoryStore()
const { getInventoryChanges } = inventoryStore

onMounted(async () => {
	await getInventoryChanges()
})
</script>
