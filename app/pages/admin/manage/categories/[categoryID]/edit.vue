<template>
	<div>
		<NuxtLayout
			name="main"
			:title="`Edit ${currentCategory.categoryName}`"
			:back-navigation="{ text: 'Back to Manage Categories', to: '/admin/manage/categories' }"
		>
			<USeparator class="my-4" />
			<section>
				<div class="mx-auto w-full max-w-xl">
					<ManageCategoryEditorCategoryForm :categories="categories ?? []" :initial-values="initialValues" :show-archived="true" @submit="onSubmit" />
				</div>
			</section>
		</NuxtLayout>
	</div>
</template>

<script lang="ts" setup>
import type { EditCategoryForm } from "~/utils/formSchemas"

definePageMeta({ layout: false })

const route = useRoute()
const categoryID = route.params.categoryID as string

const { data: categories } = await useFetch("/api/student/inventory/categories", {
	method: "GET",
	query: {
		includeArchived: "true",
	},
})
const currentCategory = computed(() => {
	return categories.value?.find((category) => category.categoryID === categoryID)
})

const originalImage = ref<Blob | null>(null)
const image = ref<File>()

watchEffect(async () => {
	if (currentCategory.value) {
		originalImage.value = await $fetch<Blob>(`/api/public/image/${currentCategory.value.imgName}`, { responseType: "blob" })
		image.value = new File([originalImage.value], currentCategory.value.imgName, {
			type: originalImage.value.type,
		})
	} else {
		originalImage.value = null
		image.value = undefined
	}
})

const initialValues = computed<EditCategoryForm>(() => ({
	image: image.value,
	categoryName: currentCategory.value?.categoryName,
	archived: currentCategory.value?.archived ?? false,
}))

const onSubmit = async (data: EditCategoryForm) => {
	try {
		const formData = new FormData()
		formData.append("categoryID", categoryID)
		if (data.categoryName) {
			formData.append("categoryName", data.categoryName)
		}
		if (data.archived !== undefined) {
			formData.append("archived", data.archived.toString())
		}
		if (data.image) {
			formData.append("image", data.image)
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
