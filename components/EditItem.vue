<template lang="pug">
div.px-5.overflow-y-scroll.overscroll-contain
	div.flex.flex-col.sm_flex-row.justify-center.items-center.sm_space-x-10.mt-7.mb-12
		div.relative.z-10.flex.flex-col.max-w-52.max-h-52.min-w-52.min-h-52.bg-gray-300.items-center.justify-center.rounded
			img(v-if="imageUrl" :src="imageUrl").absolute.inset-0.w-full.h-full.object-cover.rounded.shadow-lg
			label(
				:class="{ 'bg-gray-500 bg-opacity-60': imageUrl }"
				for="fileInput"
			).modal-button.z-50.flex.w-36.space-x-5.items-center.justify-center.bg-utd-green.text-white.cursor-pointer.hover_underline
				ArrowUpTrayIcon(style="stroke: white").h-6.text-white
				div
					| Upload
				input#fileInput(accept=".jpg, .jpeg, .png" type="file" @change="handleFileUpload").hidden
		div.flex.flex-col.max-sm_pt-5.space-y-5
			input(type="text" v-model="itemName" :placeholder="props.item.name").modal-input.w-full.border-b-2.border-black.px-1
			Listbox(v-model="selectedCategory" v-slot="{ open }")
				div.relative
					ListboxButton.modal-button.flex.flex-row.w-full.bg-utd-orange.text-white.px-4.items-center.text-left.font-semibold
						div.grow
							| {{ selectedCategory || "Category" }}
						ChevronUpIcon(v-if="open").fill-white.stroke-white.h-7
						ChevronDownIcon(v-else).fill-white.stroke-white.h-7
					TransitionsDropDown
						ListboxOptions.absolute.top-14.z-50.bg-white.rounded-xl.w-full.max-h-72.sm_max-h-36.divide-y.divide-cupboard-lg.overflow-y-auto.overscroll-contain.drop-shadow-standard
							ListboxOption(
								v-for="category in categories"
								:key="category.name"
								:value="category.name"
							).p-1.text-center.text-xl.cursor-pointer.text-wrap.hover_bg-cupboard-lg
								| {{ category.name }}
				div(v-if="open").min-h-72.sm_hidden
	div.grow.mb-5.flex.justify-center
		button(@click="editItemSubmit").modal-button.w-full.sm_w-56.bg-utd-green.text-white Submit
</template>

<script lang="ts" setup>
import { ArrowUpTrayIcon, ChevronDownIcon, ChevronUpIcon } from "@heroicons/vue/24/solid"
import { Listbox, ListboxButton, ListboxOption, ListboxOptions } from "@headlessui/vue"

const props = defineProps({
	item: {
		type: Object,
		required: true,
	},
})

const emit = defineEmits(["submit"])

const itemName = ref(props.item.name || null)
const imageFile = ref<File | null>(null)
const imageUrl = ref(props.item.imgName || null)
const selectedCategory = ref(props.item.categoryName || null)

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
		imageFile.value = target.files[0]
	}
}

const editItemSubmit = async () => {
	try {
		if (imageFile.value) {
			// send image to server
			const formData = new FormData()
			const fileReader = new FileReader()
			fileReader.readAsArrayBuffer(imageFile.value)
			formData.append("image", imageFile.value)
			const { imageName } = await $fetch("/api/image/image", {
				method: "POST",
				body: formData,
			})
			await $fetch("/api/inventory/item", {
				method: "PUT",
				body: { itemID: props.item.itemID, name: itemName.value, categoryName: selectedCategory.value, imgName: imageName },
			})
		} else {
			await $fetch("/api/inventory/item", {
				method: "PUT",
				body: { itemID: props.item.itemID, name: itemName.value, categoryName: selectedCategory.value, imgName: props.item.imgName },
			})
		}

		emit("submit")
	} catch (error) {
		// idk for now
	}
}
</script>
