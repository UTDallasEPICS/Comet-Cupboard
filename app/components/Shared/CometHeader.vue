<template>
	<UHeader
		class="bg-utd-green"
		:toggle="false"
		:ui="{
			container: 'mx-0 w-full max-w-none',
		}"
	>
		<template #left>
			<USlideover
				v-if="permissions['PUBLIC']"
				side="left"
				title="Navigation Menu"
				:overlay="false"
				:ui="{
					content: 'bg-final-page-bg',
					header: 'bg-final-utd-orange',
					title: 'text-white',
					close: 'text-white hover:bg-transparent hover:text-black focus-visible:bg-transparent focus-visible:text-black focus-visible:ring-0 active:bg-transparent',
				}"
				:close="{
					size: 'xl',
				}"
			>
				<UButton
					variant="ghost"
					size="xl"
					icon="ci:hamburger-lg"
					:ui="{
						leadingIcon: 'size-8',
					}"
				/>
				<template #body>
					<div v-if="permissions['SHOPPING']">
						<ULink :to="shoppingPath" class="text-2xl">Shopping</ULink>
						<USeparator :ui="{ border: 'border-black' }" />
					</div>

					<div v-if="permissions['VERIFY_CART']">
						<ULink :to="verifyPath" class="text-2xl">Verify Carts</ULink>
						<USeparator :ui="{ border: 'border-black' }" />
					</div>

					<div v-if="permissions['INVENTORY_MANAGEMENT']">
						<ULink :to="inventoryPath" class="text-2xl">Inventory Management</ULink>
						<USeparator :ui="{ border: 'border-black' }" />
					</div>

					<div v-if="permissions['PUBLIC']">
						<ULink :to="queuePath" class="text-2xl">Queue</ULink>
						<USeparator :ui="{ border: 'border-black' }" />
					</div>

					<div v-if="permissions['ADMIN']">
						<ULink :to="dataPath" class="text-2xl">Data</ULink>
						<USeparator :ui="{ border: 'border-black' }" />
					</div>

					<div v-if="permissions['ADMIN']">
						<ULink :to="sourcePath" class="text-2xl">Manage Sources</ULink>
						<USeparator :ui="{ border: 'border-black' }" />
					</div>

					<div v-if="permissions['ADMIN']">
						<ULink :to="volunteerPath" class="text-2xl">Manage Volunteers</ULink>
						<USeparator :ui="{ border: 'border-black' }" />
					</div>
				</template>
			</USlideover>
			<div class="relative ml-4 overflow-hidden">
				<img src="/CometCupboardLogo1.png" class="h-10" />
			</div>
		</template>

		<template #right>
			<USlideover
				v-if="permissions['PUBLIC']"
				v-model:open="cartView"
				side="right"
				title="Preview Cart"
				:overlay="false"
				:ui="{
					content: 'max-w-112 mt-16 bg-final-page-bg',
					header: 'bg-final-utd-orange',
					title: 'text-white',
					close: 'text-white hover:bg-transparent hover:text-black focus-visible:bg-transparent focus-visible:text-black focus-visible:ring-0 active:bg-transparent',
				}"
				:close="{
					size: 'xl',
				}"
			>
				<UButton variant="ghost" class="hover:bg-transparent focus-visible:ring-0 active:bg-transparent">
					<ShoppingCartIcon :cart-view="cartView" :cart-disabled="false" :cart-total-count="cartTotalCount" />
				</UButton>
				<template #body>
					<ShoppingCartDrawer />
				</template>
			</USlideover>
			<UButton v-if="permissions['PUBLIC']" variant="outline" icon="ci:log-out" size="xl" @click="logout" />
		</template>
	</UHeader>
</template>

<script lang="ts" setup>
interface Permissions {
	SHOPPING?: boolean
	VERIFY_CART?: boolean
	INVENTORY_MANAGEMENT?: boolean
	PUBLIC?: boolean
	ADMIN?: boolean
}

const store = useCartStore()
const { cartView, cartTotalCount } = storeToRefs(store)
const { logout } = useLogout()

const shoppingPath = "/shopping"
const verifyPath = "/verify-cart"
const inventoryPath = "/inventory"
const dataPath = "/v2/data-analytics"
const sourcePath = "/v2/admin/source"
const volunteerPath = "/v2/admin/volunteer"
const queuePath = "/v2/queue"

const accessCookie = ref(useCookie("AccessPermission"))
const permissions = ref<Permissions>(accessCookie.value && typeof accessCookie.value === "object" ? accessCookie.value : {})
</script>
