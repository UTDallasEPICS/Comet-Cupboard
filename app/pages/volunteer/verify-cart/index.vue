<template>
	<header>
		<SharedButtonNavigateBack text="Back to Dashboard" :to="{ path: '/volunteer' }" />
	</header>
	<div class="p-4">
		<div class="flex grow">
			<div class="flex grow flex-row flex-wrap justify-center md:my-8 md:flex-nowrap md:justify-normal">
				<div :class="(currentCartIDPreview === '' ? 'visible' : 'invisible hidden') + ' md:visible md:block'" class="md:mr-4 lg:mr-12">
					<VerifyCartPendingList :selected-cart="currentCartIDPreview" @update:select-cart="setCartIDPreview" />
				</div>
				<SharedButtonNavigateBack
					text="Back to carts"
					:class="(currentCartIDPreview === '' ? 'invisible hidden' : 'visible') + ' md:invisible md:hidden'"
					class="mr-auto mb-2"
					@click="resetCartIDPreview"
				/>
				<VerifyCartPreview
					:class="(currentCartIDPreview === '' ? 'invisible hidden' : 'visible') + ' md:visible md:flex md:flex-col'"
					:cart-i-d="currentCartIDPreview"
					@cart-declined="declineToastMessage"
					@cart-accepted="acceptToastMessage"
				/>
			</div>
		</div>
	</div>
</template>

<script lang="ts" setup>
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
</script>
