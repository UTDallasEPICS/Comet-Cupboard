<template>
	<UModal v-model:open="isOpen">
		<slot />

		<template #content>
			<UCard>
				<SharedTextCardTitle>{{ title }}</SharedTextCardTitle>
				<USeparator class="my-2" />
				<SharedTextBase v-if="description" class="mt-4 text-center">{{ description }}</SharedTextBase>
				<div class="mt-4 flex flex-row items-center justify-center gap-2">
					<SharedButtonActionButton action="cancel" :text="cancelText" :disabled="loading" @click="isOpen = false" />
					<SharedButtonActionButton action="negative" :text="confirmText" :loading="loading" @click="handleConfirm" />
				</div>
			</UCard>
		</template>
	</UModal>
</template>

<script setup lang="ts">
const props = withDefaults(
	defineProps<{
		title?: string
		description?: string
		cancelText?: string
		confirmText?: string
	}>(),
	{
		title: "Confirm Action?",
		description: undefined,
		cancelText: "Cancel",
		confirmText: "Confirm",
	}
)

const emit = defineEmits<{
	confirm: []
}>()

const isOpen = ref(false)
const loading = ref(false)

const handleConfirm = async () => {
	loading.value = true

	try {
		emit("confirm")
		isOpen.value = false
	} finally {
		loading.value = false
	}
}
</script>
