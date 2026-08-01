<template>
	<div>
		<NuxtLayout name="main" title="Inventory Categories" :back-navigation="{ text: 'Back to Dashboard', to: '/volunteer' }">
			<section>
				<USeparator class="my-4" />
				<ul class="mt-4 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
					<li>
						<SharedAllItemsCard variant="inventory" category-name="All Items" />
					</li>
					<li v-for="(category, i) in activeCategories" :key="i">
						<SharedCategoryCard variant="inventory" :category-name="category.name" :img-name="category.imgName" />
					</li>
				</ul>

				<USeparator class="my-4" />

				<SharedTextSectionTitle>Archived Categories</SharedTextSectionTitle>

				<ul class="mt-4 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
					<li v-for="(category, i) in archivedCategories" :key="i">
						<SharedCategoryCard variant="inventory" :category-name="category.name" :img-name="category.imgName" />
					</li>
				</ul>
			</section>
		</NuxtLayout>
	</div>
</template>

<script setup lang="ts">
definePageMeta({ layout: false })

const { data: categories } = await useFetch("/api/student/inventory/categories", {
	query: { includeArchived: true },
})
const activeCategories = computed(() => {
	return categories.value.filter((category) => {
		return category.archived === false
	})
})

const archivedCategories = computed(() => {
	return categories.value.filter((category) => {
		return category.archived === true
	})
})
</script>
