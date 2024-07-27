<template lang="pug">
div.border-black.border-4.flex.flex-row.flex-nowrap
    img.aspect-square(class="w-16 lg:w-20" :src="imgURL" :alt="name")
    div.w-full
        p.text-base.break-all.line-clamp-2(style="height: 3rem") {{ name }}
    div.grid.grid-rows-2
        XCircleIcon.w-8.min-w-8.aspect-square.place-self-start.cursor-pointer(style="margin-left: auto;" @click="removeCartItem" v-if="editMode")
        div.flex.flex-row.flex-nowrap.justify-end.place-self-end
            MinusCircleIcon.w-8.cursor-pointer(@click="decrementCartItem" v-if="editMode")
            p {{ count }}
            PlusCircleIcon.w-8.cursor-pointer(@click="incrementCartItem" v-if="editMode")
</template>

<script lang="ts" setup>
import { PlusCircleIcon, MinusCircleIcon, XCircleIcon } from "@heroicons/vue/24/outline"

const emit = defineEmits(["update:cart"])

const props = defineProps({
	name: {
		type: String,
		required: true,
	},
	imgURL: {
		type: String,
		required: true,
	},
	itemID: {
		type: String,
		required: true,
	},
	count: {
		type: Number,
		required: true,
	},
	editMode: {
		type: Boolean,
		required: true
	}
})

const incrementCartItem = async () => {
	await $fetch("/api/cart/incrementCartItem", {
		method: "POST",
		body: { itemID: props.itemID },
	})
    emit("update:cart")
}

const decrementCartItem = async () => {
	await $fetch("/api/cart/decrementCartItem", {
		method: "POST",
		body: { itemID: props.itemID },
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
</script>
