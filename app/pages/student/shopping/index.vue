<template>
	<div>
		<NuxtLayout name="main" title="Shopping Categories" :back-navigation="{ text: 'Back to Dashboard', to: '/student' }">
			<USeparator class="my-4" />
			<section>
				<ul class="mt-4 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
					<li>
						<SharedCategoryCard variant="shopping" category-name="All Items" all-items />
					</li>
					<li v-for="category in categories" :key="category.categoryID">
						<SharedCategoryCard variant="shopping" :category-name="category.categoryName" :img-name="category.imgName" />
					</li>
				</ul>
			</section>
		</NuxtLayout>
	</div>
</template>

<script setup lang="ts">
definePageMeta({ layout: false })

const { data: categories } = await useFetch("/api/student/inventory/categories")
</script>
