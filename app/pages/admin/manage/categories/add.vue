<template>
	<UContainer class="py-8">
		<header>
			<SharedButtonNavigateBack text="Back to Manage Categories" :to="{ path: '/admin/manage/categories' }" />
			<SharedTextPageTitle>Manage Categories</SharedTextPageTitle>
		</header>

		<section class="mt-4">
			<SharedTextSectionTitle>Add Category</SharedTextSectionTitle>
			<div class="mx-auto w-min">
				<UForm :validate="validate" :state="state" class="w-96 space-y-4" @submit="onSubmit" @error="onError">
					<UFormField
						id="image"
						name="image"
						label="Category Image"
						description="JPG or PNG. 2MB Max. Dimensions between 200x200 and 4096x4096 pixels"
					>
						<div class="flex flex-col gap-2">
							<UFileUpload v-model="state.image" class="aspect-square w-full" label="Upload image" accept=".jpg,.jpeg,.png" />
						</div>
					</UFormField>
					<UFormField
						id="categoryName"
						name="categoryName"
						label="Category Name"
						description="Category name must be at most 20 characters and only contain letters and spaces"
					>
						<UInput v-model="state.categoryName" placeholder="Enter category name" />
					</UFormField>
					<footer class="sticky right-4 bottom-8 mt-4 flex justify-end space-x-2 sm:ml-auto">
						<SharedButtonPositiveAction type="submit" text="Submit" />
					</footer>
				</UForm>
			</div>
		</section>
	</UContainer>
</template>

<script lang="ts" setup>
import * as z from "zod"

const formSchema = imageSchema.extend({
	categoryName: z
		.string()
		.min(1, "Category name is required")
		.max(20, "Category name must be at most 20 characters")
		.regex(/^[A-Za-z ]+$/, "Category name must only contain letters and spaces"),
})

const { schema, state, validate, onError } = createFormBuilder(formSchema, () => ({
	image: undefined,
	categoryName: undefined,
}))

const onSubmit = async (event) => {
	try {
		const formData = new FormData()
		formData.append("categoryName", event.data.categoryName)
		if (event.data.image) {
			formData.append("image", event.data.image)
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
