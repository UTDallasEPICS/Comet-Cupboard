<template>
	<div>
		<NuxtLayout name="main" title="Inventory Categories" :back-navigation="{ text: 'Back to Dashboard', to: '/volunteer' }">
			<section>
				<div class="mt-4 flex flex-row justify-end">
					<UCheckboxGroup v-model="toggleItems" :items="toggleOptions" orientation="horizontal" />
				</div>
				<ul class="mt-4 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
					<li>
						<SharedAllItemsCard variant="inventory" category-name="All Items" />
					</li>
					<li v-for="(category, i) in shownCategories" :key="i">
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

const toggleOptions = ref(["Archived"])
const toggleItems = ref([])
const shownCategories = computed(() => {
	return categories.value.filter((category) => {
		return !toggleItems.value.includes("Archived") || category.archived === true
	})
})
const inventoryStore = useInventoryStore()

onMounted(async () => {
	await inventoryStore.getInventoryChanges()
})
</script>
