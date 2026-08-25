<template>
	<div>
		<NuxtLayout name="main" :title="`Add Category`" :back-navigation="{ text: 'Back to Manage Categories', to: '/admin/manage/categories' }">
			<USeparator class="my-4" />
			<section>
				<div class="mx-auto w-full max-w-xl">
					<ManageCategoryEditorCategoryForm :categories="categories ?? []" :initial-values="initialValues" @submit="onSubmit" />
				</div>
			</section>
		</NuxtLayout>
	</div>
</template>

<script lang="ts" setup>
import type { CreateCategoryForm } from "~/utils/formSchemas"

definePageMeta({ layout: false })

const initialValues: CreateCategoryForm = { image: undefined, categoryName: "" }

const { data: categories } = await useFetch("/api/student/inventory/categories", {
	method: "GET",
	query: {
		includeArchived: "true",
	},
})

const onSubmit = async (data: CreateCategoryForm) => {
	try {
		const formData = new FormData()
		formData.append("categoryID", "")
		formData.append("categoryName", data.categoryName)
		if (data.image) {
			formData.append("image", data.image)
		}
		formData.append("archived", "false")

		await $fetch("/api/admin/inventory/category", {
			method: "PUT",
			body: formData,
		})

		navigateTo("/admin/manage/categories")
	} catch (error) {
		// idk for now
	}
}
</script>
