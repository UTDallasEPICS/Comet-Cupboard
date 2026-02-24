<template>
	<UContainer class="py-8">
		<header>
			<SharedButtonNavigateBack :text="'Back to ' + currentCategory" :to="{ path: `/volunteer/inventory/${currentCategory}` }" />
			<SharedTextPageTitle>{{ currentCategory }}</SharedTextPageTitle>
		</header>

		<section class="mt-4">
			<SharedTextSectionTitle>Edit {{ currentCategory }} Item</SharedTextSectionTitle>
			<div class="mx-auto w-min">
				<UForm :validate="validate" :state="state" class="w-96 space-y-4" @submit="onSubmit" @error="onError">
					<UFormField id="image" name="image" label="Item Image" description="JPG or PNG. 2MB Max. Dimensions between 200x200 and 4096x4096 pixels">
						<div class="flex flex-col gap-2">
							<UFileUpload v-model="state.image" class="aspect-square w-full" label="Upload image" accept=".jpg,.jpeg,.png" />
						</div>
					</UFormField>
					<UFormField
						id="itemName"
						name="itemName"
						label="Item Name"
						description="Item name must be at most 20 characters and only contain letters and spaces"
					>
						<UInput v-model="state.itemName" placeholder="Enter item name" />
					</UFormField>
					<UFormField id="category" name="category" label="Category" description="Select the category for this item">
						<USelect v-model="state.category" :items="categoryOptions" placeholder="Select category" />
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
const currentCategory = route.params.category as string
const itemID = route.params.itemID as string

const { data: item } = await useFetch("/api/student/inventory/item/", {
	query: { itemID },
})

const { data: categories } = await useFetch("/api/volunteer/controls/categories")

const categoryOptions = computed(() => {
	return categories.value?.map((category) => {
		return category.name
	})
})

const originalImage = ref<Blob | null>(null)

const state = ref<Partial<Schema>>({
	image: originalImage.value
		? new File([originalImage.value], item.value?.imgName, {
				type: originalImage.value.type,
			})
		: undefined,
	itemName: item.value?.name || undefined,
	category: item.value?.categoryName || undefined,
})

watchEffect(async () => {
	if (item.value) {
		originalImage.value = await $fetch<Blob>(`/api/public/image/${item.value.imgName}`, { responseType: "blob" })
		state.value.image = new File([originalImage.value], item.value.imgName, {
			type: originalImage.value.type,
		})
	} else {
		originalImage.value = null
	}
})

const MAX_FILE_SIZE = 2 * 1024 * 1024 // 2MB
const MIN_DIMENSIONS = { width: 200, height: 200 }
const MAX_DIMENSIONS = { width: 4096, height: 4096 }

type Schema = {
	image: File | undefined
	itemName: string | undefined
	category: string | undefined
}

const checkImageDimensions = async (file: File): Promise<boolean> => {
	const dataUrl = await new Promise<string>((resolve, reject) => {
		const reader = new FileReader()
		reader.onload = (e) => resolve(e.target?.result as string)
		reader.onerror = reject
		reader.readAsDataURL(file)
	})

	return await new Promise<boolean>((resolve, reject) => {
		const img = new Image()
		img.onload = () => {
			const valid =
				img.width >= MIN_DIMENSIONS.width &&
				img.height >= MIN_DIMENSIONS.height &&
				img.width <= MAX_DIMENSIONS.width &&
				img.height <= MAX_DIMENSIONS.height
			resolve(valid)
		}
		img.onerror = reject
		img.src = dataUrl
	})
}

const schema = z.object({
	image: z
		.file()
		.mime(["image/jpeg", "image/jpg", "image/png"], {
			message: "Invalid image type (JPG/PNG only)",
		})
		.max(MAX_FILE_SIZE, { message: "Image is too large (max 2MB)" })
		.refine(
			async (file) =>
				checkImageDimensions(file).then(
					(valid) => valid,
					() => false
				),
			{
				message: `Image dimensions must be between ${MIN_DIMENSIONS.width}x${MIN_DIMENSIONS.height} and ${MAX_DIMENSIONS.width}x${MAX_DIMENSIONS.height} pixels`,
			}
		),
	itemName: z
		.string()
		.min(1, "Item name is required")
		.max(20, "Item name must be at most 20 characters")
		.regex(/^[A-Za-z ]+$/, "Item name must only contain letters and spaces"),
	category: z.string().min(1, "Category is required"),
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
		formData.append("itemID", itemID)
		formData.append("name", event.data.itemName || "")
		formData.append("categoryName", event.data.category || "")
		if (event.data.image) {
			formData.append("image", event.data.image)
		}

		await $fetch("/api/volunteer/inventory/item", {
			method: "PUT",
			body: formData,
		})

		navigateTo(`/volunteer/inventory/${currentCategory}`)
	} catch (error) {
		// idk for now
	}
}
</script>
