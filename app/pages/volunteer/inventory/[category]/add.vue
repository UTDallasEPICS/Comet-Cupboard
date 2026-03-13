<template>
	<UContainer class="py-8">
		<header>
			<SharedButtonNavigateBack :text="'Back to ' + currentCategory" :to="{ path: `/volunteer/inventory/${currentCategory}` }" />
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

const route = useRoute()
const currentCategory = route.params.category as string

const formSchema = imageSchema.extend({
	itemName: z
		.string()
		.min(1, "Item name is required")
		.max(20, "Item name must be at most 20 characters")
		.regex(/^[A-Za-z ]+$/, "Item name must only contain letters and spaces"),
})

const { schema, state, validate, onError } = createFormBuilder(formSchema, () => ({
	image: undefined,
	itemName: undefined,
}))

const onSubmit = async (event) => {
	try {
		const formData = new FormData()
		formData.append("name", event.data.itemName || "")
		formData.append("categoryName", currentCategory as string)
		formData.append("archived", "false")
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
