<template>
	<UContainer class="py-8">
		<header>
			<SharedTextPageTitle>Shopping Categories</SharedTextPageTitle>
		</header>

		<section class="mt-4">
			<div class="flex items-baseline justify-between">
				<SharedTextSectionTitle class="inline">Select a Category</SharedTextSectionTitle>
				<UButton
					icon="i-heroicons-question-mark-circle"
					color="gray"
					variant="ghost"
					label="Take a Tour"
					@click="startTour"
					class="self-end"
				/>
			</div>
			
			<ul class="mt-4 grid gap-4 sm:grid-cols-2 lg:grid-cols-3" id="category-grid">
				<li>
					<SharedAllItemsCard variant="shopping" category-name="All Items" />
				</li>
				<li v-for="(category, i) in categories" :key="i">
					<SharedCategoryCard variant="shopping" :category-name="category.name" :img-name="category.imgName" />
				</li>
			</ul>
		</section>
	</UContainer>
</template>

<script setup lang="ts">
const { data: categories } = await useFetch("/api/student/inventory/categories")

const { startTour } = StudentShoppingTour()

onMounted(() => {
	startTour()
})
</script>
