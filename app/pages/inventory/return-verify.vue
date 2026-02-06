<template>
	<div>
		<div class="mt-10 flex flex-col items-center justify-center gap-y-8 pt-10">
			<V2SharedStatusMessageWarning warningMessage="This will remove all in progress changes!"></V2SharedStatusMessageWarning>
			<div class="drop-shadow-standard relative flex h-80 w-full max-w-96 flex-col items-center justify-center gap-3 rounded-xl bg-white">
				<!-- Delete confirmation text -->
				<div class="flex w-full flex-col items-center justify-center px-8 text-center">
					<p class="break-words text-black">Are you sure you want to return?</p>
				</div>
			</div>
			<!-- Footer Buttons -->
			<div class="mt-20 flex flex-row gap-x-4">
				<button @click="goBack" class="drop-shadow-standard flex h-12 w-32 items-center justify-center rounded-xl">
					<p class="text-white">Cancel</p>
				</button>
				<button @click="categoryReturn" class="drop-shadow-standard flex h-12 w-32 items-center justify-center rounded-xl">
					<p class="text-white">Yes</p>
				</button>
			</div>
		</div>
	</div>
</template>

<script lang="ts" setup>
import { useRoute, navigateTo } from "#imports"

const emit = defineEmits(["submit"])
const route = useRoute()
const currentCategory = computed(() => {
	const cat = route.query.categoryName ?? route.query.category ?? ""
	return Array.isArray(cat) ? cat[0] : String(cat)
})
const inventoryStore = useInventoryStore()

const categoryReturn = () => {
	inventoryStore.resetChanges()
	navigateTo(`/inventory`)
}

// Goes back to the inventory page for the current category
const goBack = () => {
	navigateTo(`/inventory/${currentCategory.value}`)
}
</script>
