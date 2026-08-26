<template>
	<div>
		<NuxtLayout name="main" title="Inventory Categories" :back-navigation="{ text: 'Back to Dashboard', to: '/volunteer' }">
			<section>
				<SharedLayoutSectionUCard title="Active Categories">
					<SharedLayoutGrid>
						<li>
							<SharedCategoryCard variant="inventory" category-name="All Items" img-name="shelves.jpg" all-items />
						</li>
						<li v-for="(category, i) in activeCategories" :key="i">
							<SharedCategoryCard variant="inventory" :category-name="category.categoryName" :img-name="category.imgName" />
						</li>
					</SharedLayoutGrid>
				</SharedLayoutSectionUCard>

				<SharedLayoutSectionUCard title="Archived Categories" class="mt-4">
					<SharedLayoutGrid>
						<li v-for="(category, i) in archivedCategories" :key="i">
							<SharedCategoryCard variant="inventory" :category-name="category.categoryName" :img-name="category.imgName" />
						</li>
					</SharedLayoutGrid>
					<SharedTextBase v-if="archivedCategories.length === 0" class="block text-center">No archived categories</SharedTextBase>
				</SharedLayoutSectionUCard>
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
