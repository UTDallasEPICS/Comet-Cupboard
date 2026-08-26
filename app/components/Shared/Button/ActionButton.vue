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
type ButtonAction = "custom" | "positive" | "negative" | "cancel" | "neutral" | "navigate-back" | "navigate-to"
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
		type: String as PropType<CustomColor>,
		default: undefined,
	},

	color: {
		type: String as PropType<CustomColor>,
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

		case "neutral":
			return {
				color: "neutral" as CustomColor,
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
				solid: "bg-primary hover:bg-primary/75 active:bg-primary/75 disabled:bg-primary/50",
				soft: "bg-primary/10 text-primary hover:bg-primary/20 active:bg-primary/30 disabled:bg-primary/5 disabled:text-primary/50",
				subtle: "bg-primary/5 text-primary hover:bg-primary/10 active:bg-primary/20 disabled:bg-primary/5 disabled:text-primary/50",
				ghost: "text-primary hover:bg-primary/10 active:bg-primary/20 disabled:text-primary/50",
				outline: "border-primary text-primary disabled:border-primary/50 disabled:text-primary/50",
			}

		case "secondary":
			return {
				solid: "bg-secondary hover:bg-secondary/75 active:bg-secondary/75 disabled:bg-secondary/50",
				soft: "bg-secondary/10 text-secondary hover:bg-secondary/20 active:bg-secondary/30 disabled:bg-secondary/5 disabled:text-secondary/50",
				subtle: "bg-secondary/5 text-secondary hover:bg-secondary/10 active:bg-secondary/20 disabled:bg-secondary/5 disabled:text-secondary/50",
				ghost: "text-secondary hover:bg-secondary/10 active:bg-secondary/20 disabled:text-secondary/50",
				outline: "border-secondary text-secondary disabled:border-secondary/50 disabled:text-secondary/50",
			}

		case "success":
			return {
				solid: "bg-success hover:bg-success/75 active:bg-success/75 disabled:bg-success/50",
				soft: "bg-success/10 text-success hover:bg-success/20 active:bg-success/30 disabled:bg-success/5 disabled:text-success/50",
				subtle: "bg-success/5 text-success hover:bg-success/10 active:bg-success/20 disabled:bg-success/5 disabled:text-success/50",
				ghost: "text-success hover:bg-success/10 active:bg-success/20 disabled:text-success/50",
				outline: "border-success text-success disabled:border-success/50 disabled:text-success/50",
			}

		case "info":
			return {
				solid: "bg-info hover:bg-info/75 active:bg-info/75 disabled:bg-info/50",
				soft: "bg-info/10 text-info hover:bg-info/20 active:bg-info/30 disabled:bg-info/5 disabled:text-info/50",
				subtle: "bg-info/5 text-info hover:bg-info/10 active:bg-info/20 disabled:bg-info/5 disabled:text-info/50",
				ghost: "text-info hover:bg-info/10 active:bg-info/20 disabled:text-info/50",
				outline: "border-info text-info disabled:border-info/50 disabled:text-info/50",
			}

		case "warning":
			return {
				solid: "bg-warning hover:bg-warning/75 active:bg-warning/75 disabled:bg-warning/50",
				soft: "bg-warning/10 text-warning hover:bg-warning/20 active:bg-warning/30 disabled:bg-warning/5 disabled:text-warning/50",
				subtle: "bg-warning/5 text-warning hover:bg-warning/10 active:bg-warning/20 disabled:bg-warning/5 disabled:text-warning/50",
				ghost: "text-warning hover:bg-warning/10 active:bg-warning/20 disabled:text-warning/50",
				outline: "border-warning text-warning disabled:border-warning/50 disabled:text-warning/50",
			}

		case "error":
			return {
				solid: "bg-error hover:bg-error/75 active:bg-error/75 disabled:bg-error/50",
				soft: "bg-error/10 text-error hover:bg-error/20 active:bg-error/30 disabled:bg-error/5 disabled:text-error/50",
				subtle: "bg-error/5 text-error hover:bg-error/10 active:bg-error/20 disabled:bg-error/5 disabled:text-error/50",
				ghost: "text-error hover:bg-error/10 active:bg-error/20 disabled:text-error/50",
				outline: "border-error text-error disabled:border-error/50 disabled:text-error/50",
			}

		case "neutral":
			return {
				solid: "bg-neutral-500 hover:bg-neutral-500/75 active:bg-neutral-500/75 disabled:bg-neutral-500/50",
				soft: "bg-neutral-500/10 text-neutral-500 hover:bg-neutral-500/20 active:bg-neutral-500/30 disabled:bg-neutral-500/5 disabled:text-neutral-500/50",
				subtle: "bg-neutral-500/5 text-neutral-500 hover:bg-neutral-500/10 active:bg-neutral-500/20 disabled:bg-neutral-500/5 disabled:text-neutral-500/50",
				ghost: "text-neutral-500 hover:bg-neutral-500/10 active:bg-neutral-500/20 disabled:text-neutral-500/50",
				outline: "border-neutral-500 text-neutral-500 disabled:border-neutral-500/50 disabled:text-neutral-500/50",
			}

		case "cancel-gray":
			return {
				solid: "bg-cancel-gray hover:bg-cancel-gray/75 active:bg-cancel-gray/75 disabled:bg-cancel-gray/50",
				soft: "bg-cancel-gray/10 text-cancel-gray hover:bg-cancel-gray/20 active:bg-cancel-gray/30 disabled:bg-cancel-gray/5 disabled:text-cancel-gray/50",
				subtle: "bg-cancel-gray/5 text-cancel-gray hover:bg-cancel-gray/10 active:bg-cancel-gray/20 disabled:bg-cancel-gray/5 disabled:text-cancel-gray/50",
				ghost: "text-cancel-gray hover:bg-cancel-gray/10 active:bg-cancel-gray/20 disabled:text-cancel-gray/50",
				outline: "border-cancel-gray text-cancel-gray disabled:border-cancel-gray/50 disabled:text-cancel-gray/50",
			}

		default:
			return {
				solid: "bg-primary hover:bg-primary/75 active:bg-primary/75 disabled:bg-primary/50",
				soft: "bg-primary/10 text-primary hover:bg-primary/20 active:bg-primary/30 disabled:bg-primary/5 disabled:text-primary/50",
				subtle: "bg-primary/5 text-primary hover:bg-primary/10 active:bg-primary/20 disabled:bg-primary/5 disabled:text-primary/50",
				ghost: "text-primary hover:bg-primary/10 active:bg-primary/20 disabled:text-primary/50",
				outline: "border-primary text-primary disabled:border-primary/50 disabled:text-primary/50",
			}
	}
})

const contentColorClasses = computed(() => {
	const colors: Record<string, string> = {
		white: "text-white disabled:text-white/50",
		black: "text-black disabled:text-black/50",
		primary: "text-primary disabled:text-primary/50",
		secondary: "text-secondary disabled:text-secondary/50",
		neutral: "text-neutral-900 disabled:text-neutral-500",
	}

	return colors[props.contentColor] ?? colors.white
})

const buttonClasses = computed(() => {
	switch (resolvedVariant.value) {
		case "solid":
			return `${colorClasses.value.solid} ${contentColorClasses.value}`

		case "soft":
			return colorClasses.value.soft

		case "subtle":
			return colorClasses.value.subtle

		case "ghost":
			return colorClasses.value.ghost

		case "outline":
			return colorClasses.value.outline

		case "link":
			return `${colorClasses.value.ghost} bg-transparent hover:bg-transparent active:bg-transparent`

		default:
			return ""
	}
})

const justifyClass = computed(() => {
	switch (props.justify) {
		case "start":
			return "justify-start"

		case "center":
			return "justify-center"

		case "end":
			return "justify-end"

		case "between":
			return "justify-between"

		default:
			return "justify-center"
	}
})

const mergedUi = computed(() => ({
	...props.ui,

	base: `
		rounded-xl
		${justifyClass.value}
		items-center
		${buttonClasses.value}
		${props.ui.base ?? ""}
	`,
}))
</script>
