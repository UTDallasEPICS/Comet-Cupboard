<template>
	<div class="mx-4 flex justify-center">
		<UStepper
			v-model="active"
			class="w-full max-w-200"
			:items="items"
			:disabled="true"
			:ui="{
				trigger: 'border-1',
				separator: 'bg-black',
			}"
		>
			<template #Disclosures>
				<UCard variant="outline">
					<template #header>
						<p class="font-bold">Statement of Understanding</p>
					</template>
					<p>
						I assume any and all risks associated with consuming the items I have selected from the Comet Cupboard. I agree to release UT Dallas
						from liability if I sustain any health or medical issues as a result of consuming foods taken from the Comet Cupboard. I understand that
						the Comet Cupboard distributes products that may contain nuts or have been processed in plants that use peanuts and/or tree nuts. I also
						understand that some of Comet Cupboard items may conflict with my allergies or dietary restrictions.
					</p>
				</UCard>
				<UCard variant="outline">
					<template #header>
						<p class="font-bold">Non-Discrimination Clause</p>
					</template>
					<p>
						UTD Comet Cupboard does not and shall not discriminate on the basis of race, color, religion (creed), gender, gender expression, age,
						national origin (ancestry), disability, marital status, sexual orientation, or military status, in any of its activities or operations.
					</p>
				</UCard>
				<SharedButtonCancel @click="goToShopping" />
				<SharedButtonConfirm @click="submitCart" />
			</template>

			<template #Verification>
				<p>Pretend there is a shopping cart that is pending here</p>
				<SharedButtonCancel @click="cancelCart" />
			</template>

			<template #Confirmation>
				<template v-if="cartRejected">
					<UCard variant="outline">
						<template #header>
							<p class="font-bold">Status: <span class="text-red-500">Rejected</span></p>
						</template>
						<p>Reason: {{ cartVerificationReason }}</p>
					</UCard>
					<SharedButtonCancel text="Back to Shopping" @click="goToShopping" />
				</template>
				<template v-else>
					<UCard variant="outline">
						<template #header>
							<p class="font-bold">Status: <span class="text-green-600">Accepted</span></p>
						</template>
						<p>Reason: {{ cartVerificationReason }}</p>
						<p>Logging out in {{ countdownTimer }} seconds...</p>
					</UCard>
				</template>
			</template>
		</UStepper>
	</div>
</template>

<script setup lang="ts">
import type { StepperItem } from "@nuxt/ui"

const items: StepperItem[] = [
	{
		slot: "Disclosures" as const,
		title: "Disclosures",
		icon: "mdi:file-document-check",
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
const { logout } = useLogout()

let verificationUpdate: EventSource | null = null

onMounted(async () => {
	const config = useRuntimeConfig()
	verificationUpdate = new EventSource(`${config.public.LOCAL_URL}api/verification/cartRequestVerificationResponseWaiting`)

	verificationUpdate.onmessage = async (event) => {
		const raw = event.data

		if (typeof raw !== "string" || !raw.trim().startsWith("{")) return

		let parsed
		try {
			parsed = JSON.parse(raw)
		} catch {
			return
		}

		const { type, payload } = parsed
		if (type === "REJECT CART") {
			cartVerificationReason.value = payload || "No reason provided."
			active.value = 2
			cartRejected.value = true
		} else if (type === "ACCEPT CART") {
			cartVerificationReason.value = payload || "No reason provided."
			active.value = 2
			cartRejected.value = false
			startForceLogoutTimer()
		}
	}
})

onBeforeUnmount(() => {
	if (verificationUpdate) {
		verificationUpdate.close()
		verificationUpdate = null
	}
	stopForceLogoutTimer()
})

const goToShopping = async () => await navigateTo("/shopping")

const submitCart = async () => {
	if (cartItems.value.length === 0) return

	// send the cart to verification
	await $fetch("/api/verification/cartRequestVerification", {
		method: "POST",
	})
	active.value = 1
}

const cancelCart = async () => {
	await $fetch("/api/verification/retractCart", { method: "PUT" })
	active.value = 0
}

const countdownTimer = ref(10)
let forceLogoutInterval: ReturnType<typeof setInterval> | null = null
const startForceLogoutTimer = () => {
	// prevent duplicate timers
	if (forceLogoutInterval) return

	forceLogoutInterval = setInterval(() => {
		if (countdownTimer.value > 1) {
			countdownTimer.value--
		} else {
			stopForceLogoutTimer()
			getCart()
			logout()
		}
	}, 1000)
}

const stopForceLogoutTimer = () => {
	if (forceLogoutInterval) {
		clearInterval(forceLogoutInterval)
		forceLogoutInterval = null
	}
}
</script>
