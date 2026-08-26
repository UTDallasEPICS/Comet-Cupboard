<template>
	<SharedLayoutSectionUCard title="Pending Carts">
		<SharedLayoutGrid v-if="pendingCarts.length !== 0" :columns="1">
			<li v-for="pendingCart in pendingCarts" :key="pendingCart.publicCode">
				<DomainCardVerifyCartPendingUserCard
					:public-code="pendingCart.publicCode"
					:public-icon="pendingCart.publicIcon"
					:selected="selectedCart === pendingCart.publicCode"
					@select="emit('update:select-cart', $event)"
				/>
			</li>
		</SharedLayoutGrid>
		<SharedTextBase v-else class="block text-center"> No pending carts found </SharedTextBase>
	</SharedLayoutSectionUCard>
</template>

<script lang="ts" setup>
interface PendingCart {
	publicCode: string
	publicIcon: string
}

defineProps<{
	selectedCart: string
	pendingCarts: PendingCart[]
}>()

const emit = defineEmits<{
	(event: "update:select-cart", publicCode: string): void
}>()
</script>
