<template>
	<UContainer>
		<NuxtLayout
			name="main"
			:title="`Edit bag: ${emergencyBag.label}`"
			:back-navigation="{ text: 'Back to Manage Bags', to: '/volunteer/emergency-bag/manage' }"
		/>
		<div class="flex items-center justify-center">
			<UCard class="w-full max-w-100">
				<div class="flex flex-col gap-4">
					<EmergencyBagItemCard
						v-for="item in emergencyBag.EmergencyBagItems"
						:key="item.itemID"
						:name="item.Item.name"
						:img-name="item.Item.imgName"
						:item-deal="item.Item.itemDeal"
						:item-count="item.count"
						:item-quantity="item.Item.quantity"
						@remove="removeItemFromBag(item.itemID)"
						@increment="increaseItemCount(item.itemID)"
						@decrement="decreaseItemCount(item.itemID)"
					/>
				</div>
			</UCard>
		</div>
		<footer class="sticky right-4 bottom-8 mt-4 flex justify-end space-x-2 sm:ml-auto">
			<SharedButtonPositiveAction type="submit" text="Submit" @click="editBag()" />
		</footer>
	</UContainer>
</template>

<script lang="ts" setup>
const route = useRoute()
const bagID = route.params.bagID
const emergencyBag = ref()

const { data } = await useFetch("/api/volunteer/emergency-bag/emergencyBag", {
	query: { bagID: bagID },
})
watchEffect(() => {
	emergencyBag.value = data.value
})

console.log("API Return:", emergencyBag.value)

const removeItemFromBag = (itemID: string) => {
	if (!emergencyBag.value.EmergencyBagItems) return
	emergencyBag.value.EmergencyBagItems = emergencyBag.value.EmergencyBagItems.filter((item) => item.itemID != itemID)
}

const increaseItemCount = (itemID: string) => {
	if (!emergencyBag.value.EmergencyBagItems) return

	const item = emergencyBag.value.EmergencyBagItems.find((bi) => bi.itemID === itemID)
	if (!item) return

	const available = Math.max(0, item.Item.quantity)
	if (item.count >= available) return

	item.count++
}

const decreaseItemCount = (itemID: string) => {
	if (!emergencyBag.value.EmergencyBagItems) return

	const item = emergencyBag.value.EmergencyBagItems.find((bi) => bi.itemID === itemID)
	if (item.count === 1) {
		removeItemFromBag(itemID)
	} else {
		item.count--
	}
}

const editBag = async () => {
	if (!emergencyBag.value) return

	try {
		const editBag = await $fetch("/api/volunteer/emergency-bag/emergencyBag", {
			method: "PATCH",
			body: {
				bagID: emergencyBag.value.bagID,
				items: emergencyBag.value.EmergencyBagItems.map((item) => ({
					itemID: item.itemID,
					count: item.count,
				})),
			},
		})
	} catch (err: any) {
		console.log("Failed to edit bag: ", err)
	}
}
</script>
