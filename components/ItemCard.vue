<template lang="pug">
div.border-black.border-8
    img.w-full.aspect-square(:src="imgURL" :alt="name")
    ActionButton.rounded-none.w-full
        p Add to Cart
    p.text-base.break-all.line-clamp-2(style="height: 3rem") {{ name }}
</template>

<script lang="ts" setup>
const props = defineProps({
	name: {
		type: String,
		required: true,
	},
	imgURL: {
		type: String,
		required: true,
	},
})
</script>
