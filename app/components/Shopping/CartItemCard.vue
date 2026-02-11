<template>
	<UCard
		class="relative w-72"
		:ui="{
			header: 'p-4 py-2 sm:p-4 sm:py-2',
			body: 'p-4 py-2 sm:p-4 sm:py-2',
		}"
	>
		<template #header>
			<div class="flex flex-row items-center justify-between">
				<p class="truncate">
					{{ name }}
				</p>
				<div class="flex items-center gap-2">
					<UBadge v-if="badgeType === 'free'" label="Free" class="" />
					<UBadge v-else-if="badgeType === 'deal'" :label="`${props.itemDeal.actualCount} for ${props.itemDeal.adjustedCount}`" class="" />
					<UButton variant="ghost" icon="i-heroicons-x-mark" class="shrink-0" @click="removeCartItem" />
				</div>
			</div>
		</template>

		<div class="flex h-16 flex-row items-center gap-4">
			<img :src="`/api/image/${imgName}`" :alt="name" class="aspect-square h-full border border-black object-cover" />

			<div class="flex w-full flex-col items-end gap-1" :class="showExpired ? 'justify-start pt-2' : 'justify-center'">
				<div class="flex flex-row gap-2">
					<p>QTY</p>
					<div class="flex items-center gap-1">
						<UButton icon="i-heroicons-minus" size="xs" variant="soft" :disabled="props.count <= 1 || isSaving" @click="decrement" />

						<div class="flex h-7 w-8 items-center justify-center rounded bg-gray-100 text-sm font-medium text-black">
							{{ props.count }}
						</div>

						<UButton icon="i-heroicons-plus" size="xs" variant="soft" :disabled="isSaving" @click="increment" />
					</div>
				</div>

				<div v-if="showExpired" class="flex items-center gap-1">
					<span class="text-xs text-red-600"> Expired </span>
					<!-- 
					<UInput
						v-model.number="expiredCountValue"
						type="number"
						min="0"
						:max="countValue"
						size="xs"
						class="w-10 text-center"
						@keydown.enter="checkZeroExpired(expiredCountValue)"
						@blur="checkZeroExpired(expiredCountValue)"
					/> -->
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

const config = useRuntimeConfig()
const imgSrc = computed(() => {
	if (!props.imgName) return null
	return props.imgName.startsWith("http") ? props.imgName : `${config.public.API_BASE_URL || ""}/api/image/${props.imgName}`
})

const dealExists = computed(() => {
	return props.itemDeal && "actualCount" in props.itemDeal && "adjustedCount" in props.itemDeal
})

const badgeType = computed(() => {
	if (!dealExists.value) return null
	if (props.itemDeal.actualCount === 1 && props.itemDeal.adjustedCount === 0) return "free"
	return "deal"
})

const isSaving = ref(false)
const expiredCountValue = ref(props.expiredCount)

const increment = async () => {
	await $fetch("/api/cart/cartItem", {
		method: "POST",
		body: { itemID: props.itemID, incrementChange: 1 },
	})
	isSaving.value = false
	emit("update:cart")
}

const decrement = async () => {
	if (props.count <= 1) return
	await $fetch("/api/cart/cartItem", {
		method: "POST",
		body: { itemID: props.itemID, incrementChange: -1 },
	})
	isSaving.value = false
	emit("update:cart")
}

const changeCartItemExpiredCount = async () => {
	await $fetch("/api/cart/cartItem", {
		method: "POST",
		body: {
			itemID: props.itemID,
			incrementChange: 0,
			expiredCount: expiredCountValue.value,
		},
	})
	emit("update:cart")
}

const removeCartItem = async () => {
	await $fetch("/api/cart/cartItem", {
		method: "DELETE",
		body: { itemID: props.itemID },
	})
	emit("update:cart")
}

const checkZeroExpired = async (value: number) => {
	if (typeof value !== "number" || value < 0) expiredCountValue.value = 0
	await changeCartItemExpiredCount()
}

onMounted(() => {
	if (imgSrc.value) {
		const img = new Image()
		img.src = imgSrc.value
	}
})
</script>
