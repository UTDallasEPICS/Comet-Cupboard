<template>
	<UCard>
		<SharedTextSectionTitle> Cart Sessions </SharedTextSectionTitle>
		<div v-for="cart in cartSessionsStore.cartSessions" :key="cart.publicCode" class="mt-4">
			<div class="flex flex-row items-center">
				<UUser :name="cart.publicCode" :avatar="{ icon: cart.publicIcon }" size="xl" />
			</div>
		</div>
	</UCard>
</template>

<script lang="ts" setup>
const cartSessionsStore = useCartSessionsStore()

onMounted(async () => {
	await cartSessionsStore.getCartSessions()
})
</script>
