<template>
	<UContainer class="py-8">
		<header>
			<SharedButtonNavigateBack text="Back to Dashboard" :to="{ path: '/volunteer' }" />
			<SharedTextPageTitle>Inventory Categories</SharedTextPageTitle>
		</header>

		<section class="mt-4" id="tour-category-selection">
			<div class="flex items-center gap-4">

				<SharedTextSectionTitle>Select a Category</SharedTextSectionTitle>
				<UButton icon="i-heroicons-question-mark-circle" color="gray" variant="ghost" label="Take a Tour"
					@click="startTour" />
			</div>

			<div class="mt-4 flex flex-row justify-end">
				<UCheckboxGroup v-model="toggleItems" :items="toggleOptions" orientation="horizontal" />
			</div>
			<ul class="mt-4 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
				<li>
					<SharedAllItemsCard variant="inventory" category-name="All Items" />
				</li>
				<li v-for="(category, i) in shownCategories" :key="i">
					<SharedCategoryCard variant="inventory" :category-name="category.name"
						:img-name="category.imgName" />
				</li>
			</ul>
		</section>
	</UContainer>
</template>

<script setup lang="ts">
import { onMounted } from "vue";

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
const { getInventoryChanges } = inventoryStore

onMounted(async () => {
	await getInventoryChanges()
})

const { startTour } = InventoryTour()

onMounted(() => {
	startTour();
});

</script>
