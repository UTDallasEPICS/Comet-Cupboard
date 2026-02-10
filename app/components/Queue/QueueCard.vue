<template>
	<UCard>
		<template #header>
			<p>{{ position }}. {{ identification }}</p>
		</template>

		<div class="flex flex-row items-center justify-between">
			<p>00:00</p>

			<div class="ml-auto flex items-center gap-1">
				<UButton icon="i-heroicons-x-mark" variant="ghost" size="lg" @click="removeFromQueue" />
				<UButton icon="i-heroicons-check" variant="ghost" size="lg" @click="intoCupboard" />
			</div>
		</div>
	</UCard>
</template>

<script lang="ts" setup>
const props = defineProps({
	identification: {
		type: String,
		required: true,
	},
	position: {
		type: Number,
		required: true,
	},
})

const removeFromQueue = async () => {
	try {
		await $fetch("/api/queue", {
			method: "DELETE",
			body: {
				netID: props.identification,
			},
		})
	} catch (err) {}
}

const intoCupboard = async () => {
	try {
		await $fetch("/api/queue", {
			method: "PUT",
			body: {
				netID: props.identification,
			},
		})
	} catch (err) {}
}
</script>
