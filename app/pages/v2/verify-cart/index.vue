<template>
	<div>
		<Suspense>
			<template #default>
				<div class="flex grow">
					<SkeletonDummyTimer />
					<div class="my-4 flex grow flex-row flex-wrap justify-center md:my-8 md:flex-nowrap md:justify-normal">
						<div
							:class="
								(currentCartIDPreview === 'There are no carts currently selected' ? 'visible' : 'invisible hidden') + ' md:visible md:block'
							"
							class="md:mr-4 lg:mr-12"
						>
							<TransitionsFadeIn>
								<div
									v-if="showRejectedPopUp"
									class="bg-cart-red-v2 mb-4 flex h-10 w-full max-w-[300px] items-center justify-center rounded-lg font-medium"
								>
									<p>Declined {{ oldCartID }}</p>
								</div>
							</TransitionsFadeIn>
							<TransitionsFadeIn>
								<div
									v-if="showAcceptedPopUp"
									class="bg-cart-green-v2 mb-4 flex h-10 w-full max-w-[300px] items-center justify-center rounded-lg font-medium"
								>
									<p>Accepted {{ oldCartID }}</p>
								</div>
							</TransitionsFadeIn>
							<V2VerifyCartPendingList @update:select-cart="setCartIDPreview" :selectedCart="currentCartIDPreview" />
						</div>
						<button
							:class="
								(currentCartIDPreview === 'There are no carts currently selected' ? 'invisible hidden' : 'visible') + ' md:invisible md:hidden'
							"
							@click="resetCartIDPreview"
							class="remove-button-effects mr-auto mb-2"
						>
							<div class="flex items-center gap-x-2">
								<ArrowLeftIcon class="h-4 w-4 stroke-2" />
								<p class="text-cupboardv2-dg text-base">Back to carts</p>
							</div>
						</button>
						<V2VerifyCartPreview
							:class="(currentCartIDPreview === 'There are no carts currently selected' ? 'invisible hidden' : 'visible') + ' md:visible md:flex'"
							@update:verified-cart="resetCartIDPreview"
							:cartID="currentCartIDPreview"
							@cart-declined="turnOnRedPopUp"
							@cart-accepted="turnOnGreenPopUp"
						/>
					</div>
				</div>
			</template>
			<template #fallback>
				<div class="flex grow">
					<div class="my-4 flex flex-row flex-wrap justify-center md:my-8 md:flex-nowrap md:justify-normal">
						<!-- Pending carts list -->
						<div class="flex min-w-60 flex-col gap-y-4 md:mr-6 lg:mr-12">
							<div class="skeleton h-12 w-60"></div>
							<div class="skeleton h-12 w-60"></div>
							<div class="skeleton h-12 w-60"></div>
							<div class="skeleton h-12 w-60"></div>
							<div class="skeleton h-12 w-60"></div>
							<div class="skeleton h-12 w-60"></div>
							<div class="skeleton h-12 w-60"></div>
							<div class="skeleton h-12 w-60"></div>
						</div>
						<!-- Cart verification preview header -->
						<div class="invisible hidden flex-grow md:visible md:flex">
							<div class="skeleton h-12 w-full"></div>
						</div>
					</div>
				</div>
			</template>
		</Suspense>
	</div>
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
