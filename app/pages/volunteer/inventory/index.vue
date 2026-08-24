<template>
	<div>
		<NuxtLayout name="main" title="Inventory Categories" :back-navigation="{ text: 'Back to Dashboard', to: '/volunteer' }">
			<section>
				<UCard>
					<SharedTextCardTitle>Active Categories</SharedTextCardTitle>
					<USeparator class="my-4" />
					<ul class="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
						<li>
							<SharedCategoryCard variant="inventory" category-name="All Items" img-name="shelves.jpg" all-items />
						</li>
						<li v-for="(category, i) in activeCategories" :key="i">
							<SharedCategoryCard variant="inventory" :category-name="category.categoryName" :img-name="category.imgName" />
						</li>
					</ul>
				</UCard>

				<UCard class="mt-4">
					<SharedTextCardTitle>Archived Categories</SharedTextCardTitle>
					<USeparator class="my-4" />
					<ul class="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
						<li v-for="(category, i) in archivedCategories" :key="i">
							<SharedCategoryCard variant="inventory" :category-name="category.categoryName" :img-name="category.imgName" />
						</li>
					</ul>
					<SharedTextBase v-if="archivedCategories.length === 0" class="block text-center">No archived categories</SharedTextBase>
				</UCard>
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
