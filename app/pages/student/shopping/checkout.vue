<template>
	<div>
		<NuxtLayout name="main" title="Shopping Checkout">
			<section>
				<SharedTextSectionTitle class="sr-only">Checkout Content</SharedTextSectionTitle>
				<div class="mx-auto flex w-full flex-col items-center">
					<UStepper
						v-model="active"
						class="w-full"
						:items="items"
						:orientation="`${smaller ? 'vertical' : 'horizontal'}`"
						:disabled="true"
						:ui="{
							trigger: 'border-1',
							separator: 'bg-black',
							root: `${smaller ? 'flex-col' : ''}`,
						}"
					>
						<template #Disclosures>
							<USeparator class="mb-4" />

							<div class="flex flex-col gap-4">
								<UCard variant="outline" class="border-final-soft-border shadow-md">
									<template #header>
										<SharedTextCardTitle>Statement of Understanding</SharedTextCardTitle>
									</template>
									<SharedTextBase>
										I assume any and all risks associated with consuming the items I have selected from the Comet Cupboard. I agree to
										release UT Dallas from liability if I sustain any health or medical issues as a result of consuming foods taken from the
										Comet Cupboard. I understand that the Comet Cupboard distributes products that may contain nuts or have been processed
										in plants that use peanuts and/or tree nuts. I also understand that some of Comet Cupboard items may conflict with my
										allergies or dietary restrictions.
									</SharedTextBase>
								</UCard>
								<UCard variant="outline" class="border-final-soft-border shadow-md">
									<template #header>
										<SharedTextCardTitle>Non-Discrimination Clause</SharedTextCardTitle>
									</template>
									<SharedTextBase>
										UTD Comet Cupboard does not and shall not discriminate on the basis of race, color, religion (creed), gender, gender
										expression, age, national origin (ancestry), disability, marital status, sexual orientation, or military status, in any
										of its activities or operations.
									</SharedTextBase>
								</UCard>
								<div class="flex flex-row justify-between gap-4">
									<SharedButtonCancel text="Back" @click="goToShopping" />
									<SharedButtonPositiveAction text="I Agree" @click="incrementStepper" />
								</div>
							</div>
						</template>

						<template #AdjustCounts>
							<USeparator class="mb-4" />
							<UAlert
								title="Review each item and adjust expired/damaged/overstocked counts before continuing."
								:icon="icons['information']"
								color="neutral"
								variant="outline"
							/>
							<div class="mt-4 flex flex-col gap-4">
								<UAlert
									v-for="warning in pendingCartWarnings(combineCartAndTemporaryAdjustments)"
									:key="warning"
									:icon="icons['warning']"
									color="warning"
									:title="warning"
									class="text-black"
								/>
							</div>
							<div class="mt-4 flex flex-col gap-4">
								<ul class="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
									<li v-for="cartItem in cartStore.cartItems" :key="cartItem.itemID">
										<ShoppingCartAdjustCountItemCard
											:item-deal="
												cartItem.Item.Deal
													? {
															actualCount: cartItem.Item.Deal.actualCount,
															adjustedCount: cartItem.Item.Deal.adjustedCount,
														}
													: {}
											"
											class="w-full"
											:count="cartItem.count"
											:img-name="cartItem.Item.imgName"
											:item-i-d="cartItem.itemID"
											:name="cartItem.Item.name"
											:count-adjustment="countAdjustments[cartItem.itemID] || 0"
											@update:model-value="
												(countAdjustment) => {
													countAdjustments[cartItem.itemID] = countAdjustment
												}
											"
										/>
									</li>
								</ul>
								<div class="flex flex-row justify-between gap-4">
									<SharedButtonCancel text="Back" @click="decrementStepper" />
									<SharedButtonPositiveAction text="Next" @click="incrementStepper" />
								</div>
							</div>
						</template>

						<template #ReviewCart>
							<USeparator class="mb-4" />

							<UAlert
								title="Review your cart one last time before submitting for verification."
								:icon="icons['information']"
								color="neutral"
								variant="outline"
							/>

							<div class="mt-4 flex flex-col gap-4">
								<UAlert
									v-for="warning in pendingCartWarnings(combineCartAndTemporaryAdjustments)"
									:key="warning"
									:icon="icons['warning']"
									color="warning"
									:title="warning"
									class="text-black"
								/>
							</div>
							<div class="mt-4 flex flex-col gap-4">
								<ul class="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
									<li v-for="cartItem in cartStore.cartItems" :key="cartItem.itemID">
										<ShoppingCartReviewItemCard
											:item-deal="
												cartItem.Item.Deal
													? {
															actualCount: cartItem.Item.Deal.actualCount,
															adjustedCount: cartItem.Item.Deal.adjustedCount,
														}
													: {}
											"
											class="w-full"
											:count="cartItem.count"
											:img-name="cartItem.Item.imgName"
											:item-i-d="cartItem.itemID"
											:name="cartItem.Item.name"
											:count-adjustment="countAdjustments[cartItem.itemID] || 0"
										/>
									</li>
								</ul>
								<div class="flex flex-row justify-between gap-4">
									<SharedButtonCancel text="Back" @click="decrementStepper" />
									<SharedButtonPositiveAction text="Confirm and Submit Cart" @click="submitCart" />
								</div>
							</div>
						</template>

						<template #Verification>
							<USeparator class="m4-6" />

							<UAlert
								title="Your cart has been submitted and is awaiting verification. A staff member will review the items and finalize your request."
								:icon="icons['information']"
								color="neutral"
								variant="outline"
							/>

							<div class="mt-4 flex flex-col gap-4">
								<ul class="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
									<li v-for="cartItem in cartStore.cartItems" :key="cartItem.itemID">
										<ShoppingCartReviewItemCard
											:item-deal="
												cartItem.Item.Deal
													? {
															actualCount: cartItem.Item.Deal.actualCount,
															adjustedCount: cartItem.Item.Deal.adjustedCount,
														}
													: {}
											"
											class="w-full"
											:count="cartItem.count"
											:img-name="cartItem.Item.imgName"
											:item-i-d="cartItem.itemID"
											:name="cartItem.Item.name"
											:count-adjustment="cartItem.countAdjustment"
										/>
									</li>
								</ul>
								<div class="flex flex-row justify-start gap-4">
									<SharedButtonCancel text="Cancel Request" @click="cancelCart" />
								</div>
							</div>
						</template>

						<template #Confirmation>
							<USeparator class="mb-4" />

							<template v-if="cartRejected">
								<UCard variant="outline">
									<template #header>
										<p class="">Status: <span class="text-negative-red">Rejected</span></p>
									</template>
									<p>Reason: {{ cartVerificationReason }}</p>
								</UCard>
								<SharedButtonCancel text="Back to Shopping" @click="goToShopping" />
							</template>
							<template v-else>
								<UCard variant="outline">
									<template #header>
										<p class="">Status: <span class="text-utd-green">Accepted</span></p>
									</template>
									<p>Reason: {{ cartVerificationReason }}</p>
								</UCard>
								<div class="flex flex-row justify-end">
									<SharedButtonPositiveAction text="Back to Dashboard" @click="navigateTo('/student')" />
								</div>
							</template>
						</template>
					</UStepper>
				</div>
			</section>
		</NuxtLayout>
	</div>
</template>

<script setup lang="ts">
import type { StepperItem } from "@nuxt/ui"
import { breakpointsTailwind, useBreakpoints } from "@vueuse/core"

definePageMeta({ layout: false })

const smaller = computed(() => {
	return useBreakpoints(breakpointsTailwind).smaller("sm").value
})

const items: StepperItem[] = [
	{
		slot: "Disclosures" as const,
		title: "Disclosures",
		icon: icons["disclosures"],
	},
	{
		slot: "AdjustCounts" as const,
		title: "Adjust Counts",
		icon: icons["edit"],
	},
	{
		slot: "ReviewCart" as const,
		title: "Review Cart",
		icon: icons["shopping"],
	},
	{
		slot: "Verification" as const,
		title: "Pending Verification",
		icon: icons["pending"],
	},
	{
		slot: "Confirmation" as const,
		title: "Confirmation",
		icon: icons["confirmation"],
	},
]

const active = ref(0)
const cartRejected = ref(false)
const cartVerificationReason = ref("")
const cartStore = useCartStore()

const { onEvent } = useStudentEventStream()

onMounted(async () => {
	await cartStore.getCart()
	if (cartStore.pending) {
		active.value = 3
	}
})

const unsubscribe = onEvent(async (event) => {
	switch (event.type) {
		case "cart.verification.decision": {
			cartVerificationReason.value = event.payload.reason || "No reason provided."
			active.value = 4
			cartRejected.value = event.payload.decision === "ACCEPT" ? false : true
			await cartStore.getCart()
			break
		}
	}
})

const countAdjustments = ref<Record<string, number>>({})

const combineCartAndTemporaryAdjustments = computed(() => {
	return {
		CartItems: cartStore.cartItems.map((cartItem) => {
			const adjustment = countAdjustments.value[cartItem.itemID] || 0
			return {
				...cartItem,
				countAdjustment: adjustment,
			}
		}),
	}
})

onBeforeUnmount(() => {
	unsubscribe()
})

const goToShopping = async () => {
	await navigateTo("/student/shopping")
}

const decrementStepper = () => {
	active.value--
}

const incrementStepper = () => {
	active.value++
}

const submitCart = async () => {
	if (cartStore.cartItems.length === 0) {
		return
	}

	const allCartItemAdjustments = cartStore.cartItems.map((cartItem) => {
		return {
			itemID: cartItem.itemID,
			countAdjustment: countAdjustments.value[cartItem.itemID] || 0,
		}
	})

	// send the cart to verification
	await $fetch("/api/student/verification/cartRequestVerification", {
		method: "POST",
		body: {
			adjustments: allCartItemAdjustments,
		},
	})
	await cartStore.getCart() // refresh cart to get updated counts and lock the cart
	incrementStepper()
}

const cancelCart = async () => {
	await $fetch("/api/student/verification/retractCart", { method: "PUT" })
	decrementStepper()
}
</script>
