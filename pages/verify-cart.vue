<template lang="pug">
div
	Suspense
		template(#default)
			div
				SkeletonDummyTimer
				div(v-if="currentCartIDPreview === 'No cart chosen'").flex.flex-row.my-4.md_my-8.flex-wrap.md_flex-nowrap.justify-center.md_justify-normal
					| {{ NO_CART_MSG }}
				div.flex.flex-row.my-4.md_my-8.flex-wrap.md_flex-nowrap.justify-center.md_justify-normal
					div(:class="(currentCartIDPreview === 'No cart chosen' ? 'visible' : 'invisible hidden') + ' md_visible md_block'").md_mr-6.lg_mr-12
						PendingCartsList(@update:select-cart="setCartIDPreview" :selectedCart="currentCartIDPreview")
					XMarkIcon(
						:class="(currentCartIDPreview === 'No cart chosen' ? 'invisible hidden' : 'visible') + ' md_invisible md_hidden'"
						@click="resetCartIDPreview"
					).ml-auto.mb-4.size-10.stroke-black
					CartVerificationPreview(
						:class="(currentCartIDPreview === 'No cart chosen' ? 'invisible hidden' : 'visible') + ' md_visible md_flex'"
						@update:verified-cart="resetCartIDPreview"
						:cartID="currentCartIDPreview"
					)
		//- Skeleton
		template(#fallback)
			div.flex.flex-row.my-4.md_my-8.flex-wrap.md_flex-nowrap.justify-center.md_justify-normal
				//- Pending carts list
				div.md_mr-6.lg_mr-12.flex.flex-col.gap-y-4.min-w-60
					div.skeleton.w-60.h-12
					div.skeleton.w-60.h-12
					div.skeleton.w-60.h-12
					div.skeleton.w-60.h-12
					div.skeleton.w-60.h-12
					div.skeleton.w-60.h-12
					div.skeleton.w-60.h-12
					div.skeleton.w-60.h-12
				//- Cart verification preview header
				div.flex-grow.hidden.invisible.md_visible.md_flex
					div.skeleton.w-full.h-12
</template>

<script lang="ts" setup>
import { XMarkIcon } from "@heroicons/vue/24/solid"

const currentCartIDPreview = ref<string>("No cart chosen")
const NO_CART_MSG = ref<string>("No pending cart available")

const setCartIDPreview = (cartID: string) => {
	// deselect cart if already chosen
	if (currentCartIDPreview.value === cartID) {
		currentCartIDPreview.value = "No cart chosen"
		NO_CART_MSG.value = "No pending cart available"
	} else {
		currentCartIDPreview.value = cartID
		NO_CART_MSG.value = ""
	}
}

const resetCartIDPreview = () => {
	currentCartIDPreview.value = "No cart chosen"
}
</script>
