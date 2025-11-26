<template lang="pug">
div
	div.flex.absolute.top-20.left-0.w-full.h-16.z-30.justify-center
		V2SharedHeaderSubheader(pageTitle="Add Item")(class="md_max-w-[600px]").md_rounded-b-xl
	div.flex.flex-col.items-center.justify-center.gap-y-8.pt-10.mt-20
		div.bg-white.w-80.h-80.rounded-xl.flex.flex-col.gap-3.drop-shadow-standard.items-center.justify-center.relative.overflow-hidden
			img(v-if="imageUrl" :src="imageUrl").absolute.inset-0.w-full.h-full.object-cover
			label(
				:class="{ 'bg-cupboardv2-lg bg-opacity-60': imageUrl }"
				for="fileInput"
			).z-10.flex.flex-row.items-center.justify-center.gap-x-3.bg-utd-green.w-40.h-16.rounded-xl.flex.gap-3.drop-shadow-standard.cursor-pointer
				div.flex.flex-row.items-center.gap-x-3
					CloudArrowUpIcon.w-12.h-12.text-white
					p.text-xl.text-white.font-bold Upload
			input#fileInput(accept=".jpg, .jpeg, .png" type="file" @change="handleFileUpload").hidden
		div.flex.flex-col.items-center
			input(
				placeholder="Item Name (Limit 20 Characters)"
				type="text"
				v-model="itemName"
				@input="validateInput"
			).w-80.bg-transparent.outline-none.border-none.text-lg.text-left.text-black
			div(class="h-[2px]").bg-cupboardv2-dg.w-80.rounded-xl.-mt-1
		// Footer Buttons
		div.flex.flex-row.gap-x-4.mt-32
			button(@click="goBack").bg-cupboardv2-dg.w-32.h-12.rounded-xl.flex.items-center.justify-center.drop-shadow-standard
				p.text-white.text-xl.font-bold Cancel
			button(@click="addItemSubmit").bg-utd-orange.w-32.h-12.rounded-xl.flex.items-center.justify-center.drop-shadow-standard
				p.text-white.text-xl.font-bold Submit
</template>

<script lang="ts" setup>
import { CloudArrowUpIcon, ChevronDownIcon, ChevronUpIcon } from "@heroicons/vue/24/solid"
import { Listbox, ListboxButton, ListboxOption, ListboxOptions } from "@headlessui/vue"
import { useRoute, navigateTo } from "#imports"
import Subheader from "~/components/V2/Shared/Header/Subheader.vue"

const emit = defineEmits(["submit"])
const route = useRoute()
const itemName = ref<string | null>(null)
const imageFile = ref<File | null>(null)
const imageUrl = ref<string | null>(null)
const selectedCategory = ref(null)
const currentCategory = route.params.categoryName as string

const { data: categories } = await useFetch("/api/controls/categories")

watch(imageFile, (newFile) => {
	if (newFile) {
		imageUrl.value = URL.createObjectURL(newFile)
	} else {
		imageUrl.value = null
	}
})

const handleFileUpload = (event: Event) => {
	const target = event.target as HTMLInputElement
	if (target.files && target.files.length > 0) {
		imageFile.value = target.files[0]!
	}
}

const addItemSubmit = async () => {
	if (!itemName.value || !imageFile.value) {
		alert("Please fill out all required fields")
		return
	}
	try {
		if (imageFile.value) {
			const formData = new FormData()
			formData.append("image", imageFile.value)
			const { imageName } = await $fetch("/api/image/image", {
				method: "POST",
				body: formData,
			})

			await $fetch("/api/inventory/item", {
				method: "PUT",
				body: { itemID: "", name: itemName.value, categoryName: currentCategory, imgName: imageName },
			})
			navigateTo(`/v2/inventory/${currentCategory}`)
		}
	} catch (error) {
		console.error("Failed to add item:", error)
		alert("Failed to add item. Check console for details.")
	}
}

// --Page navigations for each button--
// Goes back to the inventory page for the current category
const goBack = () => {
	navigateTo(`/v2/inventory/${currentCategory}`)
}

// Input validation so input is only letters, and is limited to 20 characters
function validateInput(e: Event) {
	const inputElement = e.target as HTMLInputElement
	const input = inputElement.value

	let lettersOnly = ""
	for (const char of input) {
		if ((char >= "A" && char <= "Z") || (char >= "a" && char <= "z")) {
			lettersOnly += char
		}
	}

	if (lettersOnly.length > 20) {
		lettersOnly = lettersOnly.slice(0, 20)
	}

	inputElement.value = lettersOnly
	itemName.value = lettersOnly
}
</script>
