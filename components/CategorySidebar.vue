<template lang="pug">
div.flex.flex-col.gap-4.min-w-72.w-72.text-center.text-white.text-3xl.whitespace-nowrap(style="background-color: #154734")
	button.min-w-full.cursor-pointer(v-for="category in categories") {{ category }}
</template>

<script lang="ts" setup>
const categories = ref<Array<string>>([
	"All",
	"Household Items",
	"Personal Care",
	"Refrigerated Items",
	"Frozen Items",
	"Pantry Staples",
	"Grains",
	"Breakfast Grains",
	"Protein",
	"Soups",
	"Snacks",
	"Fruits",
	"Vegetables"
])
</script>
