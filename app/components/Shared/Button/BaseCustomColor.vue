<template>
	<UButton
		:variant="props.buttonVariant"
		:ui="{
			...props.ui,
			base: `
				rounded-3xl
				justify-center
				items-center
				${buttonClasses}
				${props.ui.base ?? ''}
			`,
		}"
	>
		<slot />
	</UButton>
</template>

<script setup lang="ts">
const props = defineProps({
	buttonVariant: {
		type: String as PropType<"solid" | "ghost" | "outline" | "link" | "soft" | "subtle">,
		default: "solid",
	},
	customColor: {
		type: String,
		required: true,
	},
	contentColor: {
		type: String,
		required: true,
	},
	ui: {
		type: Object,
		default: () => ({}),
	},
})

const buttonClasses = computed(() => {
	switch (props.buttonVariant) {
		case "solid":
			return `
				bg-${props.customColor}
				hover:bg-${props.customColor}/75
				active:bg-${props.customColor}/75
				disabled:bg-${props.customColor}
				aria-disabled:bg-${props.customColor}
				outline-${props.customColor}/25
				text-${props.contentColor}
			`

		case "ghost":
			return `
				text-${props.customColor}
				hover:bg-${props.customColor}/10
				active:bg-${props.customColor}/20
			`

		case "outline":
			return `
				border-${props.customColor}
				text-${props.customColor}
			`

		default:
			return `text-${props.contentColor}`
	}
})
</script>
