<template>
	<UContainer class="py-8">
		<header>
			<SharedButtonNavigateBack :text="'Back to ' + currentCategory" :to="{ path: `/inventory/${currentCategory}` }" />
			<SharedTextPageTitle>{{ currentCategory }}</SharedTextPageTitle>
		</header>

		<section class="mt-4">
			<SharedTextSectionTitle>Add {{ currentCategory }} Item</SharedTextSectionTitle>
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
					<SharedButtonPositiveAction type="submit" text="Submit" />
				</UForm>
			</div>
		</section>
	</UContainer>
</template>

<script lang="ts" setup>
import * as z from "zod"
import type { FormError, FormErrorEvent, FormSubmitEvent } from "@nuxt/ui"

const route = useRoute()
const currentCategory = computed(() => route.params.category)

const MAX_FILE_SIZE = 2 * 1024 * 1024 // 2MB
const MIN_DIMENSIONS = { width: 200, height: 200 }
const MAX_DIMENSIONS = { width: 4096, height: 4096 }

type Schema = {
	image: File | undefined
	itemName: string | undefined
}
const state = ref<Partial<Schema>>({
	image: undefined,
	itemName: undefined,
})

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
		if (event.data.image) {
			formData.append("image", event.data.image)
		}
		const { imageName } = await $fetch("/api/image/image", {
			method: "POST",
			body: formData,
		})
		await $fetch("/api/inventory/item", {
			method: "PUT",
			body: { name: event.data.itemName, categoryName: currentCategory.value, imgName: imageName },
		})

		navigateTo(`/inventory/${currentCategory.value}`)
	} catch (error) {
		// idk for now
	}
}
</script>
