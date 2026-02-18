<template>
	<SharedItemCard :name="name" :img-name="imgName" :item-deal="itemDeal" :item-i-d="itemID">
		<template #header-actions>
			<UButton variant="ghost" icon="i-heroicons-x-mark" class="shrink-0" size="xs" @click="removeCartItem" />
		</template>
		<template #body>
			<div class="flex items-end gap-1">
				<UButton icon="i-heroicons-minus" size="xs" variant="soft" :disabled="props.count <= 1 || isSaving" @click="decrement" />
				<SharedTextBase class="w-8 text-center">{{ props.count }}</SharedTextBase>
				<UButton icon="i-heroicons-plus" size="xs" variant="soft" :disabled="isSaving" @click="increment" />
			</div>
		</template>
	</SharedItemCard>
</template>

<script setup lang="ts">
const props = defineProps({
	name: { type: String, required: true },
	imgName: { type: String, required: true },
	itemID: { type: String, required: true },
	itemDeal: { type: Object, default: () => ({}) },
	count: { type: Number, default: 0 },
})

const emit = defineEmits(["update:cart"])

const isSaving = ref(false)

const increment = async () => {
	await $fetch("/api/student/cart/cartItemCount", {
		method: "POST",
		body: { itemID: props.itemID, incrementChange: 1 },
	})
	isSaving.value = false
	emit("update:cart")
}

const decrement = async () => {
	if (props.count <= 1) {
		return
	}
	await $fetch("/api/student/cart/cartItemCount", {
		method: "POST",
		body: { itemID: props.itemID, incrementChange: -1 },
	})
	isSaving.value = false
	emit("update:cart")
}

const removeCartItem = async () => {
	await $fetch("/api/student/cart/cartItem", {
		method: "DELETE",
		body: { itemID: props.itemID },
	})
	emit("update:cart")
}
</script>
