<template lang="pug">
div.flex.flex-row.items-center.justify-between
	div.flex.flex-row.items-center.space-x-5
		img(:src="`api/image/${item.imgName}`").min-w-20.max-w-20.min-h-20.max-h-20
		div
			div.text-xl
				| {{ item.name }}
			div.text-lg
				| Count:
				| {{ item.quantity }}
	div.text-2xl.font-medium
		| {{ changeString }}
</template>

<script lang="ts" setup>
const props = defineProps({
	id: {
		type: String,
		required: true,
	},
	change: {
		type: Number,
		required: true,
	},
})

const { id } = toRefs(props)

const { data: item } = await useFetch("/api/inventory/item", { query: { itemID: id } })

const changeString = computed(() => {
	if (props.change >= 0) {
		return `+${props.change}`
	} else {
		return `${props.change}`
	}
})
</script>
