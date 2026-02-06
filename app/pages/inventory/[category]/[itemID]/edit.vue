<template>
	<div>
		<div v-if="item" class="mt-20 flex flex-col items-center justify-center gap-y-8 pt-10">
			<div class="drop-shadow-standard relative flex h-80 w-full max-w-80 flex-col items-center justify-center gap-3 overflow-hidden rounded-xl bg-white">
				<img v-if="imageUrl" :src="imageUrl" class="absolute inset-0 h-full w-full object-cover" />
				<label
					:class="{ 'bg-opacity-60': imageUrl }"
					for="fileInput"
					class="drop-shadow-standard z-10 flex h-16 w-40 cursor-pointer flex-row items-center justify-center gap-3 gap-x-3 rounded-xl"
				>
					<div class="flex flex-row items-center gap-x-3">
						<CloudArrowUpIcon class="h-12 w-12 text-white" />
						<p class="text-white">Upload</p>
					</div>
				</label>
				<input id="fileInput" accept=".jpg, .jpeg, .png" type="file" @change="handleFileUpload" class="hidden" />
			</div>
			<div class="flex flex-col items-center">
				<input
					placeholder="Item Name (Limit 20 Characters)"
					type="text"
					v-model="itemName"
					@input="validateInput"
					class="w-80 w-full border-none bg-transparent text-left text-black outline-none"
				/>
				<div class="-mt-1 h-[2px] w-72 rounded-xl"></div>
			</div>
			<Listbox v-model="selectedCategory" v-slot="{ open }">
				<div class="relative">
					<ListboxButton
						class="modal-buttonflex w-72 flex-row items-center border-2 bg-white px-4 text-left"
					>
						<div class="grow">
							{{ selectedCategory || "Category" }}
						</div>
						<ChevronUpIcon v-if="open" class="h-5" />
						<ChevronDownIcon v-else class="h-5" />
					</ListboxButton>
					<ListboxOptions
						class="drop-shadow-standard absolute top-12 z-50 max-h-36 w-full divide-y overflow-y-auto overscroll-contain rounded-xl bg-white"
					>
						<ListboxOption
							v-for="category in categories"
							:key="category.name"
							:value="category.name"
							class="hover:cursor-pointer p-1 text-center text-wrap"
						>
							{{ category.name }}
						</ListboxOption>
					</ListboxOptions>
				</div>
			</Listbox>
			<!-- Footer Buttons -->
			<div class="mt-20 flex flex-row gap-x-4">
				<button @click="goBack" class="drop-shadow-standard flex h-12 w-32 items-center justify-center rounded-xl">
					<p class="text-white">Cancel</p>
				</button>
				<button @click="editItemSubmit" class="drop-shadow-standard flex h-12 w-32 items-center justify-center rounded-xl">
					<p class="text-white">Submit</p>
				</button>
			</div>
		</div>
	</div>
</template>

<script lang="ts" setup>
import { CloudArrowUpIcon, ChevronDownIcon, ChevronUpIcon } from "@heroicons/vue/24/solid"
import { Listbox, ListboxButton, ListboxOption, ListboxOptions } from "@headlessui/vue"
import { useRoute, navigateTo } from "#imports"

const route = useRoute()
const categoryName = route.params.categoryName as string
const itemID = route.params.itemID as string

// Fetch item data based on route
const { data: item } = await useFetch(`/api/inventory/item`, {
	params: { itemID },
})

const { data: categories } = await useFetch("/api/controls/categories")

const itemName = ref("")
const imageFile = ref<File | null>(null)
const imageUrl = ref("")
const selectedCategory = ref<string | null>(null)

watchEffect(() => {
	if (item.value) {
		itemName.value = item.value.name || ""
		selectedCategory.value = item.value.categoryName || null
		imageUrl.value = item.value.imgName ? `/api/image/${item.value.imgName}` : ""
	}
})

watch(imageFile, (newFile) => {
	if (newFile) {
		imageUrl.value = URL.createObjectURL(newFile)
	} else if (item.value?.imgName) {
		imageUrl.value = `api/image/${item.value.imgName}`
	} else {
		imageUrl.value = ""
	}
})

const handleFileUpload = (event: Event) => {
	const target = event.target as HTMLInputElement
	if (target.files && target.files.length > 0) {
		imageFile.value = target.files[0]!
	}
}

const editItemSubmit = async () => {
	try {
		let imgName = item.value?.imgName

		if (imageFile.value) {
			const formData = new FormData()
			formData.append("image", imageFile.value)
			const { imageName } = await $fetch("/api/image/image", {
				method: "POST",
				body: formData,
			})
			imgName = imageName
		}

		await $fetch("/api/inventory/item", {
			method: "PUT",
			body: {
				itemID,
				name: itemName.value,
				categoryName: selectedCategory.value,
				imgName,
			},
		})

		navigateTo(`/inventory/${categoryName}`)
	} catch (error) {
		console.error("Error editing item:", error)
	}
}

// --Page navigations for each button--
// Goes back to the inventory page for the current category
const goBack = () => {
	navigateTo(`/inventory/${categoryName}`)
}

// Input validation so input is only letters/symbols, and is limited to 20 characters
function validateInput(e: Event) {
	const inputElement = e.target as HTMLInputElement
	const input = inputElement.value

	let filtered = ""
	for (const char of input) {
		if (char < "0" || char > "9") {
			filtered += char
		}
	}

	if (filtered.length > 20) {
		filtered = filtered.slice(0, 20)
	}

	inputElement.value = filtered
	itemName.value = filtered
}
</script>
