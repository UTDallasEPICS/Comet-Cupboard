<template lang="pug">
div.border-black.border-4.flex.flex-row.flex-nowrap
    img.aspect-square(class="w-16 lg:w-20" :src="imgURL" :alt="name")
    div.w-full
        p.text-base.break-all.line-clamp-2(style="height: 3rem") {{ name }}
    p {{ count }}
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
	itemID: {
		type: String,
		required: true,
	},
	count: {
		type: Number,
		required: true,
	},
})
</script>
