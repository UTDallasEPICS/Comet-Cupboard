<template>
	<UCollapsible v-model:open="isOpen" class="w-full min-w-72" disabled>
		<UChip
			:text="changeCount > 0 ? `+${changeCount}` : `${changeCount}`"
			:show="changeCount != 0"
			:ui="{
				base: 'h-[24px] min-w-[24px] text-[12px]',
			}"
			class="w-full"
		>
			<UCard
				:class="`${changeCount != 0 ? 'border-utd-orange' : ''} relative w-full min-w-72 shadow-md`"
				:ui="{
					body: 'p-0 py-0 sm:p-0 sm:py-0',
				}"
			>
				<div class="absolute top-2 right-2 flex flex-row gap-2">
					<SharedDealBadge :item-deal="itemDeal" />
					<UDropdownMenu
						:items="editMenuItems"
						:content="{
							align: 'end',
							side: 'bottom',
						}"
					>
						<UButton :icon="icons['ellipsesActions']" size="sm" color="neutral" variant="ghost" />
					</UDropdownMenu>
				</div>

				<div class="flex flex-row items-center gap-2">
					<img
						:src="`/api/public/image/${imgName}`"
						:alt="name"
						class="border-border-soft aspect-square h-full w-20 rounded-l-lg border object-cover"
					/>

					<div class="flex w-full flex-col p-2">
						<div class="flex flex-row items-center justify-between">
							<SharedTextCardTitle>{{ name }}</SharedTextCardTitle>
						</div>

						<div class="flex flex-row items-center justify-between">
							<UBadge :label="`QTY: ${currentCount}`" variant="outline" color="neutral" />
						</div>
					</div>
				</div>
				<UButton :icon="icons['chevronDown']" size="sm" variant="ghost" color="neutral" class="absolute right-2 bottom-2" @click="isOpen = !isOpen" />
			</UCard>
		</UChip>
		<template #content>
			<div class="border-utd-green flex h-min gap-1 rounded-3xl">
				<div class="border-utd-green ml-auto flex w-fit items-center overflow-hidden rounded-md border bg-white">
					<SharedButtonBaseCustomColor
						custom-color="utd-green"
						content-color="white"
						button-variant="ghost"
						:ui="{
							base: 'rounded-none px-2 h-full',
						}"
						:icon="icons.subtract"
						size="sm"
						@click="decrement"
					/>
					<UInputNumber
						v-model="adjustAmount"
						:increment="false"
						:decrement="false"
						:min="1"
						:max="99"
						class="w-10"
						:ui="{
							root: 'border-0 shadow-none',
							base: 'text-center',
						}"
						variant="ghost"
						color="neutral"
						@blur="ensureValid"
					/>
					<SharedButtonBaseCustomColor
						custom-color="utd-green"
						content-color="white"
						button-variant="ghost"
						:ui="{
							base: 'rounded-none px-2 h-full',
						}"
						:icon="icons.add"
						size="sm"
						@click="increment"
					/>
				</div>
			</div>
		</template>
	</UCollapsible>
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

const isOpen = ref(false)

const editMenuItems = ref<DropdownMenuItem[]>([
	{ label: "Edit", onClick: () => navigateTo(`/volunteer/inventory/${props.category}/${props.itemID}/edit`) },
	{ label: "Item Deal", onClick: () => navigateTo(`/volunteer/inventory/${props.category}/${props.itemID}/deal`) },
])

const adjustAmount = ref(1)

const increment = async () => {
	await inventoryStore.changeInventorySessionItemCount(props.itemID, adjustAmount.value)
}

const decrement = async () => {
	await inventoryStore.changeInventorySessionItemCount(props.itemID, -adjustAmount.value)
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
</script>
