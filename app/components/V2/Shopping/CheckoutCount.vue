<template>
	<div class="flex flex-col rounded-2xl bg-white p-4 shadow-md" style="width: 320px">
		<!-- mark expired -->
		<div class="mb-4 flex items-center justify-between" style="gap: 12px">
			<div class="flex-1 text-black" style="font-size: 16px">Mark Expired Items</div>
			<div class="flex items-center">
				<div
					class="flex cursor-pointer items-center justify-center rounded-sm shadow-sm transition"
					@click="toggleExpired"
					style="width: 20px; height: 20px; background-color: #154734"
				>
					<CheckIcon v-show="markExpiredItems" class="text-white" style="width: 20px; height: 20px" />
				</div>
			</div>
		</div>

		<!-- total qty -->
		<div class="flex flex-col gap-3">
			<div class="flex items-center justify-between">
				<span class="text-black" style="font-size: 15px">Total QTY</span>
				<input
					class="rounded-md border border-gray-300 text-center text-black outline-none focus:ring-1 focus:ring-[#154734]"
					:value="cartTotalCount"
					type="number"
					readonly
					style="width: 60px; height: 30px"
				/>
			</div>

			<!-- adjusted qty -->
			<div class="flex items-center justify-between">
				<span class="text-black" style="font-size: 15px">Adjusted QTY</span>
				<input
					class="rounded-md border border-gray-300 text-center text-black outline-none focus:ring-1 focus:ring-[#154734]"
					:value="cartAdjustedCount"
					type="number"
					readonly
					style="width: 60px; height: 30px"
				/>
			</div>
		</div>
	</div>
</template>

<script setup lang="ts">
import { CheckIcon } from "@heroicons/vue/24/solid"

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
