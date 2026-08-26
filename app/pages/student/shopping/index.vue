<template>
	<div>
		<NuxtLayout name="main" title="Shopping Categories" :back-navigation="{ text: 'Back to Dashboard', to: '/student' }">
			<USeparator class="my-4" />
			<section>
				<SharedLayoutGrid class="mt-4">
					<li>
						<SharedCategoryCard variant="shopping" category-name="All Items" all-items />
					</li>
					<li v-for="category in categories" :key="category.categoryID">
						<SharedCategoryCard variant="shopping" :category-name="category.categoryName" :img-name="category.imgName" />
					</li>
				</SharedLayoutGrid>
			</section>
		</NuxtLayout>
	</div>
</template>

<script setup lang="ts">
definePageMeta({ layout: false })

const { data: categories } = await useFetch("/api/student/inventory/categories")
</script>
