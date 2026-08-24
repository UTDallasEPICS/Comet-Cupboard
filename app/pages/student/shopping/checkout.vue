<template>
	<div>
		<NuxtLayout name="main" title="Shopping Checkout">
			<section>
				<div class="mx-auto flex w-full flex-col items-center">
					<UStepper
						v-model="active"
						class="w-full"
						:items="items"
						orientation="horizontal"
						:disabled="true"
						:ui="{
							trigger: 'border-1',
							separator: 'bg-black',
							root: `${smaller ? 'flex-col' : ''}`,
						}"
					>
						<template #Disclosures>
							<USeparator class="mb-4" />
							<UAlert
								title="Please read the following disclosures before proceeding to checkout."
								:icon="icons['information']"
								color="neutral"
								variant="outline"
							/>
							<div class="mt-4 flex flex-col gap-4">
								<UCard class="h-64 overflow-y-scroll">
									<SharedTextCardTitle>Statement of Understanding</SharedTextCardTitle>
									<USeparator class="my-2" />
									<SharedTextBase>
										I assume any and all risks associated with consuming the items I have selected from the Comet Cupboard. I agree to
										release UT Dallas from liability if I sustain any health or medical issues as a result of consuming foods taken from the
										Comet Cupboard. I understand that the Comet Cupboard distributes products that may contain nuts or have been processed
										in plants that use peanuts and/or tree nuts. I also understand that some of Comet Cupboard items may conflict with my
										allergies or dietary restrictions.
									</SharedTextBase>
								</UCard>
								<UCard class="h-64 overflow-y-scroll">
									<SharedTextCardTitle>Non-Discrimination Clause</SharedTextCardTitle>
									<USeparator class="my-2" />
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

						<template #EditCart>
							<USeparator class="mb-4" />
							<UAlert
								title="Please adjust counts per expired, damaged, or overstocked items."
								:icon="icons['information']"
								color="neutral"
								variant="outline"
							/>
							<SharedWarningsList
								v-if="pendingCartWarnings(combineCartAndTemporaryAdjustments).length > 0"
								:warnings="pendingCartWarnings(combineCartAndTemporaryAdjustments)"
								class="mt-4"
							/>
							<div class="mt-4 flex flex-col gap-4">
								<SharedLayoutGroupedCollapsible :groups="groupedCartItems" :get-key="(item) => item.itemID" :default-open="true">
									<template #header="{ group, open }">
										<div class="flex flex-col gap-2">
											<SharedButtonPositiveAction
												:text="group"
												:trailing-icon="icons['chevronDown']"
												block
												class="group w-full rounded-lg"
												:ui="{
													trailingIcon: open ? 'rotate-180 transition-transform duration-200' : 'transition-transform duration-200',
												}"
											/>
										</div>
									</template>

									<template #item="{ item }">
										<ShoppingCartAdjustCountItemCard
											class="w-full"
											:item-deal="item.itemDeal"
											:name="item.name"
											:specific-items="item.specificItems"
											:item-final-count="itemFinalCounts[item.itemID] ?? 0"
											@update:adjustment="(specificItemID, countAdjustment) => (countAdjustments[specificItemID] = countAdjustment)"
										/>
									</template>
								</SharedLayoutGroupedCollapsible>

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

							<SharedWarningsList
								v-if="pendingCartWarnings(combineCartAndTemporaryAdjustments).length > 0"
								:warnings="pendingCartWarnings(combineCartAndTemporaryAdjustments)"
								class="mt-4"
							/>
							<div class="mt-4 flex flex-col gap-4">
								<SharedLayoutGroupedCollapsible :groups="groupedCartItems" :get-key="(item) => item.itemID" :default-open="true">
									<template #header="{ group, open }">
										<div class="flex flex-col gap-2">
											<SharedButtonPositiveAction
												:text="group"
												:trailing-icon="icons['chevronDown']"
												block
												class="group w-full rounded-lg"
												:ui="{
													trailingIcon: open ? 'rotate-180 transition-transform duration-200' : 'transition-transform duration-200',
												}"
											/>
										</div>
									</template>

									<template #item="{ item }">
										<ShoppingCartReviewItemCard
											class="w-full"
											:item-deal="item.itemDeal"
											:name="item.name"
											:specific-items="item.specificItems"
											:item-final-count="itemFinalCounts[item.itemID] ?? 0"
										/>
									</template>
								</SharedLayoutGroupedCollapsible>
								<div class="flex flex-row justify-between gap-4">
									<SharedButtonCancel text="Back" @click="decrementStepper" />
									<SharedButtonPositiveAction text="Submit Cart" @click="submitCart" />
								</div>
							</div>
						</template>

						<template #Verifying>
							<USeparator class="mb-4" />

							<UAlert
								title="Your cart has been submitted and is awaiting verification. A staff member will review the items and finalize your request."
								:icon="icons['information']"
								color="neutral"
								variant="outline"
							/>
							<UProgress :indeterminate="true" class="mt-4" />

							<div class="mt-4 flex flex-col gap-4">
								<SharedLayoutGroupedCollapsible :groups="groupedCartItems" :get-key="(item) => item.itemID" :default-open="true">
									<template #header="{ group, open }">
										<div class="flex flex-col gap-2">
											<SharedButtonPositiveAction
												:text="group"
												:trailing-icon="icons['chevronDown']"
												block
												class="group w-full rounded-lg"
												:ui="{
													trailingIcon: open ? 'rotate-180 transition-transform duration-200' : 'transition-transform duration-200',
												}"
											/>
										</div>
									</template>

									<template #item="{ item }">
										<ShoppingCartReviewItemCard
											class="w-full"
											:item-deal="item.itemDeal"
											:name="item.name"
											:specific-items="item.specificItems"
											:item-final-count="itemFinalCounts[item.itemID] ?? 0"
										/>
									</template>
								</SharedLayoutGroupedCollapsible>
								<div class="flex flex-row justify-center gap-4">
									<SharedButtonCancel text="Cancel Request" @click="cancelCart" />
								</div>
							</div>
						</template>

						<template #Confirmed>
							<USeparator class="mb-4" />

							<template v-if="cartRejected">
								<UCard variant="outline">
									<div class="flex flex-col items-center justify-center gap-4">
										<SharedTextBase>Your cart was <span class="text-negative-red">Rejected</span>.</SharedTextBase>
										<SharedTextBase>Volunteer Message: {{ cartVerificationReason }}</SharedTextBase>
										<!-- <img src="/placeholderAsset.png" class="aspect-square w-48" alt="placeholder image" /> -->
									</div>
								</UCard>
								<div class="mt-4 flex flex-row justify-center gap-4">
									<SharedButtonNavigateTo text="Back to Shopping" class="w-48" @click="goToShopping" />
								</div>
							</template>
							<template v-else>
								<UCard variant="outline">
									<div class="flex flex-col items-center justify-center gap-4">
										<SharedTextBase>Your cart was <span class="text-utd-green">Accepted</span>.</SharedTextBase>
										<SharedTextBase>Volunteer Message: {{ cartVerificationReason }}</SharedTextBase>
										<!-- <img src="/placeholderAsset.png" class="aspect-square w-48" alt="placeholder image" /> -->
									</div>
								</UCard>
								<div class="mt-4 flex flex-row justify-center gap-4">
									<SharedButtonNavigateTo text="Back to Dashboard" class="w-48" @click="navigateTo('/student')" />
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
		slot: "EditCart" as const,
		title: "Edit Cart",
		icon: icons["edit"],
	},
	{
		slot: "ReviewCart" as const,
		title: "Review Cart",
		icon: icons["shopping"],
	},
	{
		slot: "Verifying" as const,
		title: "Verifying",
		icon: icons["pending"],
	},
	{
		slot: "Confirmed" as const,
		title: "Confirmed",
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
		cartItems:
			cartStore.categorizedCartItems && Object.keys(cartStore.categorizedCartItems).length > 0
				? Object.values(cartStore.categorizedCartItems)
						.flatMap((items) => items)
						.map((cartItem) => {
							const adjustment = countAdjustments.value[cartItem.specificItemID] || 0
							return {
								...cartItem,
								countAdjustment: adjustment,
							}
						})
				: [],
	}
})

const groupedCartItems = computed<Record<string, any[]>>(() => {
	const categoryGroups = Object.groupBy(
		combineCartAndTemporaryAdjustments.value.cartItems,
		(cartItem: any) => cartItem.specificItem?.item?.category?.categoryName ?? "Uncategorized"
	) as Record<string, any[]>

	return Object.fromEntries(
		Object.entries(categoryGroups).map(([categoryName, categoryCartItems]) => {
			const itemGroups = Object.groupBy(
				categoryCartItems ?? [],
				(cartItem: any) => cartItem.specificItem?.itemID ?? cartItem.specificItem?.item?.itemID
			) as Record<string, any[]>

			return [
				categoryName,
				Object.entries(itemGroups).map(([itemID, itemCartItems]) => {
					const cartItems = itemCartItems ?? []
					const firstCartItem: any = cartItems[0]
					return {
						itemID,
						name: firstCartItem.specificItem.item.itemName,
						itemDeal: firstCartItem.specificItem.item.deal ?? {},
						specificItems: cartItems.map((cartItem: any) => ({
							specificItemID: cartItem.specificItemID,
							productName: cartItem.specificItem.productName,
							imgName: cartItem.specificItem.imgName,
							count: cartItem.count,
							countAdjustment: cartItem.countAdjustment,
						})),
					}
				}),
			]
		})
	)
})

const itemFinalCounts = computed(() => cartItemFinalCounts(combineCartAndTemporaryAdjustments.value))
const itemFinalCount = (cartItem: any) => {
	const itemID = cartItem.specificItem?.itemID ?? cartItem.specificItem?.item?.itemID
	const firstCartItem = combineCartAndTemporaryAdjustments.value.cartItems.find(
		(item: any) => (item.specificItem?.itemID ?? item.specificItem?.item?.itemID) === itemID
	)
	return firstCartItem?.specificItemID === cartItem.specificItemID && itemID ? itemFinalCounts.value[itemID] : undefined
}

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
	if (cartStore.cartIsEmpty) {
		return
	}

	const allCartItemAdjustments =
		cartStore.categorizedCartItems && Object.keys(cartStore.categorizedCartItems).length > 0
			? Object.values(cartStore.categorizedCartItems)
					.flatMap((items) => items)
					.map((cartItem) => {
						return {
							specificItemID: cartItem.specificItemID,
							countAdjustment: countAdjustments.value[cartItem.specificItemID] || 0,
						}
					})
			: []

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
