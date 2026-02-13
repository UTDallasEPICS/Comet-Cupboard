<template>
	<UCard
		class="relative min-w-72"
		:ui="{
			header: 'p-2 py-2 sm:p-2 sm:py-2',
			body: 'p-2 py-2 sm:p-2 sm:py-2',
		}"
	>
		<template #header>
			<div class="flex flex-row justify-between px-2">
				<p class="truncate">
					{{ name }}
				</p>
				<div class="flex items-center gap-2">
					<UBadge v-if="badgeType === 'free'" label="Free" class="" />
					<UBadge v-else-if="badgeType === 'deal'" :label="`${props.itemDeal.actualCount} for ${props.itemDeal.adjustedCount}`" class="" />
					<UButton variant="ghost" icon="i-heroicons-x-mark" class="shrink-0" size="xs" @click="removeCartItem" />
				</div>
			</div>
		</template>

		<div class="flex h-16 flex-row justify-between">
			<img :src="`/api/image/${imgName}`" :alt="name" class="ml-2 aspect-square h-full border border-black object-cover" />
			<div class="mt-auto flex flex-row gap-2 items-center">
				<p>QTY</p>
				<div class="flex items-center gap-1">
					<UButton icon="i-heroicons-minus" size="xs" variant="soft" :disabled="props.count <= 1 || isSaving" @click="decrement" />
					<div class="flex items-center justify-center rounded w-8">
						{{ props.count }}
					</div>
					<UButton icon="i-heroicons-plus" size="xs" variant="soft" :disabled="isSaving" @click="increment" />
				</div>
			</div>
		</div>
	</UCard>
</template>

<script setup lang="ts">
const props = defineProps({
	name: { type: String, required: true },
	imgName: { type: String, required: true },
	itemID: { type: String, required: true },
	count: { type: Number, required: true },
	expiredCount: { type: Number, required: true },
	showExpired: { type: Boolean, default: false },
	itemDeal: { type: Object, default: () => ({}) },
})

const emit = defineEmits(["update:cart"])

const dealExists = computed(() => {
	return props.itemDeal && "actualCount" in props.itemDeal && "adjustedCount" in props.itemDeal
})

const badgeType = computed(() => {
	if (!dealExists.value) return null
	if (props.itemDeal.actualCount === 1 && props.itemDeal.adjustedCount === 0) return "free"
	return "deal"
})

const isSaving = ref(false)

const increment = async () => {
	await $fetch("/api/cart/cartItemCount", {
		method: "POST",
		body: { itemID: props.itemID, incrementChange: 1 },
	})
	isSaving.value = false
	emit("update:cart")
}

const decrement = async () => {
	if (props.count <= 1) return
	await $fetch("/api/cart/cartItemCount", {
		method: "POST",
		body: { itemID: props.itemID, incrementChange: -1 },
	})
	isSaving.value = false
	emit("update:cart")
}

const removeCartItem = async () => {
	await $fetch("/api/cart/cartItem", {
		method: "DELETE",
		body: { itemID: props.itemID },
	})
	emit("update:cart")
}
</script>
