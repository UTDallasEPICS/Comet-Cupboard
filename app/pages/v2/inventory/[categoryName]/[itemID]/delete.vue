<template lang="pug">
div
	div.flex.absolute.top-20.left-0.w-full.h-16.z-30.justify-center
		V2SharedHeaderSubheader(pageTitle="Delete")(class="md_max-w-[600px]").md_rounded-b-3xl
	div.flex.flex-col.items-center.justify-center.gap-y-8.pt-10.mt-20
		V2SharedStatusMessageWarning(warningMessage="This item will be permanently deleted from the database!")
		div.bg-white.w-full.max-w-96.h-80.rounded-xl.flex.flex-col.gap-3.drop-shadow-standard.items-center.justify-center.relative
			// Delete confirmation text
			div.flex.flex-col.items-center.justify-center.text-center.px-8.w-full
				p.text-3xl.text-black.font-normal.break-words Are you sure you want to delete
				p.text-4xl.text-black.font-bold.break-words {{ itemName + "?" }}
		// Footer Buttons
		div.flex.flex-row.gap-x-4.mt-32
			button(@click="goBack").bg-cupboardv2-dg.w-32.h-12.rounded-xl.flex.items-center.justify-center.drop-shadow-standard
				p.text-white.text-xl.font-bold Cancel
			button(@click="deleteItemSubmit").bg-utd-orange.w-32.h-12.rounded-xl.flex.items-center.justify-center.drop-shadow-standard
				p.text-white.text-xl.font-bold Yes, Delete
</template>

<script lang="ts" setup>
import { useRoute, navigateTo } from "#imports"

const emit = defineEmits(["submit"])
const route = useRoute()
const currentCategory = route.params.categoryName as string
const itemID = route.params.itemID as string

// Fetch item data based on route
const { data: item } = await useFetch(`/api/inventory/item`, {
	params: { itemID },
})

const itemName = computed(() => item.value?.name ?? "")

const toggleDeleteItem = () => {
	emit("submit")
}

const deleteItemSubmit = async () => {
	if (!item.value) return

	await $fetch("/api/inventory/item", {
		method: "DELETE",
		body: { itemID: item.value.itemID },
	})
	toggleDeleteItem()

	navigateTo(`/v2/inventory/${currentCategory}`)
}

// Goes back to the inventory page for the current category
const goBack = () => {
	navigateTo(`/v2/inventory/${currentCategory}`)
}
</script>
