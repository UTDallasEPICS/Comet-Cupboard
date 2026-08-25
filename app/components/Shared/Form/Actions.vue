<template>
	<div :class="['flex justify-end gap-2', className]">
		<slot name="cancel" />

		<slot>
			<SharedButtonActionButton action="positive" type="submit" :text="submitText" />
		</slot>
	</div>
</template>

<script setup lang="ts">
withDefaults(
	defineProps<{
		submitText?: string
		className?: string
	}>(),
	{
		submitText: "Save changes",
		className: "",
	}
)
</script>
