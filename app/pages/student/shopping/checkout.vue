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
								icon="i-lucide-info"
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
									<SharedButtonActionButton action="cancel" text="Back" leading-icon="i-lucide-arrow-left" @click="goToShopping" />
									<SharedButtonActionButton action="positive" text="I Agree" leading-icon="i-lucide-check" @click="incrementStepper" />
								</div>
							</div>
						</template>

						<template #EditCart>
							<USeparator class="mb-4" />
							<UAlert
								title="Please adjust counts per expired, damaged, or overstocked items."
								icon="i-lucide-info"
								color="neutral"
								variant="outline"
							/>
							<SharedWarningsList
								v-if="pendingCartWarnings(combineCartAndTemporaryAdjustments).length > 0"
								:warnings="pendingCartWarnings(combineCartAndTemporaryAdjustments)"
								class="mt-4"
								@navigate="scrollToCartWarning"
							/>
							<div class="mt-4 flex flex-col gap-4">
								<SharedLayoutGroupedCollapsible
									v-model:open-groups="openCartGroups"
									:groups="groupedCartItems"
									:get-key="(item) => item.itemID"
									:default-open="true"
								>
									<template #header="{ group, open }">
										<div class="flex flex-col gap-2">
											<SharedButtonActionButton
												action="positive"
												:text="group"
												trailing-icon="i-lucide-chevron-down"
												block
												class="group w-full rounded-lg"
												:ui="{
													trailingIcon: open ? 'rotate-180 transition-transform duration-200' : 'transition-transform duration-200',
												}"
											/>
										</div>
									</template>

									<template #item="{ item }">
										<DomainCardShoppingCartAdjustCountItemCard
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
									<SharedButtonActionButton action="cancel" text="Back" leading-icon="i-lucide-arrow-left" @click="decrementStepper" />
									<SharedButtonActionButton action="positive" text="Next" trailing-icon="i-lucide-arrow-right" @click="incrementStepper" />
								</div>
							</div>
						</template>

						<template #ReviewCart>
							<USeparator class="mb-4" />

							<UAlert
								title="Review your cart one last time before submitting for verification."
								icon="i-lucide-info"
								color="neutral"
								variant="outline"
							/>

							<SharedWarningsList
								v-if="pendingCartWarnings(combineCartAndTemporaryAdjustments).length > 0"
								:warnings="pendingCartWarnings(combineCartAndTemporaryAdjustments)"
								class="mt-4"
								@navigate="scrollToCartWarning"
							/>
							<div class="mt-4 flex flex-col gap-4">
								<SharedLayoutGroupedCollapsible
									v-model:open-groups="openCartGroups"
									:groups="groupedCartItems"
									:get-key="(item) => item.itemID"
									:default-open="true"
								>
									<template #header="{ group, open }">
										<div class="flex flex-col gap-2">
											<SharedButtonActionButton
												action="positive"
												:text="group"
												trailing-icon="i-lucide-chevron-down"
												block
												class="group w-full rounded-lg"
												:ui="{
													trailingIcon: open ? 'rotate-180 transition-transform duration-200' : 'transition-transform duration-200',
												}"
											/>
										</div>
									</template>

									<template #item="{ item }">
										<DomainCardShoppingCartReviewItemCard
											class="w-full"
											:item-deal="item.itemDeal"
											:name="item.name"
											:specific-items="item.specificItems"
											:item-final-count="itemFinalCounts[item.itemID] ?? 0"
										/>
									</template>
								</SharedLayoutGroupedCollapsible>
								<div class="flex flex-row justify-between gap-4">
									<SharedButtonActionButton action="cancel" text="Back" leading-icon="i-lucide-arrow-left" @click="decrementStepper" />
									<SharedButtonActionButton action="positive" text="Submit Cart" leading-icon="i-lucide-check" @click="submitCart" />
								</div>
							</div>
						</template>

						<template #Verifying>
							<USeparator class="mb-4" />

							<UAlert
								title="Your cart has been submitted and is awaiting verification. A staff member will review the items and finalize your request."
								icon="i-lucide-info"
								color="neutral"
								variant="outline"
							/>
							<UProgress :indeterminate="true" class="mt-4" />

							<div class="mt-4 flex flex-col gap-4">
								<SharedLayoutGroupedCollapsible :groups="groupedCartItems" :get-key="(item) => item.itemID" :default-open="true">
									<template #header="{ group, open }">
										<div class="flex flex-col gap-2">
											<SharedButtonActionButton
												action="positive"
												:text="group"
												trailing-icon="i-lucide-chevron-down"
												block
												class="group w-full rounded-lg"
												:ui="{
													trailingIcon: open ? 'rotate-180 transition-transform duration-200' : 'transition-transform duration-200',
												}"
											/>
										</div>
									</template>

									<template #item="{ item }">
										<DomainCardShoppingCartReviewItemCard
											class="w-full"
											:item-deal="item.itemDeal"
											:name="item.name"
											:specific-items="item.specificItems"
											:item-final-count="itemFinalCounts[item.itemID] ?? 0"
										/>
									</template>
								</SharedLayoutGroupedCollapsible>
								<div class="flex flex-row justify-center gap-4">
									<SharedButtonActionButton action="cancel" text="Cancel Request" @click="cancelCart" />
								</div>
							</div>
						</template>

						<template #Confirmed>
							<USeparator class="mb-4" />

							<SharedLayoutSectionUCard title="Cart Verification Result" class="w-full">
								<div class="flex flex-col items-center gap-6 py-4">
									<div class="text-center">
										<SharedTextBase class="text-xl font-semibold">
											Cart <span :class="verificationResult.textClass">{{ verificationResult.status }}</span>
										</SharedTextBase>

										<SharedTextBaseSecondary class="mt-2">{{ verificationResult.description }}</SharedTextBaseSecondary>
									</div>

									<UAlert
										v-if="cartVerificationReason"
										icon="i-lucide-info"
										title="Volunteer Message"
										:description="cartVerificationReason"
										color="neutral"
										variant="subtle"
										class="w-full max-w-2xl"
									/>

									<SharedButtonActionButton
										action="navigate-to"
										:text="verificationResult.actionText"
										leading-icon="i-lucide-arrow-left"
										class="w-48"
										:to="verificationResult.actionTo"
									/>
								</div>
							</SharedLayoutSectionUCard>
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
		icon: "i-lucide-file-text",
	},
	{
		slot: "EditCart" as const,
		title: "Edit Cart",
		icon: "i-lucide-edit",
	},
	{
		slot: "ReviewCart" as const,
		title: "Review Cart",
		icon: "i-lucide-shopping-cart",
	},
	{
		slot: "Verifying" as const,
		title: "Verifying",
		icon: "i-lucide-hourglass",
	},
	{
		slot: "Confirmed" as const,
		title: "Confirmed",
		icon: "i-lucide-check-circle",
	},
]

const active = ref(0)
const cartRejected = ref(false)
const cartVerificationReason = ref("")
const cartStore = useCartStore()

const verificationResult = computed(() => {
	if (cartRejected.value) {
		return {
			status: "Rejected",
			description: "Your cart was not approved. Please review the reason, make any necessary adjustments, and resubmit.",
			iconBackgroundClass: "bg-red-100",
			textClass: "text-negative-red",
			actionText: "Back to Shopping",
			actionTo: "/student/shopping",
		}
	}

	return {
		status: "Accepted",
		description: "Your cart has been approved and is ready to go.",
		iconBackgroundClass: "bg-green-100",
		textClass: "text-utd-green",
		actionText: "Back to Dashboard",
		actionTo: "/student",
	}
})

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

const openCartGroups = ref<Record<string, boolean>>({})

const scrollToCartWarning = async (link: { categoryName: string; itemID?: string }) => {
	openCartGroups.value = { ...openCartGroups.value, [link.categoryName]: true }
	await nextTick()
	const targetID = link.itemID ? `cart-item-${link.itemID}` : `cart-group-${slugify(link.categoryName)}`
	document.getElementById(targetID)?.scrollIntoView({ behavior: "smooth", block: "center" })
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
