<template>
	<UContainer class="py-8">
		<header>
			<SharedButtonNavigateBack :text="'Back to ' + currentCategory" :to="{ path: `/volunteer/inventory/${currentCategory}` }" />

			<UButton 
				icon="i-heroicons-question-mark-circle" 
				color="gray" 
				variant="ghost" 
				label="Take a Tour" 
				@click="startTour" 
			/>

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
					<UCard
						:ui="{
							header: 'p-2 py-2 sm:p-2 sm:py-2',
							body: 'p-2 py-2 sm:p-2 sm:py-2',
						}"
					>
						<template #header>
							<SharedTextBase class="mb-1"> Existing Items with Similar Names </SharedTextBase>
						</template>
						<template #default>
							<ul class="space-y-1" id="similar">
								<li v-for="similarItem in mostSimilarItems" :key="similarItem.id">
									<SharedTextBase>{{ similarItem.name }}</SharedTextBase>
								</li>
							</ul>
						</template>
					</UCard>
					<footer class="sticky right-4 bottom-8 mt-4 flex justify-end space-x-2 sm:ml-auto">
						<SharedButtonPositiveAction id="submit" type="submit" text="Submit" />
					</footer>
				</UForm>
			</div>
		</section>
	</UContainer>
</template>

<script lang="ts" setup>
import * as z from "zod"
import { driver } from "driver.js";
import "driver.js/dist/driver.css";
import { onMounted } from "vue"; 

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

const { data: items } = await useFetch("/api/student/inventory/items", {
	method: "GET",
	query: {
		checkAvailability: "false",
		includeArchived: "true",
	},
})
const { query, filtered } = useFuzzySearch(items ?? ref([]), { searchKeys: ["name"] })
watch(
	() => state.value.itemName,
	(name) => {
		query.value = name || ""
	},
	{ immediate: true }
)
const mostSimilarItems = computed(() => {
	return filtered.value.slice(0, 5)
})

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

const startTour = () => {
  driverObj.drive();
};

const driverObj = driver({
	showProgress: true,
	steps: [
		{
			element: '#image',
			popover: {
				title: 'Upload Image',
				description: 'Start by uploading an image for the item.'
			}
		},
		{
			element: '#itemName',
			popover: {
				title: 'Item Name',
				description: 'Enter a clear and recognizable name.'
			}
		},
		{
			element: '#similar',
			popover: {
				title: 'Similar Items',
				description: 'These help you avoid creating duplicates.'
			}
		},
		{
			element: '#submit',
			popover: {
				title: 'Submit',
				description: 'Click here to create the new item.'
			}
		}
	]
})

onMounted(() => {
	//diverObj.drive();
});
</script>
