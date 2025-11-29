<template>
	<div class="min-h-screen bg-gray-100 font-montserrat flex justify-center pt-12 pb-12 px-4">
		<div class="w-full max-w-[320px] relative">
			<!-- orange banner -->
			<V2ShoppingOrangeBanner title="Pending Cart" :topOffset="80" />

			<!-- checkout flow  -->
			<div ref="checkoutRef" class="w-full flex justify-center mt--100" :style="{ height: checkoutHeight + 'px' }">
				<V2ShoppingCheckoutFlow class="w-full" :ellipseColors="ellipseColors" />
			</div>

			<!-- cart items list -->
			<div class="flex flex-col gap-3 w-full mt-3">
				<div v-for="(item, index) in cart" :key="index" class="relative w-full h-[80px] bg-white overflow-hidden rounded-lg shadow font-montserrat">
					<PhotoIcon class="absolute left-[13px] top-[14px] w-[60px] h-[60px] text-gray-400 border border-gray-300 rounded p-2" />

					<!-- item name -->
					<div class="absolute left-[100px] top-0 right-[70px] h-full flex items-center">
						<span class="text-black text-[15px] font-medium w-full">{{ item.name }}</span>
					</div>

					<!-- quantities -->
					<div
						class="absolute right-2 top-0 h-full w-[50px] flex flex-col gap-[4px] items-end"
						:class="item.qty2 > 0 ? 'justify-start pt-[16px]' : 'justify-center'"
					>
						<!-- total quantity -->
						<div class="w-full h-[30px] bg-gray-200/30 text-center text-[18px] font-medium text-black rounded flex items-center justify-center">
							{{ item.qty }}
						</div>

						<!-- expired quantity  if >0 -->
						<div v-if="item.qty2 > 0" class="flex items-center gap-2">
							<span class="text-red-600 text-[12px] leading-[14px] font-bold">Expired</span>
							<div
								class="w-[42px] h-[24px] bg-gray-200/30 text-center text-[16px] font-medium text-black rounded flex items-center justify-center"
							>
								{{ item.qty2 }}
							</div>
						</div>
					</div>
				</div>

				<!-- if no items -->
				<div v-if="cart.length === 0" class="text-center text-gray-500 mt-4">No pending items</div>
			</div>

			<!-- checkoutCount summary -->
			<div class="w-full max-w-[320px] flex justify-end mt-6 mb-2">
				<div class="w-full flex justify-end"></div>
				<V2ShoppingCheckoutCount
					:totalQty="totalQty"
					:adjustedQty="adjustedQty"
					:checked="hasExpiredItems"
					:header-gap="headerGap"
					:row-gap="rowGap"
					:label-width="labelWidth"
				/>
			</div>

			<!-- CANCEL BUTTON — same style as Submit button -->
			<div class="flex gap-4 absolute bottom-20 left-1/2 -translate-x-1/2">
				<V2ShoppingBasicButton
					label="Cancel"
					color="#9CA3AF"
					:top="90"
					:left="-75"
					v
					class="w-[120px] h-[40px] mb-2"
					@click="showCancelConfirm = true"
				/>
			</div>

			<div class="flex gap-4 absolute bottom-20 left-1/2 -translate-x-1/2">
				<V2ShoppingBasicButton label="Reject Cart" color="#EF4444" :top="200" :left="0" @click="rejectCart" />
				<V2ShoppingBasicButton label="Accept Cart" color="#154734" :top="150" :left="0" @click="acceptCart" />
			</div>

			<!-- cancel confirmation popup -->
			<div v-if="showCancelConfirm" class="fixed inset-0 flex items-center justify-center z-50 bg-black/40">
				<div class="bg-white p-6 rounded-xl w-[280px] text-center shadow-[0_4px_20px_rgba(0,0,0,0.5)]">
					<p class="text-black font-bold mb-4">Are you sure you want to cancel?</p>
					<div class="flex justify-around gap-4">
						<V2ShoppingBasicButton
							label="Cancel"
							color="#9CA3AF"
							:top="0"
							:left="0"
							class="!relative !w-[110px] !h-[40px]"
							@click="confirmCancel"
						/>
						<V2ShoppingBasicButton
							label="Stay"
							color="#154734"
							:top="0"
							:left="0"
							class="!relative !w-[110px] !h-[40px]"
							@click="showCancelConfirm = false"
						/>
					</div>
				</div>
			</div>
		</div>
	</div>
</template>

<script setup>
import { ref, onMounted, watch } from "vue"
import { PhotoIcon } from "@heroicons/vue/24/solid"

const router = useRouter()

//cart data
const cart = ref([])
const totalQty = ref(0)
const adjustedQty = ref(0)
const hasExpiredItems = ref(false)

// chekcout flow colors
const checkoutHeight = 50
const ellipseColors = ["#154734", "#E87500", "#4A4A4A"]

// layout props
const headerGap = 12
const rowGap = 12
const labelWidth = 100

// cancel popup state
const showCancelConfirm = ref(false)
watch(showCancelConfirm, (val) => {
	document.body.style.overflow = val ? "hidden" : ""
})

// cancel / reject / accept actions

const confirmCancel = async () => await navigateTo("/v2/shopping")
const rejectCart = async () => await navigateTo({ path: "rejected" })
const acceptCart = async () => await navigateTo({ path: "accepted" })

onMounted(() => {
	const savedCart = localStorage.getItem("submittedCart")
	const rawCart = savedCart ? JSON.parse(savedCart) : []
	document.body.style.overflow = ""
	// map to PendingCart format
	cart.value = rawCart.map((i) => ({
		name: i.Item.name,
		qty: i.count,
		qty2: i.expiredCount || 0,
		badge: i.Item.badge,
		quantity: i.Item.quantity,
		countsAs: i.Item.countsAs,
	}))

	// compute totals
	totalQty.value = cart.value.reduce((sum, i) => sum + (i.qty || 0), 0)
	adjustedQty.value = cart.value.reduce((sum, i) => {
		const effective = (i.qty || 0) - (i.qty2 || 0)
		return sum + effective
	}, 0)

	hasExpiredItems.value = cart.value.some((i) => i.qty2 > 0)
})
</script>

<style scoped>
@import url("https://fonts.googleapis.com/css2?family=Montserrat:wght@400;500;700&display=swap");
.font-montserrat {
	font-family: "Montserrat", sans-serif;
}
</style>
