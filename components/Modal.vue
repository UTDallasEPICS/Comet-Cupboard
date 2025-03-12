<template lang="pug">
div(class="h-[calc(100vh-80px)]").fixed.inset-0.z-40.flex.mt-20.w-screen.justify-center.items-center.pointer-events-none
	TransitionsFadeIn
		div(v-if="props.isOpen" @click.self="toggleModal").bg-black.bg-opacity-70.w-screen.h-screen.pointer-events-auto
	TransitionsPopUp
		div(v-if="props.isOpen").absolute(
			class="sm_w-7/12 lg_w-5/12 2xl_w-3/12 sm_min-w-[550px] sm_max-h-[75vh]"
		).flex.flex-col.drop-shadow-standard.bg-white.pointer-events-auto.rounded-none.sm_rounded-2xl.w-full.sm_min-h-52.h-full
			div
				h.relative.flex.justify-center.items-center.bg-utd-orange.p-2.rounded-none.sm_rounded-t-2xl.text-xl.text-white.font-semibold {{ props.title }}
				button(@click="toggleModal").absolute.end-2
					XMarkIcon.h-7.fill-white.stroke-white
			slot
</template>

<script lang="ts" setup>
import { XMarkIcon } from "@heroicons/vue/24/solid"

const props = defineProps({
	title: {
		type: String,
		required: true,
	},
	isOpen: {
		type: Boolean,
		required: true,
	},
})

const emit = defineEmits(["toggleModal"])

const toggleModal = () => {
	emit("toggleModal")
}
</script>
