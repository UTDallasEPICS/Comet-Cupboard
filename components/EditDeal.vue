<template lang="pug">
px-5.relative.overflow-y-scroll.overscroll-contain
	div.flex.flex-col.justify-center.mt-10
		div.flex.items-center.justify-center.space-x-2
			h3.text-2xl.text-center Deal is
			input(
				:class="invalidActualCount ? 'text-red-negative placeholder_text-red-negative placeholder_text-opacity-55 border-red-negative' : ''"
				min="1"
				type="number"
				v-model="actualCount"
				@change="checkInput"
				:placeholder="originalActualCount"
			).modal-input.w-16.text-center
			h3.text-2xl.text-center for
			input(
				:class="invalidAdjustedCount ? 'text-red-negative placeholder_text-red-negative placeholder_text-opacity-55 border-red-negative' : ''"
				min="0"
				type="number"
				v-model="adjustedCount"
				@change="checkInput"
				:max="actualCount - 1"
				:placeholder="originalAdjustedCount"
			).modal-input.w-16.text-center
		div.grow.flex.my-5.mx-3.justify-center.space-x-6
			button(v-if="originalActualCount !== 'X' && originalAdjustedCount !== 'Y'" @click="deleteDeal").modal-button.w-40.bg-red-negative.text-white Clear
			button(@click="editDeal").modal-button.w-40.bg-utd-green.text-white Save
</template>

<script lang="ts" setup>
const props = defineProps({
	item: {
		type: Object,
		required: true,
	},
})

const emit = defineEmits(["submit"])

const actualCount = ref(!isNaN(props.item.actualCount) ? props.item.actualCount : "X")
const adjustedCount = ref(!isNaN(props.item.adjustedCount) ? props.item.adjustedCount : "Y")
const originalActualCount = ref(!isNaN(props.item.actualCount) ? props.item.actualCount : "X")
const originalAdjustedCount = ref(!isNaN(props.item.adjustedCount) ? props.item.adjustedCount : "Y")
const invalidActualCount = ref(false)
const invalidAdjustedCount = ref(false)

const toggleDeal = () => {
	emit("submit")
}

const deleteDeal = async () => {
	await $fetch("/api/inventory/deal", {
		method: "DELETE",
		body: { itemID: props.item.itemID },
	})

	toggleDeal()
}

const checkInput = () => {
	invalidActualCount.value = false
	invalidAdjustedCount.value = false

	let alertText = ""

	if (actualCount.value === "X" || actualCount.value === "") {
		invalidActualCount.value = true
		alertText = "The actual count must be a number"
	}
	if (actualCount.value !== "" && !isNaN(actualCount.value) && actualCount.value < 1) {
		invalidActualCount.value = true
		alertText = "The actual count must greater than zero"
	}
	if (adjustedCount.value === "Y" || adjustedCount.value === "") {
		invalidAdjustedCount.value = true
		if (alertText === "") {
			alertText += "The adjusted count must be a number"
		} else {
			alertText += ", the adjusted count must be a number"
		}
	}
	if (!isNaN(adjustedCount.value) && adjustedCount.value < 0) {
		invalidAdjustedCount.value = true
		if (alertText === "") {
			alertText += "The adjusted count must be positive"
		} else {
			alertText += ", the adjusted count must be positive"
		}
	}
	if (!isNaN(actualCount.value) && !isNaN(adjustedCount.value) && actualCount.value <= adjustedCount.value) {
		invalidActualCount.value = true
		invalidAdjustedCount.value = true
		alertText = "The actual count must be greater than the adjusted count"
	}
	alertText += "."

	return alertText
}

const editDeal = async () => {
	const alertText = checkInput()

	if (invalidActualCount.value || invalidAdjustedCount.value) {
		alert(alertText)
		return
	}

	await $fetch("/api/inventory/deal", {
		method: "PUT",
		body: { itemID: props.item.itemID, actualCount: actualCount.value, adjustedCount: adjustedCount.value },
	})

	toggleDeal()
}
</script>
