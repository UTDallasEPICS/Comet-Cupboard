<template>
	<SharedItemCard :name="name" :img-name="imgName" :item-deal="itemDeal" :item-i-d="itemID">
		<template #header-actions>
			<UDropdownMenu
				:items="editMenuItems"
				:content="{
					align: 'end',
					side: 'bottom',
				}"
			>
				<UButton :icon="icons['edit']" size="xs" variant="ghost" />
			</UDropdownMenu>
		</template>
		<template #body>
			<div class="mt-auto flex flex-col items-end gap-2">
				<div class="flex flex-row items-center gap-2">
					<SharedTextBase>Qty:</SharedTextBase>
					<div class="border-final-text-soft flex flex-row rounded-xl border">
						<div class="w-12">
							<p class="ml-2 text-center">{{ props.currentCount }}</p>
						</div>

						<div :style="clipStyle" class="bg-final-border-soft flex w-16 items-center justify-center rounded-r-xl">
							<p class="text-center">{{ displayChange }}</p>
						</div>
					</div>
				</div>
				<div>
					<div class="flex items-center gap-1">
						<UButton :icon="icons['subtract']" size="xs" variant="soft" @click="decrement" />
						<UInputNumber
							v-model="adjustAmount"
							class="w-12"
							:increment="false"
							:decrement="false"
							:min="1"
							:max="99"
							:ui="{
								base: 'text-center',
							}"
							@blur="ensureValid"
						/>
						<UButton :icon="icons['add']" size="xs" variant="soft" @click="increment" />
					</div>
				</div>
			</div>
		</template>
	</SharedItemCard>
</template>

<script lang="ts" setup>
import type { DropdownMenuItem } from "@nuxt/ui"

const props = defineProps({
	name: {
		type: String,
		default: "Item name",
	},
	imgName: {
		type: String,
		default: "",
	},
	itemDeal: {
		type: Object,
		default: () => ({}),
	},
	itemID: {
		type: String,
		required: true,
	},
	currentCount: {
		type: Number,
		default: 0,
	},
	changeCount: {
		type: Number,
		default: 0,
	},
	category: {
		type: String,
		required: true,
	},
})

const inventoryStore = useInventoryStore()
const { changeInventorySessionItemCount } = inventoryStore

const editMenuItems = ref<DropdownMenuItem[]>([
	{ label: "Edit", onClick: () => navigateTo(`/volunteer/inventory/${props.category}/${props.itemID}/edit`) },
	{ label: "Item Deal", onClick: () => navigateTo(`/volunteer/inventory/${props.category}/${props.itemID}/deal`) },
])

const adjustAmount = ref(1)

const increment = async () => {
	await changeInventorySessionItemCount(props.itemID, adjustAmount.value)
}

const decrement = async () => {
	await changeInventorySessionItemCount(props.itemID, -adjustAmount.value)
}

const displayChange = computed(() => {
	const c = Number(props.changeCount || 0)
	return c > 0 ? `+${c}` : `${c}`
})

const ensureValid = () => {
	if (adjustAmount.value === null || adjustAmount.value === "" || isNaN(adjustAmount.value)) {
		adjustAmount.value = 1
	}
}

// Creates a diagonal line styling with specified percentages to adjust the angle
const clipStyle = "clip-path: polygon(20% 0, 100% 0, 100% 100%, 0 100%)"
</script>
