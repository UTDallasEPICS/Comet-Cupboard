<template>
	<UCard>
		<template #header>
			<SharedTextSectionTitle> Cart Sessions </SharedTextSectionTitle>
		</template>
		<UTable :data="cartSessions" :columns="columns" empty="No cart sessions currently available" />
	</UCard>
</template>

<script lang="ts" setup>
const cartSessionsStore = useCartSessionsStore()
const { cartSessions } = storeToRefs(cartSessionsStore)
const { getCartSessions } = cartSessionsStore

const columns = [{ accessorKey: "cartID", header: "Cart ID" }]

onMounted(async () => {
	await getCartSessions()
})
</script>
