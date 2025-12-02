<template lang="pug">
div
	Suspense
		template(#default)
			div.flex.grow
				SkeletonDummyTimer
				div.flex.flex-row.my-4.md_my-8.flex-wrap.md_flex-nowrap.justify-center.md_justify-normal.grow
					div(:class="(currentCartIDPreview === 'There are no carts currently selected' ? 'visible' : 'invisible hidden') + ' md_visible md_block'").md_mr-6.lg_mr-12
						TransitionsFadeIn
							div(v-if="showRejectedPopUp").flex.w-full(class="max-w-[300px]").h-10.bg-cart-red-v2.rounded-lg.font-medium.items-center.justify-center.mb-3
								span Declined {{ oldCartID }}
						TransitionsFadeIn
							div(v-if="showAcceptedPopUp").flex.w-full(class="max-w-[300px]").h-10.bg-cart-green-v2.rounded-lg.font-medium.items-center.justify-center.mb-3
								span Accepted {{ oldCartID }}
						V2VerifyCartPendingList(@update:select-cart="setCartIDPreview" :selectedCart="currentCartIDPreview")
					button(
						:class="(currentCartIDPreview === 'There are no carts currently selected' ? 'invisible hidden' : 'visible') + ' md_invisible md_hidden'"
						@click="resetCartIDPreview"
					).remove-button-effects.mr-auto.mb-0
						button.flex.items-center.gap-x-2
							ArrowLeftIcon.w-4.h-4.stroke-2
							p.text-base.text-cupboardv2-dg Back to carts
					V2VerifyCartPreview(
						:class="(currentCartIDPreview === 'There are no carts currently selected' ? 'invisible hidden' : 'visible') + ' md_visible md_flex'"
						@update:verified-cart="resetCartIDPreview"
						:cartID="currentCartIDPreview"
						@cart-declined="turnOnRedPopUp"
						@cart-accepted="turnOnGreenPopUp"
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
import { ArrowLeftIcon } from "@heroicons/vue/24/solid"

const currentCartIDPreview = ref<string>("There are no carts currently selected")
const showRejectedPopUp = ref(false)
const showAcceptedPopUp = ref(false)
const oldCartID = ref(null)

const setCartIDPreview = (cartID: string) => {
	// deselect cart if already chosen
	if (currentCartIDPreview.value === cartID) {
		currentCartIDPreview.value = "There are no carts currently selected"
	} else {
		currentCartIDPreview.value = cartID
	}
}

const resetCartIDPreview = () => {
	currentCartIDPreview.value = "There are no carts currently selected"
}

const turnOnRedPopUp = (cartID) => {
	oldCartID.value = cartID
	showRejectedPopUp.value = true

	setTimeout(() => {
		showRejectedPopUp.value = false
	}, 3000)
}

const turnOnGreenPopUp = (cartID) => {
	oldCartID.value = cartID
	showAcceptedPopUp.value = true

	setTimeout(() => {
		showAcceptedPopUp.value = false
	}, 3000)


}

</script>
