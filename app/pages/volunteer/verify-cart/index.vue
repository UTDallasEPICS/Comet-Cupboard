<template>
	<div>
		<NuxtLayout name="main" title="Verify Carts" :back-navigation="{ text: `Back to Dashboard`, to: `/volunteer` }">
			<USeparator class="my-4" />
			<div class="flex grow">
				<div class="flex grow flex-row flex-wrap justify-center md:my-8 md:flex-nowrap md:justify-normal">
					<div
						:class="(currentPublicCodePreview === '' ? 'visible' : 'invisible hidden') + ' md:visible md:block'"
						class="w-full max-w-100 md:mr-4 lg:mr-12"
					>
						<VerifyCartPendingList :selected-cart="currentPublicCodePreview" @update:select-cart="setPublicCodePreview" />
					</div>
					<VerifyCartPreview
						:class="(currentPublicCodePreview === '' ? 'invisible hidden' : 'visible') + ' md:visible md:flex md:flex-col'"
						:public-code="currentPublicCodePreview"
						@update:select-cart="setPublicCodePreview"
						@cart-declined="declineCart"
						@cart-accepted="acceptCart"
					/>
				</div>
			</div>
		</NuxtLayout>
	</div>
</template>

<script lang="ts" setup>
definePageMeta({ layout: false })

const toast = useToast()

const currentPublicCodePreview = ref<string>("")

const setPublicCodePreview = (publicCode: string) => {
	// deselect cart if already chosen
	if (currentPublicCodePreview.value === publicCode) {
		currentPublicCodePreview.value = ""
	} else {
		currentPublicCodePreview.value = publicCode
	}
}

const resetPublicCodePreview = () => {
	currentPublicCodePreview.value = ""
}

const declineCart = async (publicCode: string, reason: string) => {
	await $fetch("/api/volunteer/verification/cartVerificationAction", {
		method: "POST",
		body: { publicCode, action: "REJECT", reason },
	})
	toast.add({
		title: "Cart Action Status",
		description: `Declined cart for ${publicCode}.`,
	})
	resetPublicCodePreview()
}

const acceptCart = async (publicCode: string, reason: string) => {
	await $fetch("/api/volunteer/verification/cartVerificationAction", {
		method: "POST",
		body: { publicCode, action: "ACCEPT", reason },
	})
	toast.add({
		title: "Cart Action Status",
		description: `Accepted cart for ${publicCode}.`,
	})
	resetPublicCodePreview()
}
</script>
