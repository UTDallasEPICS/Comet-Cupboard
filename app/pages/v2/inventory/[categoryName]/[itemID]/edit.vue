<template lang="pug">
div.flex.flex-col.items-center.justify-center.gap-y-8(v-if="item")
    div.bg-white.w-80.h-80.rounded-xl.flex.flex-col.drop-shadow-standard.items-center.justify-center.relative.overflow-hidden
        img(v-if="imageUrl" :src="imageUrl").absolute.inset-0.w-full.h-full.object-cover
        label(
            for="fileInput"
            :class="{ 'bg-cupboardv2-lg bg-opacity-60': imageUrl }"
        ).z-10.flex.flex-row.items-center.justify-center.gap-x-3.bg-utd-green.w-52.h-20.rounded-xl.flex.gap-3.drop-shadow-standard.cursor-pointer
            div.flex.flex-row.items-center.gap-x-3
                CloudArrowUpIcon.w-12.h-12.text-white
                p.text-2xl.text-white.font-bold Upload
        input#fileInput(type="file" accept=".jpg, .jpeg, .png" @change="handleFileUpload").hidden
    div.flex.flex-col.items-center
                input.w-80.bg-transparent.outline-none.border-none.text-lg.text-left.text-black(type="text" placeholder="Item Name (Limit 20 Characters)" v-model="itemName" @input="validateInput")
                div.bg-cupboardv2-dg.w-80.rounded-xl.-mt-1(class="h-[2px]")
    Listbox(v-model="selectedCategory" v-slot="{ open }")
        div.relative
            ListboxButton.modal-button.flex.flex-row.w-72.bg-white.text-lg.text-cupboardv2-dg.px-4.items-center.text-left.font-normal.border-2.border-cupboardv2-lg
                div.grow
                    | {{ selectedCategory || "Category" }}
                ChevronUpIcon(v-if="open").fill-cupboardv2-dg.stroke-cupboardv2-dg.h-7
                ChevronDownIcon(v-else).fill-cupboardv2-dg.stroke-cupboardv2-dg.h-7
            TransitionsDropDown
                ListboxOptions.absolute.top-14.z-50.bg-white.drop-shadow-standard.rounded-xl.w-full.max-h-72.sm_max-h-36.divide-y.divide-cupboard-lg.overflow-y-auto.overscroll-contain
                    ListboxOption(
						v-for="category in categories"
						:key="category.name"
						:value="category.name"
					).p-1.text-center.text-lg.text-cupboardv2-dg.cursor-pointer.text-wrap.hover_bg-cupboardv2-lg
                        | {{ category.name }}  
        div(v-if="open").min-h-3
    // Footer Buttons
    div.flex.flex-row.gap-x-10.mt-32
        button(@click="goBack").bg-cupboardv2-dg.w-48.h-16.rounded-xl.flex.items-center.justify-center.drop-shadow-standard
            p.text-white.text-3xl.font-bold Cancel
        button(@click="editItemSubmit").bg-utd-orange.w-48.h-16.rounded-xl.flex.items-center.justify-center.drop-shadow-standard
            p.text-white.text-3xl.font-bold Submit

</template>

<script lang="ts" setup>
import { CloudArrowUpIcon, ChevronDownIcon, ChevronUpIcon } from '@heroicons/vue/24/solid'
import { Listbox, ListboxButton, ListboxOption, ListboxOptions } from "@headlessui/vue"
import { useRoute, navigateTo } from '#imports' 

const route = useRoute()
const categoryName = route.params.categoryName as string
const itemID = route.params.itemID as string

// Fetch item data based on route
const { data: item } = await useFetch(`/api/inventory/item`, {
    params: { itemID }
})

const { data: categories } = await useFetch("/api/controls/categories")

const itemName = ref("")
const imageFile = ref<File | null>(null)
const imageUrl = ref("")
const selectedCategory = ref<string | null>(null)

watchEffect(() => {
    if(item.value) {
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

		navigateTo(`/v2/inventory/${categoryName}`)
	} catch (error) {
		console.error("Error editing item:", error)
	}
}

// --Page navigations for each button--
// Goes back to the inventory page for the current category
const goBack = () => {
    navigateTo(`/v2/inventory/${categoryName}`)
}

// Input validation so input is only letters/symbols, and is limited to 20 characters
function validateInput(e: Event) {
    const inputElement = e.target as HTMLInputElement
    const input = inputElement.value
    
    let filtered = '';
    for(const char of input) {
        if(char < '0' || char > '9') {
            filtered += char;
        }
    }   

    if(filtered.length > 20) {
        filtered = filtered.slice(0, 20);
    }

    inputElement.value = filtered;
    itemName.value = filtered;
}
</script>