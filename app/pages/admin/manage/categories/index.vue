<template>
	<div>
		<NuxtLayout name="main" title="Manage Categories" :back-navigation="{ text: 'Back to Dashboard', to: '/admin' }">
			<section>
				<div class="flex flex-row flex-nowrap items-center gap-2">
					<UInput v-model="query" type="text" icon="i-lucide-search" placeholder="Search categories" class="relative grow">
						<SharedButtonActionButton
							leading-icon="i-lucide-plus"
							variant="ghost"
							action="positive"
							class="bg-utd-green absolute right-0 text-white"
							text="Add"
							:to="`/admin/manage/categories/add`"
						/>
					</UInput>
				</div>
				<USeparator class="my-4" />
				<UCard>
					<SharedTextSectionTitle>Active Categories</SharedTextSectionTitle>
					<USeparator class="my-4" />
					<SharedLayoutGrid v-if="shownActiveCategories.length != 0">
						<li v-for="category in shownActiveCategories" :key="category.categoryID">
							<DomainCardManageCategoryItemCard :name="category.categoryName" :img-name="category.imgName" :category-i-d="category.categoryID" />
						</li>
					</SharedLayoutGrid>
					<div v-else class="flex flex-col items-center justify-center gap-y-4">
						<SharedTextBaseSecondary>No active categories found</SharedTextBaseSecondary>
					</div>
				</UCard>
				<UCard class="mt-4">
					<SharedTextSectionTitle>Archived Categories</SharedTextSectionTitle>
					<USeparator class="my-4" />
					<SharedLayoutGrid v-if="shownArchivedCategories.length != 0" class="mt-4">
						<li v-for="category in shownArchivedCategories" :key="category.categoryID">
							<DomainCardManageCategoryItemCard :name="category.categoryName" :img-name="category.imgName" :category-i-d="category.categoryID" />
						</li>
					</SharedLayoutGrid>
					<div v-else class="flex flex-col items-center justify-center gap-y-4">
						<SharedTextBaseSecondary>No archived categories found</SharedTextBaseSecondary>
					</div>
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

const sortedCategories = computed(() => {
	if (!categories.value) {
		return []
	}
	const sorted = [...categories.value]
	sorted.sort((a, b) => a.categoryName.localeCompare(b.categoryName))
	return sorted
})

const { query, filtered } = useFuzzySearch(sortedCategories, { searchKeys: ["categoryName"] })

const shownActiveCategories = computed(() => {
	return filtered.value.filter((category) => {
		return category.archived === false
	})
})

const shownArchivedCategories = computed(() => {
	return filtered.value.filter((category) => {
		return category.archived === true
	})
})
</script>
