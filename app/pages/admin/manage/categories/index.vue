<template>
	<div>
		<NuxtLayout name="main" title="Manage Categories" :back-navigation="{ text: 'Back to Dashboard', to: '/admin' }">
			<section>
				<div class="flex flex-row flex-nowrap items-center gap-2">
					<UInput v-model="query" type="text" :icon="icons['search']" placeholder="Search categories" class="relative grow">
						<UButton :icon="icons['add']" variant="ghost" color="neutral" class="absolute bg-utd-green text-white right-0" :to="`/admin/manage/categories/add`" />
					</UInput>
				</div>
				<USeparator class="my-4" />
				<ul class="mt-4 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
					<li v-for="category in shownActiveCategories" :key="category.categoryID">
						<ManageCategoryItemCard :name="category.name" :img-name="category.imgName" :category-i-d="category.categoryID" />
					</li>
				</ul>

				<USeparator class="my-4" />

				<SharedTextSectionTitle>Archived Categories</SharedTextSectionTitle>

				<ul class="mt-4 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
					<li v-for="category in shownArchivedCategories" :key="category.categoryID">
						<ManageCategoryItemCard :name="category.name" :img-name="category.imgName" :category-i-d="category.categoryID" />
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

const sortedCategories = computed(() => {
	if (!categories.value) {
		return []
	}
	const sorted = [...categories.value]
	sorted.sort((a, b) => a.name.localeCompare(b.name))
	return sorted
})

const { query, filtered } = useFuzzySearch(sortedCategories, { searchKeys: ["name"] })

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
