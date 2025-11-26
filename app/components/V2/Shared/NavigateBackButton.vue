<template lang="pug">
div.flex.items-center.gap-x-2
	ArrowLeftIcon.w-4.h-4.stroke-2
	button.text-base.text-cupboardv2-dg {{ backTo }}
</template>

<script lang="ts" setup>
import { ArrowLeftIcon } from "@heroicons/vue/24/outline"

const props = defineProps({
	backTo: {
		type: String,
		default: "Page name",
	},
})
</script>
