<template>
	<UCard class="w-[320px]" :ui="{ body: 'p-4' }">
		<div class="mb-4 flex items-center justify-between">
			<span class="text-base font-medium text-black"> Mark Expired Items </span>
			<UToggle :v-model="true" color="green" @change="toggleExpired" />
		</div>

		<div class="space-y-3">
			<div class="flex items-center justify-between">
				<span class="text-sm text-black"> Total QTY </span>
				<UInput :model-value="cartTotalCount" readonly size="xs" class="w-16 text-center" />
			</div>

			<div class="flex items-center justify-between">
				<span class="text-sm text-black"> Adjusted QTY </span>
				<UInput :model-value="cartAdjustedCount" readonly size="xs" class="w-16 text-center" />
			</div>
		</div>
	</UCard>
</template>

<script setup lang="ts">
const props = defineProps({
	cartTotalCount: { type: Number, required: true },
	cartAdjustedCount: { type: Number, required: true },
	markExpiredItems: { type: Boolean, required: true },
})

const emit = defineEmits(["toggleExpired"])

const toggleExpired = () => {
	emit("toggleExpired")
}
</script>
