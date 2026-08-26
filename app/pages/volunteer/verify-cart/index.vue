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
						<VerifyCartPendingList
							:selected-cart="currentPublicCodePreview"
							:pending-carts="pendingCarts ?? []"
							@update:select-cart="setPublicCodePreview"
						/>
					</div>
					<VerifyCartPreview
						:class="(currentPublicCodePreview === '' ? 'invisible hidden' : 'visible') + ' md:visible md:flex md:flex-col'"
						:public-code="currentPublicCodePreview"
						:cart="previewCart"
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

interface PendingCart {
	publicCode: string
	publicIcon: string
}

const currentPublicCodePreview = ref("")

const { data: fetchedPendingCarts } = await useFetch<PendingCart[]>("/api/volunteer/cart/carts", {
	query: { pending: "true" },
})

const pendingCarts = ref<PendingCart[]>(fetchedPendingCarts.value ?? [])

const { onEvent } = useVolunteerEventStream()

const unsubscribe = onEvent((event) => {
	switch (event.type) {
		case "verifyCartList.cart.added": {
			const { cart } = event.payload
			if (!pendingCarts.value.some((pendingCart) => pendingCart.publicCode === cart.publicCode)) {
				pendingCarts.value.push(cart)
			}
			break
		}
		case "verifyCartList.cart.removed": {
			removePendingCart(event.payload.publicCode)
			break
		}
	}
})

onBeforeUnmount(() => {
	unsubscribe()
})

const { data: previewCart } = await useAsyncData(
	"pending-cart",
	async () => {
		if (!currentPublicCodePreview.value) {
			return null
		}

		return await $fetch("/api/volunteer/verification/pendingCart", {
			query: {
				publicCode: currentPublicCodePreview.value,
			},
		})
	},
	{
		watch: [currentPublicCodePreview],
	}
)

const setPublicCodePreview = (publicCode: string) => {
	currentPublicCodePreview.value = currentPublicCodePreview.value === publicCode ? "" : publicCode
}

const removePendingCart = (publicCode: string) => {
	pendingCarts.value = pendingCarts.value.filter((cart) => cart.publicCode !== publicCode)

	if (currentPublicCodePreview.value === publicCode) {
		currentPublicCodePreview.value = ""
	}
}

const declineCart = async (publicCode: string, reason: string) => {
	await $fetch("/api/volunteer/verification/cartVerificationAction", {
		method: "POST",
		body: {
			publicCode,
			action: "REJECT",
			reason,
		},
	})

	removePendingCart(publicCode)
}

const acceptCart = async (publicCode: string, reason: string) => {
	await $fetch("/api/volunteer/verification/cartVerificationAction", {
		method: "POST",
		body: {
			publicCode,
			action: "ACCEPT",
			reason,
		},
	})

	removePendingCart(publicCode)
}
</script>
