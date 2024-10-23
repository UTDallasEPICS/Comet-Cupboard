<template lang="pug">
  div.p-4.w-72
    div.relative
      div.flex.justify-center
        img.w-64.h-64.shadow-md.object-cover.rounded-md(:src="imgURL" :alt="name")

      div(v-if="typeOfCard === 'INVENTORY'")
        div.absolute.top-2.right-2.bg-gray-300.rounded-full.p-3.shadow-md.cursor-pointer.w-13.h-13(@click="toggleDropdown")
          div.flex.items-center.justify-center.flex-row.space-x-1
            div.w-2.h-2.bg-white.border-2.border-black.rounded-full
            div.w-2.h-2.bg-white.border-2.border-black.rounded-full
            div.w-2.h-2.bg-white.border-2.border-black.rounded-full

        div.absolute.top-11.right-2.bg-white.bg-opacity-90.shadow-lg.rounded-md.py-2.px-5(v-if="isDropdownOpen")
          ul.list-none.p-0.m-0
            li.flex.justify-center.items-center.px-1.py-1.cursor-pointer.hover(@click="editItem").border-b.border-gray-400 Edit
            li.flex.justify-center.items-center.px-1.py-1.cursor-pointer.hover(@click="removeItem").border-b.border-gray-400 Remove
            li.flex.justify-center.items-center.px-1.py-1.cursor-pointer.hover(@click="itemDeal") Item Deal

    div(v-if="typeOfCard === 'INVENTORY'").flex.justify-center.items-center.mt-2.w-64
      div.border.border-utd-orange.shadow-md.rounded-l-full.px-5.py-1.flex-grow.flex.items-center.justify-center
        span.text-sm.font-semibold.text-black {{ currentCount }}
      div.border.border-utd-orange.bg-utd-orange.border-l-0.bg-opacity-20.shadow-md.rounded-r-full.px-5.py-1.flex-grow.flex.items-center.justify-center
        span.text-sm.font-semibold.text-utd-orange +{{ change || '0' }}

    div(v-if="typeOfCard === 'INVENTORY'").flex.justify-center.items-center.space-x-6.mt-3
      button.bg-utd-green.text-white.shadow-md.rounded-full.p-2.w-10.h-10.flex.items-center.justify-center(@click="decrementCount")
        span.text-xl.font-bold -

      input.text-xl.font-semibold.text-gray-900.border-b-2.border-black.w-10.flex.text-center(
        v-model="numOfItems"
        type="text"
      )

      button.bg-utd-green.text-white.shadow-md.rounded-full.p-2.w-10.h-10.flex.items-center.justify-center(@click="incrementCount")
        span.text-xl.font-bold +

    div(v-if="typeOfCard === 'SHOPPING'").mt-4
      button.bg-utd-green.text-white.py-1.rounded-full.w-full(@click="addToCart") Add to Cart

    div.mt-3.text-center
      p.text-xl {{ name }}
</template>


<script lang="ts" setup>
import { ref } from 'vue';

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

	currentCount: {
		type: String,
		required: false,
	},

	typeOfCard: {
		type: String,
		required: true,
	}

})

const isDropdownOpen = ref(false);
const numOfItems = ref(1); 

const toggleDropdown = () => {
	isDropdownOpen.value = !isDropdownOpen.value; // Toggle the dropdown state
};

const addToCart = async () => {
	await $fetch("/api/cart/incrementCartItem", {
		method: "POST",
		body: { itemID: props.itemID },
	})
}
</script>
