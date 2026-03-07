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
import type { FormError, FormErrorEvent, FormSubmitEvent } from "@nuxt/ui"

type Schema = {
	image: File | undefined
	categoryName: string | undefined
}
const state = ref<Partial<Schema>>({
	image: undefined,
	categoryName: undefined,
})

const schema = imageSchema.extend({
	categoryName: z
		.string()
		.min(1, "Category name is required")
		.max(20, "Category name must be at most 20 characters")
		.regex(/^[A-Za-z ]+$/, "Category name must only contain letters and spaces"),
})

const validate = async (state: Partial<Schema>): Promise<FormError[]> => {
	const errors = []
	const result = await schema.safeParseAsync(state)
	if (!result.success) {
		errors.push(...result.error.issues.map((err) => ({ name: String(err.path[0]), message: err.message })))
	}
	return errors
}

const onError = async (event: FormErrorEvent) => {
	if (event?.errors?.[0]?.id) {
		const el = document.getElementById(event.errors[0].id)
		el?.focus()
		el?.scrollIntoView({ behavior: "smooth", block: "center" })
	}
}
const onSubmit = async (event: FormSubmitEvent<Schema>) => {
	try {
		const formData = new FormData()
		formData.append("categoryName", event.data.categoryName)
		if (event.data.image) {
			formData.append("image", event.data.image)
		}

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
