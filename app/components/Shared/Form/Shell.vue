<template>
	<UForm ref="formRef" :schema="schema" :validate="validate" :state="state" :class="['space-y-4', widthClass]" @submit="onSubmit" @error="onError">
		<slot />
	</UForm>
</template>

<script setup lang="ts">
withDefaults(
	defineProps<{
		schema?: unknown
		validate?: (...args: any[]) => any
		state: Record<string, any>
		onSubmit?: (...args: any[]) => any
		onError?: (...args: any[]) => any
		widthClass?: string
	}>(),
	{
		widthClass: "w-96",
	}
)

const formRef = useTemplateRef("formRef")
defineExpose({
	validate: (...args: any[]) => formRef.value?.validate(...args),
	errors: computed(() => formRef.value?.errors ?? []),
})
</script>
