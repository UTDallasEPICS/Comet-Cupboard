<template>
	<UContainer class="py-8">
		<header>
			<SharedButtonNavigateBack text="Back to Manage Categories" :to="{ path: `/admin/manage/categories` }" />
			<SharedTextPageTitle>Manage Categories</SharedTextPageTitle>
		</header>

		<section class="mt-4">
			<SharedTextSectionTitle>Edit {{ currentCategory.name }} Category</SharedTextSectionTitle>
			<div class="mx-auto w-min">
				<UForm :validate="validate" :state="state" class="w-96 space-y-4" @submit="onSubmit" @error="onError">
					<UFormField id="image" name="image" label="Item Image" description="JPG or PNG. 2MB Max. Dimensions between 200x200 and 4096x4096 pixels">
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
					<UFormField id="archived" name="archived" label="Archived" description="Check if the category is archived">
						<UCheckbox v-model="state.archived" />
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

const route = useRoute()
const categoryID = route.params.categoryID as string

const { data: categories } = await useFetch("/api/student/inventory/categories")
const currentCategory = computed(() => {
	return categories.value?.find((category) => category.categoryID === categoryID)
})

const originalImage = ref<Blob | null>(null)

const state = ref<Partial<Schema>>({
	image: originalImage.value
		? new File([originalImage.value], currentCategory.value?.imgName, {
				type: originalImage.value.type,
			})
		: undefined,
	categoryName: currentCategory.value?.name || undefined,
	archived: currentCategory.value?.archived || false,
})

watchEffect(async () => {
	if (currentCategory.value) {
		originalImage.value = await $fetch<Blob>(`/api/public/image/${currentCategory.value.imgName}`, { responseType: "blob" })
		state.value.image = new File([originalImage.value], currentCategory.value.imgName, {
			type: originalImage.value.type,
		})
	} else {
		originalImage.value = null
	}
})

type Schema = {
	image: File | undefined
	categoryName: string | undefined
	archived: boolean | undefined
}

const schema = imageSchema.extend({
	categoryName: z
		.string()
		.min(1, "Category name is required")
		.max(20, "Category name must be at most 20 characters")
		.regex(/^[A-Za-z ]+$/, "Category name must only contain letters and spaces"),
	archived: z.boolean().default(false),
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
		formData.append("categoryID", categoryID)
		formData.append("categoryName", event.data.categoryName || "")
		formData.append("archived", event.data.archived?.toString() || "false")
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
