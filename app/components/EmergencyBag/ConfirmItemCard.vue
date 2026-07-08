<template>
	<SharedItemCard :name="name" :img-name="imgName" :item-deal="itemDeal" :item-id="itemID" :item-count="itemCount">
		<template #body>
			<div class="flex items-center px-4">
				<p>x{{ itemCount }}</p>
			</div>
		</template>
	</SharedItemCard>
</template>

<script lang="ts" setup>
const emit = defineEmits<{
	increment: [itemID: string]
	decrement: [itemID: string]
	remove: [itemID: string]
}>()

const props = defineProps<{
	name: string
	imgName: string
	itemID: string
	itemDeal : Object
	itemCount : Number
}>()
</script>
