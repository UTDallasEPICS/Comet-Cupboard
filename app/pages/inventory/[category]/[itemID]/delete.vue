<template>
	<div>
		<div class="mt-10 flex flex-col items-center justify-center gap-y-8 pt-10">
			<V2SharedStatusMessageWarning :warningMessage="`Item ${itemName}' will be archived`" />
			<div class="drop-shadow-standard relative flex h-80 w-full max-w-96 flex-col items-center justify-center gap-3 rounded-xl bg-white">
				<!-- Delete confirmation text -->
				<div class="flex w-full flex-col items-center justify-center px-8 text-center">
					<p class="break-words text-black">Are you sure you want to delete</p>
					<p class="break-words text-black">{{ itemName + "?" }}</p>
				</div>
			</div>
			<!-- Footer Buttons -->
			<div class="mt-20 flex flex-row gap-x-4">
				<button @click="goBack" class="bg-cupboardv2-dg drop-shadow-standard flex h-12 w-32 items-center justify-center rounded-xl">
					<p class="text-white">Cancel</p>
				</button>
				<button @click="deleteItemSubmit" class="bg-utd-orange drop-shadow-standard flex h-12 w-32 items-center justify-center rounded-xl">
					<p class="text-white">Yes, Delete</p>
				</button>
			</div>
		</div>
	</div>
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

	navigateTo(`/inventory/${currentCategory}`)
}

// Goes back to the inventory page for the current category
const goBack = () => {
	navigateTo(`/inventory/${currentCategory}`)
}
</script>
