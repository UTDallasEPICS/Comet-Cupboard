<template>
	<UIcon v-bind="$attrs" :name="name" />
</template>

<script setup lang="ts">
defineOptions({
	inheritAttrs: false,
})

defineProps<{
	name: Icon
}>()
</script>
