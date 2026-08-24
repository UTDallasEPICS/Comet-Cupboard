<template>
	<UCard class="min-w-72">
		<template #header>
			<SharedTextCardTitle>Pending Carts</SharedTextCardTitle>
		</template>
		<div>
			<div v-if="pendingPublicCodesAndAdjQTY.length === 0" class="flex grow flex-col items-center justify-center">
				<SharedTextBase class="text-center text-black">No pending carts</SharedTextBase>
				<!-- <img src="/placeholderAsset.png" class="aspect-square w-48" alt="placeholder image" /> -->
			</div>
			<div v-else>
				<UButton
					v-for="pendingCart in pendingPublicCodesAndAdjQTY"
					:key="pendingCart.publicCode"
					variant="ghost"
					class="h-12 w-full"
					@click="emit('update:select-cart', pendingCart.publicCode)"
				>
					<UUser :name="pendingCart.publicCode" :avatar="{ icon: pendingCart.publicIcon }" size="lg" />
				</UButton>
			</div>
		</div>
	</UCard>
</template>

<script lang="ts" setup>
const props = defineProps({
	selectedCart: {
		type: String,
		required: true,
	},
})

const emit = defineEmits(["update:select-cart"])

const { data: pendingCarts } = await useFetch("/api/volunteer/cart/carts", {
	method: "GET",
	query: {
		pending: "true",
	},
})

const pendingCartsList = ref(pendingCarts.value ?? [])

const pendingPublicCodesAndAdjQTY = computed(() => {
	if (!pendingCartsList.value) {
		return []
	}
	return pendingCartsList.value.map((pendingCart) => {
		return { publicCode: pendingCart.publicCode, publicIcon: pendingCart.publicIcon }
	})
})

const { onEvent } = useVolunteerEventStream()

const unsubscribe = onEvent((event) => {
	switch (event.type) {
		case "verifyCartList.cart.added": {
			const { cart } = event.payload
			pendingCartsList.value.push(cart)
			break
		}
		case "verifyCartList.cart.removed": {
			const publicCodeToRemove = event.payload.publicCode
			pendingCartsList.value = pendingCartsList.value.filter((pendingCart) => {
				return pendingCart.publicCode != publicCodeToRemove
			})
			break
		}
	}
})

onBeforeUnmount(() => {
	unsubscribe()
})
</script>
