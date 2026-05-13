<template>
	<UContainer class="py-8">
		<header>
			<SharedButtonNavigateBack text="Back to Categories" :to="{ path: '/student/shopping' }" />
			<div class="flex items-baseline justify-between">
				<SharedTextPageTitle>All Items</SharedTextPageTitle>
				<UButton
					icon="i-heroicons-question-mark-circle"
					color="gray"
					variant="ghost"
					label="Take a Tour"
					@click="startTour"
					class="self-end"
				/>
			</div>
		</header>

		<section class="mt-4">
			<SharedTextSectionTitle class="sr-only">Add Items to Your Cart</SharedTextSectionTitle>
			<div class="mt-4 flex flex-row justify-end">
				<UCheckboxGroup id="tour-deal" v-model="toggleItems" :items="toggleOptions" orientation="horizontal" />
			</div>
			<div class="mx-auto mt-4 flex w-full flex-col gap-4 sm:flex-row sm:items-center sm:justify-start">
				<UInput v-model="query" type="text" :icon="icons['search']" placeholder="Search items" class="grow" />
				<USelect v-model="sortOption" :items="sortOptions" class="max-w-md grow" />
			</div>
			<ul class="mt-4 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
				<li v-for="item in filtered" :key="item.itemID">
					<ShoppingItemCard
						type-of-card="SHOPPING"
						:img-name="item.imgName"
						:item-deal="item.Deal ? { actualCount: item.Deal.actualCount, adjustedCount: item.Deal.adjustedCount } : {}"
						:item-i-d="item.itemID"
						:name="item.name"
						:quantity="item.quantity"
					/>
				</li>
			</ul>
		</section>
	</UContainer>
</template>

<script setup lang="ts">
const sortOption = ref("Alphabetical")
const sortOptions = ["Alphabetical", "Quantity"]

const { data: items } = await useFetch("/api/student/inventory/items", {
	query: { checkAvailability: "true" },
})

const toggleOptions = ref(["Deal"])
const toggleItems = ref([])
const shownItems = computed(() => {
	return items.value.filter((item) => {
		return !toggleItems.value.includes("Deal") || item.Deal !== null
	})
})

const sortedItems = computed(() => {
	if (!shownItems.value) {
		return []
	}
	const sorted = [...shownItems.value]
	if (sortOption.value === "Alphabetical") {
		sorted.sort((a, b) => a.name.localeCompare(b.name))
	} else if (sortOption.value === "Quantity") {
		sorted.sort((a, b) => b.quantity - a.quantity)
	}
	return sorted
})

const { query, filtered } = useFuzzySearch(sortedItems, { searchKeys: ["name"] })

const { startTour } = StudentItemsTour()

onMounted(() => {
	startTour()
})
</script>
