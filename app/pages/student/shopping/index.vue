<template>
	<div>
		<NuxtLayout name="main" title="Shopping Categories" :back-navigation="{ text: 'Back to Dashboard', to: '/student' }">
			<section>
				<ul class="mt-4 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
					<li>
						<SharedAllItemsCard variant="shopping" category-name="All Items" />
					</li>
					<li v-for="(category, i) in categories" :key="i">
						<SharedCategoryCard variant="shopping" :category-name="category.name" :img-name="category.imgName" />
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
