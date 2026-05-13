<template>
	<header>
		<div class="flex items-center justify-between w-full">

			<SharedButtonNavigateBack text="Back to Dashboard" :to="{ path: '/volunteer' }" />

			<UButton icon="i-heroicons-question-mark-circle" color="gray" variant="ghost" label="Take a Tour"
				@click="startTour" />
		</div>

	</header>
	<div class="p-4">
		<div class="flex grow">
			<div class="flex grow flex-row flex-wrap justify-center md:my-8 md:flex-nowrap md:justify-normal">
				<div :class="(currentCartIDPreview === '' ? 'visible' : 'invisible hidden') + ' md:visible md:block'"
					class="md:mr-4 lg:mr-12">
					<VerifyCartPendingList :selected-cart="currentCartIDPreview"
						@update:select-cart="setCartIDPreview" />
				</div>
				<SharedButtonNavigateBack id="tour-back-to-carts" text="Back to carts"
					:class="(currentCartIDPreview === '' ? 'invisible hidden' : 'visible') + ' md:invisible md:hidden'"
					class="mr-auto mb-2" @click="resetCartIDPreview" />
				<VerifyCartPreview id="tour-cart-preview"
					:class="(currentCartIDPreview === '' ? 'invisible hidden' : 'visible') + ' md:visible md:flex md:flex-col'"
					:cart-i-d="currentCartIDPreview" @cart-declined="declineToastMessage"
					@cart-accepted="acceptToastMessage" />
			</div>
		</div>
	</div>
</template>

<script lang="ts" setup>
import { onMounted, ref } from "vue";

const toast = useToast()

const currentCartIDPreview = ref<string>("")

const setCartIDPreview = (cartID: string) => {
	// deselect cart if already chosen
	if (currentCartIDPreview.value === cartID) {
		currentCartIDPreview.value = ""
	} else {
		currentCartIDPreview.value = cartID
	}
}

const resetCartIDPreview = () => {
	currentCartIDPreview.value = ""
}

const declineToastMessage = (cartID: string) => {
	toast.add({
		title: "Cart Action Status",
		description: `Declined cart for ${cartID}.`,
	})
	resetCartIDPreview()
}

const acceptToastMessage = (cartID: string) => {
	toast.add({
		title: "Cart Action Status",
		description: `Accepted cart for ${cartID}.`,
	})
	resetCartIDPreview()
}

const { startTour } = VerifyCartTour()

onMounted(() => {
	startTour();
});
</script>
