<template lang="pug">
div.px-5.overflow-y-scroll.overscroll-contain
	div.flex.flex-col.justify-center.items-center.sm_space-x-10.mt-7.mb-12
		h1.text-3xl.text-center.pt-10.px-2 Are you sure you want to delete {{ itemName }}?
	div.grow.flex.mb-5.justify-center
		button(@click="deleteItemSubmit").modal-button.w-full.sm_w-56.bg-red-negative.text-white Delete
</template>

<script lang="ts" setup>
const props = defineProps({
	item: {
		type: Object,
		required: true,
	},
})

const emit = defineEmits(["submit"])

const itemName = ref(props.item.name || null)

const toggleDeleteItem = () => {
	emit("submit")
}

const deleteItemSubmit = async () => {
	await $fetch("/api/inventory/item", {
		method: "DELETE",
		body: { itemID: props.item.itemID },
	})
	toggleDeleteItem()
}
</script>
