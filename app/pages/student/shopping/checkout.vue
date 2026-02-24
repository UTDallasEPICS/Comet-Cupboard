<template>
	<UContainer class="py-8">
		<header>
			<SharedTextPageTitle>Shopping Checkout</SharedTextPageTitle>
		</header>

		<section class="mt-4">
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
									I assume any and all risks associated with consuming the items I have selected from the Comet Cupboard. I agree to release
									UT Dallas from liability if I sustain any health or medical issues as a result of consuming foods taken from the Comet
									Cupboard. I understand that the Comet Cupboard distributes products that may contain nuts or have been processed in plants
									that use peanuts and/or tree nuts. I also understand that some of Comet Cupboard items may conflict with my allergies or
									dietary restrictions.
								</SharedTextBase>
							</UCard>
							<UCard variant="outline" class="border-final-soft-border shadow-md">
								<template #header>
									<SharedTextCardTitle>Non-Discrimination Clause</SharedTextCardTitle>
								</template>
								<SharedTextBase>
									UTD Comet Cupboard does not and shall not discriminate on the basis of race, color, religion (creed), gender, gender
									expression, age, national origin (ancestry), disability, marital status, sexual orientation, or military status, in any of
									its activities or operations.
								</SharedTextBase>
							</UCard>
							<div class="flex flex-row justify-between gap-4">
								<SharedButtonCancel text="Back" @click="goToShopping" />
								<SharedButtonPositiveAction text="Next" @click="incrementStepper" />
							</div>
						</div>
					</template>

					<template #AdjustCounts>
						<USeparator class="mb-4" />
						<div class="flex flex-col gap-4">
							<ul class="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
								<li v-for="cartItem in cartItems" :key="cartItem.itemID">
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

						<p>{{ countAdjustments }}</p>
						<div class="flex flex-row justify-between gap-4">
							<SharedButtonCancel text="Back" @click="decrementStepper" />
							<SharedButtonPositiveAction text="Confirm and Submit Cart" @click="submitCart" />
						</div>
					</template>

					<template #Verification>
						<USeparator class="mb-4" />

						<p>Pretend there is a shopping cart that is pending here</p>
						<SharedButtonCancel text="Cancel" @click="cancelCart" />
					</template>

					<template #Confirmation>
						<USeparator class="mb-4" />

						<template v-if="cartRejected">
							<UCard variant="outline">
								<template #header>
									<p class="">Status: <span class="text-final-negative-red">Rejected</span></p>
								</template>
								<p>Reason: {{ cartVerificationReason }}</p>
							</UCard>
							<SharedButtonCancel text="Back to Shopping" @click="goToShopping" />
						</template>
						<template v-else>
							<UCard variant="outline">
								<template #header>
									<p class="">Status: <span class="text-final-utd-green">Accepted</span></p>
								</template>
								<p>Reason: {{ cartVerificationReason }}</p>
							</UCard>
						</template>
					</template>
				</UStepper>
			</div>
		</section>
	</UContainer>
</template>

<script setup lang="ts">
import type { StepperItem } from "@nuxt/ui"
import { breakpointsTailwind, useBreakpoints } from "@vueuse/core"

const smaller = computed(() => {
	return useBreakpoints(breakpointsTailwind).smaller("sm").value
})

const items: StepperItem[] = [
	{
		slot: "Disclosures" as const,
		title: "Disclosures",
		icon: "mdi:file-document-check",
	},
	{
		slot: "AdjustCounts" as const,
		title: "Adjust Counts",
		icon: "i-heroicons-pencil-square",
	},
	{
		slot: "ReviewCart" as const,
		title: "Review Cart",
		icon: "i-heroicons-shopping-cart",
	},

	{
		slot: "Verification" as const,
		title: "Pending Verification",
		icon: "material-symbols:check-circle-outline",
	},
	{
		slot: "Confirmation" as const,
		title: "Confirmation",
		icon: "material-symbols:check-circle",
	},
]

const active = ref(0)
const cartRejected = ref(false)
const cartVerificationReason = ref("")
const store = useCartStore()
const { getCart } = store
const { cartItems } = storeToRefs(store)

const { onEvent } = useStudentEventStream()

const unsubscribe = onEvent((event) => {
	switch (event.type) {
		case "cart.verification.accepted": {
			cartVerificationReason.value = event.payload.reason || "No reason provided."
			active.value = 4
			cartRejected.value = false
			break
		}
		case "cart.verification.rejected": {
			cartVerificationReason.value = event.payload.reason || "No reason provided."
			active.value = 4
			cartRejected.value = true
			break
		}
	}
})

const countAdjustments = ref<Record<string, number>>({})

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
	if (cartItems.value.length === 0) {
		return
	}

	const allCartItemAdjustments = cartItems.value.map((cartItem) => {
		return {
			itemID: cartItem.itemID,
			countAdjustment: -1 * countAdjustments.value[cartItem.itemID] || 0,
		}
	})

	// send the cart to verification
	await $fetch("/api/student/verification/cartRequestVerification", {
		method: "POST",
		body: {
			adjustments: allCartItemAdjustments,
		},
	})
	incrementStepper()
}

const cancelCart = async () => {
	await $fetch("/api/student/verification/retractCart", { method: "PUT" })
	decrementStepper()
}
</script>
