<template>
	<div class="flex w-full justify-between rounded-lg border border-gray-200 p-2">
		<div class="flex items-center gap-2">
			<UCheckbox :model-value="selected" @update:model-value="emit('update:selected', $event)" />
			<div class="flex flex-col items-start">
				<div class="flex gap-1">
					<UIcon v-if="props.bag.privacy === 'PRIVATE'" name="i-lucide-hat-glasses" />
					<span>{{ props.bag.bagID }}</span>
				</div>
				<span>{{ props.bag.expirationDate.split("T")[0] }}</span>

				<UBadge v-if="props.bag.isVegetarian === false && props.bag.hasPeanutButter === false" class="rounded-full bg-gray-400 font-bold"
					>Neither</UBadge
				>
				<div class="flex gap-1">
					<UBadge v-if="props.bag.isVegetarian === true" class="rounded-full bg-green-700 font-bold">Vegetarian</UBadge>
					<UBadge v-if="props.bag.hasPeanutButter === true" class="rounded-full bg-yellow-600 font-bold">Peanut Butter</UBadge>
				</div>
			</div>
		</div>
		<div class="flex flex-col items-end justify-between">
			<span>{{ props.bag.location ?? "Unassigned" }}</span>
			<UButton key="Expand" color="neutral" variant="ghost" leading-icon="i-lucide-chevron-down" class="h-4 w-4 justify-center" />
		</div>
	</div>
</template>

<script lang="ts" setup>
const emit = defineEmits<{
	"update:selected": [value: boolean]
}>()

const props = defineProps<{
	bag: {
		bagID: string
		expirationDate: Date
		location: string | null
		isVegetarian: boolean
		hasPeanutButter: boolean
		privacy: string
		items: Array
	}
	selected: boolean
}>()
</script>
