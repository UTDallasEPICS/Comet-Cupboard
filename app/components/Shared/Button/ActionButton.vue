<template>
	<UButton v-bind="$attrs" :variant="resolvedVariant" :leading-icon="resolvedLeadingIcon" :icon="icon" :trailing-icon="resolvedTrailingIcon" :ui="mergedUi">
		<slot>
			{{ text }}
		</slot>
	</UButton>
</template>

<script setup lang="ts">
import type { PropType } from "vue"

defineOptions({
	inheritAttrs: false,
})

type ButtonVariant = "solid" | "ghost" | "outline" | "link" | "soft" | "subtle"
type ButtonAction = "custom" | "positive" | "negative" | "cancel" | "navigate-back" | "navigate-to"
type CustomColor = "primary" | "secondary" | "success" | "info" | "warning" | "error" | "neutral" | "cancel-gray"

const props = defineProps({
	action: {
		type: String as PropType<ButtonAction>,
		default: "custom",
	},

	buttonVariant: {
		type: String as PropType<ButtonVariant>,
		default: undefined,
	},

	variant: {
		type: String as PropType<ButtonVariant>,
		default: undefined,
	},

	text: {
		type: String,
		default: undefined,
	},

	customColor: {
		type: String,
		default: undefined,
	},

	color: {
		type: String,
		default: undefined,
	},

	contentColor: {
		type: String,
		default: "white",
	},

	justify: {
		type: String as PropType<"start" | "center" | "end" | "between">,
		default: "center",
	},

	leadingIcon: {
		type: String as PropType<Icon> | undefined,
		default: undefined,
	},

	icon: {
		type: String as PropType<Icon> | undefined,
		default: undefined,
	},

	trailingIcon: {
		type: String as PropType<Icon> | undefined,
		default: undefined,
	},

	ui: {
		type: Object as PropType<Record<string, any>>,
		default: () => ({}),
	},
})

const actionConfig = computed(() => {
	switch (props.action) {
		case "positive":
			return {
				color: "secondary" as CustomColor,
				leadingIcon: undefined,
				trailingIcon: undefined,
			}

		case "negative":
			return {
				color: "error" as CustomColor,
				leadingIcon: undefined,
				trailingIcon: undefined,
			}

		case "cancel":
			return {
				color: "cancel-gray" as CustomColor,
				leadingIcon: undefined,
				trailingIcon: undefined,
			}

		case "navigate-back":
			return {
				color: "primary" as CustomColor,
				leadingIcon: "i-lucide-arrow-left",
				trailingIcon: undefined,
			}

		case "navigate-to":
			return {
				color: "primary" as CustomColor,
				leadingIcon: undefined,
				trailingIcon: undefined,
			}

		case "custom":
		default:
			return {
				color: props.customColor ?? ("primary" as CustomColor),
				leadingIcon: undefined,
				trailingIcon: undefined,
			}
	}
})

const resolvedColor = computed(() => {
	return props.customColor ?? props.color ?? actionConfig.value.color
})

const resolvedVariant = computed(() => {
	return props.buttonVariant ?? props.variant ?? "solid"
})

const resolvedLeadingIcon = computed(() => {
	return props.leadingIcon ?? actionConfig.value.leadingIcon
})

const resolvedTrailingIcon = computed(() => {
	return props.trailingIcon ?? actionConfig.value.trailingIcon
})

const colorClasses = computed(() => {
	switch (resolvedColor.value) {
		case "primary":
			return {
				solid: "bg-primary hover:bg-primary/75 active:bg-primary/75",
				ghost: "text-primary hover:bg-primary/10 active:bg-primary/20",
				outline: "border-primary text-primary",
			}

		case "secondary":
			return {
				solid: "bg-secondary hover:bg-secondary/75 active:bg-secondary/75",
				ghost: "text-secondary hover:bg-secondary/10 active:bg-secondary/20",
				outline: "border-secondary text-secondary",
			}

		case "success":
			return {
				solid: "bg-success hover:bg-success/75 active:bg-success/75",
				ghost: "text-success hover:bg-success/10 active:bg-success/20",
				outline: "border-success text-success",
			}

		case "info":
			return {
				solid: "bg-info hover:bg-info/75 active:bg-info/75",
				ghost: "text-info hover:bg-info/10 active:bg-info/20",
				outline: "border-info text-info",
			}

		case "warning":
			return {
				solid: "bg-warning hover:bg-warning/75 active:bg-warning/75",
				ghost: "text-warning hover:bg-warning/10 active:bg-warning/20",
				outline: "border-warning text-warning",
			}

		case "error":
			return {
				solid: "bg-error hover:bg-error/75 active:bg-error/75",
				ghost: "text-error hover:bg-error/10 active:bg-error/20",
				outline: "border-error text-error",
			}

		case "neutral":
			return {
				solid: "bg-neutral-500 hover:bg-neutral-500/75 active:bg-neutral-500/75",
				ghost: "text-neutral-500 hover:bg-neutral-500/10 active:bg-neutral-500/20",
				outline: "border-neutral-500 text-neutral-500",
			}

		case "cancel-gray":
			return {
				solid: "bg-cancel-gray hover:bg-cancel-gray/75 active:bg-cancel-gray/75",
				ghost: "text-cancel-gray hover:bg-cancel-gray/10 active:bg-cancel-gray/20",
				outline: "border-cancel-gray text-cancel-gray",
			}

		default:
			return {
				solid: "bg-primary hover:bg-primary/75 active:bg-primary/75",
				ghost: "text-primary hover:bg-primary/10 active:bg-primary/20",
				outline: "border-primary text-primary",
			}
	}
})

const buttonClasses = computed(() => {
	switch (resolvedVariant.value) {
		case "solid":
			return `
				${colorClasses.value.solid}
				text-${props.contentColor}
			`

		case "ghost":
			return colorClasses.value.ghost

		case "outline":
			return colorClasses.value.outline

		default:
			return `text-${props.contentColor}`
	}
})

const mergedUi = computed(() => ({
	...props.ui,

	base: `
		rounded-xl
		${props.justify === "start" ? "justify-start" : props.justify === "center" ? "justify-center" : props.justify === "end" ? "justify-end" : props.justify === "between" ? "justify-between" : ""}
		items-center
		${buttonClasses.value}
		${props.ui.base ?? ""}
	`,
}))
</script>
