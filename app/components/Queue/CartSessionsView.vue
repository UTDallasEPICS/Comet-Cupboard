<template>
	<UCard>
		<template #header>
			<SharedTextSectionTitle> Cart Sessions </SharedTextSectionTitle>
		</template>
		<UTable :data="cartSessions" :columns="tableColumns" empty="No cart sessions currently available" />
	</UCard>
</template>

<script lang="ts" setup>
const cartSessionsStore = useCartSessionsStore()
const { cartSessions } = storeToRefs(cartSessionsStore)
const { getCartSessions } = cartSessionsStore

const UButton = resolveComponent("UButton")
const UCheckbox = resolveComponent("UCheckbox")
const UDropdownMenu = resolveComponent("UDropdownMenu")

const columnsDef = [{ header: "Cart ID", accessorKey: "cartID", type: "text" }]
const tableColumns = buildNuxtUITable(columnsDef, { UButton, UCheckbox, UDropdownMenu })

onMounted(async () => {
	await getCartSessions()
})
</script>
