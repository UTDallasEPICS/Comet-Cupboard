<template>
	<UCard
		class="relative min-w-72"
		:ui="{
			header: 'p-2 py-2 sm:p-2 sm:py-2',
			body: 'p-2 py-2 sm:p-2 sm:py-2',
		}"
	>
		<template #header>
			<div class="flex flex-row items-center justify-between px-2">
				<p class="truncate">{{ itemName }}</p>
				<div class="flex flex-row items-center gap-2">
					<UBadge v-if="dealExists" :label="dealText" />
					<UDropdownMenu
						:items="editMenuItems"
						:content="{
							align: 'end',
							side: 'bottom',
						}"
					>
						<UButton icon="material-symbols:edit" size="xs" variant="ghost" />
					</UDropdownMenu>
				</div>
			</div>
		</template>

		<div class="flex h-16 flex-row justify-between">
			<img :src="`/api/public/image/${imgName}`" :alt="itemName" class="ml-2 aspect-square h-full border border-black object-cover" />
			<div class="mt-auto flex flex-col items-end gap-2">
				<div class="flex flex-row items-center gap-2">
					<p>Qty:</p>
					<div class="flex flex-row rounded-xl border">
						<div class="w-12">
							<p class="ml-2 text-center">{{ props.currentCount }}</p>
						</div>

						<div :style="clipStyle" class="bg-final-page-bg flex w-16 items-center justify-center rounded-r-xl">
							<p class="text-center">{{ displayChange }}</p>
						</div>
					</div>
				</div>
				<div>
					<div class="flex items-center gap-1">
						<UButton icon="i-heroicons-minus" size="xs" variant="soft" @click="decrement" />
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
						<UButton icon="i-heroicons-plus" size="xs" variant="soft" @click="increment" />
					</div>
				</div>
			</div>
		</div>
	</UCard>
</template>

<script lang="ts" setup>
import type { DropdownMenuItem } from "@nuxt/ui"

const props = defineProps({
	itemName: {
		type: String,
		default: "Item name",
	},
	imgName: {
		type: String,
		default: "",
	},
	currentCount: {
		type: Number,
		default: 0,
	},
	changeCount: {
		type: Number,
		default: 0,
	},
	itemDeal: {
		type: Object,
		default: () => ({}),
	},
	itemID: {
		type: String,
		required: true,
	},
})

const route = useRoute()
const categoryName = route.params.categoryName as string

const editMenuItems = ref<DropdownMenuItem[]>([
	{ label: "Edit", onClick: () => navigateTo(`/volunteer/inventory/${categoryName}/${props.itemID}/edit`) },
	{ label: "Item Deal", onClick: () => navigateTo(`/volunteer/inventory/${categoryName}/${props.itemID}/deal`) },
	{ label: "Delete", onClick: () => navigateTo(`/volunteer/inventory/${categoryName}/${props.itemID}/delete`) },
])

const dealExists = computed(() => {
	return props.itemDeal.actualCount !== undefined && props.itemDeal.adjustedCount !== undefined
})

const dealText = computed(() => {
	if (!dealExists.value) {
		return ""
	}
	const a = props.itemDeal.actualCount
	const b = props.itemDeal.adjustedCount

	if (a === 1 && b === 0) return "FREE"

	return `${a} for ${b}`
})

const emit = defineEmits<{
	(e: "changeAmountUpdate", itemID: string, amountChange: number): void
}>()

// Per-click adjustment amount based on input
const adjustAmount = ref(1)

// Functions for emits
function increment() {
	emit("changeAmountUpdate", props.itemID, adjustAmount.value)
}

function decrement() {
	emit("changeAmountUpdate", props.itemID, -adjustAmount.value)
}

const displayChange = computed(() => {
	const c = Number(props.changeCount || 0)
	return c > 0 ? `+${c}` : `${c}`
})

function ensureValid() {
	if (adjustAmount.value === null || adjustAmount.value === "" || isNaN(adjustAmount.value)) {
		adjustAmount.value = 1
	}
}

// Creates a diagonal line styling with specified percentages to adjust the angle
const clipStyle = "clip-path: polygon(20% 0, 100% 0, 100% 100%, 0 100%)"
</script>
